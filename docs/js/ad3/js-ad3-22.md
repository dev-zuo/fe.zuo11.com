---
title: 22. 处理 XML - JS高程4
description: XML 曾经是网络存储和传输结构化数据的首选，后面逐渐被 JSON 数据格式替代，目前在 Web 前端中已经很少见了。在本书第 4 版中直接去除了第 3 版中 E4X(ECMAScript for XML，在JS中添加原生的 XML 支持) 的内容。并将本章节的内容从 25 页减少到 9 页。本章内容大致了解即可，主要介绍了浏览器对 XML DOM、Xpath、XSLT 的支持情况。
keywords: 前端处理XML,浏览器对 XML DOM 的支持,浏览器对 XPath 的支持,浏览器对 XSLT 的支持
---

# 22. 处理 XML

XML 曾经是网络存储和传输结构化数据的首选，后面逐渐被 JSON 数据格式替代，目前在 Web 前端中已经很少见了。在本书第 4 版中直接去除了第 3 版中 E4X(ECMAScript for XML，在JS中添加原生的 XML 支持) 的内容。并将本章节的内容从 25 页减少到 9 页。本章内容大致了解即可，主要介绍了浏览器对 XML DOM、XPath、XSLT 的支持情况。

## 浏览器对 XML DOM 的支持

### DOM Level 2 Core
DOM Level 2 增加了 document.implementation.createDocument() 方法，可以用于创建 XML 文档，它有三个参数
- namespaceUri 在 JS 中很少用，JS 中很难管理命名空间
- root 用于指定 XML DOM 中 document 元素的标签名
- docytype 文档类型，较少使用
```js
// xmldom 等价于 document
let xmldom = document.implementation.createDocument("", 'root', null)
console.log(xmldom.documentElement) // <root></root>
console.log(xmldom.documentElement.tagName) // root
let child = xmldom.createElement('child')
xmldom.documentElement.appendChild(child)
//  <root>
//    <child></child>
//  </root>
```
检查浏览器是否支持 DOM Level2 XML，可以使用 hasFeature 函数
```js
let hasXmlDom = document.implementation.hasFeature('xml', '2.0')
// true
```
实践中很少凭空创建 XML 文档，更多的是把已有的 XML 解析为 DOM 结构，或者把 DOM 结构解析为 XML。DOM Level2 并没有提供这种功能，所以出现了一些事实标准

### DOMParser 类型(xml 字符串转 DOM)
将 XML 字符串解析为 DOM 文档，可以使用 DOMParser，它最早是有 Firefox 新增的，后来其他浏览器也实现了该类型。
```js
let parser = new DOMParser()
let xmldom = parser.parseFromString('<root><child /></root>', 'text/xml')

console.log(xmldom.documentElement.tagName) // "root"
console.log(xmldom.documentElement.firstChild.tagName) // "child"
```
处理解析错误，一般浏览器出现解析错误时会在返回的 xmldom 中新增一个 parseerror 元素用于显示错误。IE 是一个特例，他会 throw 一个异常，下面是比较通用的一个处理
```js
let parser = new DOMParser()
try {
  let xmldom = parser.parseFromString('<root>', 'text/xml')
  console.log(xmldom)
  // Chrome、Safari、Friefox
  let errors = xmldom.getElementsByName('parsererror')
  if (errors.length) {
    throw new Error('解析错误')
  }
} catch(e) {
  // IE
  console.log('解析错误')
}

// <root>
//   <parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black">
//     <h3>This page contains the following errors:</h3>
//     <div style="font-family:monospace;font-size:12px">
//       error on line 1 at column 7: Extra content at the end of the document
//     </div>
//     <h3>Below is a rendering of the page up to the first error.</h3>
//   </parsererror>
// </root>
```
### XMLSerializer 类型(DOM 转 xml字符串)
XMLSerializer 类型与 DOMParser 类型的历史基本一致。他是 DOMParser 的逆向操作
```js
let parser = new DOMParser()
let xmldom = parser.parseFromString('<root><child /></root>', 'text/xml')

let serializer = new XMLSerializer()
let xml = serializer.serializeToString(xmldom)
console.log(xml) // <root><child/></root>
```

## 浏览器对 XPath 的支持
XPath 是为了在 DOM 文档中定位特定节点而创建的，对 XML 处理很重要。DOM Level 3 开始标准化 XPath，很多浏览器实现了 DOM Level 3 XPath 标准，但 IE 是按照自己的方式实现。

```js
let supportXPath = document.implementation.hasFeature('XPath', '3.0')
// true
```

更多细节参考：p696


## 浏览器对 XSLT 的支持
可扩展样式表语言转换（XSLT，Extensible Stylesheet Language Transformations）是与 XML 相伴的技术，可以利用 XPath 将一种文档表示转换为另一种文档表示。

### XSLTProcessor 类型
Mozilla 通过增加 XSLTProcessor 类型，在 JS 中实现了对 XSLT 的支持，后来其他浏览器都实现了该类型，成为事实标准

```js
let processor = new XSLTProcessor()
processor.importStylesheet(xsltdom)

let result = processor.transformToDocument(xmldom)
console.log(serializeXml(result))

let fragment = processor.tranformToFragment(xmldom, document)
let div = document.getElementById('divResult')
div.appendChild(fragment)
```

更多详情参见 p701