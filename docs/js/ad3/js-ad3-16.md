# 16. DOM2和DOM3
DOM1级主要定义的是HTML和XML文档的底层结构，DOM2和DOM3级则在这个结构的基础上引入更多的交互能力，支持更高级的XML特性
```js
// DOM Level 2 Core - 在DOM1核心基础上构建，为节点添加更多方法和属性
// DOM Level 2 Views - 为文档定义了基于样式信息的不同视图
// DOM Level 2 Events  - DOM2事件在第13章讨论
// DOM Level 2 style - 定义了如何以编程的方式来访问和改变CSS样式
// DOM Level 2 Traveral and Range - 引入遍历DOM文档和选择其特定部分的新接口
// DOM Level 2 HTML - 在DOM1级HTML基础上构建，添加了更多属性方法和新接口
```
## DOM变化
DOM2级和DOM3级目的在于扩展DOM API，以满足操作XML的所有需求，同时提供更好的错误处理及特性检测能力。
```js
// 确定浏览器是否支持某些DOM模块，返回true，则支持，否则表示不支持
document.implementation.hasFeature('Core', '2.0')
document.implementation.hasFeature('Core', '3.0')
document.implementation.hasFeature('HTML', '2.0')
document.implementation.hasFeature('Views', '2.0')
document.implementation.hasFeature('XML', '2.0')
document.implementation.hasFeature('CSS2', '2.0')

```
### 针对XML命名空间的变化
针对XML命名空间的变化(p306), createElementNS()等，createElementNS() ，一般尾部带有NS的，基本就是命名空间相关的。
### 其他方面的变化
DOM的其他部分在"DOM2级核心"中也发生了一些变化，这些变化与XML命名空间无关，而是更倾向于确保API的可靠性及完整性。
#### DocumentType类型的变化
DocumentType类型新增了三个属性： publicId, systemId, internalSubset ，document.doctype.xxx
#### Document类型变化
新增importNode 类似cloneNode()
```js
var newNode = document.importNode(oldNode, true); // 导入节点以及其所有子节点
document.importNode(oldNode, false); // 仅复制本节点，不包含子节点
```
- DOM3级方法，比较节点isSameNode()、isEqualNode() 
```js
// A.isSameNode(B)，两节点是否引用的是同一个对象
// A.isEqualNode(B) 两节点是否有相同的类型、相同的属性等。
var div1 = document.createElement('div');
div1.setAttribute('css', 'box');

var div2 = document.createElement('div');
div2.setAttribute('css', 'box');


div1.isSameNode(div1) // true
div1.isSameNode(div2) // false
div1.isEqualNode(div2) // true

```
#### Node类型的变化
- 新增isSupported('HTML', "2.0")，和hasFeature()方法类似
- DOM3级针对为DOM节点添加额外数据引入了新方法setUserData() 浏览器暂未实现 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/setUserData

#### 框架的变化
框架和内嵌框架分别用HTMLFrameElement和HTMLIFrameElement表示，它们在DOM2级中新增了一个属性 contentDocument, 指向框架内容的文档对象。ie8+
```js
var iframe = document.getElementById("myIframe");
var iframeDoc = iframe.contentDocument || iframe.contentWindow.document
```

## 样式
js可以通过 element.style 可以访问和设置css样式，**通过element.style获取、操作的只能是内联样式。**
```js
var myDiv = document.createElement('div');
myDiv.appendChild(document.createTextNode('测试'));
document.body.appendChild(myDiv)

myDiv.style.backgroundColor = 'red';
myDiv.style.width = '100px';
myDiv.style.height = '200px'; //标准模式下，style.width设置为20，会导致被忽略，因为没有度量单位

myDiv.style.border = '1px solid black';

```
### 访问元素的样式
#### DOM样式属性和方法
> 注意：style对象只能获取和操作内联样式

- cssText 读：获取元素的内联样式，写：设置元素的内联样式，非内联样式，值为""
- length  获取内联style样式个数。无法写，赋值会无效
- getPropertyPriority() 获取css属性的优先级，如果是!important 返回 "important" 否则返回""
- getProperyValue() 获取css属性的值
- item(index) 获取对应的样式属性
- setProperty()  设置css属性
- removeProperty()  移除css属性
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>测试Style</title>
		<style>
			#normal-div {
				color: blue;
				background-color: #f00;
				display:block;
			}
		</style>
	</head>
	<body>
		<div id="inner-div" style="color:red;width:100px;height: 200px;font-size:29px">
			内联样式div
		</div>
		<div id="normal-div">
			正常样式
		</div>
		<script>
		  let innerDiv = document.getElementById('inner-div');
		  let normalDiv = document.getElementById('normal-div');
		  
		  // 1. e.style.cssText 读：获取元素的内联样式，写：设置元素的内联样式，非内联样式，值为""
		  alert(innerDiv.style.cssText) // "color: red; width: 100px; height: 200px; font-size: 29px;"
		  alert(normalDiv.style.cssText) // ""
		  normalDiv.cssText = 'color:white' // 设置内联样式
		  
		  // 2. e.style.length  获取内联style样式个数。无法写，赋值会无效
		  alert(innerDiv.style.length) // 4
		  normalDiv.cssText = '' // 设置内联样式
		  alert(normalDiv.style.length) // 0
		  
		  // 3. e.style[0] 或者 e.style.item(0) 遍历style
		  for (let i = 0; i < innerDiv.style.length; i++) {
		    let propertyName = innerDiv.style[i] // 或者 innerDiv.style.item(i), color、width、height
		    alert(propertyName)
		  }
		  
		  // 4. e.style.getPropertyValue(propertyName) 获取css属性的值
		  //    e.style.getPropertyPriority(propertyName) 获取css属性的优先级，如果是!important 返回 "important" 否则返回""
		  let pn = innerDiv.style[0]; // color
		  innerDiv.style.getPropertyValue(pn) // "red"
		  innerDiv.style.getPropertyPriority(pn) // ""
		  
		  // 5. e.style.setProperty(pn, value, priority) 设置css属性，e.style.removeProperty(pn) 移除css属性
		  normalDiv.style.setProperty('color', 'white', "") // normalDiV.style.cssText  // "color: white"
		  normalDiv.style.setProperty('font-size', '20px', "important") // "color: white; font-size: 20px !important;"
		  normalDiv.style.getPropertyPriority('font-size') // "important"
		  normalDiv.style.removeProperty('color'); // 移除对应的css属性
		</script>
	</body>
</html>
```
#### 访问计算后的样式
由于style对象只能读取内联的样式。\<style\>标签与内联样式计算后的样式可以通过document.defaultView.getComputedStyle来获取
- 获取所有样式属性（只读） document.defaultView.getComputedStyle(element, null)，第二个参数是伪元素字符串如":after",如果不需要，就传null
```js
let innerDiv = document.getElementById('inner-div');
let normalDiv = document.getElementById('normal-div');
normalDiv.style.cssText = '';

let computedStyle = document.defaultView.getComputedStyle(normalDiv, null) 
innerDiv.style.color // ""
computedStyle.color // rgb(0,0,255)

```
### 操作样式表
> 可以获取、操作\<style\>元素，<link>导入的样式信息，他们里面的每一个样式信息都是一条规则，可以进行读取和设置

CSSStyleSheet类型表示的是样式表，包括以下两个部分：
- HTMLLinkElement类型，\<link\>元素导入的样式
- HTMLStyleElement类型，\<style\>元素中定义的样式

```js
// document.styleSheets返回的CSSStyleSheet对象包含：\<style\>元素和rel特性为"stylesheet"的link元素引入的样式表。
document.styleSheets // StyleSheetList (CSSStyleSheet对象数组)，包含link、和style标签里的样式信息
document.styleSheets[0].rules // CSSRuleList (CSSStyleRule对象数组) ，记录了css文件或style标签里的样式信息List
document.styleSheets[0].rules[0] // CSSStyleRule 对象，每一条记录，可以通过.selectorText和.cssText 获取到对应的选择器和样式信息
```
操作规则（获取、新增、删除）示例：
```js
/*
style例子：
<style>
  #normal-div {
    color: blue;
    background-color: #f00;
    display:block;
  }
  div.box {
    width: 100px;
    height: 200px;
    background-color: blue;
  }
</style>
*/
// 1.获取 <style> 里的样式信息CSSRule
var rules = document.styleSheets[0].rules; // 获取第一个<style>里的样式信息  等价于.cssRules
rules.length // 2   ，分别为 #normal-div 及 div.box 的相关样式
rules[0].selectorText // "#normal-div"
rules[0].cssText  // "#normal-div { color: blue; background-color: rgb(255, 0, 0); display: block; }"
rules[0].style.cssText //  "color: blue; background-color: rgb(255, 0, 0); display: block;"
rules[0].style.color // "blue"
rules[0].style.color = 'white' // 可以直接设置样式

rules[1].selectorText // "div.box"
rules[1].cssText  // "div.box { width: 100px; height: 200px; background-color: blue; }"
rules[1].style.cssText // "width: 100px; height: 200px; background-color: blue;"
rules[1].style.width // "100px"

// 2. 创建CSSRule
var sheet = document.styleSheets[0];
// sheet.insertRule(cssText, pos)
sheet.insertRule("body {background-color: yellow;}", 0)  // 页面被改为yellow背景
sheet.rules.length // 3

// 3. 移除CSSRule
sheet.deleteRule(1) // 删除一个rules里面的规则
```

### 元素大小 
从内到外：元素内容 - 内边距 - 边框 - 外边距
#### 偏移量
- offsetHeight  元素内容 + 内边距(padding) + 边框(border) 
- offsetWidth   元素内容 + 内边距(padding) + 边框(border) 
- offsetTop     元素边框到父元素边框顶部之间的距离
- offsetLeft    元素边框到父元素边框左侧部之间的距离
#### 客户区大小
- clientHeight  元素内容 + 内边距
- clientWidth   元素内容 + 内边距
#### 滚动大小
结合滚动事件监听可以做一个页面百分比显示模块
- scrollHeight  整个区域的高度
- scrollWidth  整个区域的宽度
- scrollLeft 被隐藏区域左侧的像素宽度
- scrollTop  被隐藏区域顶部的像素宽度
```js
// <div id="inner-div" style="height: 100px;overflow:scroll;color:red;width:100px;height: 200px;font-size:29px;margin:10px;padding:20px;border:2px solid #ccc;">
// 	内联样式div
// </div>
var k2 = document.getElementById('inner-div');
k2.offsetHeight // 144 边框(border) + 内边距(padding) + 元素height
k2.offsetWidth // 144 边框(border) + 内边距(padding) + 元素width
k2.offsetLeft // 距离左边的距离
k2.offsetTop // 距离顶部的距离

// clientWidth 内边距(padding) + 元素width
// clientHeight 内边距(padding) + 元素height

k2.scrollHeight // 703  实际可见为100左右
k2.scrollTop // 0 改变该参数，可以设置滚动位置

k2.scrollWidth // 横向滚动相关
k2.scrollLeft  // 可以设置横向滚动位置
```

- element.getBoundingClientRect()，返回一个矩形对象，left、top、right、bottom，元素相对于视窗的位置

## DOM遍历
> NodeIterator, TreeWalker

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Example</title>
	</head>
	<body>
		<p><b>Hello</b> world!</p>
	</body>
</html>sss
```
遍历节点顺序：

![DOM Iterator](/images/js/domIterator.png)

### NodeIterator
- NodeIterator，节点遍历器，document.createNodeIterator()方法可以创建NodeIterator实列，然后用nextNode(), previousNode()，访问前一个节点，或后一个节点。更多参见https://www.cnblogs.com/venoral/archive/2016/05/16/5499358.html
```js
// document.createNodeIterator(root, whatToShow, filter, entityReferenceExpansion)
// - root [必选] 作为DOM树中搜索起点的元素节点 
// = hatToShow [可选] 表示需要访问哪些节点？可以过滤节点，可选值值如下：除了SHOW_ALL，其他的可以用 | 来组合多个
//   NodeFilter.SHOW_ALL: 显示所有类型的节点
//   NodeFilter.SHOW_ELEMENT：显示元素节点
//   NodeFilter.SHOW_TEXT：显示文本节点
//   NodeFilter.SHOW_COMMENT：显示注释节点
//   NodeFilter.SHOW_DOCUMENT：显示文档节点
//   NodeFilter.SHOW_DOCUMENT_TYPE：显示文档类型节点
//
// - filter [可选] 一个NodeFilter对象，
// - entiryReferenceExpansion [可选] 布尔值，是否要扩展实体引用，不适合

let iterator = document.createNodeIterator(document)  // 第二个字段等同于 NodeFilter.SHOW_ALL
let node = iterator.nextNode()
while (node !== null) {
  console.log(`nodeType: ${node.nodeType}, nodeName: ${node.nodeName}, nodeValue: ${node.nodeValue}, tagName: ${node.tagName}`);
  node = iterator.nextNode();
}
// 所有节点，包含doctype、回车空的textNode
// nodeType: 9, nodeName: #document, nodeValue: null, tagName: undefined
// nodeType: 10, nodeName: html, nodeValue: null, tagName: undefined
// nodeType: 1, nodeName: HTML, nodeValue: null, tagName: HTML
// nodeType: 1, nodeName: HEAD, nodeValue: null, tagName: HEAD
// nodeType: 3, nodeName: #text, nodeValue: 
// 		, tagName: undefined
// nodeType: 1, nodeName: META, nodeValue: null, tagName: META
// nodeType: 3, nodeName: #text, nodeValue: 
// 		, tagName: undefined
// nodeType: 1, nodeName: TITLE, nodeValue: null, tagName: TITLE
// nodeType: 3, nodeName: #text, nodeValue: Example, tagName: undefined
// nodeType: 3, nodeName: #text, nodeValue: 
// 	, tagName: undefined
// nodeType: 1, nodeName: BODY, nodeValue: null, tagName: BODY
// nodeType: 3, nodeName: #text, nodeValue: 
// 		, tagName: undefined
// nodeType: 1, nodeName: P, nodeValue: null, tagName: P
// nodeType: 1, nodeName: B, nodeValue: null, tagName: B
// nodeType: 3, nodeName: #text, nodeValue: Hello, tagName: undefined
// nodeType: 3, nodeName: #text, nodeValue:  world!, tagName: undefined
// nodeType: 3, nodeName: #text, nodeValue: 
// 	
// , tagName: undefined
// null


let filter = {
  acceptNode: function(node) {
    // 如果是空的文本节点，过滤掉
    if (node.nodeType === 3 && node.nodeValue.trim() === '') {
      return NodeFilter.FILTER_SKIP; // 跳过该节点
    } else {
      return NodeFilter.FILTER_ACCEPT;
    }
  }
};
let iterator2 = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, filter) // 只显示元素节点和文本节点
let node = iterator2.nextNode() // 第一个nextNode() 会返回根节点。遍历到最后一个节点，会是null
while (node !== null) {
  console.log(`nodeType: ${node.nodeType}, nodeName: ${node.nodeName}, nodeValue: '${node.nodeValue}', tagName: ${node.tagName}`);
  node = iterator2.nextNode();
}
// nodeType: 1, nodeName: HTML, nodeValue: 'null', tagName: HTML
// nodeType: 1, nodeName: HEAD, nodeValue: 'null', tagName: HEAD
// nodeType: 1, nodeName: META, nodeValue: 'null', tagName: META
// nodeType: 1, nodeName: TITLE, nodeValue: 'null', tagName: TITLE
// nodeType: 3, nodeName: #text, nodeValue: 'Example', tagName: undefined
// nodeType: 1, nodeName: BODY, nodeValue: 'null', tagName: BODY
// nodeType: 1, nodeName: P, nodeValue: 'null', tagName: P
// nodeType: 1, nodeName: B, nodeValue: 'null', tagName: B
// nodeType: 3, nodeName: #text, nodeValue: 'Hello', tagName: undefined
// nodeType: 3, nodeName: #text, nodeValue: ' world!', tagName: undefined
// null


let iterator3 = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT) // 只显示元素节点
let node = iterator3.nextNode() // 第一个nextNode() 会返回根节点。遍历到最后一个节点，会是null
while (node !== null) {
  console.log(`nodeType: ${node.nodeType}, nodeName: ${node.nodeName}, nodeValue: '${node.nodeValue}', tagName: ${node.tagName}`);
  node = iterator3.nextNode();
}
// nodeType: 1, nodeName: HTML, nodeValue: 'null', tagName: HTML
// nodeType: 1, nodeName: HEAD, nodeValue: 'null', tagName: HEAD
// nodeType: 1, nodeName: META, nodeValue: 'null', tagName: META
// nodeType: 1, nodeName: TITLE, nodeValue: 'null', tagName: TITLE
// nodeType: 1, nodeName: BODY, nodeValue: 'null', tagName: BODY
// nodeType: 1, nodeName: P, nodeValue: 'null', tagName: P
// nodeType: 1, nodeName: B, nodeValue: 'null', tagName: B
// null

```

### TreeWalker
- TreeWalker，是NodeIterator的一个更高级的版本，支持parentNode(), firstChild(), lastChild(), nextSibling(), previousSibling()，可以用document.createTreewalker()方法创建TreeWalker对象。参数和document.createNodeIterator()一致
```js
// TreeWalker 里面的filter 新增 NodeFilter.FILTER_REJECT参数
// NodeFilter.FILTER_SKIP  跳过节点，到子树的下一个节点
// NodeFilter.FILTER_REJECT 跳过节点及该节点的整个子树
// NodeFilter.FILTER_ACCEPT 不过滤节点
let walker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT)
let node = walker.nextNode() // 第一个nextNode() 会返回根节点。遍历到最后一个节点，会是null
while (node !== null) {
  console.log(`nodeType: ${node.nodeType}, nodeName: ${node.nodeName}, nodeValue: '${node.nodeValue}', tagName: ${node.tagName}`);
  node = walker.nextNode();
};
// nodeType: 1, nodeName: HTML, nodeValue: 'null', tagName: HTML
// nodeType: 1, nodeName: HEAD, nodeValue: 'null', tagName: HEAD
// nodeType: 1, nodeName: META, nodeValue: 'null', tagName: META
// nodeType: 1, nodeName: TITLE, nodeValue: 'null', tagName: TITLE
// nodeType: 1, nodeName: BODY, nodeValue: 'null', tagName: BODY
// nodeType: 1, nodeName: P, nodeValue: 'null', tagName: P
// nodeType: 1, nodeName: B, nodeValue: 'null', tagName: B
// null

// walker.firstChild()
// walker.nextSibling()
// walker.currentNode // 当前节点，给该节点赋值，可以改变起点。
```

## 4.范围(range)
DOM2级在Document类型中定义了createRange()方法。返回Range对象。
```js
let range = document.createRange() 
range.startContainer // 包含范围起点的节点。即选区中的第一个节点的父节点。就是docuemnt  
// range.startContainer === document // true

```
- 用DOM范围实现简单选择
```js
// <body>
//   <p id="p1"><b>Hello</b> world!</p>
// </body>

let range1 = document.createRange();
let range2 = document.createRange();
let p1 = document.getElementById('p1');

range1.selectNode(p1);  // range1 包含 <p id="p1"><b>Hello</b> world!</p>
range2.selectNodeContents(p1); // range2 包含 <b>Hello</b> world!
```

- 用DOM范围实现复杂选择
```js
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild, // "hello"
    worldNode = p1.lastChild; // " world!" textNode
    
let range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
// rang   "llo</b> wo"
```

- 操作DOM范围中的内容
```js
// 1. 删除范围中的文本内容 deleteContents()
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild; // "hello"
    worldNode = p1.lastChild; // " world!" textNode
    
let range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
// rang   "llo</b> wo"
range.deleteContents();
// <p id="p1"><b>He</b>rld!</p>

// 2. 删除范围中的文本内容，并返回对应的文档片段 extractContents()
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild; // "hello"
    worldNode = p1.lastChild; // " world!" textNode
    
let range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
// rang   "llo</b> wo"
let fragment = range.extractContents();
p1.parentNode.appendChild(fragment);
// <p id="p1"><b>He</b>rld!</p>
// <b>llo</b> wo

// 3. range.cloneContents() // 克隆文档片段
```

- 插入DOM范围中的内容 range.insertNode()，range.surroundContents()
```js
// 1. range.insertNode(), 直接在range中插入内容
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild; // "hello"
    worldNode = p1.lastChild; // " world!" textNode
    
let range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
// rang   "llo</b> wo"

let span = document.createElement('span');
span.style.color = 'red';
span.appendChild(document.createTextNode('Inserted text'));
range.insertNode(span);

// <p id="p1"><b>He  插入到这里  llo</b> world!</p>
// html 内容
// <p id="p1"><b>He<span style="color:red">Inserted text</span>llo</b> world!</p>

// 2. range.surroundContents(), 提取range中的内容，用对应的元素节点包裹，再插入对应的位置
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild; // "hello"
    worldNode = p1.lastChild; // " world!" textNode    
let range = document.createRange();
range.selectNode(helloNode);
let span = document.createElement('span');
span.style.backgroundColor = 'yellow';
range.surroundContents(span);
// <p id="p1"><b><span style="background-color:yellow">Hello</span></b> world!</p>

```

- 折叠DOM范围
```js
range.collapse(true) // 折叠到起点位置
range.collapse(false) // 折叠到结束位置
```

- 比较DOM范围 range1.compareBoundaryPoints(比较方式常量, range2)
```js
// 比较方式常量值，可选如下，如果相等，返回 0，range1的点位于range2的点之前，返回 -1， 如果在之后，返回1
// Range.START_TO_START(0) 比较range1和range2的起点
// Range.START_TO_END(1) 比较range1的起点和range2的终点
// Range.END_TO_END(2) 比较range1和range2的终点
// Range.END_TO_START(3) 比较range1的终点和range2的起点
```

- 复制DOM范围
```js
let newRange = range.cloneRange()
```

- 清理DOM 范围
```js
range.detach(); // 从文档中分离
range = null // 解除引用
```