# 14. DOM

DOM（文档对象模型），是针对HTML和XML文档的一个API，DOM描绘了一个层次化的结点树，允许开发人员添加、移除和修改页面的某一部分。1998年10月，DOM1级规范成为W3C的推荐标准，为基本的文档结构及查询提供了接口

## 节点层次
DOM可以将HTML或XML文档描绘成一个由多层结点构成的结构，节点分为不同的类型，每种类型分别表示文档中不同的信息或标记，每个节点都拥有各自的特点、数据和方法，与其他节点存在某种关系。节点之间的关系，构成了层次，形成树形结构。

![document结构](/images/js/document结构.png)

document节点是每个文档的根节点，上图中document节点只有一个子节点，即 `<html>` 元素，称之为文档元素，它是文档的最外层元素。文档中的其他所有元素都包含在其中。每个文档只能有一个文档元素，在HTML页面中文档元素始终是 `<html>` 元素，XML中，没有预定义的元素，任何元素都可能存在文档元素

## 节点类型（Node类型）
每一段标记都可以通过树中的一个节点来表示：
- html元素通过**元素节点**表示
- 特性(attribute)通过**特性节点**表示
- 文档类型通过**文档类型节点**表示
- 注释通过**注释节点**表示

DOM1级定义了一个Node接口，该接口由DOM中的所有结点类型实现，javascript中的所有结点类型都继承自Node类型，因此所有的结点类型都共享相同的属性和方法, **每个节点都有一个nodeType属性，用于表明节点的类型**，节点类型总共有12种，分别对应一个常量
-  1 Node.ELEMENT_NODE   元素节点，最常见的一种
-  2 Node.ATTRIBUTE_NODE  特性节点，element.attributes[0]
-  3 Node.TEXT_NODE    文本节点，文字基本都是文本节点
-  4 Node.CDATA_SECTION_NODE (只针对XML文档)
-  5 Node.ENTITY_REFERENCE_NODE 
-  6 Node.ENTITY_NODE
-  7 Node.PROCESSING_INSTRUCTION_NODE
-  8 Node.COMMENT_NODE   注释节点，注释
-  9 Node.DOCUMENT_NODE   document，文档节点。一个html只有一个, .title, .URL, .referrer
- 10 Node.DOCUMENT_TYPE_NODE doctype节点，HTML5最顶部
- 11 Node.DOCUMENT_FRAGMENT_NODE 文档片段节点，属于中间节点，过度用
- 12 Node.NOTATION_NODE 
### nodeName与nodeValue属性
```js
if (someNode.nodeType === 1) {
    value = someNode.nodeName;  //对于元素节点，nodeName始终为元素的标签名，nodeValue始终为null
}

document.title = 'test' // 可以修改标题
document.nodeName // "#document"
document.nodeType // 9    Node.DOCUMENT_NODE

document.head.nodeName   // "HEAD"
document.head.nodeType  // 1 ELEMENT_NODE
document.node.nodeValue // null

// 判断节点类型
if (someNode.nodeType === Node.ELEMENT_NODE) { // 在IE中无效
    alert("Node is an element.");
}

// IE没有公开Node类型的构造函数，所以上面的方法在IE中不支持
if (someNode.nodeType === 1) { // 适用于所有浏览器
    alert("Node is an element.");
}
```
Web浏览器并不支持所有结点类型，最常用的是元素和文本节点

### 节点关系
节点的查询、获取，基本都是属性值，不是方法，不用加()
```js
// 1.子节点 childNodes
var firstChild =someNode.childNodes[0];
var secondChild = someNode.childNodes.item(1);
var count = someNode.childNodes.length;

// 2.父节点 parentNode

// 兄弟节点 sibling、前一个兄弟节点previousSibling、后一个兄弟节点 nextSibling
// 第一个子节点的previousSibling和最后一个节点的nextSibling都为null
someNode.childNodes[0] === someNode.firstChild
someNode.childNodes[someNode.childNodes.length - 1] === someNode.lastChild

// 3.如果没有子节点，lastChild和firstChild均为null

// 4.查询某个节点是否有子节点
someNode.hasChildNodes()  // true or false

// 5.每个节点都有一个属性 ownerDocument，指向整个文档的文档节点
```
![nodeRelation](/images/js/nodeRelation.png)

### 操作节点
- 节点的新增（appendChild(新节点/旧节点),insertBefore(newNode, oldNode)）
- 节点的修改 (replaceChild())
- 节点的删除 (removeChild())
上面关系指针都是只读的，DOM还提供了一些操作节点的方法
```js
// 在末尾新增一个子节点  appendChild() 用于向childNodes列表的末尾添加一个节点
var returnedNode = someNode.appendChild(newNode);
alert(returnedNode === newNode); // true
alert(someNode.lastChild === newNode); // true

// 如果appendChild()操作的节点已经是文档的一部分了，会将原来的节点转移到新的位置
var returnedNode = someNode.appendChild(someNode.firstChild);
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

// 所有节点都有的方法 cloneNode()、normalize()
// 1.cloneNode() 复制一个相同的副本，这个副本属于文档所有，但类似于孤儿，没有指定父节点
// 参数为true时执行深复制，复制节点及整个节点树，false时只复制节点本身
// 如果一个ul有三个子li节点，ul对应myList对象
//<ul> 
//  <li>item 1</li>
//  <li>item 2</li>
//  <li>item 3</li>
//</ul>
var deepList = myList.cloneNode(true);
deepList.chilidNodes.length // 3，如果是cloneNode(false)则为0，不包含子节点
var shallowList = myList.cloneNode(false) // 浅复制，只是复制节点本身，不会复制子节点
shallowList.childNodes.length // 0

```

### Document类型(9)
>（Node.DOCUMENT_NODE 9）

JS通过Document类型表示文档，在浏览器中 document对象是 HTMLDocument(继承自Document类型)的一个实例，表示整个html页面，document对象是window的一个属性，可以全局使用。Document节点具有以下特征
- nodeType 的值为 9 Node.DOCUMENT_NODE
- nodeName 为 "#document", nodeValue === null , parentNode === null ownerDocument === null
- 在浏览器中，其子节点一般是一个DocumentType(最多一个\<\!DOCTYPE html\>)，Element类型(最多一个\<html\>)
#### 文档子节点
```js
// 如下页面
// <!DOCTYPE html>
// <html>
//     <body>
//     </body>
// </html>
var html = document.documentElement; // <html>标签元素
alert(html === document.childNodes[1]); //true
alert(html === document.firstChild); // false  0 为<!docytype html>

var body = document.body;
var doctype = document.doctype; // 如果有就是<!docytype html>，如果头部没写，就是null
```
#### 文档信息
```js
console.log(document.title); // 获取标题
document.title = "JS高程"; // 设置标题

// 获取完整URL
var url = document.URL;
// 取得域名
var domain = document.domain;
// 来源的URL，如果是直接进入，则为"", 
// 如果从https://github.com/zuoxiaobai?tab=repositories进入到当前页面
var referrer = document.referrer; // 如果是上面的场景，则值未"https://github.com/zuoxiaobai?tab=repositories"
```
#### 查找元素
- document.getElementById('kk') // 获取id为kk的元素，类型为 HTMLElement
- document.getElementsByTagName('div')  // 获取页面所有的div元素 HTMLCollection
- document.getElementsByName('kk')  // 获取name='kk' 的所有元素
- document.getElementsByClassName('kk') // 获取class='kk'的所有元素
```js
// <div id="myDiv">Some text</div>
var div = document.getElementById("myDiv");  // 如果没有该id的元素，值为null
div instanceof  HTMLElement // true

var div2 = document.getElementsByTagName('div');
div2 instanceof HTMLCollection // true HTMLElement数组
div2[0] instanceof HTMLElement // true

//  <img src="1.png" height="500" width="300">
// <img src="2.png" name="myImg" height="500" width="300">
var images = document.getElementsByTagName('img');
alert(/images/js.length); // 2
alert(/images/js[0].src);
alert(/images/js.item(0).src); // src内容


imgs.namedItem('myImg') === imgs["myImg"] // 2.png那张图片

// <text id='t' name="color">textkkkk</text>
document.getElementsByName('color') // 获取name属性为color的元素
```
#### 特殊集合
```js
// document.anchors 获取文档中所有带name特性的a元素，必须要有name属性

// document.forms   相当于  document.getElementsByTagName('form')

// document.images 相当于 document.getElementsByTageName('img')

// document.links 获取所有a元素，相当于 documet.getElmentsByTagName('a')
```

#### DOM一致性
检测浏览器是否支持某些DOM功能及版本等信息 p259

#### 文档写入
document.write() document.writeln() 向文档中输入内容
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

DocumentType 包含着与文档的doctype有关的所有信息 document.firstChild => <!DOCTYPE html>
- nodeType的值为10  Node.DOCUMENT_TYPE_NODE
- nodeName 的值为doctype类型 'html'
- nodeValue 的值为 null 
- 父节点 document， 不支持子节点
```js
var e = document.firstChild  // <!DOCTYPE html>
e.nodeType // 10
e.nodeName // html
e.nodeValue  // null
```

### Element类型(1)
> （1 Node.ELEMENT_NODE）

除Document类型外，Element类型算是Web编程中最常用的类型了，它用于表现XML或HTML元素，提供了对元素标签名、子节点及特性的访问
- nodeType 的值为 1
- nodeName 的值为元素的标签名, nodeValue === null , parentNode 可能是Document或Element
- 访问元素的标签名可以使用nodeName属性，也可以使用tagName属性，两个属性会返回相同的值
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
        var div = document.getElementById("myDiv");

        // 在HTML中，标签名始终都以全部大写表示
        alert(div.tagName); // DIV
        alert(div.tagName === div.nodeName); // true
    </script>
</body>
</html>
```

#### HTML元素属性
所有的HTML元素都由HTMLElement类型或其子类型表示，HTMLElement类型继承自Element，并添加了一些属性
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
        var div = document.getElementById("myDiv");

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
HTML元素以及与之关联的类型
![HTML_type_1](/images/js/HTML_type_1.png)
![HTML_type_2](/images/js/HTML_type_2.png)

#### 操作特性（属性）
 getAttribute()  setAttribute()  removeAttribute()
```js
var div = document.getElementById("myDiv");
div.id // myDiv
div.getAttribute('id') // myDiv

// 设置特性值
div.setAttribute('id', 'test') // 等价于 div.id = 'test'

div.removeAttribute('class') // 删除class特性
```
#### attributes属性
可以用来增删查改特性，主要用来遍历某个元素的特性。
```js
// 获取某个节点的属性列表, 类型为 NamedNodeMap
// <div id="myDiv" class="bg" title="body text" lang="en" dir="rtl">abcdefg</div>
let myDiv = document.getElementById('myDiv')
let s = myDiv.attributes 
// NamedNodeMap {0: id, 1: class, 2: lang, 3: dir, id: id, class: class, lang: lang, dir: dir, length: 4}

s.getNamedItem('id').nodeName // id  
s.getNamedItem('id').nodeValue // myDiv

s['title'].nodeValue = 'xxx'  // 设置title特性值为xxx
s[0].nodeValue // id 

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
### Attr类型(2)
> (2 Node.ATTRIBUTE_NODE)

特性节点类型，element.attributes就是特性节点数组，子元素就是特性节点
- nodeType的值为2
- nodeNmae 的值为特性的名称，比如 id
- nodeValue 的值为特性的值，比如 xx
- parentNode 的值为 null
- 不支持子节点

```js
var attr = document.createAttribute('align');
attr.value = 'left';

attr.nodeType // 2
attr.nodeName // align
attr.nodeValue // left

var element = document.createElement('div');
element.setAttribute(attr);
element.attributes['align'].value // left
element.getAttributeNode('align').value // left
element.getAttribute('align') // left
```

### Text 类型(4)
> （4 Node.TEXT_NODE）

文本节点有Text类型表示，不能包含HTML代码，不支持子节点
- nodeType的值为3  Node.TEXT_NODE
- nodeName 的值为 '#text'
- nodeValue 的值为节点所包含的文本

文本类型节点的创建和操作
- document.createTextNode() 创建文本节点
- element.normalize() 规范化文本节点，合并多个子文本节点
- element.splitText() 按照指定位置分割文本节点
```js
//  <div id='someOther' class='ft' title='Some other text'>abcdefg</div>
var oth = document.getElementById('someOther')
var textNode = oth.childNodes[0] // Text()  
textNode.nodeType // 3
textNode.nodeName // "#text"
textNode.nodeValue // "abcdeft"
textNode.nodeValue = 'ddd'   // 修改text的值

// 代码创建一个文本节点，挂载到元素节点div上，再放到body里面
var e = document.createElement('div')
e.className = 'message'

var tNode = document.createTextNode('hello world')
e.appendChild(tNode)

// 一个div可以多增加几个textNode，中间不会有空格，会连着显示。
var tNode2 = document.createTextNode('---hello world---')
e.appendChild(tNode2)

document.body.appendChild(e)

e.childNodes.length // 2
e.normalize() // 规范化文本节点
e.childNodes.length // 1

// 再分割文本节点 
var newNode = e.firstChild.splitText(5)
e.firstChild.nodeValue // 'hello'
newNode.nodeValue // " world---hello world---"
e.childNodes.length // 2
```

### Comment 类型(8)
>（8 Node.COMMENT_NODE）

注释类型，创建注释类型：document.createComment('注释内容')
- nodeType的值为8  Node.COMMENT_NODE
- nodeName 的值为 '#comment'
- nodeValue 的值为 注释类型    等价于 .data 

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
### DocumentFragment(11)
>（11 Node.DOCUMENT_FRAGMENT_NODE）

文档片段类型，不会真正的再文档里形成节点，类似与一个中转节点。
- nodeType的值为11
- nodeNmae 的值为 "#document-fragment"
- nodeValue 的值为 null
- parentNode 的值为 null
```js
var fragment = document.createDocumentFragment();

var ul = document.createElement('ul');
for (let i = 0; i < 3; i++) {
  let li = document.createElement('li');
  li.appendChild(document.createTextNode(`text ${i}`));
  fragment.appendChild(li)
}
ul.appendChild(fragment);
document.body.appendChild(ul);

ul.childNodes // 只有3个 li 子节点

```

## DOM操作技术
DOM操作往往是JS程序中开销最大的部分，NodeList对象是动态的，每次访问NodeList对象，都会运行一次查询，尽量少DOM操作
### 动态添加脚本script
```js
// <script type='text/javascript' src='text.js'></script>
// test.js 里面 alert('test dynamic script')
// 添加一个script脚本元素节点
var scriptNode = document.createElement('script');
scriptNode.src = 'test.js';
scriptNode.type = 'text/javascript';
document.body.appendChild(scriptNode);

// 上面是载入一个js文件，加载行内方式js代码
var sNode = document.createElement('script');
sNode.type = 'text/javascript';
// sNode.appendChild(document.createTextNode('function sayHi() { alert("Hi"); }'));
sNode.text = 'function sayHi() {alert("Hi");} sayHi()';  // 兼容IE写法

document.body.appendChild(sNode);

// 封装成函数
function loadScriptString(scriptStr) {
  var script = document.createElement('script');
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

### 动态添加样式style
```js
//  <link rel="stylesheet" type="text/css" href="test.css">
var linkNode = document.createElement('link');
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
  var styleNode = document.createElement('style');
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
动态创建一个表格，html代码如下，先利用DOM API来动态创建。再利用HTML-DOM提供的table、tbody、tr方法来重构
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
var tableEle = document.getElementsByTagName('table')[0];

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
var tbodyNode = tableEle.tBodies[0];
tbodyNode.rows // <tbody> 里的元素数组 HTMLColletion, length = 2
tbodyNode.deleteRow(pos) // 删除指定位置tr节点
tbodyNode.insertRow(pos) // 在指定位置插入节点

// tr 元素属性及方法
var trNode = tbodyNode.firstElementChild; // 第一个元素节点
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
节点是动态的，下面的例子中，如果获取了某个节点元素，每次访问其length时，元素都有动态更新，length也会动态增加是个死循环，为了提高性能，尽量少操作dom
```js
// <div>123</div>
var divs = document.getElementsByTagName('div'), i, div;

for (let i = 0; i < divs.length; i++) {
  div = document.createElement('div');
  document.body.appendChild(div);
}

// 改写上面的死循环，这样就只执行有限的个数了。
var divs = document.getElementsByTagName('div'), i, div;
var length = 0;
for (i = 0, length= divs.length; i < length; i++) {
  div = document.createElement('div');
  document.body.appendChild(div);
}
```