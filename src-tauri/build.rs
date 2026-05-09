use std::path::Path;

fn main() {
  // Copy backend files to out directory for bundling
  let backend_src = Path::new("../backend");
  
  if backend_src.exists() {
    println!("cargo:warning=Backend directory found at {:?}", backend_src);
  } else {
    println!("cargo:warning=Backend directory not found at {:?}", backend_src);
  }

  // Ensure backend/src exists
  let backend_src_dir = backend_src.join("src");
  if backend_src_dir.exists() {
    println!("cargo:warning=Backend src directory found");
  } else {
    println!("cargo:warning=Backend src directory not found!");
  }

  // Rebuild if backend files change
  println!("cargo:rerun-if-changed=../backend/src");
  println!("cargo:rerun-if-changed=../backend/package.json");

  tauri_build::build()
}

