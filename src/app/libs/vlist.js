

export class virtual_list {
	itemClickHandler = null;
	top_elm = null;
	area_elm = document.createElement("div");
	area_elm_id = "virtual-list-area";
	item_rect = { width: 240, height: 240 , width_unit: "px", height_unit: "px"};
	build_rect = {width: 0, height: 0};
	unit = 16;
	list = [];
	
	item_tag = "div";
	
	row_mode_class = "vl_row_mode";
	column_mode_class = "vl_column_mode";
	item_mode_class = this.row_mode_class;

	in_area_elements = [];
	out_area_elements = [];

	view_index = {
		first: -1,
		last: -1
	}

	column_count = 1;
	row_count = 1;
	setting = {
		column_count: 1,
		row_count: 1,
		column_mode: false
	}
	styleEl;
	margin_top = 4;
	
	constructor(top, make_element=false) {
		// フォントサイズを取得
		var style = window.getComputedStyle(document.documentElement);
		var fontSize = style.getPropertyValue('font-size');
		this.unit = parseInt(fontSize, 10);
		if (typeof top === 'string') {
			if (make_element) {
				console.log('virtual list :: top create element DOM element:', top);
				this.top_elm = document.createElement(top);
			} else {
				console.log('virtual list ::get  top element DOM element:', top);
				this.top_elm = document.getElementById(top);
			}
		} else if (top instanceof Element) {
			this.top_elm = top;
			console.log('top is a DOM element:', top);
		} 
		if (this.top_elm) {
			this.top_elm.style.overflow = "auto";
			this.top_elm.appendChild(this.area_elm);
			
		}
		this.top_elm.addEventListener('scroll', () => {
			this.render();
		});
		this.styleEl = document.createElement('style');
		document.head.appendChild(this.styleEl);
		
	}
	/**
	 * Sets the item click handler for the object.
	 *
	 * @param {function} handler - The function to be called when an item is clicked.
	 */
	setItemClickHandler(handler) {
		this.itemClickHandler = handler;
	}
	/**
	 * Initializes the view index object.
	 *
	 * @return {void} This function does not return anything.
	 */
	init_view_index() {
		this.view_index = {
			first: -1,
			last: -1
		}
	}
	pre_build(list_data,column_mode) {
		this.area_elm.id = this.area_elm_id;
		this.list = list_data;
		this.out_area_elements.push(...this.area_elm.children);
		this.area_elm.innerHTML = "";
		this.in_area_elements.length = 0;
		this.setting.column_mode = column_mode;
		this.build_rect =  window.convertToPixels(this.top_elm, this.item_rect);
	}
	build(list_data,column_mode = false) {
		this.pre_build(list_data,column_mode);
		this.list = list_data;
		const item_count = this.list.length;
		const mode = this.mode;
		const top_elm = this.top_elm;
		const parent_rect = top_elm.getBoundingClientRect();
		const {width, height} = this.build_rect;
        
		
		// カラムモード
		if ( column_mode) {
			console.log("column mode");
			this.column_count = Math.floor(parent_rect.width / width);
			this.row_count = Math.ceil(item_count / column_count);
			const area_height = this.row_count * height;
			this.area_elm.style.height = `${area_height}px`;
			this.item_mode_class = this.column_mode_class;
		} 
		// 行モード
		else  {
			console.log("row mode");
			this.item_mode_class = this.row_mode_class;
			this.row_count = item_count;
			const area_height = item_count * height;
			this.area_elm.style.height = `${area_height}px`;
			this.column_count = 1;
		}
		this.area_elm.className = this.item_mode_class;

	}

	determineVisibleItems() {
		const viewHeight = this.top_elm.clientHeight; // Viewport height
		const scrollTop = this.top_elm.scrollTop; // Current scroll position
	
		// area elements index
		const first = Math.floor(scrollTop / this.build_rect.height) * this.column_count;
		const last = Math.min(
			first + (Math.ceil(viewHeight / this.build_rect.height) + 1) * this.column_count,
			this.list.length
		);
		if (first !== this.view_index.first || last !== this.view_index.last) {
			this.view_index = { first, last };
			return true;
		}
		return false;
	
	}
	createItem(index, row, column) {
		// 要素を表示して正しい位置に配置
		var itemElm = null;
		if (this.out_area_elements.length > 0) {
			itemElm = this.out_area_elements.shift();
			itemElm.removeEventListener('click', this.itemClickHandler);
		} else {
			itemElm = document.createElement(this.item_tag);
			itemElm.style.position = 'absolute';
			const span = document.createElement('span');
			itemElm.span = span;
			itemElm.appendChild(span);
			// set class names
			// span.className = 'd-flex border-bottom ml-2 mr-2 flex-items-start';
		}
		const itemClickHandler = this.itemClickHandler;
		itemElm.span.textContent =  this.list[index];;
		itemElm.addEventListener('click', itemClickHandler);
		// 要素に行と列の情報を割り振りながら in_area_elements に追加する
		const {width, height} = this.build_rect;
		// 要素に行と列の情報を設定
		itemElm.style.left = `${column * width}px`;
		itemElm.style.top = `${row * height + this.margin_top}px`;
		itemElm.dataset.row = row;
		itemElm.dataset.col = column;
		if (!this.setting.column_mode ) {
			itemElm.style.height = `${this.item_rect.height}${this.item_rect.height_unit}`;
		}
		return itemElm;
	}
	render() {
		if (!this.determineVisibleItems()) {
		  return;
		}
		console.log("change view area");
		const { first, last } = this.view_index;
		
		// 表示されているアイテムを更新する前に、古いアイテムを削除
		this.in_area_elements = this.in_area_elements.filter(item => {
		  const index = parseInt(item.dataset.index, 10);
		  if (index < first || index >= last) {
			if (item.parentNode === this.area_elm) {
				
				this.area_elm.removeChild(item);
			}
			this.out_area_elements.push(item);
			return false; // このアイテムはもはや表示範囲内にないため、in_area_elementsから削除
		  }
		  return true; // 表示範囲内にあるアイテムは保持
		});
	  
		for (let i = first; i < last; i++) {
		  const column = i % this.column_count;
		  const row = Math.floor(i / this.column_count);
		  // すでに表示されているアイテムかどうかをチェック
		  const existingItem = this.area_elm.querySelector(`[data-index="${i}"]`);
		  if (!existingItem) {
			// アイテムが存在しない場合は新しく作成して追加
			const newItem = this.createItem(i, row, column);
			newItem.dataset.index = i; // アイテムにインデックスを設定
			this.area_elm.appendChild(newItem);
			this.in_area_elements.push(newItem);
		  }
		}
	  
		// ソートされた要素をDOMに再挿入
		this.in_area_elements.sort((a, b) => {
		  const indexA = parseInt(a.dataset.index, 10);
		  const indexB = parseInt(b.dataset.index, 10);
		  return indexA - indexB;
		}).forEach(item => this.area_elm.appendChild(item));
	  }
}

window.virtual_list = virtual_list;


window.convertToPixels = (element, dimensions) =>{
	// 要素の計算されたスタイルを取得
	const style = window.getComputedStyle(element);
  
	// widthとheightをピクセル単位で取得する関数
	function getPixels(value, unit) {
	  if (unit === 'px') {
		// すでにピクセル単位の場合はそのまま数値を返す
		return parseFloat(value);
	  } else if (unit === 'rem') {
		// remをピクセルに変換
		const fontSize = parseFloat(style.getPropertyValue('font-size'));
		return fontSize * parseFloat(value);
	  } else if (unit === 'em') {
		// emをピクセルに変換
		const fontSize = parseFloat(style.getPropertyValue('font-size'));
		return fontSize * parseFloat(value);
	  } else if (unit === '%') {
		// パーセントをピクセルに変換（親要素に対する相対的な値）
		const parentStyle = window.getComputedStyle(element.parentNode);
		const parentSize = parseFloat(parentStyle.getPropertyValue('width'));
		return (parentSize * parseFloat(value)) / 100;
	  }
	  // 他の単位についても必要に応じて変換ロジックを追加する
	  // 未知の単位の場合はnullを返す
	  return null;
	}
  
	// widthとheightをピクセル単位に変換
	const widthInPixels = getPixels(dimensions.width, dimensions.width_unit);
	const heightInPixels = getPixels(dimensions.height, dimensions.height_unit);
  
	return {
	  width: widthInPixels,
	  height: heightInPixels
	};
  }