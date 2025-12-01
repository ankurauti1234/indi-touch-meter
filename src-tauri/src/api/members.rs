// src/api/members.rs
use std::fs;
use serde::{Deserialize, Serialize};
use tauri::State;
use crate::api::mqtt::{MqttManager, MqttMessage, MqttState, get_mqtt_config};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Member {
    id: String,
    age: u32,
    gender: String,
    active: bool,
}

#[tauri::command]
pub async fn get_members() -> Result<String, String> {
    let path = r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\data\members.json";
    fs::read_to_string(path).map_err(|e| format!("Failed to read members.json: {}", e))
}

#[tauri::command]
pub async fn toggle_member(memberId: String, state: State<'_, MqttState>) -> Result<String, String> {
    let path = r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\data\members.json";

    let content = fs::read_to_string(&path).map_err(|e| format!("Read error: {}", e))?;
    let mut members: Vec<Member> = serde_json::from_str(&content).map_err(|e| format!("Parse error: {}", e))?;

    if let Some(m) = members.iter_mut().find(|m| m.id == memberId) {
        m.active = !m.active;
    } else {
        return Err("Member not found".to_string());
    }

    let payload = serde_json::to_string(&members).map_err(|e| format!("Serialize error: {}", e))?;
    fs::write(&path, &payload).map_err(|e| format!("Write error: {}", e))?;

    let mut manager = state.lock().await;
    if manager.client.is_none() {
        let config = get_mqtt_config()?;
        manager.connect(config).await?;
    }

    let message = MqttMessage {
        topic: "indi-touch-meter/data".to_string(),
        payload,
        qos: 1,
    };

    manager.publish(message).await?;

    Ok("Toggled and published".to_string())
}