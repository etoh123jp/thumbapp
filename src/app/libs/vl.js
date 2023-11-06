class VirtualListView {
	constructor(container, dataItems, itemHeight, columnMode, onBeforeRender) {
	  this.container = container;
	  this.dataItems = dataItems;
	  this.itemHeight = itemHeight;
	  this.columnMode = columnMode;
	  this.onBeforeRender = onBeforeRender;
	  this.visibleItemCount = 0;
	  this.columnCountAuto = 0;
	  this.startIndex = 0;
  
	  this.scrollContainer = document.createElement('div');
	  this.scrollContainer.style.overflow = 'auto';
	  this.scrollContainer.style.height = '100%';
	  this.scrollContainer.style.width = '100%';
	  this.container.appendChild(this.scrollContainer);
  
	  this.scrollContainer.addEventListener('scroll', () => {
		this.startIndex = Math.floor(this.scrollContainer.scrollTop / this.itemHeight);
		this.rearrangeItems();
	  });
  
	  window.addEventListener("resize", () => {
		if (this.columnMode === "auto") {
		  this.calculateColumnCount();
		  this.rearrangeItems();
		}
	  });
  
	  this.rearrangeItems();
	  if (this.columnMode === "auto") {
		this.calculateColumnCount();
	  }
	}
  
	rearrangeItems() {
	  const containerHeight = this.scrollContainer.clientHeight;
	  this.visibleItemCount = Math.ceil(containerHeight / this.itemHeight);
	  this.scrollContainer.innerHTML = "";
  
	  for (let i = 0; i < this.visibleItemCount; i++) {
		const itemIndex = this.startIndex + i;
		if (itemIndex < this.dataItems.length) {
		  if (typeof this.onBeforeRender === 'function') {
			this.onBeforeRender(itemIndex);
		  }
		  const item = document.createElement("div");
		  item.classList.add("list-item");
		  item.style.height = this.itemHeight + "px";
		  item.textContent = this.dataItems[itemIndex];
		  item.style.position = 'absolute';
		  item.style.top = (i * this.itemHeight) + "px";
		  this.scrollContainer.appendChild(item);
		}
	  }
	}
  
	calculateColumnCount() {
	  const containerWidth = this.scrollContainer.clientWidth;
	  this.columnCountAuto = Math.floor(containerWidth / this.itemHeight);
	}
  }