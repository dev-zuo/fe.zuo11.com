---
title: 24. 网络请求与远程资源 - JS高程4
description: Ajax(Asynchronous JS + XML) 异步的 JS 和 XML，是一种用于 http 请求的技术。是 Jesse James Garrett 在 2005 年提出的方案。主要用于在不刷新页面的情况下，请求服务器接口获取数据，从而实现了更好的用户体验。现在可能觉得没什么，但以前请求服务器接口获取数据时都需要刷新页面，体验较差。Ajax 技术的核心是 XMLHttpRequest（XHR 对象），为什么是 XML 开头呢？因为在 JSON 出现之前，网络请求使用的数据都是 XML 类型的。 XHR 对象普遍认为比较难用，而 Fetch API 支持 Promise 和 Service Worker，已经成为极其强大的 Web 开发工具
keywords: Ajax,Fetch API,WebSocket
---
# 24. 网络请求与远程资源

Ajax(Asynchronous JS + XML) 异步的 JS 和 XML，是一种用于 http 请求的技术。是 Jesse James Garrett 在 2005 年提出的方案。主要用于在不刷新页面的情况下，请求服务器接口获取数据，从而实现了更好的用户体验。现在可能觉得没什么，但以前请求服务器接口获取数据时都需要刷新页面，体验较差。Ajax 技术的核心是 XMLHttpRequest（XHR 对象），为什么是 XML 开头呢？因为在 JSON 出现之前，网络请求使用的数据都是 XML 类型的。 XHR 对象普遍认为比较难用，而 Fetch API 支持 Promise 和 Service Worker，已经成为极其强大的 Web 开发工具

Asynchronous `[eɪˈsɪŋkrənəs]` 异步的

## XMLHttpRequest 对象
XMLHttpRequest，简称 XHR，使用方法如下：
1. 使用 `new XMLHttpRequest()` 构造函数，创建 xhr 对象
2. 调用 `xhr.open(method, url, isAsync)` 准备即将发送的请求，method 为请求方法，比如 "get"、"post"；url 为请求的 URL；isAsync 表示是否是异步发送请求。只能向同一个域中使用相同端口和协议的URL发送请求，否则会引起安全错误(跨域)。
3. 使用 `xhr.send(data)` 发送请求，data 是作为请求体发送的数据，如果不需要发送请求体，必须传 null
4. 服务器接收到请求，响应数据后会自动填充到 xhr 对象的属性中，包含以下属性
   - xhr.status 响应的 HTTP 状态，xhr.status 大于等于 200 且小于 300，或等于 304（资源未修改） 为成功，其他状态码，表示请求异常。一般 200 为成功
   - xhr.responseText 响应主体返回的文本
   - xhr.responseXML 如果响应的内容类型是 "text/xml" 或 "application/xml", 将包含响应数据的 XML DOM 文档
   - xhr.statusText HTTP 状态的说明
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>json</title>
  </head>
  <body>
    <input id="send-req-btn" type="button" value="发送请求">
    <script>
      // https://zuo11.com/gzh_test
      let sendReqBtn = document.getElementById('send-req-btn');
      sendReqBtn.onclick = function(event) {
        // 1. 创建xhr对象
        let xhr = new XMLHttpRequest(); // 创建xhr对象，IE7+

        // 2. 启动一个请求以备发送 xhr.open(请求类型，请求的URL，是否发送异步请求) 请求类型("get", "post")，
        xhr.open("get", "https://zuo11.com/gzh_test", false) // 第三个参数false, 发送一个同步请求，发送请求后，不会向下执行，一直等请求完毕后才会执行后面的内容
        // 只能向同一个域中使用相同端口和协议的URL发送请求，否则会引起安全错误(跨域)。

        // 3. 发送请求, xhr.send(作为请求主体发送的数据)，如不需要通过请求主体发送数据，则必须传入null
        xhr.send(null)

        // 4. 接收到响应后, 会自动填充XHR对象的属性
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) { // 请求成功
          // alert(xhr.responseText) // 显示响应数据
          console.log(xhr)
          console.log(xhr.responseText)
          console.log(typeof xhr.responseText) // string
          console.log(JSON.parse(xhr.responseText))
          // 和接口返回的一致：
          // {
          //   "Response": {
          //       "BizToken": "6EF19446-963B-43C5-AD11-40419DEE1600",
          //       "Url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2cca36a86d5035ae&redirect_uri=http%3A%2F%2Fopen.faceid.qq.com%2Fv1%2Fapi%2FgetCode%3FbizRedirect%3Dhttps%253A%252F%252Ffaceid.qq.com%252Fapi%252Fauth%252FgetOpenidAndSaveToken%253Ftoken%253D6EF19446-963B-43C5-AD11-40419DEE1600&response_type=code&scope=snsapi_base&state=&component_appid=wx9802ee81e68d6dee#wechat_redirect",
          //       "RequestId": "594aa2de-915b-48ac-a9b5-ac3ff2fe40c4"
          //   }
          // }
        } else { // 请求异常
          alert("Request was unsuccessful: " + xhr.status)
        }
      }
    </script>
  </body>
</html>
```
![xhr请求成功后print.png](/images/js/xhr请求成功后print.png)

上面的例子中，xhr.open 第三个参数是 false，是同步请求，会阻碍程序向下执行，一般实际开发中会使用异步的方式。如果是异步，我们通过 xhr 对象上触发的事件来处理异步请求的结果。异步请求时需要监听 xhr 的 readystatechange 事件，当 readyState 为 4 时，就表示请求完成
- xhr.readyState === 0 未初始化（Uninitialized），尚未调用 open()
- xhr.readyState === 1 已打开（Open），调用了 open()，但未调用 send()
- xhr.readyState === 2 已发送（Send），调用了 send()，但未接收到响应
- xhr.readyState === 3 接收中（Receiving），已经接收到部分响应数据
- xhr.readyState === 4 完成（Complete），已经接收到全部响应数据，请求已完成。

**在接收到响应之前，如果想取消异步请求，可以调用 xhr.abort() 方法来取消请求**
```js
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) { // 请求完成
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) { // 请求成功
      // alert(xhr.responseText) // 显示响应数据
      console.log(xhr)
    } else {
      alert("Request was unsuccessful: " + xhr.status)
    }
  }
};
xhr.open('get', "https://zuo11.com/getList", true); // 发送异步请求
xhr.send();
```
### 设置 HTTP 头部(xhr.setRequestHeader())
每个 HTTP 请求和响应都会带有相应的头部信息, 可以在 open 方法之后，send 方法之前调用 xhr.setRequestHeader()，设置对应的请求头。默认情况下 XHR 请求会发送以下头部字段
- `Accept` 浏览器能够处理的内容类型
- `Accept-Charset` 浏览器可以显示的字符集
- `Accept-Encoding` 浏览器可以处理的压缩编码类型
- `Accept-Language` 浏览器使用的语言
- `Connection` 浏览器与服务器的连接类型
- `Cookie` 页面中设置的 Cookie
- `Host` 发送请求页面所在的域
- `Referer` 发出请求页面的 URL，这个字段在 HTTP 规范中拼错了，考虑到兼容性，就将错就错，正确的拼写是 referrer
- `User-Agent` 浏览器用户代理字符串
- `Origin` 与 Host 类似，当前页面所在的域

在实际请求时，chrome 调试面板里 Request Headers (请求头)里，只有 Origin，Referer，User-Agent 信息，在 node 接收处理请求时，能看到请求头的更多信息：
```js
{ 
 host: 'localhost:8088', // 发出请求的页面所在的域
 connection: 'keep-alive', //浏览器与服务器之间的连接类型
 origin: 'http://127.0.0.1',
 'user-agent': // 浏览器的用户代理字符串
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
 accept: '*/*', // 浏览器能够处理的内容类型
 referer: 'http://127.0.0.1/json.html', // 发出请求页面的URI
 'accept-encoding': 'gzip, deflate, br', // 浏览器能够处理的压缩编码
 'accept-language': 'zh-CN,zh;q=0.9', // 浏览器当前设置的语言
 'if-none-match': 'W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"' 
}
```
实际还有 Cookie 当前页面设置的 cookie, 跨域请求时，需要设置 xhr.withCredentials = true; 服务器才会接收到 Cookie 请求头, 后台需要设置 res.header('Access-Control-Allow-Credentials', 'true'); 

**可以使用 xhr.getAllResponseHeaders() 获取所有响应头部信息，使用 xhr.getResponseHeader(prop) 获取属性名为 prop 的响应首部信息**

```js
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) { // 请求完成
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) { // 请求成功
      // alert(xhr.responseText) // 显示响应数据
      console.log(xhr);
      console.log(xhr.getAllResponseHeaders()); // 获取所有的响应头信息
      console.log(xhr.getResponseHeader("MyHeader")); // 获取某个响应头信息
    } else {
      alert("Request was unsuccessful: " + xhr.status)
    }
  }
};
xhr.open('get', "https://zuo11.com/getList", true); // 发送异步请求
xhr.setRequestHeader("myHeader", "Myvalue");
xhr.send();
```
### GET 请求
GET 请求如果想要向服务器发送某些信息，可以在 URL 后面添加查询字符串。注意需要使用 encodeURIComponent 对内容进行编码
```js
function addURLParam(url, key, value) {
  url += url.includes('?') ? "&": "?";
  url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
  return url;
}
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText);
    } else {
      alert('请求异常' + xhr.status + ',' + xhr.statusText);
    }
  }
};
let url = "http://127.0.0.1:8088";
url = addURLParam(url, 'num', 5);
url = addURLParam(url, 'start', 0);
xhr.open('get', url, true);
xhr.send(null);
```
### POST 请求
每个 POST 请求都需要在请求体中携带提交的数据。由于 XML 最初主要设计用于发送 XML，所以可以传入序列化之后的 XML DOM 文档作为请求体。也可以传入任意字符串。可以通过设置 Content-Type 请求头，指定发送数据的格式。
- `"application/json"` JSON 格式数据，如 '{ a: 1, b: 2}'
- `"application/x-www-form-urlencoded"` 序列化数据，如 'a=1&b=2'
- `"multipart/form-data"` 表单数据，如 FormData 类型，可以传文件二进制数据

```js
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText);
    } else {
      alert('请求异常' + xhr.status + ',' + xhr.statusText);
    }
  }
};
let url = "http://127.0.0.1:8088/getList";
xhr.open('post', url, true);

xhr.setRequestHeader("Content-Type", "application/json"); // 发送json数据
xhr.send('{"a": 1,"b": 2}'); // 发送json格式数据，要先转为JSON格式字符串

// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // 发送序列化数据
// // serialize(form) 序列化数据
// xhr.send("a=1&b=2"); 

// 以上两种方法，node express 均可用 req.body 获取对应的参数对象
```

:::tip
POST 请求比 GET 请求要占用更多资源。从性能方面说，发送相同数量的数据，GET 请求比 POST 请求要快两倍
:::

### XMLHttpRequest Level 2
XHR 对象作为事实标准迅速流行，促使 W3C 为规范这一行为而制定了正式标准。XMLHttpRequest Level 1 只是把已有的 XHR 对象实现细节描述了出来。而 XMLHttpRequest Level 2 又进一步发展了XHR，内容包括 FormData 类型，超时设定 timeout 等
#### FormData 类型
提交表单数据之前需要序列化表单数据，或者转成 JSON 格式数据。FormData 可以快速封装表单数据，方便提交。post 请求发送 FormData 数据时不需要设置请求头的 Content-type，系统如果识别到 FormData 数据类型会自动添加对应的请求头
```js
// formObj为表单对象
let data = new FormData(formObj);
data.append("a", "111111"); // 添加一个新元素
console.log(data);

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText);
    } else {
      alert('请求异常' + xhr.status + ',' + xhr.statusText);
    }
  }
};
let url = "http://127.0.0.1:8088/getList";
xhr.open('post', url, true);
xhr.send(data); // xhr 对象能识别传入的数据类型是 FormData 的实例，并配置适当的头部信息
// 默认配置的是 Content-Type: multipart/form-data; node bodyparse不能处理 multipart 数据，需要再用插件
```
#### 超时设定 IE8+
IE8 为 xhr 添加了 timeout 属性，毫秒。表示请求在等待多少毫秒后没有结束就会自动终止。如果超过该时间，会触发 xhr 的 timeout 事件，这个特性后来被添加到了 XMLHttpRequest Level 2 规范中。
```js
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    alert(xhr.responseText);
    } else {
    alert('请求异常' + xhr.status + ',' + xhr.statusText);
    }
  }
};
let url = "http://127.0.0.1:8088/getList";
xhr.open('get', url, true);
xhr.timeout = 2000;
xhr.ontimeout = function(event) {
  alert('请求超时')
}
xhr.send(null);
```
## 进度事件 load、process等
ProgressEvent 是 W3C 的工作草案，定义了客户端-服务器端通信。这些事件最初只针对 XHR，现在也推广到了其他类似的 API。有以下 6 个进度事件
- `loadstart` 在接收到服务器响应数据的第一个字节时触发
- `progress` 在接收到响应期间不断的触发
- `error` 在请求出错时触发
- `abort` 在因为调用 abort() 时触发
- `load` 在接收完整的数据响应时触发
- `loadend` 在通信完成或者触发 error、abort 或 load 事件后触发

每个请求都从触发 loadstart 事件开始，接下来是一个或多个 progress 事件，然后触发 error、abort 或 load 事件中的一个，最后触发 loaded 事件。

**load 事件**，load 事件完全可以代替 xhr.onreadystatechange 事件，改写后的请求示例如下
```js
let xhr = new XMLHttpRequest();
xhr.onload = function() {
  if (xhr.status === 200) { // 请求成功
    alert(xhr.responseText)
  } else {
    alert('请求异常', xhr.status)
  }
}
xhr.open('get', 'http://127.0.0.1:8088/getList', true);
xhr.send(null)
```
**progress 事件**，在文件下载，接收响应数据时 progress 事件可以获取数据接收进度，进度事件包含 3 个额外的属性
- `event.lengthComputable` 进度信息是否可用，如果是完整的文件信息就是 true, total 表示数据大小。如果响应数据时 stream 流式数据，则该值为 false, total 为 0。
- `event.position/loaded` 已接收的字节数，最新的是 loaded
- `event.totalSize/total` 表示根据 Content-Length 响应头确定的预期字节数 最新的属性是 total

```js
let xhr = new XMLHttpRequest();
xhr.onload = function() {
  if (xhr.status === 200) { // 请求成功
    alert(xhr.responseText)
  } else {
    alert('请求异常', xhr.status)
  }
}
xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    console.log("接收到: " + event.loaded + ", 总共: "+ event.total + 'bytes')
  }
}
xhr.open('get', 'http://127.0.0.1:8088/getList', true);
xhr.send(null)
```

## 跨域资源共享 CORS
通过 XHR 实现 Ajax 通信的一个主要限制，来源于跨域安全策略。默认情况下，XHR 对象只能访问与包含它的页面位于同一域中的资源。对于某些合理的跨域请求，需要允许。CORS(Cross-Origin Resource Sharing) 跨域资源共享就是为了解决这个问题的。

CORS 定义了必须访问跨域资源时，浏览器与服务器应该如何沟通。基本思想是：使用自定义的 HTTP 头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败。IE9+

一般请求头里会包含 Origin 字段，表示当前域。如果服务器认为这个请求可以接受，就在响应头的 Access-Control-Allow-Origin 字段中返回相同的信息，或者"*"，表示允许，比如：
- 请求头里的属性 Origin: http://127.0.0.1
- 响应头里的属性 Access-Control-Allow-Origin: http://127.0.0.1 或者 Access-Control-Allow-Origin: "*"   

如果响应头没有 Access-Control-Allow-Origin 属性，或者与请求头的 Origin 信息不匹配，浏览器就会驳回请求，如果相同，就会处理请求。注意跨域请求和响应都不包含cookie信息。

- IE 对 CORS 的实现 IE8 引入了 XDR(XDomainRequest) 类型，类似于 XHR 用于支持跨域通信，IE9+ 支持XHR CORS, 故暂不考虑对 XDR 的研究
- 跨域请求会有一些限制，比如不能使用 xhr.setRequestHeader() 设置自定义头部
- 不能发送和接收 cookie
- 调用 getAllResponseHeaders() 获取的信息会不完整

### 预检请求(Preflight)
为什么会有preflight预检请求？浏览器限制跨域有两种方式：

1. 浏览器限制发起跨域请求
2. 跨域请求可以正常发起，但返回的结果被浏览器拦截了

一般浏览器都是使用第二种方式限制跨域请求，跨域请求已经到达服务器，并可能对数据库里的数据进行了操作，但返回的结果被浏览器拦截了，对前端来讲这是一次失败的请求，但可能对数据库里的数据产生了影响

为了防止这种情况发生，对于可能对服务器数据产生副作用的 HTTP 请求方法，浏览器会先发起一个 OPTIONS 预检请求，从而获知服务器是否允许跨域请求：如果允许，就发送带真实的数据请求，如果不允许，则阻止带数据的真实请求。 

什么情况会发触发CORS预检请求? 
- 使用了 PUT、DELETE、CONNECT、OPTIONS、TRACE、PATCH 请求方法
- 人为设置了CORS安全的请求头之外的其他请求头，下面是安全的请求头列表
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type
  - DPR
  - Downlink
  - Save-Data
  - Viewport-Width
  - Width
  - Content-Type 值为 application/x-www-form-urlencoded、multipart/form-data、text/plain 
  
因此，仅设置 Access-Control-Allow-Origin 响应头，在发生跨域请求时，如果出现 OPTIONS 预检请求，就会发生错误，因此还需要设置以下响应头，跨域请求才能正常发送。

```js
res.header("Access-Control-Allow-Origin", "*"); // 设置响应头允许的域名，如果是* 表示所有
res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS'); // 允许的请求类型
res.header("Access-Control-Max-Age", "1728000"); // 应该将这个 Preflight 请求缓存多久(单位为妙)
res.header('Access-Control-Allow-Headers', 'Content-Type'); // 允许的头部
```

关于请求预检的更多信息参见：[CORS跨域资源共享 - 利用koa来彻底理解web前端跨域问题 - 左小白的技术日常](http://www.zuo11.com/blog/2020/6/koa_web_cros.html)
### 凭据请求 cookie
> credentials [krəˈdenʃlz] n. [管理] 证书；文凭；

带凭据的请求, 默认情况下跨域请求不提供凭据(cookie, HTTP 认证及客户端 SSL 证明等)。通过将 withCredentials 属性设置为 true，可以指定某个请求应该发送凭据。如果发送的是带凭据的请求，但服务器的响应中没有包含 `Access-Control-Allow-Credentials: true` 这个头部，那浏览器不会把响应交给 JS。
```js
// 客户端请求头
// xhr.withCredentials = true;

// 服务器端响应头
// res.header('Access-Control-Allow-Credentials', 'true'); 
```
## 其他跨域技术 (img和JSONP)
在 CORS 出现之前，可以使用非 xhr 的方式发送跨域请求，比如 img 图片探测（image pings），JSONP 等
### 图片探测
图片 img 标签，new Image(), img.src = "http://xxx.com/test?a=1&b=2" 发送get请求。只能发送get请求，无法访问服务器的响应数据，仅用于单向通信。可以用于跟踪用户行为(埋点)或动态显示广告。
### JSONP
JSONP，JSON with padding( 填充式JSON, 或参数式JSON)，客户端服务端都需要加上处理。
- 客户端使用 script 元素的 src 发送请求，且在 url 上添加处理响应的 callback 函数
- 响应数据使用 callback 指定的函数名 + 响应的数据，即可在前端执行 callback 函数，接收响应

JSOP 的缺点是如果是从不同域获取的结果，可能会返回恶意的执行代码。另外 JSONP 无法接收请求失败的信息，HTML5 标准中 script 的 error 事件没有浏览器实现。
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
<title>jsonp</title>
</head>
<body>
  <!-- 客户端代码 -->
  <input id="jsonpclick" type="button" value="jsonp test">
  <script>
    function handleRes(response) {
      console.log(response)
      // 这里可以接收到对应的数据
    }
    let jsonpclick = document.getElementById('jsonpclick');
    jsonpclick.onclick = function(){
      console.log('开始测试');
      let script = document.createElement('script');
      script.type="text/javascript" 
      script.src = "http://127.0.0.1:8088/gzh_test?callback=handleRes"
      document.body.insertBefore(script, document.body.firstChild)
    }

  </script>
</body>
</html>
```
jsonp node服务端代码
```js
function gzhM_test(app, data, req, res) {
    console.log('开始执行gzhm_test');
    console.log(req.query)
    if (req.query && req.query.callback) {
        //console.log(params.query.callback);
        let str =  req.query.callback + '(' + "a=2" + ')';//jsonp
        res.end(str);
    } else {
        res.end('b=2');//普通的json
    }
    return;
}
```

跨域的理解可以参考：[利用koa来彻底理解web前端跨域问题 - 左小白的技术日常](http://www.zuo11.com/blog/2020/6/koa_web_cros.html)

## Fetch API
Fetch API 能够执行 XMLHttpRequest 对象的所有任务，且更容易使用，接口更加现代化，能够在 Web Worker 里面使用。XMLHttpRequest 可以选择异步，而 Fetch API 必须是异步。

Fetch API 是 WHATWG 的一个 "活标准"（living standard）。"Fetch 标准定义请求、响应，以及绑定二者的流程：获取（fetch）"。在 Service worker 中，提供拦截、重定向和修改通过 fetch() 生成的请求接口。

### 基本用法
**1. 调用 `fetch(url, options)` 发送请求**，url 为请求的地址，如果 url 以 `/` 开头就是绝对路径，也可以使用相对路径。options 为发送请求时的可配置选项。该函数返回一个 resolve 为 Response 类型的 Promise 实例。

```js
let res = fetch('/test')
console.log(res) // Promise {<pending>}
setTimeout(() => {
  console.log(res) // Promise {<fulfilled>: Response}
}, 2000)
```
**2. 获取响应数据**，最简单的方式是使用 Response 的 text() 方法获取纯文本格式的响应数据。它返回一个 resolve 为 String 类型的 Promise
```html
<script>
  fetch('a.js').then(res => {
    console.log(res)
    res.text().then(cosnole.log)
  })
  // Response { 
  //   body: ReadableStream, 
  //   type: "basic", 
  //   headers: Headers {}, 
  //   status: 200, 
  //   url: "http://..."
  //   ...
  // }

  // 打印的 a.js 内容
  // const a = 1
  // console.log(a)
</script>
```
利用 Promise.then 的链式调用特性，可以改写上面的例子
```html
<script>
  fetch('a.js').then(res => {
    console.log(res)
    return res.text()
  }).then(data => console.log(data))

  // 更精简的写法
  // fetch('a.js').then(r => r.text()).then(console.log)
</script>
```
**3.http状态码与请求失败处理**，Response 对象的 status 和 statusText 属性分别表示 **状态码** 以及 **状态码说明**，他们的值可能是

status | statusText | ok | 是否是 resolve 状态
--- | --- | --- | ---
200 | "OK" | true | 是
404 | "Not Found" | false | 是
405 | "Method Not Allowed" | false | 是
500 | "Internal Server Error" | false | 是 

通常情况下，status 值为 `200 ~ 299` 时是请求 OK，`300 ~ 399` 表示重定向（redirected），500 表示服务器错误。
- **当服务器发生错误返回 500 时， fetch 的结果也是 resolve，只要服务器返回了结果，fetch 都会是 resolve 状态**
- **404 返回的也是 resolve 状态**
- 当发生跨域请求/接口服务停止时，状态为 rejected，错误信息为 Failed to fetch，错误类型为 TypeError。
- 浏览器超时时间很长，大于 3、4 分钟，需要自己写超时策略。

```html
<script>
  fetch('http://127.0.0.1:8088/user').then(res => {
    console.log(res)
    let { status, statusText, url } = res
    console.log(status, statusText, url)
    // url 为请求的 url, 比如 "http://127.0.0.1:8888/user"
  }).catch(err => {
    console.log(typeof err, err, err.message)
  })

  // 发生跨域请求时 catch 仅能捕获到 "TypeError: Failed to fetch" 错误信息 
  // GET http://127.0.0.1:8088/user net::ERR_CONNECTION_REFUSED
  // object
  // TypeError: Failed to fetch 
  // Failed to fetch 
</script>
```
**4. options 自定义请求选项**

key | value
--- | ---
body | 指定请求体内容，必须是 Blob、BufferSource、FormData、URLSearchParams、ReadableStream 或 String 实例
cache | 用于控制浏览器与 HTTP 缓存的交互。"no-store"、"reload"、"no-cahe" 等，默认为 "default"
credentials | 类似 xhr.widthCredentials，默认为 "same-origin" 仅同源是发送。"omit" 为不发送 cookie，"include" 总是包含 cookie
headers | 请求头部，必须是 Headers 对象或键值对常规对象
integrity | 用于强制资资源完整性，默认为空字符串
keepalive | 默认为 false，是否允许请求存在事件超出页面生命周期，比如页面 unload 之后的上报信息。可以用于替代 Navigator.sendBeacon()
method | HTTP 请求方式，默认为 "GET"，可以是 POST、PUT、PATCH、DELETE、HEAD、OPTIONS、CONNECT、TRACE
mode | 指定跨域请求是否可以发送成功，响应结果是否可读。通过构造函数手动创建 Request 实例时，默认为 "cors"（允许遵循 CORS 规则的跨域请求），否则为 "no-cors"（允许不需要发送预检请求的跨域请求，但无法读取响应内容，响应类型是 opaque）。"same-origin" 任何跨域请求都不同发送。"navigate" 用于支持 HTML 导航，只在文档导航时有用，基本用不到
redirect | 用于指定如何处理重定向（301 永久、302 临时、303、307、308）, 默认为 "follow"，跟踪重定向，以最终非重定向的 URL 作为最终响应。"error" 重定向请求直接抛出错误。"manual" 不跟踪重定向，返回 opaqueredirect 类型的响应，允许手动方式跟踪重定向。 opaque `[ə(ʊ)ˈpeɪk]` 不透明的
referrer | 用于指定 HTTP 的 Referer(推荐人上线人,来历) 头部。默认为 "client/about:client"，以当前 URL 或 "no-referrer" 作为值， "no-referrer" 以 no-referrer 为值。'url值', 以伪造 URL 为值，伪造 URL 的源必须与执行脚本的源匹配
referrerPolicy | Policy `[ˈpɒləsi]` 政策、方针。指定 HTTP 的 Referrer 头部，详情参考 p728
signal | 用于 abort 终止请求。默认为 AbortSignal 实例

### 常见 Fetch 请求模式
**1.发送 JSON 数据的 POST 请求**
```js
fetch('/user', {
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    name: "张三"
  })
})
.then(res => console.log(res))
.catch(console.log)
``` 
**2.发送序列化数据**
```js
fetch('/user', {
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }),
  body: 'a=1&b=jack'
})
.then(res => console.log(res))
.catch(console.log)
```
**3.上传文件**，文件数据需要使用 FormData 类型。和 xhr 类似，当发送的数据是 FormData 时，不用自己设置 Content-Type，会自动识别
```html
<!-- <input type="file" id="file"> -->
<input type="file" id="file" multiple>
<script>
  let fileInput = document.getElementById('file')
 
  fileInput.onchange = (event) => {
    let formData = new FormData()
    // 多个文件上传：使用同一个字段上传
    console.log(event.target.files) // FileList 类数组对象
    let files = event.target.files
    for (let i = 0, len = files.length; i < len; i++) {
      formData.append('image', files[i])
    }
    // 单文件上传
    // formData.append('image', files[0])
    formData.append('param1', 'abc')
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(console.log)
    .catch(console.log)
    //  { param1: 'abc' }
  }
</script>
```
koa 处理文件上传可以使用 multer 组件，相关接口 demo 参见： [koa 处理文件上传 /upload 接口 demo | Github](https://github.com/zuoxiaobai/fedemo/blob/master/src/JS_ES6/JS%E9%AB%98%E7%A8%8B3/fetch/app.js)

**4.加载 Blob 文件**，包括加载静态数据或者从接口获取文件数据
```html
<script>
  fetch('warning.png')
    .then(res => res.blob())
    .then(blob => {
      console.log(blob)
      let img = new Image()
      img.src = URL.createObjectURL(blob)
      document.body.appendChild(img)
    })

  fetch('/download')
    .then(res => {
      if (res.status === 200 || res.status === 304) {
        return res.blob()
      } else {
        return Promise.reject('/download error')
      }
    })
    .then(blob => {
      // console.log(blob) // Blob {size: 64082, type: "application/octet-stream"}

      // 如果接口通过响应头设置了响应的文件类型，文件名，就不用 new Blob 再转一次了
      //  ctx.set({
      //   'Content-Type': 'image/png',
      //   'Content-Disposition': `attachment; filename="warning.png"`
      // })
      blob = new Blob([blob], {
        type: "image/png"
      })
      console.log(blob) // Blob {size: 64082, type: "image/png" }
      let a = document.createElement('a')
      let url = URL.createObjectURL(blob)
      a.href = url
      a.download = '123.png' // 指定文件名
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
    .catch(console.log)
</script>
```
参考：[下载文件进度显示以及koa下载接口mock - 左小白的技术日常](http://www.zuo11.com/blog/2019/10/http_download_progress.html)

**5.发送跨域请求**
```html
<script>
  fetch('http://127.0.0.1:8888/corsTest', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      name: "张三"
    }),
    // mode: 'no-cors' 
    // 允许跨域, 可以成功，但无法读响应内容 Response {type: "opaque", url: "", } 
  })
  .then(res => console.log(res)) // Response {type: "cors", url: "http://127.0.0.1:8888/corsTest" }
  .catch(console.log)

  // Access to fetch at 'http://127.0.0.1:8888/corsTest' from origin 'http://127.0.0.1:5502' 
  // has been blocked by CORS policy: Response to preflight request 
  // doesn't pass access control check: No 'Access-Control-Allow-Origin' 
  // header is present on the requested resource. If an opaque response 
  // serves your needs, set the request's mode to 
  // 'no-cors' to fetch the resource with CORS disabled.
</script>
```
后端允许跨域代码，更多跨域详情，参考 [利用koa来彻底理解web前端跨域问题 | 左小白的技术日常](http://www.zuo11.com/blog/2020/6/koa_web_cros.html)
```js
// options 预检请求时允许
router.options('/corsTest', ctx => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
  })
  ctx.body = {}
})

// 真实请求
router.post('/corsTest', ctx => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
  })
  ctx.body = { a: 123 }
})
```

**6.中断请求**
```html
<script>
  let abortControler = new AbortController() 
  console.log(abortControler, abortControler.signal)
  // AbortController {signal: AbortSignal}
  // AbortSignal {aborted: false, onabort: null }
  fetch('/abortTest', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      name: "张三"
    }),
    signal: abortControler.signal
  })
  .then(res => console.log(res))
  .catch(console.log) 
  // 中断请求时 DOMException: The user aborted a request.

  // 2 秒后中断请求
  setTimeout(() => abortControler.abort(), 2000)
</script>
```
后端接口
```js
router.post('/abortTest', async ctx => {
  let sleep = (t) => new Promise(r => setTimeout(() => r(), t))
  await sleep(60 * 1000)
  ctx.body = { a: 1}
})
```
### Headers 对象
请求头部（Request Headers）和响应头部（Response Headers）都是 Headers 对象，类似 Map 类型。支持如下方法：has()、append()、delete()、get()、set()、forEach()、keys()、values()、entries()。使用方法如下
```js
<script>
  fetch('/user', {
    method: 'POST',
    // 请求头
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      name: "张三"
    })
  })
  .then(res => {
    console.log(res.headers) // Headers {} 
    console.log(Object.fromEntries(res.headers.entries()))
    // {
    //   connection: "keep-alive"
    //   content-length: "7"
    //   content-type: "application/json; charset=utf-8"
    //   date: "Sat, 12 Dec 2020 17:03:31 GMT"
    // }
    console.log(res.headers.get('content-type')) 
    // application/json; charset=utf-8
    console.log(res)
  })
  .catch(console.log)
</script>
```
**注意：有些安全的请求头有些是不能修改的**，参考：
- [Forbidden header name | MDN](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name)
- [前端ajax请求时，设置Cookie请求头无效 - 左小白的技术日常](http://www.zuo11.com/blog/2019/10/http_request_header.html)
- [CORS-safelisted request header | MDN](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header)
- [Forbidden response header name | MDN](https://developer.mozilla.org/zh-CN/docs/glossary/forbidden_response_header_name)

### Request 对象
资源请求信息对象使用 Request 对象来表示，相关 API 如下
- `new Request(url[, options])` 创建 Request对象，和 fetch 的参数类似，但不会发送请求。
- `new Request(Request 实例[, options])` 拷贝 Request 实例，并不是完全相同，bodyUsed 属性可能不会完全一致
- `Request实例.clone()` 拷贝 Request 实例，会创建一个一模一样的副本
- `Request实例.text()` 设置 bodyUsed 为 true，这个属性为 true 后，clone() 会出错
- `fetch(Request实例, options)` 在 fetch() 中使用 Reqeust 对象，如果调用了 Request.text() 后
, bodyUsed 为 true，则会抛出异常

```js
new Request('/test')
// Request {
//   bodyUsed: false
//   cache: "default"
//   credentials: "same-origin"
//   destination: "empty"
//   headers: Headers {}
//   integrity: ""
//   isHistoryNavigation: false
//   keepalive: false
//   method: "GET"
//   mode: "cors"
//   redirect: "follow"
//   referrer: "about:client"
//   referrerPolicy: ""
//   signal: AbortSignal {aborted: false, onabort: null}
//   url: "http://127.0.0.1:8080/test"
//   __proto__: Request
// }

// 如果传入了 options 会修改默认的值
new Request('/test', {
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/json'
  }),
  body: '123'
})
```
### Response 对象
Response 对象是响应信息的对象，也可以使用 new 来创建，不过一般是用来接收响应数据，不会去新建。相关 API 如下
- `new Response(可选的响应数据)` 可选的响应数据参数等价于 request 中的 body 参数
- `Response.redirect(url, status)` 返回重定向 Response 对象，headers 包含 location 指向重定向地址。status必须是重定向 code，否则会报错
- `Response.error()` 用于产生表示网络错误的 Response 对象
- `Response实例.clone()` 创建 Response 对象的副本，如果使用 Response实例.text() 设置 bodyUsed 为 true 后，就无法 clone() 了。 向 text() 方法读取了 body 可读流，下一次调用 text() 或报错，使用 clone() 创建副本再读取响应内容，不会影响原 Response 的读取状态。详情参：p739
```js
new Response()
// Response {
//   body: null
//   bodyUsed: false
//   headers: Headers {}
//   ok: true
//   redirected: false
//   status: 200
//   statusText: ""
//   type: "default"
//   url: ""
//   __proto__: Response
// }

// 设置响应数据
new Response({data: 1})
Response {
  // body: ReadableStream
  // ...
}

Response.redirect('/test', 301) 
// Response {
//   body: null
//   bodyUsed: false
//   headers: Headers {} // {location: "http://127.0.0.1:8080/test"}
//   ok: false
//   redirected: false
//   status: 301
//   statusText: ""
//   type: "default"
//   url: ""
//   __proto__: Response
// }
let headers = Response.redirect('/test', 301).headers
Object.fromEntries(headers.entries())
// {location: "http://127.0.0.1:8080/test"}
```

关于 Response 中各字段细节，参考 p738

### Request、Response 及 Body 混入
响应的数据一般放在 Response.body 中，属于流数据，类型是可读流 ReadableStream。需要注意的是 Request 对象如果传入了 body 数据属性，那么 Request 对象上也会包含对应的 ReadableStream。

为了方便操作接口响应的可读流数据，Fetch API 在 Body 上定义了 5 个方法：text()、json()、formData()、arrayBuffer()、blob()，用于读取可读流 ReadableStream 的数据，并转换为 JS 对象类型。这些方法都在 Response、Request 对象上进行了混入（mixin），可以直接使用。他们都返回一个 resolve 为相应数据类型的 Pormise。

- `text()` 读取 ReadableStream，将数据转换为 UTF-8 格式字符串
- `json()` 读取 ReadableStream，将数据转换为 JSON 对象
- `formData()` 读取 ReadableStream，将数据转换为 FormData 类型，支持以下方法 append()、get()、set()、getAll()、has()、delete()、forEach()、keys()、values()、entries()。主要与 service workers 有关. 如果客户端提交的一个表单请求被 Service Worker 所截取，您可以像下述的样例一样，调用 formData() 方法来获取一个key-value 字典, 对该字典可以进行修饰, 然后将修饰后的表填提交给远端服务器 (或在本地应用)。参考：[Body.formData() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Body/formData)
- `arrayBuffer()` 读取 ReadableStream，将数据转换为 ArrayBuffer，使用 teypedArray 可以很方便的读取数据。
- `blob()` 读取 ReadableStream，将数据转换为 Blob 实例

**注意：使用上面的函数读取 ReadableStream 后，对应的 bodyUsed 会被设置为 true，这个时候如果再次调用该函数去读取 ReadableStream 流，会返回 body stream is locked 的错误**

```html
<script>
  // text()
  fetch('/user')
    .then(res => res.text())
    .then(data => {
      console.log(typeof data) // "string"
      console.log(data) // '{"name":"zuo"}'
    })

  // json()
  fetch('/user')
    .then(res => res.json())
    .then(data => {
      console.log(typeof data) // "object"
      console.log(data) // { name: "zuo" }
    })

  // formData()
  // 请求时无法模拟，一般在 service worker 中使用
  fetch('/user')
    .then(res => res.formData())
    .then(data => {
      console.log(typeof data)
      console.log(data)
    })
    // Uncaught (in promise) TypeError: Failed to fetch
  // 使用 request 来测试
  let formData = new FormData()
  formData.append('name', 'zuo')
  let request = new Request('/test', { 
    method: 'POST', 
    body: formData
  })
  request.formData().then(data => {
    console.log(typeof data) // object
    console.log(data) // FormData {}
  })

  // arrayBuffer
  fetch('/user')
    .then(res => res.arrayBuffer())
    .then(data => {
      console.log(typeof data) // "object"
      console.log(data) // ArrayBuffer(14) {}
      let str = ''
      new Uint8Array(data).forEach(code => {
        str += String.fromCharCode(code)
      })
      console.log(str) // '{"name":"zuo"}'
    })

  // blob()
  fetch('/user')
    .then(res => res.blob())
    .then(data => {
      console.log(typeof data) // "object"
      console.log(data) 
      // Blob {size: 14, type: "application/json"}

      // 读取 Blob 文件数据
      let reader = new FileReader()
      reader.readAsText(data)
      reader.onload = (event) => {
        console.log(reader.result) // '{"name":"zuo"}'
      }
    })

    // 重复读取流
    fetch('/user')
      .then(res => res.blob().then(() => res.blob()))
    // Uncaught (in promise) TypeError: 
    // Failed to execute 'blob' on 'Response': body stream already read
</script>
```

### 直接操作可读流 ReadableStream
这里需要复习下第 20 章 Streams API 的内容：[Streams API - 20. JavaScript API](http://fe.zuo11.com/js/ad3/js-ad3-20.html#streams-api)

```html
<script>
  fetch('https://fetch.spec.whatwg.org/')
    .then(res => res.body)
    .then(async body => {
      let reader = body.getReader()
      while(1) {
        let { value, done } = await reader.read()
        if (done) {
          break;
        } else {
          console.log(value)
        }
      }
    })
  // Uint8Array(65536)
  // ....
  // Uint8Array(100395)
  // Uint8Array(33171)
  // Uint8Array(80674)
</script>
```
使用异步迭代重构
```html
<script>
  fetch('https://fetch.spec.whatwg.org/')
    .then(res => res.body)
    .then(async body => {
      let reader = body.getReader()
      let iterator = {
        [Symbol.asyncIterator]() {
          return {
            next() {
              return reader.read()
            }
          }
        }
      }
      for await (chunk of iterator) {
        console.log(chunk) // 加了 await 会较慢，但顺序是正确的
      }
    })
  // Uint8Array(65536)
  // ....
</script>
```
进一步优化
```html
<script>
  async function * streamGenerator(body) {
    const reader = body.getReader()
    try {
      while(1) {
        let { value, done } = await reader.read()
        if (done) {
          break;
        } 
        yield value
      }
    } finally {
      reader.releaseLock()
    }
  }
  fetch('https://fetch.spec.whatwg.org/')
    .then(res => res.body)
    .then(async body => {
      for await (chunk of streamGenerator(body)) {
        console.log(chunk) // 加了 await 会较慢，但顺序是正确的
      }
    })
</script>
```
将读取的 typedArray 数据解码为字符串，这样就相当于简单实现了 text() 的功能
```html
<script>
  // streamGenerator 参见上面的例子
  fetch('https://fetch.spec.whatwg.org/')
    .then(res => res.body)
    .then(async body => {
      for await (chunk of streamGenerator(body)) {
        // console.log(chunk) // 加了 await 会较慢，但顺序是正确的
        console.log(new TextDecoder().decode(chunk, {
          stream: true
        }))
      }
    })
  // <!doctype html><html lang="en">
  //  <head>
  //   <meta charset="utf-8">
  //   <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport">
  //   <meta content="#3c790a" name="theme-color">
  //   <title>Fetch Standard</title>
</script>
```
可以使用 ReadableStream 创建 Response 对象，可以将可读流数据读出来后存到另一个 可读流的 Response 中，可以用于过滤数据
```js
fetch('https://fetch.spec.whatwg.org/')
  .then((response) => response.body)
  .then((body) => {
    const reader = body.getReader();

    // create secondary stream
    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { value, done } = await reader.read();

            if (done) {
              break;
            }

            // Push the body stream's chunk onto the secondary stream
            controller.enqueue(value);
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      }
    })
  })
  .then((secondaryStream) => new Response(secondaryStream))
  .then(response => response.text())
  .then(console.log); 

// <!doctype html><html lang="en"><head><meta charset="utf-8"> ... 
```
## Beacon API
当页面 unload 卸载时，如果要在这个事件中添加埋点上报信息。这种情况页面都卸载了，请求相关异步操作都会被浏览器取消。 异步的 xhr 和 fetch 不适合在这种情况发送请求。为了解决这个问题，W3C 引入了 Beacon API `[ˈbiːkən]` 灯塔，信号浮标；烽火；指路明灯。
- `navigator.sendBeacon(url, payload)` 向 url 发送 'POST' 请求，数据为 payload。Content-Type 为字符串 "text/plain;charset=UTF-8"，`[pleɪn]`

```js
<script>
  navigator.sendBeacon('/user', `{ page: '/xxx', duration: '12s' }`)
</script>
```

koa 解析 'text/plain' 类型的 POST 数据，参考：
```js
app.use(require('koa-bodyparser')({
  enableTypes: ['json', 'form', 'text']
}))
router.post('/user', async ctx => {
  console.log(ctx.request.body) 
  // { page: '/xxx', duration: '12s' } 
  ctx.body = {
    a: 1
  }
})
```
navigator.sendBeacon() 有点像 POST 请求的语法糖，它有下面几个重要特性
- sendBeacon() 可以保证在原始页面已经关闭的情况下也会发送请求，该请求任意时间都可以使用。
- sendBeacon() 无法以编程方式处理响应数据
- 该请求会携带相关 cookie

## Web Socket
普通的 http 请求中，服务端无法主动向客户端发送消息。Web Socket（套接字）支持客户端与服务端全双工、双向通信。在 JS 中创建 WebSocket 时，会先发送一个 HTTP 请求用来初始化连接，socket 服务器接收到请求后，使用 Upgrade 响应头，将 HTTP 协议切换到 WebSocket 协议。后面发送、接收信息就都使用该连接了。socket 服务 url 不再是 `http://` 或 `https://`，而是 `ws://` 或 `wss://`。目的是更快的发送小数据块，不会对 HTTP 照成任何负担。需要专用的服务器，速度更快。

![socket_con_1.png](/images/js/socket_con_1.png)

前端创建一个 Web Sockert 可以使用 WebSocket 构造函数，参数为 socket 服务 URL，不受跨域限制。在创建 WebSocket 实例之后会立即创建连接。WebSocket 实例支持如下属性、方法、事件：
- `readyState 属性` 表示 socket 连接状态
  - WebSocket.OPENING（0）连接正在建立
  - WebSocket.OPEN（1）连接已经建立
  - WebSocket.CLOSING（2）连接正在关闭
  - WebSocket.CLOSE（3）连接已经关闭
- `binaryType 属性` message 事件后接收到的数据类型，可能是 "blob" 或 "arraybuffer"
- `bufferedAmount 属性` 在发送大量数据到服务端时，由于网络的原因，send 的数据不会立即全部到达服务端，而是依次进入队列再发送。bufferedAmount 表示已进度队列但尚未发送到服务器的字节数
- `protocol 属性` new WebSocket 时可以指定一组客户端支持的协议，让服务器选择使用哪一种，protocol 字段就是服务端使用的协议名。默认为空字符串 ""
- `send() 方法`，向服务端发送数据，数据可以是字符串、ArrayBuffer、Blob
- `close() 方法`，关闭 socket 连接，调用后 readyState 立即变为 2，并会在关闭后变为 3
- `open 事件` 在连接成功时触发
- `message 事件` 接收到服务器发送的消息时触发，通过 event.data 访问
- `error 事件` 在发生错误时触发，连接无法续存
- `close() 事件` 在连接关闭时触发，通过参数可以指定关闭类型

下面来看一个例子
```js
// 创建一个 socket 连接
let socket = new WebSocket("ws://127.0.0.1:3000/socket.io/")

// socket 连接成功
socket.onopen = () => {
  console.log('socket 已连接')
  // 发送字符串数据
  socket.send('Hello Socket')
  // 发送 ArrayBuffer 数据
  socket.send(Uint8Array.from(['f', 'o', 'o']).buffer)
  // 发送 Blob 数据
  socket.send(new Blob(['f', 'o', 'o']))
}

socket.onmessage = (event) => {
  let data = { event }
  console.log('接收到数据', data) 
}

socket.onerror = (err) => {
  console.log('socket 连接发生错误', err)
}

socket.onclose = () => {
  console.log('socket 连接已关闭')
}
```

下面是使用 socket.io 的 demo。前端、Node.js 端都需要引入 socket.io

前端 vue.html
```html
<script src="https://cdn.bootcss.com/socket.io/2.3.0/socket.io.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<body>
  <div id="app">
    <div>
      <input type="text" v-model="message">
      <input type="button" value="发送" @click="send">
      <!-- <input type="button" value="清除" @click="clear"> -->
    </div>
    <div>
      <ul>
        <li v-for="item in msgList">{{ item }}</li>
      </ul>
    </div>
  </div>
  <script>
    let vm = new Vue({
      el: '#app',
      data: {
        message: '',
        msgList: [],
      },
      mounted() {
        this.socket = io()
        this.socket.on('chat message', (msg) => {
          console.log(msg)
          console.log(this.socket)
          this.msgList.push(msg)
        })
        this.socket.on('connect', function(data){
          console.log("Socket.io connected...");
        });

        this.socket.on('time', function (data) {
            console.log(data);
        });
        this.socket.on('error', function (data) {
            console.log(data);
        });
      },
      beforeDestroy() {
        this.socket.close()
      },
      methods: {
        async send() {
          try {
            const msg = this.message
            console.log('send msg', msg)
            this.socket.emit('chat message', msg)
            this.message = ''
          } catch(e) {
            console.log(e)
          }
        }
      }
    })
  </script>
</body>
```
服务端 app.js，注意服务端 socket.io 版本最好与客户端保持一致
```js
const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

app.use(require('koa-static')(__dirname + '/public'))

let users = []

io.on('connection', (socket) => {
  console.log('a user connect')
  console.log(socket.id) // 每个链接都是一个新的连接
  users.push(socket.id)
  console.log('在线人数', users.length)

  // 接收到消息
  socket.on('chat message', (msg) => {
    console.log('chat msg', socket.id + ': ' + msg)
    // 广播给所有人
    io.emit('chat message', socket.id + ': ' + msg)
    // 广播给除了发送者的所有人
    // socket.broadcast.emit('chat message', socket.id + ': ' + msg)
  })
  // 如果有连接离线
  socket.on('disconnect', () => {
    console.log(socket.id + '已离线')
    users.splice(users.indexOf(socket.id), 1)
    console.log('在线人数', users.length)
  })
})

server.listen(3000, () => console.log('服务开启成功，3000端口'))
```

Chrome NetWork 面板中 Socket 数据如下图

![socket_con_2.png](/images/js/socket_con_2.png)

完成 demo 代码参见：[soket.io 前端后测试 demo - Github](https://github.com/zuoxiaobai/fedemo/blob/master/src/JS_ES6/JS%E9%AB%98%E7%A8%8B3/socket/)

更多详情参考：
- 《HTML5 WebSocket 权威指南》
- [socket.io-client 前端源码 - Github](https://github.com/socketio/socket.io-client)
- [socket.io - 服务端源码 - Github](https://github.com/socketio/socket.io#readme)

## 安全
在 Web 中需要考虑的安全问题非常多，这里只是简单的提一下。对于常规的 Get 请求，比如接口地址为 `/user?id=12`，如果更换 id 为其他数字，比如 25、26 时需要校验是否用对于的访问权限，现在一般使用 token 的方式验证。

在未经授权可以访问某个资源时，可以将其视为 **跨站点请求伪造（CSRF，cross-site request forgery `['fɔ:dʒəri]`）攻击**。

一些建议：
- 接口使用 SSL 证书，支持 https
- 每个请求都发送一个按约定算法计算好的令牌（token）

注意，以下手段对防止 CSRF 攻击是无效的 
- 使用 POST 而非 GET
- 使用来源的 URL 验证来源，来源 URL 很容易伪造，referer
- 基于 cookie 验证，cookie 容易伪造