# 25. 客户端存储

## 数据缓存
> cookie和Storage可以用于存储客户端用户数据，可以用于同域下不同tab页面之间的通信。
### Http Cookie(cookie)
HTTP Cookie，通常直接叫做cookie，最初是在客户端用于存储会话信息的。该标准要求服务器对任意HTTP请求发送Set-Cookie HTTP头作为响应的一部分，其中包含会话信息。服务器响应头可能如下，设置了一个以name为名称、value为值的一个cookie，浏览器会存储这样的会话新，并在之后，通过为每个请求添加Cookie HTTP头将信息发送回服务器。
```
// 服务器响应头
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value
Other-header: other-header-value

// 请求信息
GET /index.html HTTP/1.1
Cookie: name=value
Other-header: other-header-value
```
- cookie 限制
```js
// 1. cookie绑定在特定的域名下，其他域是无法访问
// 2. Firefox 限制每个域最多50个cookie，Opera限制每个域最多30个cookie，Safari和chrome没有这方面的限制，不要超过限制，否则之前的cookie可能会被删除。
// 3. 一般大小限制为4kb, 这个限制是所有cookie，不是针对单个cookie的限制
```

- cookie构成 (域、路径、失效时间和secure标志都是服务器给浏览器的指示，以指定前端发送请求时何时发送cookie。这些参数并不会作为发送到服务器的cookie信息的一部分，只有name和value才能被发送)
```js
// 1.**名称** 不区分大小写，myCookie和MyCookie被认同是同一个cookie。名称尽量特殊点，防止其他子域设置了相同的cookie，导致异常，名称必须被URL编码
// 2.**值** cookie名称对应的值，值必须被URL编码
// 3.**域** cookie在哪个域是有效的，
// 4.**路径** 对于指定域中的路径，应该向服务器发送cookie、可以指定cookie只从xx.com/books/中才能访问，那么 xx.com的页面就不会发送cookie信息，即使请求都是来自同一个域
// 5.**失效时间** expires(HTTP/1.0)、max-age(Http/1.1) 如果不设置，浏览器会话结束即删除所有cookie，也可以自己设置删除事件。expires值为GMT格式的日期，如果设置为以前的时间，会立即删除，max-age为有效期，单位秒。expires和max-age: https://blog.csdn.net/yingzizizizizizzz/article/details/81347719
// 6.**安全标志** secure 指定后只有使用SSL连接的时候才会发送到服务器 
// 7.**HttpOnly** 为了帮助缓解跨站点脚本（XSS）攻击，JavaScript的Document.cookie API无法访问HttpOnly cookie; 它们只被发送到服务器。 例如，持久化服务器端会话的cookie不需要可用于JavaScript，并且应设置HttpOnly标志。
```
每一段信息都作为Set-Cookie头的一部分，使用分号加空格分隔每一段, 响应头示例:
```
// 对所有 wrox.com域名及子域名下(/)，所有页面都有效的cookie，且只能通过SSL连接才能传输
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; domain=.wrox.com; path=/; secure
Other-header: other-header-value

// 指定了名为name的cookie，他会在2019/08/21 09:46:24失效，同时对于wwwx.wrox.com和wrox.com的任何子域都有效
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Wed, 21 Aug 2019 09:46:24 GMT; domain=.wrox.com;
Other-header: other-header-value

// 关于GMT时间 没有加时区，一般new Date() 默认加了时区
// (new Date()).toGMTString()
// "Wed, 21 Aug 2019 09:46:24 GMT"
```

- JS中的cookie，通过BOM的document.cookie属性可以获取，除非设置了HttpOnly，才无法访问
```
// js获取cookie，document.cookie, 名字和值都是通过URL编码的，必须使用decodeURIComponent()来解码
name1=value1;name2=value2;name3=value3

// 设置cookie格式如下，并不会覆盖原有的cookie，除非设置的cookie名称已存在
document.cookie = "name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure"
// 除了name、value其他值为可选，且都需要用URL编码
document.cookie = encodeURLComponent("name") + '=' + encodeURIComponent("guoqzuo")
```
cookie操作函数封装
```js
var CookieUtil = {

  // 获取cookie值
  get: function (name) {
    var cookieName = encodeURIComponent(name) + '=';
    var startIndex = document.cookie.indexOf(cookieName);
    var cookieVal = null;

    // 如果存在该cookie
    if (startIndex !== -1) {
      var endIndex = document.cookie.indexOf(';', startIndex);

      if (endIndex === -1) { // 如果找不到，就是字符串末尾
        endIndex = document.cookie.length;
      }

      cookieVal = decodeURIComponent(document.cookie.substring(startIndex + cookieName.length, endIndex));
    }

    return cookieVal;
  },

  // 设置cookie
  // options: { expires, maxAge, path, domain, secure, httpOnly}
  set: function (name, value, options) {
    var tempVal = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    if (options.expires instanceof Date) {
      tempVal += "; expires=" + options.expires.toGMTString();
    }

    if (options.maxAge && typeof options.maxAge === 'number') {
      tempVal += '; max-age=' + options.maxAge;
    }

    if (options.path) {
      tempVal += '; path=' + options.path
    }

    if (options.domain) {
      tempVal += '; domain=' + options.domain
    }

    if (options.secure) {
      tempVal += '; secure';
    }

    if (options.HttpOnly) {
      tempVal += '; HttpOnly';
    }

    document.cookie = tempVal
  },

  // 删除cookie
  // options { path, domain, secure, ... }
  unset: function (name, options) {
    if (typeof options === 'object') {
      options.expires = new Date(0);
    } else {
      options = {expires: new Date(0)}
    }
    this.set(name, "", options);
  }
};
```
- 子cookie，为了绕开浏览器单域名下的cookie数限制，使用一个cookie值，来存储键值对。

### web存储机制(Web Storage)
Web Storage的目的是克服cookie的限制，当数据需要严格控制在客户端时，无需持续的将数据发回服务器，IE8+支持, Web Storage的两个主要目标是:
- 提供了一种cookie之外存储会话数据的途径
- 提供了一种存储大量可以跨会话存在的数据机制
#### Storage类型
Storage类型（localStorage、sessionStorage）提供最大的存储空间来存储键值对数据。Storage类型只能存储字符串，非字符串存储前需要转换为字符串。Storage实例与其对象有如下方法:
```
setItem(name, value) // 设置键值对
getItem(name) // 根据指定的名字name获取对应的值，如果没值返回null
removeItem(name) // 删除指定name的值。
clear() // 删除所有值
key(index) // 获取index位置处的key的名称, 可以用来遍历值
lenth // 获取键值对数量
.name // 点语法支持，设置或获取值
```
#### sessionStorage
sessionStorage数据浏览器关闭后，会消失。主要用于仅针对会话的小段数据存储。2.5M - 5M
```
// MDN
sessionStorage maintains a separate storage area for each given origin that's available for the duration of the page session (as long as the browser is open, including page reloads and restores)
- Stores data only for a session, meaning that the data is stored until the browser (or tab) is closed.
- Data is never transferred to the server.
- Storage limit is larger than a cookie (at most 5MB).
```
#### localStorage
修订过的HTML5规范中，localStorage取代globalStorage，作为持久保存客户端的数据的方案。**要访问同一个localStorage对象，页面必须来自同一个域名(子域名无效)。使用同一种协议，同一个端口**， 2.5M - 5M
```
// MDN
localStorage does the same thing, but persists even when the browser is closed and reopened.
- Stores data with no expiration date, and gets cleared only through JavaScript, or clearing the Browser cache / Locally Stored Data.
- Storage limit is the maximum amongst the three.
```

#### storage事件
```js
// 单个页面里面storage事件不会触发，需要由其他tab页面触发, 触发的条件：
// - 同一浏览器打开了两个同源页面
// - 其中一个页面修改了localStorage或sessionStorage
// - 另一个网页注册了这个事件
// 参考资料: Storage事件无法触发解决(https://blog.csdn.net/jlin991/article/details/55855524)
window.addEventListener('storage', function (event) {
  console.log('storage chage');
  console.log(event);
}, false);
```

### IndexedDB
IndexedDB是一种低级API，用于存储大量结构化数据（包括文件/ blob）的客户端。 此API使用索引来启用对此数据的高性能搜索。 虽然Web存储对于存储较少量的数据很有用，但对于存储大量结构化数据却没那么有用，待后续用到时研究。
https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

