import  "../element/base.js";
import '../element/button.js';

export class ResizeBtn extends window.Button {
	constructor(id="") {
		super(id);
	}
	async make ()
	{
		this.setBtnIcon("./assets/icon/resize.svg");
		super.make();
	}

}

window.ResizeBtn = ResizeBtn;