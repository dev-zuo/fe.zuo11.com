---
title: 12. BOM - JS高程4
description: 在 web 中使用 Javascript，离不开 BOM(Browser Object Model)，BOM 提供了很多对象，用于访问浏览器的功能。window 对象，全局作用域、打开窗口、窗口位置大小、setTimeout、setInterval，alert等。location 对象，主要是URL相关信息，href、hash、查询字符串 search，端口等信息。navigator 对象, 主要用来获取浏览器厂商、UA、平台、语言、是否有网、是否启用了 cookie、安装的插件等信息。screen 对象，记录屏幕相关信息，分辨率，screen.width * screen.height。history 对象, 访问的历史记录
keywords: BOM,window,location,navigator,history,screen,设备像素比,dpr
---
# 12. BOM
在 web 中使用 Javascript，离不开 BOM(Browser Object Model)，BOM 提供了很多对象，用于访问浏览器的功能
- window 对象，全局作用域、打开窗口、窗口位置大小、setTimeout、setInterval，alert等
- location 对象，主要是URL相关信息，href、hash、查询字符串 search，端口等信息
- navigator 对象, 主要用来获取浏览器厂商、UA、平台、语言、是否有网、是否启用了 cookie、安装的插件等信息
- screen 对象，记录屏幕相关信息，分辨率，screen.width * screen.height
- history 对象, 访问的历史记录

## window对象
BOM 的核心对象是 window，它表示浏览器的一个实例。在浏览器中，window 对象有双重角色
- 一是浏览器窗口的 JS 接口
- 二是 ES 中的 Global 对象，在全局作用域中使用定义的任何一个对象、变量、函数（let、const除外），都会变成 window 对象的属性和方法。
### 全局作用域
- 全局定义的方法、属性都可以通过window对象调用；window.的属性、方法，其他位置都可以使用。
```js
var age = 29;
function sayAge(){
  alert(this.age);
}

alert(window.age); // 29
sayAge(); // 29
window.sayAge(); //29
```
- let 与 const 在全局作用域内声明的变量不会挂载到 window 上。这点和 var 是有区别的。
- window.设置的对象，与 var 对象声明的对象，虽然都可以通过 window. 访问，但还是有区别的
```js
// window.设置的变量可以通过 delete删除，而 var age，通过window.age是无法删除的。
// 使用var添加的window属性，有一个名为[[Configurable]]的特性，被设置为false，所以无法删
window.test = 2;
var age = 29;

delete window.test  // true
delete window.age // false 
```

### 窗口关系及框架frames(第4版已精简)
一般一个页面只对应一个 html 文件，框架相关的 frameset、frame 元素可以让多个页面 html 在同一个窗口中显示。window.self 等同于 window，window.top 指向最外层的窗口。现在基本不会这样使用了，已过时，第 4 版只用了不到 10 行内容来说明。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>窗口关系及框架frames</title>
  </head>
  <!-- <body> -->
  <frameset rows="20%,*" name="frames">
    <frame src="topFrame.html" name="topFrame">
    <frameset cols="20%,80%">
      <frame src="leftFrame.html" name="leftFrame">
      <frame src="rightFrame.html" name="rightFrame">
    </frameset>
    <noframes>Sorry, your browser does not handle frames!</noframes>
  </frameset>
  <!-- </body> -->
</html>
```

- 同页面的每个 frame 对应一个单独的 html，都有独立的 window
- 可以通过 window.frames, window.top.frames，获取页面 window 数组，可以通过 frames[0] 或 frames["topFrame"] 来获取对应的window对象，子 frame 对象可以通过 parent 属性访问上层框架。
- 框架的主页面，不需要包含 body 元素，写在 body 外才行
```js
top.frames[2].name  // "rightFrame"
top.frames[2].location.href = "leftFrame.html" // 切换页面
```
- **注意：本地调试需要用nginx或其他方式开启http服务，不能直接访问页面文件路径，会出现跨域的错误，导致top无法访问frame内的页面window**

![8_0_frame.png](/images/js/8_0_frame.png)

### 窗口位置、大小、打开新窗口
- 窗口位置，**浏览器窗口在屏幕中的位置**，通过两个属性来确定：
  - 浏览器窗口距离屏幕顶部距离(Number)：window.screenTop，window.screenY
  - 浏览器窗口距离屏幕左侧距离(Number)：window.screenLeft，window.screenX

```js
console.log(`screenLeft: ${window.screenLeft}, screenTop: ${window.screenTop}`)
console.log(`screenX：${window.screenX}, screenY: ${window.screenY}`)
```
- 窗口大小，浏览器窗口大小(窗口缩放后，大小会跟着改变)，从外到内：
  - 整个浏览器窗口的宽高，包含 console 调试区域：window.outerWidth, window.outerHeight
  - 可视区域的宽高(包含滚动条宽高, 不包含console调试区域，不包括浏览器边框和工具栏)：window.innerWidth，window.innerHeight
  - html整个文档宽高: document.documentElement.clientWidth, document.documentElement.clientHeight，**注意有的是视口宽高，有的是实际内容宽高**
  - body内容的宽高(实际内容): document.body.clientWidth, document.body.clientHeight
  - document 包含整个 文档信息, document.documentElement 是 html 元素不包含 document.doctype, document.body 是 body元素内容，不包含 document.head 部分
  - 可通过 window.resizeTo,resizeBy 进行缩放，但一般可能会被禁用。
```js
// 打印窗口大小信息
console.log(`浏览器窗口宽*高: outerWidth: ${window.outerWidth}, outerHeight: ${window.outerHeight};`)
console.log(`可视区域的宽*高: innerWidth: ${window.innerWidth}, innerHeight: ${window.innerHeight}`)
console.log(`html整个文档宽高: document.documentElement.clientWidth: ${ document.documentElement.clientWidth}, document.documentElement.clientHeight: ${ document.documentElement.clientHeight}`)
console.log(`body内容的宽高: document.body.clientWidth: ${document.body.clientWidth}, document.body.clientHeight: ${ document.body.clientHeight}`)
```
- 打开新窗口 window.open()，该方法接收4个参数
  - `url` 要打开的链接，默认在新标签页打开。如果为空，就会打开空白页面，如果非完整 url，会把它当前相对的 url。
  - `target` 窗口目标, 已有窗口或框架名称，这样就会在对应的窗口或框架内打开页面。如果是 `_self` 则是不打开新窗口，在当前页面跳转。
  - `settingStr` 一个特性字符串，窗口的宽、高、窗口位置等，如果不传，默认在tab页打开新窗口
  - true or false 如果非新窗口打开，在当前页面跳转时，是否取代浏览器中的当前页面
```js
let newWindow = window.open('') // 新标签页打开空白页
// 返回新窗口的 window，可以用该值修改空白页的内容
newWindow.document.write('hello')
// 一般新打开的 window，可以通过 window.opener 方法原 window
// 为了安全起见，返回值的 opener 需要设置为 null
newWindow.opener === window // true
newWindow.opener = null

// 打开一个相对的路径 http://xx.com/xxx/123
let newWindow = window.open('123')

// 当前页面跳转
let newWindow = window.open('123', '_self')

// 属性字符串，设置打开窗口的大小，这样打开的窗口，可以设置窗口位、resize大小
myWindow = window.open("test", "", "width=300,height=400,resizable=no"); 
// 打开console调试，如下命令
// 改变窗口位置
// myWindow.moveTo(100,100);  // 移动窗口位置到 (100, 100)
// myWindow.moveBy(-50, 50); // 相对当前位置（x,y）, 将窗口移动到 (x-50, y+50) 位置
// 改变窗口大小
// myWindow.resizeTo(600,300); // 改变窗口大小为 600*300
// myWindow.resizeBy(100,200); // 改变窗口大小为 (x-100)*(y+200)
```
有时间后再第一次使用 window.open 打开时，**浏览器可能会由于安全方面的原因，阻止打开，这样返回值就不会有新窗口的 window**。这种情况我们需要加一个提示，提示浏览器屏蔽了打开新窗口的操作，请手动允许打开。使用 close() 方法可以关闭打开的窗口。
```js
let newWindow = window.open('http://baidu.com')
if (!newWindow) {
	alert('浏览器不允许弹窗，请你手动设置允许打开') 
}

// 可以使用 close() 关闭打开的窗口
newWindow.close(); // 关闭弹窗
```

### 设备像素比与视口位置(滚动距离)
第四版新增。

**设备像素比 window.devicePixelRatio**，这里要了解 **物理**分辨率 与 **逻辑**分辨率。一般情况下，屏幕分辨率越高就越清晰，更细腻。
- 物理分辨率是屏幕的真实分辨率
- 逻辑分辨率是当前屏幕尺寸逻辑上应该对应的分辨率
- DPI (dots per inch) 每英寸像素，表示单位像素密度
- window.devicePixelRatio 设备像素比表示物理像素与逻辑像素之间的缩放系数。用于把物理像素转换为 CSS 像素(浏览器报告的虚拟分辨率)

举个例子，13.3 寸 MacBook Pro 的屏幕分辨率(物理分辨率)是 2880 * 1800，而老款 13.3 寸的 MacBook Air 的屏幕(物理)分辨率是 1440 * 900。

屏幕物理尺寸都是 13.3 寸，Pro 的像素是 Air 的两倍。同样 12px（CSS像素）的文字，如果都按真实的物理像素显示。那么 Air 上看到的字体大小应该是 Pro 上的两倍。这样 Pro 上的字就会很小，看不清。

因此在显示时，会按照一定的比例进行缩放。让内容在不同的分辨率下看到的都一致。缩放后的分辨率就是逻辑分辨率。物理像素比与逻辑像素比之间的缩放系数就是 **设备像素比**。

同样的 100px * 100px 的内容在 Air 上使用 100 * 100 个物理像素表示。而 Pro 上，会使用 200 * 200 个物理像素表示。Pro 的 设备像素比是 2。Air 的像素比是 1。

在 canvas 绘图时，一定要注意设备像素比。

**视口位置/滚动距离**，一般文档实际内容要比视口的内容多，因此会有滚动。获取页面滚动距离可以使用:
- window.pageXoffset; window.scrollX 水平滚动距离
- window.pageYoffset; window.scrollY 垂直滚动距离
有三种方法用于滚动页面，处理接收 x, y 参数外，还可以接收一个对象 `{ left: xx, top: xx, behavior: 'auto或smooth'}` 设置是否平滑滚动。
- window.scroll(x, y) 滚动到距离左侧 x 像素，距离顶部 y 像素的位置 
- window.scrollTo(x, y) 滚动到距离左侧 x 像素，距离顶部 y 像素的位置 
- window.scrollBy(x, y) 相对当前滚动位置滚动，距离左侧 +x，距离顶部 +y
```js
window.scroll(100, 100)
window.scrollBy(100, -100)
window.scrollTo(100, 900)
// 平滑滚动
window.scrollTo({
	left: 100, 
	top: 900,
	behavior: 'smooth'
})
```
### setTimeout与setInterval
JS是单线程语言，它允许通过设置超时值和间歇时间值来调度代码在特定时间执行。
- setTimeout() 在指定时间后将代码添加到执行队列，待空闲后执行, 清除：clearTimeout(timoutId)
- setInterval() 每隔指定的时间就将代码添加到执行队列，待空闲后执行， 清除：clearInterval(intervalId)

一参为执行的代码，二参为等待时间(毫秒)，但经过该时间后，指定的代码并不一定会立即执行，JS是一个单线程解释器，一定时间内只能执行一段代码。为了控制代码执行，就有一个JS任务队列。这些任务会按照他们添加到队列的顺序执行。如果队列为空，会立即执行，如果队列不为空，那么就需要等前面的代码执行完了以后再执行。
```js
// 根据值切换对应的demo
var test = 5;

if (test === 1) {
    // 1 3  基本同同时打印
    setTimeout(function () {
        console.log('1');
    }, 2000);
    setTimeout(function () {
        console.log('3');
    }, 2000);
}

if (test === 2) {
    //  1  3  打印1后后面间隔500ms
    setTimeout(function () {
        console.log('1');
    }, 2000);
    setTimeout(function () {
        console.log('3');
    }, 2500);
}

if (test === 4) {
	// 2 3 5 4 1
	// 为什么这里后被执行，因为setTimeout是异步的（是注册事件），他会先把函数注册到事件队列当中，等待主程序走完，然后再被调用。
	// JS 事件循环，宏任务与微任务。参考：js 事件循环消息队列和微任务宏任务 
	// https://www.cnblogs.com/xingguozhiming/p/13276725.html
	// 同步任务、I/O(比如文件读写等)、setTimeout、setInterval 是宏任务
	// Promise.then/catch/finally,generator,async/await 是微任务
	// 某个宏任务执行 ok 后，会看微任务队里是否有，有就执行，然后才是宏任务队列。
    setTimeout(function() {
        console.log(1);
    }, 0);
    new Promise(function executor(resolve) {
        console.log(2);
        for( var i=0 ; i<10000 ; i++ ) {
            i === 9999 && resolve();
        }
        console.log(3);
    }).then(function() {
        console.log(4);
    });
    console.log(5);
}

if (test === 5) {
    // 5 1 2 4 3
    setTimeout(function() {
        console.log(1);
    }, 0);

    setTimeout(function() {
        console.log(2);
        // for循环里面如果没有阻塞代码，还是会顺序执行
        for( var i=0 ; i<1000000000 ; i++ ) {
            if (i === 999999999)  {
                console.log(4);
            }
        }
        console.log(3);
    }, 0);

    console.log(5);
}

// 清除setTimeout
console.log('testStart');
var t = setTimeout(function() {
    console.log('exec');
},5000);
clearTimeout(t);

// 每隔一段时间执行
console.log('testStart2');
var t2 = setInterval(function() {
    console.log('exec...');
},1000);
// 3s 后清除
setTimeout(function() {
    clearInterval(t2);
},3000);

```

### 系统对话框
浏览器可以通过alert()、confirm()、prompt()方法调用系统对话框向用户显示消息，系统对话框不包含 html，外观由浏览器决定，不是由 css 决定。

这几个方法打开的对话框都是同步和模态的，**显示对话框会阻塞程序向下执行，关掉对话框后程序会继续执行**

```js
// alert显示信息 "123"，点击确认关闭
alert('123');
console.log(456)
```
![alert](/images/js/alert.png)

```js
// confirm显示询问框，可点击确认或取消关闭, 分别返回true、false
if (confirm("are you ok?")) {
    alert('您点击了确定');
} else {
    alert('您点击了取消');
}
```
![confirm](/images/js/confirm.png)
```js
// prompt打开一个对话框，里面包含一个文本输入框，第一个参数为提示内容，第二个参数为输入框的默认值
// 当点击取消返回null，更改内容后返回对应输入框的内容，如果填写为空，返回""
alert(prompt('请输入你的姓名?', '张三'));
```
![prompt](/images/js/prompt.png)

```js
// 另外两个非同步，异步执行的方法
// 调用打印功能，相当于anle ctrl+p
window.print();

// 查找网页里面是否有某个字符串, 如果有打印true，没有打印false
// <p>sdfsdfdfd打发时间乐山大佛技术对接分类数据砥砺奋进是登录</p>
alert(window.find("sdf"));
```
![window.find](/images/js/windowFind.png)

## location对象
location是最有用的BOM对象之一，提供了当前窗口中加载文档相关信息，如URL，域名，页面路径，查询字段、协议等
- 可以用来获取和改变页面url，重新加载页面
- 它既是window对象的属性，也是document对象的属性。window.location和document.location引用的是同一个对象
 ```js
// window.location === document.location  // true
// location.href 完整的url
// location.origin  网站的开头部分带host 可以用来做api接口前置
// location.pathname // 路径，不带host
// location.searh // ?a=1&b=2  查询字符串
// location.hash // #1   hash值
// location.protocol 协议
// 以访问这个url为例子，查看window.location 内容
// https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9011978904606190454%22%7D&n_type=0&p_from=1#1
```
![window.location](/images/js/windowLocation.png)
### URL主要属性及对应的解释
![window.location prop](/images/js/window_location_prop.png)

### 获取URL查询字符串
在 URLSearchParams 没出现之前一般使用字符串切分来获取查询字符串，方法如下：
```js
// 前端获取url里面的查询字符串
console.log(getQueryStringArgs());

/**
 * 获取url里面的查询信息(window.location.search)
 * 如果查询为空 ""，如果有查询  "?a=kk"
 * @returns 如果有查询语句返回{},如果没有返回 ""
 */
function getQueryStringArgs() {
    var searchStr = location.search;
    if (!searchStr) {
        return "";
    }

    // 去掉开头的?
    var argsArr;
    searchStr = searchStr.substring(1);

    // 切分后将 xxx=xxx 字符串格式转为 {xxxx:xxxx,....}
    argsArr = searchStr.split('&');
    var args = {};
    for (var i = 0; i < argsArr.length; i++) {
        var itemArr = argsArr[i].split('=');
        var tempKey = decodeURIComponent(itemArr[0]);
        var tempValue = decodeURIComponent(itemArr[1]);
        args[tempKey] = tempValue;
    }
    return args;
}
```
关于 URLSearchParams 的使用可以参考：[URLSearchParams URL查询字符串处理 - 左小白的技术日常](http://www.zuo11.com/blog/2019/10/web_url_searchparams.html)

这里简单介绍下，URLSearchParams 构造函数接收 location.searh 查询字符串，生成一个 searchParams 实例，这个实例有下面几个方法
- toString() 用于转字符串，会自动去掉首部 ?，不会进行 decodeURIComponent()
- has(prop) 用于查询字符串中是否有该 prop 字段
- get(prop) 用于获取该查询字段的值，会进行 decodeURIComponent()
- delete(prop) 用于删除 prop 查询字段
- set(prop, value) 用于设置查询字符串，会进行 encodeURIComponent()
- for...of 遍历 `[["a", "1"], ["b", "测试"]]` 类似于 entries 对象后的结果
- 使用 Object.fromEntries(实例)，可以直接转为键值对的形式
```js
let qs = '?a=1&b=%E6%B5%8B%E8%AF%95'; // '?a=1&b=测试' 转码后
let searchParams = new URLSearchParams(qs)
console.log(searchParams.toString()) // "a=1&b=%E6%B5%8B%E8%AF%95"
console.log(searchParams.has('b')) // true
console.log(searchParams.get('b')) // "测试"
searchParams.set('c', '我们') 
console.log(searchParams.toString()) // "a=1&b=%E6%B5%8B%E8%AF%95&c=%E6%88%91%E4%BB%AC"
searchParams.delete('c') // a=1&b=%E6%B5%8B%E8%AF%95

for(item of searchParams) {
	console.log(item)
}
// ["a", "1"]
// ["b", "测试"]

for([key, value] of searchParams) {
	console.log(key, value)
}
// a 1
// b 测试

Object.fromEntries(searchParams)
// {a: "1", b: "测试"}
```
### 改变当前页面url
使用 location 对象可以通过很多方式来改变当前页面 url，每次修改 location 属性(hash 除外)，页面都会以新的 URL 重新加载(刷新)
```js
location.assign("http://zuo11.com"); // 切换url
// 如果将location.href与window.location 设置为一个url，会间接调用location.assign(对应的值)

// 假设初始化URL为 http://www.zuo11.com/test/

// 将URL修改为 http://www.zuo11.com/test/#section1
location.hash ="#section1";

// 将URL修改为 http://www.zuo11.com/test/?k=2
location.search = '?k=2';

// 将URL修改为 http://www.baidu.com/test/
location.hostname = "www.baidu.com/";

// 将URL修改为 http://www.zuo11.com/mydir/
location.pathname = "mydir";

// 将URL修改为 http://www.zuo11.com:8080/test/
location.port = 8080;
```
location 改变 URL 后，浏览器会产生一条新的记录，可以通过后退，返回到前一个页面，使用 location.replace() ,无法返回上一页
```js
location.reload();     // 重新加载 (可能是从缓存中加载)
location.reload(true); // 重新加载 (从服务器重新加载)
```

## navigator对象
可以用来获取浏览器厂商、UA、平台、语言、是否有网、是否启用了cookie、安装的插件、
navigator对象可以用来识别客户端浏览器信息，UA等。更多信息，参考 [Navigator - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)。更多详情内容，参见下一章，里面会具体讲 navigator 对象的用法。
### 基本属性
```js
// appCodeName: "Mozilla",  // 浏览器名称      Safari、Firefox、Chrome、IE 均是这个值
// appName: "Netscape",     // 完整的浏览器名称 Safari、Firefox、Chrome、IE 均是这个值
// product: "Gecko",        // 产品名称       Safari、Firefox、Chrome、IE 均是这个值

// appVersion: "",          // 浏览器的版本，一般不与实际的浏览器版本对应
// userAgent: "",           // 浏览器的用户代理字符串,HTTP规范明确规定，浏览器应该发送简短的用户代理字符串指明浏览器的版本和版本号

// cookieEnabled: true,     // 是否启用的cookie
// onLine: true,            // 是否有网络

// language: "zh-CN",       // 浏览器主语言
// platform: "MacIntel",    // 浏览器所在的系统平台， windows为win32
// vendor: "Apple Computer, Inc." // 浏览器的品牌，IE、Edge、Firefox均为"", Safari和Chrome(Google Inc.)有值，


/*
IE11
appVersion:  "5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko"
userAgent:    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko"

Edge
appVersion:  "5.0 (Windows NT 10.0; Win64; x64; ServiceUI 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063"
userAgent:   "Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063"

QQ
appVersion:  "5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.5702.400 QQBrowser/10.2.1893.400"
userAgent:    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.5702.400 QQBrowser/10.2.1893.400"

Chrome 
appVersion: "5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
userAgent:   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"

Firefox
appVersion: "5.0 (Macintosh)"
userAgent:   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/61.0"

Safari
appVersion: "5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15"
userAgent:   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15"
*/
```
### 检测插件
navigator.plugins 数组记录了当前浏览器上安装的插件
```js
// 相关属性
// name : 插件的名字
// description: 插件的描述
// filename: 插件的文件名
// length: 插件所处理的MIME类型数量

// 检测插件 (非IE环境)
function hasPlugin(name) {
    name = name.toLowerCase();
    for (var i = 0; i < navigator.plugins.length; i++) {
        if (navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
            return true;
        }
    }
    return false;
}

// 检测Flash
alert(hasPlugin("flash"));


// IE中检测插件方法
function hasIEPlugin(name) {
    try {
        new ActiveXObject(name);
        return true;
    } catch (ex) {
        return false;
    }
}
// 检测Falsh
alert(hasIEPlugin("ShockwaveFlash.ShockwaveFlash"));
```
### 注册处理程序
HTML5 中定义了 Navigator.registerProtocolHandler() 可以把网站注册为处理某种特定类型信息应用程序。参考：[Navigator.registerProtocolHandler() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler)


## screen对象
可以查看屏幕分辩率，
在编程中用处不大，screen对象基本上只用来表明客户端能力，记录了屏幕相关信息
 ```js
// height：900  屏幕像素高度
// width：1400   屏幕像素宽度
// availHeight: 841   有效高度
// availLeft: 0
// availTop: 23
// availWidth: 1440
// colorDepth: 24   色彩位数
// pixelDepth: 24   像素深度
```

## history对象
可以用来前进、后退，history 对象保存着用户的访问记录，出于安全方面的考虑，开发人员无法获取具体访问的 URL，但可以前进或后退。

利用 history 对象可以以编程的方式实现在历史中导航，而且可以修改历史记录。
```js
history.go(-1); // 后退一页  相当于 histroy.back();

history.go(1); // 前进一页 相当于  history.forward();

history.go("字符串") // 导航到历史中包含该字符串的最近的页面

if (history.length === 1) {
	// 这是该窗口或标签页打开的第一个页面
}
```
### 历史状态管理
现代 web 应用开发中，最难的一个环节之一就是历史记录管理。每次点击都会触发页面刷新的时代已经过去。 "后退" 和 "前进" 只是切换一个状态。

HTML5 为 history 新增了 hashchange 事件，hash 改变时会触发。history.pushState/history.replacestate 可以让开发者在改变 URL 的情况下，不刷新页面。pushState 会创建新的 历史记录。

```js
let stateObj = { foo: "bar" }
// state对象、新状态的标题、可选的相对 URL
history.pushState(stateObj, "title", "xx.html")
// 改变 URL，页面不刷新，

// replace 不会创建新的历史记录，覆盖当前记录
// history.replaceState(stateObj, "title", "xx.html")
```
pushstate 后，点击后退会触发 window 的 popstate 方法。

HTML SPA 单页面应用需要确保 pushState 创建的每个假 URL 对应者服务器真实的 URL，防止刷新后 404 异常。