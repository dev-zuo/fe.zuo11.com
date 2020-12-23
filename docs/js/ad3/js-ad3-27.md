---
title: 27. 工作者线程(Web Workers) - JS高程4
description: JavaScript 是单线程的，这样可以保证它与浏览器 API 兼容。如果 JavaScript 可以多线程执行并发更改，那么像 DOM 这样的 API 就会出现问题。单线程意味着不能把工作委托给独立的线程、进程去做。这就是 工作者线程的价值所在：允许把主线的工作转嫁给独立的实体，而不会改变现有的单线程模型。它的特点是独立于 JavaScript 主执行环境。
keywords: Web Worker,Service Worker
---

# 27. 工作者线程(Web Workers)

> 官方文档规范参考：[Web Workers - HTML Standard](https://html.spec.whatwg.org/multipage/workers.html)

JavaScript 是单线程的，这样可以保证它与浏览器 API 兼容。如果 JavaScript 可以多线程执行并发更改，那么像 DOM 这样的 API 就会出现问题。因此 POSIX 线程与 Java 的 Thread 类等传统并发结构都不适合 JavaScript。

单线程意味着不能把工作委托给独立的线程、进程去做。这就是 **工作者线程（Web Workers）** 的价值所在：允许把主线的工作转嫁给独立的实体，而不会改变现有的单线程模型。它的特点是独立于 JavaScript 主执行环境。

## 工作者线程简介(Worker)
JS 运行在虚拟环境，浏览器中，每打开一个页面，就会分配一个它自己的环境。每个页面都有自己的内存、事件循环、DOM，等等。每个页面相当于一个沙盒，不会干扰其他页面。对浏览器来说，这些环境都是并行执行的。

使用 **工作者线程** 浏览器可以在环境之外再分配一个完全独立的二级子环境，这个子环境不能与依赖单线程交互的 API（如 DOM）互相操作，但可以与父环境并行执行代码。

### 工作者线程与线程
工作者线程与线程的比较：
- 工作者线程基于实际线程实现
- 工作者线程并行执行
- 工作者线程可以共享某些内容，不共享全部内存。
- 工作者线程不一定在同一个进程里
- 创建工作者线程的开销较大。它有自己独立的事件循环、全局对象、事件处理程序和其他 JS 环境必须的特性。

::: warning
工作者线程相对比较重，不建议大量使用。工作者线程应该是长期运行的，启动成本比较高、每个实例占用的内存比较大。
:::

### 三种工作者线程类型
Web Workers 规范中定义了三种主要的工作者线程：
1. `专用工作者线程（Dedicated Workers）`，通常简称 Web Worker 或 Worker，**可以单独创建一个 JS 线程，这个线程只能被创建它的页面使用。**
2. `共享工作者线程（Shared Workers）`，与专用工作者线程类似，**任何与创建共享工作者线程的 JS 同源的 JS，都可以向共享工作者线程发送、接收消息。**
3. `服务工作者线程（Service Workers）`，与专用工作者线程和共享工作者线程不同，**它主要用于拦截、重定向和修改页面发出的请求，充当网络请求的仲裁者角色**。

### WorkerGlobalScope
在工作者线程内部全局对象为 WorkerGlobalScope  的实例，类似于 window。通过 self 关键字暴露出来。self 上可用的属性和方法是 window 上属性和方法的子集。这些属性会返回工作者线程的特定版本。方法与 window 的方法操作一样。

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

## 专用工作者线程(Dedicated Workers）
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

### worker 对象
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

### DedicatedWorkerGlobalScope 
self 的类型，它相比 WorkerGlobalScope 增加了如下属性、方法：
- `name` 可以提供给 Worker 构造函数的一个可选的字符串标识符。
- `postMessage()` 与 worker.postMessage() 对应的方法，用于从工作者线程内部向父上下文发送消息。
- `close()` 与 worker.terminate() 对象的方法，用于立即终止工作者线程。
- `importScripts()` 用于向工作者线程中导入任意数量的 JS。

### 专用工作者线程的生命周期
一般分为下面 3 种状态：
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
// foo  bar  baz
```
- `终止（terminated）`，终止分为：工作者线程内部自我终止 self.close() 、外部终止 worker.terminate()。

```js
// closeWorker.js
self.postMessage('foo')
self.close()
self.postMessage('bar')
setTimeout(() => self.postMessage('baz'), 0)

// main.js 
const worker = new Worker('./closeWorker.js')
worker.onmessage = ({ data }) => console.log(data)
// foo bar
```

::: tip
注意：内部终止 self.close() ，并没有立即终止。close() 会通知工作者线程取消事件循环中的所有任务，并阻止添加新任务。**当前事件循环中的事件还是会执行**，而外部终止 worker.terminate() 是立即终止。
:::

```js
// terminateWorker
self.onmessage = ({ data }) => console.log(data)

// main.js
const worker = new Worker('./terminateWorker.js')

// 给 1000ms 时间，让工作者线程初始化
setTimeout(() => {
  worker.postMessage('foo')
  worker.terminate() // 立即终止，工作者线程消息队列会被清理锁住，不会打印 bar
  worker.postMessage('bar')
  setTimeout(() => worker.postMessage('baz'), 0)
}, 1000)
// foo
```
如果页面关闭，与其关联的工作者线程会被标记为终止，他们的执行也会立即停止。

### new Worker() 可选配置选项
Worker() 构造函数允许将可选的配置对象作为第二个参数。可配置属性如下：
- `name` 可以通过 self.name 读取的内容
- `type` 加载脚本的运行方式
  - `"classic"` 作为常规脚本来执行
  - `"module"` 作为模块来执行
- `credentials` 当脚本加载方式为 module 时，指定如何获取与传输凭证数据相关的模块 js。与 fetch() 的凭证选项相同。
  - `"omit"` type 为 "classic" 时的默认值。
  - `"same-orign"`
  - `"include"`

```js
// main.js
const worker = new Worker('./worker.js', {
  name: 'testOptionsWorker',
  type: "module",
  credentials: "omit"
})

// worker.js
console.log(self.name) // testOptionsWorker
```

### 不加载 js 文件创建 worker 的方法
js 代码字符串转 Blob，Bolb 转对象 URL，使用该 URL 创建。这样可以快速的初始化工作者线程，没有网络延时。
```js
// 将 js 文件的内容存到字符串
let scriptStr = `self.onmessage = ({ data }) => console.log(data)`
const worker = new Worker(URL.createObjectURL(new Blob([scriptStr])))
worker.postMessage('blob worker script')
// blob worker script
```
来看一个实例，把比较耗时的斐波那契计算放到 worker 里执行。再将值传递回来。这里把 fiibonacci 函数转成字符串，使用立即执行函数（**IIFE**，Immediately Invoked Function Expression）方式来执行。
```js
function fibonacci(n) {
  return n < 1 ? 0 
         : n <= 2 ? 1
         : fibonacci(n - 1) + fibonacci(n - 2)
}
let scriptStr = `self.postMessage((${fibonacci.toString()})(9))`
const worker = new Worker(URL.createObjectURL(new Blob([scriptStr])))
worker.onmessage = ({data}) => console.log(data) // 34
```

### importScripts() 动态执行 js
在工作者线程中使用 importScripts() 动态执行 js
```js
// mian.js
const worker = new Worker('./worker.js')

// scriptA.js
console.log('scriptA executes')

// scriptB.js
console.log('scriptB executes')

// worker.js
console.log('start import scripts')
importScripts('./scriptA.js')
importScripts('./scriptB.js')
// 等价于 importScripts('./scriptA.js', './scriptB.js')
console.log('scripts imported')

// start import scripts
// scriptA executes
// scriptB executes
// scripts imported
```

::: tip
- **importScripts() 导入的 js 会严格按照顺序执行。**
- **new Worker() 时 js 有跨域限制，而 worker 内部使用 importScripts 没有跨域限制。**
- **importScripts() 导入的 js 与 worker 共享同一个作用域**
:::

### 子工作者线程
在工作者线程内部，可以再创建子工作者线程。在多个 CPU 核心的时候，使用多个子工作者线程可以实现并行计算。使用子工作者线程时需要考虑周全，确保并行计算确实有收益。**注意 worker.js 与 subWorker.js 要与主页同域**

```js
// mian.js
const worker = new Worker('./worker.js')

// worker.js
console.log('worker')
const worker = new Worker('./subWorker.js')

// subWorker.js
console.log('subWorker')

// worker
// subWorker
```

### 处理工作者线程错误
如果工作者线程抛出了错误，工作者线程沙盒可以阻止它打断父线程的执行，在 main.js 中使用 try/catch 中不会捕获到错误。**需要使用 worker.onerror 事件来接收处理错误。**

```js
// worker.js
throw Error('foo')

// main.js
try {
  const worker = new Worker('./worker.js')
  console.log('no error')
} catch(e) {
  console.log('caught error')
}
// no error
```
使用 worker.onerror 捕获错误
```js
const worker = new Worker('./worker.js')
worker.onerror = console.log
// ErrorEvent { isTrusted: true, message: "Uncaught Error: foo" }
```

### 与专用工作者线程通信的三种方法
与工作者线程通信都是通过异步消息完成，这些消息分三种
1. **使用 postMessage()**，在主线程与工作者线程之间传递消息。worker 和 self 都可以接收、发送消息。

```js
// worker.js
function factorial(n) {
  let result = 1;
  while(n) {
    result *= n--
  }
  return result
}
self.onmessage = ({ data }) => {
  self.postMessage(`${data}! = ${factorial(data)}`)
}

// main.js
const worker = new Worker('./worker.js')
worker.onmessage = ({ data }) => console.log(data)
worker.postMessage(5)
worker.postMessage(7)
worker.postMessage(10)

// 5! = 120
// 7! = 5040
// 10! = 3628800
```
2. **使用 MessageChannel**，本质上也是调用 onmessage 与 postMessage() 进行收发信息。但是使用 MessageChannel 会在两个上下文中明确建立信道（通信渠道）。MessageChannel 实例有两个 MessagePort 属性 port1、port2。分别代表两个通信端点。使用 port1、port2 调用 onmessage 与 postMessage() 可以进行收发消息。
```js
// mian.js
const channel = new MessageChannel()
// channel: MessageChannel {port1: MessagePort, port2: MessagePort}

const worker = new Worker('./worker.js')
// 把 channel 实例两个通信端口中的一个传递给工作者线程
worker.postMessage(null, [channel.port1])
// 使用另一个端口与工作者线程通信
channel.port2.onmessage = ({ data }) => console.log(data)
channel.port2.postMessage(5)
// main.js: you send data: 5

// worker.js
let messagePort = null
self.onmessage = ({ ports }) => {
  // 第一次接收消息时，主线程把 MessageChannel 其中一个 port 传进来
  if (!messagePort) {
    messagePort = ports[0] // channel.port1
    // 重置监听器
    self.onmessage = null
    // 拿到 channel.port1 后使用它通信
    messagePort.onmessage = ({ data }) => {
      messagePort.postMessage(`you send data: ${data}`)
    }
  }
}
```
使用 MessageChannel 用于主线程与工作者线程通信很大程度是多余的，因为全局的 onmessage 和 postMessage() 就可以收发消息。MessageChannel 真正有用的地方是两个工作者线程之间通信。
```js
// main.js
const channel = new MessageChannel()
const workerA = new Worker('./workerA.js')
const workerB = new Worker('./workerB.js')
// 建立 workerA 和 workerB 的通信渠道
workerA.postMessage(null, [channel.port1])
workerB.postMessage(null, [channel.port2])

// workerA 给 workerB 发消息，workerB 给 workerA 发消息
workerA.postMessage('a')
// workerB receive data: a
workerB.postMessage('b')
// workerA receive data: b

// workerA.js
let messagePort = null
self.onmessage = ({ data, ports }) => {
  if (!messagePort) {
    messagePort = ports[0]
    messagePort.onmessage = ({ data }) => {
      // workerB.js 只是把 workerA 改为了 workerB
      console.log(`workerA receive data: ${data}`)
    }
  } else {
    messagePort.postMessage(data)
  }
}
```

3. **使用 BroadcastChannel**，相比 MessageChannel 来说，这个比较简单，只要初始化时 name 相同，就可以相互收发消息。另外，页面给 worker 发消息时，要先等 1 秒钟。因为初始化 worker 可能会有延时，消息可能在发送成功之后，worker 里面还没开始监听对应的信道。这里发送消息是广播的形式。不像 postMessage() 那样有等候的消息队列。

```js
// main.js
const channel = new BroadcastChannel('worker_channel')
// BroadcastChannel {name: "worker_channel", onmessage: null }
const worker = new Worker('./worker.js')
channel.onmessage = ({ data }) => console.log(`heard ${data} on page`)
setTimeout(() => channel.postMessage('foo'), 1000)
// heard foo in worker
// heard bar on page

// worker.js
const channel = new BroadcastChannel('worker_channel')
channel.onmessage = ({ data }) => {
  console.log(`heard ${data} in worker`)
  channel.postMessage('bar')
}
```

### 工作者线程数据传输
主线程与工作者线程，一般通过 postMessage() 传递数据。工作者线程是独立的上下文，在上下文之间传输数据就会产生消耗。在传统的多线程模型语言中，可以使用 锁、互斥量、volatile变量（不稳定变量）。在 JavaScript 中，有 3 种在上下文中传输数据的方式：
1. **结构化克隆算法**（structured clone algorithm）
2. **可转移对象**（transferable objects）
3. **共享数组缓冲区**（shared array buffers）

**结构化克隆算法**，默认情况下，使用 postMessage() 发送对象数据时，使用的就是结构化克隆算法。浏览器会遍历该对象，并且在目标上下文中，生成它的一个副本。下列类型是结构化克隆算法支持的类型：
- 除 `Symbol` 外的所有原始类型
- `Boolean 对象`、`String 对象`、`BDate`、`RegExp`、`Blob`、`File`、`FileList`、`ArrayBuffer`、`ArrayBufferView`、`ImageData`、`Array`、`Object`、`Map`、`Set`

::: tip
结构化克隆算法需要注意的地方：
- 复制之后源上下文中该对象的修改，不会传播到目标上下文中的对象。它可以识别对象中包含的循环引用，不会无穷遍历对象。
- 克隆 Error 对象、Function 对象或 DOM 节点会抛出错误。
- 它并不总是创建完全一致的副本。原型链、对象属性描述符、get、set方法不会 clone，必要时会使用默认值。
:::

**可转移对象**（transferable objects）可以把所有权从一个上下文中转义到另一个上下文。在数据量很大时，特别有用。只有下面几种对象是可转移对象：`ArrayBuffer`、`MessagePort`、`ImageBitmap`、`OffscreenCanvas`

postMessage() 方法的第二个可选参数是数组，它指定应该将哪些对象转移到目标上下文。在遍历消息 payload 时，浏览器会根据转移对象数组检查对象引用，并对转移对象进行转移，而不是复制。来看个例子

```js
const worker = new Worker('./worker.js');
// Create 32 byte buffer
const arrayBuffer = new ArrayBuffer(32);
console.log(`page's buffer size: ${arrayBuffer.byteLength}`);  // 32
worker.postMessage(arrayBuffer);
console.log(`page's buffer size: ${arrayBuffer.byteLength}`);  // 32

// worker.js
self.onmessage = ({data}) => {
  console.log(`worker's buffer size: ${data.byteLength}`);     // 32
};
```
将 ArrayBuffer 指定为可转移对象
```js
const worker = new Worker('./worker.js');
// Create 32 byte buffer
const arrayBuffer = new ArrayBuffer(32);
console.log(`page's buffer size: ${arrayBuffer.byteLength}`);  // 32
worker.postMessage(arrayBuffer, [arrayBuffer]);
console.log(`page's buffer size: ${arrayBuffer.byteLength}`);  // 0

// worker.js
self.onmessage = ({data}) => {
  console.log(`worker's buffer size: ${data.byteLength}`);     // 32
};
```
在其他类型的对象中，嵌套可转移对象也是可以的。包装对象会被复制，可转移对象会被转移。

```js
// 嵌套可转移对象
worker.postMessage({ foo: { bar: arrayBuffer }}, [arrayBuffer])
```

**SharedArrayBuffer**（共享数组缓冲区），既不克隆，也不转移。SharedArrayBuffer 作为 ArrayBuffer 能够在不同的浏览器上下文中共享。postMessage() 发送 SharedArrayBuffer 时，浏览器只会传递原始缓冲区的引用，两个不同的 JS 上下文会分别维护同一个内存块的引用。每个上下文都可以任意修改这个缓冲区。

```js
// main.js
const worker = new Worker('./worker.js');

// Create 1 byte buffer
const sharedArrayBuffer = new SharedArrayBuffer(1);

// Create view onto 1 byte buffer
const view = new Uint8Array(sharedArrayBuffer);

// Parent context assigns value of 1
view[0] = 1;

worker.onmessage = () => {
  console.log(`buffer value after worker modification: ${view[0]}`);
};

// Send reference to sharedArrayBuffer
worker.postMessage(sharedArrayBuffer);

// buffer value before worker modification: 1
// buffer value after worker modification: 2

// worker.js
self.onmessage = ({data}) => {
  const view = new Uint8Array(data);

  console.log(`buffer value before worker modification: ${view[0]}`);

  // Worker assigns new value to shared buffer
  view[0] += 1;

  // Send back empty postMessage to signal assignment is complete
  self.postMessage(null);
};
```
当两个并行的线程中共享内存块，有资源争抢的风险。SharedArrayBuffer 实例实际上会被当成易变（Volatile）内存。来看一个例子
```js
// main.js
// Create worker pool of size 4 创建包含 4 个线程的线程池
const workers = [];
for (let i = 0; i < 4; ++i) {
  workers.push(new Worker('./worker.js'));
}

// Log the final value after the last worker completes
// 在最后一个 worker 完成后打印最终值
let responseCount = 0;
for (const worker of workers) {
  worker.onmessage = () => {
    if (++responseCount == workers.length) {
      console.log(`Final buffer value: ${view[0]}`);
    }
  };
}

// Initialize the SharedArrayBuffer
const sharedArrayBuffer = new SharedArrayBuffer(4);
const view = new Uint32Array(sharedArrayBuffer);
view[0] = 1;

// Send the SharedArrayBuffer to each worker
for (const worker of workers) {
  worker.postMessage(sharedArrayBuffer);
}

// 理论上值应该是 4000001，但实际是不超过 400万的数，而且还是动态的。
// (Expected result is 4000001. Actual output will be something like:)
// Final buffer value: 3254012

// worker.js
self.onmessage = ({data}) => {
  const view = new Uint32Array(data);

  // Perform 1000000 add operations 执行 100 万次加 1 操作
  for (let i = 0; i < 1E6; ++i) {
    view[0] += 1;
  }

  self.postMessage(null);
};
```
上面的例子中，每个工作者线程都顺序执行了 100 万次加操作，每次都是读取共享数组的索引，执行一次加操作，然后再把值写回索引。在线程并发执行时，可能会发生资源争用。例如
1. 线程 A 读取到值 1
2. 线程 B 读取到值 1
3. 线程 A 加 1 并 将 2 写回数组
4. 然后线程 A 用就的数据 1，同样把 2 写回数组

为了解决这个问题，可以使用 Atomics 对象，执行原子操作。类似于锁。在执行完全部操作后，再允许另一个线程执行操作。使用 Atomics.add() 可以得到正确的最终值。
```js
// 修改上面例子中的 worker.js

self.onmessage = ({data}) => {
  const view = new Uint32Array(data);

  // Perform 1000000 add operations 执行 100 万次加 1 操作
  for (let i = 0; i < 1E6; ++i) {
    // view[0] += 1; 
    // 替换为线程安全加操作。原子操作
    Atomics.add(view, 0, 1)
  }

  self.postMessage(null);
};

// 这样得到最终正确的值
// Final buffer value: 4000001
```

::: tip
第 20 章 详细介绍了 SharedArrayBuffer 与 Atomics API
:::

### 线程池
由于启用工作者线程的代价很大。所以某些情况可以考虑始终保持固定数量的线程活动，需要时就分派任务。工作这线程执行计算时标记为忙碌。空闲时才准备接收新任务。这些活动线程就称为 **线程池** 或者 **工作者线程池**。

线程池中线程的数量，可以参考 CPU 核心数 navigator.hardwareConcurrency，不要超过这个数即可。下面来看一个线程池的实现示例

TaskWorker
```js
class TaskWorker extends Worker {
  constructor(notifyAvailable, ...workerArgs) {
    super(...workerArgs);

    // Initialize as unavailable
    this.available = false;
    this.resolve = null;
    this.reject = null;

    // Worker pool will pass a callback so that the
    // worker can signal it needs another task
    this.notifyAvailable = notifyAvailable;

    // Worker script will send a 'ready' postmessage 
    // once fully initialized
    this.onmessage = () => this.setAvailable();
  }

  // Called by the worker pool to begin a new task
  dispatch({ resolve, reject, postMessageArgs }) {
    this.available = false;

    this.onmessage = ({ data }) => {
      resolve(data);
      this.setAvailable();
    };

    this.onerror = (e) => {
      reject(e);
      this.setAvailable();
    };

    this.postMessage(...postMessageArgs);
  }

  setAvailable() {
    this.available = true;
    this.resolve = null;
    this.reject = null;
    this.notifyAvailable();
  }
}
```
WorkerPool
```js
class WorkerPool {
  constructor(poolSize, ...workerArgs) {
    this.taskQueue = [];
    this.workers = [];

    // Initialize the worker pool
    for (let i = 0; i < poolSize; ++i) {
      this.workers.push(
        new TaskWorker(() => this.dispatchIfAvailable(), ...workerArgs));
    }
  }

  // Pushes a task onto the queue
  enqueue(...postMessageArgs) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ resolve, reject, postMessageArgs });

      this.dispatchIfAvailable();
    });
  }

  // Sends a task to the next available worker if there is one
  dispatchIfAvailable() {
    if (!this.taskQueue.length) {
      return;
    }
    for (const worker of this.workers) {
      if (worker.available) {
        let a = this.taskQueue.shift();
        worker.dispatch(a);
        break;
      }
    }
  }

  // Kills all the workers
  close() {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}
```

使用上面的线程池，实现计算 1000 万个浮点数之和
```js
// worker.js
self.onmessage = ({data}) => {
  let sum = 0;
  let view = new Float32Array(data.arrayBuffer)
  
  // Perform sum
  for (let i = data.startIdx; i < data.endIdx; ++i) {
    // No need for Atomics since only performing reads
    sum += view[i];
  }

  // Send the result to the worker
  self.postMessage(sum);
};

// Send messagemessate to TaskWorker to signal worker is
// ready to receive tasks.
self.postMessage('ready');
```
main.js 使用线程池
```js
// main.js
Class TaskWorker {
  ...
]

Class WorkerPool {
  ...
}

const totalFloats = 1E8;
const numTasks = 20;
const floatsPerTask = totalFloats / numTasks;
const numWorkers = 4;

// Create pool
const pool = new WorkerPool(numWorkers, './worker.js');

// Fill array of floats
let arrayBuffer = new SharedArrayBuffer(4 * totalFloats);
let view = new Float32Array(arrayBuffer);
for (let i = 0; i < totalFloats; ++i) {
  view[i] = Math.random();
}

let partialSumPromises = [];
for (let i = 0; i < totalFloats; i += floatsPerTask) {
  partialSumPromises.push(
    pool.enqueue({
      startIdx: i,
      endIdx: i + floatsPerTask,
      arrayBuffer: arrayBuffer
    })
  );
}

// Wait for all promises to complete, then sum
Promise.all(partialSumPromises)
  .then((partialSums) => partialSums.reduce((x, y) => x + y))
  .then(console.log);

// (In this example, sum should be roughly 1E8/2)
// 49997075.47203197 
```

::: tip
草率的使用并行计算不一定是最好的方法。线程池的调优策略会因计算任务不同、系统硬件不同而不同。
::: 

## 共享工作者线程(Shared Workers)
由于 专用工作者线程 只能被创建它的页面使用。所以在同源的多个页面都需要使用同一个 worker 时，专用工作者线程就不好用了。这种场景就可以使用共享工作者线程了。

共享工作者线程与专用工作者线程类似，但它可以被多个信任的可执行上下文访问。例如，同源的两个标签页可以访问同一个 shared Workers。SharedWorker 与 Worker 的消息接口稍有不同，包括外部和内部。

```js
// main.js
const sharedWorker = new SharedWorker('./sharedWorker.js')
console.log(sharedWorker) // SharedWorker {port: MessagePort, onerror: null}
```

**SharedWorker 标识与独占**，与专用工作者线程的一个重要区别在于，Worker() 构造函数始终会创建新的实例，而 SharedWorker() 则只会在相同的标识不存在时，才创建新实例。如果已存在就不会创建新实例，而是新建对这个实例的连接并返回。

```js
new SharedWorker('./sharedWorker.js');
new SharedWorker('./sharedWorker.js');
new SharedWorker('./sharedWorker.js');
new SharedWorker('sharedWorker.js');
new SharedWorker('https://www.example.com/sharedWorker.js'); 
```

上面的例子中执行了多次 new SharedWorker()，只会在第一次时创建 共享工作者线程，后面的只是返回对应的连接。

注意：**对于 name 不一样、或者 URL 不一样的情况，还是会创建多个 共享工作者线程**

```js
// 名称不同，创建两个线程
new SharedWorker('./sharedWorker.js', {name: 'foo'});
new SharedWorker('./sharedWorker.js', {name: 'bar'});

// URL不同，创建两个线程
new SharedWorker('./sharedWorker.js'); 
new SharedWorker('./sharedWorker.js?'); 
```
### sharedWorker 对象与 SharedWorkerGlobalScope
sharedWorker 对象支持以下属性：
- `onerror` 发生 ErrorEvent 类型的错误事件时
- `port` 专门用来跟共享线程通信的 MessagePort

**注意sharedWorker实例并没有 terminate()、postMessage() 等方法**

SharedWorkerGlobalScope 是共享线程内部全局作用域 self 的构造函数。 它也是继承 WorkerGlobalScope。它扩展了如下属性或方法：
- `name` 可选的字符串标识符，可以在初始化 SharedWorker 时传入。
- `importScripts()` 向工作者线程中导入任意数量的 js。
- `close()` 与 worker.terminate() 对应，立即终止工作者线程。
- `onconnect` 与共享线程建立新连接时，应将其设置为处理程序。connect 事件包括 MessagePort 实例的 ports 数组，可用于把消息发送回父上下文。通过 worker.port.onmessage 或 worker.port.start() 与共享线程建立连接都会触发 connect 事件

::: warning
根据浏览器的实现，SharedWorker 中把日志打印到控制台不一定能在浏览器默认的控制台中看到。
:::

### 共享工作者线程的生命周期
专用共享工作者线程只和一个页面绑定。而共享工作者线程只要还有一个上下文连接就会持续存在。

```js
// main.js
const worker = new Worker('./worker.js')
```

事件 |  结果 | 事件发生后线程数
--- | --- | ---
标签页 1 执行 main.js | 创建专用线程 1 | 1 
标签页 2 执行 main.js | 创建专用线程 2 | 2 
标签页 3 执行 main.js | 创建专用线程 3 | 3
标签页 1 关闭 | 专用线程 1 终止 | 2
标签页 2 关闭 | 专用线程 2 终止 | 1
标签页 3 关闭 | 专用线程 3 终止 | 0

```js
// main.js
const worker = new SharedWorker('./sharedWorker.js')
```

事件 |  结果 | 事件发生后线程数
--- | --- | ---
标签页 1 执行 main.js | 创建共享线程 1 | 1 
标签页 2 执行 main.js | 连接共享线程 1 | 1
标签页 3 执行 main.js | 连接共享线程 1 | 1
标签页 1 关闭 | 断开与共享线程 1 的连接 | 1
标签页 2 关闭 | 断开与共享线程 1 的连接 | 1
标签页 3 关闭 | 断开与共享线程 1 的连接，没有连接了，终止线程 | 0

### 连接到共享工作者线程
每次调用 SharedWorker() 构造函数，无论是否创建了工作者线程，都会在共享工作者线程内部处罚 connect 事件。
```js
// sharedWorker.js
console.log(self) // console 里面没有打印，-_-
let i = 0;
self.onconnect = () => console.log(`connected ${++i} times`);

// main.js
for (let i = 0; i < 5; ++i) {
  new SharedWorker('./sharedWorker.js');
}

// 浏览器控制台中不一定能看到 -_-
// connected 1 times
// connected 2 times
// connected 3 times
// connected 4 times
// connected 5 times
```

发生 connect 事件时，SharedWorker 会隐式创建 MessageChannel 实例，并把 MessagePort 实例的所有权唯一的转移给该 SharedWorker 的实例。这个 MessagePort 实例会保存在 connect 事件对象的 ports 数组中。

```js
// sharedWorker.js
const connectedPorts = new Set();

self.onconnect = ({ports}) => {
  connectedPorts.add(ports[0]);
  console.log(`${connectedPorts.size} unique connected ports`);
};

// main.js
for (let i = 0; i < 5; ++i) {
  new SharedWorker('./sharedWorker.js');
}

// 1 unique connected ports
// 2 unique connected ports
// 3 unique connected ports
// 4 unique connected ports
// 5 unique connected ports
```

## 服务工作者线程(Service Workers)

Service Worker 服务工作者线程，是一种类似浏览器中代理服务器的线程。**可以拦截请求、缓存响应**，可以让网页在没有网络连接的情况下正常使用。服务工作者线程也可以使用 Notifications API、Push API、Background Sync API 和 Channel Messaging API.

与共享工作者线程类型，来自一个域的多个页面共享一个服务工作者线程。为了使用 Push API 等特性，服务工作者线程也**可以在相关的标签页或浏览器关闭后继续等待到来的推送事件**。

对大多数开发者而言，**Service Worker 在两个主要任务上最有用：充当网络请求的缓存层、启用推送通知**。在这个意义上，Service Worker 就是用于把网页变成像原生应用程序一样的工具。

::: tip
Service Worker 涉及内容非常广，几乎可以单独写一本书了。推荐 Udacity 的课程 "Offline Web Applications"。也可以参考 Mozilla 维护的 Service Worker Cookbook，其中包含了常见的服务工作者线程模式。
:::

### Service Worker 基础
包含以下内容
1. ServiceWorkerContainer
2. 创建 ServiceWorker
3. 使用 ServiceWorkerContainer 对象
4. 使用 ServiceWorkerRegistration 对象
5. 使用 ServiceWorker 对象
6. ServiceWorker 的安全限制
7. ServiceWorkerGlobalScope
8. ServiceWorker 作用域限制

服务工作者线程 与 专用工作者线程 和 共享工作者线程 的一个区别是：没有全局构造函数。由 navigator.serviceWorker 来管理。它的类型是 **ServiceWorkerContainer**。

```js
console.log(navigator.serviceWorker)
// ServiceWorkerContainer { controller: null, ready: Promise, oncontrollerchange: null, onmessage: null, onmessageerror: null}
```
**创建服务工作者线程**
```js
// 注册成功，走 console.log 逻辑
navigator.serviceWorker.register('./serviceWorker.js')
.then(console.log, console.error)
// ServiceWorkerRegistration { .. }

// 注册失败，走 console.error 逻辑
navigator.serviceWorker.register('./notExistWorker.js')
.then(console.log, console.error)
// A bad HTTP response code (404) was received when fetching the script.
// TypeError: Failed to register a ServiceWorker for scope ...
```
一般服务工作者线程对于何时注册是比较灵活的，多次调用 register()，后面的实际什么都不会执行。一般如果之前没有注册过，一般在 load 事件里注册，这样不会影响页面的首次加载。除非该服务工作者线程负责管理缓存（这样的话就要尽早注册，比如使用后面要介绍的 clients.claim()）。

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./serviceWorker.js');
  });
}
```
**使用 ServiceWorkerContainer 对象**

navigator.serviceWorker 支持如下属性、方法、事件：
- `ready 属性` 返回 resolve 为激活的 ServiceWorkerRegistration 对象的 Promise，该 Promise 不会 reject。
- `controller 属性` 返回当前页面关联的、激活的 ServiceWorker 对象，如果没有激活的 ServiceWorker 则返回 null
- `register(url, options) 方法` 创建或更新 ServiceWorkerRegistration.
- `getRegistration() 方法` 返回 resolve 为当前作用域匹配的 ServiceWorkerRegistration 对象的 Promise，如果没有匹配的，则返回 undefined
- `getRegistrations() 方法` 返回 resolve 为当前作用域匹配的 ServiceWorkerRegistration 对象数组的 Promise，如果没有匹配的，则返回空数组
- `startMessage() 方法` 开始传送通过 Client.postMessage() 派发的消息
- `controllerchange 事件` 在获得新激活的 ServiceWorkerRegistration 时触发
- `message 事件` 在 ServiceWorker 脚本向父上下文发送消息时触发
- `error 事件` 在 ServiceWorker 内部抛出错误时触发，以上事件均可以使用 on 或 addEventListener 监听处理

**使用 ServiceWorkerRegistration 对象**

调用 navigator.serviceWorker.register() 成功之后会返回一个 resolve ServiceWorkerRegistration 对象的 Promise。同一页面使用同一 URL 多次调用该方法会返回相同的注册对象。ServiceWorkerRegistration 支持以下属性、方法、事件：
- `scope 属性` 返回 Service Worker 作用域完整的 URL 路径。比如："http://127.0.0.1:5502/fedemo/src/DebugDemo/worker/service_worker/"
- `navigationPreload 属性` 返回与注册对象关联的 NavigationPreloadManager 实例
- `pushManager 属性` 返回与注册对象关联的 pushManager 实例
- `installing 属性` 返回状态为 installing 的 ServiceWorker 对象，否则为 null
- `waiting 属性` 返回状态为 waiting 的 ServiceWorker 对象，否则为 null
- `active 属性` 返回状态为 active 的 ServiceWorker 对象，否则为 null
- `getNotifications() 方法` 返回 resolve 为 Notification 对象数组的 Promise
- `showNotifications() 方法` 显示通知，可以配置 title 和 options 配置
- `update() 方法` 直接从服务器重新请求服务脚本，如果新脚本不同，则重新初始化
- `unregister() 方法` 取消 ServiceWorker 的注册，该方法会在 ServiceWorker 执行完再取消注册
- `updatefound 事件` 在 ServiceWorker 开始安装新版本时触发，表现为 ServiceWorkerRegistration.installing 收到一个新的 ServiceWorker

**使用 ServiceWorker 对象**

ServiceWorker 对象继承自 Worker 对象，可以使用以下两种方法获取
1. navigator.serviceWorker.controller
2. ServiceWorkerRegistration对象.active

ServcieWorker 对象支持以下属性、方法、事件：
- `scriptURL 属性` 解析后注册 ServiceWorker 的 URL，比如 "http://127.0.0.1:5502/fedemo/src/DebugDemo/worker/service_worker/serviceWorker.js"
- `state 属性` 表示 ServiceWorker 状态，值可能是：installing、installed、activating、activated、redundant `[rɪˈdʌndənt]` 冗余的、不需要的(已失效)
- `postMessage() 方法` 向父上下文发送消息
- `statechange 事件` 在 ServcieWorker.state 状态变更时触发
- `error 事件` 在 serviceWorker 发送错误时触发

**ServiceWorker 的安全限制**

与其他工作者线程一样，服务工作者线程也需要同源。另外由于 ServiceWorker 几乎可以任意修改和重定向网络请求，以及加载静态资源，ServiceWorker API 只能在安全上下文（HTTPS）中使用。在 http 中 navigator.serviceWorker 为 undefined。为方便开发浏览器豁免了 localhost 和 `http://127.0.0.1` 在安全方面的限制，可以使用 window.isSecureContext 确定当前上下文是否安全。

**ServiceWorkerGlobalScope**

在 ServiceWorker 内部，全局上下文是 ServiceWorkerGlobalScope 实例。它继承自 WorkerGlobalScope，因此拥有它的所有属性和方法。可通过 self 关键字访问全局上下文。ServiceWorkerGlobalScope 扩展了以下属性、方法、事件
- `caches` 返回 ServiceWorker 的 CacheStorage 对象
- `clients` 返回 ServiceWorker 的 Clients 接口，用于访问底层的 Client 对象
- `registration` 返回 ServiceWorker 的 ServiceWorkerRegistration 对象
- `skipWaiting() 方法` 强制 ServiceWorker 进入 active 状态，需要跟 Clients.claim `[kleɪm]` 一起使用。
- `fetch() 方法` 在 serviceWorker 内发送常规网络请求，用于 serviceWorker 确定有必要发送实际网络请求，而不是返回缓存值时。
- `install 事件` 在 ServiceWorker 进入安装状态时触发，通过 ServiceWorkerRegistration.installing 判断，serviceWorker 内部接收到的第一个事件，一开始执行就会触发。每个 service worker 只调用一次。
- `activate 事件` 在 ServceWorker 进入 激活 或 已激活状态时触发，通过 ServiceWorkerRegistration.active 判断。一般发生在 ServiceWorker 准备好处理功能性事件和控制客户端时触发。表示具有控制客户端的条件。
- `fetch 事件` Fetch API ，在 ServiceWorker 截获来自主页面的 fetch() 请求时触发
- `message 事件` Message API，在 ServiceWorker 通过 postMessage() 获取数据时触发
- `notificationclick 事件` Notification API，在用户点击了 ServiceWorkerRegistration.showNotification() 生成的通知时触发。
- `notificationclose 事件` 在用户关闭或取消了 ServiceWorkerRegistration.showNotification() 生成的通知时触发。
- `push 事件` Push API，在 ServiceWorker 接收到消息推送时触发
- `pushsubscriptionchange 事件` 在应用控制外的因素（非 JS 显式操作）导致推送订阅状态发生变化时触发

**ServiceWorker 作用域限制**

ServiceWorker 仅能拦截其作用域内的客户端发送的请求，默认为 serviceWorker 脚本路径，也可以在 register() 时，通过 options 参数的 scope 指定
```js
navigator.serviceWorker.register('/serviceWorker.js', { 
  scope: '/foo/'
}).then(serviceWorkerRegistration => {
  console.log(serviceWorkerRegistration.scope)
  // 'http://www.xxx.com/foo/'
})

// 会被拦截
fetch('/foo/fooScript.js')
// 不会被拦截
fetch('/foo.js')
fetch('/baz/bazScript.js')
```
一般 scope 参数，只能缩小作用域，如果 serviceWorker.js 在 `/foo/` 目录下，而 scope 指定为 `/` 则会抛出错误。因为这样扩展了作用域。如果想要 扩展 扩展 serviceWorker 作用域有两种方法：
1. 修改 seriveWorker.js 的路径到想要的作用域路径下
2. 设置服务器响应头 Service-Worker-Allowed 为想要的作用域，或者 * 

### Service Worker 缓存
在 Service Worker 前，网页缺少缓存网络请求的稳健机制，浏览器一直使用 HTTP 缓存，但 HTTP 缓存并没有对 JS 暴露编程接口。之前的缓存方案 AppCache 需要很多前提条件，已废弃。

**Service Worker 的一个主要能力就是可以通过编程方式实现真正的网络请求缓存控制。** 它遵循以下几点
1. ServiceWorker 缓存不自动缓存任何内容，所有缓存必须明确指定
2. ServiceWorker 缓存没有失效的概念，除非明确删除，否则缓存内容一直有效
3. ServiceWorker 缓存必须手动更新和删除
4. 缓存版本必须手动管理
5. ServiceWorker 缓存占用空间超过限制时，会将最近最少使用（LRU，Least Recently Used）的缓存内容删除，为新缓存腾出空间。

在 ServiceWorker 脚本中，使用 caches 或 self.caches 获取 CacheStorage 对象，它类似于 Map。支持如下方法
- `caches.open(keyStr)` 通过字符串键获取对应的 Cache，如果不存在，就会创建。Cache 对象通过 Promise resolve 返回 。如果参数是非字符串，会转换为字符串
- `caches.has(keyStr)` 返回 Promise，resolve 为是否包含该 key 的布尔值
- `caches.delete(keyStr)` 返回 Promise，删除对应的 key
- `caches.keys()` 返回 Promise，resolve 为 caches 中对应的 key 数组
- `caches.match(request, options)` 根据 Request 对象搜索 CacheStorage 中的所有 Cache 对象，所示顺序按 CacheStorage.keys() 顺序，返回匹配的第一个响应 

```js
navigator.serviceWorker.register('./serviceWorker.js')
  .then((registration) => {
    caches.open('v1').then(cache => {
      caches.has('v1').then(console.log) // true
      console.log(cache) // Cache {}
      caches.has('v2').then(console.log) // false
      caches.delete('v1')
        .then(() => caches.has('v1'))
        .then(console.log) // false
    }) 

    caches.open('a1')
      .then(() => caches.open('a2'))
      .then(() => caches.open('a3'))
      .then(() => caches.keys())
      .then(console.log) // ["a1", "a2", "a3"]

    const request = new Request('abc') // key
    const response1 = new Response('s1')
    const response2 = new Response('s2')
    caches.open('s1')
      .then((s1cache) => s1cache.put(request, response1))
      .then(() => caches.open('s2'))
      .then((s2cache) => s2cache.put(request, response2))
      .then(() => caches.match(request))
      .then((res) => res.text())
      .then(console.log) // s1
  }, console.error)
```

通过 caches.open() 方法可以获取或创建 Cache 对象，Cache 对象和 Map 类似，也是键值对，他的 key 可以是 URL 字符串、Request 对象。这些键会映射到 Response 对象。

Service Worker 缓存只考虑缓存 HTTP 的 GET 请求，Cache 不允许使用 POST、PUT、DELETE 等请求方法。Cache 对象支持如下方法
- `put(request, response)` 在键（Request 对象或 URL 字符串）和值（Response 对象）都存在时，添加缓存项。返回 Promise，添加成功后 resolve
- `add(request)` 在只有 Request 对象或 URL 时，使用此方法发送 fetch() 请求，并缓存响应。返回 Promise，在添加成功后 resolve
- `addAll(requests)` addAll() 会对 request 数组中的每一项都调用 add()，返回 Promise，在所有缓存内容添加成功时 resolve
- `delete(request)` 删除，Promise 方式
- `keys()` 列出所有 key，Promise 方式
- `matchAll(request, options)` 根据 request 检索缓存，返回 Promise，resolve 为 Response 数组。
- `match(request, options)` 根据 request 检索缓存，返回 Promise，resolve 为 Response 对象。相当于 matchAll(request, options)[0]，查找不到则为 undefined

```js
navigator.serviceWorker.register('./serviceWorker.js')
  .then(registration => {
    const request1 = 'https://www.foo.com'
    const request2 = new Request('https://www.bar.com')
    const response1 = new Response('fooResponse')
    const response2 = new Response('barResponse')
    caches.open('v1').then(cache => {
      cache.put(request1, response1)
        .then(() => cache.put(request2, response2))
        .then(() => cache.match(new Request('https://www.foo.com')))
        .then(res => res.text())
        .then(console.log) // 'fooResponse'
        .then(() => cache.match('https://www.bar.com'))
        .then(res => res.text())
        .then(console.log) // 'barResponse'
    })
  })
```
**注意 Cache 对象 添加值时，key 和 value 都是 clone() 后存储的。并不等于之前的 Request 和 Response 对象**

Catch.match()、Cache.matchAll() 和 CatchStorage.match() 都支持可选的 options 对象，它允许通过以下属性来配置 URL 匹配的行为
- `cacheName` 只有 CatchStorage.matchAll() 支持，设置字符串时，只会匹配 Ciche 键为指定字符串的缓存值
- `ignoreSearch` 设置为 true 时，在匹配 URL 时会忽略查询字符串
- `ignoreMethod` 设置为 true 时，在匹配时忽略查询的 HTTP 方法。比如如果设置了该参数为 true，用 POST 的 request 可以匹配到对应的 GET request
- `ignoreVary` 匹配时是否考虑 HTTP 的 Vary 头部，为 ture 时忽略 该头部，详情参见 p828

**最大存储空间**，使用 StorageEstimate API 可以大致的获取有多少空间可用，以及当前使用了多少空间，此方法只在安全上下文中可用。

```js
navigator.storage.estimate().then(console.log)
// 可用空间，单位 字节  299,977,904,946
// 不同的浏览器可能不同，mac chrome
// {quota: 299977904946, usage: 0, usageDetails: {…}}
```

### Service Worker 客户端
使用 self.clients 或 clients 可以获取 Clients 接口。可以通过 Clients 接口访问 Client 对象。Client 对象用于跟踪关联的窗口、Web Worker、Service Worker。Client 对象支持以下属性和方法
- `id` 返回客户端的全局唯一标识，例如 'ab123e43-xxxx-xxxx..'，id 可用于 clients.get() 获取客户端的引用
- `type` 客户端类型，可能是 window, worker 或 shadowworker
- `url` 返回客户端的 URL
- `postMessage()` 向单个客户端发送消息

Clients 接口支持如下属性和方法
- `get(id)` 返回一个匹配给定 id 的 Client 的 Promise .
- `matchAll(options)` 返回一个 Client 对象数组的 Promise . options对象，允许为匹配操作设置选项。 可用选项包括:
  - includeUncontrolled: Boolean  如果设置为true, 匹配操作将返回与当前服务工作者共享相同源的所有服务工作者客户端。 否则，它仅返回由当前服务工作者控制的服务工作者客户端。 默认值为false.
  - type: 设置想要匹配的 clients 类型. 可用值包括 window, worker, sharedworker, 和 all. 默认是 all.
- `openWindow(url)` 在新窗口中打开之地你个 url，实际会给当前 service worker 添加一个新的 Client，以 Promise 方式返回。
- `claim()` 允许一个激活的 service worker 将自己设置为其 scope 内所有 clients 的 controller。可用于不希望等页面重新加载而让 Service Worker 开始管理页面。

### Service Worker 与一致性
Service Worker 的最终用途是：让网页能够模拟原生应用，像原生应用一样，service worker 必须支持版本控制（versioning）

Service Worker 版本控制，可以确保任何时候两个玩个的操作都有一致性。该一致性可表现为以下两种形式
- 代码一致性
- 数据一致性

为确保一致性，Servcie Worker 声明周期会尽量避免出现有损一致性的现象。比如下面这些可能
- Service Worker 提早失败，在 register Service Worker 时，任何预料之内的问题都可能阻止 Servcie Worker 成功安装。
- Service Worker 激进更新，浏览器再次加载 service worker 脚本时，服务脚本或通过 importScripts() 加载的依赖中哪怕有一个字节的差异，也会启动安装新版本的 service worker
- 未激活的 Service Worker 消极活动，当页面上第一次调用 register() 时，service worker 会被安装，但不会被激活，且在导航事件发生前不会控制页面。可以认为当前页面已经加载了资源，因此 Service Worker 不应该被激活，否则就会加载不一样的资源。
- 活动的 Service Worker 粘连，只要有一个客户端关联到活动的服务工作者线程，浏览器就会在该源的所有页面使用它，浏览器在活动实例关联的客户端为 0 之前不会切换到新 service worker.

### Service Worker 生命周期
Service Worker 有 6 种可能存在的状态：
```js
navigator.serviceWorker.register('./serviceWorker.js')
  .then((registration) => {
    // 首次加载时
    registration.installing.onstatechange = ({ target: { state }}) => {
      console.log('state changed to', state)
    }
    // state changed to installed
    // state changed to activating
    // state changed to activated
  })
```
- **已解析（parsed）状态**，register() 第一次调用时会创建 service worker 实例，刚创建实例时，会进入 parsed 状态，该状态并没有事件，也没有与之相关的 ServiceWorker.state。浏览器获取脚本文件，然后执行一些初始化任务，Service Worker 生命周期就开始了。所有下面的任务 OK 后，会返回一个 resolve 为 ServiceWorkerRegistration 对象的 Promise，创建的 Service Worker 进入安装中状态。
  - 确保 service worker 脚本来自相同的源
  - 确保在安全的上下文 https 中注册 service worker
  - 确保服务脚可以被浏览器 JS 解释器成功解析而不会抛出任何错误
  - 捕获服务脚本的快照，下一次加载该脚本时进行比对，并据此决定是否更新该 service worker
- **安装中（installing）状态**，该状态时 ServiceWorkerRegistration.installing 值为 ServiceWorker 对象。在 serviceWorker.js 中 self.oninstall 可以指定该状态时的事件处理程序。该事件 event 为 InstallEvent 对象，继承自 ExtendableEvnet 对象，该对象暴露了一个 API waitUitl() 允许将状态延迟到这个 Promise resolve。一般在这个状态会通过 Cache.addAll() 缓存一组资源后再过渡到 已安装 状态。
  ```js
  navigator.serviceWorker.register('./serviceWorker.js')
    .then((registration) => {
      if (registration.installing) {
        console.log('service worker 处于 installing 状态')
      }
      registration.onupdatefound = () => {
        console.log('有新版本，service worker 处于 installing 状态')
      }
    })

  // serviceWorker.js
  console.log('start serviceWorker.js')
  self.oninstall = installEvent => {
    console.log(installEvent, installEvent.waitUntil)
    // 状态停留在 安装中，5s 后状态变为 已安装 状态
    installEvent.waitUntil((async () => {
      // await new Promise(r => setTimeout(() => r(), 5000))
      await new Promise(r => setTimeout(r, 5000))
      // 5s 后执行，然后状态变为 
      console.log('5s 后')
    })())
  }
  ```
- **已安装（installed） 状态**，已安装状态也称为 **等待中（waiting）** 状态，可以检查 ServiceWorkerRegistration.waiting 是否设置为 ServiceWorker 实例来确定。如果没有活动的 ServiceWorker 则新安装的 ServiceWorker 会跳过这个状态，直接进入 激活中。 可以通过 self.skipWaiting() 强制进入激活中状态。
 ```js
  navigator.serviceWorker.register('./serviceWorker.js')
    .then((registration) => {
      if (registration.waiting) {
        console.log('service worker 处于 installed/waiting 状态')
      }
    })
 ```
- **激活中（activating）状态**，表示 Service Worker 已经被浏览器选中，即将变成可以控制页面的 Service Worker。如果浏览器中没有活动的 Service Worker 则新的 Service Worker 自动到达激活中状态。如果有一个活动 ServiceWorker，则这个作为替代的 ServiceWorker 可以通过如下方式进入激活中状态：
  - 原有 ServiceWorker 空值的客户数变为 0，意味着标签页都关闭了。在下一个导航时间时，新 Service Worker 会达到激活中状态。
  - 调用 self.skipWaiting()，这样可以立即生效，而不必等下一次导航事件
  ```js
  // 激活中的状态不能像已激活状态中那样，执行发送请求或推送事件的操作
  // 激活中或已激活状态 SercieWorkerRegistration.active 会被设置为 ServiceWorker 对象
  // 激活中状态会触发 self.onactivate 事件
  // activateEvent 也继承自 ExtendableEvent，因此也支持 waitUntil 方法
  // 可以延迟过渡到已激活状态
  const CACHE_KEY = 'v3'
  self.onactivate = activateEvent => {
    console.log('Servcie worker 处于激活中状态')
    // 可以将老版本的缓存清除
    caches.keys()
      .then(keys => keys.filter(key => key != CACHE_KEY))
      .then(oldKeys => oldKeys.forEach(oldKey => caches.delete(oldKey)))
  }
  ```
- **已激活（activated）状态**，表示 ServiceWorker 正在控制一个或多个客户端。在这个状态中，Service Worker 可以捕获其作用域内的 fetch() 事件，通知和推送事件。
  ```js
   navigator.serviceWorker.register('./serviceWorker.js')
    .then((registration) => {
      if (registration.active) {
        console.log('service worker 处于 activating/activated 状态')
         console.log(navigator.serviceWorker.controller) // ServiceWorker
      }
    })
  navigator.serviceWorker.oncontrollerchange = () => {
    // 未触发
    console.log('一个新的 service worker 控制了该客户端')
  }
  navigator.serviceWorker.ready.then(() => {
    console.log('ready:service worker 进入已激活状态')
  })
  ```
- **已失效（redundant）状态** `[rɪˈdʌndənt]`，在 Chrome DevTools 中，Application - Service Workers 中点击 Unregister 可以让一个 service worker 失效，失效后的 service worker 不会再有事件发给他。
- **更新 Service Worker**，因为版本控制的概率存在与整个生命周期，如果 service worker 版本变化，会更新检查，如果有更新，会初始化一个新的 service worker。详情参见 p834
### IoC 与 Service Worker 持久化
专有 Worker 和 共享 Worker 是有状态的，但 ServiceWorker 是无状态的，它遵循控制反转（IoC, Inversion of Control）模式并且是事件驱动的。

Service Worker 不应该依赖其全局状态，绝大多数代码应该在事件处理程序中定义。

### 通过 updateViaCache 管理服务文件缓存
在 HTTP 缓存中，服务端有两种方式来控制前端使用缓存
- 强缓存，通过响应头设置缓存时间 Expries（http 1.0）/Cache-Control (http 1.1），前端状态码 200
- 弱缓存，也叫协商缓存，服务器再验证的方式，通过设置 Last-Modified(最后一次修改时间) 或 ETag(资源标识) 响应头，再次接收到请求时，将对应的 If-Modified-Since/if-None-Macth 进行比对，如果没变化就返回状态码 304，Not Modified

前端有两种方式控制不使用服务器 HTTP 缓存
- 设置请求头 Cache-Control': 'no-cache' 
- 设置请求头 Pragma: 'no-cache'

在注册/创建 Service Worker 时，可以通过 options 中的 updateViaCache 字段在前端控制 service worker 脚本缓存
```js
navigator.serviceWorker.register('./serviceWorker.js', {
  updateViaCache: 'none'
})
```
updateViaCache 可以是如下三个值
- `imports` 默认值，顶级 service worker 脚本永远不会缓存，但通过 importScripts() 导入的文件会遵循普通 HTTP 缓存规则
- `all` service worker 脚本没有任何特殊待遇，所有文件都会遵循 HTTP 缓存规则
- `none` service worker 脚本和 importScripts() 导入的文件都不会被缓存

参考：[通过koa写demo彻底理解前端http缓存 - 左小白的技术日常](http://www.zuo11.com/blog/2020/9/web_cache.html)

### 强制性 Service Worker 操作
Service Worker 中有三种强制操作
- self.skipWaiting() 让 service worker 进入激活状态，一般在 self.oninstall 中缓存资源后再调用该方法
- clients.claim() 强制 service worker 接管客户端，会在每个客户端触发 controllerchange 事件。一般在 self.onactive 激活中状态时调用，会变为已激活
- registration.update() 强制重新获取 service worker 脚本

示例代码参考 p836

### Service Worker 消息
在客户端，创建 service worker 后，会返回一个 ServiceWorkerRegistration 对象，在服务已激活后，使用该 active 属性可以获取 ServiceWorker 对象，可以使用 ServiceWorker 对象的 postMessage() 给 service worker 发送消息。service worker 接收到消息后，通过消息中的 source 可以拿到 WindowClient 对象，通过该对象的 postMessage() 可以给客户端发送信息

main.js
```js
navigator.serviceWorker.onmessage = (res) => {
  // res - MessageEvent
  console.log(res, res.data)
  console.log('接收到来自 service worker 的消息:', res.data)
  // 接收到来自 service worker 的消息: msg from service
}

navigator.serviceWorker.register('./serviceWorker.js')
  .then((registration) => {
    if (registration.active) {
      // registration.active - ServiceWorker {}
      registration.active.postMessage('msg from client')
    }
  })
```
serviceWorker.js 
```js
self.onmessage = (res) => {
  // res - ExtendableMessageEvent {}
  // res.source - WindowClient => 继承自 Client，所以有 postMessage()
  console.log(res, res.data, res.source)
  console.log('servcie 接收到消息：', res.data) 
  // servcie 接收到消息： msg from client 
  res.source.postMessage('msg from service')
}
```
在 main.js 中，还可以通过 navigator.serviceWorker.controller 来获取 ServiceWorker 对象
```js
// main.js
navigator.serviceWorker.register('./serviceWorker.js')
  .then((registration) => {
    if (navigator.serviceWorker.controller) {
      // ServiceWorker {}
      navigator.serviceWorker.controller.postMessage('msg from client')
    }
  })
```
上面的例子中是客户端先发送消息，service worker 再接通过消息中的 source 来向客户端发消息。如果 service worker 首先发消息，可以通过下面的方法
```js
// servcieWorker.js
self.onmessage = (res) => {
  console.log('servcie 接收到消息：', res.data) 
}
// 只触发一次，调试时需要在控制台，将该 service worker Unregister 刷新测试
self.onactivate = () => {
  self.clients.matchAll({ includeUncontrolled: true })
    .then((clientMatchs) => clientMatchs[0].postMessage('foo'))
}
```
main.js
```js
navigator.serviceWorker.onmessage = (res) => {
  console.log('接收到来自 service worker 的消息:', res.data)
  // 接收到来自 service worker 的消息: foo
}
navigator.serviceWorker.register('./serviceWorker.js')
  .then((registration) => {
  })
```
除了通过上面的方法发送消息外，也可以通过 MessageChannel 和 BroadcastChannel 来发送消息

### 拦截 fetch 事件
Service Worker 最重要的一个特性就是拦截网络请求，service worker 作用域中的网络请求会注册为 fetch 事件。它的拦截不限于 fetch() 方法发送的请求，也拦截 js、css、image、html文档 等资源发送的请求。

客户端发送请求，在 service worker 中的 self 上会触发 fetch 事件，该事件的 event 是 FetchEvent 类型，继承自 ExtendableEvent。支持如下属性、方法
- `request` 拦截请求的 Request 对象
- `respondWith()` 拦截请求后，决定怎么响应数据给前端。

respondWidth() 一般有如下几种请求
- **从网络返回** 仅转发 fetch 事件，适用于 PUT、POST 请求等，如果 respondWith() 没有被调用，浏览器也会通过网络发送请求
  ```js
  self.onfetch = fetchEvent => {
    fetchEvent.respondWith(fetch(fetchEvent.request))
  }
  ```
- **从缓存返回**，对于肯定有缓存的资源，可以采用该策略，比如安装阶段缓存的资源
  ```js
  self.onfetch = fetchEvent => {
    fetchEvent.respondWith(caches.match(fetchEvent.request))
  }
  ```
- **从网络返回，缓存作为后备**，将网络获取新数据作为首选，如果需要展示最新数据，但在离线时仍要展示一些信息时，就可以采用该策略
  ```js
  self.onfetch = fetchEvent => {
    fetchEvent.respondWith(
      fetch(fetchEvent.request)
        .catch(() => caches.match(fetchEvent.request))
    )
  }
  ```
- **优先查缓存，网络作为后备**，这个策略优先考虑响应速度，但仍然会在没有缓存的情况下发送网络请求，这是绝大多数 PWA (Progress Web Application) 采取的首选策略。
  ```js
  self.onfetch = fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request)
        .then(response => response || fetch(fetchEvent.request))
    )
  }
  ```
- **通用后备** 考虑到缓存和网络都不可用的气你，servcie worker 可以在 安装时缓存后备资源，然后在缓存和网络都失败时返回他们
  ```js
  self.onfetch = fetchEvent => {
   fetchEvent.respondWith(
      caches.match(fetchEvent.request)
        .then(response => response || fetch(fetchEvent.request))
        .catch(() => catchs.match('/fallback.html'))
    )
  }
  ```
### 推送通知
推送通知一般需要支持服务器推送，在常规网页中是不可能的。service worker 可以实现该行为
- service worker 可以显示通知
- service worker 可以处理这些通知的交互
- service worker 能够订阅服务器发送的推送通知
- service worker 能够处理推送消息，即使应用没有在前台运行或者根本没打开

**1. 显示通知**

在 service worker 中可以使用 ServcieWorkerRegistration 对象支持 showNotifications() 方法来显示通知，可以配置 title 和 options 配置
```js
navigator.serviceWorker.register('./serviceWorker.js')
  .then((registration) => {
    Notification.requestPermission()
      .then(status => {
        if (status === 'granted') {
          registration.showNotification('title')
        }
      })
  })
```
在 serviceWorker.js 中使用 self.registration 也可以显示通知
```js
// 注意 onactivate 默认只触发一次
self.onactivate = () => self.registration.showNotification('bar')
```

**2. 处理通知事件**

ServiceWorkerRegistration 对象创建的通知会向 service worker 发送 notificationclick 和 notificationclose 事件
```js
self.onnotificationclick = (event) => {
  // NotificationEvent {}, Notification {}
  console.log('notification click', event, event.notification)
  // 点击通知后，在新的 tab 打开网页
  clients.openWindow('http://www.zuo11.com')
}
self.onnotificationclose = (event) => {
  console.log('notification close', event, event.notification)
}
```

**3.订阅推送事件**

使用 registration.pushManager.subscribe() 可以对服务器推送消息发起订阅。注意这个过程中不会发送请求到我们的应用服务器。该函数包含两个参数：
- `userVisibleOnly` 通常被设置为 true，用来表示后续信息是否展示给用户。
- `applicationServerKey` 秘钥，类型为 Uint8Array，用于加密服务端的推送信息，防止中间人攻击，会话被攻击者篡改。测试时，可以通过 [web-push-codelab](https://web-push-codelab.glitch.me/) 网站获取秘钥并验证全流程，将该网站随机生产的 Application Server Keys 中的 Public Key 使用 urlBase64ToUint8Array() 转换后即可当做 applicationServerKey 使用

urlBase64ToUint8Array() 函数代码
```js
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```
**该函数返回一个 Promise，resolve 为 PushSubscription 对象，该对象包含服务器推送时必要的信息** 不同的浏览器，对应的 endpoint 不一样。Chrome 和 Firefox 会不一样，如下图

![sw_push.png](/images/js/sw_push.png)

:::warning
如果一直卡在 registration.pushManager.subscribe()，不向下执行，状态一直时 pending，可能是因为 Chrome 浏览器关于推送消息的功能，被墙了，需要翻墙才能正常返回
:::

订阅代码如下：
```js
// main.js
(async () => {
  try {
    const registration = await navigator.serviceWorker.register("sw.js");
    const status = await Notification.requestPermission()
    if (status === 'granted') {
      const vapidPublicKey = 'BF9WWlvQiKSOwziO4gVeBdMeuhDW2HU2aCWAmaSLgXqGCGZK3ho15l30oQ6pdavh8acsc1kiXJNK-DtaqbHaZCQ';
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      // 防止 DOMException: Failed to execute 'subscribe' on 'PushManager': Subscription failed - no active Service Worker
      if (!registration.active) {
        // 等待变为激活状态
        await new Promise(r => setTimeout(r, 500))
      }
      const pushSubscription = await registration.pushManager.subscribe({
        applicationServerKey: convertedVapidKey, // 来自服务器的公钥
        userVisibleOnly: true
      });
      console.log(pushSubscription) // PushSubscription
      console.log(JSON.stringify(pushSubscription)) // 这个消息可用于服务端发起推送
      // { 
      //   "endpoint": "https://fcm.googleapis.com/fcm/send/ecbqKLEnhB8:APA91bGvTW0x3k57bT9gDMLPPVkwLotGJyqJ1kk8yvNHyNAJ8Z0F6O74BuA8QxVNPIsgf1gWlGrUe0bYSs4L6fo-Fl18WkwGyHc3FEo2YvSUXBr5AA7KenaZBkL1D87WuAE7ERl-JCM4",
      //   "expirationTime": null, 
      //   "keys": { 
      //     "p256dh": "BIpKDNOPNQcBnfJVmdtZM2eJ0qS-FjicsiZK8jyUU07lGREwM_VZe2ulIWdrdlNlg7RFnHge8vJSe5y6TagW3Oc",
      //     "auth": "IlAite8VLBLWV5ubUXg91w"
      //   }
      // }
    }
  } catch (err) {
    console.log(err);
  }
})()
```
上面的例子中，成功拿到 JSON.stringify(pushSubscription) 后，就可以在服务端使用该信息进行推送通知了。

**4.处理服务端推送消息**

```js
// sw.js
// 当接收到服务端推送的消息时
self.onpush = pushEvent => {
  // 服务器推送的消息文本
  console.log(pushEvent.data.text())
  // 保持 service worker 活动到显示通知 resolve
  pushEvent.waitUntil(
    // 将服务器推送的消息作为通知显示
    self.registration.showNotification(pushEvent.data.text())
  )
}
// 点击消息时
self.onnotificationclick = (event) => {
  // NotificationEvent {}, Notification {}
  console.log('notification click', event, event.notification)
  // 点击通知后，在新的 tab 打开网页
  clients.openWindow('http://www.zuo11.com')
}
```

现在来测试下，上面的例子中，我们使用 [web-push-codelab](https://web-push-codelab.glitch.me/) 网站获取了 applicationServerKey 秘钥，我们同样可以在该网站发起服务端消息推送。将之前我们获取的 JSON.stringify(pushSubscription) 字符串拷贝到该网站的 Subscription to Send To 那一栏，然后在 Text to Send 中填写需要推送的消息。再点击 Send Push Message 按钮即可进行服务器推送。

这样就可以看到通知了。上面只是为了方便测试，如果需要使用程序化的方式来进行服务端推送，那就需要把 JSON.stringify(pushSubscription) 字符串传到后端，以 Node.js 为例，后端可以使用 [web-push](https://github.com/web-push-libs/web-push) 来进行服务端推送。

参考：
- [Service Worker学习与实践（三）——消息推送 - 知乎](https://zhuanlan.zhihu.com/p/57225424)
- [Service Worker学习与实践（三）——消息推送 - CSDNs](https://blog.csdn.net/weixin_33841722/article/details/88731760)
- [Push API - W3C Editor's Draft 07 October 2020](https://w3c.github.io/push-api/#widl-PushManager-subscribe-Promise-PushSubscription--PushSubscriptionOptions-options)