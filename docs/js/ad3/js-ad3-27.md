---
title: 27. 工作者线程(Web Workers) - JS高程4
description: JavaScript 是单线程的，这样可以保证它与浏览器 API 兼容。如果 JavaScript 可以多线程执行并发更改，那么像 DOM 这样的 API 就会出现问题。单线程意味着不能把工作委托给独立的线程、进程去做。这就是 工作者线程 存在的价值所在：允许把主线的工作转嫁给独立的实体，而不会改变现有的单线程模型。它的特点是独立于 JavaScript 主执行环境。
keywords: 
---

# 27. 工作者线程(Web Workers)

> 官方文档规范参考：[Web Workers - HTML Standard](https://html.spec.whatwg.org/multipage/workers.html)

JavaScript 是单线程的，这样可以保证它与浏览器 API 兼容。如果 JavaScript 可以多线程执行并发更改，那么像 DOM 这样的 API 就会出现问题。因此 POSIX 线程与 Java 的 Thread 类等传统并发结构都不适合 JavaScript。

单线程意味着不能把工作委托给独立的线程、进程去做。这就是 **工作者线程（Web Workers）** 存在的价值所在：允许把主线的工作转嫁给独立的实体，而不会改变现有的单线程模型。它的特点是独立于 JavaScript 主执行环境。

## 工作者线程简介
JS 运行在虚拟环境，浏览器中，每打开一个页面，就会分配一个它自己的环境。每个页面都有自己的内存、事件循环、DOM，等等。每个页面相当于一个沙盒，不会干扰其他页面。对浏览器来说，这些环境都是并行执行的。

使用 **工作者线程** 浏览器可以在环境之外再分配一个完全独立的二级子环境，这个子环境不能与依赖单线程交互的 API（如 DOM）互相操作，但可以与父环境并行执行代码。

**工作者线程与线程**的比较：
- 工作者线程基于实际线程实现
- 工作者线程并行执行
- 工作者线程可以共享某些内容，不共享全部内存。
- 工作者线程不一定在同一个进程里
- 创建工作者线程的开销较大。它有自己独立的事件循环、全局对象、事件处理程序和其他 JS 环境必须的特性。

::: warning
工作者线程相对比较重，不建议大量使用。工作者线程应该是长期运行的，启动成本比较高、每个实例占用的内存比较大。
:::

**工作者线程的类型**，Web Workers 规范中定义了三种主要的工作者线程：
1. `专用工作者线程（Dedicated Workers）`，通常简称 Web Worker 或 Worker，**可以单独创建一个 JS 线程，这个线程只能被创建它的页面使用。**
2. `共享工作者线程（Shared Workers）`，与专用工作者线程类似，**任何与创建共享工作者线程的 JS 同源的 JS，都可以向共享工作者线程发送、接收消息。**
3. `服务工作者线程（Service Workers）`，与专用共享工作者线程和共享工作者线程不同，**它主要用于拦截、重定向和修改页面发出的请求，充当网络请求的仲裁者角色**。

**WorkerGlobalScope**，在工作者线程内部全局对象为 WorkerGlobalScope  的实例，类似于 window。通过 self 关键字暴露出来。self 上可用的属性和方法是 window 上属性和方法的子集。这些属性会返回工作者线程的特定版本。方法与 window 的方法操作一样。

- `navigator` 返回工作者线程关联的 WorkerNavigator。
- `self` 返回 WorkerGlobalScope 对象。
- `location` 返回工作者线程关联的 WorkerLocation。
- `performace` 返回 Performace 对象，只包含特定属性、方法。
- `console` 
- `caches` 返回 CacheStorage 对象。
- `indexdDB` 返回 IDBFactory 对象。
- `isSecureContext` 返回布尔值，表示工作者线程上下文是否安全。
- `origin` 返回 WorkerGlobalScope 的源
- `atob()`
- `btoa()`
- `clearInterval()`
- `clearTimeout()`
- `createImageBitmap()`
- `fetch()`
- `setInterval()`
- `setTimeout()`
- `importScripts()` 工作者线程新增的方法，只在工作者线程内可用

**WorkerGlobalScope 的子类**，每种类型的工作者线程都使用了自己特定的全局对象，继承自 WorkerGlobalScope:
- 专用工作者线程 DedicatedWorkerGlobalScope
- 共享工作者线程 SharedWorkerGlobalScope
- 服务工作者线程 ServiceWorkerGlobalScope

## 专用工作者线程
可以把专用工作者线程称为 **后台脚本(background script)**，这样的线程可以与父页面交换信息、发送网络请求、执行文件输入/输出、进行密集计算、处理大量数据，以及实现其他不适合在页面执行线程里做的任务（否则会导致页面响应迟钝）。

```js
// index.html
// <script src="./main.js"></script>

// main.js
const worker = new Worker('./worker.js')
console.log(worker) // Worker {}

// worker.js
console.log('加载了 worker.js')
console.log('self', self) // DedicatedWorkerGlobalScope {}
```

![web_worker_1.png](/images/js/web_worker_1.png)

::: tip
Web Worker 出于安全方面的考虑，不允许使用非同源 JS 创建工作者线程，否则会提示 DOMException: Failed to construct 'Worker'。
在工作者线程内部，使用 importScripts() 可以加载其他源的 JS
:::

```js
// main.js
// DOMException: Failed to construct 'Worker'
const worker = new Worker('http://www.zuo11.com/worker.js')
```

worker 对象可以用来干什么？
- `onerror` 工作者线程抛出异常时触发，ErrorEvent类型错误
- `onmessage` 工作者线程向父上下文发送消息时触发，MessageEvent 类型消息
- `onmessageerror` 工作者线程收到无法反序列化的消息时发生，MessageEvent 类型的错误
- `postMessage()` 向工作者线程发送消息
- `terminate()` 立即终止工作者线程
```js
// main.js
const worker = new Worker('./worker.js')
worker.addEventListener('error', (e) => console.log(e))
worker.addEventListener('message', (msg) => console.log(msg))
worker.addEventListener('messageerror', (e) => console.log(e))
worker.postMessage('some info')
worker.terminate()
```

DedicatedWorkerGlobalScope (self 的类型) 相比 WorkerGlobalScope 增加了如下属性、方法：
- `name` 可以提供给 Worker 构造函数的一个可选的字符串标识符。
- `postMessage()` 与 worker.postMessage() 对应的方法，用于从工作者线程内部向父上下文发送消息。
- `close()` 与 worker.terminate() 对象的方法，用于立即终止工作者线程。
- `importScripts()` 用于向工作者线程中导入任意数量的 JS。

**专用工作者线程的声明周期**，一般分为下面 3 种状态：
- `初始化（initializing）` 调用 new Worker() 时会初始化对工作者线程 JS 的请求，并返回 Worker 对象。这个时候与之关联的工作者线程可能还没创建，因为 JS 文件加载有延时。这个时候可以使用 worker.postMessage() 向工作者线程发消息，会将消息先加入到队列。等状态变为活动时，再把消息添加到它的消息队列。
- `活动（active）` 初始化成功之后会变为活动状态
```js
// initWorker.js
self.addEventListener('message', ({ data }) => console.log(data))

// main.js
const worker = new Worker('./initWorker.js')
// 这里 worker 可能还处于初始化状态，但 postMessage() 数据可以正常处理
worker.postMessage('foo')
worker.postMessage('bar')
worker.postMessage('baz')
// foo
// bar
// baz
```
- `终止（terminated）`，终止分为：工作者线程内部自我终止 self.close() 、外部终止 worker.terminate()。

```js
// closeWorker.js
self.postMessage('foo')
self.close()
self.postMessage('bar')
setTimeout(() => self.postMessage('baz'), 0)

// main.js 
const worker = new Wroker('./closeWorker.js')
worker.onmessage = ({ data }) => console.log(data)
// foo
// bar
```

::: tip
注意：内部终止 self.close() ，并没有立即终止。close() 会通知工作者线程取消事件循环中的所有任务，并阻止添加新任务。**当前事件循环中的事件还是会执行**，而外部终止 worker.terminate() 是立即终止。
:::

如果页面关闭，与其关联的工作者线程会被标记为终止，他们的执行也会立即停止。

## 共享工作者线程
## 服务工作者线程(Service Worker)



