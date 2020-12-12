---
title: 14. DOM - JS高程4
description: DOM（文档对象模型 Document Object Model），是 HTML 和 XML 文档的编程接口，DOM 描绘了一个层次化的结点树，允许开发人员添加、移除和修改页面的各个部分。1998年10月，DOM Level 1 成为 W3C 的推荐标准，为基本的文档结构及查询提供了接口。DOM Level 1 定义了名为 Node 的接口，该接口是所有 DOM 结点类型都必须实现的，Node 接口在 JS 中被实现为 Node 类型。除 IE 外所有浏览器都可以直接访问 Node，所有结点类型都继承自Node类型，因此所有的结点类型都共享相同的属性和方法, 每个节点都有一个 nodeType 属性，用于表明节点的类型，节点类型总共有 12 种，分别对应一个常量
keywords: DOM,节点类型,节点操作,dom编程
---
# 14. DOM

DOM（文档对象模型 Document Object Model），是 HTML 和 XML 文档的编程接口，DOM 描绘了一个层次化的结点树，允许开发人员添加、移除和修改页面的各个部分。1998年10月，DOM Level 1 成为 W3C 的推荐标准，为基本的文档结构及查询提供了接口。

## 节点层次
DOM 可以将 HTML 或 XML 文档描绘成一个由多层结点构成的结构，节点分为不同的类型，每种类型分别表示文档中不同的信息或标记，每个节点都拥有各自的特性、数据和方法，与其他节点存在某种关系。节点之间的关系，构成了层次，形成树形结构。

![document结构](/images/js/document结构.png)

document 节点是每个文档的根节点，根节点的唯一子节点是 `html` 元素，称之为文档元素（documentElement），它是文档的最外层元素。文档中的其他所有元素都包含在其中。每个文档只能有一个文档元素，在 HTML 页面中文档元素始终是 `<html>` 元素。在 XML中，没有预定义的元素，任何元素都可能成为文档元素

## 节点(Node)类型
DOM Level 1 定义了名为 Node 的接口，该接口是所有 DOM 结点类型都必须实现的，Node 接口在 JS 中被实现为 Node 类型。**除 IE 外所有浏览器都可以直接访问 Node**，所有结点类型都继承自Node类型，因此所有的结点类型都共享相同的属性和方法, **每个节点都有一个 nodeType 属性，用于表明节点的类型**，节点类型总共有 12 种，分别对应一个常量
- `Node.ELEMENT_NODE（1）` 元素节点，最常见的一种，比如 span、body、h2 等都是元素节点
- `Node.ATTRIBUTE_NODE（2）` 特性（attribute）节点，element.attributes[0]，一般元素节点上的属性(特性) 对象就是特性节点。比如 id、class、name 等。
- `Node.TEXT_NODE（3）` 文本节点，文字基本都是文本节点
- `Node.CDATA_SECTION_NODE（4）` (只针对XML文档)
- `Node.ENTITY_REFERENCE_NODE（5）`
- `Node.ENTITY_NODE（6）`
- `Node.PROCESSING_INSTRUCTION_NODE（7）`
- `Node.COMMENT_NODE（8）` 注释节点，注释
- `Node.DOCUMENT_NODE（9）` document，文档节点。一个 html 只有一个, .title, .URL, .referrer
- `Node.DOCUMENT_TYPE_NODE（10）` doctype节点，HTML5最顶部
- `Node.DOCUMENT_FRAGMENT_NODE（11）` 文档片段节点，属于中间节点，过度用
- `Node.NOTATION_NODE（12）`

```js
// 判断节点类型
if (someNode.nodeType === Node.ELEMENT_NODE) { // 在IE中无效
    alert("Node is an element.");
}

// IE 没有公开 Node 类型的构造函数，所以上面的方法在 IE 中不支持
if (someNode.nodeType === 1) { // 适用于所有浏览器
    alert("Node is an element.");
}
```

**浏览器并不支持所有的节点类型，开发者最常用的是元素节点和文本节点**
### nodeName 与 nodeValue 属性
```js
if (someNode.nodeType === 1) {
    value = someNode.nodeName;  
    // 对于元素节点
    // nodeName 始终为元素的标签名（大写），nodeValue 始终为 null
}

document.title = 'test' // 可以修改标题
document.nodeName // "#document"
document.nodeType // 9 Node.DOCUMENT_NODE

document.head.nodeName   // "HEAD"
document.head.nodeType  // 1 ELEMENT_NODE
document.node.nodeValue // null
```

### 节点关系
每个节点都有一个 childNodes 属性，它的值是一个 **NodeList 对象**，属于类数组对象。可以使用数组下表、item()、forEach、length 访问或遍历 NodeList 对象的内容。NodeList 对象是对 DOM 结果的查询，DOM 结构的变化会自动在 NodeList 对象中反映出来，**它是实时的活动对象**，而不是第一次获得内容的快照。

```js
document.childNodes // NodeList(2) [html, html] 文档类型节点,文档节点
document.childNodes instanceof Array // false

// 1.子节点 childNodes 是 NodeList 对象
let firstChild = someNode.childNodes[0];
let secondChild = someNode.childNodes.item(1);
let count = someNode.childNodes.length;
```
可以通过数组的 slice 、Array.from 方法将类数组的 NodeList 对象，转为真正的数组
```js
let arr = Array.prototype.slice.call(document.childNodes, 0)
arr instanceof Array // true
// 也可以使用 Array.from
let arr = Array.from(document.childNodes)
```
每一个元素节点都拥有下面的属性或方法：
- `childNodes` 元素的子节点（NodeList 对象）
- `parentNode` 元素的父节点
- `previousSibling` 元素的前一个兄弟节点
- `nextSibling` 元素的后一个兄弟节点
- `firstChild` 元素的第一个子节点
- `lastChild` 元素的最后一个子节点
- `hasChildNodes()` 元素是否有子节点
- `ownerDocument` 指向文档节点的指针，全等于(===) document
```js
let len = someNode.childNodes.length
someNode.childNodes[len - 1] === someNode.lastChild
someNode.childNodes[0] === someNode.firstChild

// 查询某个节点是否有子节点
someNode.hasChildNodes()  // true or false
```

![nodeRelation](/images/js/nodeRelation.png)

### 操作节点
节点的关系指针都是只读的，DOM 又提供了一些操作节点的方法：
- `appendChild(节点)` 向元素的 childNodes 列表末尾添加节点，返回值为新增加的节点。如果把传入的是已有的节点，会将该节点从原来的位置转移到新位置。
- `insertBefore(newNode, null/oldNode)` 如果想把节点插入指定位置，可以使用该函数。新节点会插入到第二个参数节点前面。如果为 null 就等价于 appendChild。
- `replaceChild(newNode, replaceNode)` 将要替换的节点，换成新的节点。被替换的节点从 document 中移除。
- `removeChild()` 删除节点，删除成功后返回被删除的节点。

其他方法：

- `cloneNode(是否深复制)` 复制一个相同的副本，这个副本属于文档所有，但没有指定父节点，也称为孤儿节点（orphan）。参数为 true 时执行深复制，复制节点及整个节点树，false 时只复制调用该方法的节点本身。
- `normalize()` 处理文本节点，检测调用节点的所有后代，如果有空文本节点就删除，如果是兄弟文本节点，就合并为一个文本节点。

```js
// 在末尾新增一个子节点  appendChild() 用于向childNodes列表的末尾添加一个节点
let returnedNode = someNode.appendChild(newNode);
alert(returnedNode === newNode); // true
alert(someNode.lastChild === newNode); // true

// 如果appendChild()操作的节点已经是文档的一部分了，会将原来的节点转移到新的位置
let returnedNode = someNode.appendChild(someNode.firstChild);
alert(returnedNode === someNode.firstChild); // false
alert(returnedNode === someNode.lastChild); // true

// 在指定位置插入节点 insertBefore()
// 插入后成为最后一个子节点
someNode.insertBefore(newNode,null);
// 插入后成为第一个子节点
someNode.insertBefore(newNode,someNode.firstChild);
// 插入到最后一个子节点前面
someNode.insertBefore(newNode,someNode.lastChild);

// 替换节点 replaceChild(要插入的节点，要替换的节点), 返回被替换的节点
someNode.replaceChild(newNode, someNode.firstChild); // 替换第一个子节点
someNode.replaceChild(newNode, someNode.lastChild);  // 替换最后一个子节点 

// 移除节点
someNode.removeChild(someNode.firstChild); // 移除第一个子节点
someNode.removeChild(someNode.lastChild);  // 移除最后一个子节点

// myList
//<ul> 
//  <li>item 1</li>
//  <li>item 2</li>
//  <li>item 3</li>
//</ul>
let deepList = myList.cloneNode(true);
deepList.chilidNodes.length // 3，如果是cloneNode(false)则为0，不包含子节点
let shallowList = myList.cloneNode(false) // 浅复制，只是复制节点本身，不会复制子节点
shallowList.childNodes.length // 0

```

### Document类型(9) document
>（Node.DOCUMENT_NODE 9）

Document 类型表示文档节点类型，在浏览器中 `document` 对象是 HTMLDocument 的一个实例，它继承自 Document 类型，表示整个 html 页面，document 对象是 window 的一个属性，可以全局使用。Document 类型的节点具有以下特征
- nodeType 的值为 9 Node.DOCUMENT_NODE
- nodeName 为 "#document", nodeValue === null , parentNode === null ownerDocument === null
- 在浏览器中，其子节点一般是一个DocumentType(最多一个\<\!DOCTYPE html\>)，Element类型(最多一个\<html\>)
- 一般文档类型的对象是只读的
#### 文档子节点
```js
// 如下页面
// <!DOCTYPE html>
// <html>
//     <body>
//     </body>
// </html>
let html = document.documentElement; // <html> 标签元素
alert(html === document.childNodes[1]); //true
alert(html === document.firstChild); // false  0 为<!docytype html>

let body = document.body;
let doctype = document.doctype; // 如果有就是<!docytype html>，如果头部没写，就是null
```
#### 文档信息
```js
console.log(document.title); // 获取标题
document.title = "JS高程"; // 设置标题

// 获取完整URL
let url = document.URL;
// 取得域名
let domain = document.domain;
// 来源的URL，如果是直接进入，则为"", 
// 如果从https://github.com/zuoxiaobai?tab=repositories进入到当前页面
let referrer = document.referrer; 
// 如果是上面的场景，则值未"https://github.com/zuoxiaobai?tab=repositories"
```
#### 定位/查找元素
- document.getElementById('kk') 获取文档中第一个 id 为 kk 的元素，类型为 HTMLElement
- document.getElementsByTagName('div')  获取页面所有的div元素 HTMLCollection，和 NodeList 类型，是活动对象
- document.getElementsByName('kk') 获取name='kk' 的所有元素 HTMLCollection
- document.getElementsByClassName('kk') 获取class='kk'的所有元素 HTMLCollection
```js
// <div id="myDiv">Some text</div>
let div = document.getElementById("myDiv");  // 如果没有该id的元素，值为null
div instanceof  HTMLElement // true

let div2 = document.getElementsByTagName('div');
div2 instanceof HTMLCollection // true HTMLElement数组
div2[0] instanceof HTMLElement // true

//  <img src="1.png" height="500" width="300">
// <img src="2.png" name="myImg" height="500" width="300">
let images = document.getElementsByTagName('img');
alert(images.length); // 2
alert(images[0].src);
alert(images.item(0).src); // src内容


imgs.namedItem('myImg') === imgs["myImg"] // 2.png那张图片

// <text id='t' name="color">textkkkk</text>
document.getElementsByName('color') // 获取name属性为color的元素
```
#### 特殊集合
document 对象上还暴露了几个特殊的集合，这些集合也是 HTMLCollection 的实例
- document.anchors 获取文档中所有带 name 特性的 a 元素，必须要有 name 属性
- document.forms 相当于 document.getElementsByTagName('form')
- document.images 相当于 document.getElementsByTageName('img')
- document.links 获取所有a元素，相当于 documet.getElmentsByTagName('a')

#### DOM 兼容性检测
检测浏览器是否支持某些 DOM 功能及版本等信息 p412

#### 文档写入
document 对象有一个古老的能力，就是向网页流中写入内容，document.write() document.writeln() 向文档中输入内容，他们的参数都是字符串。write() 只是写入文本，writeln() 除了写入文本外还会在字符串末尾追加一个换行符 `\n`
```html
<!-- 使用document.write()在页面呈现的过程中直接向其中输入了内容-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>document.write() Title</title>
</head>
<body>
    <p>The current date and time is:
    <script>
        document.write("<strong>"+(new Date()).toLocaleString()+"</strong>");
    </script></p>
</body>
</html>
```
在文档加载结束后，再调用document.write()会覆盖、重写整个页面的内容
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>document.write() Title</title>
</head>
<body>
    <p>The current date and time is</p>
    <script>
        window.onload = function() {
            document.write("hello world");
        }
    </script>
</body>
</html>
```

### DocumentType类型(10)
>（10 Node.DOCUMENT_TYPE_NODE）

DocumentType 包含着与文档的 doctype 有关的所有信息 document.firstChild => `<!DOCTYPE html>`，document.doctype
- nodeType 的值为 10  Node.DOCUMENT_TYPE_NODE
- nodeName 的值为 doctype 类型 'html'
- nodeValue 的值为 null 
- 父节点 document， 不支持子节点
```js
let e = document.firstChild  // <!DOCTYPE html>
e.nodeType // 10
e.nodeName // html
e.nodeValue  // null
```

### Element类型(1)
> （1 Node.ELEMENT_NODE）

除 Document 类型外，Element 类型算是 Web 编程中最常用的类型了，它用于表现 XML 或 HTML 元素，提供了对元素标签名、子节点及特性的访问
- nodeType 的值为 1
- nodeName 的值为元素的标签名, nodeValue === null , parentNode 可能是 Document 或 Element 对象
- 访问元素的标签名可以使用 nodeName 属性，也可以使用 tagName 属性，两个属性会返回相同的值
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <div id="myDiv"></div>
    <script>
        let div = document.getElementById("myDiv");

        // 在HTML中，标签名始终都以全部大写表示
        alert(div.tagName); // DIV
        alert(div.tagName === div.nodeName); // true
    </script>
</body>
</html>
```

#### HTML元素属性
所有的 HTML 元素都由 HTMLElement 类型或其子类型表示，HTMLElement 类型继承自 Element，并添加了一些属性
- id，元素在文档中的唯一标识符
- className 与元素的class属性对应，及元素指定的css类
- title 有关元素的附加说明
- lang 元素内容的语言，很少使用
- dir 语言方向, 值为 "ltr"（left to right，从左至右）或 "rtl"(right to left，从右至左)，很少使用
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <div id="myDiv" class="bg" title="body text" lang="en" dir="rtl">abcdefg</div>
    <script>
        let div = document.getElementById("myDiv");

        // 在HTML中，标签名始终都以全部大写表示
        alert(div.id); // myDiv
        alert(div.className); // bg
        alert(div.title); // body text
        alert(div.lang); // en
        alert(div.dir); // rtl   这里注意，文字会在屏幕右边显示，类似于右对齐。从右边开始显示

        // 也可以直接修改属性, 立即生效
        div.id = "someOther";
        div.className = "ft";
        div.title = "Some other text";
        div.lang = "ch";
        div.dir = "ltr";
    </script>
</body>
</html>
```
HTML元素以及与之关联的类型，斜体表示已经废弃的

![HTML_type_1](/images/js/HTML_type_1.png)
![HTML_type_2](/images/js/HTML_type_2.png)

#### 获取/设置属性/特性
每个元素都有零个或多个属性，用于为元素或其内容附加更多信息。相关的 DOM 方法主要有三个:
- getAttribute(prop) 获取元素的属性名，prop 属性名，属性名不区分大小写
- setAttribute(prop, value) 设置元素的属性
- removeAttribute(prop) 移除元素属性
```js
let div = document.getElementById("myDiv");
div.id // myDiv
div.getAttribute('id') // myDiv

// 设置特性值
div.setAttribute('id', 'test') // 等价于 div.id = 'test'

div.removeAttribute('class') // 删除class特性
```
#### attributes属性
可以用来增删查改特性，主要用来遍历某个元素的特性。元素的 attributes 属性是 NamedNodeMap 对象，是类似与 NodeList 的活动对象，支持数组下标，item()，forEach 遍历或访问对应的值。它里面的值都是 属性(特性)节点 Node.ATTRIBUTE_NODE（2)，NamedNodeMap 对象包含如下方法：
- getNamedItem(prop) 获取属性 prop 的属性节点
- removeNameItem(prop) 移除 prop 属性
- setNamedItem(node) 向列表中添加 node 节点
- item(pos) 返回 pos 索引位置的节点
```js
// 获取某个节点的属性列表, 类型为 NamedNodeMap
// <div id="myDiv" class="bg" title="body text" lang="en" dir="rtl">abcdefg</div>
let myDiv = document.getElementById('myDiv')
let s = myDiv.attributes 
// NamedNodeMap {0: id, 1: class, 2: lang, 3: dir, id: id, class: class, lang: lang, dir: dir, length: 4}

s.getNamedItem('id').nodeName // id  
s.getNamedItem('id').nodeValue // myDiv

s['title'].nodeValue = 'xxx'  // 设置title特性值为xxx
s[0].nodeValue // myDiv 

s.removeNamedItem('id') // 移除id的特性，相当于 s.removeAttribute('id')
```
#### 创建元素
document.createElement('元素名称')
```js
// 创建一个div元素
// <div class=​"ft">footer</div>​
k = document.createElement('div')
k.id = 'id2'
k.innerText = '1212'
document.getElementsByClassName('ft')[0].appendChild(k)
// <div class=​"ft">footer<div id='id2'>1212</div></div>​
```

childNodes 属性包含元素的所有子节点：可能是元素节点(1)、文本节点(3)、注释(8)等，如果是找元素节点，我们再遍历时需要判断下 nodeType 是否为 1
### Attr类型(2)
> (2 Node.ATTRIBUTE_NODE)

特性节点类型，element.attributes 就是特性节点数组，子元素就是特性节点
- nodeType 的值为 2
- nodeName 的值为特性的名称，比如 id
- nodeValue 的值为特性的值，比如 xx
- parentNode 的值为 null
- 不支持子节点

```js
let attr = document.createAttribute('align');
attr.value = 'left';

attr.nodeType // 2
attr.nodeName // align
attr.nodeValue // left

let element = document.createElement('div');
element.setAttribute(attr);
element.attributes['align'].value // left
element.getAttributeNode('align').value // left
element.getAttribute('align') // left
```

**属性作为节点来访问，多数情况下是没必要的，推荐使用 getAttribute()、removeAttribute()、setAttribute() 方法操作属性**
### Text 类型(3)
> （4 Node.TEXT_NODE）

文本节点有 Text 类型表示，不能包含 HTML 代码，不支持子节点
- nodeType的值为 3  Node.TEXT_NODE
- nodeName 的值为 '#text'
- nodeValue 的值为节点所包含的文本

Text 节点暴露了以下属性和方法
- `appendData(text)` 向节点末尾添加文本 text
- `deleteData(offset, count)` 从 offset 位置开始，删除 count 个字符
- `insertData(offset, text)` 从 offset 位置插入 text
- `replaceData(offset, count, text)` 用 text 替换从 offset 位置开始到 offset + count 位置的文本
- `splitText(offset)` 在 offset 位置将当前文本节点拆分为两个节点
- `subStringData(offset, count)` 提取从位置 offset 到 offset + count 位置的文本
- `normalize()` 规范化文本节点，合并多个子文本节点
- `length` 文本包含的字符数量

创建文本节点
- `document.createTextNode(text)` 创建文本节点
```js
//  <div id='someOther' class='ft' title='Some other text'>abcdefg</div>
let oth = document.getElementById('someOther')
let textNode = oth.childNodes[0] // Text()  
textNode.nodeType // 3
textNode.nodeName // "#text"
textNode.nodeValue // "abcdeft"
textNode.nodeValue = 'ddd'   // 修改text的值

// 代码创建一个文本节点，挂载到元素节点div上，再放到body里面
let e = document.createElement('div')
e.className = 'message'

let tNode = document.createTextNode('hello world')
e.appendChild(tNode)

// 一个div可以多增加几个textNode，中间不会有空格，会连着显示。
let tNode2 = document.createTextNode('---hello world---')
e.appendChild(tNode2)

document.body.appendChild(e)

e.childNodes.length // 2
e.normalize() // 规范化文本节点
e.childNodes.length // 1

// 再分割文本节点 
let newNode = e.firstChild.splitText(5)
e.firstChild.nodeValue // 'hello'
newNode.nodeValue // " world---hello world---"
e.childNodes.length // 2
```

### Comment 类型(8)
>（8 Node.COMMENT_NODE）

注释类型，创建注释类型：document.createComment('注释内容')
- nodeType 的值为 8  Node.COMMENT_NODE
- nodeName 的值为 '#comment'
- nodeValue 的值为 注释类型 等价于 `.data`

```js
let divEle = document.createElement('div');
let comNode = document.createComment('测试注释类型');
divEle.id = "comDiv";
divEle.appendChild(comNode);

comNode.nodeType // 8
comNode.nodeName // "#comment"
comNode.nodeValue // 测试注释类型  
comNode.data // 测试注释类型，以上两种都可以修改注释内容

```
### CDATASection 类型(4)
XML CDATA 相关，浏览器不支持，略。详情参见 423
### DocumentFragment(11)
>（11 Node.DOCUMENT_FRAGMENT_NODE）

文档片段类型，不会真正的再文档里形成节点，类似与一个中转节点。
- nodeType 的值为 11
- nodeNmae 的值为 "#document-fragment"
- nodeValue 的值为 null
- parentNode 的值为 null
```js
let fragment = document.createDocumentFragment();

let ul = document.createElement('ul');
for (let i = 0; i < 3; i++) {
  let li = document.createElement('li');
  li.appendChild(document.createTextNode(`text ${i}`));
  fragment.appendChild(li)
}
ul.appendChild(fragment);
document.body.appendChild(ul);

ul.childNodes // 只有3个 li 子节点

```

## DOM编程/操作技术
DOM 操作往往是 JS 程序中开销最大的部分，NodeList 对象是动态的，每次访问 NodeList 对象，都会运行一次查询，尽量少 DOM 操作
### 动态添加脚本script
```js
// <script type='text/javascript' src='text.js'></script>
// test.js 里面 alert('test dynamic script')
// 添加一个script脚本元素节点
let scriptNode = document.createElement('script');
scriptNode.src = 'test.js';
// scriptNode.type = 'text/javascript'; 第 4 版省略
document.body.appendChild(scriptNode);

// 上面是载入一个 js 文件，下面是以行内方式加载 js 代码
let sNode = document.createElement('script');
sNode.type = 'text/javascript';
// sNode.appendChild(document.createTextNode('function sayHi() { alert("Hi"); }'));
sNode.text = 'function sayHi() {alert("Hi");} sayHi()';  // 兼容IE写法

document.body.appendChild(sNode);

// 封装成函数
function loadScriptString(scriptStr) {
  let script = document.createElement('script');
  script.type = 'text/javascript';
  try {
    script.appendChild(document.createTextNode(scriptStr));
  } catch (e) {
    // IE下可能会失效，走这里的逻辑
    script.text = scriptStr;
  }
  document.body.append(script);
}
loadScriptString('function sayHi() { alert("Hi"); } sayHi()');

// 等效于
eval('function sayHi() { alert("Hi"); } sayHi()');
```

**通过 innerHTML 属性创建的 `<script>` 元素永远不会执行。以后也没法强制执行。**
### 动态添加样式style
```js
//  <link rel="stylesheet" type="text/css" href="test.css">
let linkNode = document.createElement('link');
linkNode.rel = 'stylesheet';
linkNode.setAttribute('type', 'text/css'); // 熟悉下语法
linkNode.href = 'test.css';
document.head.appendChild(linkNode);
// document.head 等价于 document.getElementsByTagName('head')[0]

// text node
// <style>
//   body { color: red }
// </style>
function loadStyleString(cssStr) {
  let styleNode = document.createElement('style');
  try {
    styleNode.appendChild(document.createTextNode(cssStr));
  } catch (e) {
    // IE 不允许动态添加 script、style标签子节点，会报异常，需要特殊处理
    styleNode.styleSheet.cssText = cssStr;
  }
  document.body.appendChild(styleNode);
}
loadStyleString('body {color: red;}');

```

### 操作表格HTML-DOM
动态创建一个表格，html 代码如下，先利用 DOM API 来动态创建。再利用 HTML-DOM 提供的 table、tbody、tr 方法来重构
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>表格</title>
  </head>
  <body>
    <table border="1" width="100%">
      <tbody>
        <tr>
          <td>Cell 1,1</td>
          <td>Cell 1,2</td>
        </tr>
        <tr>
          <td>Cell 2,1</td>
          <td>Cell 2,2</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

```
js实现
```js
let tableNode = document.createElement('table');
tableNode.border = '1';
tableNode.width = '100%';

let tbodyNode = document.createElement('tbody');

// 添加第一行
let tr1 = document.createElement('tr');
let td11 = document.createElement('td');
td11.appendChild(document.createTextNode('Cell 1,1'));
let td12 = document.createElement('td');
td12.appendChild(document.createTextNode('Cell 1,2'));
tr1.appendChild(td11);
tr1.appendChild(td12);

// 添加第二行
let tr2 = document.createElement('tr');
let td21 = document.createElement('td');
td21.appendChild(document.createTextNode('Cell 2,1'));
let td22 = document.createElement('td');
td22.appendChild(document.createTextNode('Cell 2,2'));
tr2.appendChild(td21);
tr2.appendChild(td22);

tbodyNode.appendChild(tr1);
tbodyNode.appendChild(tr2);

tableNode.appendChild(tbodyNode);
document.body.appendChild(tableNode);

```
HTML DOM为方便创建表格提供的 table、tbody、tr 属性及方法
```html
<table border="1" width="100%">
  <caption>表格的标题</caption>
  <thead>
    <tr>
      <th>列1</th>
      <th>列2</th>
    </tr>
  </thead>
  
  <tbody>
    <tr>
      <td>Cell 1,1</td>
      <td>Cell 2,1</td>
    </tr>
    <tr>
      <td>Cell 1,1</td>
      <td>Cell 2,1</td>
    </tr>
  </tbody>
  
  <tfoot>
    <tr>
      <td colspan='2'>table foot</td>
    </tr>
  </tfoot>
</table>
```
```js
// 先获取table元素
let tableEle = document.getElementsByTagName('table')[0];

// table元素节点 相关属性
tableEle.caption // 获取caption元素节点，如果没有，则返回null
tableEle.tBodies // <tbody>元素的数组， HTMLCollection   tableEle.tBodies[0] 一个tbody元素
tableEle.tFoot // 获取tFoot元素节点
tableEle.tHead // 获取tHead元素节点
tableEle.rows // 获取表格里的tr数组，包含thead、tfoot，4个  tableEle.rows[0] tr节点

// table元素节点 相关方法insert
tableEle.createTHead() // 如果table内已有<thead>，返回对应的thead元素节点，如果没有，创建<thead></thead>并添加到表格，返回其引用
tableEle.createTFoot() // 如果table内已有<tfoot>，返回对应的tfoot元素节点，如果没有，创建<tfoot></tfoot>并添加到表格，返回其引用
tableEle.createCaption() // 如果table内已有<caption>，返回对应的节点，如果没有，创建<caption></caption>并添加到表格，返回其引用

tableEle.deleteTHead() // 删除<thead>元素节点
tableEle.deleteTFoot() // 删除<tfoot>元素节点
tableEle.deleteCaption() // 删除<caption>元素节点
tableEle.deleteRow(pos) // 删除rows里面的某一行，从0开始，tableEle.deleteRow(0)，删除第一个tr节点
tableEle.insertRow(pos) // 创建一个<tr>添加到table里，并返回其引用，如果pos不传值，添加到末尾，(tfoot里面)，tableEle.insertRow(0) 在首部添加tr

// tbody 元素的属性及方法
let tbodyNode = tableEle.tBodies[0];
tbodyNode.rows // <tbody> 里的元素数组 HTMLColletion, length = 2
tbodyNode.deleteRow(pos) // 删除指定位置tr节点
tbodyNode.insertRow(pos) // 在指定位置插入节点

// tr 元素属性及方法
let trNode = tbodyNode.firstElementChild; // 第一个元素节点
trNode.cells // 保存着tr里面的单元格列表元素，HTMLCollection   <td> List
trNode.deleteCell(pos) // 删除指定位置的单元格
trNode.insertCell(pos) // 指定位置添加<td></td>

```

用table相关的HTML-DOM API重写之前创建table的例子

```js
let tableNode = document.createElement('table');
tableNode.border = '1';
tableNode.width = '100%';

let tbodyNode = document.createElement('tbody');

// 添加第一行
let tr1 = tbodyNode.insertRow(0);
let td1 = tr1.insertCell(0);
let td2 = tr1.insertCell(1);
td1.appendChild(document.createTextNode('Cell 1,1'));
td2.appendChild(document.createTextNode('Cell 1,2'));

// 添加第二行
let tr2 = tbodyNode.insertRow(1);
let td3 = tr2.insertCell(0);
let td4 = tr2.insertCell(1);
td3.appendChild(document.createTextNode('Cell 2,1'));
td4.appendChild(document.createTextNode('Cell 2,2'));

tableNode.appendChild(tbodyNode);
document.body.appendChild(tableNode);
```

### NodeList
理解 NodeList 对象和相关的 NamedNodeMap、HTMLCollection 是理解 DOM 编程的关键。这三个集合都是 "实时的"，也叫 "活动对象"。节点是动态的，他们始终是最新的。

下面的例子中，获取了某个节点元素，每次访问其 length 时，元素都有动态更新，length 也会动态增加是个死循环，为了提高性能，尽量少操作dom
```js
// <div>123</div>
let divs = document.getElementsByTagName('div'), i, div;

for (let i = 0; i < divs.length; i++) {
  div = document.createElement('div');
  console.log(i) // 死循环
  document.body.appendChild(div);
}

// 改写上面的死循环，这样就只执行有限的个数了。
let divs = document.getElementsByTagName('div'), i, div;
let length = 0;
for (i = 0, length= divs.length; i < length; i++) {
  div = document.createElement('div');
  document.body.appendChild(div);
}
```

最好限制操作 NodeList 的次数，或者把 NdoeList 的结果缓存起来。


## MutationObserver 接口

MutationObserver 接口是 DOM 新增的规范。它可以在 DOM 被修改时异步执行回调。可以观察整个文档或 DOM 树的一部分，或某个元素的变化。

MutationObserver 实例需要通过 MutationObserver 构造函数并传入一个回调函数来创建

```js
let observer = new MutationObserver(console.log)
observer // MutationObserver {}
```

新创建的 MutationObserver 实例不会关联 DOM 的任何部分，需要使用 observe() 方法来关联 DOM。当 DOM 发生指定变化时会触发回调函数。这里的回调函数和 Promise.then 类似，是微任务。

MutationObserver 实例包含以下几个方法：
- `observe(要观察的dom节点, MutationObserverInit 对象)`，设置需要观察的 DOM，以及观察的内容。MutationObserverInit 对象用于控制观察 DOM 哪方面的变化。
- takeRecords() 可以清空记录队列，取出并返回其中的所有 MutationRecord 实例
- disconnect() 停止观察，提前终止执行回调。并抛弃已经加入微任务队列的回调。

```js
let observer = new MutationObserver(console.log)
// 监听 document.body 元素上属性变化，其子节点变更不会触发 回调
observer.observe(document.body, { attributes: true })
document.body.className = 'test'
console.log('changed body class')

// changed body class
// [MutationRecord]0: MutationRecord {type: "attributes", target: body.test, addedNodes: NodeList(0), removedNodes: NodeList(0), previousSibling: null, …}length: 1__proto__: Array(0) 
// MutationObserver {}

// MutationRecord 展开
// {
//   addedNodes: NodeList []
//   attributeName: "class"
//   attributeNamespace: null
//   nextSibling: null
//   oldValue: null
//   previousSibling: null
//   removedNodes: NodeList []
//   target: body.test
//   type: "attributes"
//   __proto__: MutationRecord
// }
```
上面的例子中我们可以看到，当属性发生变化后，触发了 MutationObserver 实例的回调函数，且回调函数的第一个参数是 **MutationRecord 实例的数组**（因为回调函数执行之前，可能同时发生了多个满足观察条件的事件，所以是数组）。第二个参数是 **MutationObserver 实例**。下面是 MutationRecord 数组的例子：

```js
let observer = new MutationObserver(console.log)
observer.observe(document.body, { attributes: true })
document.body.className = 'a'
document.body.className = 'b'
document.body.className = 'c'
console.log('changed body class')
// 打印信息如下，回调函数第一个参数是 mutationRecords
// 第二个参数是 MutationObserver 实例
// [MutationRecord, MutationRecord, MutationRecord] 
// MutationObserver {}
```

MutationRecord 实例包含的信息包括发生了什么变化，以及 DOM 的哪一部分受了影响。它包含如下实例属性

- `target` 被修改影响的目标节点，比如上面例子中的 body 元素
- `type` 字符串，表示监听变化的类型，比如: "attributes"、"characterData" 或 "childList"
- `oldValue` 旧值，如果 type 是 attributes 或 characterData，在 MutationObserverInit 对象中设置了 attributeOldValue 或 characterDataOldValue 为 true，就会保存旧的值，否则为 null 
- `attributeName` type 为 "attributes" 时，保存被修改的属性名
- `attributeNamespace` type 为 "attributes" 时，被修改的命名空间属性名
- `addedNodes` type 为 "childList" 时，返回包含变化中添加节点的 NodeList，默认为空 NodeList
- `removeNodes` type 为 "childList" 时，返回包含变化中删除节点的 NodeList，默认为空 NodeList
- `previousSibling` type 为 "childList" 时，返回变化节点的前一个兄弟 Node，默认为 null
- `nextSibling` type 为 "childList" 时，返回变化节点的后一个兄弟 Node，默认为 null

**disconnect()方法** 下面的例子中，不会有任何内容输出，如果想要让已加入任务队列的回调执行。可以在使用 disconnect 时，加上 setTimeout

```js
let observer = new MutationObserver(console.log)
observer.observe(document.body, { attributes: true })
document.body.className = 'foo' // 将要触发的回调加入微任务队列，继续向下执行
observer.disconnect() // 停止观察，并将已加入微任务队列的回调清空
document.body.className = 'bar' // 已停止观察，无法触发

let observer = new MutationObserver(console.log)
observer.observe(document.body, { attributes: true })
document.body.className = 'foo' // 将要触发的回调加入微任务队列，继续向下执行
setTimeout(() => {
  // 将下面的内容加入宏任务队列，等待执行，这个时候会将微任务队列的回调执行
  observer.disconnect() // 停止观察，并将已加入微任务队列的回调清空
  document.body.className = 'bar' // 已停止观察，无法触发
}, 0)

// 会触发一次回调
// [MutationRecord] MutationObserver {}
```

MutationObserver 实例可以复用，observer() 一个 DOM 后，再次调用 observer() 观察另一个 DOM 也是可以的。通过 MutationRecord 的 target 可以区分是哪个 DOM 发生的变化。disconnect() 后，两个 DOM 都会停止观察。

注意：使用 disconnect() 后，再次调用 observer() 开始监听 DOM，是可以继续监听，并触发回调的。详情参见：p437
### MutationObserverInit与观察范围
MutationObserverInit 对象用于控制观察范围，他的属性如下
- `subtree` 布尔值，默认 false。是否观除了观察目标节点外，还观察目标节点的子树，后代子节点
- `attributes` 布尔值，默认 false。是否观察目标节点属性变化
- `attributeFilter` 字符串数组，表示要观察哪些属性变化。如果值为 true，会将 attributes 设置为 true，观察所有属性
- `attributeOldValue` 布尔值，默认 false，表示 MutationRecord 是否记录旧的值。如果为 true，也会将 attributes 转换为 true
- `characterData` 布尔值，默认为 false，表示修改字符数据是否触发变化事件
- `characterDataOldValue` 布尔值，默认 false，表示 MutationRecord 是否记录旧的值，如果为 true，会将 characterData 转换为 true
- `childList` 布尔值，默认为 false，表示修改目标节点的子节点是否触发变化事件，

#### 观察属性

```js
let observer = new MutationObserver(console.log)
observer.observe(document.body, { attributeOldValue: true })
document.body.setAttribute('foo', 'a')
document.body.setAttribute('foo', 'b')
document.body.removeAttribute('foo')
// 以上 添加属性、修改属性、移除属性都被记录下来了，oldValue 分别为 null, 'a', 'b'
// [MutationRecord, MutationRecord, MutationRecord] 
// MutationObserver {}

let observer = new MutationObserver(console.log)
observer.observe(document.body, { attributeFilter: ['foo'] })
document.body.setAttribute('foo', 'a') // 添加白名单属性
document.body.setAttribute('bar', 'b') // 添加非白名单属性
// [MutationRecord] 只有白名单内 foo 属性的变化被记录下来 
// MutationObserver {}
```

#### 观察字符串数据
characterData 用于观察文本节点（如 Text、Comment 或 ProcessingInstructioin 节点）中字符的添加、修改和删除

```js
let observer = new MutationObserver(console.log)
document.body.innerText = 'a'
observer.observe(document.body.firstChild, { characterDataOldValue: true })
// chrome 浏览器并不会触发回调，相反使用 innerText 后，相当于执行了 observer.disconnect()
document.body.innerText = 'a' 
document.body.innerText = 'b'
document.body.firstChild.textContent = 'c'
// 这个时候我再重新 observer，使用 firstChild.textContent 修改才会触发回调
observer.observe(document.body.firstChild, { characterDataOldValue: true })
document.body.firstChild.textContent = 'd'
document.body.firstChild.textContent = 'e'
document.body.firstChild.textContent = 'e'
// 可以监听到最后三次修改，oldValue 分别为 'c'，'d'，'e'
// [MutationRecord, MutationRecord, MutationRecord] 
// MutationObserver {}
```

#### 观察子节点
childList 为 true 时可以观察目标子节点的添加和移除。对于子节点重新排序会触发两次 MutationRecord，一次移除，一次新增
```js
document.body.innerHTML = ''
let observer = new MutationObserver(console.log)
observer.observe(document.body, { childList: true })
let element = document.createElement('div')
document.body.appendChild(element)
// 检测到新增节点
// [MutationRecord {
//   type: "childList", 
//   target: body, 
//   addedNodes: NodeList [div], 
//   // ...
// }]
document.body.removeChild(element)
// 检测到移除节点
// [MutationRecord {
//   type: "childList", 
//   target: body, 
//   removedNodes: NodeList [div]
//   // ...
// }]
document.body.appendChild(document.createElement('div'))
document.body.appendChild(document.createElement('span'))
// 触发两次新增事件
// 再修改子节点顺序
document.body.insertBefore(document.body.lastChild, document.body.firstChild)
// [MutationRecord, MutationRecord] 
// MutationObserver {}
// 上面触发了两次事件，一次移除末尾 span 节点，一次添加 span 节点
// MutationRecord { previousSibling: div，removedNodes: NodeList [span] }
// MutationRecord { addedNodes: NodeList [span], nextSibling: div }
```

#### 观察子树
subtree 可以把观察范围扩大到观察子树。另外被观察的子树节点，被移除子树后，仍然可能触发变动事件。
```js
document.body.innerHTML = ''
let observer = new MutationObserver(console.log)
document.body.appendChild(document.createElement('div'))
observer.observe(document.body, { attributes: true, subtree: true })
document.body.firstChild.setAttribute('foo', 'a')
// [MutationRecord] MutationObserver {}
// MutationRecord { target: div, attributeName: "foo", type: "attributes"} 
```
### 异步回调与记录队列
MutationObserver 接口是出于性能考虑而设计的，核心是异步回调与记录队列模型。为了在大量变化事件发生时，不影响性能，每次变化的信息会保存在 MutationRecord 实例中，然后添加到 **记录队列**，队列中每个 MutationObserver 实例都是唯一的，是所有 DOM 变化事件的有序列表。

记录队列是 **微任务**。

调用 MutationObserver 实例的 takeRecords() 可以清空记录队列，取出并返回其中的所有 MutationRecords 实例

```js
let observer = new MutationObserver((mutationRecords) => {
  console.log('出发了回调', mutationRecords)
})
observer.observe(document.body, { attributes: true })
document.body.setAttribute('class', 'a')
document.body.setAttribute('class', 'b')
document.body.setAttribute('class', 'c')
console.log(observer.takeRecords())
console.log(observer.takeRecords())
// 并没有触发回调，而是被 observer.takeRecords() 取出并清空
// [MutationRecord, MutationRecord, MutationRecord]
// []
```

### 性能、内存与垃圾回收
DOM Level 2 规范中的 MutationEvent 可以监听 dom 变化事件，它出现了严重的性能问题，在 DOM Level 3 中被废弃，取而代之的是 MutationObserver 接口。

注意：MutationObserver 实例拥有目标节点的弱引用。目标节点拥有 MutationObserver 实例的强引用。如果目标节点从 dom 中移除，MutationObserver 也会被垃圾回收。

MutationRecord 实例会保存他们引用的节点，会妨碍节点被回收，建议使用时从 MutationRecord 中拷贝最有用的信息到一个新的对象再使用。
