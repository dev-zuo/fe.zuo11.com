# 15. DOM扩展



DOM作为API已经非常完善了，但为了实现更多功能，仍有一些标准或专有扩展。
## Selectors API(选择符API)
> jQuery核心是通过css选择符查询DOM文档取得元素引用，从而抛开了getElementById和getElementsByTagName,Selectors API是由W3C发起定制的一个标准，让浏览器原生支持css查询。Selectors API Level 1规范核心方法querySelector()、querySelectorAll()，可以通过Document和Element实列来调用

### querySelector()
只能获取到一个元素，获取不到元素，返回null， 如果传入的选择符不符合规范，会抛出错误。querySelector' on 'Document': '#d133#' is not a valid selector
```js
// <div id='d1'>111111</div>
// <div id='d2'>2222</div>
// <p class='c1'>c1</p>
// <span class='c1'>c2</span>
document.querySelector('body') // 获取body元素
document.querySelector('#d1') // 获取ID为 d1 的元素
document.querySelector('.selected') // 获取class为selected的第一个元素
document.body.querySelector('img.button') // 获取类为button的第一个img元素
```

### querySlectorAll() 
获取一个元素列表，仅有一个也是数组，获取不到元素，返回[]，如果传入的选择符不符合规范，会抛出错误。
```js
document.querySelectorAll('div') // 获取 div元素列表
// 获取id为myDiv的元素中所有的em元素，类似于 getElementsByTagName()
document.getElementById("myDiv").querySelectorAll('em');
document.querySelectorAll('.selected') // 获取类为selected的所有元素
document.querySelectorAll('p strong'); // 获取所有p元素中的所有strong元素

// 便利NodeList里面的元素
var i, len, strong;
for (i = 0, len = strongs.length; i < len; i++) {
  strong = strong[i]; // 等价于 strongs.item(i)
  strong.className = 'important';
}
```

### matchesSelector()
 (Selectors API Level 2 规范为Element新增的方法)，如果调用的元素与该选择符匹配则返回true，否则返回false，不过浏览器没有直接支持。但都加了对应的前缀。需要包装一个函数。
```js
if (document.body.matchesSeletor('body.page1')) {
  // true
}

// safari、chrome   webkitMatchesSelector()
// IE9+   msMatchesSelector()
// Firefox  mozMatchedSelector()
function matchesSelector(element, selector) {
  if (element.matchesSelector) {
    return element.matchesSelector(selector)
  } else if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector)
  } else if (element.mozMatchesSelector) {
    return element.mozMatchesSelector(selector)
  } else if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selector)
  } else {
    throw new Error('Not supported.')
  }
}
if (matchesSelector(document.body, 'body.page1')) {
  // 执行操作
}
```

## 元素遍历
(Element Traversal规范API), 对于元素间的空格，IE9及之前的版本不会返回文本节点，其他浏览器都会返回文本节点。这导致使用childNodes和firstChild时行为不一致。为了弥补差异，又保持DOM规范不变，
Element Traversal 规范新定义了一组属性, 支持该规范的有IE9+
- childElementCount 返回子元素的个数，不包含文本节点及注释节点
- firstElementChild 指向第一个子元素, firstChild 的元素版
- lastElementChild 指向最后一个元素，lastChild 的元素版
- previousElementSibling  指向前一个同辈元素；previousSibling 元素版
- nextElementSibling 指向后一个同辈元素 nextSibling的元素版
```js
// 过去的写法
var i, len, child = element.fitstChild;
while(child !== element.lastChild) { 
  if (child.nodeType === 1) { // 检查是不是元素
    processChild(child);
  }
  child = child.nextSibling
}

// Element Traversal 新写法
var i, len, child = element.firstElementChild;
while(child !== element.lastElementChild) { 
  processChild(child); // 已知是元素节点
  child = child.nextElementSibling
}
```

## HTML5
### getElementsByClassName()
获取指定类名的元素List
```js
// 获取类中包含username和cureent的元素，类名先后顺序无所谓
document.getElementsByClassName('username cureent')
```
### classList属性
管理某个元素的class属性
```js
// <div class="bd user disabled">...</div>
div.classList.remove('bd') // 移除bd class
div.classList.contains('bd') // 是否包含bd class
div.classList.add('opt') // 新增一个className
div.classList.toggle('add-or-del') // 如果有该class，删除该class，如果没有则添加该class

div.classList // DOMTokenList 数组
div.classList.value // 获取class属性  IE11不支持，edge、chrome、firefox都支持
div.classList.value = 'kkk uu' // 修改class属性  IE11不支持，edge、chrome、firefox都支持

```
### focus()，hasFocus()
document.activeElement 属性等
```js
// 默认情况下，文档刚加载完成，document.activeElement保存的是documen.body的引用。加载期间值为null
var button = document.getElementById('myButton')
button.focus();
document.activeElement === button // true
document.hasFocus() // true
```

### H5扩展的HTMLDocument功能
```js
// 1. document.readyState 属性, loading 正在加载文档，complete 已经加载完文档
if (document.readyState === 'complete') {
  // 执行操作
}

// 2. document.compatMode 属性，兼容模式
if (document.compatMode === 'CSS1Compat') {
  console.log('standards mode') // 标准模式
} else { // 混杂模式 BackCompat
  console.log('quicks mode')
}

// 3. head属性
var head = document.head || document.getElementsByTagName('head')[0]
```

### charset 字符集属性
```js
document.charset // 'UTF-8'
```

### 自定义数据属性：data-
```js
// HTML可以自定义数据属性，但要添加 data- 前缀，如果定义了该属性，可以通过dataset属性来访问对应的扩展
// <div id="myDiv" data-appId="12345" data-myname="Kevin"></div>
let div = document.getElementById('myDiv');

// 获取自定义属性的值
div.dataset // OMStringMap
div.dataset.appId // 12345
div.dataset.myname // Kevin

// 直接赋值，克改变对应的值。
```

### 插入HTML
innerHTML、outerHTML、insertAdjacentHTML()
```js
// <div id="test">
// 	<div>child1</div>
// 	<div>child2</div>
// </div>
var t = document.getElementById('test');

// 1. innerHTML，获取元素的HTML文本(子节点)，设置对应元素的内容
div.innerHTML = 'hello' // 设置div内容。如果包含字节点，会自动添加到dom树
// 如果包含script脚本，是不会执行的。
// 只有部分元素有对应的属性
t.innerHTML 
// "
// <div>child1</div>
// <div>child2</div>
// "

// 2. outerHTML 属性, 获取元素的HTML文本(子节点，且包含元素本身), 写属性时有问题。
t.outerHTML
//<div id="test">
//	<div>child1</div>
//	<div>child2</div>
//</div>

// 3.insertAdjacentHTML()方法，插入相邻的位置
// 作为前一个同辈元素插入
element.insertAdjacentHTML('beforebegin', '<p>hello</p>');
// 作为后一个同辈元素插入
element.insertAdjacentHTML('afterend', '<p>hello</p>');

// 作为第一个子元素插入
element.insertAdjacentHTML('afterbegin', '<p>hello</p>');
// 作为最后一个子元素插入
element.insertAdjacentHTML('beforeend', '<p>hello</p>');

// 4.内存、性能问题
// 使用上面的属性及方法时，最好先手工删除要被替换元素的所有事件处理程序和js对象属性
```

### scrollIntoView()
元素.scrollIntoView() 方法，滚动到对应的元素位置。
```js
let k = document.getElementById('myDiv');
k.scrollIntoView() // 滚动到对应的元素位置，注意只能是元素节点调用，文本节点调用会报错
```

## 专有扩展
### IE8文档模式
- IE8引入了一个新的概念：文档模式 document.documentMode，只有IE支持，如果IE11，值为11，如果IE8，值为8，如果是其他浏览器，返回undefined
```js
// IE的四种文档模式
// 1. IE5 以混杂模式渲染页面，IE8及跟高版本中的新功能都无法使用
// 2. IE7 以IE7标准模式渲染页面，IE8及更高版本中的新功能都无法使用
// 3. IE8 以IE8标准模式渲染页面，IE8里的新功能都可以使用，如Selectors API,css2级选择符和某些css3功能，IE9中的新功能无法使用
// 4. IE9 以IE9标准模式渲染页面，IE9中的新功能都可以使用，如ES5、完整的CSS3以及更多的HTML5功能

// 要强制浏览器以某种模式渲染页面，可以使用HTTP头部信息 X-UA-Compatible
// <meta http-equiv="X-UA-Compatible" content="IE=IEVersion">
// > IEVersion 有下面的一些值
// > Edge 始终以最新的文档模式来渲染页面，忽略文档类型声明，IE8以IE8标准模式渲染，IE9以IE9标准模式渲染
// > EmulateIE9 如果有文档类型声明，则以IE9标准模式渲染，否则将文档模式设置为IE5
// > EmulateIE8 如果有文档类型声明，则以IE8标准模式渲染，否则将文档模式设置为IE5
// > EmulateIE7 如果有文档类型声明，则以IE7标准模式渲染，否则将文档模式设置为IE5
// > 9 强制以IE9标准模式渲染页面，忽略文档类型声明
// > 8 强制以IE8标准模式渲染页面，忽略文档类型声明
// > 7 强制以IE7标准模式渲染页面，忽略文档类型声明
// > 5 强制将文档模式设置为IE5，忽略文档类型声明

// 如果想要让文档模式像在IE7中一样，可以使用如下代码
// <meta http-equiv="X-UA-Compatible" content="IE=7">

```
### children属性
element.children属性，IE9之前处理文本节点空白符时有差异，就出现了children属性，相当于 childNodes 的元素版，只包含元素，childElementCount 只能计算数量，不能获取List，这个就可以
### contains()
contains() 方法 检测某个节点是否是其祖先节点，如果是，则返回true，反则返回false
```js
document.documentElement.contains(document.body) // true

// DOM Level 3 compareDocumentPosition() 可以更详细的获得两节点关系，IE9+
```
### 插入文本
插入文本：innerText/textContent； outerText不常用
```js
// innerText/textContent 区别
// 1.innerText/textContent都是获取文本或插入文本。前者Firefox不支持，但支持textContent(IE9+)
// 2.innerText 会忽略行类的样式和脚本，textContent会返回行内样式和脚本代码

// div.innerText 或者 div.textContent // 获取元素中包含的所有文本内容
// 兼容性处理
function getInnerText(element) {
  return (typeof element.textContent === 'string') ? element.textContent : element.innerText;
}

function setInnerText(element, text) {
  if (typeof element.textContent === 'string') {
    element.textContent = text;
  } else {
    element.innerText = text;
  }
}
```
### 滚动
- 滚动除了scrollIntoView()方法外，还有其他非标准方法可以使用，但兼容性不行
```js
// 1. scrollIntoViewNeeded() 将元素移动到对应的元素节点，和 scrollIntoView()用法及功能基本一致
// 兼容性： https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded

// 2. window.scrollByLines(lineCount) 
// chrome不支持，Firefox支持

// 3. window.scrollByPages(pageCount) // 向上翻页或向下返回，仅火狐浏览器支持
// 兼容性: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollByPages
```