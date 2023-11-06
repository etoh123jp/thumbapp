
export class dc {
	i(id) {
		return document.getElementById(id);
	}
	/**
	 * Creates a button element with the specified class and style properties.
	 *
	 * @param {string} c - The class name of the button element. Default is an empty string.
	 * @param {object} s - The style properties of the button element. Default is an empty object.
	 * @return {object} - The created button element.
	 */
	static b(c="",s={}) {
		const res = dc.c("buttom",c,s);
		res.type = "button";
		return res;
	}
	/**
	 * Create a new element with the specified tag name, class name, and style.
	 *
	 * @param {string} elementName - The tag name of the element.
	 * @param {string} className - The class name of the element. Default is an empty string.
	 * @param {object} style - The style object of the element. Default is an empty object.
	 * @param {object} attributes - The attributes object of the element. Default is an empty object.
	 * @return {HTMLElement} - The created element.
	 */
	static c(elementName,className="", style={}, attributes={}) {
		const el = document.createElement(elementName);
		el.className = className;
		if (style != {}) {
			dc.marge_style(el, style);
		}
		if (attributes != {}) {
			dc.ex_attr(el, attributes);
		}
		return el;
	}
	static marge_style(el, style) {
		Object.entries(style).forEach(([key, value]) => {
			el.style.setProperty(key, value);
		});
	}
	static ex_attr(el, attributes) {
		Object.entries(attributes).forEach(([key, value]) => {
			el.setAttribute(key, value);
		});
	}
}
export default dc;
window.dc = dc;
export class BaseElement {
	id = ""
	element = null;
	parent = null;
	constructor(id="") {
		this.id = id;
	}
	async make(elementName="", className="", style={}, attributes={})
	{
		if (this.id != "") {
			this.element = document.getElementById(this.id);
			dc.marge_style(this.element, style);
			dc.ex_attr(this.element, attributes);
		} else {
			this.element = dc.c(elementName, className, style, attributes);
		}
		if (this.parent != null) {
			this.parent.appendChild(this.element);
		}
		return this;
	}
	setParent(parent) {
		this.parent = parent;
		return this;
	}
	setClassName(className) {
		this.element.className = className;
		return this;
	}
	addClass(className) {
		this.element.classList.add(className);
		return this;
	}
	removeClass(className) {
		this.element.classList.remove(className);
		return this;
	}
	/**
	 * Creates an element with the specified name, optional class, and optional style.
	 *
	 * @param {string} elementName - The name of the element to create.
	 * @param {string} [c=""] - Optional class to assign to the element.
	 * @param {Object} [s={}] - Optional style object to apply to the element.
	 * @return {Object} - The created element with assigned properties.
	 */
	c(elementName, c="", s={}, attributes={}) {
		const res = dc.c(elementName, c, s);
		res.id = this.id;
		res.className = this.class;
		res.style = this.style;
		res.attributes = this.attributes;
		return res;
	}
	extend_obj(source, target) {
		Object.entries(source).forEach((key, value) => {
			target[key] = value;
		});
	}
	
}
window.BaseElement = BaseElement;