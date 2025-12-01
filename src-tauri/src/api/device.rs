// src/api/device.rs
use std::fs;
use std::path::Path;

use chrono::{Datelike, Utc};
use serde::{Deserialize, Serialize};
use tauri::command;

const DATA_DIR: &str = r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\data";
const DEVICE_ID_PATH: &str = r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\data\device_id.txt";
const HHID_PATH: &str = r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\data\hhid.txt";
const MEMBERS_PATH: &str = r"C:\Users\ankur\Dev\personal\frontend\indi-touch-meter\data\members.json";

#[command]
pub fn read_device_id() -> Result<String, String> {
    fs::read_to_string(DEVICE_ID_PATH)
        .map(|s| s.trim().to_string())
        .map_err(|e| format!("Failed to read device ID: {}", e))
}

#[command]
pub fn read_hhid() -> Result<String, String> {
    fs::read_to_string(HHID_PATH)
        .map(|s| s.trim().to_string())
        .map_err(|_| "HHID not found".to_string())
}

pub fn write_hhid(hhid: &str) -> Result<(), String> {
    fs::write(HHID_PATH, hhid).map_err(|e| format!("Failed to write HHID: {}", e))
}

#[derive(Deserialize)]
struct ApiMember {
    member_code: String,
    dob: String,
    gender: String,
    #[allow(dead_code)]
    created_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct LocalMember {
    pub id: String,
    pub age: u32,
    pub gender: String,
    pub active: bool,
}

fn calculate_age(dob_str: &str) -> Result<u32, String> {
    let dob = chrono::NaiveDate::parse_from_str(dob_str, "%Y-%m-%d")
        .map_err(|e| format!("Invalid DOB format: {}", e))?;

    let today = Utc::now().date_naive();

    let mut age = today.year() - dob.year();
    if (today.month(), today.day()) < (dob.month(), dob.day()) {
        age -= 1;
    }

    Ok(age as u32)
}

pub async fn fetch_members(meter_id: &str, hhid: &str) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "https://bt72jq8w9i.execute-api.ap-south-1.amazonaws.com/test/members?meter_id={}&hhid={}",
        meter_id, hhid
    );

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("API error {}: {}", response.status(), response.text().await.unwrap_or_default()));
    }

    let json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;
    let api_members = json["members"].as_array().ok_or("No members array in response")?;

    let mut local_members = Vec::new();
    for m in api_members {
        let api_m: ApiMember = serde_json::from_value(m.clone()).map_err(|e| e.to_string())?;
        let age = calculate_age(&api_m.dob)?;
        local_members.push(LocalMember {
            id: api_m.member_code,
            age,
            gender: api_m.gender,
            active: false,
        });
    }

    let json_str = serde_json::to_string_pretty(&local_members).map_err(|e| e.to_string())?;
    fs::write(MEMBERS_PATH, json_str).map_err(|e| e.to_string())?;

    Ok("Members updated successfully".to_string())
}

// NEW: File existence checker used by UI
#[command]
pub fn file_exists(file_name: String) -> Result<bool, String> {
    let path = Path::new(DATA_DIR).join(&file_name);
    Ok(path.exists())
}