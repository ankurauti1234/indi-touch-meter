// src/main.rs
mod api;

use std::sync::Arc;
use tokio::sync::Mutex;
use api::mqtt::MqttManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(Arc::new(Mutex::new(MqttManager::new())))
        .invoke_handler(tauri::generate_handler![
            // Device & File Checks
            api::device::read_device_id,
            api::device::read_hhid,
            api::device::file_exists,  // ← NOW INCLUDED!

            // HHID & OTP Flow
            api::http::initiate_assignment,
            api::http::verify_otp,
            api::http::retry_otp,

            // Members
            api::members::get_members,
            api::members::toggle_member,

            // MQTT
            api::mqtt::mqtt_disconnect,
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}