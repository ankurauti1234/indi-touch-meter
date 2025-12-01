// src/api/mqtt.rs
use rumqttc::{
    AsyncClient, EventLoop, MqttOptions, QoS, TlsConfiguration, Transport,
};
use rustls::{
    client::danger::{HandshakeSignatureValid, ServerCertVerified, ServerCertVerifier},
    ClientConfig, RootCertStore,
};
use rustls_pemfile::{certs, ec_private_keys, pkcs8_private_keys, rsa_private_keys};
use rustls::pki_types::{CertificateDer, PrivateKeyDer};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{BufReader, Seek, SeekFrom};
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::Mutex;

// Fixed: Added Debug + Send + Sync
#[derive(Debug)]
struct NoCertificateVerification;

unsafe impl Send for NoCertificateVerification {}
unsafe impl Sync for NoCertificateVerification {}

impl ServerCertVerifier for NoCertificateVerification {
    fn verify_server_cert(
        &self,
        _end_entity: &CertificateDer<'_>,
        _intermediates: &[CertificateDer<'_>],
        _server_name: &rustls::pki_types::ServerName<'_>,
        _ocsp_response: &[u8],
        _now: rustls::pki_types::UnixTime,
    ) -> Result<ServerCertVerified, rustls::Error> {
        Ok(ServerCertVerified::assertion())
    }

    fn verify_tls12_signature(
        &self,
        _message: &[u8],
        _cert: &CertificateDer<'_>,
        _dss: &rustls::DigitallySignedStruct,
    ) -> Result<HandshakeSignatureValid, rustls::Error> {
        Ok(HandshakeSignatureValid::assertion())
    }

    fn verify_tls13_signature(
        &self,
        _message: &[u8],
        _cert: &CertificateDer<'_>,
        _dss: &rustls::DigitallySignedStruct,
    ) -> Result<HandshakeSignatureValid, rustls::Error> {
        Ok(HandshakeSignatureValid::assertion())
    }

    fn supported_verify_schemes(&self) -> Vec<rustls::SignatureScheme> {
        vec![
            rustls::SignatureScheme::RSA_PKCS1_SHA256,
            rustls::SignatureScheme::ECDSA_NISTP256_SHA256,
            rustls::SignatureScheme::RSA_PSS_SHA256,
        ]
    }
}

#[derive(Serialize, Deserialize)]
pub struct MqttConfig {
    pub endpoint: String,
    pub port: u16,
    pub client_id: String,
    pub cert_path: String,
    pub key_path: String,
    pub ca_path: String,
}

#[derive(Serialize, Deserialize)]
pub struct MqttMessage {
    pub topic: String,
    pub payload: String,
    pub qos: u8,
}

pub struct MqttManager {
    pub client: Option<AsyncClient>,
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
        let mut opts = MqttOptions::new(&config.client_id, &config.endpoint, config.port);
        opts.set_keep_alive(std::time::Duration::from_secs(30));

        let tls_config = load_tls_config(&config.cert_path, &config.key_path, &config.ca_path)?;
        opts.set_transport(Transport::tls_with_config(TlsConfiguration::Rustls(Arc::new(tls_config))));

        let (client, event_loop) = AsyncClient::new(opts, 10);
        self.client = Some(client);
        *self.event_loop.lock().await = Some(event_loop);

        let el = self.event_loop.clone();
        tokio::spawn(async move {
            let mut guard = el.lock().await;
            if let Some(mut ev) = guard.take() {
                loop {
                    if ev.poll().await.is_err() {
                        break;
                    }
                }
                *guard = Some(ev);
            }
        });

        tokio::time::sleep(tokio::time::Duration::from_millis(800)).await;
        Ok(())
    }

    pub async fn publish(&self, msg: MqttMessage) -> Result<(), String> {
        if let Some(client) = &self.client {
            let qos = match msg.qos {
                2 => QoS::ExactlyOnce,
                1 => QoS::AtLeastOnce,
                _ => QoS::AtMostOnce,
            };
            client
                .publish(&msg.topic, qos, false, msg.payload.as_bytes())
                .await
                .map_err(|e| format!("Publish failed: {}", e))?;
            Ok(())
        } else {
            Err("MQTT not connected".into())
        }
    }
}

// Ultimate private key loader — supports ALL AWS IoT key types
fn load_private_key(path: &str) -> Result<PrivateKeyDer<'static>, String> {
    let mut file = File::open(path).map_err(|e| format!("Cannot open key: {}", e))?;
    let mut reader = BufReader::new(&mut file);

    // Try PKCS#8 (most common)
    reader.seek(SeekFrom::Start(0)).map_err(|e| e.to_string())?;
    if let Some(key) = pkcs8_private_keys(&mut reader).next().and_then(|k| k.ok()) {
        return Ok(PrivateKeyDer::Pkcs8(key.into()));
    }

    // Try RSA key
    reader.seek(SeekFrom::Start(0)).map_err(|e| e.to_string())?;
    if let Some(key) = rsa_private_keys(&mut reader).next().and_then(|k| k.ok()) {
        return Ok(PrivateKeyDer::Pkcs1(key.into()));
    }

    // Try EC key (SEC1 format)
    reader.seek(SeekFrom::Start(0)).map_err(|e| e.to_string())?;
    if let Some(key) = ec_private_keys(&mut reader).next().and_then(|k| k.ok()) {
        return Ok(PrivateKeyDer::Sec1(key.into()));
    }

    Err(format!("No valid private key found in {}", path))
}

fn load_tls_config(
    cert_path: &str,
    key_path: &str,
    ca_path: &str,
) -> Result<ClientConfig, String> {
    // Load CA
    let mut root_store = RootCertStore::empty();
    for cert in certs(&mut BufReader::new(File::open(ca_path).map_err(|e| e.to_string())?)) {
        root_store.add(cert.map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    }

    // Load client cert chain
    let cert_chain = certs(&mut BufReader::new(File::open(cert_path).map_err(|e| e.to_string())?))
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?
        .into_iter()
        .map(CertificateDer::from)
        .collect();

    // Load private key
    let private_key = load_private_key(key_path)?;

    let mut config = ClientConfig::builder()
        .with_root_certificates(root_store)
        .with_client_auth_cert(cert_chain, private_key)
        .map_err(|e| format!("TLS config error: {}", e))?;

    config
        .dangerous()
        .set_certificate_verifier(Arc::new(NoCertificateVerification));

    Ok(config)
}

pub fn get_mqtt_config() -> Result<MqttConfig, String> {
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();
    Ok(MqttConfig {
        endpoint: "a3uoz4wfsx2nz3-ats.iot.ap-south-1.amazonaws.com".into(),
        port: 8883,
        client_id: format!("indi-touch-meter-{}", ts),
        cert_path: r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\certs\INDIREX-ADMIN.crt".into(),
        key_path: r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\certs\INDIREX-ADMIN.key".into(),
        ca_path: r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\certs\AmazonRootCA1.pem".into(),
    })
}

pub type MqttState = Arc<tokio::sync::Mutex<MqttManager>>;

#[tauri::command]
pub async fn mqtt_disconnect(state: tauri::State<'_, MqttState>) -> Result<(), ()> {
    let mut mgr = state.lock().await;
    if let Some(c) = mgr.client.take() {
        let _ = c.disconnect().await;
    }
    Ok(())
}