// src/api/http.rs
use reqwest;
use serde_json::json;

use crate::api::device::{write_hhid, fetch_members};

#[tauri::command]
pub async fn initiate_assignment(meter_id: String, hhid: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = "https://bt72jq8w9i.execute-api.ap-south-1.amazonaws.com/test/initiate-assignment";
    let payload = json!({
        "meter_id": meter_id,
        "hhid": hhid,
    });

    let response = client.post(url).json(&payload).send().await.map_err(|e| e.to_string())?;

    if response.status().is_success() {
        write_hhid(&hhid)?;
        Ok("OTP sent successfully".to_string())
    } else {
        Err(format!("Initiate failed: {}", response.status()))
    }
}

#[tauri::command]
pub async fn verify_otp(meter_id: String, hhid: String, otp: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = "https://bt72jq8w9i.execute-api.ap-south-1.amazonaws.com/test/verify-otp";
    let payload = json!({
        "meter_id": meter_id,
        "hhid": hhid,
        "otp": otp,
    });

    let response = client.post(url).json(&payload).send().await.map_err(|e| e.to_string())?;

    if response.status().is_success() {
        fetch_members(&meter_id, &hhid).await?;
        Ok("OTP verified, members fetched".to_string())
    } else {
        Err(format!("Verify failed: {}", response.status()))
    }
}

#[tauri::command]
pub async fn retry_otp(meter_id: String, hhid: String) -> Result<String, String> {
    initiate_assignment(meter_id, hhid).await
}