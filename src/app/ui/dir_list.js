import '../libs/vlist.js';
export class DirList extends window.BaseElement {

	/**
	 * @type {virtual_list}
	 */
	vlist = null;
	/**
	 * @type {Array}
	 */
	dir_data = null;
	constructor() {
		super();
		this.id = "dir-list-container";
	}
	async itemClickHandler( e) {
		e.stopPropagation();
		if (e.target.tagName != "SPAN") {
			return;
		}
		const index = e.currentTarget.dataset.index;
		const dir_name = this.dir_data.dirs[index];
		const sep = window.tauri.path.sep;
		const path = `${this.dir_data.path}${sep}${dir_name}`;
		console.log("select folder path", path);
		window.thumb_app.history.addToHistory(path, true);
		this.setNewSelectPath(path);
	}
	/**
	 * Set a new select path.
	 *
	 * @param {type} path - the new select path
	 * @return {type} -
	 */
	async setNewSelectPath(dir_data)
	{
		console.log("dir_lit.setNewSelectPath::", dir_data);
		this.dir_data = dir_data//await window.thumb_app.newSelectPath(path);
		this.vlist.init_view_index();
		await this.vlist.build(this.dir_data.dirs);
		await this.vlist.render();
	}
	async make()
	{
		await super.make("div", "dir-list");
		console.log("dir_data", this.dir_data);
		this.vlist = new window.virtual_list(this.element);
		this.vlist.item_rect.height = 2;
		this.vlist.item_rect.height_unit = "em";

		this.vlist.setItemClickHandler(this.itemClickHandler.bind(this));

	}
}
window.DirList = DirList;