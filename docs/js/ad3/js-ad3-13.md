# 13. 事件



JS与HTML之间的交互是通过事件实现的
## 事件流
事件流描述的是从页面中接收事件的顺序。
- 事件冒泡，如果单击了div元素，事件会一级一级向父节点传递（冒泡），一直到document => window(IE9及其他浏览器)
- 事件捕获，如果单击了div元素，事件捕获过程中，document对象（或window）先接收到click事件，然后逐级向子节点传递，一直到div。
- DOM事件流，DOM2级事件规定的事件流包括三个阶段：事件捕获阶段、目标阶段、事件冒泡阶段，首先发生的是事件捕获，为拦截事件提供了机会，然后是实际的目标接收到啊事件。最后一个阶段是冒泡阶段。
![事件](/images/js/event.png)

## 事件处理程序
- 事件就是用户或浏览器自身执行的某种队中，如：click，load，mouseover等。
- 响应某个事件的函数就叫做事件处理程序，一般以on开头，如果click的事件处理程序就是onclick
为事件指定处理程序的方法有好几种。
### HTML事件处理程序
HTML元素内部指定处理方法
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
### JS DOM0级事件处理程序
- DOM0级事件处理程序，以on+事件名称，例如: element.onclick
```js
let btn = document.getElementById('myBtn');
btn.onclick = function() { // 绑定事件处理程序
  alert('Clicked');
  alert(this.id); // "myBtn"
};
setTimeout(()=> {
  btn.onclick = null; // 删除事件处理程序
}, 5000)

```
### JS DOM2级事件处理程序
"DOM2级事件" 定义了两个方法用于处理指定事件、或删除对应的处理事件
- element.addEventListener(事件类型，处理函数,捕获阶段调用true/冒泡阶段调用false)，为了最大限度兼容各种浏览器，默认传入false，在冒泡阶段添加事件处理程序。
- element.removeEventListener()，
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
### IE事件处理程序
IE中有两个事件处理程序，attachEvent(), detachEvent(),IE8及更早版本只支持事件冒泡，(IE5-IE10), IE11及其他浏览器都不支持。
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
    if (element.addEventListener) { // 如果支持DOM2级
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) { // IE10及以下版本
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  removeHandler: function(element, type, handler) {
    if (element.removeEventListener) { // 如果支持DOM2级
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
### DOM0级和DOM2级区别
DOM2级事件与DOM0级事件的区别：
- 1.DOM2级事件处理程序可以选择触发的阶段(冒泡阶段、捕获阶段)，而DOM0只能在冒泡阶段被处理
- 2.DOM2级事件处理程序可以添加多个相同的事件处理程序，比如可以添加两个click事件，按顺序触发。 
- 3.兼容性问题，DOM2级事件IE9+支持，DOM0所有浏览器都支持

## 事件对象event
在触发DOM上的某个事件时，会产生一个事件对象event，包括导致事件的元素、事件的类型等。
### DOM中的事件对象
- DOM中的事件对象event的属性和方法，一般都是只读的。
```js
// 1.event的属性和方法
// event.type // 事件类型，比如 'click' 'scroll'
// event.bubbles // Boolean 事件是否冒泡
// event.cancelable // Boolean 是否可以取消事件的默认行为
// event.detail // 事件相关的细节信息
// event.eventPhase // 事件阶段：1 捕获阶段、2 处理目标阶段、3 冒泡阶段

// event.preventDefault() // 取消事件的默认行为，前提条件是cancelable为true
// event.stopPropagation() // 取消事件冒泡，前提条件是bubbles为true

// event.currentTarget // Element  事件处理程序正在处理的那个元素
// event.target // Element 事件的目标

// 2.event.type，多个事件类型可以使用同一处理，函数，根据事件类型来判断操作
var btn = document.getElementById('myBtn');
btn.onclick = function(event) {
  alert(event.type); // "click"
  alert(event.currentTarget === this); // true
  alert(event.target === this); // true
};
btn.addEventListener('click', function(event) {
  alert(event.type); // "click"
}, false);

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


// 3.event.target与event.currentTarget
// 如果为body监听了点击事件，点击了body内的button，event.target就是button元素，event.currentTarget就是body元素
var btn = document.getElementById('myBtn');
document.body.onclick = function(event) {
  alert(event.currentTarget === document.body); // true
  alert(this === document.body); // true
  alert(event.target === document.getElementById('myBtn')); // true
};

// 4.event.preventDefault() 阻止函数的默认行为, 可以阻止a的跳转
var link = document.getElementById('myLink');
link.onclick = function(event) {
  event.preventDefault();
};

// 5.event.stopPropagation() 阻止事件冒泡
var btn = document.getElementById('myBtn');
btn.onclick = function(event) {
  alert("Clicked!");
  event.stopPropagation()
};
document.body.onclick = function(event) {
  alert('Body clicked'); // 不会显示
};

// 6.event.eventPhase
// 显示顺序为 1， 2， 3，捕获事件最先执行。然后是冒泡
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
```
### IE中的事件对象
- IE中的事件对象，IE中，如果是DOM0级添加的onclik事件event为window的属性，如果attachEvent监听的就是函数的event参数，但也可以使用window.event
```js
// IE中event对象属性
// event.cancelBubble   Boolean, 默认为false，设置为true可以取消事件冒泡。类似DOM中的stopPropagation()
// event.returnValue    默认为true， 如果为false，取消事件的默认行为，与preventDefault()类似
// event.srcElement      // 只读，事件的目标，与DOM的target属性类似
// event.type         // 事件类型

// 1. IE中DOM0级事件绑定
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

### 跨浏览器的事件对象
```js
var EventUtil = {
  // 添加处理函数
  addHandler: function(element, type, handler) {
    if (element.addEventListener) { // 如果支持DOM2级
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) { // IE10及以下版本
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  // 移除处理函数
  removeHandler: function(element, type, handler) {
    if (element.removeEventListener) { // 如果支持DOM2级
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
DOM3级事件，规定了以下几类事件:
- UI（用户界面）事件，当用户与页面上的元素交互时触发
- 焦点事件，当元素获得或失去焦点时触发
- 鼠标事件，当用户通过鼠标在页面执行操作时触发
- 滚轮事件，当使用鼠标滚轮时触发
- 文本事件，当在文档中输入文本时触发
- 键盘事件，当用户通过键盘在页面执行操作时触发
- 变动（mutation）事件，当DOM结构发生变化时触发
### UI事件
- load事件，页面完全加载后，在window上触发; 当所有框架都加载完毕，在框架集上触发; 当图像加载完毕时，在img元素上触发; 当嵌入的内容加载完毕时，在object元素上触发;
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
window.onload时，做一些操作
```js
// 1. 创建img元素并加载，只有设置了img的src属性，才会下载
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
- unload事件，页面完全卸载后，在window上触发; 当所有框架都卸载后，在框架集上触发; 当嵌入的内容卸载完毕后，在object元素上触发; 页面完全卸载时dom被移除，不能再处理函数里做dom操作
```js
EventUtil.addHandler(window, 'unload', function() {
  console.log('页面unload');
});
// 或者 <body onunload="alert(unloaded!)">

```

- resize事件，当窗口的大小发生改变时，在window或框架上触发
```js
EventUtil.addHandler(window, 'resize', function() {
  console.log(`Resized, innerHeight: ${window.innerHeight}, innerWidth: ${window.innerWidth}`)
});
```
- scroll事件，当用户滚动带滚动条的元素中的内容时，在window或框架上触发
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
- abort事件，当用户停止下载过程时，如果嵌入的内容没加载完，则在object元素上触发
- error事件，当js发生错误时，在window上触发; 无法加载图像时，在img元素上触发; 当无法嵌入内容时，在object元素上触发; 当一个或多个框架无法加载时，在框架集上触发。第17章会继续讨论
- select事件，当用户选择文本框（input或textarea）中的一个或多个字符时触发。详情见14章

### 焦点事件
- blur事件，在元素失去焦点时触发，不会冒泡
- focus事件，在元素得到焦点时触发，不会冒泡
- focusin事件，在元素获得焦点时触发，会冒泡
- focusout事件，在元素失去焦点时触发，会冒泡
```js
// 当焦点从一个元素移动到另一个元素，会依次触发下列事件
// (1) focusout在失去焦点的元素上触发
// (2) focusin在获得焦点的元素上触发
// (3) blur 在失去焦点的元素上触发
// (4) focus 在获得焦点的元素上触发

```

### 鼠标与滚轮事件
- mouseover 鼠标移动到区域时触发
- mouseenter 鼠标移动到区域时触发，DOM3级规范，不冒泡，移动到子元素不会触发
- mouseout  鼠标移出区域时触发
- mouseleave 鼠标移出区域时触发，DOM3级规范，不冒泡，移出子元素时不会触发
- mousedown 鼠标点击按下，鼠标左键、右键、滚轮键都会触发，建议不要取消默认行为，否则会导致click不触发
- mouseup 鼠标点击按下后弹起，，鼠标左键、右键、滚轮键都会触发，建议不要取消默认行为，否则会导致click不触发
- click 鼠标左键点击才会触发。
- dblclick 只有触发了两次click，才会触发dblclick，如果click去掉了默认行为e.preventDefault()，不会触发该事件。
- mousemove 在div区域移动时，不不停的触发，event里面会有对应的坐标

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>mouseEvent</title>
		<script type="text/javascript" src="EventUtil.js"></script>
	</head>
	<body>
		<div id="myDiv" style="width:100px;height:100px;border:5px solid #ccc;"></div>
		<script type="text/javascript">
			var myDiv = document.getElementById('myDiv');

			EventUtil.addHandler(myDiv, 'mousedown', function() {
			  console.log('mousedown');
			});

			EventUtil.addHandler(myDiv, 'mouseup', function() {
			  console.log('mouseup');
			});		

			EventUtil.addHandler(myDiv, 'click', function() {
			  console.log('click');
			});	

			EventUtil.addHandler(myDiv, 'dblclick', function() {
			  console.log('dblclick');
			});	

			EventUtil.addHandler(myDiv, 'mouseover', function() {
			  console.log('mouseover');
			});	

			EventUtil.addHandler(myDiv, 'mouseout', function() {
			  console.log('mouseout');
			});	

			EventUtil.addHandler(myDiv, 'mouseenter', function() {
			  console.log('mouseenter');
			});	

			EventUtil.addHandler(myDiv, 'mouseleave', function() {
			  console.log('mouseleave');
			});	
			
      EventUtil.addHandler(myDiv, 'mousemove', function(event) {
        console.log('mousemove');
        console.log(event)
      });	
				
			// 鼠标移入div，再出来，打印顺序：mouseover; mouseenter;大量mousemove; mouseout; mouseleave; 
			// 鼠标左键点击，打印顺序：mousedown; mouseup; click
			// 鼠标左键双击，打印顺序：mousedown; mouseup; click；mousedown; mouseup; click；dblclick;
			// 鼠标有点单机/双击，打印顺序: mousedown; mouseup; mousedown; mouseup;
		</script>
	</body>
</html>
```

- 鼠标事件位置信息，event.clientX、event.clientY; event.pageX、event.pageY; event.screenX、event.screenY、event.offsetX
```js
// clientX，clientY，client区是浏览器可视区域
// screenX, screenY, 是相对桌面屏幕的位置
// pageX，pageY 是相对页面的位置，如果没有滚动的情况下，和client是一致的。e.pageX = document.documentElement.scrollLeft + e.clientX
// offsetX, offsetY 是相对于目标元素边界的x、y坐标
```
![client与screen位置信息](/images/js/client.png)

- 修改键(鼠标点击+键盘Alt、Ctrl、Shift、win键) IE9+都支持，IE8及之前版本不支持metakey
```js
// e.altKey // Boolean 是否按下了Alt键
// e.ctrlKey // Boolean 是否按下了Ctrl键
// e.shiftKey // Boolean 是否按下了Shift键
// e.metaKey // Boolean 是否按下了win键
// click事件，点击时是否按下了某个键盘键
EventUtil.addHandler(myDiv, 'click', function(e) {
	e = EventUtil.getEvent(e);
	var keys = [];

	if (e.shiftKey) {
		keys.push('shift');
	}
	if (e.ctrlKey) {
		keys.push('ctrl');
	}
	if (e.altKey) {
		keys.push('alt')
	}
	if (e.metaKey) {
		keys.push('meta')
	}
	alert(keys.join(','))
});	
```
- 相关元素 event.relatedTarget，mouseover和mouseout，还有event.toElement, event.fromElement, 否则为空

- event.button, mousedown或mouseup判断点击的是鼠标左键(0)、右键(2)、中间滚轮键(1)
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

- mousewheel事件，鼠标滚动事件p377，chrome里面测试，event.wheelDelta 一次滚动120，但页面滚动距离是100，非标准，FireFox不支持，用DOMMouseScroll替代，非标准特性，不建议使用 https://developer.mozilla.org/zh-CN/docs/Web/Events/mousewheel

- 触摸设备
```js
// dblclick不支持，双击浏览器会放大页面
// mousemove会触发moseover和mouseout
// 手指滚动页面时，会触发 mousewheel, scroll
```

### 键盘与文本事件
keydown、keypress、keyup
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>keypress</title>
		<script type="text/javascript" src="EventUtil.js"></script>
	</head>
	<body>
		<script>
			EventUtil.addHandler(document.documentElement, 'keydown', function(e) {
        console.log('keydown', e);
      }); 
      EventUtil.addHandler(document.documentElement, 'keyup', function(e) {
        console.log('keyup', e);
      }); 
      EventUtil.addHandler(document.documentElement, 'keypress', function(e) {
        console.log('keypress', e);
      }); 
      // 按下某个键后，依次打印 keydown, keypress, keyup
      // 如果长按某个键，一次打印 keydown, keypress, keydown, keypress, keydown, keypress, keyup
		</script>
	</body>
</html>
```
- event.keyCode（键码）, event.charCode（字符编码、ASCII码，小写a 97, 大写A 65， 0 48）
```js
// keydown/keyup里的event.keyCode感觉基本无大用
// keypress 事件的event对象里，有charCode值，是按下的键对应的ASCII码
// DOM3级，支持event.key, 就是按下键的名称。
```

- textInput事件，只有在可编辑区域中输入字符时才会触发这个事件。 IE9+
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
- 复合事件，IME输入法编辑器输入，暂时不知道在哪里可以用到，p384

### 变动事件(dom mutation)
- DOMSubtreeModified，在DOM结构中发生变化时，在其他事件触发后，这个事件就会触发
- DOMNodeRemoved, 在节点从父节点中删除时触发，被删除的节点还会触发 DOMNodeRemovedFromDocument 事件
- DOMNodeInserted, 在一个节点作为子节点插入到另一个节点时触发, 被插入的节点还会触发 DOMNodeInsertedIntoDocument 事件
- DOMAttrModified, 在特性修改后触发
- DOMMCharacterDataModified, 在文本节点的值发生变化时触发
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>dom mutation</title>
  </head>
  <body>
    <ul id="myList">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </body>
</html>
```
- 删除节点，removeChild()、replaceChild(), 删除节点时，首先会触发DOMNodeRemoved事件
```js
<script type="text/javascript">
  EventUtil.addHandler(window, 'load', function(event) {
    var list = document.getElementById('myList');
    EventUtil.addHandler(document, 'DOMSubtreeModified', function(event) {
      alert(event.type);
      alert(event.target);
    });
    EventUtil.addHandler(document, 'DOMNodeRemoved', function(event) {
      alert(event.type);
      alert(event.target);
    });
    EventUtil.addHandler(list.firstChild, 'DOMNodeRemovedFromDocument', function(event) {
      alert(event.type);
      alert(event.target);
    });
    list.parentNode.removeChild(list);
  })
  // 移除ul后打印顺序：ul元素先触发DOMNodeRemoved; ul的子元素触发DOMNodeRemovedFromDocument; body再触发DOMSubtreeModified
  // DOMNodeRemoved, [object HTMLUListElement], DOMNodeRemovedFromDocument, [object Text], DOMSubtreeModified, [object HTMLBodyElement]
</script>
```
- 插入节点, appendChild(), replaceChild()或insertBefore()向DOM中插入节点会触发DOMNodeInserted事件
```js
<script type="text/javascript">
  EventUtil.addHandler(window, 'load', function(event) {
    var list = document.getElementById('myList');
    var item = document.createElement('li');
    item.appendChild(document.createTextNode('Item 4'));
    EventUtil.addHandler(document, 'DOMSubtreeModified', function(event) {
      alert(event.type);
      alert(event.target);
    });
    EventUtil.addHandler(document, 'DOMNodeInserted', function(event) {
      alert(event.type);
      alert(event.target);
    });
    EventUtil.addHandler(item, 'DOMNodeInsertedIntoDocument', function(event) {
      alert(event.type);
      alert(event.target);
    });
    list.appendChild(item)
  })
  // 创建一个li并append到ul里，li先触发DOMNodeInserted, li 再触发DOMNodeInsertedIntoDocument，ul再触发DOMSubtreeModified
  // DOMNodeInserted, [object HTMLLIElement], DOMNodeInsertedIntoDocument, [object HTMLLIElement], DOMSubtreeModified, [object HTMLUListElement]
</script>
```

### HTML5事件
- contextmenu，右键点击会触发，自定义右键菜单, 浏览器基本都支持
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>contextmenu</title>
		<script type="text/javascript" src="EventUtil.js"></script>>
	</head>
	<body>
		<div id="myDiv">
			Right click or Ctrl+click me to get a custom context menu.
		</div>
		<div id="myMenu" style="position: absolute;visibility: hidden;background-color: silver">
			<li><a href="#a">Item1</a></li>
			<li><a href="#b">Item2</a></li>
			<li><a href="#c">Item3</a></li>
		</div>
		<script>
			EventUtil.addHandler(window, 'load', function (event) {
				var div = document.getElementById('myDiv');
				// 右键点击事件， 自定义右键菜单
				EventUtil.addHandler(div, "contextmenu", function(event) {
					event = EventUtil.getEvent(event);
					console.log('contextmenu');
					event.preventDefault(); 

					var menu = document.getElementById('myMenu');
					menu.style.left = event.clientX + 'px';
					menu.style.top = event.clientY + 'px';
					menu.style.visibility = 'visible';
				});

				EventUtil.addHandler(document, 'click', function(event) {
					document.getElementById('myMenu').style.visibility = 'hidden';
				})
			})
		</script>
	</body>
</html>
```
- beforeunload事件，当页面关闭时触发
```js
EventUtil.addHandler(window, 'beforeunload', function(event) {
  var message = "是否确定退出？";
  // 设置returnValue，且作为函数返回值，当关闭页面时，会弹出对应的提示
  event.returnValue = message;
  return message
})
```

- DOMContentLoaded，在window.load之前执行，在形成完整的DOM树之后会触发，不理会图像、js文件、css文件其他资源是否加载完毕, IE9+
```js
EventUtil.addHandler(document, 'DOMContentLoaded', function(event) { 
  alert('Content loaded');
})
```

- readystatechange IE、Firefox支持，chrome不支持，这里不讨论，p390

- pageshow, pagehide暂时感觉没什么作用，p394
```js
EventUtil.addHandler(window, 'load', function(event) {
  EventUtil.addHandler(window, 'pageshow', function(event) { 
    alert('pageshow');
  });
  EventUtil.addHandler(document, 'pagehide', function(event) { 
    alert('pagehide');
  });
});
```

- hashchange，页面路径hash值改变，会触发hashchange事件  IE8+
```js
EventUtil.addHandler(window, 'load', function(event) {
  EventUtil.addHandler(window, 'hashchange', function(event) { 
    console.log(event, event.oldURL, event.newURL);
    console.log(location.hash);
  });
});
```

### 设备事件
- orientationchange事件，如果本地调试，可以装个nginx，然后通过局域网用手机访问看效果，**注意：1.微信内置页面，方向锁定了，无法触发该事件，待后续研究。2.由于现在的手机默认都是打开了方向锁定，所以一直是0，需要解除锁定，才能触发该事件**
- deviceorientation事件、iOS http不支持，待后续测试https，安卓支持正常。
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
#### 手势事件, 仅iOS支持
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

- 移除事件处理程序
```js
// 绑定的事件执行完成后，尽量释放掉。
btn.onclick = null;
```

## 模拟事件
> DOM2级事件并没有规定键盘事件，DOM3级事件才正式给出规定，需要iE9+

可以用 document.createEvent('事件类型字符串') 方法创建event对象，然后用dispatchEvent(event)触发事件, 事件类型:
- UIEvents: 一般的UI事件，鼠标和键盘事件都继承自UI事件，DOM3级中是UIEvent
- MouseEvents: 一般的鼠标事件。DOM3级中是MouseEvent
- MutationEvents: 一般的DOM变动事件， DOM3级中是MutationEvent
- HTMLEvents: 一般的HTML事件，没有对应的DOM3级事件

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
- 1.使用createEvent('keyboardEvent')创建键盘事件
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
- 示例：模拟键盘事件，貌似只能模拟事件，但不能真正的输入。
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
- IE中的事件模拟, p411，暂未发现比较实用的