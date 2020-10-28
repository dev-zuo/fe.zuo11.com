# 8. BOM



在web中使用Javascript，离不开BOM(Browser Object Model)，BOM提供了很多对象，用于访问浏览器的功能
- window对象，全局作用域、打开窗口、窗口位置大小、setTimeout、setInterval，alert等
- location对象，主要是URL相关信息，href、hash、查询字符串search，端口等信息
- navigator对象, 主要用来获取浏览器厂商、UA、平台、语言、是否有网、是否启用了cookie、安装的插件等信息
- screen对象，记录屏幕相关信息，分辨率，screen.width * screen.height
- history对象, 访问的历史记录

## window对象
BOM的核心对象是window，它表示浏览器的一个实例。在浏览器中，window对象有双重角色
- 是通过JS访问浏览器窗口的一个接口
- 是ECMAScript规定的Global对象，在全局作用域中定义的任何一个对象、变量、函数，都会变成window对象的属性和方法。
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
- window.设置的对象，与var对象声明的对象，虽然都可以通过window.访问，但还是有区别的
```js
// window.设置的变量可以通过 delete删除，而 var age，通过window.age是无法删除的。
// 使用var添加的window属性，有一个名为[[Configurable]]的特性，被设置为false，所以无法删
window.test = 2;
var age = 29;

delete window.test  // true
delete window.age // false 
```

### 窗口关系及框架frames
一般一个页面只对应一个html文件，框架相关的frameset、frame元素可以让多个页面html在同一个窗口中显示。
- 同页面的每个frame对应一个单独的html，都有独立的window
- 可以通过 frames, top.frames，获取页面window数组，可以通过 frames[0] 或 frames["topFrame"] 来获取对应的window对象，子frame对象可以通过parent属性访问上层框架。
- 框架的主页面，不需要包含body元素，写在body外才行
```js
top.frames[2].name  // "rightFrame"
top.frames[2].location.href = "leftFrame.html" // 切换页面
```
- **注意：本地调试需要用nginx或其他方式开启http服务，不能直接访问页面文件路径，会出现跨域的错误，导致top无法访问frame内的页面window**
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
![8_0_frame.png](/images/js/8_0_frame.png)

### 窗口位置、大小、打开新窗口
- 窗口位置，浏览器窗口在屏幕中的位置，通过两个属性来确定：
  - 浏览器窗口距离屏幕顶部距离(Number)：window.screenTop，window.screenY
  - 浏览器窗口距离屏幕左侧距离(Number)：window.screenLeft，window.screenX
- 窗口大小，chrome浏览器，从外到内：
  - 整个浏览器窗口的宽高：window.outerWidth, window.outerHeight
  - 可视区域的宽高：window.innerWidth，window.innerHeight
  - 可视区域的宽高-滚动条宽高: document.documentElement.clientWidth, document.documentElement.clientHeight
  - body内容的宽高: document.body.clientWidth, document.body.clientHeight
```js
// 打印窗口位置信息
windowSiteBtn.onclick = function(e) {
    info.innerHTML = `
    <p>screenLeft: ${window.screenLeft}, screenTop: ${window.screenTop};</p>
    <p>screenX：${window.screenX}, screenY: ${window.screenY};</p>
    `
}
// 打印窗口大小信息
windowSizeBtn.onclick = function(e) {
    info.innerHTML = `
    <p>body元素的宽*高：（如果网页内容过少，body元素的实际宽高比可视区域要小, 如果内容过多，body的高度以实际内容为准）</p>
    <p>document.body.clientWidth: ${document.body.clientWidth}, document.body.clientHeight: ${ document.body.clientHeight};</p>
    <p>可视区域的宽*高 - 滚动条宽高</p>
    <p>document.documentElement.clientWidth: ${ document.documentElement.clientWidth}, document.documentElement.clientHeight: ${ document.documentElement.clientHeight};</p>
    <p>可视区域的宽*高：（包含滚动条宽高, 不包含console调试区域, 不包含浏览器顶部组件高度）</p>
    <p>innerWidth: ${window.innerWidth}, innerHeight: ${window.innerHeight};</p>
    <p>浏览器窗口宽*高：(包含console调试区域)</p>
    <p>outerWidth: ${window.outerWidth}, outerHeight: ${window.outerHeight};</p>
    `
}
```
- 打开窗口 window.open()，该方法接收4个参数
  - 1.要加载的URL (如果没有，就会打开空白页面，用该函数返回值.document.write()，写入值到该页面)
  - 2.窗口目标, 已有窗口或框架名称，这样就会在对应的窗口或框架内打开页面。
  - 3.一个特性字符串，窗口的宽、高、窗口位置等，如果不传，默认在tab页打开新窗口
  - 4.true or false， 新页面是否取代浏览器历史记录中当前页面
```html
<input type="button" value="打开 '我的窗口'" onclick="openWin()">
<script>
    var myWindow;
    function openWin(){
        // 1.打开一个新的窗口，一般浏览器可能会阻止，第一次运行需要允许, url为空，不打开其他链接
        // myWindow = window.open("", "testWindow","height=400,width=400,top=200,left=400,location=no");
        // myWindow = window.open("", "testWindow"); // 打开新的tab窗口，如果二参是frame名，会在该frame打开该窗口
        myWindow = window.open("window.html", "", "width=300,height=400,resizable=no"); 
        
        if (myWindow === null) {
            alert('浏览器不允许弹窗')
        } else {
            myWindow.document.write('test'); // 向窗口写入内容
        }

        // 打开console调试，如下命令
        // 2.移动窗口位置
        // myWindow.moveTo(100,100);  // 移动窗口位置到 (100, 100)
        // myWindow.moveBy(-50, 50); // 相对当前位置（x,y）, 将窗口移动到 (x-50, y+50) 位置

        // 3.改变窗口大小
        // myWindow.resizeTo(600,300); // 改变窗口大小为 600*300
        // myWindow.resizeBy(100,200); // 改变窗口大小为 (x-100)*(y+200)

        // 4.关闭窗口
        // myWindow.close(); // 关闭弹窗
    }
</script>
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
    // 1 2  基本同同时打印
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
浏览器可以通过alert()、confirm()、prompt()方法可以调用系统对话框向用户显示消息，系统对话框不包含html，外观有浏览器决定，不是由css决定。
这几个方法打开的对话框都是同步和模态的，显示对话框会阻塞程序向下执行，关掉对话框后程序会继续执行
```js
// alert显示信息 "123"，点击确认关闭
alert('123');
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

// 可以通过改变search的值刷新网页


```
### 改变当前页面url
使用location对象可以通过很多方式来改变当前页面url，每次修改location属性(hash除外)，页面都会以新的URL重新加载
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
location改变URL后，浏览器会产生一条新的记录，可以通过后退，返回到前一个页面，使用location.replace(),可以无法返回上一页
```js
location.reload();     // 重新加载 (可能是从缓存中加载)
location.reload(true); // 重新加载 (从服务器重新加载)
```

## navigator对象
可以用来获取浏览器厂商、UA、平台、语言、是否有网、是否启用了cookie、安装的插件、
navigator对象可以用来识别客户端浏览器信息，UA等。更多信息，参考 [Navigator - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)
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
    for (var i = 0; i < navigator.plugins.lenght; i++) {
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
### 待后续研究
- Navigator.registerContentHandler()
- Navigator.registerProtocolHandler()
- Navigator.serviceWorker
- Navigator.getUserMedia()


## screen对象
可以查看屏幕分辩率，
在编程中用处不大，screen对象基本上只用来表明客户端能力，记录了屏幕相关信息
 ```js
// height：900  屏幕像素高的
// width：1400   屏幕像素宽度
// availHeight: 841   有效高度
// availLeft: 0
// availTop: 23
// availWidth: 1440
// colorDepth: 24   色彩位数
// pixelDepth: 24   像素深度
```

## history对象
可以用来前进、后退，history对象保存着用户的上网记录，出入安全方面的考虑，开发人员无法获取具体访问的URL，但可以前进或后退
```js
history.go(-1); // 后退一页  相当于 histroy.back();

history.go(1); // 前进一页 相当于  history.forward();
```
