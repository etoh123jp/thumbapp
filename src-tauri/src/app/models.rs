
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct DirData {
	pub path: String,
	pub movies : Vec<String>,
	pub files: Vec<String>,
	pub dirs: Vec<String>,
	pub comps: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Drives {
	pub label: String,
	pub system: String,
	pub drive: String,
	pub size: String,
	pub free: String,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppMsg {
	pub msg: String,
	pub msg_type: AppMsgType,
	pub value: String,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub enum AppMsgType {
	#[default] Init,
	Quit,
	OpenDir,
	OpenFile,

}
pub trait AppMsgResult {
    fn to_string(&self) -> String ;
	fn serialize(&self) -> String;
}
impl AppMsgResult for AppMsg {
	fn to_string(&self) -> String {
		serde_json::to_string(&self).unwrap()
	}
	fn serialize(&self) -> String {
		serde_json::to_string(&self).unwrap()
	}
}
impl AppMsgResult for String {
	fn to_string(&self) -> String {
		self.clone()
	}
	fn serialize(&self) -> String {
		self.clone()
	}
}
impl AppMsgResult for Vec<Drives> {
	fn to_string(&self) -> String {
		serde_json::to_string(&self).unwrap()
	}
	fn serialize(&self) -> String {
		serde_json::to_string(&self).unwrap()
	}
}
impl AppMsgResult for DirData {
	fn to_string(&self) -> String {
		serde_json::to_string(&self).unwrap()
	}
	fn serialize(&self) -> String {
		serde_json::to_string(&self).unwrap()
	}
}