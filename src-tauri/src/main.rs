#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::{process::Command, process::Child, thread, time::Duration, sync::Arc, sync::Mutex};
use std::path::{Path, PathBuf};
use tauri::Manager;

fn main() {
    // Store backend process handle for cleanup
    let backend_process: Arc<Mutex<Option<Child>>> = Arc::new(Mutex::new(None));
    let backend_process_clone = Arc::clone(&backend_process);

    tauri::Builder::default()
        .setup(move |app| {
            // On Windows, ensure WebView2 runtime is available (attempt install if missing)
            if cfg!(target_os = "windows") {
                // check common WebView2 registry key
                let reg_check = Command::new("reg")
                    .args(&["query", "HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\Clients\\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"])
                    .output();
                if reg_check.is_err() || !reg_check.unwrap().status.success() {
                    println!("WebView2 runtime not found, attempting to install WebView2 bootstrapper...");
                    let ps = "$tmp = \"$env:TEMP\\webview2.exe\"; Invoke-WebRequest -Uri 'https://aka.ms/webview2bootstrapper' -OutFile $tmp; Start-Process -FilePath $tmp -ArgumentList '/install' -Wait";
                    let _ = Command::new("powershell")
                        .args(&["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps])
                        .status();
                    // allow a short pause for installer to start
                    thread::sleep(Duration::from_secs(3));
                }
            }

            // Determine base directory. In production the installer places resources under "_ups_".
            let base_dir: PathBuf = if cfg!(debug_assertions) {
                Path::new(env!("CARGO_MANIFEST_DIR")).join("../")
            } else {
                std::env::current_exe()
                    .unwrap()
                    .parent()
                    .unwrap()
                    .join("_up_")
            };
            println!("Base directory: {:?}", base_dir);
            println!("Base directory exists: {}", base_dir.exists());

            let backend_dir = base_dir.join("backend");
            let backend_executable = backend_dir.join("src").join("server.js");

            // Spawn backend server process
            let mut node_command = Command::new("node");
            if !cfg!(debug_assertions) {
                #[cfg(target_os = "windows")]
                {
                    let bundled_node = base_dir.join("node_runtime").join("node.exe");
                    if bundled_node.exists() {
                        println!("Using bundled node runtime at {:?}", &bundled_node);
                        node_command = Command::new(bundled_node);
                    } else {
                        println!("Bundled node not found at {:?}, using system node", &bundled_node);
                    }
                }
                #[cfg(not(target_os = "windows"))]
                {
                    let bundled_node = base_dir.join("node_runtime").join("bin").join("node");
                    if bundled_node.exists() {
                        println!("Using bundled node runtime at {:?}", &bundled_node);
                        node_command = Command::new(bundled_node);
                    } else {
                        println!("Bundled node not found at {:?}, using system node", &bundled_node);
                    }
                }
            }

            println!("Backend executable: {:?}", backend_executable);
            println!("Backend directory: {:?}", backend_dir);
            println!("Backend dir exists: {}", backend_dir.exists());

            if backend_executable.exists() {
                println!("Backend executable found!");
            } else {
                println!("⚠️  Backend executable not found at expected location");
            }

            match node_command
                .arg(backend_executable.as_os_str())
                .current_dir(&backend_dir)
                .spawn()
            {
                Ok(child) => {
                    *backend_process_clone.lock().unwrap() = Some(child);
                    println!("✓ Backend server started (PID: {:?})", backend_process_clone.lock().unwrap().as_ref().map(|c| c.id()));
                }
                Err(e) => {
                    eprintln!("❌ Failed to start backend server: {}", e);
                    eprintln!("Backend executable: {:?}", backend_executable);
                    eprintln!("Backend directory: {:?}", backend_dir);

                    // Fallback: try to find node.exe full path via `where` and spawn with explicit path
                    if cfg!(target_os = "windows") {
                        if let Ok(output) = Command::new("where").arg("node").output() {
                            if output.status.success() {
                                if let Some(first) = String::from_utf8_lossy(&output.stdout).lines().next() {
                                    let node_path = first.trim();
                                    eprintln!("Attempting fallback spawn using node at: {}", node_path);
                                    if let Ok(child) = Command::new(node_path)
                                        .arg(backend_executable.as_os_str())
                                        .current_dir(&backend_dir)
                                        .spawn()
                                    {
                                        *backend_process_clone.lock().unwrap() = Some(child);
                                        println!("✓ Backend server started with explicit node path");
                                    } else {
                                        eprintln!("Fallback spawn with explicit node path failed");
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Wait for backend to be ready (increased timeout for first-time setup and MongoDB initialization)
            thread::sleep(Duration::from_secs(8));

            // Verify backend health with retries
            for attempt in 1..=15 {
                match ureq::get("http://127.0.0.1:5000/health").timeout(Duration::from_secs(3)).call() {
                    Ok(response) if response.status() == 200 => {
                        println!("✓ Backend health check passed on attempt {}", attempt);
                        return Ok(());
                    }
                    Ok(response) => {
                        println!("Backend returned status: {} (attempt {}/15)", response.status(), attempt);
                    }
                    Err(e) => {
                        println!("Backend health check attempt {}/15 failed: {}", attempt, e);
                    }
                }

                if attempt < 15 {
                    thread::sleep(Duration::from_secs(1));
                }
            }

            eprintln!("⚠️  Backend health check failed after retries - app may not function correctly");
            Ok(())
        })
        .on_window_event(move |_window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { .. } => {
                    // Clean up backend process when app closes
                    if let Ok(mut process) = backend_process.lock() {
                        if let Some(mut child) = process.take() {
                            let _ = child.kill();
                            println!("✓ Backend process terminated");
                        }
                    }
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}