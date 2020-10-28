# 1. JavaScript简介



## 为什么会有JS - JavaScript的诞生
JS诞生于1995年，由当时就职于Netscape公司的Brendan Eich开发，最初的目的是想通过JS在请求服务器之前做一些输入验证操作。在此之前空值判断等都在后端进行，之前的网速很慢，非常耗时。

## 为什么会有ECMAScript(JavaScript标准化)
由于Netscape公司推出的javascript 1.0发布后获得了巨大的成功，微软在IE3中加入了对应的JavaScript实现。自此，出现了3个不同的JS版本，但可怕的是当时并没有一个标准来统一其语法或特性。随着业界担心的日益加剧。JS的标准化问题被提上日程。1997年JavaScript1.1作为一个草案提交给了欧洲计算机制造商协会(ECMA, European Computer Manufacturers Association), 该协会指定39号技术委员会(TC39 Thechnical Committee #39)负责"标准化一种通用、跨平台、供应商中立的脚本语言的语法和语义"。[TC39官网](http://www.ecma-international.org/memento/TC39.htm) TC39由来自Netscape、Sun、微软、Borland等公司的程序员组成, 共同完成了ECMA-262(定义了名为ECMAScript的全新脚本语言的标准)。之后ISO/IEC也采纳ECMAScript作为标准，从此，浏览器开发商开始致力于将ECMAScript作为各自javascript实现的基础。

## JavaScript的实现
虽然JavaScript和ECMAScript通常被人们用来表达相同含义，但JavaScript的含义比ECMA-262中规定的要多的多，一个完整的JavaScript实现应该有三个部分组成: 核心(ECMAScript)、文档对象模型(DOM)、浏览器对象模型(BOM)
- EMCAScript 描述了该语言的语法与基础对象
- DOM 描述了处理网页内容的方法和接口
- BOM 描述了与浏览器进行交互的方法和接口

![1_1_js实现.png](/images/js/1_1_js实现.png)

### ECMAScript
由ECMA-262定义的ECMAScript与web浏览器并没有依赖关系，web浏览器对于ECMAScript来说是一个宿主环境，但并不是唯一的。
(比如Node、Adobe Flash)，宿主环境不仅提供基本的ECMAScript实现，同时也会提供相关扩展与环境之间对接交互，比如DOM。关于JavaScript、NodeJS、ECMAScript之间的区别详情，参见 [ECMAScript、JavaScript与Nodejs的区别](https://blog.csdn.net/fabulous1111/article/details/78895364)

ECMA描述了以下内容: 语法、类型、语句、关键字、保留字、操作符、对象。每个浏览器都有它自己的ECMAScript接口的实现，然后这个实现
又被扩展，包含了DOM和BOM。

ECMAScript历史版本:
- 1997年06月 第一版 ES1 本质上与javascript 1.1相同,删除了所有针对浏览器的代码并作了一些较小的改动：要求支持Unicode标准等。
- 1998年06月 第二版 ES2 这一版的内容更新是为了与ISO/IEC-16262保持严格一致，没有作任何新增、修改或删节处理。
- 1999年12月 第三版 ES3 新增正则表达式、新控制语句、try-catch异常处理支持,修改了字符处理、错误定义和数值输出等内容。
- ECMAScript沉寂多年，直到Ajax流行起来后，标准工作才再次起步。
- 2008年07月 第四版 ES4 发布前被废弃，由于改动较大，各方有分歧，不怎么愉快，导致难产，详情参见 [ES4相关历史](https://www.zhihu.com/question/24715618)
- 2009年12月 第五版 ES5 澄清第三版中的歧义，新增原生JSON对象、继承的方法、高级属性的定义以及引入严格模式。
- 2015年06月 第六版 ES6 官方名称为ECMAScript2015，之后都会这样命名，新增了许多特性，如Maps、Sets、Promise、生成器（Generators）等。
- 2016年06月 第七版 ES2016 新增两个特性: Array.prototype.includes和取幂运算符 [官方文档](http://www.ecma-international.org/ecma-262/7.0/#sec-overview)
- 2017年06月 第八版 ES2017 新增async/await等
- 2018年06月 第九版 ES2018 新增共享内存和原子性、异步循环等 [官方文档](https://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)

相关资料
- ES2016, 2017和2018到底有哪些新功能？https://mp.weixin.qq.com/s/A4Z8D3IlSsw1XnP3wFbJHg
- ES2016与ES2017相关 http://www.css88.com/archives/7753
- 阮一峰的 EMCAScript 6 入门(第三版) http://es6.ruanyifeng.com/#README
- ECMAScript各版本及特性 https://segmentfault.com/a/1190000003493604
- 关于ES5、ES6及之后版本的兼容性 http://kangax.github.io/compat-table/es6/

关于兼容性:
- IE11支持ES5，基本不支持ES6，低版本的IE8、9等使用ES6语法需要用Babel插件
- Chrome、Firfox、safari、Edge对ES6支持很好。

### DOM
文档对象模型(DOM, Document Object Model), 是HTML和XML的API，DOM把整个页面映射为一个多层节点结构。通过创建树来表示文档，从而使
开发人员可以控制页面的内容和结构。借助DOM提供的API，开发人员可以轻松自如的删除、添加和修改任何节点。

为什么要使用DOM？

在IE4和 Netscape Navigator 4分别支持不同形式的动态HTML(DHTML)后，开发人员首次无需重新加载网页就可以修改其外观和内容了，但两家
公司互不兼容，web开发者只编写一个HTML页面就能在所有浏览器中访问的时代结束了。业界必须做点什么保持web跨平台的天性，因此负责web通信标准的团体
W3C(World Wide Web Consortium)就开始着手规划DOM.
#### DOM级别
##### DOM1级(DOM Level 1) 
DOM Level 1于W3C于1998年10月提出的。主要主要是映射文档的结构，由两个模块组成DOM核心(DOM Core)和DOM HTML
- DOM核心 规定了如何映射基于XML的文档结构，以便简化对文档中任意部分的访问操作
- DOM HTML 在DOM核心的基础上加以扩展，添加了针对HTML的对象和方法
##### DOM2级(DOM Level 2)
- 扩充了鼠标和用户界面事件、范围、遍历等细分模块，且增加了对CSS的支持，加入了对XML命名空间的支持
- 引入的新模块: DOM视图、DOM事件、DOM样式、DOM遍历和范围
##### DOM3级(DOM Level 3)
- 引入了统一的方式载入和保持文档的方法，以及验证文档的方法，开始支持XML 1.0所有特性

##### 其他DOM标准
除了DOM Core 和DOM HTML外，还有其他几种语言发布了只针对自己的DOM标准，这些语言都是基于XML的，每种语言的DOM
标准都添加了特定的方法和接口
- 可缩放矢量语言 SVG
- 数字标记语言 MathML
- 同步多媒体集成语言 SMIL

兼容性方面，基本都支持，各个浏览器或多或少会有兼容性方面的问题，使用前可在caniuse.com里查具体的兼容性

### BOM
浏览器对象模型(BOM, Browser Object Model) 可以对浏览器窗口进行访问和操作,通常浏览器特定的JS扩展都被看做BOM的一部分，
这些扩展包括
- 弹出新的浏览器窗口
- 移动、关闭浏览器窗口以及调整窗口大小
- 提供浏览器详细信息的navigator对象
- 提供浏览器所加载页面详细信息的location对象
- 提供用户显示器分辨率详细信息的screen对象
- 对cookies的支持
- XMLHttpRequest和IE的ActiveXObject等自定义对象
