window.onload = function () {
	document.body.oncontextmenu = function (e) {
		e.preventDefault();
	};
};

var storageLength = window.localStorage.length;
var insert = document.querySelector("#insert");
var contentInput = document.querySelector("#contentInput");
var content = document.querySelector("#content");
var clear = document.querySelector("#clear");

let src = null;
let srcContent = null;

contentInput.onfocus = () => {
	contentInput.addEventListener("keydown", fn);
};
contentInput.onblur = () => {
	contentInput.removeEventListener("keydown", fn);
};
function fn(e) {
	if (e.keyCode == 13 && e.ctrlKey) {
		insert.click();
		contentInput.innerText = "";
	}
}
contentInput.focus();
insert.onclick = insertFn;
clear.onclick = clearFn;

// 插入list
let arr = [];
let gettext = JSON.parse(localStorage.getItem("list"));
if (gettext) {
	arr = gettext;
	for (let i = 0; i < gettext.length; i++) {
		contentInsertChild(content, gettext[i]);
	}
} else arr = [];
// 节流
let insertFlag = true;
function insertFn() {
	if (insertFlag && contentInput.innerText.trim() != "") {
		insertFlag = false;
		contentInsertChild(content, contentInput.innerText.trim());
		arr.push(contentInput.innerText.trim());
		localStorage.setItem("list", JSON.stringify(arr));

		contentInput.innerText = "";
		setTimeout(() => {
			insertFlag = true;
		}, 500);
	} else if (contentInput.innerText.trim() == "") alert("输入内容为空");
}

// 插入节点
function contentInsertChild(content, str) {
	let temp = document.createElement("div");
	temp.className = "contentChild";
	temp.setAttribute("list-index", content.childNodes.length + 1);

	temp.draggable = "true";
	temp.ondragstart = function () {
		src = this;
		srcContent = this.innerHTML;
	};
	temp.ondragover = function (e) {
		e.preventDefault();
	};
	temp.ondrop = function (e) {
		e.preventDefault();
		src.innerHTML = e.target.innerHTML;
		e.target.innerHTML = srcContent;

		let temp1 = src.getAttribute("list-index") - 1;
		let temp2 = e.target.getAttribute("list-index") - 1;
		[arr[temp1], arr[temp2]] = [arr[temp2], arr[temp1]];

		localStorage.setItem("list", JSON.stringify(arr));
	};
	temp.innerText = str;
	temp.oncontextmenu = function (e) {
		e.preventDefault();
		if (e.button == 2) {
			let tempMenu = document.querySelector(".rightMenu");
			tempMenu == null ? null : document.body.removeChild(tempMenu);

			let menu = document.createElement("div");
			menu.className = "rightMenu";
			menu.style.left = e.pageX + "px";
			menu.style.top = e.pageY + "px";

			let menuClear = document.createElement("div");
			menuClear.className = "menuClear";
			menuClear.innerHTML = "删除";

			menuClear.onclick = function () {
				let tempIndex = temp.getAttribute("list-index");
				for (let i = tempIndex; i < arr.length; i++) {
					temp.parentNode.childNodes[i].setAttribute("list-index", i);
				}
				arr.splice(tempIndex - 1, 1);
				localStorage.setItem("list", JSON.stringify(arr));
				temp.parentNode.removeChild(temp);
				document.body.removeChild(document.querySelector(".rightMenu"));
			};

			menu.appendChild(menuClear);
			document.body.appendChild(menu);
		}
	};
	content.appendChild(temp);
}

// 清空本地存储 节流
let clearFlag = true;
function clearFn() {
	if (clearFlag) {
		clearFlag = false;
		localStorage.clear();
		arr = [];
		empty(content);
		setTimeout(() => {
			clearFlag = true;
		}, 1000);
	}
}

// 清空子元素
function empty(obj) {
	while (obj.firstChild != null) {
		obj.removeChild(obj.firstChild);
	}
}

// 防抖
// let timer = null;
// function insertFn() {
// 	timer && clearTimeout(timer);
// 	timer = setTimeout(() => {
// 		console.log(2);
// 	}, 500);
// }
