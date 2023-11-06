// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

use log::log;
use log::{info, trace, warn};
use env_logger;
use chrono::Local;

mod app;
use app::ops;
use app::app_proc;
use tauri::Manager;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
fn init_logger() {
    let base_config = fern::Dispatch::new();

    let console_config = fern::Dispatch::new()
        .level(log::LevelFilter::Trace)
        .format(|out, message, record| {
            out.finish(format_args! {
                "[{}] {}:{} {} {}",
                record.level(),
                record.file().unwrap(),
                record.line().unwrap(),
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                message
            })
        })
        .chain(std::io::stdout());

    let application_config = fern::Dispatch::new()
        .level(log::LevelFilter::Info)
        .format(|out, message, record| {
            out.finish(format_args! {
                "[{}] {}:{} {} {}",
                record.level(),
                record.file().unwrap(),
                record.line().unwrap(),
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                message
            })
        })
        .chain(fern::log_file("application.log").unwrap());

    let emergency_config = fern::Dispatch::new()
        .level(log::LevelFilter::Error)
        .format(|out, message, record| {
            out.finish(format_args! {
                "[{}] {}:{} {} {}",
                record.level(),
                record.file().unwrap(),
                record.line().unwrap(),
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                message
            })
        })
        .chain(fern::log_file("emergency.log").unwrap());

    base_config
        .chain(console_config)
        .chain(application_config)
        .chain(emergency_config)
        .apply()
        .unwrap();
}


#[tokio::main]
async fn main() {
	Command::new("cmd")
            .args(&["/C", "cls"])
            .spawn()
            .expect("cls command failed to start");
	init_logger();
	//log 
	info!("Hello, world!");
	let args: Vec<String> = std::env::args().collect();
	for arg in &args {
        println!("Got argument: {}", arg);
    }
    tauri::Builder::default()
    .setup( |app| {
        let main_window = app.get_window("main").unwrap();
		main_window.open_devtools();
		app::app_proc::AppProc::create_instance(main_window).unwrap();
        Ok(())
    })
    .invoke_handler(tauri::generate_handler![
		app::app_proc::app_wnd_proc,
		ops::get_exe_directory,
		ops::get_user_home_dir,
		ops::open_explorer_and_select,
		ops::process_selected_directory,
		])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


