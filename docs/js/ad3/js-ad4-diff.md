---
title: 第四版相比第三版有哪些更新 - JS高程4
description: 首先，第四版换了作者。第三版作者是尼古拉斯（Nicholas C.Zakas），可能是由于受莱姆病影响，无法投入第四版的写作。第四版作者是 马特(Matt Frisbie)，翻译没有大的变化，第四版还是由 李松峰 翻译。在译者序里，有介绍 第四版延续了上一版的框架和格局，删减了已经过时的内容，并在此基础上，加入了 ES2015(ES6) 到 ES2019 的内容。由于第四版是2019年10月面世，因此 ES2020 的内容并未涉及。下面从前言开始，捋一捋第四版相比第三版做的一些改动。
keywords: JS高程4做了哪些更新,JS高程4与JS高程3对比,JS高程4笔记
---

# 第四版相比第三版有哪些更新？

首先，第四版换了作者。第三版作者是 **尼古拉斯**（Nicholas C.Zakas），可能是由于受莱姆病影响，无法投入第四版的写作。第四版作者是 **马特**(Matt Frisbie)，翻译没有大的变化，第四版还是由 **李松峰** 翻译。

在译者序里，有介绍 **第四版延续了上一版的框架和格局，删减了已经过时的内容，并在此基础上，加入了 ES2015(ES6) 到 ES2019 的内容**。由于第四版是2019年10月面世，因此 ES2020 的内容并未涉及。下面从前言开始，捋一捋第四版相比第三版做的一些改动。

## 前言部分

增加了随书二维码，扫码可以购买对应的电子版，加小助手微信进对应的前端群。最大的亮点是 **翻译的李松峰老师对多个章节都录制了对应的讲解视频，视频是免费的**。通过扫码后提供的链接，可以在线观看。

## 第 1 章 什么是 JavaScript
章节名变更，把 `JavaScript 简介`，改为 `什么是 JavaScript`。

1.2.1 ECMAScript 版本之前仅介绍到了 ES5。第四版，新增了 ES6(ES2015) 到 ES2019 的大致介绍，我在更新JS高程笔记时，将对应的版本信息更新到了 2021，详情参见：[ECMAScript - 什么是JavaScript | JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-1.html#ecmascript)

## 第 3 章 语言基础
章节名变更，把 `基本概念` 改为了 `语言基础`。

3.3 变量之间仅介绍了 var，新增 let、const介绍。和阮一峰 《ES6入门》的 let 与 const 内容基本一致。只是多给了一个最佳实践：建议不要使用 var，const优先，let次之。另外全书的例子中基本也是遵循这个原则，基本替换了原来的var。更多详情参见 [let与const | ES6入门笔记](http://fe.zuo11.com/js/es6/es6-2.html#let%E4%B8%8Evar%E7%9A%84%E5%8C%BA%E5%88%AB)

3.4.6 String 类型，新增 模板字面量、字符串插值、模板字面量标签函数，原始字符串 String.raw标签函数。参考 [模板字符串 | ES6入门笔记](http://fe.zuo11.com/js/es6/es6-4.html#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)

3.4.7 新增 Symbol（符号） 类型，相比ES6入门教程，新增了异步迭代 for...await...of 内置属性 Symbol.asyncIterator 的描述。参考 [Symbol类型 - 语言基础 | JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-3.html#symbol%E7%B1%BB%E5%9E%8B)

3.6 语句这一部分，新增 for...of 语句、标签语句，这次整理是顺便对比了下 for...in 与 for...of 的区别。参考 [语句（流控制语句）- 语言基础 | JS高程3笔记](http://fe.zuo11.com/js/ad3/js-ad3-3.html#%E8%AF%AD%E5%8F%A5-%E6%B5%81%E6%8E%A7%E5%88%B6%E8%AF%AD%E5%8F%A5)

## 第 4 章 变量、作用域与内存
章节名称变更，把 `变量、作用域和内存问题` 改为 `变量、作用域与内存`。

4.2 将 execution context 的翻译从 `执行环境` 变更为 `执行上下文`，这里看个人理解，觉得哪个好理解就用哪个。新增 let、const 块级作用域内容。

4.3.4 内存管理除了引用计数外新增通过 const 和 let 声明提升性能、隐藏类和删除操作、内存泄漏、静态分片与对象池等。参考：[内存管理 - 垃圾收集 | JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-4.html#%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86)


## 第 5 章 基本引用类型 
原第五章引用类型拆分为两个章节：基本引用类型、集合引用类型。
1. 将原来的 Object 类型、Array 类型 放到了新增的第 6 章 集合引用类型。
2. 将 Function 类型，放到了第 10 章 函数，也就是之前的函数表达式、闭包那一章。

5.2.3 RegExp 构造函数属性最后加了说明 **RegExp 构造函数的所有属性都没有任何 Web标准出处，因此不要用于生产环境。**

5.3.2 原始值包装类型 - Number 新增 isInteger()、isSafeInteger() 介绍

5.3.3 原始值包装类型 - String - 字符方法，之前仅介绍 charAt()、charCodeAt() 用法，第四版对 JS 字符做了更加详细的介绍。新增 ES6 字符串方法 includes、repeat等，新增字符串迭代与结构。

详情参考：[5. 基本引用类型 - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-5.html)

## 第 6 章 集合引用类型
除了将第五章的 Object 类型、Array 类型放到了这一章外，将原来 15.3.1 使用Canvas绘图 - WebGL - 类型化数组移到了这一章，并改翻译为定型数组(typed array)，也就是 ArrayBuffer、DataView等。

Array 新增 ES6 新增方法：迭代器方法(keys()、values()、entries())、复制和填充方法(fill(), copyWithin)、断言函数(find()、findIndex())、...扩展等。

另外新增 Map、WeakMap、Set、WeakSet。详情参考：[6. 集合引用类型 - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-6.html)

## 第 7 章 迭代器与生成器(Iterator 与 Generator)
新增的章节，与《ES6 入门》中对应的核心内容基本一致。主要差异在于描述方法与知识点介绍的先后顺序。个人感觉这本书有些地方从概念上看好理解一点，最好两本书结合一起看。针对本书的重点内容作了一个整理，参考：[7. 迭代器与生成器(Iterator 与 Generator) - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-7.html)

## 第 8 章 对象、类与面向对象编程
原第 6 章 面向对象的程序设计，
- 8.1 理解对象 新增 ES6 对象的扩展介绍，比如对象解构、Object.assin()、变量属性，属性简写，函数简写等。
- 8.2 创建对象，对原型的理解做了更多细节方面的介绍。删除 `组合使用构造函数和原型模式`、`动态原型模式`、`寄生构造函数模式`、`稳妥的构造函数模式` 内容
- 8.4 新增 `类` class。

详情参考：[8. 对象、类与面向对象编程 - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-8.html)

## 第 9 章 代理与反射(Proxy 与 Reflect)
新增的章节，和 《ES6入门》中对应的内容来讲，这一章内容的编排要好一点，系统性更强。详情参考：[9. 代理与反射(Proxy 与 Reflect) - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-9.html)

## 第 10 章 函数
原第7章 函数表达式、闭包，将原第 5 章 引用类型 - Function 类型放到了这一章。更加系统化，增加了**箭头函数**、**扩展参数**、**new.target** **尾调用优化** 等。参考：[10. 函数 - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-10.html)

## 第 11 章 期约与异步函数(Promise与async/await)
新增的章节，和 ES6 入门内容有部分重复，详情参考：[11. 期约与异步函数(Promise与async/await) - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-11.html)

## --- 前 11 章分隔线
::: tip
第三版 1-7 章为基础，第四版基础新增了 4 个章节。1-11 章为基础。其中 1-6 章为基本知识，7-11 章为进阶内容，侧重于讲解 ECMAScript 本身的语言基础、特性。
:::

## 第 12 章 BOM
原第 8 章 BOM，将 frame 窗口关系内容精简到最小、新增设备像素比、视口(滚动)位置、新增 history 历史状态管理，pushState、replaceSate 等，详情参考：[12. BOM - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-12.html)

## 第 13 章 客户端检测
原第 9 章客户端检测，更新并新增了一些内容

- 13.2.2 不再自己写代码实现 UA 解析，推荐使用 github 上第三方现有的 UA 解析程序。另外特别说明用户代理是可以伪造的。
- 13.3 新增，软硬件检测，主要介绍了怎么使用 navigator 获取浏览器、操作系统、硬件的一些信息。将原来第 23 章的离线检测放到了这一章，将原来第 25 章 新兴的 API 里面的 Geolocation 地址位置信息 api 也放到了这一章。另外，新增电池信息、处理器核心、内存大小、屏幕触控点数等。

详情参考：[13.客户端检测 - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-13.html)

## 第 14 章 DOM
原第 10 章 DOM，除了修改了部分翻译外，新增 14.3 MutationObserver 用于替代 MutationEvent，参考：[14. DOM - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-14.html)

## 第 15 章 DOM 扩展
原第 11 章 DOM 扩展 
- 15.1.3 matches 去掉规范草案中的 matchesSelector() 内容，改为最新规范
- 15.3.6 插入标记，新增 insertAdjacentText()、innerHTML 跨站点脚本 XSS 攻击说明
- 15.3.7 scrollIntoView 增加平滑滚动等参数说明。
- 15.4.3 插入标记(文本)，innerText 不需要在做兼容性处理，去掉兼容性降级代码。

详情参考：[15. DOM 扩展 - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-15.html)

## 第 16 章 DOM2 和 DOM3 
原第 12 章 DOM2 和 DOM3，除了修改了一些翻译，去掉一些老旧的知识点外，基本无变化

## 第 17 章 事件
原第 13 章事件，新增 17.4.10 事件参考，列出了当前已发布规范中定义的所有浏览器事件。

## 第 18 章 动画与 Canvas 图形
原第 15 章，章节顺序由原来的表单脚本后面一章，改为表单脚本前一章。另外原第 25 章新兴的 API requestAnimationFrame 放到了这一章。将WebGL 章节的 类型化数组移到了 第 6 章 结合引用类型。

## 第 19 章 表单脚本
原第 14 章 表单脚本，除了和 Canvas 章节调换顺序，基本没有大的变动。

## --- 中间 8 章分隔线
::: tip
第 12 - 19 章是 BOM 和 DOM 的章节，对应原第 8 - 15 章。相对改动较小，这 8 个章节不再介绍 ECMAScript 语言本身。而是介绍属于浏览器、DOM相关的 JS 基础内容，可以查阅 W3C 标准学习。
:::

## 第 20 章 JavaScript API
原第 16 章，章节名变更，把 `HTML5 脚本编程`，改为 `JavaScript API`。将 history 历史状态管理移到第 12 章 BOM。将原第 25 章新兴的 API 里面的 Page Visibility API、Web计时（Timing API）和 File API 都移到了这一章。另外新增了一些新的内容：

20.1 新增 Atomics 与 SharedArrayBuffer 原子操作相关

20.3 新增 Encoding API，与 5.4.1 的 URL 编码方法不一样，这里的编码、解码主要是对文本、流的编码和解码，用于字符串与定型数组(typed array)之间的转换

20.7 新增 Notifivations API，通知 API

20.9 新增 Streams API，流处理相关 API

20.11 新增 Web 组件，即 Web components

20.12 新增 Web Cryptography API, 用于生成随机数、加密和签名消息

## 第 21 章 错误处理与调试
原第 17 章，修改了部分翻译及老旧了内容，变动较小。

## 第 22 章 处理 XML
原第 18 章 JavaScript 与 XML，对原来的内容作了精简，知识大致介绍了下。相对来说，这一样不怎么重要。我之前第三版是旧没做 XML 两个章节的笔记

::: warning
第四版删除了原第 19 章 E4X 的内容，也就是 ECMAScript for XML。XML在前端基本很少使用。
:::

## 第 23 章 JSON
原第 20 章，除了修改了部分翻译细节基本无变化。

## 第 24 章 网络请求与远程资源
原第 21 章， Ajax 与 Comet，去除了原来的的 Comet（服务器推送） 以及与其相关的 SSE(Server-Sent Events，服务器发送事件)。

24.5 新增 Fetch API，相对 XHR 来说，做了一些改进，返回 Promise结构，接口更直观，对 Stream API 支持更好。

24.6 新增 Beacon API，主要用于离开页面 unload 后，埋点请求发送不出去的问题。由浏览器 navigator 对象来处理，浏览器就算已经关闭的情况也会发送请求。

24.7 Web Socket，将 socket相关内容从跨域部分，移到单独的部分。

::: warning
第四版删除了原第 22 章高级技巧，主要是一些比较碎片化、零散的知识点
:::

## 第 25 章 客户端存储
原第 23 章离线应用与客户端存储，原离线检测放到了第 13 章客户端检测。由于 HTML5 application cache 已废弃，由 Service Workers取代，去除了应用缓存的内容。参见: [Using_the_application_cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) 其他变动不大。

## 第 26 章 模块
新增的章节，讲了 CommonJS、AMD、UMD、ES Modules 模块化相关内容

## 第 27 章 工作者线程(Worker)
新增章节，将原 25.6 Web Workers 内容单独作为一章，基于最新的标准，做了详细的介绍。包括新增的专用工作者线程、共享工作者线程、服务工作者线程（Service Worker） 等。参考：[27. 工作者线程(Web Workers) | JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-27.html)

## 第 28 章 最佳实践
原第 24 章 最佳实践。修改了部分翻译，使内容更简单易懂。参考：[28.最佳实践 | JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-28.html)

28.1.2 编码规范中，变量和函数命名，新增 **推荐使用小写字母开头，驼峰大小写形式；类名首字母大写；常量全大写以下划线连接；变量名不要过于冗长**  

28.2.2 选择正确的方法，优化循环里，**去掉使用减值迭代**，这个在旧版浏览器中效率高，但现代浏览器基本没差别。

28.3 更新了部署构建、压缩相关的最新内容，比如摇树（tree shaking）、使用 Wepack、Rollup 进行打包、压缩时把 JavaScript 混淆压缩，将 ES6+ 代码转换到 ES3/ES5 等。

::: warning
删除原来的第 25 章 新兴的 API。将 25 章的内容打散放到了本书的其他章节。
:::

## --- 后 9 章分割线
::: tip
第 20 - 28 章，原 16 - 25 章。主要介绍 JavaScript API。删除了三章： EX4、高级技巧、新兴的API，新增两章：模块、工作者线程。
:::

## 错误记录

::: warning
- p353/355 async/await 执行顺序由于规范更新了，导致有误
- p439 观察字符数据的例子 innerText 后无法监听到回调。（环境：mac Chrome 浏览器）
- p454 dom扩展，"beforeend" 应该是放在最后一个子节点后面。而不是前面。
- p798 第二行，这也是为什么不会再打印 "foo" 的原因。这里的 foo 应该是 bar
- p862 4. 模块打包器中 Rollupt，应该是 Rollup
:::