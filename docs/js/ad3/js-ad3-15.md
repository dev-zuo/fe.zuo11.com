---
title: 15. DOM扩展 - JS高程4
description: DOM API 已经非常完善了，但为了实现更多功能，仍有一些标准或专有扩展。2008 年前，大部分浏览器对 DOM 扩展都是专有的。此后 W3C 开始着手将这些已成为事实标准的专有扩展编制成正式规范。于是就产生了描述 DOM 扩展的两个标准：Selectors API 与 HTML5。另外还有较小的 Element Traversal（遍历） 规范，增加了一些 DOM 属性。
keywords: DOM 扩展,Selectors API,HTML5 DOM 扩展
---

# 15. DOM扩展
DOM API 已经非常完善了，但为了实现更多功能，仍有一些标准或专有扩展。2008 年前，大部分浏览器对 DOM 扩展都是专有的。此后 W3C 开始着手将这些已成为事实标准的专有扩展编制成正式规范。于是就产生了描述 DOM 扩展的两个标准：Selectors API 与 HTML5。另外还有较小的 Element Traversal（遍历） 规范，增加了一些 DOM 属性。
## Selectors API(选择符API)
> jQuery 核心是通过 css 选择符查询 DOM 文档取得元素引用，从而抛开了 getElementById 和 getElementsByTagName, Selectors API 是由 W3C 发起定制的一个标准，让浏览器原生支持 css 查询。

Selectors API Level 1 规范核心方法 querySelector()、querySelectorAll()，可以通过 Document 和 Element 实列来调用

Selectors API Level 2 规范在 Element 类型上新增了更多方法，比如 matches()、find()、findAll()。 目前还没有浏览器实现 find()、findAll() 方法
### querySelector()
只能获取到一个元素，获取不到元素，返回 null， 如果传入的选择符不符合规范，会抛出错误。querySelector' on 'Document': '#d133#' is not a valid selector
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
它返回的节点不止一个，而是 NodeList 类数组对象，和 childNodes 的 NodeList 活动对象不一样的是，这里的 NodeList 实例是一个静态的快照，而非实时查询。可以使用 for...of、forEach、数组下标、item() 进行遍历或取值
```js
document.querySelectorAll('div') // 获取 div元素列表
// 获取 id 为 myDiv 的元素中所有的 em 元素
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

### matches()(原 matchesSelector())
matches 是 Selectors API Level 2 规范为 Element 新增的方法，规范的草案中称为 matchesSelector，接收一个 css 选择符参数。如果调用的元素与该选择符匹配则返回 true，否则返回 false。它可以方便的检测某个元素是否会被 querySelector() 或 querySelectorAll() 方法返回。
```js
if (document.body.matches('body.page1')) {
  // true
}
```

## 元素遍历
Element Traversal规范API, 对于元素间的空格，IE9 及之前的版本不会返回文本节点，其他浏览器都会返回文本节点。这导致使用 childNodes 和 firstChild 时行为不一致。为了弥补差异，又保持 DOM 规范不变，Element Traversal 规范新定义了一组属性, 支持该规范的有 IE9+
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
HTML5 代表与 HTML 截然不同的方向。以前的 HTML 规范中，从未出现过描述 JavaScript 接口的情形。HTML 是纯标记语言，JavaScript 绑定的事情，一般交给 DOM 规范去定义。然而 HTML5 规范却包含了与标记相关的大量 JavaScript API 定义。其中有的与 DOM 重合，定义了浏览器应该提供的 DOM 扩展。 
### css扩展 getElementsByClassName()与classList属性
获取指定类名的元素 List，IE9+，类型为 HTMLCollection 
```js
// 获取类中包含username和cureent的元素，类名先后顺序无所谓
document.getElementsByClassName('username cureent')
```
管理某个元素的 class 属性，IE10+
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
### 焦点管理 focus()，hasFocus()
默认情况下，文档刚加载完成，document.activeElement 保存的是 documen.body 的引用。加载期间值为 ßßßnul
```js
var button = document.getElementById('myButton')
button.focus(); // 自动获取焦点
document.activeElement === button // true
document.hasFocus() // true 文档是否拥有焦点
```

### HTMLDocument 扩展
- `document.readyState` 属性, loading 正在加载文档，complete 已经加载完文档
- `document.compatMode` 属性, 浏览器当前处于什么渲染模式 CSS1Compat 标准模式，BackCompat 混杂模式
- `document.head` 直接取 head 元素
```js
// 1. 
if (document.readyState === 'complete') {
  // 执行操作
}

if (document.compatMode === 'CSS1Compat') {
  console.log('standards mode') // 标准模式
} else { // 混杂模式 BackCompat
  console.log('quirks mode')
}

var head = document.head || document.getElementsByTagName('head')[0]
```

### charset 字符集属性
```js
document.charset // 'UTF-8'
```

### 自定义数据属性：data-
HTML可以自定义数据属性，但要添加 `data-` 前缀，如果定义了该属性，可以通过 dataset 属性来访问对应的扩展
```js
// <div id="myDiv" data-appId="12345" data-myname="Kevin"></div>
let div = document.getElementById('myDiv');

// 获取自定义属性的值
div.dataset // OMStringMap
div.dataset.appId // 12345
div.dataset.myname // Kevin

// 直接赋值，克改变对应的值。
```
### 插入标记/HTML
DOM 虽然已经为操纵节点提供了很多 API，但向文档中一次性插入大量的 HTML 时还是比较麻烦的。HTML5 将 IE 发明的 innerHTML、outerHTML、insertAdjacentHTML、insertAdjacentText 纳入了标准。 
- innerHTML 属性，读取元素的 innerHTML 属性时，会返回元素所有后代的 HTML 字符串。包括元素、注释和文本节点。在写入 innerHTML 时，会将设置的字符串解析为 DOM 子树，并代替元素之前的所有子节点。**现代浏览器中，通过 innerHTML 插入的 `<script>` 标签，是不会执行的。在 IE8 及之前版本中，只要插入元素指定了 defer 属性，且 `<script>` 之前是 scoped element(受控元素，能够在页面中看到的内容) 那就是可以执行的。** 

```js
// <div id="test">
// 	<div>child1</div>
// 	<div>child2</div>
// </div>
var t = document.getElementById('test');
t.innerHTML 
// "
// <div>child1</div>
// <div>child2</div>
// "
div.innerHTML = 'hello'
// <div id="test">hello</div>

// IE8 无法执行 <script> 字符串之前无 scoped element(页面可见的内容)
div.innerHTML = "<script defer>console.log('hi')<\/script>"
// 下面是可以在 IE8 执行的
div.innerHTML = "_<script defer>console.log('hi')<\/script>"
div.innerHTML = "<div>&nbsp;</div><script defer>console.log('hi')<\/script>"
```

- outerHTML 属性，获取元素的 HTML 字符串，元素本身加上其后代元素，相比 innerHTML 多了一个元素本身内容。
```js
// <div id="test">
// 	<div>child1</div>
// 	<div>child2</div>
// </div>
var t = document.getElementById('test');
t.outerHTML 
// '<div id="test">
//     <div>child1</div>
//     <div>child2</div>
//   </div>'
t.outerHTML = "<span>123</span>"
// <span>123</span>
```

- insertAdjacentHTML() 与 insertAdjacentText()，adjacent 意思是邻近的，毗连的。它可以指定 HTML 字符串或文本插入的位置。第一个参数为插入位置，第二个参数为字符串，第一个参数必须是下面 4 个常量字符串中的一个：
  - "beforebegin" 插入当前元素的前面，作为兄弟(sibling)节点。
  - "afterbegin" 插入当前元素内部，作为第一个子节点。
  - "beforeend" 插入当前元素内部，作为最后一个子节点。
  - "afterend" 插入当前元素后面，作为下一个同胞节点。
  - 假设元素为  `<div>hello</div>`，begin 是以 `<div>` 为基准，end 是以 `</div>` 为基准
```js
// 作为前一个同辈元素插入
element.insertAdjacentHTML('beforebegin', '<p>hello</p>');
element.insertAdjacentText('beforebegin', 'hello');

// 作为第一个子元素插入
element.insertAdjacentHTML('afterbegin', '<p>hello</p>');
element.insertAdjacentText('afterbegin', 'hello');

// 作为最后一个子元素插入
element.insertAdjacentHTML('beforeend', '<p>hello</p>');
element.insertAdjacentText('beforeend', 'hello');

// 作为后一个同辈元素插入
element.insertAdjacentHTML('afterend', '<p>hello</p>');
element.insertAdjacentText('afterend', 'hello');
```

- 内存与性能问题，上面介绍的替换子节点的方法，可能在浏览器中（特别是IE）导致内存问题。因为如果被移除的子树元素之前有关联的处理程序或 JS 对象。那他们之间的绑定关系会滞留在内存中。如果这种替换频繁发生，页面内存会持续攀升。使用上面的方法时，最后先手动删除要被替换的元素上关联的时间处理程序和 JS 对象。尽量减少这种操作。
- 跨站点脚本 XSS，尽管 innerHTML 不会执行自己创建的 script 元素标签，但仍然向恶意用户暴露了很大的攻击面。可以毫不费力的创建元素并执行 onclick 之类的属性。如果页面中要使用用户提供的信息，建议不要使用 innerHTML, 如果一定要使用，需要在插入前使用相关的防 XSS 库对他们进行转义。

### scrollIntoView()
元素.scrollIntoView() 方法，滚动到对应的元素位置。滚动到对应的元素位置，注意只能是元素节点调用，文本节点调用会报错。参数分三种情况：
- 参数是一个布尔值，alginToTop，true 时元素与窗口顶部对齐，false 时元素与底部对齐
- 参数是一个对象 scrollIntoViewOptions
  - behavior 定义过渡动画，默认为 "auto"，"smooth" 表示平滑滚动
  - block 垂直方向对齐，"start"(顶部)，"center"(中间)，"end"(底部)、"nearest"(chrome无效)，默认为 "start"
  - inline 水平方向对齐，"start"，"center"，"end"，"nearest"，默认为 "nearest"
- 不传参数，等价于传 true 元素与窗口顶部对齐
```js
let k = document.getElementById('myDiv');
k.scrollIntoView() // 等价于 k.scrollIntoView(true)
k.scrollIntoView(false) // 与底部对齐
k.scrollIntoView({
  behavior: "smooth",
  inline: "start"
})
```

## 专有扩展
### IE8文档模式(第四版已删除)
- IE8 引入了一个新的概念：文档模式 document.documentMode，只有 IE 支持，如果 IE11，值为 11，如果 IE8，值为 8，如果是其他浏览器，返回 undefined
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
element.children 属性，IE9 之前处理文本节点空白符时有差异，就出现了 children 属性，相当于 childNodes 的元素版，只包含元素，childElementCount 只能计算数量，不能获取List，这个就可以取元素。类型是 HTMLCollection
### contains()
elementA.contains(elementB) 方法可以检测 elementA 是否包含 elementB，如果是，则返回true，反则返回false。DOM Level 3 compareDocumentPosition() 可以更详细的获得两节点关系，compareDocumentPosition() 返回值比较绕，详情参见书 p457。他们都是 IE9+ 支持
```js
document.documentElement.contains(document.body) // true
document.documentElement.compareDocumentPosition(document.body) 
// 20 0x14 
```
### 插入标记(文本)
HTML5 将 IE 发明的 innerHTML 和 outerHTML 纳入了标准，但还有两个属性没有入选。就是剩下的 innerText、outerText； 除 Firefox 外所有主流浏览器都支持 outerText，他是一个非标准化的属性，建议不要使用。

innerText 和 textContent 区别
1. innerText/textContent都是获取文本或插入文本。前者 Firefox45 不支持（2016年3月），但支持 textContent(IE9+)。现在已经都支持了。**建议使用 innerText**
2. **innerText 会忽略行类的样式和脚本，textContent 会返回行内样式和脚本代码**
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