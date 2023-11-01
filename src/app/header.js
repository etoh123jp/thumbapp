

export class Header {
	constructor() {
		this.header = document.getElementById('header');
	}
	getDrives()
	{
	// Umbrella JSを使うためにu()関数を使用
const $ = u;

// ドライブのデータ（仮）
const drives = [
	{ drive: 'Drive1' },
	{ drive: 'Drive2' },
	{ drive: 'Drive3' }
];

// 選択されたドライブ（仮）
let selectedDrive = 'Drive1';

// select要素を取得
const driveSelect = $('#driveSelect');

// SVGアイコンのパス
const svgIconPath = 'src/assets/icon/hard_drive.svg';

// オプションを動的に追加
drives.forEach((drive) => {
	const option = document.createElement('option');
	option.value = drive.drive;
	option.innerHTML = `<img src="${svgIconPath}" alt="Drive Icon" width="16" height="16"> ${drive.drive}`;
	driveSelect.append(option);
});

// 初期選択値を設定
driveSelect.first().value = selectedDrive;

// select要素の変更イベント
driveSelect.on('change', (event) => {
	const newDrive = event.target.value;
	// onDriveChange関数のような処理をここに書く
	// 例: onDriveChange(newDrive);
	selectedDrive = newDrive;
});

	}
}

window.Header = Header;
