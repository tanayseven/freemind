// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{info, error};
use tauri::Manager;
use std::process::Command;

#[tauri::command]
fn is_elevated() -> Result<bool, String> {
   info!("is_elevated function called");

   #[cfg(target_os = "windows")]
   {
       info!("Checking elevation on Windows");
       use winapi::um::securitybaseapi::IsUserAnAdmin;
       let result = unsafe { IsUserAnAdmin() != 0 };
       info!("Windows elevation result: {}", result);
       Ok(result)
   }

   #[cfg(any(target_os = "linux", target_os = "macos"))]
   {
       info!("Checking elevation on Linux/macOS");
       let output = Command::new("id")
           .arg("-u")
           .output()
           .map_err(|e| format!("Failed to run id command: {}", e))?;

       let user_id = String::from_utf8_lossy(&output.stdout).trim().parse::<u32>().unwrap_or(0);
       Ok(user_id == 0)
   }

   #[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
   {
       error!("Unsupported operating system");
       Err("Unsupported operating system".into())
   }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn hello_world() -> String {
    println!("Hello world function called");
    "Hello, World!".to_string()
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
               info!("Tauri setup complete");
               #[cfg(debug_assertions)]
               {
                   let window = app.get_window("main").unwrap();
                   window.open_devtools();
               }
               Ok(())
           })
        .invoke_handler(tauri::generate_handler![greet, hello_world, is_elevated])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
