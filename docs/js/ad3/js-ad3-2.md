---
title: 2. 在HTML中使用JavaScript - JS高程4
description: 在HTML中使用JavaScript，向HTML中插入 JavaScript 代码的主要方法就是使用 `script`元素，`script`位置与执行顺序是强关联的，使用 async 或者 defer 也会改变其执行顺序，下面来具体看看
keywords: script位置与执行顺序,浏览器禁用JS后怎么降级,async和defer的区别
---

# 2. 在HTML中使用JavaScript

向HTML中插入 JavaScript 代码的主要方法就是使用 `script`元素

## `script`元素属性
`script` 属性里面默认的type 为 "text/javascript", 需要注意的是 async 与 defer 属性

HTML4.1 与 HTML5 里面 async 与 defer 属性的值不一致(之前值为 async, defer，H5 为 true, false)，现在这里以 H5 为主

## `script`使用方式
在HTML里 `script` 元素的使用方法有两种:
- 嵌入脚本
  
```html
<!-- 
  1. 嵌入脚本里面不能使用src属性，如果使用了src引入了外部js文件，内嵌的内容会失效 
  2. 嵌入脚本内部不要出现 </script> 结束标志。这样后面的代码不会继续执行，如果一定要加入请使用 <\/script>
-->
<script> 嵌入脚本内容 </script>
```

- 使用外部脚本

```html
<!-- 引入外部脚本，如果是第三方的js文件，需要确保其安全可靠。-->
<script src="1.js"></script>
```

## `script`位置与执行顺序
- 放到 `head` 元素内部，页面一加载就按顺序加载执行，这种情况当JS被加载执行完成，页面才会开始渲染，如果网速慢，载入文件大等会导致页面空白一段时间
- 或者放到 `body` 元素的最后面，顺序执行，等页面渲染完后再去加载执行。
- 使用async与defer属性会改变script的默认执行顺序
  - 默认情况下，script 会阻塞 HTML 解析，等 JS 下载并执行完，才会继续 HTML 解析。
  - async 为 true 时，script 在下载 JS 时不会阻塞 HTML 解析，只会在 JS 下载完成后执行时短暂阻塞 HTML 解析。
  - defer 为 true 时，script 在下载 JS 时不会阻塞 HTML 解析，并且会等 HTML 解析完成后再执行 JS。
  - 存在多个 defer 的 JS 时，会按顺序执行。而多个 async JS 不一定顺序执行，注意当有依赖时，不能使用 async。
  - 其实我们把 script 写到 body 的最后面，和 defer 的效果基本一致。
  
![图解async与defer属性的区别](/images/js/script元素里async与defer属性的区别.png)

详情请参见 [defer和async的区别](https://segmentfault.com/q/1010000000640869)

## DOMContentLoaded与白屏，DOMContentLoaded与load
> DOMContentLoaded与白屏、DOMContentLoaded与load

白屏时间 = 地址栏输入网址后回车 - 浏览器出现第一个元素

首屏时间 = 地址栏输入网址后回车 - 浏览器第一屏渲染完成

一般页面 **白屏结束** 的时间节点在 head 结束，body 开始执行时。可以通过 `window.performance` 这个对象来看具体时间。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>白屏</title>
  <script>
    // 不兼容 performance.timing 的浏览器
    window.pageStartTime = Date.now()
  </script>
  <!-- 页面 CSS 资源 -->
  <link rel="stylesheet" href="xx.css">
  <link rel="stylesheet" href="zz.css">
  <script>
    // 白屏结束时间
    window.firstPaint = Date.now()
    // 白屏时间
    console.log(firstPaint - performance.timing.navigationStart)
  </script>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

白屏时间 = firstPaint - performance.timing.navigationStart || pageStartTime


因此：**在 head 元素里面如果放了非 async 或 defer 的 JS，会增加白屏时间。**

DOMContentLoaded 是页面元素(dom)完成加载并解析，而不用等 css样式、图片和子 frame 完全加载完成时触发。对应 jQuery 的 ` $(document).ready()`

Load 事件是当整个页面加载完成时（包括所有相关资源，例如css样式表和图片）触发，对应 jQuery 里面的 `$(document).load()`

参考：
- [Web 性能优化-首屏和白屏时间](https://blog.csdn.net/z9061/article/details/101454438)
- [DOMContentLoaded与Load时间具体指的是什么时间？](http://fe.zuo11.com/daily/2020-10.html#domcontentloaded%E4%B8%8Eload%E6%97%B6%E9%97%B4%E5%85%B7%E4%BD%93%E6%8C%87%E7%9A%84%E6%98%AF%E4%BB%80%E4%B9%88%E6%97%B6%E9%97%B4)

## 当浏览器禁用了JS或不支持JS
在 `body` 元素里面，最后加入 `noscript` 元素，当JS被禁用或不支持时，会显示noscript元素内部的内容

```html
<body>
    <noscript>
        <p>本页面需要浏览器支持（启用）JavaScript!</p>
    </noscript>
</body>
```

noscript 除了在浏览器不支持 JS 时，提示信息外，还可以进行系统降级。在百度搜索引擎搜索结果跳转的实现里，如果支持 JS 就使用 window.location.replace 重定向页面，如果不支持 JS，使用 `meta` 标签的 `http-equiv="refresh"` 来进行重定向，具体参考：[防盗链时需要注意搜索引擎 Referer：百度和 Google 搜索内容跳转链接之间的区别](http://fe.zuo11.com/daily/2020-10.html#_2020-10-31)

```html
<noscript>
  <META http-equiv="refresh" content="0;URL='https://www.xx.com/'">
</noscript>
```