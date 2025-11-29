use std::fs;
use tauri::command;

#[command]
pub fn read_device_id() -> Result<String, String> {
    let path = r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\data\device_id.txt";

    match fs::read_to_string(path) {
        Ok(content) => Ok(content.trim().to_string()),
        Err(e) => Err(format!("Failed to read device_id.txt: {}", e)),
    }
}
