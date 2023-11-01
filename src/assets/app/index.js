

function app_init() {
	window.addEventListener("load", (event) => {
		window.__TAURI__.invoke('app_wnd_proc', {
		msg: {
			msg: 'Hello',
			msg_type: 'Init',
			value: 'init_app'
		},
	}).then((res) => {
		console.log(res);
		const splitViewElement = document.querySelector('.split-view');
		SplitView.activate(splitViewElement,30);
	}).catch((err) => {
		console.log(err);
	});
});

}