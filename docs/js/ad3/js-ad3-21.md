---
title: 21. 错误处理与调试 - JS高程4
description: JS 一直以来被认为是最难调试的语言之一，因为它是动态的，错误经常以令人迷惑的形式抛出，比如："object expected" 这种消息没有上下文，因此很难理解。ES3 为了改进这个问题，引入了 try/catch 和 throw 语句，以及一些错误类型。如果没有使用 try/catch 捕获错误，浏览器会提示未捕获的错误（Uncaught xxxError）
keywords: js调试,js错误处理,js移动端调试
---

# 21. 错误处理与调试

JS 一直以来被认为是最难调试的语言之一，因为它是动态的，错误经常以令人迷惑的形式抛出，比如："object expected" 这种消息没有上下文，因此很难理解。ES3 为了改进这个问题，引入了 try/catch 和 throw 语句，以及一些错误类型。如果没有使用 try/catch 捕获错误，浏览器会提示未捕获的错误（Uncaught xxxError）

![uncaught error](/images/js/uncaughtError.png)

## 浏览器调试
在 PC 端我们打开开发者工具就可以审查元素、调试样式，查看 JS 相关调试信息/错误信息。在移动端，可以引入 vconsole，但 vconsole 有个缺点就是无法调试 DOM 样式效果。我们可以使用数据线将手机连接到电脑，通过 PC 端的 Safari 或 Chrome 浏览器来调试手机页面效果。

### 在 PC 端调试 iOS Safari 打开的页面
首先我们需要在 iPhone 上做一些设置：
1. 打开设置
2. 点击 Safari
3. 滚动到页面最下面，点击高级
4. 勾选网页检查器

使用手机上的 Safari 打开页面，通过数据线将手机连接到电脑。打开 mac 电脑的 Safari，在顶部菜单 开发 => 手机名称 里面可以看到手机上打开的网页，如下图手机 Safari 打开了 baidu.com

![error_debug_safari_1.png](/images/js/error_debug_safari_1.png)

点击对应的网页，即可打开 DOM 检查器，console 等调试面板。在里面可以修改手机页面中的 DOM 样式、内容。在 console 中 alert('123')，会应用到移动端的页面中。

![error_debug_safari_2.png](/images/js/error_debug_safari_2.png)

参考：[iOS 上的 Safari - Safari Web Inspector Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/GettingStarted/GettingStarted.html#//apple_ref/doc/uid/TP40007874-CH2-SW8)

### 在 PC 上调试 Android 设备网页内容
将安卓手机通过数据线连接到电脑，打开手机的开发者选项，允许 USB 调试。打开 Chrome 浏览器，访问 `chrome://inspect#devices` 检测到设备后即可开始调试。注意：数据线问题可能导致找不到手机。

在 Chrome DevTools 面板中，More Tools - Remote devices 已废弃（deprecated），直接访问 `chrome://inspect#devices` 即可。

> This panel has been deprecated in favor of the chrome://inspect/#devices interface, which has equivalent functionality.

- deprecate   `[ˈdeprəkeɪt]` deprecated v. 不赞成；弃用；不宜用
- in favor of  有利于；支持；赞同
- equivalent  `[ɪˈkwɪvələnt]` 相等的；等价的；等效的；
- functionality  `[ˌfʌŋkʃəˈnæləti]` n. 功能；

参考：
- [远程调试Android设备 | 知乎](https://zhuanlan.zhihu.com/p/265181365)
- [Android 设备的远程调试入门  |  Chrome DevTools  |  Google Developers](https://developers.google.cn/web/tools/chrome-devtools/remote-debugging/?hl=zh-cn)

## 错误处理 try/catch/finally
try/catch 可以捕获错误，可以解决出现错误后代码停止向下执行的问题。catch 捕获到错误时，event 会包含如下属性
- `message` 错误信息，所有浏览器都支持
- `description` IE，其值始终等于 message 
- `number` IE，内部错误号
- `fileName` Firefox，发生错误所在的文件名
- `lineNumber` Firefox，发生错误所在的行号
- `stack` Firefox/Safari/Chrome，错误的栈跟踪信息
- `line` Safari，行号
- `sourceId` Safari，实际值为 undefined
- `sourceURL` Safari，发生错误所在的 URL

出于浏览器兼容性考虑，建议仅使用 message 属性，错误信息 event 属性兼容性测试 demo，参见：[error 事件 event 属性兼容性测试 demo | Github](https://github.com/zuoxiaobai/fedemo/blob/master/src/JS_ES6/JS%E9%AB%98%E7%A8%8B3/%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86%E4%B8%8E%E8%B0%83%E8%AF%95/errorPropTest.html)
```js
try {
  // 可能导致的错误代码
  console.log('1');
  var e;
  e.showMessage(); // 这里会出现一个错误，后面的代码不会执行，会执行catch里的代码
  console.log('2');
} catch(e) {
  // 在错误处理时怎么处理
  console.log(e.message) // 打印错误信息
} finally {
  console.log('finally')
}
// 1
// Cannot read property 'showMessage' of undefined
// finally
```
如果加了 finally，try/catch 中的 return 都不会中断 finally 的执行。最终还是会执行 fianlly。下面的例子中，函数会返回 0, 不管正确还是错误，最终都会执行 finally 的内容
```js
function testFinally() {
  try {
    return 2;
  } catch {
    return 1;
  } finally {
    return 0;
  }
}
```
## 8 种错误类型 
- Error 基类型，其他错误类型都是继承自该类型，主要用于抛出自定义错误
- InternalError 底层 JS 引擎抛出异常时由浏览器抛出，例如：栈溢出
- EvalError 在使用 eval() 函数异常时会抛出该错误，浏览器实现会有区别 new eval() 会抛出 TypeError，eval 赋值仅 IE 会抛出异常。
- RangeError 范围错误，数值超出范围时，会触发该错误
```js
var item = new Array(-20);
// Uncaught RangeError: Invalid array length
```
- ReferenceError 参考/引用错误，在找不到对象的情况下会抛出该错误
```js
var a = x // 这里的x未定义
// Uncaught ReferenceError: x is not defined
```
- SyntaxError 语法错误 `[ˈsɪntaks]`
```js
let k = 1;
let k = 1; // let重复定义了k，回报语法错误
// Uncaught SyntaxError: Identifier 'k' has already been declared

try() // 这里明显语法错误
// Uncaught SyntaxError: Unexpected token (
```
- TypeError 类型错误
```js
var k = 1 
k.getInfo() // 数字变量，调用了一个函数
// Uncaught TypeError: k.getInfo is not a function

var o = new 10 // 10不是一个构造函数
// Uncaught TypeError: 10 is not a constructor
```
- URIError 当 encodeURI() 或 decodeURI() 执行时，URI 格式不正确，会导致该错误，基本不会发生该错误，默认会将参数值转为字符串再编码/解码。
## 抛出自定义错误
通过 throw 操作符可以在任何时候抛出异常，如果没有使用 try/catch 捕获会阻止程序向下执行。throw 抛出的异常信息不一定是 Error 类型，信息是由 throw 后面的值指定。这个值的类型不限，try/catch 时 catch 捕获的值就是 throw 后面的值。
```js
throw 123 // Uncaught 123
throw "hello" // Uncaught hello
throw true // Uncaught true
throw { a: 1 } // Uncaught { a: 1 }
try {
  throw '123'
} catch(e) {
  console.log(e) // '123'
}
```
使用 throw 抛出自定义错误信息
```js
try {
  throw new Error('custom message') // 这里除了可以抛出 Error 类型错误外，还可以抛出其他 7 种错误
} catch(e) {
  console.log('error message: ', e.message); // error message:  custom message
  console.log('error name: ', e.name); // error name:  Error   // 这里错误类型为 Error
  console.log('error fileName: ', e.fileName); // error fileName:  undefined
  console.log('error lineNumber: ', e.lineNumber); // error lineNumber:  undefined
  console.log('error columnNumber: ', e.columnNumber); // error columnNumber:  undefined
  console.log('error stack: ', e.stack); // error stack:  Error: custom message at http://127.0.0.1/error.html:11:19
}
```

## window 的 error 事件
当发生了错误，但没有使用 try/catch 捕获时，会触发在 window 对象上触发 error 事件，该事件有三个参数：
- `message` 错误信息
- `url` 错误文件url
- `line` 错误发生的行数

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>error</title>
  </head>
  <body>
    <script type='text/javascript'>
      // 如果错误有try-catch捕获，那程序会继续执行，如果没有捕获，会触发error事件，程序不会向下执行，注意：window.onerror要放在最前面
      window.onerror = function(message, url, line) {
        console.log('message: ' + message) // message: Uncaught TypeError: 类型错误
        console.log('url: ' + url) // url: http://127.0.0.1/error.html
        console.log('line:' + line) // line:25
      }
      try {
        throw new Error('custom message', 't.js', 10)
      } catch(e) {
        console.log('error message: ', e.message); // error message:  custom message
        console.log('error name: ', e.name); // error name:  Error
        console.log('error fileName: ', e.fileName); // error fileName:  undefined
        console.log('error lineNumber: ', e.lineNumber); // error lineNumber:  undefined
        console.log('error columnNumber: ', e.columnNumber); // error columnNumber:  undefined
        console.log('error stack: ', e.stack); // error stack:  Error: custom message at http://127.0.0.1/error.html:11:19
      }

      throw new TypeError('类型错误') // 这里触发的错误，onerror会触发
      cosnole.log('info') // 这里不会执行，浏览器实现会有差异，onerror 处理函数中 return，就类似于 try/catch 了
    </script>
  </body>
</html>
```

## 处理错误的策略
常见的错误类型
- 类型转换错误, == 与 === 要注意区分
- TypeError 数据类型错误, 比如非数组，却执行了数组的方法
- 通信错误，URL 中如果包含了另一个 redirect url 参数，需要用 encodeURIComponent() 转码，防止 URL 格式错误

可以使用静态代码分析器，比如 ESLint 等。
### 区分致命错误和非致命错
非致命错误，根据以下一个或多个条件确定：
- 不影响用户的主要任务
- 只影响页面的一部分
- 可以恢复
- 重复相同操作可以消除错误

致命错误，可以通过一个或多个条件确定
- 应用程序根本无法继续运行
- 错误明显影响了用户的主要操作
- 会导致其他连带错误

### 把错误记录到服务器
日志记录，需要写一个接口来上报信息。这里使用了 Image 对象来发送请求，有以下几个好处：
1. 所有浏览器都支持Image对象 
2. 可以避免跨域限制 
3. 记录错误的过程中出问题的概率比较低
```js
function logError(sev, msg) {
  // sev 严重程度
  // msg 错误信息
  var img = new Image();
  img.src = "log.php?sev=" + encodeURIComponent(sev) + "&msg=" + encodeURIComponent(msg)
}
// 开始使用
try {
  // 可能发生错误的情况
} catch(e) {
  // nonfatal adj. 非致命的 ，fatal [ˈfeɪt(ə)l] 致命的
  logError('nonfatal', 'Moudle init failed: ' + e.message)
}
```

## 调试技术
调试错误可以使用 alert() 弹出警告信息，但 alert() 会阻塞程序向下执行，不推荐使用。一般可以使用 console.log 将消息记录到控制台。另外也可以使用浏览器的断点调试功能，ES5 中新增了 debugger 关键字，用于以程序化的方式下断点。在移动端，由于真机运行不方便调试，vconsole 这个工具拦截了系统的 console, xhr 等，在页面中可视化显示调试信息，是移动端调试的利器。

### 使用 console 把消息记录到控制台
console 除了我们平常使用到的 log() 函数外，还支持 info()，warn()，error()
```js
console.log('一般消息') // 一般消息
console.info('信息性消息') // 信息性消息
console.warn('警告消息') // 警告消息
console.error('错误消息') // 错误消息
```

![console截图](/images/js/console截图.png)

### 浏览器断点调试/debugger

chrome 断点调试参见 [怎么使用Chrome断点调试功能，断点调试使用场景 - 左小白的技术日常](http://www.zuo11.com/blog/2019/11/breakpoint.html)

在 ES5 中，新增了 debugger 关键字，用于以程序化的方式下断点。打开页面时，程序会停留在该位置，并自动打开 DevTools 调试面板，点击按钮（Resume script execution, Resume `[rɪˈzjuːm]`）可以继续向下执行

```html
<script>
  let a = 123
  let b = a ** 2
  debugger
  let c = a * b
  console.log(c)
</script>
```

运行效果如下图：

![debugger.png](/images/js/debugger.png)

### 在页面中打印消息/拦截原生 console
可以自定义一个 log() 函数，在需要记录 log 时调用。log() 函数每次执行时，可以像 dom 指定区域 append 错误信息的 DOM。

vconsole 的思路就是这样，先拦截 console、xhr 等系统方法，在把信息 append 到页面的 DOM 中，方便查看。更多细节参考：[为什么vconsole直接new一下就能引入，实现原理是什么？ - 左小白的技术日常](http://www.zuo11.com/blog/2020/9/vconsole.html)

### 抛出错误 throw/assert()
抛出错误是调试代码的好方法，只要看一眼错误就能确定错误的确切信息，可以节省额外调试的工作量。

```js
function divide(num1, num2) {
  if (typeof num1 != 'number' || typeof num2 != 'number') {
    throw new Error('divide(): 所有的参数必须是 number 类型')
  }
  return num1 / num2
}
// divide(1, 2)
// 0.5
// divide(3, '123')
// Uncaught Error: divide(): 所有的参数必须是 number 类型
//   at divide (<anonymous>:3:11)
//   at <anonymous>:1:1
```
一般对于错误比较多的场景，会使用 assert() `[əˈsɜːt]` 断言函数来封装抛出异常的操作，使抛出自定义错误时代码更加简洁，更好理解。下面使用 assert() 来重构上面的代码
```js
function assert(condition, errorMsg) {
  if (condition) {
    throw new Error(errorMsg)
  }
}
function divide(num1, num2) {
  assert(typeof num1 != 'number' || typeof num2 != 'number', 'divide(): 所有的参数必须是 number 类型')
  return num1 / num2
}
```
## 旧版 IE 的常见错误
IE 曾是最难调试 JS 错误的浏览器之一，旧版本抛出的错误通常比较简短，比较含糊，缺少上下文。

- 无效字符 'invalid character'，在检测到 JS 文件中存在无效字符时抛出
- 未找到成员 'member not found'，旧版 IE 中 DOM 对象都是使用非原生 JS 对象（COM 对象）实现的，在垃圾回收时，可能会导致一些奇怪的行为。如果一个已销毁的对象，给他赋值时会出现该错误。
- 未知运行时错误，比如 `<p>` 标签内包含另一个块级元素时触发 
- 语法错误
- 系统找不到指定资源 'the system cannot locate the resource specified'，如果 URL 长度超过了 2083 个字符会发生该错误。