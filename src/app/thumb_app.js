
import './header.js';
import './thumbnail.js';
import './dir_list.js';
import './footer.js';

export class ThumbApp {
	app_content;
	header;
	thumbnail;
	dir_list;
	footer;
	constructor() {
		this.app_content = document.getElementById('app_content');
		this.header = new Header();
		this.thumbnail = new Thumbnail();
		this.dir_list = new DirList();
		this.footer = new Footer();
	}

}

window.ThumbApp = ThumbApp;
window.thumb_app = new ThumbApp();