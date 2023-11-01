

export class Header {
	constructor() {
		this.header = document.getElementById('header');
	}
	getDrives()
	{
		// Umbrella JSを使うためにu()関数を使用
		const driveSelectBtn = document.getElementById("driveSelectBtn");
		const driveDropdown = document.getElementById("driveDropdown");
		const driveList = document.getElementById("driveList");
		window.__TAURI__.event.listen('drive_list', event => {
			console.log('drive_list',event);
			event.payload.forEach(drive => {
				console.log(drive);
				const li = document.createElement("li");
				li.textContent = drive.drive;
				li.addEventListener("click", function() {
					// ここで選択されたドライブに対する処理を行う
					console.log("Selected drive:", drive);
				});
				li.className = "menu-item";
				driveList.appendChild(li);
			});
	
			// ドロップダウンの表示/非表示を切り替え
			driveSelectBtn.addEventListener("click", function() {
				driveDropdown.classList.toggle("hidden");
			});
		});
		
		window.__TAURI__.invoke('app_wnd_proc', {
			msg: {
				msg: 'msg:DriveList',
				msg_type: 'DriveList',
				value: 'value:DriveList'
			},
		}).then((res) => {
			console.log("app_wnd_proc::",res);
			
		}).catch((err) => {
			console.log(err);
		});
	}
}

window.Header = Header;
