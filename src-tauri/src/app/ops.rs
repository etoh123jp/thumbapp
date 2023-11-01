use log;


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
