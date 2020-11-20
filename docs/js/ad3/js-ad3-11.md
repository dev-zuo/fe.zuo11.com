# 11. 期约与异步函数(Promise与async/await)

在 《ES6入门》中，介绍过 Promise 与 async/await，这里结合两本书的内容，加上自己的理解对本章的重点做一些总结

- [11. Promise对象 - ES6入门笔记](http://fe.zuo11.com/js/es6/es6-11.html)
- [14. async函数 - ES6入门笔记](http://fe.zuo11.com/js/es6/es6-14.html)

Promise 是 ES6 新增的引用类型，用于异步处理。假设你需要把一个不知道什么时候才能执行结束的异步任务封装成函数，你会怎么做？一般会使用 callback 回调函数来处理成功/失败后的逻辑。
```js
function getAsyncData(successCallback, errorCallback) {
  // 异步处理
  if ('异步处理成功') {
    successCallback('成功后的返回值')
  } else {
    errorCallback('失败后的错误信息')
  }
}

getAsyncData((data) => {
  // 异步任务执行成功后处理
}, (err) => {
  // 异步任务执行失败后处理
})
```
这里只是一个异步函数，如果存在异步逻辑里面还有异步逻辑，回调函数的策略就复杂了，会出现回调地狱。
```js
function getAsyncData(successCallback, errorCallback) {
  // 异步处理
  if ('异步处理成功') {
    successCallback('成功后的返回值')
  } else {
    errorCallback('失败后的错误信息')
  }
}

function getAsyncData2(successCallback, errorCallback) {
  // 异步处理
  if ('异步处理成功') {
    successCallback('成功后的返回值')
  } else {
    errorCallback('失败后的错误信息')
  }
}

getAsyncData((data) => {
  // 异步任务执行成功后处理
  getAsyncData2((data) => {
  // 异步任务执行成功后处理
  }, (err) => {
    // 异步任务执行失败后处理
  })
}, (err) => {
  // 异步任务执行失败后处理
})
```
Promise 有什么用呢？**它规范了异步逻辑的处理方式。另外支持链式调用，可以解决回调地狱的问题，将多个嵌套的异步逻辑扁平化。** 下面使用 Promise 重构上面的代码：
```js
// resolve 等价于上面的 successCallback
// reject 等价于上面的 errorCallback
let getAsyncData = new Promise((resolve, reject) => {
  setTimeout(resolve, 2000)
  // setTimeout(reject, 2000)
})
let getAsyncData2 = new Promise((resolve, reject) => {
  // setTimeout(resolve, 2000)
  setTimeout(reject, 2000)
})
getAsyncData
  .catch((err) => {
    // 第一个失败后的逻辑处理
    console.log('第一个异步任务失败')
    // 状态设置为 pending，后面全部无法执行
    return new Promise(() => {})
  })
  .then((data) => {
    // 第一个成功后的逻辑处理
    console.log('第一个异步任务成功，开始第二个异步任务')
    return getAsyncData2
  })
  .catch((err) => {
    // 第二个失败后的逻辑处理
    console.log('第二个异步任务失败')
    // 状态设置为 pending，后面全部无法执行
    return new Promise(() => {})
  })
  .then((data) => {
    // 第二个成功后的逻辑处理
     console.log('第二个异步任务成功')
  })
```

## Promise 基础(三种状态与then/catch/finally)
如果看不懂上面的例子，下面来回顾一下 Promise 基础。Promise 是一个构造函数，它需要传入一个执行(executor)函数作为参数。`new Promise(执行函数)` 会返回一个 Promise 实例，里面记录了执行函数的执行状态。这个执行函数一般是异步操作，当然，它也可以是同步操作。

根据规范，执行函数有两个参数，这两个参数分别是执行成功的回调函数、执行失败的回调函数，一般命名为 resolve 与 reject。

```js
let promise = new Promise((resolve, reject) => {
  // 异步操作
  if ('异步操作成功') {
    resolve('成功后的返回值') 
    console.log('1') // 注意 resolve 后会继续执行，除非 return
  } else {
    reject('失败后的错误信息')
    console.log('2') // 注意 reject 后会继续执行，除非 return
    // throw Error('error') 等价于 return reject(Error('error'))
  }
})
```
上面的例子中，当执行 new Promise 代码时，参数里的执行函数会立即执行。并根据执行情况，把结果保存到 promise 中。根据执行结果，promise 实例有三种状态
1. 最开始异步操作还在进行，没有结果时 promise 实例的值为 `Promise {<pending>}`，状态为 `pending 等待中`
2. 如果异步结束，执行了成功的回调函数 resolve，那么 promise 实例的值为 `Promise {<fulfilled>: 成功后返回的值}`，状态为 `fulfilled 已兑现/已成功`
3. 如果异步结束, 执行了失败的回调函数 reject，那么 promise 实例的值为 `Promise {<rejected>: 失败后的错误信息`，状态为 `rejected 已拒绝/已失败`
```js
// 1. 即不调用 resolve, 也不调用 reject，状态一直时是 pending
let promise = new Promise(() => {})
promise // Promise {<pending>} 

// 2. 异步操作成功，调用 resolve
let promise = new Promise((resolve) => resolve('成功后的返回值'))
promise // Promise {<fulfilled>: "成功后的返回值"}

// 3. 异步操作发生错误，调用 rejecct
let promise = new Promise((resolve, reject) => reject('失败后的返回值'))
promise // Promise {<rejected>: "失败后的返回值"}
// Uncaught (in promise) 失败后的返回值
```
Promise 实例对象有一个 then 方法，可以读取 Promise 实例的执行结果：
- then 方法有两个函数参数，分别用来读取 fulfilled 状态、rejected 状态的值。
- 如果是 pending 状态，不会执行 then 的任何操作。
- then 方法执行后，默认会返回一个 Promise 实例。也可以自己手动 return 一个 Promise 实例。这是 Promise 可以执行链式调用的原因。
```js
promise.then((data) => {
  // data 为成功后的返回值
}, (err) => {
  // err 为失败后的返回值
})
```
下面来看看各种情况下 then 函数执行的情况。

当 Promise 实例一直停留在 pending 状态时，then 获取异步结果时，一直是 pending 的状态，无法再改变。无法进行任何逻辑处理。
```js
a = new Promise(() => {})
a // Promise {<pending>}
b = a.then(() => console.log('success'), () => console.log('failure'))
// 不会打印任何值，因为 a 的状态一直是 pending，不会执行成功或失败的函数
// 不是 fulfilled，也不是 rejected 状态，状态无法改变，这样 pending 的状态一直不会变
b // Promise {<pending>}
```
当 Promise 实例为 rejected 状态时，默认它会一直停留在 rejected 状态，除非有 then 的 reject 函数来捕获。捕获后他的状态默认会变为 fulfilled，即 resolve 的状态。下次 then 时，默认会走 resolved 的逻辑。如果我们在对应的逻辑处理函数中 return 了另一个 Promise 实例，那么 then 方法的返回值的状态就和该 Promise 实例一致。
```js
a = new Promise((resolve, reject) => reject('失败后返回的值'))
a // Promise {<rejected>: '失败后返回的值'}
b = a.then(() => console.log('get success')) // 无法执行, reject 还是没有捕获
b // Promise {<rejected>: '失败后返回的值'}
c = a.then(null, (err) => console.log('get failure')) // 捕获失败 err 为 '失败后返回的值'
// get failure
// c Promise {<fulfilled>: undefined}
// 此时 then 的返回值是一个 fulfilled 状态的 Promise 实例，下次再 then 会走 resovle 函数逻辑
```
同理，当 Promise 实例为 fulfilled ，即 resolved 状态时，除非有 then 的 resolve 函数捕获后 return 一个 reject 的 Promise 实例，否则状态一直是 fulfilled
```js
a = new Promise((resolve, reject) => resolve('成功后的返回值'))
a // Promise {<fulfilled>: '成功后的返回值'}
b = a.then((data) => console.log('success')) // 这里 data 为 '成功后的返回值'
// success
// b Promise {<fulfilled>: undefined} // 此时其返回值是fulfilled状态，值为 undefined
c = b.then(() => {
  console.log('success')
  return Promise.reject('error') // c 的状态会变为 rejected
  // throw Error('foo') 这样也会是状态变为 rejected
})
// success
// c Promise {<rejected>: "error"}
```
以上，我们大致弄清楚了 Promise 的执行逻辑，以及用 then 读取 Promise 实例执行结果的方法。下面来使用 Promise 改写普通的回调函数异步逻辑
```js
// 原异步逻辑
function getAsyncData(args, successCallback, errorCallback) {
  // 异步处理
  if ('异步处理成功') {
    successCallback('成功后的返回值')
  } else {
    errorCallback('失败后的错误信息')
  }
}

getAsyncData(args, (data) => {
  // 异步任务执行成功后处理
}, (err) => {
  // 异步任务执行失败后处理
})
```
使用 Promise 改写
```js
function getAsyncData(args) {
  return new Promise((resolve, reject) => {
    // 异步处理
    if ('异步处理成功') {
      resolve('成功后的返回值')
    } else {
      reject('失败后的错误信息')
    }
  })
}
getAsyncData(args).then((data) => {
  // success
}, (err) => {
  // failure
})
```

Promise.prototype 上除了 then() 方法外，还有 catch()、finally()

```js
let promise = new Promise((resolve, reject) => reject('error'))
promise.then((data) => {
  // 成功
}, (err) => {
  // 失败
})

// 换一种写法
promise
  .then((data) => {}) // 成功
  .then(null, (err) => {}) // 失败

// 其中 .then(null, (err) => {}) 可以简写为 .catch((err) => {})
promise
  .then((data) => {}) // 成功
  .catch((err) => {}) // 失败

// .finally，不管是 fulfilled 还是 rejected 状态都会执行
// 用于清理工作，比如 去掉 loading
 promise
  .then((data) => {}) // 成功
  .catch((err) => {}) // 失败
  .finally(() => {}) // 成功或失败都会执行，pending 不会执行
```

现在，再回过头来看最开始的例子，应该可以理解了吧。
## Promise.resolve()/reject()
`Promise.resolve('可选参数')` 等价于 `new Promise((resolve) => resolve('可选参数'))`，可以创建一个 fulfilled 状态的 Promise 实例

`Promise.reject('可选参数')` 等价于 `new Promise((resolve, reject) => reject('可选参数'))`，可以创建一个 rejected 状态的 Promise 实例

他们之间的区别在于: Promise.resolve() 参数如果是 Promise 实例，那么它的返回值状态会根据参数的 Promise 实例状态进行切换。Promise.reject() 如果参数是 Promise 实例，它的返回值还是 rejected 状态，Promise 实例会成为他 rejcted 的参数。
```js
a = Promise.resolve(Promise.reject('123'))
// Promise {<rejected>: "123"}

b = Promise.reject(Promise.resolve('123'))
// Promise {<rejected>: Promise {<fulfilled>: "123"}}
```
## Promise 内部执行顺序
当期约（Promise）进入落定状态（settled）后，也就是已经切换到了 fulfilled 或 rejected 状态后，相关的处理程序仅仅会被 **排期**。而不是立即执行，和 JS 事件循环有关系。

```js
let p = Promise.resolve()
p.then(() => console.log('resolve handler'))
console.log('done')

// 实际输出
// done
// resolve handler
```
再来看一个例子
```js
let syncResolve

let p = new Promise(resolve => {
  syncResolve = function() {
    console.log('a')
    resolve()
    console.log('b')
  }
})
p.then(() => console.log('d'))
syncResolve()
console.log('c')

// 执行顺序为
// a
// 将 resolve 处理程序加入消息队列
// b
// c
// d
```
## Promise.all/race
同时执行多个 Promise 实例，他们都会返回一个 Promise 实例。
- `Promise.all(Promise实例数组)`，全部执行，全部 fulfilled 才会 fulfilled, 有一个出现 rejected 就会返回 rejected。思考 Promise.all 错误处理。
- `Promise.race(Promise实例数组)`，赛跑，结果为最快落定的一个状态，不管他是 fulfilled 还是 rejected。

```js
// Promise.all
p = Promise.all([
  Promise.resolve('123'),
  Promise.reject('error')
])
p // Promise {<rejected>: "error"}

p = Promise.all([
  Promise.resolve('123'),
  Promise.resolve('456')
])
p // Promise {<fulfilled>: ["123", "456"]}

// Promise.race
p = Promise.race([
  Promise.resolve('123'),
  Promise.reject('error')
])
p // Promise {<fulfilled>: "123"}

p = Promise.race([
  Promise.reject('error'),
  Promise.resolve('123')
])
p // Promise {<rejected>: "error"}
```
## Promise 取消与进度获取
一般情况下，Promise 在 pending 状态中是无法取消的，我们可以自己写一些逻辑（比如手动触发 resolve或rejected）来进行取消 Promise 逻辑

```js
// start 为异步请求，这里传入一个 cancelToken 用于取消异步操作
function start(cancelToken) {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => resolve('执行成功'), 10000)
    cancelToken && cancelToken.fill(timer, reject)
  })
}

class CancelToken {
  promise = {}
  fill(timer, reject) {
    this.promise.timer = timer
    this.promise.reject = reject
  }
  cancel() {
    clearTimeout(this.promise.timer)
    this.promise.reject('取消请求')
  }
}

// 两秒后取消执行
let cancelToken = new CancelToken()
start(cancelToken)
 .then((data) => console.log('1', data))
 .catch((err) => console.log('1', err))
setTimeout(() => cancelToken.cancel(), 2000)

// 不取消执行
start()
  .then((data) => console.log('2', data))
  .catch((err) => console.log('2', err))

// 1 取消请求  2s后
// 2 执行成功  10s后
```
上面的例子，类似 axios 取消请求的效果。

执行进度通知和传 cancelToken 参数一致，传入一个进度事件的回调函数进去，当异步操作有进展时，周期性的触发进度事件即可。 和 axios 的进度事件类似。可以去看下 axios 源码是怎么实现的。

## Promise 实现(扩展)
怎么自己实现一个 Promise 呢？我们先来看看调用示例
```js
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve('success')
    reject('error')
  }, 3000)
})
promise._then((data) => {
  console.log(data)
}, (err) => {
  console.log(err)
})
```
至少上面的例子要可以正常执行。首先要有一个构造函数，另外，要有 then, catch, finally 实例函数，resolve，reject 静态方法。还有支持链式调用。
```js
class MyPromise {
  #status = 'pending'
  #result = undefined

  constructor(func) {
    // new 的时候执行执行传入的函数，函数执行成功或失败改变状态
    // 并将返回的结果记录到 #result 中
    // 这里 #status 和 #result 都用的私有变量
    func((data) => {
      this.#status = 'fulfilled'
      this.#result = data
    }, (err) => {
      this.#status = 'rejected'
      this.#result = err
    })
  }

  // 用 _then 方法取值时，看 #status 的状态，决定执行哪个函数
  _then(successCallback, failCallback) {
    if (this.#status === 'fulfilled') {
      successCallback(this.#result)
      this.#result = undefined
      return this
    } else if (this.#status === 'rejected'){
      failCallback(this.#result)
      this.#status = 'fulfilled'
      this.#result = undefined
      return this
    } else {
      // 'pending'
      return this
    }
  }

  _catch() {

  }
  _finally() {

  }
  static relove() {

  }

  static reject() {

  }
}
```
## 异步函数 async/await