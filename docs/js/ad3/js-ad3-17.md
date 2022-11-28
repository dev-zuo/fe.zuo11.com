---
title: 17. 事件 - JS高程4
description: JavaScript 与 HTML 页面之间的交互是通过 **事件** 实现的，可以使用 on、addEventLinstener 订阅某个事件的处理程序，事件发生时就会执行该事件。在传统软件工程领域，这种模型叫 "观察者模式"。事件流描述了页面接收事件的顺序。IE 和 Netscape 开发团队提出了完全相反的事件流方案，IE 支持事件冒泡，Netscape 支持事件捕获。
keywords: JS事件,事件,DOM事件,HTML事件,模拟事件
---
# 17. 事件
JavaScript 与 HTML 页面之间的交互是通过 **事件** 实现的，可以使用 on、addEventLinstener 订阅某个事件的处理程序，事件发生时就会执行该事件。在传统软件工程领域，这种模型叫 "观察者模式"。
## 事件流
**事件流** 描述了页面接收事件的顺序。IE 和 Netscape 开发团队提出了完全相反的事件流方案，IE 支持事件冒泡，Netscape 支持事件捕获。
- 事件冒泡，IE 事件流，如果单击了 div 元素，最先触发 div 元素的 click 事件，然后事件会一级一级向父节点传递（冒泡），一直到document => window(IE9及其他浏览器)
- 事件捕获，Netscape 团队提出的，如果单击了div元素，事件捕获过程中，document对象（或 window）先接收到 click 事件，然后逐级向子节点传递，一直到 div。由于旧版本浏览器不支持事件捕获，实际中，基本不会使用事件捕获，建议使用事件 **冒泡**，特殊情况可以使用事件捕获。
- DOM事件流，DOM2 Events规范规定事件流包括三个阶段：事件捕获阶段、到达目标阶段、事件冒泡阶段。事件捕获最先发生，为提前拦截事件提供了机会，然后是实际的目标元素接收到事件，最后一个阶段是冒泡。

![事件](/images/js/event.png)

下面的例子中，使用 onclick 和 addEventListener 监听了各个元素的 click 事件，包含冒泡和捕获阶段。
```html
<div id="div">Click Me!</div>
<script>
  let div = document.querySelector('#div')
  div.onclick = e => console.log('div onclick')
  document.body.onclick = e => console.log('body onclick')
  document.documentElement.onclick = e => console.log('html onclick')
  document.onclick = e => console.log('document onclick')
  window.onclick = e => console.log('window onclick')

  window.addEventListener('click', e => console.log('window click / 捕获'), true)
  window.addEventListener('click', e => console.log('window click / 冒泡'))
  document.addEventListener('click', e => console.log('document click / 捕获'), true)
  document.addEventListener('click', e => console.log('document click / 冒泡'))
  document.documentElement.addEventListener('click', e => console.log('html click / 捕获'), true)
  document.documentElement.addEventListener('click', e => console.log('html click / 冒泡'))
  document.body.addEventListener('click', e => console.log('body click / 捕获'), true)
  document.body.addEventListener('click', e => console.log('body click / 冒泡'))
  div.addEventListener('click', e => console.log('div click / 捕获'), true)
  div.addEventListener('click', e => console.log('div click / 冒泡'))
</script>
```
击 div 后 Chrome/Firefox/Safari 顺序基本一致
```js
// window click / 捕获
// document click / 捕获
// html click / 捕获
// body click / 捕获
// div onclick
// div click / 捕获
// div click / 冒泡
// body onclick
// body click / 冒泡
// html onclick
// html click / 冒泡
// document onclick
// document click / 冒泡
// window onclick
// window click / 冒泡
```
## 事件处理程序
事件是用户或浏览器自身执行的某种动作，如：click，load，mouseover 等。为响应某个事件调用的函数被称为**事件处理程序** (或**事件监听器**)，一般以 "on" 开头，如click 的事件处理程序就是 onclick。为事件指定处理程序的方法有多种。
### HTML 事件处理程序
HTML 元素内部指定处理方法
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>测试HTML事件</title>
  </head>
  <body>
  	<!-- Example1: 按钮名称为Click Me，输出Clicked -->
    <input type="button" value="Click Me" onclick="alert('Clicked')">
    
    <!-- Example2: 绑定事件函数，输出Hello world! -->
    <input type="button" value="Click Me2" onclick="showMessage()">

    <!-- Example3: 可以访问event对象，输出click -->
    <input type="button" value="Click Me3" onclick="alert(event.type)">

    <!-- Example4: this对象，输出Click Me4 -->
    <input type="button" value="Click Me4" onclick="alert(this.value)">

    <script type="text/javascript">
    	function showMessage() {
    		alert('Hello world!')
    	}
    </script>
  </body>
</html>
```
### DOM0 事件处理程序
在 DOM0 中，JavaScript 指定事件处理程序的传统方式是把一个函数赋值给(DOM 元素的)一个事件处理程序属性。属性名一般是 on 加上事件名称，例如: onclick。
```js
let btn = document.getElementById('myBtn');
// 添加事件处理程序，事件处理程序内部，this 指向元素本身
btn.onclick = function() { 
  alert('Clicked');
  alert(this.id); // "myBtn"
};
setTimeout(()=> {
  // 移除事件处理程序
  btn.onclick = null; 
}, 5000)
```
### DOM2 事件处理程序
DOM2 Events 定义了两个方法用于处理指定事件、或删除对应的处理事件
- element.addEventListener(事件类型，处理函数,捕获阶段调用true/冒泡阶段调用false)，为了最大限度兼容各种浏览器，默认为 false，在冒泡阶段添加事件处理程序。
- element.removeEventListener(事件类型, 处理函数的引用, true(捕获)或false(冒泡))，默认为 false
```js
// 如果绑定了多个事件，会按顺序执行
let btn = document.getElementById('myBtn');
btn.addEventListener('click', function() {
  alert(this.id)
}, false);
btn.addEventListener('click', function() {
  alert('Hello world!')
}, false);

// 移除事件绑定，需要传入与addEventListener里传入的事件相同的函数
let btn = document.getElementById('myBtn');
let handler = function() {
  alert(this.id);
};
btn.addEventListener('click', handler, false);

setTimeout(()=> {
  btn.removeEventListener('click', handler, false)
}, 8000)
```
大部分情况都会把事件处理程序注册到冒泡阶段，兼容性好。如果把处理程序注册到捕获阶段，一般是用于在事件到达其指定目标前拦截，如果不需要拦截，则不要使用事件捕获。
### IE 事件处理程序
IE 中有两个事件处理程序：attachEvent("on+事件类型",事件处理程序)、detachEvent("on+事件类型", 事件处理程序的引用)。分别用于为元素添加事件处理程序，移除事件处理程序。需要注意以下几点：
- 由于 IE8 及更早版本只支持事件冒泡，attachEvent() 添加的事件处理程序会添加到冒泡阶段。
- IE5-IE10 支持, IE11及其他浏览器都不支持。
- 与 addEventListener 不同的是：1. 事件类型前面需要加 on 2.同一元素添加多个相同事件处理程序时，执行顺序是添加顺序的逆序。3. this 不是指向元素，而是指向全局的 window
```js
var btn = document.getElementById('myBtn');
btn.attachEvent('onclick', function() {
  alert('Clicked');
  this === window // true
});

// 移除事件
var btn = document.getElementById('myBtn');
var handler = function () {
  alert('Clicked');
};
btn.attachEvent('onclick', handler);
setTimeout(function() {
  btn.detachEvent('onclick', handler);
}, 8000)
```
### 跨浏览器事件处理程序
为考虑IE兼容性，需要封装一个函数，作为通用事件处理函数
```js
var EventUtil = {
  addHandler: function(element, type, handler) {
    if (element.addEventListener) { // 如果支持 DOM2
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) { // IE10 及以下版本
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  removeHandler: function(element, type, handler) {
    if (element.removeEventListener) { // 如果支持 DOM2
     element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) { // IE10及以下版本
     element.detachEvent("on" + type, handler);
    } else {
     element["on" + type] = null;
    }
  }
};

var btn = document.getElementById('myBtn');
var handler = function () {
  alert('Clicked');
};

EventUtil.addHandler(btn, "click", handler);

setTimeout(function() {
  EventUtil.removeHandler(btn, 'click', handler);
}, 8000)

```
### DOM0 和 DOM2 事件处理程序区别
DOM0 和 DOM2 事件处理程序区别：
- **事件触发阶段** DOM2 事件处理程序可以选择触发的阶段(冒泡阶段、捕获阶段)，而 DOM0 只能在冒泡阶段被处理
- **添加多个相同的事件** DOM2 事件处理程序可以添加多个相同的事件处理程序，比如可以添加两个 click 事件，按顺序触发。DOM0 添加多个相同的处理程序时，后面的会覆盖前面的。
- **兼容性** DOM2 事件处理程序 IE9+ 支持，DOM0 所有浏览器都支持

## 事件对象 event
在触发 DOM 上的某个事件时，会产生一个事件对象 event，包括导致事件的元素、事件的类型等。
### DOM 事件对象
在 DOM 合规的浏览器中，event 对象是传给事件处理程序的唯一参数，一般是只读的。不同的事件生成的事件对象也会包含不同的属性和方法。下面是所有时间对象都会包含的公共属性和方法：

属性或方法 | 类型 | 说明
--- | --- | ---
type | 字符串 | 事件类型，比如 'click'、'scroll'
bubbles | 布尔值 | 事件是否冒泡
cancelable | 布尔值 | 是否可以取消事件的默认行为
detail | 整数 | 事件相关的其他信息
currentTarget | Element | 当前事件处理程序所在的元素
target | Element | 事件目标
eventPhase | 整数 | 表示调用事件处理程序的阶段：1 捕获阶段、2 到达目标、3 冒泡阶段
preventDefault() | 函数 | 取消事件的默认行为，前提条件是 cancelable 为 true
stopPropagation() | 函数 | 取消所有后续事件捕获/事件冒泡，前提条件是 bubbles 为 true
defaultPrevented | 布尔值 | 如果为 true，表示已经调用 preventDefault() DOM3 Events 新增
stopImmediatePropagation() | 函数 | 取消所有后续事件捕获或事件冒泡，并阻止调用任何后续事件处理程序，DOM3 Events 新增

在事件处理程序内部，this 对象始终指向 currentTarget，而 target 值包含事件的实际目标。 如果为 body 监听了点击事件，点击了 body 内的 button，event.target 就是 button 元素，event.currentTarget 就是 body 元素

```js
var btn = document.getElementById('myBtn');
btn.onclick = function(event) {
  alert(event.type); // "click"
  alert(event.currentTarget === this); // true
  alert(event.target === this); // true
};
btn.addEventListener('click', function(event) {
  alert(event.type); // "click"
}, false);

var btn = document.getElementById('myBtn');
document.body.onclick = function(event) {
  alert(event.currentTarget === document.body); // true
  alert(this === document.body); // true
  alert(event.target === document.getElementById('myBtn')); // true
};
```
type 属性在一个处理程序处理多个事件时很有用
```js
var btn = document.getElementById('myBtn');
var handler = function(event) {
  switch (event.type) {
    case 'click':
      alert('Clicked!');
      break;
    case 'mouseover':
      event.target.style.backgroundColor = "red";
      break;
    case 'mouseout':
      event.target.style.backgroundColor = "";
      break;
  }
};
btn.onclick = handler;
btn.onmouseover = handler;
btn.onmouseout = handler;
```
preventDefault() 用于阻止特定事件的默认行为, 可以阻止 a 的跳转。
```js
var link = document.getElementById('myLink');
link.onclick = function(event) {
  event.preventDefault();
};
```
stopPropagation() 用于立即住址事件流在 DOM 结构中的传播，取消后续的事件捕获/事件冒泡
```js
var btn = document.getElementById('myBtn');
btn.onclick = function(event) {
  alert("Clicked!");
  event.stopPropagation()
};
document.body.onclick = function(event) {
  alert('Body clicked'); // 不会显示
};
```
eventPhase 属性用于确定当前事件流所处的阶段。如果事件处理程序在捕获阶段被调用，eventPhase 为 1；如果事件处理程序在目标上被调用，eventPhase 为 2；如果事件处理程序在冒泡阶段被调用，eventPhase 为 3。注意：到达目标虽然是冒泡阶段发生的，但器 eventPhase 仍然等于 2
```html
<!-- 显示顺序为 1， 2， 3 -->
<button id="myBtn">点击</button>
<script>
var btn = document.getElementById('myBtn');
btn.onclick = function(event) {
  alert(event.eventPhase); // 2  处理阶段
};
document.body.addEventListener('click', function(event) {
  alert(event.eventPhase); // 1 捕获阶段
}, true);
document.body.onclick = function(event) {
  alert(event.eventPhase) // 3 冒泡阶段
};
</script>
```
### IE 事件对象
与 DOM 事件对象不同，如果是 DOM0 添加的（比如 onclik 事件），event 对象只是 window 的一个属性。如果 attachEvent 监听的就是函数的 event 参数，但也可以使用 window.event。IE 事件对象都会包含如下功能属性和方法。

属性或方法 | 类型  | 说明
--- | --- | ---
cancelBubble | Boolean | 默认为 false，设置为 true 可以取消事件冒泡。类似 DOM 中的 stopPropagation()
returnValue | Boolean | 默认为 true， 设置为 false，取消事件的默认行为，与 preventDefault() 类似
srcElement | Element | 事件的目标，与 DOM 的 target 属性类似
type | String | 事件类型

```js
// 1. IE中 DOM0 事件绑定
var btn = document.getElementById('myBtn');
btn.onclick = function() {
  var event = window.event;
  event.srcElement === this // true
  alert(event.type) // 'click'
};

// 2.IE中attachEvent绑定
btn.attachEvent('onclick', function(event) {
  alert(event.type) // 'click'
})

// 3.srcElement与this
btn.onclick = function() {
  window.event.srcElement === this // true
};
btn.attachEvent('onclick', function(event) {
  event.srcElement === this // false
});

// 4.reutrnValue, 阻止默认事件
var link = document.getElementById('myLink');
link.onclick = function() {
  window.event.returnValue = false; // 阻止链接跳转
};

// 5.cancelBubble，阻止事件冒泡
var btn = document.getElementById('myBtn');
btn.onclick = function() {
  alert('Clicked!');
  window.event.cancelBubble = true;
};
document.body.onclick = function() {
  alert('body clicked'); // 不会显示
}
```

### 跨浏览器事件对象
```js
var EventUtil = {
  // 添加处理函数
  addHandler: function(element, type, handler) {
    if (element.addEventListener) { // 如果支持 DOM2
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) { // IE10及以下版本
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  // 移除处理函数
  removeHandler: function(element, type, handler) {
    if (element.removeEventListener) { // 如果支持 DOM2
     element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) { // IE10及以下版本
     element.detachEvent("on" + type, handler);
    } else {
     element["on" + type] = null;
    }
  },
  // 获取事件对象 event
  getEvent: function (event) {
    return event ? event : window.event;
  },
  // 获取事件目标 target
  getTarget: function (event) {
    return event.target || event.srcElement;
  },
  // 阻止默认事件执行
  preventDefault: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  // 阻止冒泡
  stopPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }
};

var btn = document.getElementById('myBtn');
btn.onclick = function(event) {
  // 获取event
  event = EventUtil.getEvent(event);
  
  // 获取target
  var target = EventUtil.getTarget(event);
  
  // 阻止事件默认行为
  EventUtil.preventDefault(event);
  
  // 阻止事件冒泡
  EventUtil.stopPropagation(event);
}
```

## 事件类型
Web 浏览器中可以发生很多种事件，所发生的事件类型决定了事件对象中会保存什么信息。DOM3 Events 定义了如下事件类型:
- 用户界面事件（UIEvent）涉及与浏览器(BOM)交互的通用事件。
- 焦点事件（FocusEvent），当元素获得或失去焦点时触发
- 鼠标事件（MouseEvent），当用户通过鼠标在页面执行操作时触发
- 滚轮事件（WheelEvent），当使用鼠标滚轮（或类似设备）时触发
- 输入事件（InputEvent），当在文档中输入文本时触发
- 键盘事件（KeyboardEvent），当用户通过键盘在页面执行操作时触发
- 合成事件（CompositionEvent），在使用某种 IME（Input Method Editor，输入法编辑器） 输入字符时触发（输入法组合文字的过程中触发）

除了这些事件类型外，HTML5 还定义了另一组事件。另外还有一些非规范的专有事件，不同的浏览器会有不同的实现。
### 用户界面（UI）事件
用户界面事件不一定跟用户操作有关。这类事件在 DOM 规范出现之前就已经存在，保留是为了向后兼容。UI 事件主要有以下几种：
- `load 事件`，页面完全加载后，在 window 上触发; 当所有框架（frame）都加载完毕，在框架集（frameset）上触发; 当图像加载完毕时，在img 元素上触发; 当嵌入的内容加载完毕时，在 object 元素上触发;
- `unload 事件`，页面完全卸载后，在 window 上触发; 当所有框架(frame)都卸载后，在框架集(frameset)上触发; 当嵌入的内容卸载完毕后，在object 元素上触发; 页面完全卸载时 dom 被移除，不能再处理函数里做 dom 操作
- `resize 事件`，当窗口的大小发生改变时，在 window 或 body 上触发，一般窗口缩放超过 1px 时会触发，缩放过程中会重复触发，为了避免卡顿，需要做节流处理，减少触发的频率。
- `scroll 事件`，当用户滚动带滚动条的元素中的内容时，在 window 上触发。在混杂模式下，可以通过 body 元素检测 scrollLeft 和 scrollTop 属性的变化。在标准模式下，这些变化基本都发生在 html 元素（document.documentElement）上。同 resize，会重复触发，需要做节流处理。
- `abort 事件`，在 object 元素上当相应对象加载完成前被用户提前终止下载时触发。
- `error 事件`，当 JS 发生错误时，在 window 上触发; 无法加载图像时，在 img 元素上触发; 当无法嵌入内容时，在 object 元素上触发; 当一个或多个框架(frame)无法加载时，在框架集(frameset)上触发。第 21 章会继续讨论
- `select 事件`，当用户选择文本框（input或textarea）中的一个或多个选项时触发。

这些事件在 DOM2 Events 中都被归为 HTML Events。

根据 DOM2 Events 规范，load/unload 事件应该在 body 上触发，而非 window。但是为了向后兼容，所有浏览器都在 window 上实现了 load/unload 事件。

**load 事件**
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>测试事件类型</title>
		<script type="text/javascript" src="EventUtil.js"></script>
	</head>
	<!-- 1. body元素上的onload事件 -->
	<body onload="alert('Loaded!')">

		<!-- 3.img load事件 -->
		<img id="myImage" src="index.png" onload="alert('Image loaded')" onerror="alert('Image load error')">

		<script type="text/javascript">
			// 2.监听load事件
			EventUtil.addHandler(window, 'load', function(event) {
				alert('onload')
			});

			// 4.监听img load事件
			var image = document.getElementById('myImage');
			EventUtil.addHandler(image, 'load', function (event) {
				event = EventUtil.getEvent(event);
				alert(EventUtil.getTarget(event).src); // 显示img的src
			})
			// 依次输入的顺序，先加载图片、再window.onload，优先html元素内嵌的方法
			// Image loaded
			// file:///C:/Users/91670/Desktop/jsdemo/index.png
			// Loaded!
			// onload
		</script>
	</body>
</html>
```
window.onload 时，可以做一些操作，比如图片的预加载（img 只有设置了 src 属性，才会加载）、动态的加载 script 或 link。
```js
// 1. 创建 img 元素并加载，只有设置了 img 的 src 属性，才会下载
EventUtil.addHandler(window, 'load', function() {
	var image = new Image(); // 等价于 document.createElement('img');
	EventUtil.addHandler(image, 'load', function() {
		alert('image loaded!');
	});
	image.src = 'index.png';
	document.body.appendChild(image)
});

// 2. 动态创建加载script
EventUtil.addHandler(window, 'load', function() {
  var script = document.createElement('script');
  EventUtil.addHandler(script, 'load', function() {
  		alert('script loaded!');
  	});
  script.src = 'test.js';
  document.body.appendChild(script);
});

// 3. 动态创建加载css
EventUtil.addHandler(window, 'load', function() {
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  EventUtil.addHandler(link, 'load', function() {
  		alert('css loaded!');
  	});
  link.href = 'test.css';
  document.getElementsByTagName('head')[0].appendChild(link);
});
```

**unload 事件**
```js
EventUtil.addHandler(window, 'unload', function() {
  console.log('页面unload');
});
// 或者 <body onunload="alert(unloaded!)">

```
**resize事件**
```js
EventUtil.addHandler(window, 'resize', function() {
  console.log(`Resized, innerHeight: ${window.innerHeight}, innerWidth: ${window.innerWidth}`)
});
```
**scroll事件**
```js
// 顶部类似阮一峰ES6网页的滚动进度条
// <div id="posTop" style="position: fixed;top:0;height:2px;background: blue;"></div>
// 右下角滚动百分比
// <div id="pos" style="display:none;position:fixed;bottom: 100px;right:20px;padding:10px;background: #333;color:white;width:40px;text-align: center;border-radius:5px;"></div>

window.addEventListener('scroll', function(e) {
  let scrollTop = document.documentElement.scrollTop;
  let total = document.documentElement.scrollHeight - window.innerHeight;
  let persentage = parseInt(scrollTop/total*100);
  console.log(scrollTop);  

  document.getElementById('pos').style.display = scrollTop === 0 ? 'none' : 'block';
  document.getElementById('pos').innerHTML = `${persentage}%`;
  document.getElementById('posTop').style.width = `${persentage}%`;
}, false)
```


### 焦点事件
焦点事件在页面元素获得或失去焦点时触发。这些事件可以与 document.hasFocus() 和 document.activeElement 一起使用，焦点事件有以下几种：
- `blur 事件`，在元素失去焦点时触发，不会冒泡
- `focus 事件`，在元素得到焦点时触发，不会冒泡
- `focusin 事件`，在元素获得焦点时触发，是 focus 事件的冒泡版（IE 后来新增，为了支持冒泡）
- `focusout 事件`，在元素失去焦点时触发，是 blur 的通用版（IE 后来新增，为了支持冒泡）

当焦点从一个元素移动到另一个元素，会依次触发下列事件
1. focusout 在失去焦点的元素上触发
2. focusin 在获得焦点的元素上触发
3. blur 在失去焦点的元素上触发
4. focus 在获得焦点的元素上触发

### 鼠标与滚轮事件
**鼠标事件** 是 web 开发中最常用的一组事件。DOM3 Events 定义了 9 种鼠标事件：
- mouseover 鼠标移动到区域时触发，无法通过键盘触发
- mouseenter 鼠标移动到区域时触发，DOM3 Events 新增，不冒泡，移动到子元素不会触发
- mouseout  鼠标移出区域时触发，无法通过键盘触发
- mouseleave 鼠标移出区域时触发，DOM3 Events 新增，不冒泡，移出子元素时不会触发
- mousedown 鼠标点击按下，鼠标左键、右键、滚轮键都会触发，建议**不要取消默认行为，否则会导致 click 不触发**，无法通过键盘触发
- mouseup 鼠标点击按下后弹起，鼠标左键、右键、滚轮键都会触发，建议**不要取消默认行为，否则会导致 click 不触发**，无法通过键盘触发
- click 鼠标左键点击或者按键盘回车键时触发。主要是基于无障碍的考虑，让键盘和鼠标都可以触发 onclick 事件处理程序。
- dblclick 只有触发了两次 click，才会触发 dblclick，如果 click 取消了默认行为 e.preventDefault()，不会触发该事件。
- mousemove 在 div 区域移动时，反复的触发，event 里面会有对应的坐标，无法通过键盘触发

使用下面的例子，来测试上面事件的触发顺序
```html
<div id="myDiv" style="width:100px;height:100px;border:5px solid #ccc;"></div>
<script>
  let myDiv = document.getElementById('myDiv')
  myDiv.addEventListener('mousedown', () => console.log('mousedown'))
  myDiv.addEventListener('mouseup', () => console.log('mouseup'))
  myDiv.addEventListener('click', () => console.log('click'))
  myDiv.addEventListener('dblclick', () => console.log('dblclick'))
  myDiv.addEventListener('mouseover', () => console.log('mouseover'))
  myDiv.addEventListener('mouseout', () => console.log('mouseout'))
  myDiv.addEventListener('mouseenter', () => console.log('mouseenter'))
  myDiv.addEventListener('mouseleave', () => console.log('mouseleave'))
  myDiv.addEventListener('mousemove', () => {
    console.log('mousemove')
    console.log(event)
  })
</script>
```
**鼠标移入div，再出来**，打印顺序：mouseover; mouseenter;大量mousemove; mouseout; mouseleave; 

**鼠标左键点击**，打印顺序：mousedown; mouseup; click;

**鼠标左键双击**，打印顺序：mousedown; mouseup; click；mousedown; mouseup; click；dblclick;

鼠标事件在 DOM3 Events 中对应的类型是 MouseEvent，而不是 MouseEvents

**鼠标事件位置信息** 
- clientX，clientY，client区是浏览器可视区域
- screenX, screenY, 是相对桌面屏幕的位置
- pageX，pageY 是相对页面的位置，如果没有滚动的情况下，和 client 是一致的。e.pageX = document.documentElement.scrollLeft + e.clientX
- offsetX, offsetY 是相对于目标元素边界的 x、y 坐标（仅 IE 支持）

![client与screen位置信息](/images/js/client.png)

**修饰键(鼠标点击+ 键盘Alt、Ctrl、Shift、win键)** IE9+ 都支持，IE8 及之前版本不支持 metakey
- e.altKey，Boolean 是否按下了 Alt 键
- e.ctrlKey，Boolean 是否按下了 Ctrl 键
- e.shiftKey，Boolean 是否按下了 Shift 键
- e.metaKey，Boolean 是否按下了 win 键

click事件，点击时是否按下了某个键盘键
```js
EventUtil.addHandler(myDiv, 'click', function(e) {
  let keys = [];
  e = EventUtil.getEvent(e);
  e.shiftKey && keys.push('shift')
  e.ctrlKey && keys.push('ctrl')
  e.altKey && keys.push('alt')
  e.metaKey && keys.push('meta')
  console.log(keys.join(','))
});	
```
**相关元素**，对 mouseover 和 mouseout 而言，还存在与事件相关的元素。他们都涉及将光标从一个元素，移入到另一个元素。mouseover 目标元素是移入的元素，相关元素是移出的元素。mouseout 目标元素是移出的元素，相关元素是移入的元素。

相关元素一般是 event.relatedTarget，只有 mouseover 和 mouseout 事件才有值，其他事件值为 null。IE8 及更早的版本中，不支持这个属性，IE 会提供 event.toElement(mouseout事件) 或 event.fromElement(mouseover事件) 两个属性。

**鼠标按键**，event.button 属性, mousedown 或 mouseup，判断点击的是鼠标左/主键(0)、右键(2)、中间滚轮键(1)。IE8+ 支持。IE8 及更早的版本的 button 属性适配代码第 4 版已删除。下面是对应的代码
```js
// 根据button属性，来判断是否点击了右键，阻止默认事件。
var EventUtil = {
   // 省略其他代码
   getButton: function(event) {
     if (document.implementation.hasFeature('MouseEvents', '2.0')) {
       return event.button;
     } else {  // IE8及之前的版本，兼容处理
       switch (event) {
         case 0:
         case 1:
         case 3:
         case 5:
         case 7:
            return 0;
         case 2:
         case 6:
            return 2;
         case 4:
            return 1;
       }
     }
   }
}
```

**额外的事件信息** DOM2 Events 在对象上提供了 detail 属性，对鼠标事件来说，detail 包含一个数值，表示在给定位置上发生了多少次单击。detail 的 值从 1 开始，每次单击会加 1。如果鼠标在 mousedown 和 mouseup之间移动了，detail 会重置为 0。

IE 还为每个鼠标提供了一些额外属性，比如 altLeft, curlLeft, offsetX, offsetY 等，不过仅 IE 支持，可以忽略不计。

**mousewheel 事件** 鼠标滚轮事件，chrome里面测试，event.wheelDelta 一次滚动 120，但页面滚动距离是100。非标准，FireFox不支持，它是用 DOMMouseScroll 替代。非标准特性，不建议使用，参考：[Element: mousewheel event - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousewheel_event)

**触摸设备** 
- dblclick 不支持，双击浏览器会放大页面
- 单指点击屏幕上的可点击元素，会触发 mousemove 事件，然后相继触发 mousedown, mouseup 和 click 事件。
- mousemove 也会触发 moseover 和 mouseout 事件
- 手指滚动页面时，会触发 mousewheel, scroll 事件

**无障碍访问**，如果 Web 应用或网站必须考虑残障人士，特别是使用屏幕阅读器的用户。按回车可以触发 click 事件，其他鼠标事件不能通过键盘触发。建议不要使用 click 事件外的其他鼠标事件向用户提示功能。需要注意：
- 使用 click 事件执行代码
- 不要使用 mouseover 向用户显示新选项
- 不要使用 dbclick 执行重要操作，因为键盘不能触发这个事件。

遵循这些简单的建议，可以极大提升 Web 应用或网站对残障人士的无障碍性。更多相关信息可以参考：WebAIM 网站。
### 键盘与输入事件
键盘事件
- keydown 用户按下键盘上某个键时触发，如果持续按会重复触发。
- keypress 用户按下某个键并产生字符时触发，持续按会重复触发。Esc 也会触发该事件，DOM3 废弃了 keypress 事件，推荐 textInput 事件。
- keyup 用户释放键盘上的某个键时触发。

输入事件只有一个 textInput。是对 keypress 的扩展，用于文本显示给用户之前更方便拦截文本输入。textInput 在文本插入到文本框之前触发。

对于字符按键，按下某个键后，依次打印 keydown, keypress, keyup，如果长按某个键，一次打印 keydown, keypress, keydown, keypress, keydown, keypress, keyup。注意：keydown、keypress 事件会在文本框出现变化之前触发。keyup 会在文本框内容出现变化之后触发。

对于非字符按键，按下某个键后，依次触发 keydown, keyup。如果长按不放，重复触发 keydown，抬起后触发 keyup

**event.keyCode（键码）**, keydown/keyup 里的 event.keyCode 对于数字和字母键，keycode 的值与小写字母和数字的 ASCII 编码一致，参见 p519

**event.charCode（字符编码、ASCII码，小写a 97, 大写A 65， 0 48）** keypress 事件的 event 对象里，有 charCode 值，是按下的键对应的 ASCII 码

DOM3 支持 **event.key**，就是按下键的名称，比如 "k", "M" 等。

```html
<script>
  document.addEventListener('keypress', (event) => {
    console.log(event)
  })
</script>
<!-- 
按 1：event { charCode: 49, code: "Digit1", key: "1", keyCode: 49 }
按 a：event { charCode: 97, code: "KeyA", key: "a", keyCode: 97 }
按 M：event { charCode: 77, code: "KeyM", key: "M", keyCode: 77 }
-->
```

**textInput事件**，只有在可编辑区域中输入字符时才会触发这个事件。 IE9+ 支持，event 对象上还有一个名为 inputMethod 属性。表示向控件中输入文本的方式，支持如下值
- 0 表示不确定输入方法
- 1 键盘
- 2 粘贴
- 3 拖放操作
- 4 IME
- 5 表单选项
- 6 手写
- 7 语音
- 8 组合方式
- 9 脚本 

```js
// <input type="text" placeholder="测试">
// 如果input中输入f，依次触发事件  keydown、keypress、textInput、keyup
// evnet.data的值为输入的值如果改写会覆盖
var textbox = document.getElementById("myText");
EventUtil.addHandler(textbox, "textInput", function(event) {
  event = EventUtil.getEvent(event);
  if (event.data !== 'a') { // 只能输入a，其他字符串都不能输入
    event.preventDefault(); // 如果阻止默认事件，则不会输入
  }
  alert(event.data);
});
```

**复合事件**，IME 输入法组合文字的过程中触发，compositionstart，compositionupdate，compositionend。参考：
- [输入法组合文字事件compositionstart等不能用on监听 - dev-zuo 技术日常](http://www.zuo11.com/blog/2020/9/oncompositionstart_issue.html)
- [v-model为什么不能监听中文输入法实时输入，内部是怎么实现的？ - dev-zuo 技术日常](http://www.zuo11.com/blog/2019/12/v_model_text.html)

### 变化事件(dom mutation)
DOM2 的变化事件是为了在 DOM 发生改变时提供通知，由于性能问题已废弃，第四版已删除相关内容。 由 Mutation Observers 取代。参考：[MutationObserver 接口 - 14. DOM | JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-14.html#mutationobserver-%E6%8E%A5%E5%8F%A3) 

### HTML5 事件
**contextmenu 事件**，右键点击时触发，默认行为是弹出上下文菜单，如果阻止该事件的默认行为，可以自定义右键菜单, 浏览器基本都支持
```html
<div id="myDiv">
  Right click or Ctrl+click me to get a custom context menu.
</div>
<div id="myMenu" style="position: absolute;visibility: hidden;background-color: silver">
  <li><a href="#a">Item1</a></li>
  <li><a href="#b">Item2</a></li>
  <li><a href="#c">Item3</a></li>
</div>
<script>
  window.addEventListener('load', (evnet) => {
    let div = document.getElementById('myDiv');
    // 右键点击事件， 自定义右键菜单
    div.addEventListener("contextmenu", (event) => {
      console.log('contextmenu');
      event.preventDefault(); 

      var menu = document.getElementById('myMenu');
      menu.style.left = event.clientX + 'px';
      menu.style.top = event.clientY + 'px';
      menu.style.visibility = 'visible';
    });
      
    document.addEventListener('click', (event) => {
      document.getElementById('myMenu').style.visibility = 'hidden';
    })
  })
</script>
```
**beforeunload 事件**，当页面关闭时触发。下面 return message 自定义消息已废弃。详情参见：[Window: beforeunload event | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)，在 Chrome 中只有当页面有输入的光标时(比如打开 console 时)，才会弹出 "离开此网站？系统可能不会保存您所做的更改。"
```js
window.addEventListener('beforeunload', function(event) {
  // Cancel the event as stated by the standard.
  event.preventDefault();
  // Older browsers supported custom message
  event.returnValue = '';
})
```

**DOMContentLoaded 事件**，在 window.load 之前执行，在形成完整的 DOM 树之后会触发，不用等待图片、js 文件、css 文件其他资源是否加载完成, IE9+ 支持。可以在外部资源下载的同时就能指定事件处理程序，让用户能够更快的与页面交互。
```js
document.addEventListener('DOMContentLoaded', function(event) { 
  alert('Content loaded');
})
```

**readystatechange 事件**，提供文档或元素加载状态的信息，行为有时候并不稳定。该事件 event 对象上有一个 readyState 属性，其值可能是：
- `uninitialized` 对象存在并尚未初始化
- `loading` 对象正在加载数据
- `loaded` 对象已经加载完数据
- `interactive` 对象可以交互，但尚未加载完成
- `complete` 对象加载完成

一般正常的顺序是：readystate: interactive => DOMContentLoaded => readystate: complete => load。但不同的页面，事件顺序可能不同，有时后 complete 会早于 interactive。为了抢占较早的时机，需要同时检测交互阶段和完成阶段。

```js
document.addEventListener('readystatechange', (event) => {
  let state = document.readyState
  if (state === 'interactive' || state === 'complete') {
    document.removeEventListener('readystatechange', arguments.callee)
    console.log('Content loaded')
  }
})
```

参考：[Document: readystatechange event | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event)

**pageshow 与 pagehide事件**，这个两个事件需要在 window 上监听，目标是 document。load 事件之后，再触发 pageshow，unload 之前触发 pagehide。主要是如果页面 "前进" 或 "后退" 时，如果是从缓存加载的不会触发 load 事件。这两种事件的 event 对象中，包含 persisted 属性，如果是从缓存加载，值为 ture，否则为 false。
```js
const events = [
  "pagehide", "pageshow",
  "unload", "load"
];

const eventLogger = event => {
  switch (event.type) {
    case "pagehide":
    case "pageshow":
      let isPersisted = event.persisted ? "persisted" : "not persisted";
      console.log('Event:', event.type, '-', isPersisted);
      break;
    default:
      console.log('Event:', event.type);
      break;
  }
};

events.forEach(eventName =>
  window.addEventListener(eventName, eventLogger)
);
```
上面的例子中，跳转到其他页面，再返回，console 的顺序如下，注意：在 Conosle 里的设置中勾选 Preserve log，这样才能看到 pagehide 和 unload 的 log。
```js
// Event: load
// Event: pageshow - not persisted
// Event: pagehide - not persisted
// Event: unload
```

**hashchange 事件**，页面路径 hash 值改变，会触发 hashchange 事件  IE8+
```js
window.addEventListener('load', function(event) {
  window.addEventListener('hashchange', function(event) { 
    console.log(event, event.oldURL, event.newURL); // URL 是完整的
    console.log(location.hash);
  });
});
```

### 设备事件
W3C 在 2011 年就开始起草一份新规范，用于定义新设备（智能手机和平板电）相关的事件：
- orientationchange 事件，如果本地调试，可以装个 nginx，然后通过局域网用手机访问看效果，**注意：1.微信内置页面，方向锁定了，无法触发该事件，待后续研究。2.由于现在的手机默认都是打开了方向锁定，所以一直是0，需要解除锁定，才能触发该事件**
- deviceorientation 事件、iOS http不支持，待后续测试https，安卓支持正常。
- devicemotion事件，iOS、安卓 http都不支持，待后续测试https
- 有一篇博客，图文介绍还不错，http://www.zhangyunling.com/725.html
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum=1.0,minimum=1.0,user-scalable=0" />
		<title>devicemethod</title>
		<script type="text/javascript" src="EventUtil.js"></script>
		<script type="text/javascript" src="vconsole/vconsole.min.js"></script>
	</head>
	<body>
		<div>window.orientation: <p id="orientationValue"></p></div>
		<div>deviceorientation: <p id="deviceorientation"></p></div>
		<div>devicemotion: <p id="devicemotion"></p></div>
		<script type="text/javascript">
			var vConsole = new VConsole(); 
			EventUtil.addHandler(window, 'load', function (event) {
				console.log('load')
				var orientationValue = document.getElementById('orientationValue')
				orientationValue.innerText = window.orientation
				// iPhone8 和红米6均可正常触发
				// 一共有3种情况：屏幕正常时，值为0; 横屏时，值为90; 反方向横屏时，只为-90;
				EventUtil.addHandler(window, 'orientationchange', function (event) {
					console.log('orientationchange', event, window.orientation)
					var orientationValue = document.getElementById('orientationValue')
					orientationValue.innerText = `orientation changed: ${window.orientation}`
				})

				// 经测试，iPhone8不能触发，红米6触发正常，http本地测试，可能需要https，待后续测试
				EventUtil.addHandler(window, 'deviceorientation', function (event) {
					console.log('deviceorientation', event)
					var orientationValue = document.getElementById('deviceorientation')
					orientationValue.innerText = `Alpha: ${event.alpha}, Beta：${event.beta}, Gamma: ${event.gamma}`
				})

				// 经测试、iPhone8、红米6 手机均不能正常触发，http本地测试，可能需要https，待后续测试
				EventUtil.addHandler(window, 'devicemotion', function (event) {
					console.log('devicemotion', event, event.acceleration, event.interval, event.accelerationIncludingGravity)
					if (event.rotatioinRate !== null) {
						var orientationValue = document.getElementById('devicemotion')
						orientationValue.innerText = `Alpha: ${event.rotationRate.alpha}, Beta：${event.rotationRate.beta}, Gamma: ${event.rotationRate.gamma}`
					} 
				})
			})
		</script>
	</body>
</html>
```

### 触摸与手势事件
#### 触摸事件
- touchstart 当手指触摸屏幕是触发
- touchend 当手指从屏幕上移开时触发
- touchmove 手指滑动时连续触发，如果调用preventDefault() 可以阻止滚动
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum=1.0,minimum=1.0,user-scalable=0" />
    <title>touchevent</title>
    <script type="text/javascript" src="EventUtil.js"></script>
    <script type="text/javascript" src="vconsole/vconsole.min.js"></script>
  </head>
  <body>
    touchstart: <div id="touchstart-output"></div>
    touchend: <div id="touchend-output"></div>
    touchmove: <div id="touchmove-output"></div>
    <script type="text/javascript">
      var vconsole = new VConsole()
      function handleTouchEvent(event) {
        switch(event.type) {
          case 'touchstart':
            var output = document.getElementById('touchstart-output')
            output.innerHTML = `(${event.touches[0].clientX},${event.touches[0].clientY}})`
            console.log(`Touch start: `, event)
            break;
          case 'touchmove':
            var output = document.getElementById('touchmove-output')
            event.preventDefault() // 可以阻止默认事件，可阻止微信内部下拉刷新操作，以及滚动事件
            output.innerHTML = `(${event.changedTouches[0].clientX},${event.changedTouches[0].clientY}})`
            console.log(`Touch move: `, event)
            break;
          case 'touchend':
            var output = document.getElementById('touchend-output')
            console.log(`Touch end: `, event)
            output.innerHTML = `(${event.changedTouches[0].clientX},${event.changedTouches[0].clientY}})`
            break;
        }
      }
      EventUtil.addHandler(document, 'touchstart', handleTouchEvent)
      EventUtil.addHandler(document, 'touchmove', handleTouchEvent)
      EventUtil.addHandler(document, 'touchend', handleTouchEvent)
    </script>
  </body>
</html>
```
#### 手势事件, 仅 iOS 支持
非标准， https://developer.mozilla.org/en-US/docs/Web/API/Element/gestureend_event
- gesturestart 两个手指触摸屏幕
- gesturechange 两个手指，任意一手指滑动时触发，多次
- gestureend 两个手指中的任何一个手指从屏幕移开时触发
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum=1.0,minimum=1.0,user-scalable=0" />
    <title>touchevent</title>
    <script type="text/javascript" src="EventUtil.js"></script>
    <script type="text/javascript" src="vconsole/vconsole.min.js"></script>
  </head>
  <body>
    touchstart: <div id="touchstart-output"></div>
    touchend: <div id="touchend-output"></div>
    touchmove: <div id="touchmove-output"></div>

    <!-- 只有iOS支持 -->
    gesturestart: <div id="gesturestart-output"></div>
    gesturechange: <div id="gesturechange-output"></div>
    gestureend: <div id="gestureend-output"></div>

    <script type="text/javascript">
      var vconsole = new VConsole()
      function handleTouchEvent(event) {
        switch(event.type) {
          case 'touchstart':
              var output = document.getElementById('touchstart-output')
              output.innerHTML = `(${event.touches[0].clientX},${event.touches[0].clientY}})`
              console.log(`Touch start: `, event)
              break;
          case 'touchmove':
              var output = document.getElementById('touchmove-output')
              // event.preventDefault()
              output.innerHTML = `(${event.changedTouches[0].clientX},${event.changedTouches[0].clientY}})`
              console.log(`Touch move: `, event)
              break;
          case 'touchend':
              var output = document.getElementById('touchend-output')
              console.log(`Touch end: `, event)
              output.innerHTML = `(${event.changedTouches[0].clientX},${event.changedTouches[0].clientY}})`
              break;
        }
      }
      EventUtil.addHandler(document, 'touchstart', handleTouchEvent)
      EventUtil.addHandler(document, 'touchmove', handleTouchEvent)
      EventUtil.addHandler(document, 'touchend', handleTouchEvent)


      // 只有iOS 支持
      function handleGestureEvent(event) {
        switch(event.type) {
          case 'gesturestart':
              var output = document.getElementById('gesturestart-output')
              output.innerHTML = `rotation: ${event.rotation}, scale: ${event.scale}`
              // 0, 1
              break;
          case 'gesturechange':
              var output = document.getElementById('gesturechange-output')
              output.innerHTML = `rotation: ${event.rotation}, scale: ${event.scale}`
              break;
              // 两只手指，放大，缩小
          case 'gestureend':
              var output = document.getElementById('gestureend-output')
              output.innerHTML = `rotation: ${event.rotation}, scale: ${event.scale}`
              break;
        }
      }
      document.addEventListener('gesturestart', handleGestureEvent, false);
      document.addEventListener('gesturechange', handleGestureEvent, false);
      document.addEventListener('gestureend', handleGestureEvent, false);

    </script>
  </body>
</html>
```

### 事件参考
列出了 DOM 规范、HTML5 规范，以及其他当前已发布规范中定义的所有浏览器事件。详情参见 [Related Topics Events| MDN](https://developer.mozilla.org/en-US/docs/Archive/Events/beforecut) 页面的左侧菜单，书中的 events 列表基本和 MDN 文档一致。
## 内存和性能
- 事件委托，大量添加处理程序，会影响性能，尽量少添加处理事件，比如下面的代码： 
```js
/*
<ul id="myLinks">
  <li id="goSomeWhere">goSomeWhere</li>
  <li id="doSomething">doSomething</li>
  <li id="sayHi">sayHi</li>
</ul>
*/
var item1 = document.getElementById('goSomeWhere');
var item2 = document.getElementById('doSomething');
var item3 = document.getElementById('sayHi');

EventUtil.addHandler(item1, 'click', function(event) {
  location.href = 'http://www.zuo11.com';
});
EventUtil.addHandler(item2, 'click', function(event) {
  document.title = "I change the title";
});
EventUtil.addHandler(item3, 'click', function(event) {
  alert('hi');
});

// 优化后的代码
var links = document.getElementById('myLinks');
EventUtil.addHandler(links, 'click', function(event) {
  event = EventUtil.getEvent(event);
  var target = EventUtil.getTarget(event);
  switch (target.id) {
    case 'goSomeWhere':
      location.href = 'http://www.zuo11.com';
      break;
    case 'doSomething':
      document.title = "I change the title";
      break;
    case 'sayHi':
      alert('hi');
      break;
  }
});
```

- 移除事件处理程序，在 innerHTML 设置新内容后，原内容被替换，相关事件处理程序不会被移除，需要手动处理
```js
// 绑定的事件执行完成后，如果可以尽量释放掉，类似于 once 仅执行一次的效果
btn.onclick = funciton () {
  btn.onclick = null;
  // 处理程序
}
```

## 模拟事件
> DOM2 Events 并没有定义键盘事件，DOM3 Events 才正式给出规定，需要 IE9+

可以用 document.createEvent('事件类型字符串') 方法创建 event 对象，然后用 dispatchEvent(event) 触发事件, 事件类型:
- UIEvents: 一般的 UI 事件，鼠标和键盘事件都继承自 UI 事件，DOM3 中是 UIEvent
- MouseEvents: 一般的鼠标事件。DOM3 中是 MouseEvent
- HTMLEvents: 一般的 HTML 事件，DOM3 中没有

### 模拟鼠标事件
模拟鼠标事件，需要分三步：
- 1.创建鼠标类型的事件对象, event = document.createEvent("MouseEvents")
- 2.初始化事件对象, event.initMouseEvent(...args)
```js
// initMouseEvent()方法接收15个参数，与鼠标事件中的属性一一对象
// - type(字符串): 要触发的事件类型, 如 'click'
// - bubbles(布尔值): 事件是否能冒泡，为精确模拟鼠标事件，这个参数需要设置为true
// - cancelable(布尔值): 事件是否可以取消？为精确模拟鼠标事件，这个参数需要设置为true
// - view，与事件关联的视图，这个参数几乎总是设置为 docuemnt.defaultView
// - detail(整数): 与事件有关的详细信息。这个值一般只有处理程序使用，但通常设置为 0 
// - screenX(整数): 事件相对于屏幕的X坐标
// - screenY(整数): 事件相对于屏幕的Y坐标
// - clientX(整数): 事件相对于可视区域的X坐标
// - clientY(整数): 事件相对于可视区域的Y坐标
// - ctrlKey(布尔值): 是否按下了Ctrl键，默认为false
// - altKey(布尔值): 是否按下了Alt键，默认为false
// - shiftKey(布尔值): 是否按下了Shift键，默认为false
// - metaKey(布尔值): 是否按下了Meta键，默认为false
// - button(整数): 表示按下了哪个鼠标键，默认为0（左键）
// - relatedTarget(对象): 表示事件相关的对象，只在模拟mouseover或mouseout时使用

event.initEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
```
- 3.触发事件dispatchEvent()
```js
var btn = document.getElementById('myBtn');
// 触发事件
btn.dispatchEvent(event);
```

- 示例: 模拟鼠标click
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum=1.0,minimum=1.0,user-scalable=0" />
    <title>touchevent</title>
    <script type="text/javascript" src="EventUtil.js"></script>
    <script type="text/javascript" src="vconsole/vconsole.min.js"></script>
  </head>
  <body>
    <input type="button" id="myBtn" value="模拟点击">
    <script type='text/javascript'>
      var myBtn = document.getElementById('myBtn');
      EventUtil.addHandler(myBtn, 'click', function(event) {
        console.log('click', event)
        alert('点击了按钮')
      })

      setTimeout(function() {
        // 模拟鼠标事件
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        myBtn.dispatchEvent(event);
      }, 5000)
    </script>
  </body>
</html>
```

### 模拟键盘事件
模拟键盘事件:
- 1.使用 createEvent('keyboardEvent') 创建键盘事件
- 2.初始化事件对象 event.initKeyboardEvent(..args), 参数如下:
```js
// initkeyEvent() 有8个参数
// - type(字符串): 表示触发事件类型, 如keydown，keyup
// - bubbles(布尔值): 表示是否可以冒泡，默认设置为true
// - cancelable(布尔值): 是否可以取消事件， 默认设置为true
// - view 视图，设置为 document.defaultView
// - key(字符串)， 按下键的键码
// - location(整数), 0 表示主键盘，1 左，2右，3，数字键盘，4移动设备（虚拟键盘），5表示手柄
// - modifies(字符串)，修改键列表，以空格分隔，如 "shift"
// - repeat(整数)，在一行中按钮这个键多少次
event.initKeyboardEvent('keydown', true, true, document.defaultView, 'a', 0, 'shift', 0);

```
- 3.触发事件
```js
var textbox = document.getElementById('myTextbox');
textbox.dispatchEvent(event);
```
- 示例：模拟键盘事件，只能模拟事件，但不能真正的输入，因为它并不能准确的模拟键盘事件。仅可以触发键盘输入的事件处理程序。
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum=1.0,minimum=1.0,user-scalable=0" />
    <title>touchevent</title>
    <script type="text/javascript" src="EventUtil.js"></script>
    <script type="text/javascript" src="vconsole/vconsole.min.js"></script>
  </head>
  <body>
    <input type="text" id="myTextbox" autofocus>
    <script type='text/javascript'>
      var myTextbox = document.getElementById('myTextbox');
      EventUtil.addHandler(myTextbox, 'keydown', function(event) {
        console.log('keydown', event)
      })
      EventUtil.addHandler(myTextbox, 'keyup', function(event) {
        console.log('keyup', event)
      })
      EventUtil.addHandler(myTextbox, 'keypress', function(event) {
        console.log('keypress', event)
      })

      setTimeout(function() {
        // 模拟键盘事件情况1
        // var event = document.createEvent('KeyboardEvent');
        // event.initKeyboardEvent('keydown', true, true, document.defaultView, 'a', 0, "shift", 0);
        // myTextbox.dispatchEvent(event);

        // var event2 = document.createEvent('KeyboardEvent');
        // event2.initKeyboardEvent('keypress', true, true, document.defaultView, 'a', 0, "shift", 0);
        // myTextbox.dispatchEvent(event2);

        // var event3 = document.createEvent('KeyboardEvent');
        // event3.initKeyboardEvent('keyup', true, true, document.defaultView, 'a', 0, "shift", 0);
        // myTextbox.dispatchEvent(event3);

        // 模拟键盘输入情况2  p409
        var event = document.createEvent("Events");
        event.initEvent('keydown', true, true);
        event.view = document.defaultView;
        event.altKey = false;
        event.ctrlKey = false;
        event.shiftKey = false;
        event.metaKey = false;
        event.keyCode = 65;
        event.charCode = 65;
        myTextbox.dispatchEvent(event)

        // 模拟键盘输入情况3 https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/KeyboardEvent
        // var event = new KeyboardEvent('keydown', {
        //     key: "a"
        // });
        // var event2 = new KeyboardEvent('keypress', {
        //     key: "a"
        // });
        // var event3 = new KeyboardEvent('keyup', {
        //     key: "a"
        // });
        // myTextbox.dispatchEvent(event);
        // myTextbox.dispatchEvent(event2);
        // myTextbox.dispatchEvent(event3);
      }, 3000)
    </script>
  </body>
</html>
```

### 自定义 DOM 事件
DOM3 新增自定义事件类型，自定义事件不会触发原生 DOM 事件。要创建自定义事件，需要调用 createEvent("CustomEvent")，返回的对象包含 initCustomEvent() 方法，该方法接收以下 4 个参数
- type 字符串，事件类型，如 "myevent"
- bubbles 布尔值，是否冒泡
- cancelable 布尔值，是否可以取消默认行为
- detail 对象，任意值，作为 event 的 detail 属性

```html
<div id="myDiv"></div>
<script>
  let div = document.getElementById("myDiv"),
      event;
  div.addEventListener("myevent", event => console.log('DIV: ' + event.detail))
  document.addEventListener("myevent", event => console.log('Document: ' + event.detail))
  // 如果支持 DOM3
  event = document.createEvent("CustomEvent")
  event.initCustomEvent("myevent", true, false, "Hello world!")
  div.dispatchEvent(event)
</script>
<!-- 
  DIV: Hello world!
  Document: Hello world! 
-->
```

### IE 事件模拟
IE8 及更早的版本，需要使用另外的 API 来模拟事件，但流程基本一致。下面的例子是模拟 keypress 事件，仅触发事件，文本框中也不会出现字符
```js
var btn = document.getElementById("myBtn")
// 创建 event 对象
var event = document.createEventObject()

// 初始化 event 对象
event.altKey = false
event.ctrlKey = false
event.shiftKey = false
event.keyCode = 65

// 触发事件
btn.fireEvent("onkeypress", event)
```