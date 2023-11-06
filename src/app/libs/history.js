
/**
 * This class manages the history of visited folders.
 */
export class History {
	/// @var array[string]
	history = [];
	/// @var bool
	in_history_action = false;
	/// @var int
	historyIndex = -1;
	/// @var int
	view_page_index = 0;
	constructor() {
		this.history = [];
		this.index = 0;
	}
	/**
	 * Sets the value of the in_history_action flag.
	 *
	 * @param {boolean} flag - The new value of the in_history_action flag.
	 * @return {void} This function does not return anything.
	 */
	setInHistoryAction(flag) {
		this.in_history_action = flag;
	}
	/**
	 * Adds the given directory to the history.
	 *
	 * @param {string} dir - The directory to be added to the history.
	 * @return {void} This function does not return anything.
	 */
	addToHistory(dir, force = false) {
		if (this.in_history_action || !force) return;
		// 現在のインデックス以降の履歴を削除
		this.history = this.history.slice(0, this.historyIndex + 1);

		// 履歴のサイズ制限
		if (this.history.length >= 50) { // 50は最大の履歴の数です
			this.history.shift();
		} else {
			this.historyIndex++;
		}

		// 履歴に追加
		this.history.push(dir);
	}
	/**
	 * Goes back to the previous directory in the history.
	 *
	 * @return {null||string} Returns null if there is no history to go back to.
	 */
	goBack(f) {
		if (this.historyIndex > 0) {
			this.historyIndex--;
			const prevDir = this.history[this.historyIndex];

			this.in_history_action = true;
			f(prevDir);
			this.in_history_action = false;

			return this.history[this.historyIndex];
		} else {
			const prevDir = this.history[0];
			f(prevDir)
			return prevDir; // 戻る履歴がない場合
		}
	}

	/**
	 * Moves the user forward in the history of visited folders.
	 *
	 * @return {null} Returns null if there is no forward history.
	 */
	goForward(f) {
		if (this.historyIndex < this.history.length - 1) {
			this.historyIndex++;
			const nextDir = this.history[this.historyIndex];
			this.in_history_action = true;
			f(nextDir);
			this.in_history_action = false;
			return nextDir;
		} else {
			const nextDir = this.history[this.history.length - 1];
			f(nextDir)
			return nextDir; // 進む履歴がない場合
		}
	}
}
export default History;
window.History = History;