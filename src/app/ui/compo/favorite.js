
import  "../element/base.js";
import '../element/button.js';

export class FavoriteBtn extends window.BaseElement {
	favoriteBtn = null;
	path_label = null;
	constructor(id="") {
		super(id);
	}
	async make ()
	{
		this.favoriteBtn = new window.Button();
		this.favoriteBtn.setBtnIcon("./assets/icon/bookmark.svg");
		this.favoriteBtn.make();
		this.favoriteBtn.element.className = "btn p-0 mr-0 border-0 "; ;
		this.favoriteBtn.icon.classList.add("rounded-1");
		this.favoriteBtn.icon.classList.add("ml-1");
		super.make("div", "border rounded-1 pt-1 pb-1 color-fg-success");
		this.addClass("d-flex");

		this.element.appendChild(this.favoriteBtn.element);
		this.path_label = dc.c("input", "Label p-0 pl-1 pr-1 mr-2",{type:"text"});
		this.path_label.value = await window.app_config.getLastSelectPath();
		this.path_label.classList.add("wf");
		this.element.appendChild(this.path_label);
		// this.element.addEventListener("click", () => {
		// 	var range = document.createRange();
		// 	range.selectNodeContents(this.path_label);
		// 	var selection = window.getSelection();
		// 	selection.removeAllRanges();
		// 	selection.addRange(range);
		// });
	}
}

window.FavoriteBtn = FavoriteBtn;