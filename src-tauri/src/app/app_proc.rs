use log;
use log::info;


use std::{path::{Path, PathBuf}, sync::Arc, env};
use std::fs;

#[allow(unused_imports)]
use tokio::{fs::File, io::BufWriter};
// use tokio::io::AsyncReadExt;
// use sha2::{Sha256, Digest};
use tokio::sync::OnceCell;
use tauri::async_runtime::Mutex;

// use disk_list;
use once_cell::sync::Lazy;
use crate::app::models;
use crate::app::ops;


static APP_PROC: Lazy<OnceCell<Option<AppProc>>> = Lazy::new(|| OnceCell::new());

#[derive( Debug, Clone, Default)]
pub struct AppProc {
	main_window: OnceCell<Arc<Mutex<tauri::Window>>>,
}

impl AppProc {
	pub fn create_instance(app_window: tauri::Window) -> Option<AppProc> {
		let app_proc = AppProc {
			main_window: OnceCell::new(),
		};
		app_proc.main_window.set(Arc::new(Mutex::new(app_window))).unwrap();
		APP_PROC.set(Some(app_proc.clone())).unwrap();
		Some(app_proc)
	}
	/**
	 * メインアプリプロシージャのメッセージを受け取る
	 *
	 */
	pub async fn app_wnd_proc(&self, msg:models::AppMsg) -> Result<String, tauri::InvokeError>  {
		
		match msg.msg_type {
			models::AppMsgType::Init => {
				info!("models::AppMsgType::Init: {:?}", msg);
				return Ok("Ok".to_string());
			},
			models::AppMsgType::DriveList => {
				let drives = self.get_system_drives().unwrap();
				self.main_window.get().unwrap().lock().await.emit("drive_list", drives).unwrap();
				return Ok("Ok".to_string());
			}
			models::AppMsgType::Quit => {
				let window = self.main_window.get().unwrap().lock().await;
				window.close().unwrap();
			},
			models::AppMsgType::OpenDir => {
				let dir = msg.value.clone();
				let res = self.open_dir(PathBuf::from(dir)).await;
				let _ = res.unwrap();
				return Ok("Ok".to_string());
				
			},
			models::AppMsgType::OpenFile => {

				return Ok("Ok".to_string());
			},
			
		}
		Ok("Ok".to_string())
	} 
	pub fn get_system_drives(&self) -> Result<Vec<models::Drives>, tauri::InvokeError> {
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
	/**
	 * ディレクトリ選択
	 */
	async fn open_dir(&self, selected_dir: PathBuf)-> Result<(), tauri::InvokeError>
	{
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
				} else if ops::is_video_file(&path) {  // 追加
					video_files.push(path.to_string_lossy().to_string());
				} else if ops::is_image_file(&path) {
					image_files.push(path.to_string_lossy().to_string());
				} else if ops::is_compressed_file(&path) {
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
		// return message
		self.main_window.get().unwrap().lock().await.emit("open_dir", dir_data).unwrap();
		Ok(())
	}
	
}

#[tauri::command]
pub async fn app_wnd_proc(msg:models::AppMsg) -> Result<String, tauri::InvokeError> {
    let app = APP_PROC.get().unwrap();
	if app.is_none() {
		return Err(tauri::InvokeError::from("main_window is undefined"));
	} else {
		let app = app.as_ref().unwrap();
		// let app = app.main_window.get().unwrap().lock().await.clone();
		let res = app.app_wnd_proc(msg).await;
		return res;
	}
}
