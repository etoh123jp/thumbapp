import dc from './base.js';
export class Button extends window.BaseElement {
	icon = null;;
	icon_src = null;;
	label = null;;
	label_text = null;;
	constructor(id="") {
		super(id);
	}
	async make()
	{
		super.make("button","btn");
		if (this.icon_src)
		{
			this.icon = dc.c("img", "dropdown-icon", {}, { });
			this.icon.src = this.icon_src;
			this.icon.className = "mr-1";
			this.element.appendChild(this.icon);
		}
		if (this.label_text != null) {
			this.label = dc.c("span", "Label");
			this.label.textContent = this.label_text;
			this.element.appendChild(this.label);
		}
	}
	setLabelText(text) {
		this.label_text = text;
		if (this.label)
		{
			this.label.textContent = text;
		}
	}
	setBtnIcon(src) {
		this.icon_src = src;
		if (this.icon)
		{
			this.icon.src = src;
		}
	}
}

window.Button = Button;