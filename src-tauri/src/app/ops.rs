use log;

use std::process::Command as StdCommand;

use std::path::{Path, PathBuf};
use tauri::api::dialog::blocking::FileDialogBuilder;
use std::fs;
use image::codecs::webp;

#[allow(unused_imports)]
use tokio::{fs::File, io::BufWriter};
use tokio::io::AsyncReadExt;
use sha2::{Sha256, Digest};

use disk_list;

use crate::app::models;

#[tauri::command]
pub fn get_exe_directory() -> tauri::Result<String> {
	let exe_path = std::env::current_exe()?;
	let exe_dir = exe_path.parent().unwrap_or_else(|| {
	  panic!("Could not determine the directory of the executable.");
	});
	Ok(exe_dir.to_str().unwrap().to_string())
}
#[tauri::command]
pub async fn get_user_home_dir() -> Result<models::DirData, tauri::InvokeError> {
    match dirs::home_dir() {
        Some(path) => process_selected_directory(path).await,
        None => Ok(models::DirData::default()),
    }
} 
#[tauri::command]
pub fn open_explorer_and_select(path: String, flag: bool) {
    if cfg!(target_os = "windows") {
		println!("path: {:?}", path);
		if flag  {
			StdCommand::new("explorer").arg("/select,").arg(path).spawn().expect("Failed to open explorer");
		} else {
			StdCommand::new("explorer").arg(path).spawn().expect("Failed to open explorer");
		}
    } else if cfg!(target_os = "macos") {
        StdCommand::new("open").arg(path).spawn().unwrap();
    } else if cfg!(target_os = "linux") {
        StdCommand::new("xdg-open").arg(path).spawn().unwrap();
    } else {
        // その他のOSの場合の処理
        println!("Unsupported OS");
    }
}
#[tauri::command]
pub async fn process_selected_directory(selected_dir: PathBuf) -> Result<models::DirData, tauri::InvokeError> {

    log::info!("選択されたフォルダパス: {:?}", selected_dir.to_string_lossy());
	if "undefined" == selected_dir.to_string_lossy() {
		return Err(tauri::InvokeError::from("selected_dir is undefined"));
	}

    let mut image_files = Vec::new();
    let mut compressed_files = Vec::new();
	let mut video_files = Vec::new(); 
    let mut directories = Vec::new();

    if let Ok(entries) = fs::read_dir(selected_dir.clone()) {
        for entry in entries {
            let entry = entry.unwrap();

            let path = entry.path();
			if path.starts_with(".") { 
				continue; 
			}

            if path.is_dir() {
                directories.push(Path::new(&path).file_name().unwrap().to_string_lossy().to_string());
			} else if is_video_file(&path) {  // 追加
                video_files.push(path.to_string_lossy().to_string());
            } else if is_image_file(&path) {
                image_files.push(path.to_string_lossy().to_string());
            } else if is_compressed_file(&path) {
                compressed_files.push(Path::new(&path).file_name().unwrap().to_string_lossy().to_string());
            }
        }
    }

    let dir_data = models::DirData {
        path: selected_dir.to_string_lossy().to_string(),
        files: image_files,
		movies: video_files, 
        dirs: directories,
        comps: compressed_files,
    };

    Ok(dir_data)
}

#[tauri::command]
pub fn get_system_drives() -> Result<Vec<models::Drives>, tauri::InvokeError> {
	let list = disk_list::get_disk_list();
	let mut drives = Vec::new();
	for item in list {
		log::info!("{:?}", item);
		let drive = models::Drives {
			label: item[0].clone(),
			system: item[1].clone(),
			drive: item[2].clone(),
			size: item[3].clone(),
			free: item[4].clone(),
		};
		drives.push(drive);
	}
	

    Ok(drives)
}

// webp動画かどうかを判断する関数
pub fn is_webp_animation(path: &str) -> bool {
    let file = std::fs::File::open(path);
	match file {
		Ok(file) => {
			let decoder = webp::WebPDecoder::new(file).unwrap();
			decoder.has_animation()
		},
		Err(_) => {
			false
		}
	}
}

pub fn is_video_file(filename: &std::path::Path) -> bool {
    let video_extensions: [&str; 6] = [
    	"mp4", "mkv", "avi", "mov", "webp", "gif"
	];
    let extension = filename
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("");
	//動画かどうかを判断する
	if extension == "webp" {
		return is_webp_animation(filename.to_str().unwrap());
	}
    let is_video = video_extensions.iter().any(|&ext| extension.eq_ignore_ascii_case(ext));
    // log::info!("Checking {:?} - Is video: {:?}", filename, is_video);
    is_video
}

pub fn is_image_file(filename: &std::path::Path) -> bool {
    let image_extensions: [&str; 6] = [
    	"jpg", "jpeg", "png",  "bmp", "webp", "svg"
	];
    let extension = Path::new(filename)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("");

    let is_image = image_extensions.iter().any(|&ext| extension.eq_ignore_ascii_case(ext));
    // log::info!("Checking {:?} - Is image: {:?}", filename, is_image);
    is_image
}


// 圧縮ファイルかどうかを判断する関数
#[allow(clippy::ptr_arg)]
#[allow(dead_code)]
pub fn is_compressed_file(filename: &std::path::Path) -> bool {
    let comp_extensions: [&str; 4] = ["zip", "rar", "tar", "gz"];
    let extension = filename
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("");

    let is_compressed = comp_extensions
        .iter()
        .any(|&ext| extension.eq_ignore_ascii_case(ext));
    // log::info!("Checking {:?} - Is compressed: {:?}", filename, is_compressed);
    is_compressed
}

//指定サイズ分のデータだけをハッシュ計算
#[allow(dead_code)]
pub async fn compute_hash<P: AsRef<Path>>(path: P, size_limit: usize) -> String {
    let mut file = File::open(path).await.expect("Failed to open file");
    let mut hasher = Sha256::new();
    let mut buffer = vec![0; 1024];
    let mut total_read = 0;

    loop {
        let n = file.read(&mut buffer).await.expect("Failed to read file");
        if n == 0 || total_read + n > size_limit {
            break;
        }
        hasher.update(&buffer[..n]);
        total_read += n;
    }

    format!("{:x}", hasher.finalize())
}
