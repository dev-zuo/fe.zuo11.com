---
title: JavaScript DOM 编程艺术(第二版)笔记
description: 大概花了 3 个小时把书看了一遍，相对来说比较基础。之前在 《JS高程3》 看过 DOM 相关的章节，所以这本书显得简单很多。这里只记录一些我认为重要的知识点：DOM 相关 API、JS最佳实践、HTML5简介、javascript:伪协议、实战项目等
keywords: DOM 相关 API,JS最佳实践,HTML5简介,javascript:伪协议
---

# JavaScript DOM 编程艺术(第二版)笔记

> 大概花了 3 个小时把书看了一遍，相对来说比较基础。之前在 《JS高程3》 看过 DOM 相关的章节，所以这本书显得简单很多。这里只记录一些我认为重要的知识点。

## 简单提要
- 第一掌、第二章简单介绍了 JS 历史、DOM、以及简单的 JS 语法（这里就不介绍了）
- 第三、四、七、九章 主要介绍 DOM 相关 API 
- 第五、六、八、十主要是 DOM API 相关示例、实践及优化
- 第十一章、附录 介绍 HTML5、JS 库(主要是 jQuery，jQuery 这里就不介绍了)
- 第十二章 综合示例、实战写个小 demo

## DOM 相关 API
> 涵盖 3、4、6、7、9、10 章内容
### 1.获取元素节点及节点之间的关系 
> Chapter 3、Chapter 4
```js
// 三种获取元素节点的方法 (Chapter 3)
document.getElementById()
document.getElementsByClassName()
document.getElementsByTagName()

// 根据节点之间的关系(父节点、子节点、兄弟节点)，获取节点 (Chapter 4)
e.parentNode // 父节点
// 子节点
e.firstChild  // 第一个子节点
e.lastChild // 最后一个子节点
e.childNodes // 子节点数组
// 兄弟节点
e.previousSibling // 上一个节点
e.nextSibling // 下一个节点
```

### 2.获取/设置元素节点属性/特性(Attribute)
> Chapter 3、Chapter 6
```js
// 传统 HTML-DOM 方法，仅浏览器环境可使用 (Chapter 6)
element.title // 获取 title 属性
element.title = '122' // 设置 title 属性
e.src
e.href
document.forms 

// DOM 方法 支持 DOM 标准的都可以使用，包括XML (Chapter 3)  
element.getAttribute() // 比如 title 属性
element.setAttribute() // 设置 title 属性  ('title', '测试')
```

### 3.动态创建元素节点、并添加到文档中
> Chapter 7 
``` js
// 1).传统方法
document.write('<div><p>123</p></div>')
e.innerHTML = '<div><p>123</p></div>'

// 2).DOM 方法
// 创建节点
document.createElement() // 创建一个元素节点 'div'、'ul'、'li'、'text'
document.createTextNode() // 创建一个文本节点 document.createTextNode('hello world')

// 将孤儿节点添加到节点树里面
e.appendChild() // 父元素给自己添加一个子元素，放到子元素最后面
e.insertBefore() // 在目标节点之前添加一个节点
```
### 4.CSS-DOM 
> Chapter 9
```js
// style 属性 获取与设置
element.style.color 
element.style.fontFamily // 如果是 element.font-family 需要改为驼峰命名
element.style.font
element.style.backgroundColor

// 动态根据条件设置，可以根据条件改变 CSS 样式，或者改变 className、id 属性，实现样式动态切换
```
### 5.JS 动画
> Chapter 10，主要改变元素的位置 + setTimeout 控制动画

```js
// 修改元素位置, 前提条件 position: absolute
element.style.left 
element.style.top
```

## JS 最佳实践

> Chapter 5

- 1.平稳退化：在不支持 Javascript 的情况下，也可以正常工作

```html
<!-- 支持 JS 会执行 JS，显示图片。不支持 JS 会执行默认动作，跳转到 href 属性指定的链接里 -->
<a href="/images/7.png" onclick="showPic(this); return false;" title="img">链接a</a>
```
- 2.分离 JavaScript：将网页的结构和内容与 JS 脚本动作行为分开，类似于不要使用内嵌的 style 一样
- 3.向后兼容：老浏览器可能不支持 DOM api，先进行判断、现在基本可以不处理了。但思维可以借鉴
- 4.性能考虑: 
```js
// 1).尽量减少dom的访问很操作; 
// 2).合并多个脚本文件为一个; 
// 3).压缩代码，变为 .min.js
```

## HTML5简介
- Canvas绘图
- 音频和视频 **audio**、**video**
- 表单相关 
```js
// 1. input 的 type 属性除了之前的 text、radio、checkbox，
//    新增 email、url、date、number、range、search、tel、color
// 2. 输入属性(特性 Attribute) 新增 autocomplete； autofocus ； from； 
//    min、max、step（type=number 或 range；pattern 正则；placeholder、required

```
- 其他：localStorage、sessionStorage; webSocket; web Wroker; 标准拖放实现；浏览器中地理位置信息；

## 相关内容补充
书中有一些细节是个人认为有必要单独列出的，在这里作为补充进行说明
### 元素节点、文本节点、属性(特性attribute)节点
元素节点包括 div 元素、span 元素等，nodeType 为 1。文本节点只有文本内容，nodeType 为 3，示例：
```js
// <div id='e-node' title="text content">hello</div>
// 创建上面的元素节点
var eNode = document.createElement('div') 
eNode.title = 'text content'
eNode.id = 'e-node'
eNode.appendChild(document.createTextNode('hello'))

// 元素节点
eNode.nodeType // 1
eNode.nodeName // 'DIV'
eNode.nodeValu // null

// 文本节点
var textNode = eNode.firstChild // hello ，文本节点
textNode.nodeType  // 3
textNode.nodeName // '#text'
textNode.nodeValue // hello

// 属性节点
var attrNode = eNode.getAttribute('title') // 等价于 eNode.attributes[0]
attrNode.nodeType // 2
attrNode.nodeName // title
attrNode.nodeValue // text content
```
### "javascript:" 伪协议、与默认处理
"真"协议："http://" 、 "ftp://", 伪协议是一种非标准化协议 "javascript:"，可以在 a 标签 href 里执行 JS 函数
```html
<a href="javascript:popUp('http://zuoguoqing.com')">测试连接<a/>

<!-- 
  上面的页面如果不支持js功能就无法执行，不能平稳退化, 改写为如下代码，
  onclick 属性加 return false 是为了阻止 a 标签默认的行为，即跳转到 href 连接。
  如果不加或者 return true，a 标签会在 JS 执行后继续跳转到 href 连接
-->
<a href="http://zuoguoqing.com" onclick="popUp('http://zuoguoqing.com'); return false;">

```
### 结构化程序设计
（page79）尽量将通用的方法抽象出来，避免重复复调用，一个函数应该只有一个入口和出口。如果一个函数有多个出口，如 return false，只要这些出口，集中在开头是可以接受的
```js
// 绑定多个子元素 a 的点击事件，点击事件为设置某个内容
function bindFunc() {
  if (!document.getElementsByTagName) return false;
  if (!document.getElementById) return false;
  if (!document.getElementById('aList')) return false;
  
  var aList = document.getElementById('aList')
  var list = aList.getElementsByTagName('a')
  
  for (var i = 0; i < list.length; i++) {
    list[i].onclick = function() {
      // 执行了 showPic, 并执行了 return true；或者是 return false（不执行 a 标签的默认操作）
      return showPic() ? false : true
    }
  }
}

function showPic() {
   if (!document.getElementsByTagName) return false;
   // 改变内容
   // ...
   // 成功后 return true
   return true
}
```
### onload事件
(page83) 由于 DOM 的获取需要 DOM 先渲染完成，如果把 JS 文件导入放到 head 里，没有加上 async、defer 或者没有将 JS 放在 body 末尾子节点，会先执行 JS，阻塞 DOM 渲染，如果 JS 里面有获取 dom 的操作会获取不到 DOM 元素，onload 事件即在页面 load 后执行，可以确保 dom 已渲染完成
```js
window.onload = execFunc
function execFunc() {
  // do something
}

// 第二种写法
window.onload = function() {
  // 匿名函数
}
```

### blockquote 与 abbr 标签
page(126)
```html
<blockquote cite="http://zuoguoqing.com">
  <p>这是一段引用文本</p>
</blockquote>

<p>
  下面是一个缩略语
  <attr title="HyperText Markup Language">HTML</attr>
</p>

```


## 实战项目
根据该书学到的知识，灵活运用。实战写一个小项目，单独开了一个仓库放对应的源码
- 仓库地址：https://github.com/zuoxiaobai/jsdom_project
- 在线预览：https://zuoxiaobai.github.io/jsdom_project/


## 最后
该书比较基础，如果想更系统、深入的学习，可以参考<<JS高程3>>
