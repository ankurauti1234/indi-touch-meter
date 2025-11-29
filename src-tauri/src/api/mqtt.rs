use rumqttc::{AsyncClient, Event, EventLoop, MqttOptions, Packet, QoS, TlsConfiguration, Transport};
use rustls::ClientConfig;
use rustls_pemfile::{certs, private_key};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::BufReader;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug, Serialize, Deserialize)]
pub struct MqttConfig {
    pub endpoint: String,
    pub port: u16,
    pub client_id: String,
    pub cert_path: String,
    pub key_path: String,
    pub ca_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MqttMessage {
    pub topic: String,
    pub payload: String,
    pub qos: u8,
}

pub struct MqttManager {
    client: Option<AsyncClient>,
    event_loop: Arc<Mutex<Option<EventLoop>>>,
}

impl MqttManager {
    pub fn new() -> Self {
        Self {
            client: None,
            event_loop: Arc::new(Mutex::new(None)),
        }
    }

    pub async fn connect(&mut self, config: MqttConfig) -> Result<(), String> {
        // Create MQTT options
        let mut mqtt_options = MqttOptions::new(&config.client_id, &config.endpoint, config.port);
        mqtt_options.set_keep_alive(std::time::Duration::from_secs(30));

        // Load certificates
        let client_config = load_tls_config(&config.cert_path, &config.key_path, &config.ca_path)
            .map_err(|e| format!("Failed to load certificates: {}", e))?;

        // Set TLS configuration
        mqtt_options.set_transport(Transport::tls_with_config(TlsConfiguration::Rustls(
            Arc::new(client_config),
        )));

        // Create client and event loop
        let (client, event_loop) = AsyncClient::new(mqtt_options, 10);
        
        self.client = Some(client);
        *self.event_loop.lock().await = Some(event_loop);

        // Start event loop in background
        let event_loop_clone = self.event_loop.clone();
        tokio::spawn(async move {
            let mut event_loop_guard = event_loop_clone.lock().await;
            if let Some(mut event_loop) = event_loop_guard.take() {
                loop {
                    match event_loop.poll().await {
                        Ok(Event::Incoming(Packet::ConnAck(_))) => {
                            println!("Connected to AWS IoT Core");
                        }
                        Ok(_) => {}
                        Err(e) => {
                            eprintln!("MQTT Error: {:?}", e);
                            break;
                        }
                    }
                }
                *event_loop_guard = Some(event_loop);
            }
        });

        // Give it a moment to connect
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        Ok(())
    }

    pub async fn publish(&self, message: MqttMessage) -> Result<(), String> {
        if let Some(client) = &self.client {
            let qos = match message.qos {
                0 => QoS::AtMostOnce,
                1 => QoS::AtLeastOnce,
                2 => QoS::ExactlyOnce,
                _ => QoS::AtLeastOnce,
            };

            client
                .publish(&message.topic, qos, false, message.payload.as_bytes())
                .await
                .map_err(|e| format!("Failed to publish: {}", e))?;

            Ok(())
        } else {
            Err("MQTT client not connected".to_string())
        }
    }

    pub async fn disconnect(&mut self) -> Result<(), String> {
        if let Some(client) = &self.client {
            client
                .disconnect()
                .await
                .map_err(|e| format!("Failed to disconnect: {}", e))?;
            self.client = None;
        }
        Ok(())
    }
}

fn load_tls_config(cert_path: &str, key_path: &str, ca_path: &str) -> Result<ClientConfig, String> {
    // Load client certificate
    let cert_file = File::open(cert_path)
        .map_err(|e| format!("Failed to open cert file: {}", e))?;
    let mut cert_reader = BufReader::new(cert_file);
    let cert_chain: Vec<_> = certs(&mut cert_reader)
        .filter_map(|cert| cert.ok())
        .collect();

    // Load private key
    let key_file = File::open(key_path)
        .map_err(|e| format!("Failed to open key file: {}", e))?;
    let mut key_reader = BufReader::new(key_file);
    let private_key = private_key(&mut key_reader)
        .map_err(|e| format!("Failed to parse key: {}", e))?
        .ok_or("No private key found")?;

    // Load CA certificate
    let ca_file = File::open(ca_path)
        .map_err(|e| format!("Failed to open CA file: {}", e))?;
    let mut ca_reader = BufReader::new(ca_file);
    let ca_certs: Vec<_> = certs(&mut ca_reader)
        .filter_map(|cert| cert.ok())
        .collect();

    // Create root cert store
    let mut root_store = rustls::RootCertStore::empty();
    for cert in ca_certs {
        root_store.add(cert)
            .map_err(|e| format!("Failed to add CA cert: {}", e))?;
    }

    // Build client config
    let config = ClientConfig::builder()
        .with_root_certificates(root_store)
        .with_client_auth_cert(cert_chain, private_key)
        .map_err(|e| format!("Failed to build TLS config: {}", e))?;

    Ok(config)
}

// Tauri commands
use tauri::State;
use tokio::sync::Mutex as TokioMutex;

type MqttState = Arc<TokioMutex<MqttManager>>;

#[tauri::command]
pub async fn mqtt_connect(
    config: MqttConfig,
    state: State<'_, MqttState>,
) -> Result<String, String> {
    let mut manager = state.lock().await;
    manager.connect(config).await?;
    Ok("Connected successfully".to_string())
}

#[tauri::command]
pub async fn mqtt_publish(
    message: MqttMessage,
    state: State<'_, MqttState>,
) -> Result<String, String> {
    let manager = state.lock().await;
    manager.publish(message).await?;
    Ok("Published successfully".to_string())
}

#[tauri::command]
pub async fn mqtt_disconnect(state: State<'_, MqttState>) -> Result<String, String> {
    let mut manager = state.lock().await;
    manager.disconnect().await?;
    Ok("Disconnected successfully".to_string())
}