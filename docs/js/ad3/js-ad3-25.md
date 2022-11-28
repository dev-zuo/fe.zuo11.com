---
title: 25. 客户端存储 - JS高程4
description: HTTP 是一种基于请求-响应的无状态协议，无法保存数据信息，刷新页面后数据就重置了。在客户端存储用户信息的需求是比较常见的，对该问题的第一个解决方法就是 cookie。cookie 由网景公司发明，由 Persistent Client State - HTTP Cookies 规范定义。除了 cookie 外，客户端存储还可以使用 Web Storage，IndexedDB 等。可以用于同域下不同 TAB 页面之间的通信。
keywords: cookie,web storage,indexedDB
---

# 25. 客户端存储

HTTP 是一种基于请求-响应的无状态协议，无法保存数据信息，刷新页面后数据就重置了。在客户端存储用户信息的需求是比较常见的，对该问题的第一个解决方法就是 cookie。cookie 由网景公司发明，由 `Persistent Client State: HTTP Cookies` 规范定义。除了 cookie 外，客户端存储还可以使用 Web Storage，IndexedDB 等。可以用于同域下不同 TAB 页面之间的通信。
## Http Cookie(cookie)
HTTP Cookie，通常直接叫做 cookie，最初用于在客户端存储会话信息。该规范要求 **服务器在响应 HTTP 请求时，在 Set-Cookie 响应头中包含会话信息**，服务器响应头可能如下
```js
// 服务器响应头
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value
Other-header: other-header-value
```
上面的服务器响应头中设置了一个以 name 为名称、value 为值的一个 cookie，**浏览器会存储这样的会话信息，并在之后，通过为每个请求添加 Cookie 请求头将信息发送回服务器。**
```js
// 之后的请求信息
GET /index.html HTTP/1.1
Cookie: name=value
Other-header: other-header-value
```
这些发送回服务器的额外信息，可以用于唯一标识发送请求的客户端
### cookie 限制
- cookie 绑定在特定的域名下，其他域是无法访问，**设置 cookie 后，它会与请求一起发送到服务器**。
- cookie 存储在客户端机器上，为了防止被滥用，浏览器会限制 cookie 不能占用太多磁盘空间，另外由于 cookie 也会作为请求头发送到服务端，cookie 越大，请求完成时间越长，所以一般 size 尽量小点。不同的浏览器对 cookie 的限制不一样，为保证兼容性，一般有如下建议
  - 每个域不要超过 20 个 cookie，尽管一般限制在 50+，或没限制
  - 每个 cookie 不超过 4kb，如果超过限制，cookie 会被静默删除
  - 每个域不超过 80 kb（20 * 4kb）

### cookie 构成
cookie 在浏览器中由以下参数构成
- `名称 name` 唯一标识 cookie 的名称，**不区分大小写**，myCookie 和 MyCookie 被认同是同一个cookie。名称尽量特殊点，防止其他子域设置了相同的 cookie，导致异常，**名称必须被 URL 编码**
- `值 value` cookie 名称对应的值，**值必须被 URL 编码**
- `域 domain` cookie 在哪个域是有效的，发送到这个域的所有请求都会包含对应的 cookie。默认为设置 cookie 的域，`.a.com` 表示对所有子域域都有效。
- `路径 path` 请求 URL 中包含这个路径才会把 cookie 发送到服务器，可以指定 cookie 只能由 `xx.com/books/` 访问，那么 `xx.com` 的页面就不会发送 cookie 信息，即使请求都是来自同一个域
- `过期时间` expires(HTTP/1.0)、max-age(Http/1.1) 如果不设置，浏览器会话结束即删除所有 cookie，也可以自己设置删除事件。expires 值为 GMT 格式的日期，如果设置为以前的时间。会立即删除，max-age 为有效期，单位秒。expires 和 max-age 参考:[cookie 过期时间: expires 与 max-age](https://blog.csdn.net/yingzizizizizizzz/article/details/81347719)
- `安全标志` secure 指定后只有使用 SSL 连接的时候才会发送到服务器 
- `HttpOnly` 为了帮助缓解跨站点脚本（XSS）攻击，**JavaScript 的 document.cookie API 无法访问 HttpOnly cookie**; 它们只被发送到服务器。 例如，持久化服务器端会话的 cookie 不需要可用于 JavaScript，并且应设置 HttpOnly 标志。

每一段信息都作为 Set-Cookie 头的一部分，使用分号加空格分隔每一段, 响应头示例:
```js
// 对所有 wrox.com 域名及子域名下(/)，所有页面都有效的 cookie，且只能通过 SSL 连接才能传输
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; domain=.wrox.com; path=/; secure
Other-header: other-header-value

// 指定了名为 name 的 cookie，他会在2019/08/21 09:46:24失效，同时对于wwwx.wrox.com和wrox.com的任何子域都有效
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Wed, 21 Aug 2019 09:46:24 GMT; domain=.wrox.com;
Other-header: other-header-value

// 关于 GMT 时间 没有加时区，一般 new Date() 默认加了时区
// 参考: http://fe.zuo11.com/js/ad3/js-ad3-5.html#date-%E7%B1%BB%E5%9E%8B
// (new Date()).toGMTString()
// "Wed, 21 Aug 2019 09:46:24 GMT"
```
**域、路径、失效时间和 secure 标志都是服务器给浏览器的指示，以指定前端发送请求时何时发送 cookie。这些参数并不会作为发送到服务器的 cookie 信息的一部分，只有 name 和 value 才能被发送**


### JS 中的 cookie
在 JS 中处理 cookie 比较麻烦，因为接口过于简单，只有 BOM 的 document.cookie 属性。它会包含页面中所有有效的 cookie 字符串（根据域、路径、过期时间、安全设置过滤后），以分号分隔。名字和值都是通过 URL 编码的，必须使用 decodeURIComponent() 来解码
```js
// document.cookie
name1=value1;name2=value2;name3=value3
```
设置cookie格式如下，并不会覆盖原有的 cookie，除非设置的 cookie 名称已存在
```js
document.cookie = "name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure"
```
除了name、value其他值为可选，且都需要用URL编码
```js
document.cookie = encodeURLComponent("name") + '=' + encodeURIComponent("guoqzuo")
```
cookie操作函数封装
```js
class CookieUtil {
  // 获取cookie值
  static get(name) {
    let cookieName = encodeURIComponent(name) + '=';
    let startIndex = document.cookie.indexOf(cookieName);
    let cookieVal = null;

    // 如果存在该cookie
    if (startIndex !== -1) {
      let endIndex = document.cookie.indexOf(';', startIndex);

      if (endIndex === -1) { // 如果找不到，就是字符串末尾
        endIndex = document.cookie.length;
      }

      cookieVal = decodeURIComponent(document.cookie.substring(startIndex + cookieName.length, endIndex));
    }

    return cookieVal;
  },

  // 设置cookie
  // options: { expires, maxAge, path, domain, secure, httpOnly}
  static set(name, value, options) {
    let tempVal = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    if (options.expires instanceof Date) {
      tempVal += "; expires=" + options.expires.toUTCString();
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
  // 将 expries 设置为过期时间即可删除
  static delete(name, options) {
    if (typeof options === 'object') {
      options.expires = new Date(0);
    } else {
      options = { expires: new Date(0) }
    }
    CookieUtil.set(name, "", options);
  }
};
```

### 子cookie
为了绕开浏览器单域名下的 cookie 数限制，有些开发者提出了 **子 cookie** 的概念。使用一个 cookie 值，来存储键值对。更多示例代码参见 p755
```js
// document.cookie
name=subname1=valu1&subname2=value2
```

### 使用 cookie 注意事项
- httpOnly 在浏览器和服务端都可以设置，仅能在服务端读取，设置后 document.cookie 无法修改和读取
- cookie 尽量只保存必要信息，不要太大，由于会发送到服务端，cookie 越大，请求完成时间越长
- 不要在 cookie 中存储敏感信息，虽然 httpOnly 的 cookie 无法通过 document.cookie 获取，但在浏览器开发工具中还是可以看到的。

## Web Storage
Web Storage 最早是超文本应用技术工作组（WHATWG，Web Hypetext Application Technical Working Group）在 Web Applications 1.0 规范中提出的，这个规范的草案最终成了 HTML5 的一部分。由于设置 cookie 后发会送到服务端，cookie 越大，请求时间越长，因此 cookie 不适合存储大量数据。Web Storage 的目的解决 cookie 客户端存储需要频繁发送数据到服务器的问题，IE8+ 支持, Web Storage 最新的版本是第 2 版，该版本的两个主要目标是:
- 提供了一种 cookie 之外存储会话数据的途径
- 提供了一种存储大量可以跨会话存在的数据机制

Web Storage 第二版定义了两个对象 localStorage 和 sessionStorage，可以做到刷新页面而不影响存储数据。
- localStorage 是永久存储机制
- sessionStorage 是跨会话存储机制

sessionStorage 在新开一个 tab 页时就会失效，localStorage 则没有限制。
### Storage 类型
Storage 类型（localStorage、sessionStorage）提供最大的存储空间来存储键值对数据。Storage 类型只能存储字符串，非字符串存储前需要转换为字符串。Storage 实例与其对象有如下方法:
- `clear()` 删除所有值
- `getItem(name)` 根据指定的名字 name 获取对应的值，如果没值返回 null
- `key(index)`  获取 index 位置处的 key 的名称, 可以用来遍历值
- `removeItem(name)` 删除指定 name 的值。
- `setItem(name, value)` 设置键值对
- `length` name 字段个数
- `.[name]` 点语法支持，设置或获取值。使用 delete xx.name 可以删除值


### sessionStorage
sessionStorage 数据浏览器关闭后，会消失。新开一个 tab 也会消失，用于存储只在会话期间有效的小段数据。2.5M - 5M。如果需要跨花卉持久存储数据，可以使用 localstorage
```js
// MDN
sessionStorage maintains a separate storage area for each given origin that's available for the duration of the page session (as long as the browser is open, including page reloads and restores)
- Stores data only for a session, meaning that the data is stored until the browser (or tab) is closed.
- Data is never transferred to the server.
- Storage limit is larger than a cookie (at most 5MB).
```

相关链接: [怎么解决sessionStorage新打开一个tab页就失效的问题 - dev-zuo 技术日常](http://www.zuo11.com/blog/2020/8/sessionStorage_loss.html)
### localStorage
修订过的 HTML5 规范中，localStorage 取代 globalStorage，作为持久保存客户端的数据的方案。**要访问同一个 localStorage 对象，页面必须来自同一个域名(子域名无效)。使用同一种协议，同一个端口**， 2.5M - 5M
```js
// MDN
localStorage does the same thing, but persists even when the browser is closed and reopened.
- Stores data with no expiration date, and gets cleared only through JavaScript, or clearing the Browser cache / Locally Stored Data.
- Storage limit is the maximum amongst the three.
```

### storage 事件
当 Storage 对象发生变化时，都会在文档上触发 storage 事件。使用点语法或setItem() 设置值、使用 delete 或 removeItem() 删除值，以及每次调用 clear() 都会触发 Storage 事件
 
单个页面里面 storage 事件不会触发，需要由其他 tab 页面触发, 触发的条件：
- 同一浏览器打开了两个同源页面
- 其中一个页面修改了 localStorage 或 sessionStorage
- 另一个网页注册了这个事件

参考: [Storage事件无法触发解决](https://blog.csdn.net/jlin991/article/details/55855524)

```js
window.addEventListener('storage', function (event) {
  console.log('storage chage');
  console.log(event);
  // event.domain 存储变化对应的域
  // event.key 被设置或删除的键
  // event.newValue 键被设置的新值，若键被删除则为 null
  // event.oldValue 键变化之前的值
}, false);
```

## IndexedDB
Indexed Database API 简称 IndexedDB，是浏览器中存储结构化数据的一个方案，用以替代已废弃的 Web SQL Database API。IndexDB 背后的思想是创造一套 API，方便 JS 对象的存储和获取，同时也支持查询和搜索。书中讲的不是很好理解，可以参考 [浏览器数据库 IndexedDB 入门教程 - 阮一峰](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)

IndexedDB 的设计几乎都是异步的。大多数操作以请求的形式执行，需要监听其返回结果的 success 或 error 事件才能拿到成功或错误信息。IE10+ 支持。

### 创建数据库
IndexDB 类似于 MySQL 的数据库，区别在于使用的是对象存储而不是表格存储数据，他是一个公共命名空间下的一组对象存储，类似于 NoSQL 风格的实现。它的核心对象是 window.indexedDB，类型为 IDBFactory {}，包含如下方法
- `indexDB.open(dbName, version)` 打开或创建一个数据库，dbName 是需要打开的数据库名称，version 为数据库版本。如果数据库已存在则打开，如果不存在则创建，然后打开。返回一个 IDBRequest 实例，可以在该实例上添加 onsuccess 和 onerror 事件处理程序

```js
let db, request, version = 1;
request = indexedDB.open('admin', version)
request.onerror = (event) => {
  throw new Error('Failed to open admin', event.target.errorCode)
}
request.onsuccess = (event) => {
  db = event.target.result // 类型为 IDBDatabase
}
```
### 创建对象存储
主要用于新创建数据库或数据库版本与期待的不一致时，创建新的对象存储。类似于 MySQL 存储数据前需要先创建表。创建对象存储需要指定对象存储名称、对象存储键(key)。这个 key 必须全局唯一，创建对象存储时必须指定一个键。
- `db对象.createObjectStore(存储对象名称, { keyPath: 存储对象key })` 创建一个存储对象

```js
let users = {
  username: "zuo",
  firstName: "fugui",
  lastName: 'wang',
  age: '24' 
}
```
假设要创建一个存储上述信息的对象存储，我们创建对象存储的时机需要在 upgrageneeded 事件中。这个事件在调用 open 创建一个新的数据库，或者数据库存在指定了一个升级的版本号时触发。
```js
let db, request, version = 1;
request = indexedDB.open('admin', version)
request.onerror = (event) => {
  throw new Error('Failed to open admin', event.target.errorCode)
}
request.onsuccess = (event) => {
  db = event.target.result // 类型为 IDBDatabase
}

request.onupgradeneeded = (event) => {
  const db = event.target.result
  // 这样做会删除原有数据，谨慎使用
  if (db.objectStoreNames.contains('users')) {
    db.deleteObjectStore('users')
  }
  db.createObjectStore('users', { keyPath: 'username' })
}
```

### 创建事务/插入对象
创建存储对象后，剩下的所有操作都是通过 **事务** 来完成的，在读取或修改数据时，需要通过事务把操作组织起来
- `db对象.transaction(对象存储名称, 访问模式)` 创建一个事务并返回 IDBTransaction 对象，存储对象名称可以是字符串，也可以是字符串数组。访问模式有三种：默认为 "readonly"，还有 "readwrire"、"versionchange"
- `transaction对象.objectStore(对象存储名称)` 通过事务获取特定的对象存储。返回 IDBObjectStore 对象，一般命名为 store，它支持如下方法
  - `store对象.add(object数据)` 添加对象，如果已经有了同名的 key，会报异常
  - `store对象.put(object数据)` 更新对象，可以添加对象，如果已经有了同名的 key，会使用新对象更新该值
  - `store对象.get()` 获取对象
  - `store对象.delete()` 删除对象
  - `store对象.clear()` 删除所有对象

```js
let db, request, version = 2;
request = indexedDB.open('admin', version)
request.onerror = (event) => {
  console.log('Failed to open admin', event.target.errorCode)
}
request.onsuccess = (event) => {
  console.log('success')
  db = event.target.result // 类型为 IDBDatabase

  const transaction = db.transaction('users', "readwrite")
  console.log(transaction) // IDBTransaction
  const store = transaction.objectStore('users')
  console.log(store) // IDBObjectStore
  // 添加值
  let req = store.add({
    username: "zuo",
    firstName: "fugui",
    lastName: 'wang',
    age: '24' 
  })
  req.onerror = (e) => console.log
  req.onsuccess = (e) => console.log(e.target.result) // zuo
  // 获取值
  req = store.get("zuo")
  req.onerror = (e) => console.log
  req.onsuccess = (e) => console.log(e.target.result) 
  // {username: "zuo", firstName: "fugui", lastName: "wang", age: "24"}
}
request.onupgradeneeded = (event) => {
  console.log('onupgradeneeded')
  const db = event.target.result
  // 这样做会删除原有数据，谨慎使用
  if (db.objectStoreNames.contains('users')) {
    db.deleteObjectStore('users')
  }
  console.log(db.createObjectStore('users', { keyPath: 'username' }))
}
```

### 通过游标查询多条数据
使用事务可以通过一个已知的键值获取一条记录。如果需要获取多条记录就需要使用游标了。通过 IDBObjectStore 对象的 openCursor() 方法可以创建一个游标，类型为 IDBCursorWithValue，包含如下属性方法
- `direction` 字符串常量，表示游标的前进方向以及是否应该遍历所有重复的值，默认为 "next"，还包括 "nextunique", "prev", "prevunique"
- `key` 对象的键
- `value` 实际的对象
- `primaryKey` 游标使用的键，有可能是对象键或索引键
- `continue(可选的key)` 默认游标继续向下遍历，如果指定了 key，则游标移动到指定的 key
- `update(obj)` 用于更新当前游标位置对应的值
- `delete()` 删除游标位置的记录
- `advance(count)` 游标向前移动指定的 count 条记录

```js
let db, request, version = 2;
request = indexedDB.open('admin', version)
request.onsuccess = (event) => {
  console.log('success')
  db = event.target.result // 类型为 IDBDatabase

  const transaction = db.transaction('users', "readwrite")
  const store = transaction.objectStore('users')
  // 添加值
  let datas = [
    { username: "zuo", age: '16' },
    { username: "you", age: '33' },
    { username: "zhang", age: '24' }
  ]
  let reqs = []
  let successCb = () => {
    console.log('put success all')
    // 创建一个游标
    req = store.openCursor()
    req.onsuccess = (e) => {
      let cursor = e.target.result
      console.log(cursor) // IDBCursorWithValue
      // direction: "next"
      // key: "you"
      // primaryKey: "you"
      // value: {username: "you", age: "33"}
      if (cursor) {
        console.log(cursor.key, cursor.value)
        cursor.continue() // 继续遍历
      } else {
        console.log("没有更多数据了")
      }
    }
  }
  datas.forEach(item => {
    console.log(item)
    let req = store.put(item)
    req.onsuccess = () => {
      console.log('put success')
      reqs.push(req)
      if (reqs.length === datas.length) {
        successCb()
      }
    }
    req.onerror = e => console.log('put error', e)
  })
}
request.onupgradeneeded = (event) => {
  console.log('onupgradeneeded')
  const db = event.target.result
  // 这样做会删除原有数据，谨慎使用
  if (db.objectStoreNames.contains('users')) {
    db.deleteObjectStore('users')
  }
  console.log(db.createObjectStore('users', { keyPath: 'username' }))
}
```

### 键范围 IBDKeyRange
使用游标获取数据不太方便，使用 "键范围"（key range） 可以让游标更容易管理，IDBKeyRange 创建键范围的方法有如下几种，都是静态方法
- `IDBKeyRange.only(key)` 仅获取对应 key 的值
- `IDBKeyRange.lowerBound(key[, lowerOpen])` 默认从 key 开始遍历，直到最后, lowerOpen 是否从他的下一个条记录开始
- `IDBKeyRange.upperBound(key[, upperOpen])` 默认从头开始，达到 key 后停止遍历，upperOpen 是否从 key 的前一条记录截止
- `IDBKeyRange.upperBound(lowerKey, upperKey[[, lowerOpen], upperOpen])` 默认从 lowerKey 开始遍历，到 upperKey 截止

```js
cont boundRange = IDBKeyRange.bound("a", "b", true, false)
// IDBKeyRange {lower: "a", upper: "b", lowerOpen: true, upperOpen: false}
```
使用键范围控制游标遍历 demo
```js
let db, request, version = 2;
request = indexedDB.open('admin', version)
request.onsuccess = (event) => {
  console.log('success')
  db = event.target.result // 类型为 IDBDatabase

  const transaction = db.transaction('users', "readwrite")
  const store = transaction.objectStore('users')
  // 添加值
  let datas = [
    { username: "zuo", age: '16' }, // 2
    { username: "you", age: '33' }, // 1
    { username: "zhang", age: '24' } // 2
  ]
  let reqs = []
  let successCb = () => {
    console.log('put success all')
    // 创建一个游标，从 you 记录开始，到 zhang 结束
    let range = IDBKeyRange.bound("you", "zhang")
    let req = store.openCursor(range);
    req.onsuccess = (e) => {
      let cursor = e.target.result
      console.log(cursor) // IDBCursorWithValue
      if (cursor) {
        console.log(cursor.key, cursor.value)
        cursor.continue() // 继续遍历
      } else {
        console.log("没有更多数据了")
      }
    }
  }
  datas.forEach(item => {
    console.log(item)
    let req = store.put(item)
    req.onsuccess = () => {
      console.log('put success')
      reqs.push(req)
      if (reqs.length === datas.length) {
        successCb()
      }
    }
    req.onerror = e => console.log('put error', e)
  })
}
request.onupgradeneeded = (event) => {
  console.log('onupgradeneeded')
  const db = event.target.result
  // 这样做会删除原有数据，谨慎使用
  if (db.objectStoreNames.contains('users')) {
    db.deleteObjectStore('users')
  }
  console.log(db.createObjectStore('users', { keyPath: 'username' }))
}
```
### 设置游标方向
openCursor() 支持两个参数，第一个为 IDBKeyRange，第二个参数为表示方向的字符串，默认为 "next"，另外支持 "prev"，"nextunique", "prevunique"
```js
req = store.openCursor(null, "nextunique") // 如果有重复的数据跳过
```
### 索引
对于某些数据集，可能需要为对象存储指定多个键。例如同时记录用户的 ID 和用户名。可以把 ID 作为主键，然后在用户名上创建索引。下面的例子中建立名为 username 的索引，属性为 username，unique 表示键是否必须在所有记录中唯一。返回 IDBIndex 实例，它类似于 IDBObjectStore，可以直接使用该对象执行相关操作
```js
const transation = db.transation('users');
const store = transation.objectStore('users')
// 创建索引
index = store.createIndex('username', 'useranme', { unique: false })
```
使用索引
```js
var transaction = db.transaction(['users'], 'readonly');
var store = transaction.objectStore('users');
var index = store.index('name'); // 使用一个已存在的索引
var request = index.get('李四'); 

request.onsuccess = function (e) {
  var result = e.target.result;
  if (result) {
    // ...
  } else {
    // ...
  }
}
```
更多细节参考：p771

### 并发问题
在浏览器中，如果两个不同的 tab 页打开了同一个页面。而版本变化只能在浏览器只有一个标签页使用数据库时才能完成。需要在 onversionchange 时关闭数据库

```js
let re, db;
req = indexedDB.open('admin', 1);
req.onsuccess = (e) => {
  db = e.target.result
  db.onversionchange = () => db.close()
}
```
### 限制
indexedDB 的限制和 Web Storage 大致一样
- 数据库和当前域（协议、host、端口）绑定
- Chrome 限制为 5M，如果超出限制会请求用户许可
- 本地调试建议使用 Chrome

参考：[IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

