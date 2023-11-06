import dc from './base.js';
export class DropDown extends window.BaseElement {
	icon;
	content;
	icon_src;
	dropdown_caret;
	summary;
	summary_caret;
	label;

	list_items = [];
	list_class_name = "menu-item";
	button_text = "";
	constructor(id="") {
		super(id);
		
	}
	setBtnIcon(src) {
		this.icon_src = src;
		if (this.icon)
		{
			this.icon.src = src;
		}
	}
	setButtonText(text) {
		this.button_text = text;
		this.label.textContent = text;
	}
	make() {
		super.make("details");
		this.element.id = "drives";
		// this.element.type = "button";
		this.element.className = "btn details-reset p-0 mr-1"; //"btn p-1 details-reset mr-2";
		this.element.style.zIndex = 111;
		this.icon = dc.c("img", "dropdown-icon rounded-1 mr-1", {}, { });
		this.icon.src = this.icon_src;
		this.label = dc.c("span", "Label");
		this.label.textContent = this.button_text;

		this.summary = dc.c("summary","flex-row-reverse cp-2 mr-2");
		this.summary.appendChild(this.label);
		this.summary.appendChild(this.icon);
		this.element.appendChild(this.summary);

		

		this.content = dc.c("nav", "menu  rounded-1 border border-top-0 p-1", {});
		this.element.appendChild(this.content); 
		this.content.setAttribute("aria-label", "Primer");
		this.content.style.display = "none";
		this.content.style.position = "absolute";
		this.content.style.top = "100%";
		this.content.style.left = 1;
		this.content.style.zIndex = 111;
		this.content.style.minWidth = "160px";
		this.content.style.minheight = "auto";

		this.element.addEventListener("click", () => {
			console.log("drive button click");
			var inHover = false;
			if( this.element.open) {
				this.content.style.display = "none"; 
				console.log("drive button click:: hidden");

			} else {
				console.log("drive button click:: open");
				this.content.style.display = "block"; 
			}
			
		});
		this.element.addEventListener('mouseleave', () =>{
			this.content.style.display = "none";
			this.element.open = false;
			console.log("mouseleave::nav");
		});
		this.content.addEventListener('mouseleave', () => {
			console.log("mouseleave::content");
			this.content.style.display = "none";
			this.element.open = false;
		});
	}
	addDropDownItem(item, select=false) {
		item.className = this.list_class_name;
		if (select) {
			item.attributes["aria-current"] = "page";
		} 
		this.list_items.push(item);
		this.content.appendChild(item);
	}
	/**
	 * Retrieves the dropdown items.
	 *
	 * @return {Array} The list of dropdown items.
	 */
	getDropDownItems() {
		return this.list_items;
	}

}

window.DropDown = DropDown;