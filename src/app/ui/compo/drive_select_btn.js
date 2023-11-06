import '../element/dropdown.js';

export class DriveSelectBtn extends window.DropDown {
	drive_datas = [];
	constructor(id="") {
		super(id);
	}
	async make()
	{
		this.setBtnIcon("./assets/icon/hard_drive.svg");
		super.make();
		await this.getDrives();
		await this.setAreaCurrent();
		window.thumb_app.newSelectDirEvent.addEventListener("newSelectDir", this.setAreaCurrent.bind(this));
	}
	async setAreaCurrent()
	{
		const last_path = await window.app_config.getLastSelectPath();
		this.getDropDownItems().forEach(item => {
			if ( last_path.includes(item.textContent)) {
				item.setAttribute("aria-current","page");
				this.setButtonText(item.textContent);
				console.log("select dir::" , item.textContent);
			} else {
				item.removeAttribute("aria-current");
			}
		});
	}
	/**
	 * Handles the selection of a drive.
	 *
	 * @param {Object} e - The event object.
	 * @return {Promise<void>} A promise that resolves when the function completes.
	 */
	async driveSelectHandler( e) {
		console.log("Selected drive:", e.target.textContent);
		await window.thumb_app.newSelectPath(e.currentTarget.drive.drive, true);
		await this.setAreaCurrent();
	}
	async getDrives()
	{
		await window.__TAURI__.event.listen('drive_list', function(event) {
			console.log('drive_list',event);
			this.drives_data = event.payload;
			console.log('drives',this.drives_data);
			event.payload.forEach(drive => {
				console.log(drive);
				const li = document.createElement("li");
				li.drive = drive;
				li.textContent = drive.drive;
				//bind li element
				li.addEventListener("click",  this.driveSelectHandler.bind(this));
				li.className = "menu-item";
				this.addDropDownItem(li);
			});
		}.bind(this));
		
		await window.__TAURI__.invoke('app_wnd_proc', {
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

window.DriveSelectBtn = DriveSelectBtn;