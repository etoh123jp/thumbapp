"use client"
window.invoke = window.__TAURI__.invoke;
window.fs = window.__TAURI__.fs;
window.path = window.__TAURI__.path;
window.readTextFile = window.__TAURI__.fs.readTextFile;
window.writeTextFile = window.__TAURI__.fs.writeTextFile;
window.BaseDirectory = window.__TAURI__.fs.BaseDirectory;
window.tauri = window.__TAURI__;
class AppConfig {
	/**
	 * config data
	 * @type {@type{
	 * 		aspectRatioEnabled: boolean, aspectRatio: number, rect: {width: number, height: number}, min: number}
	 * }
	 */
	thumbnail = {};
	/**
	* config data
	* @type {@type{}
	* }
	*/
	favorite ={}
	
	
	constructor()  {
		this.configData = null;
	}
	async init() {
		this.path = {};
		this.path.base_dir = await invoke('get_exe_directory');
		console.log(this.path.base_dir);
		// const configFilePath = await path.join(this.path.base_dir,'config.json5');
		const thumb_settingPath = await path.join(this.path.base_dir,'thumbnail.json5');
		const themeFilepath = await path.join(this.path.base_dir,'theme.json5');
		const favoritePath = await path.join(this.path.base_dir,'favorite.json5');
		// this.path.configData = configFilePath;
		this.path.favorite =  favoritePath;
		this.path.theme =  themeFilepath;
		this.path.thumbnail = thumb_settingPath;
		this.configData = {};
		await this.load();
	}
	/**
	 * Returns the select path.
	 *
	 * @return {String} The select path.
	 */
	async getLastSelectPath() {
		const now_select_dir_data = localStorage.getItem("last_path");
		if (now_select_dir_data != null) {
			return now_select_dir_data;
		}
		else {
			let now_select_dir_data = await invoke("get_user_home_dir");
			localStorage.setItem("last_path", now_select_dir_data.path);
			return now_select_dir_data.path;
		}
	}
	
	async load() {
		try {
			await this.loadThemeSeeting();
			await this.loadThumbnailSetting();
			await this.loadConfigFile("favorite");
		}catch (error) {
			console.log(error);
		}
		
	}
	async loadThemeSeeting() 
	{ 
		this.configData.theme = {};
		await this.loadConfigFile( "theme", 
		{
				typography: {
					fontSize: 12,
					fontWeightLight: 300,
					fontWeightRegular: 400,
					fontWeightMedium: 700,
				
					h1: { fontSize: 60 },
					h2: { fontSize: 48 },
					h3: { fontSize: 42 },
					h4: { fontSize: 36 },
					h5: { fontSize: 20 },
					h6: { fontSize: 12 },
					subtitle1: { fontSize: 13 },
					body1: { fontSize: 14 },
					button: { textTransform: 'none' },
				},
		  });
	}
	async loadThumbnailSetting() {
		this.configData.thumbnail = {};
		await this.loadConfigFile("thumbnail",
		{
				aspectRatioEnabled: true,
				aspectRatio: 1,
				rect : {
					width: 240,
					height: 240
				},
				min: 240,
		});
	}
	// 設定ファイルを読み込む
	async loadConfigFile(fileName, defaultConfig={}) {
		const configFilePath = this.path[fileName];
		if (await fs.exists(configFilePath)) {
			console.log("exists ",fileName, ".json5");
			const configDataJson = await readTextFile( configFilePath);
			const configData = JSON.parse(configDataJson);
			this.configData[fileName] = {...configData};
			console.log('Config loaded->',fileName, ":::", this.configData[fileName]);
		} else {
			console.log("does not exists ",fileName,".json5");
			this.saveConfigFile(fileName, defaultConfig);
		}
		return this.configData[fileName];
	}
	
	// 設定ファイルを保存する
	saveConfigFile(fileName, configData) {
		// データをJSON形式に変換して書き込む
		const configFilePath = this.path[fileName];
		try {
			const configDataJson = JSON.stringify(configData);
			writeTextFile({ path: configFilePath, contents: configDataJson }).then(() => {
				this.configData[fileName] = {...configData};
				console.log('Config file save.::', fileName , ":::",this.configData[fileName]);
			}).catch(error => {
				console.log(error);
			});
		}
		catch (error) {
			console.log(error);
		}
	}
		/**
	 * Retrieves the thumb setting from the config data.
	 *
	 * @return {@type{aspectRatioEnabled: boolean, aspectRatio: number, rect: {width: number, height: number}, min: number}} The thumb setting value.
	 */
	getThumbSetting(){
		return this.configData.thumbnail;
	}
	
}
export default AppConfig;
window.AppConfig = AppConfig;