import './ui/header.js';
import './ui/thumbnail.js';
import './ui/dir_list.js';
import './ui/footer.js';
import './ui/element/base.js';
import './ui/element/dropdown.js';
import './libs/history.js';

export class ThumbApp {
    el_app_content;
    app_config;
    header;
    thumbnail;
    dir_list;
    footer;

	newSelectDirEvent = new EventTarget();
	/**
	 * @type {Hitory}
	 */
	history = null;
    constructor() { 
        this.el_app_content = document.getElementById('el_app_content');
        this.header = new Header("appBar");
        this.thumbnail = new Thumbnail();
        this.dir_list = new DirList();
        this.footer = new Footer();
        console.log("ThumbApp::constructor()");
		this.history = new History();

    }
    async init() {
        console.log("ThumbApp::init()");
        this.app_config = new AppConfig();
        await this.app_config.init();
		window.app_config = this.app_config;
        const res = await window.__TAURI__.invoke('app_wnd_proc', {
            msg: {
                msg: 'Hello',
                msg_type: 'Init',
                value: 'init_app'
            }
        });
        if (res === null) {
			console.log("Received null from invoke method");
            res = "default string"; // デフォルト値を設定
        } else {
			// create controls
			await this.header.make();
			await this.thumbnail.make();
			await this.dir_list.make();
			await this.footer.make();
			const last_path = await window.app_config.getLastSelectPath();
			//初期フォルダ
			this.dir_data = await this.newSelectPath( last_path , true);
			
		}
		

		// add mouse event lisner
		document.addEventListener('mousedown', (event) => {
			// マウスの戻るボタン（ボタン番号3）
			if (event.button === 3) {
				//in history action
				const dir_data = this.history.goBack((prevPath) => {
					console.log("back button -> path::", prevPath);
					if (prevPath != null) {
						this.newSelectPath(prevPath, false);
					}
					return prevPath;
				});
			}
			// マウスの進むボタン（ボタン番号4）
			if (event.button === 4) {
			// in history action
				const dir_data = this.history.goForward( (nextPath) => {
					console.log("forward button -> path::", nextPath);
					if (nextPath != null) {
						this.newSelectPath(nextPath, false);
					}
					return nextPath;
				});
			}
		});
		  
    }
	/**
	 * Asynchronously selects a new path and returns the directory data.
	 *
	 * @param {string} new_dir_path - The new directory path to select.
	 * @return {Promise<Object>} - The directory data.
	 */
	async newSelectPath(new_dir_path, forece = false)
	{
		this.dir_data = await this.getDirData( new_dir_path );
		await this.dir_list.setNewSelectPath(this.dir_data);
		this.history.addToHistory(this.dir_data.path, forece);

		const event = new Event("newSelectDir");
		this.newSelectDirEvent.dispatchEvent(event);
		
		console.log("newSelectPath::dirdata::", this.dir_data);
		return this.dir_data;
	}
	/**
	 * Sets the select path.
	 *
	 * @param {type} new_dir_path - the new select path
	 */
	async getDirData(new_dir_path) {
		return await invoke("process_selected_directory",
		{ 'selectedDir': new_dir_path })
			.then(data => {
				if (data == null || data == undefined || data.path == "\"\"" || data.path == undefined) {
					localStorage.removeItem("last_path");
					throw error;
				}
				console.log("dir data::",data);
				data.path = data.path.replace(/\\\\/g, '\\');
				localStorage.setItem("last_path", data.path);
				return data;
			}).catch(error => {
				console.error(`process_selected_directory::取得エラー: ${error}`);
				return [];
			});
	}
}

window.ThumbApp = ThumbApp;