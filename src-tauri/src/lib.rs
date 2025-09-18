use std::{fs, path::PathBuf};

use tauri::{self};
use tauri_plugin_dialog::{DialogExt, FileDialogBuilder};

const IMAGE_EXTENSIONS: &[&str] = &["png", "jpg", "jpeg", "webp", "gif", "bmp", "svg"];

#[tauri::command]
async fn download_image(app: tauri::AppHandle, url: String) -> Result<(), String> {
    let Some(save_path) = select_save_path(app.dialog().file()) else {
        return Ok(());
    };

    let response = reqwest::get(&url)
        .await
        .map_err(|error| format!("Unable to reach URL: {error}"))?;

    if !response.status().is_success() {
        return Err(format!("Download failed with status {}", response.status()));
    }

    let bytes = response
        .bytes()
        .await
        .map_err(|error| format!("Failed to read response body: {error}"))?;

    fs::write(&save_path, &bytes).map_err(|error| format!("Failed to save file: {error}"))?;

    Ok(())
}

fn select_save_path<R: tauri::Runtime>(dialog: FileDialogBuilder<R>) -> Option<PathBuf> {
    dialog
        .set_title("Save image as")
        .add_filter("Images", IMAGE_EXTENSIONS)
        .blocking_save_file()
        .and_then(|file_path| file_path.into_path().ok())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![download_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
