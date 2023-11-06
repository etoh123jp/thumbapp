import "./thumb_app.js";

/**
 * type DirLIst
 */
window.thumb_app = {}
/**
 * type AppConfig
 */
window.app_config = {}

document.addEventListener("DOMContentLoaded", function() {
	console.log("DOMContentLoaded");
	const splitViewElement = document.querySelector('.split-view');
    SplitView.activate(splitViewElement, 30);

	window.thumb_app = new ThumbApp();
	window.thumb_app.init();

	
	
});
