# 20. JavaScript API

HTML5 规范定义了一批增强已有标准的 API 和浏览器特性。另外一些规范，如 Web Cryptography 和 Notifications API 只为一个特性定义了一个 API。不同的浏览器对新 API 的实现情况不同，本章仅介绍与大多数开发者相关，已经得到多个浏览器支持，且本书中其他章节没有涵盖的内容。主要内容有 Atomics 与 SharedrrayBuffer、跨上下文消息、Encoding API、File API 与 Blob API、拖放、Notifications API、Page Visibility API、Streams API、计时 API、Web components、Web Cryptography API。

## Atomics 与 SharedrrayBuffer
Atomics API 是 ES2017 新增的 API。在 Web Worker 中，如果多个线程操作共享缓冲区（SharedArrayBuffer）时，就可能出现资源争夺的问题，Atomics（原子操作）API 通过强制同一时刻只能对一个缓冲区执行一个操作，可以让多个上线文安全的读写一个 SharedArrayBuffer。

### SharedArrayBuffer
SharedArrayBuffer 与 ArrayBuffer 具有同样的 API，主要区别是 ArrayBuffer 只能被当前执行上下文使用。SharedArrayBuffer 可以被多个执行上下文同时使用。下面是 4 个专用工作者线程（Dedicated Workers）操作同一个 SharedArrayBuffer 的实例：

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
// 通过 typed array 向 sharedArrayBuffer 写入值 1
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

为了解决这个问题，可以使用 Atomics API，执行原子操作。`view[0] += 1` 改为 `Atomics.add(view, 0, 1)`。关于多个 Worker 操作 SharedArrayBuffer 可以参考 [工作者线程数据传输 - 27. 工作者线程(Web Workers)](http://fe.zuo11.com/js/ad3/js-ad3-27.html#%E5%B7%A5%E4%BD%9C%E8%80%85%E7%BA%BF%E7%A8%8B%E6%95%B0%E6%8D%AE%E4%BC%A0%E8%BE%93)

### 原子操作基础
任何全局上下文中都有 Atomics 对象，它包含了一些用于执行线程安全操作的静态方法，多数方法以一个 TypedArray 实例（一个 SharedArrayBuffer 的引用）为第一个参数，相关操作数为后续参数

**算术以及位操作方法**
- `Atomics.add(typedArray, index, 要加的数)` 对 typedArray index 索引值，执行原子加操作
- `Atomics.sub(typedArray, index, 要减的数)` 对 typedArray index 索引值，执行原子减操作
- `Atomics.or(typedArray, index, 要或的数)` 对 typedArray index 索引值，执行原子或操作
- `Atomics.and(typedArray, index, 要与的数)` 对 typedArray index 索引值，执行原子与操作
- `Atomics.xor(typedArray, index, 要异或的数)` 对 typedArray index 索引值，执行原子异或操作

```js
// 创建一个字节的缓冲区，如果不清楚用法参考：6.集合引用类型 typed array
let sharedArrayBuffer = new SharedArrayBuffer(1)
// 基于缓冲区创建 类型数组 Uint8Array （另一种形式的 ArrayBuffer 视图）
let typedArray = new Uint8Array(sharedArrayBuffer)
// 默认 ArrayBuffer 里的值为 0
console.log(typedArray) // Uint8Array [0]

const index = 0,
      num = 5;

// 执行原子加、减、或、与、异或操作
Atomics.add(typedArray, index, num)
typedArray // Uint8Array [5]
Atomics.sub(typedArray, index, num)
typedArray // Uint8Array [0]
Atomics.or(typedArray, index, 0b1111) // 十进制 15
typedArray // Uint8Array [15]
Atomics.and(typedArray, index, 0b1100)
typedArray // Uint8Array [12]
Atomics.xor(typedArray, index, 0b1111) // 相同为0，不同为1
typedArray // Uint8Array [3]
```

**原子读和写** 原子读和原子写之前或之后的非原子操作在执行时不会被重排，可以保证其执行顺序。
- `Atomics.load(typedArray, index)` 获取 typedArray index 索引处的值
- `Atomics.store(typedArray, index, value)` 设置 typedArray index 索引处的值为 value

```js
// 创建 4 个字节缓冲区
let sharedArrayBuffer = new SharedArrayBuffer(4)
let view = new Uint32Array(sharedArrayBuffer)
// 执行非原子写
view[0] = 1
// 非原子写可以保证在这个读操作之前完成，这里面一定读到的是 1
console.log(Atomics.load(view, 0))

// 执行原子写
Atomics.store(view, 0, 2)
// 非原子读，可以保证在原子写完成后执行，这里面一定督导的是 2
console.log(view[0]) // 2
```
**原子交换**，将缓冲区的值设置为新的值
- `Atomics.exchange(typedArray, index, newValue)` 原子交换，读取 typedArray index 索引的值，并将该缓冲区的值设置为 newValue
- `Atomics.compareExchange(typedArray, index, oldView, newValue)` 有条件的原子交换，读取 typedArray index 索引的值，看是否与原缓冲区的值 oldView 一致，如果一致就写入新的值，否则不进行任何操作。

```js
// 创建 4 个字节缓冲区
let sharedArrayBuffer = new SharedArrayBuffer(4)
let view = new Uint32Array(sharedArrayBuffer)
Atomics.store(view, 0, 2)
console.log(Atomics.exchange(view, 0, 5)) // 2
console.log(Atomics.load(view, 0)) // 5

let oldValue = Atomics.load(view, 0)
let newValue = oldValue ** 2
// 缓冲区的值未修改，还是 5，像缓冲区写入新值 25
Atomics.compareExchange(view, 0, oldValue, newValue)
console.log(Atomics.load(view, 0)) // 25

// 缓冲区的值已修改，不会像缓冲区写入新值 3
Atomics.compareExchange(view, 0, 24, 3)
console.log(Atomics.load(view, 0)) // 25
```

**原子 Futex（fase user-space mutex 快速用户空间互斥量）操作与加锁**，为了支持更加复杂的需求。Atomics API 提供了模仿 Linux Futex的方法。注意：这些方法只能用于操作 Int32Array 视图，而且只能用在 Worker(工作者线程) 内部
- `Atomics.wait(typedArray, index, value[, timeout])` 当 typedArray 视图中 index 索引的值等于 value 时阻塞，停止向下执行，获得锁。直到被唤醒或超时，超时时间为 tiemout 单位毫秒。默认值为 Infinity
- `Atomics.notify(typedArray, index, count)` 唤醒 typedArray 中 index 索引位置的阻塞队列，通知唤醒的线程数量由 count 指定，默认是 Infinity
- `Atomics.isLockFree(n)` 基本不会用到，用于在高性能算法中确定是否有必要获取锁

```js
const workerScript = `
self.onmessage = ({data}) => {
  const view = new Int32Array(data)
  console.log('等待获得锁')
  Atomics.wait(view, 0, 0, 1E5)
  console.log('获得锁')
  Atomics.add(view, 0, 1)
  console.log('释放锁')
  // 只允许一个 Work 继续执行
  Atomics.notify(view, 0, 1)
  self.postMessage(null)
}
`
const workerScriptUrl = URL.createObjectURL(new Blob([workerScript]))
const workers = []
// 创建 4 个 Worker
for (let i =0; i < 4; i++) {
  workers.push(new Worker(workerScriptUrl))
}

// 在最后一个 worker 完成后打印最终值
let responseCount = 0;
for (const worker of workers) {
  worker.onmessage = () => {
    if (++responseCount == workers.length) {
      console.log(`Final buffer value: ${view[0]}`);
    }
  };
}

const sharedArrayBuffer = new SharedArrayBuffer(8)
const view = new Int32Array(sharedArrayBuffer)
// 将 sharedArrayBuffer 发送到每个工作者线程执行 +1 操作
for (const worker of workers) {
  worker.postMessage(sharedArrayBuffer)
}

// 1s 后释放第一个锁
setTimeout(() => Atomics.notify(view, 0, 2), 1000)
```
执行结果
```js
// 等待获得锁
// 等待获得锁
// 等待获得锁
// 等待获得锁
// 获得锁
// 释放锁
// 获得锁
// 释放锁
// 获得锁
// 释放锁
// 获得锁
// 释放锁
// Final buffer value: 4
```

## 跨上下文(文档)消息传送（XDM）
跨文档消息，也简称为 XDM（cross-document messaging），是一种在不同执行上下文（如不同的工作线程或与 iframe 内嵌页面）间传递信息的能力。这里主要介绍与 iframe 内嵌的页面通信，关于 Worker 线程之间的通信参考本书第 27 章 工作者线程相关内容。XDM 的核心是 postMessage() 函数与 message 事件。
- `awindow.postMessage(message, sourceURL)` 向 awindow 窗口发送 message 信息, 指定接收源为 sourceURL（可以用于限制接收窗口的源必须是 sourceURL）。也可以设置为 * ，不限制源，但一般不推荐这么做。
- `message` 事件，在 postMessage 后，awindow 上会触发 message 事件。该事件处理的程序的 event 包含以下三个重要信息
  - `data` 作为第一个参数传给 postMessge() 的字符串 message，虽然有些浏览器可以使用 JSON 数据，但不是所有浏览器都兼容，对于 JSON 数据还是需要调用 JSON.stringify() 将其转换为字符串。
  - `origin` 发送消息的文档源，例如 "http://127.0.0.1"
  - `source` 发送信息的文档中 window 对象的代理，主要用于向源窗口 postMessage

通过 iframe 加载不同的域时，使用 XDM 可以很方便的通信。也可以用于同源页面之间通信。下面是同源页面通信的示例 demo
```html
<!-- 主页面 xdm.html -->
从 iframe 页面接收的消息：<span id="msg"></span>
<p>下面是 iframe，内嵌 iframe.html 页面 </p>
<iframe src="iframe.html" width="300" height="300"></iframe>
<script>
  window.onload = function() {
    console.log('准备开始 postMessage')
    // 2s 后向 iframe 页面发送消息
    setTimeout(function () {
      try {
        let iframeWindow = frames[0]
        // 等价于
        // let iframeWindow = document.getElementsByTagName('iframe')[0].contentWindow
        // iframeWindow.postMessage('1111', 'http://127.0.0.1')
        iframeWindow.postMessage('1111')
      } catch(e) {
        // 如果有加 http://127.0.0.1 限制接收源会报异常
        // Failed to execute 'postMessage' on 'DOMWindow': 
        // The target origin provided ('http://127.0.0.1') does not match 
        // the recipient window's origin ('http://127.0.0.1:5502').
        console.log(e)
      }
    }, 2000)
    // 接收 iframe 窗口的消息并显示到 msg 位置
    window.onmessage = function(event) {
      var msg = document.getElementById('msg');
      msg.innerHTML = event.data
      console.log(event)
      // { data: "消息已成功收到！", origin: "http://127.0.0.1:5502" } 
    }
  }
</script>
```
iframe.html代码如下:
```html
接收到主页面发送的消息: <span id="msg"></span>
<script>
  window.onmessage = function(event) {
    var msg = document.getElementById('msg');
    msg.innerHTML = event.data
    console.log(event)
    // event.source.postMessage('消息已成功收到！', 'http://127.0.0.1/xdm/iframe.html')
    event.source.postMessage('消息已成功收到！')
    console.log('消息已收到')
  }
</script>
```
运行效果如下

![jsapi_xdm.gif](/images/js/jsapi_xdm.gif)

## Streams API
> 由于 Encoding API 涉及到流，这里将流的内容放到前面

Streams API 用于处理有序的小信息块，主要有两个应用场景
- 大块数据可能不会立即可用，http 响应数据时是以连续信息包形式传输的，流式处理可以让数据一到达就能使用，而不用等所有数据都加载完毕。
- 大块数据可能需要分成小块来处理。视频处理、数据压缩等都可以分成小块进行处理，而不必等所有数据都在内存中时再处理。

Streams API 直接解决的问题是**处理网络请求和读写磁盘**，它定义了三种流
- `可读流 ReadableStream`，通过公共接口读取数据块的流。数据在内部从底层源进入流，然后由消费者（consumer）处理
- `可写流 WritableStream`，通过公共接口写入数据块的流。生成者（producer）将数据写入流，数据在内部传入底层数据槽（sink）
- `转换流 TransformStream`，由两种流组成，可写流用于接收数据（可写端），可读流用于输出数据（可读端）。这两个流之间是转换程序（transformer），可以根据需要检查和修改流内容

**块、内部队列和反压** 流的基本单位是 **块（chunk）**。块可以是任意数据类型，但通常是 typedArray。块不是固定大小的，也不一定按固定时间到达。流都有入口和出口的概念，数据进出速率不同，可能会出现不匹配的情况。为此流平衡可能会出现三种情况
1. 流出口处理数据的速度比入口提供数据的速度快，流出口经常空闲，只会浪费一点内存或计算资源，这种情况可以接受
2. 流入和流出均衡，理想状态
3. 流入口提供数据的速度比出口处理数据的速度快，这种不平衡，会导致在某个地方出现数据积压，流必须做处理

流不平衡是常见的问题，因此所有流都会为已进入流，但未离开流的块提供一个 **内部队列**。如果块入列速度快与出列速度，内部队列会不断增大。流不可能允许内部队列无限增大，因此流会使用 **反压（backpressure）** 通知流入口停止发送数据，知道队列大小降到某个阈值之下。排列策略定义了内部队列可以占用的最大内存（即高水位线 high water mark）。

### 可读流 ReadableStream
可读流是对底层数据源的封装。底层数据源可以将数据填充到流中，允许消费者通过流的公共接口读取数据。

一般通过可读流的控制器（controller）将数据传入可读流，它是一个 ReadableStreamDefaultController 实例。在创建 ReadableStream 实例时，通过在 start 函数参数中，使用 controller.enqueue(chunk) 可以将 chunk 数据传入可读流
```js
const readableStream = new ReadableStream({
  start(controller) {
    console.log(controller) 
    // ReadableStreamDefaultController {desiredSize: 1}
    // 每隔 1 s 将 1、2、3、4、5 这几个值依次传入可读流
    let chunk = 1
    let timer = setInterval(() => {
      if (chunk === 6) {
        clearInterval(timer)
      }
      controller.enqueue(chunk++)
    }, 1000)
    // 传入完成后 调动 close 方法
    controller.close()
  }
})
// ReadableStream {locked: false}
```
上面的代码将 5 个值加入了可读流（ReadableStream 实例）的队列，但没有把它从队列中读取出来。我们需要使用 ReadableStream 实例的 **getReader()** 方法获取可读流的读取器（默认的 reader），调用该方法后会返回一个 ReadableStreamDefaultReader 实例。此时 ReadableStream 实例的 locked 会设置为 true。保证只有这个读取器可以从流中读取值。

消费者使用 ReadableStreamDefaultReader 实例的 read() 方法可以读出队列的值，这个 read() 方法的行为类似迭代器的 next() 方法
```js
let sleep = () => new Promise(r => setTimeout(r, 1000))
const readableStream = new ReadableStream({
  async start(controller) {
    console.log(controller) 
    // ReadableStreamDefaultController {desiredSize: 1}
    // 每隔 1 s 将 1、2、3、4、5 这几个值依次传入可读流
    let chunk = 1
    while(chunk < 6) {
      await sleep()
      controller.enqueue(chunk++)
    }
    // 传入完成后 调动 close 方法
    controller.close()
  }
})
readableStream.locked // false
const readableStreamDefaultReader = readableStream.getReader()
readableStream.locked // true

// 读取读取器实例的值，消费者
while(1) {
  const { value, done } = await readableStreamDefaultReader.read()
  if (done) {
    break
  } else {
    console.log(value)
  }
}
// 每隔 1 s 依次打印 1 2 3 4 5
```
上面的例子中，我们使用了 sleep 函数，每隔 1s 向可读流队列加入值，书中使用了 Generator 加异步迭代（for await of）的方法，在第 3 章 ECMAScript 基本概念 Symbol 类型中，有讲异步迭代，如果忘了可以翻看对应位置的笔记。这里使用书中的方法来重构上面的写法
```js
async function* ints() {
  for (let i = 1; i < 6; i++) {
    yield new Promise(r => setTimeout(r, 1000, i))
  }
}
const readableStream = new ReadableStream({
  async start(controller) {
    console.log(controller) 
    // ReadableStreamDefaultController {desiredSize: 1}
    // 每隔 1 s 将 1、2、3、4、5 这几个值依次传入可读流
    for await (const chunk of ints()) {
      controller.enqueue(chunk)
    }
    // 传入完成后 调动 close 方法
    controller.close()
  }
})
readableStream.locked // false
const readableStreamDefaultReader = readableStream.getReader()
readableStream.locked // true

// 读取读取器实例的值，消费者
while(1) {
  const { value, done } = await readableStreamDefaultReader.read()
  if (done) {
    break
  } else {
    console.log(value)
  }
}
// 每隔 1 s 依次打印 1 2 3 4 5
```
### 可写流 WritableStream
使用 WriteableStream 构造函数可以创建一个可写流，可以将数据写入该流，方法与 ReadableStream 类似，但有一些区别
```js
const writableStream = new WritableStream({
  write(value) {
    console.log(value)
  }
})
// WritableStream {locked: false}
writableStream.locked // false
const writableStreamDefaultWriter = writableStream.getWriter()
writableStream.locked // true

let sleep = () => new Promise(r => setTimeout(r, 1000))
let chunk = 1
// 生成者
while(chunk < 6) {
  await sleep()
  // 等待写入器可以写入值
  await writableStreamDefaultWriter.ready
  // 向写入器写入值
  writableStreamDefaultWriter.write(chunk++)
}
// 将流关闭
writableStreamDefaultWriter.close()
```

### 转换流 TransformStream
转换流用于组合可读流和可写流。其构造函数为 TransformStream，数据块在两个流之间通过 transform() 方法完成。写入的流会通过 transform 函数处理后，再传给可读流
```js
const { writable, readable } = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2)
  }
})
console.log(writable, readable)
const writableStreamDefaultWriter = writable.getWriter();
const readableStreamDefaultReader = readable.getReader();

// 消费者
(async function() {
  while(1) {
    const { value, done } = await readableStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})();

// 生产者
(async function() {
  let sleep = () => new Promise(r => setTimeout(r, 1000))
  let chunk = 1
  // 生成者
  while(chunk < 6) {
    await sleep()
    // 等待写入器可以写入值
    await writableStreamDefaultWriter.ready
    // 向写入器写入值
    writableStreamDefaultWriter.write(chunk++)
  }
  // 将流关闭
  writableStreamDefaultWriter.close()
})();

// 每隔 1s 依次打印
// 2 4 6 8 10
```

### 通过管道连接流
流可以通过管道连接在一起，ReadableStream 的实例可以使用以下两种方法操作管道
- `readableStream.pipeThrough(transformStream)` 通过管道，将 readableStream 接入 transformStream。readableStream 先把自己的值传给 transformStream 内部的 writableStream，然后转换后的值又在新的 readableStream 上出现。
- `readableStream.pipeTo(writableStream)` 通过管道，将 readableStream 连接到 writableStream。管道连接操作隐式从 readableStream 获取了一个读取器，并把产生的值填充到 writeableStream

将 readableStream 接入 transformStream 实例
```js
let sleep = () => new Promise(r => setTimeout(r, 1000))
const readableStream = new ReadableStream({
  async start(controller) {
    let chunk = 1
    while(chunk < 6) {
      await sleep()
      controller.enqueue(chunk++)
    }
    controller.close()
  }
})
const transformStream = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2)
  }
})
// TransformStream {readable: ReadableStream, writable: WritableStream}

// 通过管道连接流
const pipedStream = readableStream.pipeThrough(transformStream)
// 从管道连接流获取 reader
const pipedStreamDefaultReader = pipedStream.getReader();
// 消费者
(async function() {
  while(1) {
    const { value, done } = await pipedStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})();

// 每隔 1s 依次打印 2 4 6 8 10
```

将 readableStream 连接到 writableStream 实例：
```js
let sleep = () => new Promise(r => setTimeout(r, 1000))
const readableStream = new ReadableStream({
  async start(controller) {
    let chunk = 1
    while(chunk < 6) {
      await sleep()
      controller.enqueue(chunk++)
    }
    controller.close()
  }
})

const writableStream = new WritableStream({
  write(value) {
    console.log(value)
  }
})

const pipedStream = readableStream.pipeTo(writableStream)

// 每隔 1s 依次打印 1 2 3 4 5
```
## Encoding API
Encoding API 主要用于实现字符串与 typed array之间的转换。规范新增了 4 个用于执行转换的全局类 TextEncoder、TextEncoderStream、TextDecoder 和 TextDecoderStream

"编码" Encode 是将字符串转为 typedArray，"解码" Decode 是将 typedArray 转换为字符串。

### TextEncoder 与 TextDecoder
普通字符串编码（bulk 编码/批量编码）使用 TextEncoder 类，TextEncoder 实例支持如下方法：
- `textEncoder.encode(str)` 将字符串 str 转换为 Uint8Array 格式的 typed array。返回每个字符的 UTF-8 编码
- `textEncoder.encodeInto(str, typedArray)` 将每个字符的 UTF-8 编码写入类型为 Uint8Array 的 typedArray。主要是可以指定类型数组(定型数组)长度，如果类型数组空间不够会提交终止，返回值是一个对象：`{ read: 成功从源字符串读取的字符个数，written: 成功写入到目标 typedArray 的字符个数 }`

```js
const textEncoder = new TextEncoder()
let encodeText = textEncoder.encode('foo0')
// f 的 UTF-8 编码是 102 => 0x66，0 48 => 0x30
// encodeText Uint8Array(4) [102, 111, 111, 48]
// 有些字符可能会占用多个索引
textEncoder.encode('😊') // Uint8Array(4) [240, 159, 152, 138]

const aView = new Uint8Array(3)
const bView = new Uint8Array(1)
textEncoder.encodeInto('foo', aView) // { read: 3, written: 3 }
console.log(aView) // Uint8Array(3) [102, 111, 111]
textEncoder.encodeInto('foo', bView) // { read: 1, written: 1 }
console.log(bView) // Uint8Array(1) [102]
```

可以使用 TextDecoder 对 typedArray 进行解码，将其转换为字符串，TextDecoder 实例支持如下方法:
- `textDecoder.decode(typedArray)` 将 typedArray 转换为字符串，默认字符编码是 UTF-8。也可以解码 UTF-16 字符编码进行解码。解码器不关心传入的是那种 typedArray，只专心解码整个二进制表示。传入 Uint32Array 也可以解码。

```js
const textDecoder = new TextDecoder()
// Uint8 1个字节 8 位 [0x66, 0x6F, 0x6F, 0x30]
let decodeText = textDecoder.decode(Uint8Array.of(102, 111, 111, 48))
// decodeText "foo0"

// Unit32 4个字节 32位 [0x0066, 0x006F, 0x006F, 0x0030] 
textDecoder.decode(Uint32Array.of(102, 111, 111, 48))
// 返回 "foo0" 书中加了空格是错的

textDecoder.decode(Uint8Array.of(240, 159, 152, 138))
// "😊"

const utf16TextDecoder = new TextDecoder('utf-16')
utf16TextDecoder.decode(Uint16Array.of(102, 111, 111))
// "foo"
```
### TextEncoderStream 与 TextDecoderStream
流编码（stream 编码）使用 TextEncoderStream，它其实就是 TransformStream 形式的 TextEncoder，将可读流的内容连接到 TextEncoderStream 实例（类似于 TransformStream 实例），可读流的内容传给该实例的可写流，然后将内部 transform（编码） 后的值，再给到新的可读流。
```js
// 先创建一个可读的流，内容分别是 f o o 0
let sleep = () => new Promise(r => setTimeout(r, 1000))
const readableStream = new ReadableStream({
  async start(controller) {
    let str = "foo0"
    for (let i = 0, len = str.length; i < len; i++) {
      await sleep()
      controller.enqueue(str[i])
    }
    controller.close()
  }
})
// 对流进行编码
const encodeTextStream = readableStream.pipeThrough(new TextEncoderStream());
const encodeTextStreamDefaultReader = encodeTextStream.getReader();
// 读取编码后的流
(async function() {
  while(1) {
    const { value, done } = await encodeTextStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})();
// 每隔 1s 依次打印
// Uint8Array [102] 
// Uint8Array [111]
// Uint8Array [111]
// Uint8Array [48]
```
TextDecoderStream 流解码与流编码类似。文本解码器流能够识别分散在不同块上的字符。解码器流会保持块片段直到取得完整的字符。比如当解码笑脸符号时，它不会单独输出，而是一个完整的笑脸。

```js
// 先创建一个可读的流，内容分别是 f o o 0
let sleep = () => new Promise(r => setTimeout(r, 1000))
const readableStream = new ReadableStream({
  async start(controller) {
    // let arr = [102, 111, 111, 48] // foo0
    let arr = [240, 159, 152, 138] // 
    arr = arr.map(item => Uint8Array.of(item))
    for (let i = 0, len = arr.length; i < len; i++) {
      await sleep()
      controller.enqueue(arr[i])
    }
    controller.close()
  }
})
// 对流进行编码
const decodeTextStream = readableStream.pipeThrough(new TextDecoderStream());
const decodeTextStreamDefaultReader = decodeTextStream.getReader();
// 读取编码后的流
(async function() {
  while(1) {
    const { value, done } = await decodeTextStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})();
// 如果 arr = [102, 111, 111, 48]
// 每隔 1s 依次打印
// f
// o
// o
// 0

// 如果 arr = [240, 159, 152, 138]
// 5s 后打印 😊
```

文本解码器流经常和 fetch() 一起使用，因为响应体可以作为 ReadableStream 来处理，例如
```js
// 访问 https://api.zuo11.com/ibd/fooddaily/info
// 打开 console，粘贴下面的代码并执行
const res = await fetch('https://api.zuo11.com/ibd/fooddaily/info')
// Response {
//  type: "basic", 
//  status: 200,
//  body: ReadableStream,
//  headers: {}
// }
const stream = res.body.pipeThrough(new TextDecoderStream())
// ReadableStream {locked: false}
const decodedStream = stream.getReader();

let resData = '';
(async function() {
  while(1) {
    const { value, done } = await decodedStream.read()
    if (done) {
      console.log('resData', resData)
      break
    } else {
      resData += value
      console.log(value)
    }
  }
})();
// {"code":200,"msg":"成功","data":{"id":1,"auditMark":0}}
// resData {"code":200,"msg":"成功","data":{"id":1,"auditMark":0}}
```
## File API 与 Blob API
2000年以前，处理文件的唯一方式就是在表单中加入 `<input type="file">` 字段。File API 和 Blob API 在表单中的文件输入字段的基础上，添加了一些直接访问文件的接口。HTML5 在 DOM 上为文件输入元素添加了一个 files 集合。通过文件输入字段选择一个或多个文件时，该元素 files 属性里会包含一组 File 对象，一个 File 对象对应着一个文件。每个 File 对象，都有下列只读属性:
- name 本地文件系统中的文件名
- size 文件的字节大小
- type 字符串，文件的 MIME 类型
- lastModifiedDate: 字符串，文件上一次被修改的时间

```html
<input id="fileInput" type="file">
<input id="multipleFileInput" type="file" multiple="multiple">
<script>
  let fileInput = document.getElementById('fileInput')
  let multipleFileInput = document.getElementById('multipleFileInput')

  // 文件内容改变时，显示文件信息
  fileInput.addEventListener('change', fileChangeHandle, false)
  multipleFileInput.addEventListener('change', fileChangeHandle, false)

  function fileChangeHandle(event) {
    let files = event.target.files
    for (let i = files.length - 1; i >= 0; i--) {
      let fileInfo = files[i] // File对象
      console.log('name: ', fileInfo.name)
      console.log('lastModified: ', new Date(fileInfo.lastModified).toLocaleString()) // timestamp
      console.log('type: ', fileInfo.type)
      console.log('size: ', fileInfo.size)  // B 字节  /1000 kb
    }
  }
  // name: 截屏2020-12-03 下午8.49.12.png
  // lastModified: 2020/12/3 下午8:49:18
  // type: image/png
  // size: 93192
</script>
```

### FileReader 类型
FileReader 是一种异步文件的读取机制，可以把 FileReader 想象成 XMLHttpRequest，区别只是它读取的是文件系统，而不是远程服务器数据。FileReader 提供了如下方法，来读取文件中的数据

- `readAsText(file[, encoding])` 以纯文本形式读取文件，将读取到的文本保存在对应 FileReader 实例的 result 属性中。
- `readAsDataURL(file)` 读取文件，将文件以数据 URI（base64 格式字符串）的形式保存在 result 属性中。
- `readAsBinaryString(file)` 读取文件，并将每个字符的二进制数据保存在 result 属性中，字符串中的每个字符表示一字节。
- `readAsArrayBuffer(file)` 读取文件，并将文件内容以 ArrayBuffer 的形式保存在 result 中。

这些操作都是异步的，每个 FileReader 实例都会发布几个事件，其中比较有用的三个事件时：
- `progress 事件`，还有更多数据，每 50ms 触发一次，与 XHR 的 progress 事件具有相同的信息：lengthComputable、loaded、total，还可以读取 FileReader 实例的 result 属性
- `error 事件`，发生了错误，FileReader 的 error 属性时一个对象，它仅有一个 code 属性，这个错误码的值可能是：1 未找到文件 2 安全错误 3 读取被中断 4 文件不可读 5 编码错误。
- `load 事件`，读取完成，如果 error 事件被触发，不会触发 load 事件

```html
<input type="file" id="inputFile">
<script>
  let inputFile = document.getElementById('inputFile')
  inputFile.addEventListener('change', (event) => {
    let file = event.target.files[0]

    // 读取文件
    let reader = new FileReader();
    // 如果是图片，直接获取数据 URI 直接显示， 如果是其他，直接读取文本
    if (!file.type.includes('image')) {
      reader.readAsText(file) // 读取文件为文本内容
    } else {
      reader.readAsDataURL(file) // 获取文件的 Base64 URI
    }

    reader.onerror = function() {
      let errMsg = [null, '未找到文件', '安全性错误', '读取中断', '文件不可读', '编码错误']
      let errCode = reader.error.code
      console.log('读取文件错误, code: ' + errCode + '，错误提示: ' + errMsg[errCode])
    }
    reader.onprogress = function(e) {
      // 文件读取中，大概 50ms 刷新一次
      console.log(`加载进度 ${e.loaded} / ${e.total}`)
    }
    reader.onload = function(e) {
      // 文件读取完成会存到 reader.result里面
      console.log(reader.result)
    }
  })
</script>
```
### FileReaderSync 类型
FileReaderSync 是 FileReader 的同步版本，仅在 Worker 中可用。
```html
<input type="file" id="inputFile">
<script>
  let inputFile = document.getElementById('inputFile')
  inputFile.addEventListener('change', (event) => {
    let file = event.target.files[0]
    // 新开一个 Worker 线程去处理
    const worker = new Worker('worker.js')
    // 将文件数据发送给 worker
    worker.postMessage(file)
    // 监听 worker 内部发送的信息
    worker.onmessage = (msg) => {
      console.log('接收到 worker 的值', msg)
      // 接收到 worker 的值
      // MessageEvent { data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQA…j1JhSFU",... }
    }
  })
</script>
```
worker.js 代码
```js
// 当 worker 接收到 file 数据时
self.onmessage = ({data}) => {
  // 同步读 file
  const syncReader = new FileReaderSync()
  const result = syncReader.readAsDataURL(data)
  console.log(result)
  // 将数据发给主线程
  self.postMessage(result)
}
```
### Blob 读取部分文件内容
如果只想读取文件的一部分，而不是全部，可以使用 File 对象的 slice(起始字节，要读取的字节数) 方法。会返回一个 Blob 实例，Blob 是 File 的超类（父类）。blob 表示二进制大对象（binary large object） 是 JS 对不可修改二进制数据的封装类型。
```js
console.log(File.__proto__  === Blob) // true
```
示例
```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>blob slice</title>
</head>
<body>
  <input type="file" id="file">
  <script>
    var file = document.getElementById('file')
    file.onchange = function (e) {
      var myfile = this.files[0]
      var blob = myfile.slice(0, 32) // 只读取32B的内容
      if (blob) {
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onerror = function() {
          console.log('读取文件错误, ' + reader.error.code)
        }
        reader.onload = function() {
          console.log('读取文件成功，' + reader.result)
          var div = document.createElement('div')
          div.appendChild(document.createTextNode(reader.result))
          document.body.appendChild(div);
        }
        reader.onprogress = function(e) {
          console.log('读取中.....' + e.loaded + '/' + e.total)
        }
      } else {
        alert('您的浏览器不支持blob.slice()')
      }
    }
  </script>
</body>
</html>
```
### 对象URL
对象URL，也称为blob URL，引用保存在File或Blob中数据的URL，好处是，不必把文件内容读取到JS中而直接使用文件内容。IE10+支持
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
  <input type="file" id="file">
  <img src="" id="img">
  <script>
    var file = document.getElementById('file')
    file.onchange = function (e) {
      var myfile = this.files[0]
      var img = document.getElementById('img')
      var dataUrl = window.URL.createObjectURL(myfile)
      console.log('dataURL: ' + dataUrl)
      // dataURL: blob:http://localhost:63342/b42b5b0a-fef8-4cb2-b26d-1973517ac08a
      img.src = dataUrl
      // 页面卸载时会自动释放对象URL占用的内存。如果不用了，还是建议手工释放，节约内存，调用后，dataUrl还是会有值
      setTimeout(function() {
        window.URL.revokeObjectURL(myfile);
      }, 3000)
    }
  </script>
</body>
</html>
```
### 读取拖拽文件并上传
使用H5拖放API，从桌面上把文件拖放到浏览器中也会触发drop事件。在event.dataTransger.files中可以读取到防止的文件，与通过input取得的File一样
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <style>
    #dragDiv { width:300px;height: 150px;border:2px dashed #ccc; }
    .draging { border:2px dashed red !important; }
  </style>
</head>
<body>
  <div>拖拽文件到下面的方框区域</div>
  <div id="dragDiv"></div>
  <script>
    var dragDiv = document.getElementById('dragDiv')

    dragDiv.ondragenter = function(e) {
      // 当文件拖动到区域，设置red边框样式
      dragDiv.className = "draging"
    }
    dragDiv.ondragover = function (e) {
      e.preventDefault() // 取消默认行为，设置可拖放
    }
    dragDiv.ondrop = function (e) { // 有文件拖放触发
      dragDiv.className = ""
      e.preventDefault() // drop默认行为会打开新的窗口，取消默认行为
      console.log(e.dataTransfer.files)

      // 这里只显示了一个文件，如果多个文件拖拽，需要用for循环显示
      dragDiv.innerHTML = e.dataTransfer.files[0].name

       // 将文件用XHR上传操作
      // 1. 准备数据
      var files = e.dataTransfer.files
      var data = new FormData()
      for (let i = files.length - 1; i >= 0; i--) {
        data.append('file' + i, files[i])
      }
      console.log(data)

      // 2. 开始上传
      var xhr = new XMLHttpRequest()
      xhr.open('post', '/fileupdate', true) // 异步发送请求
      xhr.onload = function () {
        if (xhr.status === 200) { // 请求成功
          alert(xhr.responseText)
        } else {
          alert('请求异常', xhr.status)
        }
      }
      xhr.send(data)
    }
    dragDiv.ondragleave = function (e) { // 文件移出
      dragDiv.className = ""
    }
  </script>
</body>
</html>
```

## 媒体元素video/audio
HTML5新增了两个与媒体相关的标签，让开发人员不必依赖任何插件就能在网页中嵌入音频与视频内容。标签为video和audio，IE9+ 支持。视频支持格式video/mp4; video/ogg; video/webm; 音频支持格式 audio/mp4; audio/mpeg(mp3); audio/ogg; audio/wav; 

![video元素](/images/js/video.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>video</title>
  </head>
  <body>
    <!-- 嵌入视频, 如果浏览器不支持会显示Video element not support -->

    <video src="最后一公里.mp4" controls>Video element not support</video>
    <video src="最后一公里.mp4">Video element not support</video>

    <video id="video" src="最后一公里.mp4" controls poster="posterimg.png">Video element not support</video>

    <video src="最后一公里.mp4" controls poster="posterimg.png" width="300">Video element not support</video>

    <!--- 如果单独设置了autoplay，无法播放，需要再加一个muted属性才能自动播放，muted是让视频静音-->
    <video src="最后一公里.mp4" controls poster="posterimg.png" width="300" autoplay muted>Video element not support</video>

    <div>
        <input type="button" onclick="play()" value="播放">
        <input type="button" onclick="pause()" value="暂停">
        <span id="curPlayTime"></span>/<span id="totalPlayTime"></span>  音量：<span id="volume"></span>
    </div>
    <script>
      var video = document.getElementById('video')
      // 无效
      // setTimeout(function() {
      //   console.log(video)
      //   video.play()
      // }, 5000)
      // 需要点击事件才能触发，如果一进来直接调用函数会无效，除非播放时加如muted属性无声音。放在oncanplay里也无效
      function play() {
        console.log('video.play')
        video.play()
      }
      function pause() {
        console.log('video.pause')
        video.pause()
      }
      var curPlayTimeEle = document.getElementById('curPlayTime');
      var totalPlayTimeEle = document.getElementById('totalPlayTime');
      var volumeEle = document.getElementById('volume');
      // 只有在视频可以播放时才能获取到视频总时长
      video.oncanplay = function() {
        // video.play()
        var duration = Math.ceil(video.duration)
        totalPlayTimeEle.innerHTML = Math.floor(duration / 60) + '分' + duration % 60 + '秒';
        console.log(video.duration);
      }
      // 更新当前播放时长及音量
      setInterval(() => {
        curPlayTimeEle.innerHTML = video.currentTime;
        volumeEle.innerHTML = video.volume;
      }, 250);
    </script>
  </body>
</html>
```
- audio
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>video</title>
  </head>
  <body>
    <!-- 嵌入audio, 如果浏览器不支持会显示Video element not support -->
    <p>播放mp4声音: 最后一公里.mp4</p>
    <audio src="最后一公里.mp4" controls>audio element not support</audio>

    <p>播放mp3声音: 王菲 - 匆匆那年.mp3</p>
    <audio id="audio" src="王菲 - 匆匆那年.mp3" controls>audio element not support</audio>
    <div>
        <input type="button" onclick="play()" value="播放">
        <input type="button" onclick="pause()" value="暂停">
    </div>
    <script>
      var audio = document.getElementById('audio')
      audio.oncanplaythrough = function() {
        console.log('可以播放了')
        // 这样也无效，还是要用按钮click触发
        // chrome 和 firefox无效，IE11有效
        // audio.play()
      }
      function play() {
        console.log('audio.play')
        audio.play()
      }
      function pause() {
        console.log('audio.pause')
        audio.pause()
      }
    </script>
  </body>
</html>
```

## 原生拖放
**该章节由于没有实例，且重要部分介绍内容有两处与实际不符，不好理解，不建议阅读本章来学习原生拖放**
> HTML标签draggable属性，表示是否可拖动，img和a标签、选中的文本默认为是可拖动的，其他元素默认为false, 无法拖动。如果想让某个区域成为可放置区域，只需要将该区域dragover事件，阻止其默认行为

拖动某个元素时，会依次触发**dragstart, drag, dragend** 事件。当某个元素被拖动到一个有效的目标位置时，目标元素会依次触发**dragenter, dragover**，**dragleave(不可放置)或drop(可放置)**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>drag demo</title>
    <style>
      .sec-content { width:600px;height: 400px;border:1px solid #ccc; }
      .dragdiv {width:50px; height:50px;border:1px solid blue; margin-right:10px;}
      .flexdiv { display: flex;}
      #square1 { display: flex; flex-wrap: wrap}
    </style>
  </head>
  <body>
    <div>
      <p class="sec-title">可拖动模块</p>
      <div id="flexdiv" class="flexdiv">
        <div id="dragdiv1" class="dragdiv" draggable="true">1</div>
        <div id="dragdiv2" class="dragdiv" draggable="true">2</div>
        <div id="dragdiv3"class="dragdiv" draggable="true">3</div>
        <div id="dragdiv4" class="dragdiv" draggable="true">4</div>
      </div>
    </div>

    <div>
      <p class="sec-title">放置区域1</p>
      <div id="square1" class="sec-content">
      </div>
    </div>

    <script>
      var flexdiv = document.getElementById('flexdiv');
      flexdiv.addEventListener('dragstart', dragdivHandle, false);
      flexdiv.addEventListener('drag', dragdivHandle, false);
      flexdiv.addEventListener('dragend', dragdivHandle, false);

      var square1 = document.getElementById('square1');
      square1.addEventListener('dragenter', squareEventHandle, false);
      square1.addEventListener('dragover', squareEventHandle, false);
      square1.addEventListener('dragleave', squareEventHandle, false);
      square1.addEventListener('drop', squareEventHandle, false);

      function dragdivHandle(event) {
        console.log(event.type)
        switch(event.type) {
          case 'dragstart':
            // 针对拖动元素，设置event.effectAllowed
            // event.dataTransfer.effectAllowed = 'copy'; // 这个设置与不设置貌似没什么作用
            event.dataTransfer.setData('Text', event.target.id)
            break;
        }
      }

      function squareEventHandle(event) {
        console.log(event.type)
        switch(event.type) {
          // case 'dragenter': // JS高程3里面p482内容: 如果想要让元素成为可放置区域，需要这里也阻止默认行为，但实际不用
          //   event.preventDefault();
          //   break;
          case 'dragover':
            event.preventDefault(); // 取消默认操作，可以让元素成为可放置区域
            // 针对放置目标，设置event.dropEffect
            // event.dataTransfer.dropEffect = 'copy'; // 这个设置与不设置貌似没什么作用
            break;
          case 'drop': // 该操作是动作执行的核心
            // 防止火狐下，每次拖拽都会打开新的标签页
            event.stopPropagation(); //阻止冒泡
            event.preventDefault(); // 阻止默认事件

            var id = event.dataTransfer.getData('Text');
            console.log(id)
            // 如果克隆了节点，不会删除源节点，如果通过getElementById获取对应的节点，会删除原来拖动的节点
            // 如果是拖拽文件到该区域
            console.log(event.dataTransfer.files); // 得到files数组，里面都是File文件对象
            square1.appendChild(document.getElementById(id).cloneNode(true))
            break;
        }
      }

    </script>
  </body>
</html>
```

## Notifications API
## Page Visibility API(页面可见性API)
如果页面最小化了或者隐藏在了其他标签页面后面，有些功能可以停下来，比如轮询服务器或某些动画效果。而Page Visibility API就是为了让开发人员知道页面是否对用户可见而推出的。
```js
// - document.hidden // 页面是否隐藏
// - document.visibilityState(不推荐使用)  IE10和Chrome对应的状态值有较大差异
// IE值为 document.MS_PAGE_HIDDEN(0) document.MS_PAGE_VISIBLE(1)，  
// chrome值为: hidden, visible, prerender
// - visibilitychange事件，当文档从可见变为不可见或从不可见变为可见时，触发该事件

// 实现tab间切换时，隐藏页面title改变功能
var title = document.title;
document.addEventListener('visibilitychange', function (event) {
  console.log('--------------------')
  console.log(event)
  console.log(document.hidden)
  console.log(document.visibilityState)
  console.log('--------------------')

  document.title =  document.hidden ? '~ 你快回来 ~ ' : title
  if (document.hidden) {
    // 做一些暂停操作
  } else {
    // 开始操作
  }
}, false)
```
## 计时 API
Web Timing API，核心是window.performance对象。可以全面的了解页面再被加载到浏览器的过程中都经历了哪些阶段，页面哪些阶段可能是影响性能的瓶颈。IE10+支持。
- performance.navigation记录了页面加载器重定向的次数，导航类型(页面第一次加载，页面重载过等状态)
- performance.timing 记录了开始导航到当前页面的时间，浏览器开始请求页面的时间、浏览器成功连接到服务器的时间等。

## Web 组件（Web Components）

## Web Cryptography API
