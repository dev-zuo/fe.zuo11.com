---
title: 27. 工作者线程(Web Workers) - JS高程4
description: JavaScript 是单线程的，这样可以保证它与浏览器 API 兼容。如果 JavaScript 可以多线程执行并发更改，那么像 DOM 这样的 API 就会出现问题。单线程意味着不能把工作委托给独立的线程、进程去做。这就是 工作者线程 存在的价值所在：允许把主线的工作转嫁给独立的实体，而不会改变现有的单线程模型。它的特点是独立于 JavaScript 主执行环境。
keywords: 
---

# 27. 工作者线程(Web Workers)

> 官方文档规范参考：[Web Workers - HTML Standard](https://html.spec.whatwg.org/multipage/workers.html)

JavaScript 是单线程的，这样可以保证它与浏览器 API 兼容。如果 JavaScript 可以多线程执行并发更改，那么像 DOM 这样的 API 就会出现问题。因此 POSIX 线程与 Java 的 Thread 类等传统并发结构都不适合 JavaScript。

单线程意味着不能把工作委托给独立的线程、进程去做。这就是 **工作者线程（Web Workers）** 存在的价值所在：允许把主线的工作转嫁给独立的实体，而不会改变现有的单线程模型。它的特点是独立于 JavaScript 主执行环境。

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
3. `服务工作者线程（Service Workers）`，与专用共享工作者线程和共享工作者线程不同，**它主要用于拦截、重定向和修改页面发出的请求，充当网络请求的仲裁者角色**。

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
第 20 章 详细介绍了 SharedArrayBuffer 和 Atomics API
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

服务工作者线程 与 专用工作者线程 和 共享工作者线程 的一个区别是：没有全局构造函数。由 navigator.serviceWorker 来管理。它的类型是 ServiceWorkerContainer。

```js
console.log(navigator.serviceWorker)
// ServiceWorkerContainer { controller: null, ready: Promise, oncontrollerchange: null, onmessage: null, onmessageerror: null}
```
创建服务工作者线程
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

