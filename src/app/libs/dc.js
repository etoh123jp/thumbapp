
class dc {
	b(c="",s={}) {
		const res = dc.c("buttom",c,s);
		res.type = "button";
		return res;
	}
	c(e,c="", s={}) {
		const el = document.createElement(e);
		el.className = c;
		el.style = s;
		return el;
	}
}
export default  dc;