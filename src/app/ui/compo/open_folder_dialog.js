import  "../element/base.js";
import '../element/button.js';

export class OpenFolderDialog extends window.Button {
	constructor(id="") {
		super(id);
	}
	async make ()
	{
		this.setBtnIcon("./assets/icon/folder_open.svg");
		super.make();
	}

}

window.OpenFolderDialog = OpenFolderDialog;