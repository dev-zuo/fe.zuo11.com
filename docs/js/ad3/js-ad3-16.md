---
title: 16. DOM2 和 DOM3 - JS高程4
description: DOM1（DOM Level 1）主要定义了 HTML 和 XML 文档的底层结构。DOM2（DOM Level 2）和 DOM3 级则在这些结构的基础上加入了更多的交互能力，支持更高级的 XML 特性。DOM2 和 DOM3 是按照模块化的思路来定制标准的，每个模块之间有一定关联，但分别针对某个 DOM 子集，这些模式如下
keywords: DOM2,DOM3,DOM Range,DOM 范围,DOM 操作样式表
---
# 16. DOM2 和 DOM3
DOM1（DOM Level 1）主要定义了 HTML 和 XML 文档的底层结构。DOM2（DOM Level 2）和 DOM3 级则在这些结构的基础上加入了更多的交互能力，支持更高级的 XML 特性。DOM2 和 DOM3 是按照模块化的思路来定制标准的，每个模块之间有一定关联，但分别针对某个 DOM 子集，这些模式如下：
- `DOM Core` 在 DOM1 核心部分的基础上，为节点添加方法和属性
- `DOM Views` 为文档定义了基于样式信息的不同视图
- `DOM Events` 定义通过事件实现 DOM 文档交互
- `DOM style` 定义了如何以编程的方式来访问和改变 CSS 样式
- `DOM Traveral and Range` 新增遍历 DOM 文档和选择文档内容的接口
- `DOM HTML` 在 DOM1 HTML 部分的基础上，增加属性、方法和新接口
- `DOM Mutation Observers` 定义基于 DOM 变化触发回调的接口，这个模块是 DOM4 模块，用于取代 Mutation Events
## DOM 的变化/演进
DOM2 和 DOM3 Core 模块的目的在于扩展 DOM API，以满足操作 XML 的所有需求，并提供更好的错误处理及特性检测能力。确定浏览器是否支持某些DOM 模块，返回 true，则支持，否则表示不支持
```js
// 第四版已删除下面的例子
document.implementation.hasFeature('Core', '2.0')
document.implementation.hasFeature('Core', '3.0')
document.implementation.hasFeature('HTML', '2.0')
document.implementation.hasFeature('Views', '2.0')
document.implementation.hasFeature('XML', '2.0')
document.implementation.hasFeature('CSS2', '2.0')
```
### 针对 XML 命名空间的变化
针对 XML 命名空间的变化(p461), createElementNS()，createElementNS() 等，一般尾部带有 NS 的，基本就是命名空间相关的。
### 其他方面的变化
除了命名空间相关的变化，DOM2 Core 还对 DOM 的其他部分做了一些更新。主要关注 DOM API 的完整性与可靠性。
#### DocumentType 类型的变化
DocumentType 类型（document.doctype）新增了三个属性： publicId, systemId, internalSubset。一般 HTML 文档中几乎不会涉及文档类型的内部子集，XML 文档中稍微多一点。
#### Document 类型变化
- 新增 importNode() 方法，类似 cloneNode()，用于复制节点。多用于 XML 文档
- DOM2 View 为 Document 新增 defaultView 属性，指向当前的 window。
- DOM2 Core 为 document.implementation 对象新增了 createDocumentType(), createDocument() 用于创建文档类型、文档节点。主要是 XML 使用。
- DOM2 HTML 为 document.implementation 对象新增了 createHTMLDocument(title) 方法，用于创建 HTML 文档
```js
let newNode = document.importNode(oldNode, true); // 导入节点以及其所有子节点
document.importNode(oldNode, false); // 仅复制本节点，不包含子节点

document.defaultView === window // true

// 创建 title 为 'new Doc' 的 HTML 文档(document)
document.implementation.createHTMLDocument('new Doc')
```

#### Node 的变化
DOM3 新增两个用于比较节点的方法：
- isSameNode() A.isSameNode(B)，两节点是否引用的是同一个对象。
- isEqualNode() A.isEqualNode(B) 两节点是否有相同的类型、相同的属性等。
```js
let div1 = document.createElement('div');
div1.setAttribute('css', 'box');

let div2 = document.createElement('div');
div2.setAttribute('css', 'box');

div1.isSameNode(div1) // true
div1.isSameNode(div2) // false
div1.isEqualNode(div2) // true
```
DOM3 增加了给 DOM 节点附加额外数据的方法：setUserData(key, value, handlerFunc) 在 HTML 中已过时，浏览器不支持，参考：[Node.setUserData() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/setUserData)

#### 框架(内嵌窗格)的变化
框架和内嵌框架分别用 HTMLFrameElement 和 HTMLIFrameElement(iframe) 表示。DOM2 HTML 为 HTMLIFrameElement 中新增了一个属性 contentDocument, 指向框架内容的文档对象。contentWindow 返回对应 iframe 的 window。
```js
let iframe = document.getElementById("myIframe");
let iframeDoc = iframe.contentDocument || iframe.contentWindow.document
```
## 样式
HTML 中的样式有 3 种定义方式：外部样式表(`使用<link>导入`)、文档样式表(`使用<style>元素`)、元素特定样式(`使用 style 属性`)。DOM2 Style 为这 3 种应用样式的机制，都提供了 API。

### 存取(访问和设置)元素样式
JS 可以通过 element.style 访问和设置 通过 style 属性为 element(对应元素) 设置的 css 样式。
- style 属性是 CSSStyleDeclaration 类型的实例。通过 style 获取的样式不包含通过层叠机制从文档样式或外部样式继承来的样式。
- css 属性在 JS style 中都有对应的属性，css 属性名使用连字符（font-family），在 JS 中需要转为驼峰大小写形式（fontFamily）
- 在使用 style 设置尺寸时，都需要包含单位。标准模式下，style.width 设置为 20，会导致被忽略，因为没有度量单位。混杂模式下是可以的，但为了兼容，建议都加上单位。
```js
let myDiv = document.createElement('div');
myDiv.appendChild(document.createTextNode('测试'));
document.body.appendChild(myDiv)

myDiv.style.backgroundColor = 'red';
myDiv.style.width = '100px';
myDiv.style.height = '200px'; // 不加单位可能会被忽略 200

myDiv.style.border = '1px solid black';
myDiv.style.cssText
// "background-color: red; width: 100px; height: 200px; border: 1px solid black;"
```
DOM2 Style 规范在 style 对象上定义了一些属性和方法。
- `cssText` 获取元素 style 属性中的 CSS 代码
- `length` 获取元素 style 属性中的 css 属性数量。无法写，赋值会无效
- `parentRule，表示 CSS 信息的 CSSRule 对象
- `getPropertyPriority(prop)` 获取 css 属性的优先级，如果是 `!important` 返回 "important" ，否则返回 ""
- `getProperyValue(prop)` 获取 css 属性的值
- `item(index)` 获取索引为 index 的 CSS属性名，`element.style.item(index)` 等价于 `element.style[index]`
- `setProperty(prop, value, priority)` 设置 css 属性，priority 为优先级，"important" 或 ""
- `removeProperty(prop)` 移除css属性
```html
<style>
	#normal-div {
		color: blue;
		background-color: #f00;
		display:block;
	}
</style>

<div id="inner-div" style="color:red;width:100px;height: 200px;font-size:29px">
	内联样式div
</div>
<div id="normal-div">正常样式</div>
<script>
	let innerDiv = document.getElementById('inner-div');
	let normalDiv = document.getElementById('normal-div');
	
	alert(innerDiv.style.cssText) 
	// "color: red; width: 100px; height: 200px; font-size: 29px;"
	alert(normalDiv.style.cssText) // ""
	normalDiv.cssText = 'color:white' // 设置内联样式

	alert(innerDiv.style.length) // 4
	alert(normalDiv.style.length) // 0
	
	for (let i = 0; i < innerDiv.style.length; i++) {
		let propertyName = innerDiv.style[i] 
		// 或者 innerDiv.style.item(i), color、width、height
		alert(propertyName)
	}
	
	let pn = innerDiv.style[0]; // color
	innerDiv.style.getPropertyValue(pn) // "red"
	innerDiv.style.getPropertyPriority(pn) // ""
	
	normalDiv.style.setProperty('color', 'white', "") 
	// normalDiV.style.cssText  // "color: white"
	normalDiv.style.setProperty('font-size', '20px', "important") 
	// "color: white; font-size: 20px !important;"
	normalDiv.style.getPropertyPriority('font-size') // "important"
	normalDiv.style.removeProperty('color'); // 移除对应的css属性
</script>
```
#### 访问层叠规则计算后的样式
由于 style 对象只是读取的元素通过 style 属性设置的样式，不包含从其他样式表层叠继承的样式信息。DOM2 Style 在 document.defaultView 上新增了 `getComputedStyle(元素, 伪元素字符串)` 方法来获取包含元素计算后的样式，它也是 CSSStyleDeclaration 类型的实例。

document.defaultView.getComputedStyle(element, null)，第二个参数是伪元素字符串如":after", 如果不需要，就传null

```js
let innerDiv = document.getElementById('inner-div');
let normalDiv = document.getElementById('normal-div');
normalDiv.style.cssText = '';

let computedStyle = document.defaultView.getComputedStyle(normalDiv, null) 
innerDiv.style.color // ""
computedStyle.color // 有的浏览器是 rgb(0,0,255) 有的是 #0000ff

```
### 操作样式表
> 可以获取、操作 `<style>` 元素和 `<link>` 元素导入的样式信息，他们里面的每一行样式信息都是一条 CSS 规则，可以进行读取和设置

CSSStyleSheet 类型表示 CSS 样式表，包括使用 `<link>` 元素和 `<style>` 元素定义的样式表。
- `<link>` 元素本身是 HTMLLinkElement
- `<style>` 元素本身是 HTMLStyleElement
- `CSSStyleSheet` 是一个通用的样式表类型，可以表示在 `<link>` 和 `<style>` 两个 HTML 元素定义的样式
- `document.styleSheets` 类型是 StyleSheetList 类数组对象。每一个子项都是 CSSStyleSheet 类型。表示文档中可用的 `<style>`、以及 rel 属性为 'stylesheet' 的 `<link>` 元素样式表集合。
- CSSStyleSheet 从 StyleSheet 类型继承了如下属性，除了 disabled 可以写，其他都只读。
	- `disabled`, 布尔值，是否禁用样式表，默认为 false
	- `href`，如果是 `<link>` 样式表，返回样式表的 URL，如果是 `<style>` 样式表，返回 null
	- `type`: "text/css"
	- `ownerNode`，一般为 'style' 或 'link'，如果当前样式表是通过 `@import` 被包含在另一个样式表中，则这个属性值为 null
	- `title`，ownerNode 的 title 属性
	- `parentStyleSheet` 如果样式表是通过 `@import` 导入的，则这个属性指向导入它的样式表。
- CSSStyleSheet 还支持如下属性
	- `cssRules` 当前样式表包含的样式规则集合，CSSRuleList (CSSStyleRule 对象数组)。如果 cssRules 不支持，就取 rules 属性值。
	- `ownerRule` 如果样式表是 `@import` 导入，则指向导入的那一行规则，否则为 null
	- `deleteRule(index)` 删除 cssRules 中索引为 index 的样式规则
	- `insertRule(rule, index)` 在指定位置向 cssRules 中插入规则
- CSSRule 表示样式表中的一条规则，CSSStyleRule 继承自它，表示样式信息，CSSStyleRule 有如下属性
	- `cssText` 返回整条规则文本
	- `parentRule` 如果这条规则被其他规则（如 `@media`）包含，则指向包含的规则，否则为 null
	- `parentStyleSheet` 包含当前规则的样式表
	- `selectorText` 返回规则的选择符文本
	- `style` 返回 CSSStyleDeclaration 对象，可以设置获取当前规则中的样式
	- `type` 数值常量，表示规则类型。对于样式规则，它始终为 1。
```js
document.styleSheets 
// StyleSheetList { 0: CSSStyleSheet, 1: CSSStyleSheet, ... }
document.styleSheets[0].rules // 
// CSSRuleList (CSSStyleRule 对象数组) 
// 记录了 css 文件或 style 标签里的样式信息 List
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
let sheet = document.styleSheets[0]
let rules = sheet.cssRules || sheet.rules
// 获取第一个<style>里的样式信息
rules.length // 2   ，分别为 #normal-div 及 div.box 的相关样式
rules[0].selectorText // "#normal-div"
rules[0].cssText  
// "#normal-div { color: blue; background-color: rgb(255, 0, 0); display: block; }"
rules[0].style.cssText 
//  "color: blue; background-color: rgb(255, 0, 0); display: block;"
rules[0].style.color // "blue"
rules[0].style.color = 'white' // 可以直接设置样式

rules[1].selectorText // "div.box"
rules[1].cssText  
// "div.box { width: 100px; height: 200px; background-color: blue; }"
rules[1].style.cssText 
// "width: 100px; height: 200px; background-color: blue;"
rules[1].style.width // "100px"

// 2. 创建CSSRule
let sheet = document.styleSheets[0];
// sheet.insertRule(cssText, pos)
sheet.insertRule("body {background-color: yellow;}", 0)  // 页面被改为yellow背景
sheet.rules.length // 3

// 3. 移除CSSRule
sheet.deleteRule(1) // 删除一个rules里面的规则
```
一般 Web 开发中很少用到上面的方法。更多的方法是使用 14 章介绍的动态样式加载技术。
### 元素尺寸/元素大小
下面介绍的属性和方法并不是 DOM2 Style 规范中定义的，但与 HTML 元素的样式有关。DOM 一直缺乏页面中元素实际尺寸的规范。IE 率先增加了一些属性，向开发者暴露元素尺寸信息，这些属性现在已经得到所有主流浏览器支持。

元素从内到外：元素内容 - 内边距(padding) - 边框(boder) - 外边距(margin)
#### 元素偏移量/偏移尺寸
- element.offsetHeight  元素内容 + 内边距(padding) + 边框(border) 
- element.offsetWidth   元素内容 + 内边距(padding) + 边框(border) 
- element.offsetTop     元素边框到父元素边框顶部之间的距离
- element.offsetLeft    元素边框到父元素边框左侧部之间的距离
- element.offsetLeft 与 element.offsetTop 都是相对于父元素的。真实的偏移量，要加上 element.offsetParent

这些偏移尺寸属性都是只读的，每次访问都会重新计算。使用时可以把该值放在一个局部变量中，避免影响性能。
#### 元素客户端尺寸(client dimensions)
元素客户端尺寸就是**元素内部的空间**。不包含border，margin，滚动条占用的空间。
- element.clientHeight  元素内容 + 内边距
- element.clientWidth   元素内容 + 内边距
#### 滚动大小
- element.scrollHeight  元素整个区域的高度
- element.scrollWidth  整个区域的宽度
- element.scrollLeft 被隐藏区域左侧的像素宽度
- element.scrollTop  被隐藏区域顶部的像素高度

结合滚动事件监听可以做一个页面百分比显示模块，scrollWidth 和 scrollHeight 可以用来确定元素内容的实际尺寸。clientWith 和 clientHeight 是视口的大小，不包含滚动区域。

```js
// demo
// <div id="inner-div" style="height: 100px;overflow:scroll;color:red;width:100px;height: 200px;font-size:29px;margin:10px;padding:20px;border:2px solid #ccc;">
// </div>
let k2 = document.getElementById('inner-div');
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

#### 确定元素尺寸

element.getBoundingClientRect()，返回一个 DOMRect 对象，包含 left、top、right、bottom、height、width 属性，给出了元素在页面中相对于视口的位置。其中 e.right = e.left + e.width，e.bottom = e.top + e.height

## DOM 遍历
DOM2 Traversal and Range 模块，定义了两个类型用于辅助顺序遍历 DOM 结构：NodeIterator, TreeWalker。他们可以从某个起点开始执行对 DOM 结构的优先遍历。

```html
<!DOCTYPE html>
<html>
	<head>
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
NodeIterator 节点遍历器，可以通过 document.createNodeIterator() 方法创建 NodeIterator 实列，然后用nextNode(), previousNode()，访问前一个节点，或后一个节点。

document.createNodeIterator(root, whatToShow, filter, entityReferenceExpansion)
- root 作为 DOM 树中搜索起点的元素节点 
- whatToShow 可选，表示需要访问哪些节点？可以过滤节点，可选值值如下：除了 SHOW_ALL，其他的可以用 | 来组合多个
	- NodeFilter.SHOW_ALL: 显示所有类型的节点
	- NodeFilter.SHOW_ELEMENT：显示元素节点
	- NodeFilter.SHOW_ATTRIBUTE 属性节点，由于 DOM 的结构，实际用不上
	- NodeFilter.SHOW_TEXT：显示文本节点
	- NodeFilter.SHOW_COMMENT：显示注释节点
	- NodeFilter.SHOW_DOCUMENT：显示文档节点
	- NodeFilter.SHOW_DOCUMENT_TYPE：显示文档类型节点
	- ...
- filter 可选, 一个 NodeFilter 对象或函数，表示是否接收或跳过特定节点
- entiryReferenceExpansion 可选, 布尔值，是否要扩展实体引用，在 HTML 文档中没效果。
```js
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
```
使用 filter 参数过滤节点，该参数可以使一个 NodeFilter 对象，对象只有一个 acceptNode() 方法，如果要跳过该节点，返回 NodeFilter.FILTER_SKIP，否则返回 NodeFilter.FILTER_ACCEPT。filter 参数也可以使与 acceptNode 形式一样的函数
```js
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
// 等价于
// let filter = function(node) {
// 	if (node.nodeType === 3 && node.nodeValue.trim() === '') {
// 		return NodeFilter.FILTER_SKIP; // 跳过该节点
// 	} else {
// 		return NodeFilter.FILTER_ACCEPT;
// 	}
// } 
let iterator2 = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, filter)
// 只显示元素节点和文本节点
let node = iterator2.nextNode() 
// 第一个nextNode() 会返回根节点。遍历到最后一个节点，会是null
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
TreeWalker，是 NodeIterator 的一个更高级的版本，支持 parentNode(), firstChild(), lastChild(), nextSibling(), previousSibling()，可以用 document.createTreewalker() 方法创建 TreeWalker 实例。参数和 document.createNodeIterator() 一致
```js
// TreeWalker 里面的 filter 新增 NodeFilter.FILTER_REJECT 参数
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

更多详情，参考 p482，相关文章：[玩转DOM遍历——用NodeIterator实现getElementById，getElementsByTagName方法 - venoral - 博客园](https://www.cnblogs.com/venoral/archive/2016/05/16/5499358.html)
## 范围(range)
为了支持对页面更细致的控制，DOM2 Tarversal and Range 模块定义了范围接口。范围可用于在文档中选择内容，而不用考虑节点之间的界限。在 DOM 操作的粒度不够时可以使用。document.createRange() 方法用于创建一个 DOM 范围对象，类型为 Range，包含如下属性
- `startContainer` 范围起点所在的节点，即选区中的第一个节点的父节点。 
- `startOffset` 范围起点在 startContainer 中的偏移量。如果 startContainer 是文本节点、注释节点或CData区块节点，startOffset 表示跳过的字符数, 否则表示范围中第一个节点的索引。
- `endContainer` 范围重点所在的节点，即选区中最后一个子节点的父节点
- `endOffset` 范围起点在 startContainer 中的偏移量（与 startOffset 中偏移量的含义相同）
- `commonAncestorContainer`， 祖先节点，文档中以 startContainer 和 endContainer 为后代的最深的节点。
```js
let range = document.createRange() 
range.startContainer // #document
range.startContainer === document // true
range.endContainer === document // true
```
### 简单选择
通过范围选择文档中某个部分最简单的方式是使用 selectNode() 和 selectNodeContents()。两个方法都接收一个节点作为参数，并将该节点的信息调价到调用它的范围。更多细节参考 p483
```js
// <body>
//   <p id="p1"><b>Hello</b> world!</p>
// </body>

let range1 = document.createRange();
let range2 = document.createRange();
let p1 = document.getElementById('p1');

range1.selectNode(p1);  
// range1 包含 <p id="p1"><b>Hello</b> world!</p>
range2.selectNodeContents(p1); 
// range2 包含 <b>Hello</b> world!
```

### 复杂选择
setStart()、setEnd() 两个方法可以创建更复杂的范围。它们都接收两个参数：参照节点和偏移量。如果是 setStart() 参照节点会成为 startContainer，偏移量赋值给 startOffset。对于 startEnd() 参照节点会成为 endContainer，偏移量会赋值给 endOffset。
```js
// <body>
//   <p id="p1"><b>Hello</b> world!</p>
// </body>
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild, // "Hello"
    worldNode = p1.lastChild; // " world!" textNode
    
let range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
// range "llo</b> wo"
```
### 操作范围
操作 DOM 范围中的内容
- range.deleteContents() 删除范围中的内容
- range.extractContents() 删除范围中的文本内容，并返回对应的文档片段 nodeType 为 11，DocumentFragment
- range.cloneContents() 如果不想把范围中文档中删除，可以使用 cloneContents() 复制文档片段
```js
// <body>
//   <p id="p1"><b>Hello</b> world!</p>
// </body>
// 1. 删除范围中的文本内容 deleteContents()
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild; // "hello"
    worldNode = p1.lastChild; // " world!" textNode
    
let range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
// range   "llo</b> wo"
range.deleteContents();
// <p id="p1"><b>He</b>rld!</p>

// 2. 删除范围中的文本内容，并返回对应的文档片段 extractContents()
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild; // "hello"
    worldNode = p1.lastChild; // " world!" textNode
    
let range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
// range   "llo</b> wo"
let fragment = range.extractContents();
p1.parentNode.appendChild(fragment);
// <body>
// 	<p id="p1"><b>He</b>rld!</p>	
// 	<b>llo</b> wo
// </body>
```

### 范围插入
向 DOM 范围中插入内容 
- range.insertNode(元素内容) 在 range 中插入内容
- range.surroundContents(元素) 提取 range 中的内容，用对应的元素节点包裹，再插入对应的位置
```js
// 1. range.insertNode(), 在 range 中插入内容
let p1 = document.getElementById('p1'),
    helloNode = p1.firstChild.firstChild; // "hello"
    worldNode = p1.lastChild; // " world!" textNode
    
let range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
// range "llo</b> wo"

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

### 范围折叠/比较/复制/清理
**范围折叠** 如果范围没有选择文档的任何部分，则称为折叠(collapsed)。
```js
range.collapse(true) // 折叠到起点位置
range.collapse(false) // 折叠到结束位置
```

**范围比较**，比较 DOM 范围 range1.compareBoundaryPoints(比较方式常量, range2)。比较方式常量值，可选如下，如果相等，返回 0，range1 的点位于 range2 的点之前，返回 -1， 如果在之后，返回 1
- Range.START_TO_START(0) 比较 range1 和 range2 的起点
- Range.START_TO_END(1) 比较 range1 的起点和 range2 的终点
- Range.END_TO_END(2) 比较 range1 和 range2 的终点
- Range.END_TO_START(3) 比较 range1 的终点和 range2 的起点

**复制 DOM 范围**
```js
let newRange = range.cloneRange()
```

**清理 DOM 范围**
```js
range.detach(); // 从文档中分离
range = null // 解除引用
```