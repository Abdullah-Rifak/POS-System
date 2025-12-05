#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::{process::Command, thread, time::Duration};
use std::path::Path;

fn main() {
    let backend_path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../backend/src/server.js");

    let backend_dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../backend"); // set working dir for dotenv

    tauri::Builder::default()
        .setup(|_app| {
            Command::new("node")
                .arg(backend_path)
                .current_dir(backend_dir)  // important
                .spawn()
                .expect("Failed to start backend");

            // Wait a few seconds to make sure backend is ready
            thread::sleep(Duration::from_secs(3));

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}