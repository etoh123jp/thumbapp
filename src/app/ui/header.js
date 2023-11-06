import  "./element/base.js";
import "./compo/drive_select_btn.js";
import "./compo/favorite.js";
import "./compo/resize.js";
import "./compo/open_folder_dialog.js";

export class Header extends window.BaseElement {
	driveSelectBtn;
	favoriteBtn;
	OpenFolderDialog;
	resizeBtn;
	constructor(id="") {
		super(id);
		
	}
	async make()
	{
		this.driveSelectBtn = new window.DriveSelectBtn();
		this.favoriteBtn = new window.FavoriteBtn();
		this.resizeBtn = new window.ResizeBtn();
		this.openFolderDialog = new window.OpenFolderDialog();

		super.make();
		this.addClass("border-0");
		this.addClass("d-flex");

		await this.driveSelectBtn.make();
		this.element.appendChild(this.driveSelectBtn.element);
		this.driveSelectBtn.addClass("float-left");

		await this.favoriteBtn.make();
		this.element.appendChild(this.favoriteBtn.element);
		this.favoriteBtn.addClass("float-left");
		this.favoriteBtn.addClass("flex-1");
		

		await this.resizeBtn.make();
		this.element.appendChild(this.resizeBtn.element);
		this.resizeBtn.addClass("float-right");

		await this.openFolderDialog.make();
		this.element.appendChild(this.openFolderDialog.element);
		this.openFolderDialog.addClass("float-right");
	}
	
	
	
}

window.Header = Header;
