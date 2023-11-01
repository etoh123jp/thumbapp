


async function app_init() {
	const res = await window.__TAURI__.invoke('app_wnd_proc', {
		msg: {
			msg: 'Hello',
			msg_type: 'Init',
			value: 'init_app'
		}}
	);
	console.log(res);
		
	const splitViewElement = document.querySelector('.split-view');
	SplitView.activate(splitViewElement,30);
	window.thumb_app.header.getDrives();
}