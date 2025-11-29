mod api;

use std::sync::Arc;
use tokio::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(Arc::new(Mutex::new(api::mqtt::MqttManager::new())))
        .invoke_handler(tauri::generate_handler![
            api::device::read_device_id,
            api::mqtt::mqtt_connect,
            api::mqtt::mqtt_publish,
            api::mqtt::mqtt_disconnect,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}