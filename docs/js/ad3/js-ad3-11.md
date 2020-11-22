---
title: 11. 期约与异步函数(Promise与async/await) - JS高程4
description: 在 《ES6入门》中，介绍过 Promise 与 async/await，这里结合两本书的内容，加上自己的理解对本章的重点做一些总结，并自己实现一个 Promise。Promise 是 ES6 新增的引用类型，用于异步处理。假设你需要把一个不知道什么时候才能执行结束的异步任务封装成函数，你会怎么做？一般会使用 callback 回调函数来处理成功/失败后的逻辑。
keywords: Promise,async/await,异步函数,期约
---
# 11. 期约与异步函数(Promise与async/await)

在 《ES6入门》中，介绍过 Promise 与 async/await，这里结合两本书的内容，加上自己的理解对本章的重点做一些总结，并自己实现一个 Promise。

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
至少上面的例子要可以正常执行。首先要有一个构造函数 MyPromise，另外，要有 then, catch, finally 实例函数，由于和系统有冲突，实例函数都以 `_` 开头，resolve，reject 静态方法，还有支持链式调用。

先来实现构造函数，与_then方法
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
  _catch() {}
  _finally() {}
  static resolve() {}
  static reject() {}
}
```
测试函数，执行成功的测试
```js
// 测试
a = new MyPromise(() => {})
a._then((data) => console.log(data), (err) => console.log(err))
// 执行正常
// MyPromise {#status: "pending", #result: undefined}
// MyPromise {#status: "pending", #result: undefined}

b = new MyPromise((resolve) => resolve('success'))
b._then((data) => console.log(data), (err) => console.log(err))
// 执行正常
// MyPromise {#status: "fulfilled", #result: "success"}
// success
// MyPromise {#status: "fulfilled", #result: undefined}

c = new MyPromise((resolve, reject) => reject('error'))
c._then((data) => console.log(data), (err) => console.log(err))
// 执行正常
// MyPromise {#status: "rejected", #result: "error"}
// error
// MyPromise {#status: "fulfilled", #result: undefined}
```
有问题的结果
```js
d = new MyPromise((resolve, reject) => {
  resolve('sucess a')
  reject('fail a')
})
// MyPromise {#status: "rejected", #result: "fail a"}
// 错误，执行函数状态变为落定状态后，就不能再变了。这里要加一个判断

e = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('sucess')
  }, 2000)
})
e._then((data) => console.log(data), (err) => console.log(err))
// MyPromise {#status: "pending", #result: undefined}
// 错误，_then 如果是异步的，等异步结束之后 _then 后面的逻辑还会走
// 这里需要一个通知，当执行成功失败后，再次调用对用的回调函数
```
改写上面的例子，使用发布订阅模式，来触发 _then 里面回调函数执行解决异步的问题。
```js
class MyPromise {
  #status = 'pending'
  #result = undefined
  // 发布订阅
  #listenObj = {}
  #on(prop, cb) {
    let listenObj = this.#listenObj
    listenObj[prop] ? listenObj[prop].push(cb) : (listenObj[prop] = [cb])
    // console.log('listenObj', listenObj)
  }
  #emit(prop) {
    let listeners = this.#listenObj[prop]
    // console.log('listeners', listeners)
    if (Array.isArray(listeners)) {
      listeners.forEach(cb => cb())
    }
  }

  constructor(func) {
    // new 的时候执行执行传入的函数，函数执行成功或失败改变状态
    // 并将返回的结果记录到 #result 中
    // 这里 #status 和 #result 都用的私有变量
    func((data) => {
      // 如果状态已经改变，就不能再改了
      if (['fulfilled', 'rejected'].includes(this.#status)) {
        return this
      }
      this.#status = 'fulfilled'
      this.#result = data
      // 触发 _then 里面的回调执行
      this.#emit('fulfilled')
    }, (err) => {
      // 如果状态已经改变，就不能再改了
      if (['fulfilled', 'rejected'].includes(this.#status)) {
        return this
      }
      this.#status = 'rejected'
      this.#result = err
      // 触发 _then 里面的回调执行
      this.#emit('rejected')
    })
  }

  // 用 _then 方法取值时，看 #status 的状态，决定执行哪个函数
  _then(successCallback, failCallback) {
    let successCb = () => {
      // console.log('触发了 fulfilled 回调')
      successCallback(this.#result)
      this.#result = undefined
      return this
    }
    let failCb = () => {
      // console.log('触发了 rejected 回调')
      failCallback(this.#result)
      this.#status = 'fulfilled'
      this.#result = undefined
      return this
    }
    // 如果状态已经变更
    if (['fulfilled', 'rejected'].includes(this.#status)) {
      if (this.#status === 'fulfilled') {
        return successCb()
      } else {
        return failCb()
      }
    } else {
      // 状态未变更，异步
      this.#on('fulfilled', successCb)
      this.#on('rejected', failCb)
      return this
    }
  }
  _catch() {}
  _finally() {}
  static resolve() {}
  static reject() {}
}
```
至此上面的测试都过了，再来看看其他场景
```js
a = new Promise((resolve) => resolve(3))
a // Promise {<fulfilled>: 3}
b = a.then(() => console.log('success'))
// success
// b Promise {<fulfilled>: undefined}
a // Promise {<fulfilled>: 3}
a === b // false
```
我们的实现中 a 是全等于 b 的，还是有问题的。_then 执行后，会返回一个新的 Promise 实例，且当前实例的状态、结果值不会变更。相关变化会保存到新返回的 Promise 实例中。

**核心问题是，如何返回一个新的 Promise 实例**，由于 then 回调函数的 return 也可能是一个新的 Promise，因此拿到 then 回调函数的返回值后，我们调用 Promise.resolve(返回值) 来创建一个新的 Promise 实例。这样既实现了 Promise.resolve，又实现了返回新 Promise，前面提到过 Promise.resolve 的参数如果是 Promise 实例，那么状态和参数的 Promise 保持一致。写个 demo 看看

```js
a = new Promise(resolve => resolve(3))
a // Promise {<fulfilled>: 3}
b = Promise.resolve(a)
a === b // true
```
上面的例子中，可以看到，如果 Promise.resolve 参数是 Promise 实例，那么直接返回对应的实例。如果把上面的 Promise.resolve 换为 Promise.reject 会发现 a !== b，且状态不会变更。再回过头来看前面的对应知识点，是不是更清晰了呢？下面来改写之前的实现。

```js
class MyPromise {
  #status = 'pending'
  #result = undefined
  // 发布订阅
  #listenObj = {}
  #on(prop, cb) {
    let listenObj = this.#listenObj
    listenObj[prop] ? listenObj[prop].push(cb) : (listenObj[prop] = [cb])
    // console.log('listenObj', listenObj)
  }
  #emit(prop) {
    let listeners = this.#listenObj[prop]
    // console.log('listeners', listeners)
    if (Array.isArray(listeners)) {
      listeners.forEach(cb => cb())
    }
  }

  constructor(func) {
    // new 的时候执行执行传入的函数，函数执行成功或失败改变状态
    // 并将返回的结果记录到 #result 中
    // 这里 #status 和 #result 都用的私有变量
    func((data) => {
      // 如果状态已经改变，就不能再改了
      if (['fulfilled', 'rejected'].includes(this.#status)) {
        return this
      }
      this.#status = 'fulfilled'
      this.#result = data
      // 触发 _then 里面的回调执行
      this.#emit('fulfilled')
    }, (err) => {
      // 如果状态已经改变，就不能再改了
      if (['fulfilled', 'rejected'].includes(this.#status)) {
        return this
      }
      this.#status = 'rejected'
      this.#result = err
      // 触发 _then 里面的回调执行
      this.#emit('rejected')
    })
  }

  // 用 _then 方法取值时，看 #status 的状态，决定执行哪个函数
  _then(successCallback, failCallback) {
    let successCb = () => {
      // console.log('触发了 fulfilled 回调')
      let cbResult = successCallback(this.#result)
      // fulfilled 返回的状态还是 fulfilled，用 MyPromise.resolve 可以解决
      return MyPromise.resolve(cbResult)
    }
    let failCb = () => {
      // console.log('触发了 rejected 回调')
      let cbResult = failCallback(this.#result)
      // 貌似这里还是可以调用 MyPromise.resolve。接收 rejected 后，
      // 如果参数不是 Promise 实例，默认状态会回 fulfilled
      return MyPromise.resolve(cbResult)
    }
    // 如果状态已经变更
    if (['fulfilled', 'rejected'].includes(this.#status)) {
      if (this.#status === 'fulfilled') {
        return successCb()
      } else {
        return failCb()
      }
    } else {
      // 状态未变更，异步
      this.#on('fulfilled', successCb)
      this.#on('rejected', failCb)
      return this
    }
  }
  _catch() {}
  _finally() {}
  static resolve(value) {
    if (typeof value === 'object' && value instanceof MyPromise) {
      return value
    } else {
      return new MyPromise(resolve => resolve(value))
    }
  }
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value))
  }
}
```
再来写测试，就正常了。
```js
a = new MyPromise(resolve => resolve(3))
// MyPromise {#on: ƒ, #emit: ƒ, #status: "fulfilled", #result: 3, #listenObj: {…}}
b = a._then((data) => { console.log(data)})
// 3
// MyPromise {#on: ƒ, #emit: ƒ, #status: "fulfilled", #result: undefined, #listenObj: {…}}
a === b  // false
```
再来看一个刚测试出的 bug，下面的例子中，没有加 success 的处理函数，正常的逻辑是如果没有接收，返回一个状态不变的新 Promise 实例。类似于 promise 实例的副本，里面保存了所有状态。
```js
a = new MyPromise(resolve => resolve(3))
a._then(null, (err) => console.log(err))
// TypeError: successCallback is not a function

// 正常的逻辑如下
a = new Promise(r => r(3))
a // Promise {<fulfilled>: 3}
b = a.then(null, (err) => console.log(err))
// b Promise {<fulfilled>: 3}
a === b // false

a = new Promise(() => {})
b = a.then(() => {})
// b Promise {<pending>} 
a === b // false

// 返回的是完整的副本
a = new Promise(r => setTimeout(r, 5000))
a // Promise {<pending>} 
b = a.then(() => {})
// b Promise {<pending>} 
a === b // false
// 5 秒钟后 
// b Promise {<fulfilled>: undefined}
// a Promise {<fulfilled>: undefined}
```
再来改写上面的实现，顺便实现 catch 函数
```js
class MyPromise {
  #status = 'pending'
  #result = undefined
  // 发布订阅
  #listenObj = {}
  #on(prop, cb) {
    let listenObj = this.#listenObj
    listenObj[prop] ? listenObj[prop].push(cb) : (listenObj[prop] = [cb])
    // console.log('listenObj', listenObj)
  }
  #emit(prop) {
    let listeners = this.#listenObj[prop]
    // console.log('listeners', listeners)
    if (Array.isArray(listeners)) {
      listeners.forEach(cb => cb())
    }
  }

  constructor(func) {
    // new 的时候执行执行传入的函数，函数执行成功或失败改变状态
    // 并将返回的结果记录到 #result 中
    // 这里 #status 和 #result 都用的私有变量
    func((data) => {
      // 如果状态已经改变，就不能再改了
      if (['fulfilled', 'rejected'].includes(this.#status)) {
        return this
      }
      this.#status = 'fulfilled'
      this.#result = data
      // 触发 _then 里面的回调执行
      this.#emit('fulfilled')
    }, (err) => {
      // 如果状态已经改变，就不能再改了
      if (['fulfilled', 'rejected'].includes(this.#status)) {
        return this
      }
      this.#status = 'rejected'
      this.#result = err
      // 触发 _then 里面的回调执行
      this.#emit('rejected')
    })
  }

  // 用 _then 方法取值时，看 #status 的状态，决定执行哪个函数
  _then(successCallback, failCallback) {
    let successCb = () => {
      // 如果没有successCallback，创建一个保存当前状态的 promise 副本
      if (typeof successCallback !== 'function') {
        return MyPromise.resolve(this.#result)
      }
      // console.log('触发了 fulfilled 回调')
      let cbResult = successCallback(this.#result)
      // fulfilled 返回的状态还是 fulfilled，用 MyPromise.resolve 可以解决
      return MyPromise.resolve(cbResult)
    }
    let failCb = () => {
      if (typeof failCallback !== 'function') {
        return MyPromise.reject(this.#result)
      }
      let cbResult = failCallback(this.#result)
      // 貌似这里还是可以调用 MyPromise.resolve。接收 rejected 后，
      // 如果参数不是 Promise 实例，默认状态会回 fulfilled
      return MyPromise.resolve(cbResult)
    }
    // 如果状态已经变更
    if (['fulfilled', 'rejected'].includes(this.#status)) {
      if (this.#status === 'fulfilled') {
        return successCb()
      } else {
        return failCb()
      }
    } else {
      // 状态未变更，异步
      this.#on('fulfilled', successCb)
      this.#on('rejected', failCb)
      // 如果是 pending 状态也要返回一个新的 Promise 实例副本
      // 不知道执行完没有，需要保存执行状态，状态切换后，对应的状态也会切换
      // TODO
      return this
    }
  }
  _catch(cb) {
    return this._then(null, cb)
  }
  _finally() {}
  static resolve(value) {
    if (typeof value === 'object' && value instanceof MyPromise) {
      return value
    } else {
      return new MyPromise(resolve => resolve(value))
    }
  }
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value))
  }
}
```
上面的例子中，实现了then中没有传接收参数的情况，创建一个对应的副本。顺便实现了 catch。pending 状态的情况，这里没有完全实现。没有创建副本，直接返回当前 this。

再来看看执行顺序问题，对于非异步的情况，我们没有加入执行队列而是立即执行。
```js
a = new MyPromise(r => r('3')); 
a._then((d) => console.log(d));
console.log('done')
// 3
// done

a = new Promise(r => r('3')); 
a.then((d) => console.log(d));
console.log('done')
// done
// 3
```
这里在 emit 事件时，加个 setTimeout 0, 另外实现下 finally 实例方法、Promise.all、Promise.race，重构下代码。
```js
class MyPromise {
  #status = 'pending'
  #result = undefined

  // 发布订阅
  #listenObj = {}
  #on(prop, cb) {
    let listenObj = this.#listenObj
    listenObj[prop] ? listenObj[prop].push(cb) : (listenObj[prop] = [cb])
  }
  #emit(prop) {
    let listeners = this.#listenObj[prop]
    Array.isArray(listeners) && listeners.forEach(cb => cb())
  }

  /**
   * new 的时候执行执行传入的函数 func，函数执行后改变状态 #status
   * 并将返回的结果记录到 #result 中，这里 #status 和 #result 都用的私有变量
   */
  constructor(func) {
     let exec = (data, status) => {
      if (this.isStatusSettled()) {
        return
      }
      this.#status = status
      this.#result = data
      setTimeout(() =>this.#emit(status), 0) // 触发 _then 里面的回调，支持异步
    }
    func(data => exec(data, 'fulfilled'), err => exec(err, 'rejected'))
  }

  /**
   * 用 _then 方法取值时，看 #status 的状态，决定执行哪个函数
   * 如果状态是 settled
   * 1. 没有传入对应的 cb，创建保存当前状态的 promise 副本并返回
   * 2. 传入了对应的 cb，创建一个基于 cb 返回值的副本
   * 3. 如果 cb 没返回值时，fulfilled, rejected 都默认返回 fulfilled
   * 如果状态时 pending，直接返回 this
   */
  _then(successCallback, failCallback) {
    // 是否有传入对应的回调函数
    const result = this.#result
    const successCb = () => {
      if (typeof successCallback !== 'function') {
        return MyPromise.resolve(result)
      }
      let res = successCallback(result)
      return MyPromise.resolve(res === undefined ? result : res)
    }
    const failCb = () => {
      if (typeof failCallback !== 'function') {
        return MyPromise.reject(result)
      }
      let res = failCallback(result)
      return res === undefined ? MyPromise.reject(result) : MyPromise.resolve(res)
    }

    // 如果状态已经落定，不用监听了
    if (this.isStatusSettled()) {
      // 这里同步，执行顺序就不管了
      return this.#status === 'fulfilled' ? successCb() : failCb()
    } else {
      // 状态没落定，开启监听，并先返回 pending 状态的 this
      this.#on('fulfilled', successCb)
      this.#on('rejected', failCb)
      return this
    }
  }

  _catch(cb) {
    return this._then(null, cb)
  }

  _finally(cb) {
    // 当状态落定后，且状态不是 pending 时执行
    // 如果没有 cb，返回当前 Promise 状态副本，如果有 cb ，且 cb 返回值为 Promise 实例，
    // 且实例的状态为 pending 或 reject，就返回对应的 Promise 实例副本
    let finallyCb = () => {
      if (typeof cb === 'function') {
        let res = cb(this.#result)
        let isNoChange = !(res instanceof MyPromise) || res.getData().status === 'fulfilled'
        return isNoChange ? this.clone(this) : MyPromise.resolve(res)
      } else {
        return this.clone(this)
      }
    }
    // 如果状态已落定
    if (this.isStatusSettled()) {
      return finallyCb()
    } else {
      // 状态没落定，开启监听，并先返回 pending 状态的 this
      this.#on('fulfilled', finallyCb)
      this.#on('rejected', finallyCb)
      return this
    }
  }

  // 如果是 Promise 实例，返回对应的实例，否则返回以 value 为值的结果
  static resolve(value) {
    let isPromiseInstance = typeof value === 'object' && value instanceof MyPromise
    return isPromiseInstance ? value : new MyPromise(resolve => resolve(value))
  }

  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value))
  }

  static all(array) {
    return new MyPromise((resolve, reject) => {
      let successCount = 0
      let resultArr = []
      for (let i = 0; i < array.length; i++) {
        let promise = MyPromise.resolve(array[i])
        promise._then((data) => {
          successCount++
          resultArr.push(data)
          successCount === array.length && resolve(resultArr)
        }, (err) => {
          reject(err)
        })
        // 函数参数 (err) => { reject(err) } 等价于 reject
      }
    })
  }

  static race(array) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        let promise = MyPromise.resolve(array[i])
        promise._then(resolve, reject)
        // 函数参数 (err) => { reject(err) } 等价于 reject
      }
    })
  }

  // 状态是否是落定状态
  isStatusSettled() {
    return ['fulfilled', 'rejected'].includes(this.#status)
  }

  // 返回落定状态的实例副本，只是复制 status 和 result
  clone(promise) {
    let p = new MyPromise(r => r('test'))
    p.setData(promise.getData())
    return p
  }

  getData() {
    return {
      status: this.#status,
      result: this.#result
    }
  }

  setData({ status, result}) {
    this.#status = status
    this.#result = result
  }
}
```

实现了 Promise.all 之后，再来看怎么处理 Promise.all 的错误，其实实现 Promise.all 很简单，我们自己自己实现一个  Promise.all 类似的逻辑即可。
## 怎么判断一个Promise实现是OK的（扩展）
怎么判断一个 Promise 实现是 OK 的，下面来写一些例子，用于单元测试
```js
/**
 * 基本功能，实例创建、三种状态
 * 1. 返回一个 Promise 实例，状态为 pending，值为 undefined
 * 2. 返回一个 Promise 实例，状态为 fulfilled，值为 'hello'
 * 3. 返回一个 Promise 实例，状态为 reject，值为 error
 * 4. 状态落定后测试，返回一个 Promise 实例，状态为 reject, 值为 error
 */
new Promise(() => {})
new Promise(resolve => resolve('hello'))
new Promise((resolve, reject) => reject('error'))
new Promise((resolve, reject) => {
  reject('error')
  resolve('hello')
})

/**
 * then 函数基本用法 - pending 状态时
 * b 返回 pending 状态的 Promise 实例，且 then 传入的两个函数都没有执行
 */
a = new Promise(() => {})
b = a.then(data => console.log(data), (err) => console.log(err))

/**
 * then 函数基本用法 - 异步触发
 * 1. 3秒后，是否执行传入的第一个函数
 * 2. 3秒后，是否执行传入的第二个函数
 */
a = new Promise(resolve => setTimeout(resolve, 3000))
b = new Promise((resolve, reject) => setTimeout(reject, 3000))
a.then(data => console.log('success'), err => console.log(err))
b.then(data => console.log(data), err => console.log('error'))

/**
 * then 函数基本用法 - resolve 传值，回调函数返回值测试
 * then 传入的第一个函数有执行，第二个函数未执行
 * 1. 返回值 data 为 hello
 * 1. b 返回 fulfilled 状态的 Promise 实例，值为 'abc', a !== b
 * 2. b 返回 fulfilled 状态的 Promise 实例，值为 'test', a !== b
 * 3. b 返回 rejected 状态的 Promise 实例，值为 'error', a !== b
 * 4. b 返回 pending 状态的 Promise 实例，值为 undefined, a !== b
 */
a = new Promise(resolve => resolve('hello'))
b = a.then(data => console.log(data), err => console.log(err))
b = a.then(data => 'abc', err => console.log(err))
b = a.then(data => new Promise(resolve => resolve('test')), err => console.log(err))
b = a.then(data => new Promise((resolve, reject) => reject('error')), err => console.log(err))
b = a.then(data => new Promise(() => {}), err => console.log(err))

/**
 * then 函数基本用法 - reject 传值，回调函数返回值测试
 * then 传入的第二个函数有执行，第一个函数未执行
 * 1. 返回值 err 为 "error"
 * 2. b 返回 fulfilled 状态的 Promise 实例，值为 'abc', a !== b
 * 3. b 返回 fulfilled 状态的 Promise 实例，值为 'test', a !== b
 * 4. b 返回 rejected 状态的 Promise 实例，值为 'error', a !== b
 * 5. b 返回 pending 状态的 Promise 实例，值为 undefined, a !== b
 */
a = new Promise((resolve, reject) => reject('error'))
b = a.then(data => console.log(data), err => console.log(err))
b = a.then(data => console.log(data), err => 'abc')
b = a.then(data => console.log(data), err => new Promise(resolve => resolve('test')))
b = a.then(data => console.log(data), err => new Promise((resolve, reject) => reject('error')))
b = a.then(data => console.log(data), err => new Promise(() => {}))

/**
 * then 函数基本用法 - 回调函数不传时/catch，返回实例状态是否正常
 * 1. b 是原 Promise 实例的副本，状态 fulfilled, 值 hello，a !== b
 * 2. b 是原 Promise 实例副本，状态 rejected, 值 error, a2 !== b
 * 3. 测试 catch 返回是否执行正常，返回 fulfilled，值为 undefiend, a2 !== c
 */
a = new Promise(resolve => resolve('hello'))
b = a.then(null, err => console.log(err))
a2 = new Promise((resolve, reject) => reject('error'))
b = a2.then(data => console.log(data), null)
c = a2.catch(err => console.log(err))

/**
 * then 回调执行顺序测试
 * 打印顺序 done、done2、a1、a2
 */
a = new Promise(r => r('a1')); 
a.then((d) => console.log(d));
console.log('done')
a2 = new Promise(r => r('a2')); 
a2.then((d) => console.log(d));
console.log('done2')

/**
 * Promise.resolve 与 Promise.reject 测试
 * 1. 返回 Promise 实例, 状态 fulfilled, 值 123
 * 2. 返回 Promise 实例, 状态 pending, 值 undefined
 * 3. 返回 Promise 实例, 状态 fulfilled, 值 hello
 * 4. 返回 Promise 实例, 状态 rejected, 值 err
 * 5. 返回 Promise 实例, 状态 rejected, 值 err
 * 6. 返回 Promise 实例, 状态 rejected, 值 Promise 实例 pending
 * 7. 返回 Promise 实例, 状态 rejected, 值 Promise 实例 resolve
 * 8. 返回 Promise 实例, 状态 rejected, 值 Promise 实例 reject
 */
a = Promise.resolve('123')
a = Promise.resolve(new Promise(() => {}))
a = Promise.resolve(new Promise(resolve => resolve('hello')))
a = Promise.resolve(new Promise((resolve, reject) => reject('err')))
a = Promise.reject('err')
a = Promise.reject(new Promise(() => {}))
a = Promise.reject(new Promise(resolve => resolve('hello')))
a = Promise.reject(new Promise((resolve, reject) => reject('err')))


/**
 * Promise.prototype.finally 测试
 * 1. 打印 a， b 返回新的 Promise 实例，状态为 fulfilled, 值 success
 * 2. 打印 a2， b2 返回新的 Promise 实例，状态为 rejected, 值 error
 * 3. 不打印 a3， b3 返回新的 Promise 实例，状态为 pending, 值 undefined
 * 4. 返回值测试, c 返回新的 Promise 状态为 pending
 * 5. d 返回新的 Promise 状态为 rejected
 */
a = new Promise(r => r('success')); 
b = a.finally(() => console.log('a')) //
a2 = new Promise((r, j) => j('error')); 
b2 = a2.finally(() => console.log('a2')) // 
a3 = new Promise(() => {})
b3 = a3.finally(() => console.log('a3')) // 
c =  a.finally(() => new Promise(() => {})) // 
d =  a.finally(() => Promise.reject('error')) // 


/**
 * Promise.all 与 Promise.race 测试
 * 1. 返回 Promise 实例，rejected 状态，值为 1
 * 2. 返回 Promise 实例，fulfilled 状态，值为 ['a', 'b', 'c']
 * 3. 返回 Promise 实例，rejected 状态，值为 1
 * 4. 返回 Promise 实例，fulfilled 状态，值为 2
 */
a = MyPromise.all([ 
  MyPromise.resolve(),
  MyPromise.reject('1'),
  MyPromise.resolve()
])
b = MyPromise.all([ 
  MyPromise.resolve('a'),
  MyPromise.resolve('b'),
  MyPromise.resolve('c')
])
c = MyPromise.race([ 
  MyPromise.reject('1'),
  MyPromise.reject('2'),
  MyPromise.resolve()
])
d = MyPromise.race([ 
  MyPromise.resolve('a'),
  MyPromise.resolve('b'),
  MyPromise.resolve('c')
])
```

## 异步函数 async/await
ES2017/ES8 新增的 async/await 关键字主要用于解决异步结构代码组织的问题。

### async异步函数
async 关键字用于声明异步函数，其返回值是一个 Promise 对象，相当于返回 return Promise.resolve(返回值)
```js
async function foo() {}
let foo = async () => {} 
let obj = {
  async foo() {}
}

async function foo() {
  console.log(1)
}
foo()
console.log(2)
// 1
// 2

async function foo() {
  console.log(1)
  return 3 // 等价于 return Promise.resolve(3)
}
foo().then(console.log)
console.log(2)
// 1
// 2
// 3
```
async 异步函数的返回值，如果是实现了 thenable 接口的对象（也就是按照规范实现了 then 方法），函数的返回值在执行 then 方法时就使用该方法。
```js
async function foo() {
  const thenable = {
    then(cb) {
      cb('foo')
    }
  }
  return thenable
}
foo() // Promise {<fulfilled>: "foo"}
foo().then(console.log) // "foo"
```
在异步函数中 throw 错误，会返回 rejected 的 Promise 实例。但如果使用了 Promise.reject() 且没有 return，是不会返回 rejected 的 Promise 实例的。
```js
async function foo() {
  throw 'error'
}
foo().catch(console.log)
// error
// Promise {<fulfilled>: undefined}

async function foo() {
  console.log(1)
  Promise.reject(2)
}
foo().catch(console.log)
// 1
// Promise {<fulfilled>: undefined}
// VM33271:3 Uncaught (in promise) 2

async function foo() {
  console.log(1)
  return Promise.reject(2)
}
foo().catch(console.log)
// 1
// 2
// Promise {<fulfilled>: undefined}
```

### await
异步函数主要针对不会马上完成的任务，await 提供了一种暂停和恢复执行的能力。它必须在 async 异步函数中使用。await 关键字后面的值可以是以下 3 种类型：
1. 常规值，会使用 Promise.resolve() 转换成 Promise 实例。
2. Promise 实例
3. 实现了 thenable 接口的对象

await 类似于 generator 函数里面的 yield，可以暂停函数的执行。await 和 yield 有两个区别：
1. yield 恢复执行需要自身调用 next() 方法。而 await 则是在后面的 Promise 状态 settled 落定后，自动恢复执行。
2. yield 表达式的返回值依赖调用 next() 方法传入，await 表达式返回值是当 Promise 实例处于 fulfilled 状态落定后，自动执行 then 方法拿到的 resolve 的值。**如果落定状态是 rejected 会抛出异常。如果不使用 try/catch 捕获异常，async 函数会立即终止执行，并返回 rejected 状态的 Promise 实例。**
```js
// 例子 1 await 一直是 pending 的状态
async function foo() {
  await new Promise(() => {}); 
  console.log('1')
}
foo() // 不会打印 1，状态未落定

// 例子 2 generator 与 async/await
function * foo() {
  let x = yield new Promise(r => setTimeout(() => r('a'), 2000))
  console.log(x)
  console.log('b')
}
let res = foo()
res.next() 
// {value: Promise, done: false}
res.next()
// undefined
// b
// {value: undefined, done: true}

async function foo() {
  let x = await new Promise(r => setTimeout(() => r('a'), 2000))
  console.log(x)
  console.log('b')
}
// 两秒后打印 
// a
// b

// 例子 3 await rejected 落定状态
async function foo() {
  let x = await Promise.reject('err')
  console.log(x)
  console.log('b')
}
a = foo()
// Promise {<pending>}
// Uncaught (in promise) err 抛出异常
// 没有捕获异常，await 表达式后面的语句都不会执行
a // Promise {<rejected>: "err"}
a.catch(console.log)

// 例子 4 thenable
async function foo() {
  const thenable = {
    then(cb) {
      cb('result')
    }
  }
  let res = await thenable
  console.log(res)
}
foo()
// result
// Promise {<fulfilled>: undefined}
```

### async/await 执行顺序
只需要注意两点即可：
1. 如果 async 异步函数中没有 await，那和普通函数没区别
2. 如果有 await 会暂停，将后面内容 push 到任务队列，等状态落定后再继续执行。就算 await 的是立即可用的值，它也是异步的。
```js
async function a() {
  console.log(2)
}
console.log(1)
a()
console.log(3)
// 执行顺序
// 1
// 2
// 3

async function a() {
  console.log(await Promise.resolve('a'))
}
async function b() {
  console.log(await 'b')
}
async function c() {
  console.log('c')
}
a()
b()
c()
// 执行顺序
// c
// a
// b

async function a() {
  console.log(2)
  console.log(await Promise.resolve(8))
  console.log(9)
}
async function b() {
  console.log(4)
  console.log(await 6)
  console.log(7)
}
console.log(1)
a()
console.log(3)
b()
console.log(5)
// 执行顺序
// 1 2 3 4 5 8 9 6 7 
```
### async/await 实用场景与注意事项
1. 按照同步的方式，写异步逻辑。不用写 xx.then，写法更优雅简单

```js
let getAsyncData() {
  return new Promise((resolve, reject) => {
    // ...
    '正确' ? resolve('数据') : reject('错误')
  })
}

// Promise 方法
getAsyncData().then((data) => {
  console.log(data)
}).catch(err => {
  // 错误处理
})

// async/await
(async () => {
  try {
    let data = await getAsyncData()
    console.log(data)
  } catch (err) {
    // 错误处理
  }
})() 
```
2. 实现 sleep 等待函数

```js
function sleep(delay) {
  return new Promise(r => setTimeout(r, delay))
}
async function test() {
  const start = Date.now()
  await sleep(2000)
  console.log(Date.now() - start)
}
test()
// 2004
```

3. 如果是多个异步，不依赖顺序就不用 await 了。如果非要 await 可以等 Promise 都执行完成后，遍历对应的结果数组再 await。这样就不用等第一个执行完，再执行第二个，再执行第三个，顺序执行。

4. **栈追踪与内存管理** Promise 和 异步函数 async 在功能上有重叠，但他们在内存中的表示差别很大。在创建 Promise 时，JS 引擎会尽量保留完整的调用栈。async/await 只会反映当前的调用栈，没有额外的消耗，可以优先考虑。 

```js
function execFunc(reslove, reject) {
  setTimeout(reject, 1000, 'bar') // 等价于 setTimeout(() => { reject.call(this, 'bar')}, 1000)
}

function a() {
  new Promise(execFunc)
}
a()
// Uncaught (in promise) bar
// setTimeout (async)
// execFunc
// a 

async function a() {
  await new Promise(execFunc)
}
a()
// Uncaught (in promise) bar
// a
// async function (async)
// a
```

