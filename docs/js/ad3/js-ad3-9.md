---
title: 9. 代理与反射(Proxy与Reflect) - JS高程4
description: 最开始在看 《ES6入门》的 Proxy 与 Reflect 时，有点不理解。然后看了菜鸟教程上对应的内容就理解了一点。这里结合本书以及之前的笔记，根据个人理解，做一个总结梳理。ES6 新增的代理（Proxy）和反射（Reflect）可以对（函数、对象的）基本操作进行拦截、修改、并添加额外的处理逻辑。先通过一个例子来初步了解 Proxy 的用法。
keywords: JS代理,Proxy,Reflect,反射
---

# 9. 代理与反射(Proxy与Reflect)

最开始在看 《ES6入门》的 Proxy 与 Reflect 时，有点不理解。然后看了菜鸟教程上对应的内容就理解了一点。这里结合本书以及之前的笔记，根据个人理解，做一个总结梳理。

- [3.1.2 ES6 Reflect 与 Proxy | 菜鸟教程](https://www.runoob.com/w3cnote/es6-reflect-proxy.html)
- [Proxy | ES6入门笔记](http://fe.zuo11.com/js/es6/es6-10.html#proxy)

ES6 新增的代理（Proxy）和反射（Reflect）**可以对（函数、对象的）基本操作进行拦截、修改、并添加额外的处理逻辑**。

先通过一个例子来初步了解 Proxy 的用法：
- `new Proxy(target, handler)` 会创建一个 `target` 的 **代理对象 `targetProxy`**，类似于 `target` 的一个副本。对 `target` 的修改会同步到代理对象上，对代理对象的修改也会同步到 `target` 上。
- `target` 可以是对象、函数、类。不能是 `non-object`，比如 字符串、数字等。否则会抛出异常 `TypeError: Cannot create proxy with a non-object as target or handler`
- `handler` 是一个对象。里面包含 **捕获器 `trap`** 函数，比如 get()、set()、has()、apply()、construct() 等。用于在使用 **代理对象 `targetProxy`** 进行对应的操作时进行拦截、修改、添加额外的处理逻辑。
```js
let obj = { name: 'zuo' }

// 创建 obj 代理对象并赋值给 objProxy
// 对对象的get、set操作进行捕获，在默认行为上加入 console.log 逻辑
let objProxy = new Proxy(obj, {
  get(target, prop, receiver) {
    console.log(`get ${prop}`)
    // 这里可以重写 get 值
    return target[prop]
  },
  set(target, prop, value, receiver) {
    console.log(`set ${prop}`)
    target[prop] = value
  }
})
objProxy // Proxy {name: "zuo"}

// 使用代理对象做 get 操作时，会执行 get 捕获器逻辑
objProxy.name 
// get name
// "zuo"

// 使用原对象做 get 操作时，不会走捕获的逻辑
obj.name // "zuo"

// 使用代理对象做 set 操作时，会执行 set 捕获器逻辑
objProxy.age = 18
// set age
// 18

// 在代理对象上所的的修改，会更新到原对象上
obj // {name: "zuo", age: 18}

// 在原对象的修改，也会同步更新到代理对象上
obj.age = 100 // 100
objProxy // Proxy {name: "zuo", age: 100}
```
上面的 target 是对象，如果 target 是 **函数** 或者 **类 Class** 呢？来看下面的例子
```js
// 创建函数的代理
function sum(a, b) {
  return a + b
}
let sumProxy = new Proxy(sum, {}) 
sumProxy // Proxy {length: 2, name: "sum", arguments: null, caller: null, prototype: {…}}
sumProxy(1, 2) // 3

// 创建类的代理
class Person {
  name = "zuo"
  sayName() {
    console.log(this.name)
  }
}
let PersonProxy = new Proxy(Person, {})
PersonProxy // Proxy {length: 0, prototype: {…}, name: "Person"}
let p1 = new PersonProxy()
p1.name // "zuo"
p1.sayName() // "zuo"
```
只需要记住，在代理对象、函数、类 Class 时，使用 target 创建的代理对象 targetProxy，是 target 的副本/镜像。原 target 可以怎么使用，代理对象 targetProxy 就可以怎么使用。

Map、Set 类型也可以成功创建代理对象，但无法像原对象那样进行 `.add()` 或 `.set()` 操作，会抛异常：`TypeError: Method Set.prototype.add called on incompatible receiver [object Object]`

```js
// 创建 Set 的代理
let set = new Set().add('a').add('b')
set // Set(2) {"a", "b"}
let setProxy = new Proxy(set, {})
setProxy // Proxy {"a", "b"}
setProxy.add('a')
// TypeError: Method Set.prototype.add called on incompatible receiver [object Object]
```
## 捕获器函数参数与反射(Reflect)
handler 里面的捕获器函数的参数，可以还原操作的默认行为。比如 `get(target, prop, receiver)` 
```js
let obj = { name: "zuo" }
let handler = {
  get(target, prop, receiver) {
    // target 就是原对象本身
    console.log(target === obj)
    // prop 是触发get操作使用的属性名
    console.log(prop)
    // receiver 是代理对象本身
    console.log(receiver === objProxy)
    // 还原原对象 get 操作的默认逻辑
    return target[prop]
  }
}
let objProxy = new Proxy(obj, handler)
objProxy.name
// true
// name
// true
// "zuo"
```
上面的例子中，我们还原了 get() 捕获器的原始操作逻辑，但并不是所有的捕获器函数逻辑都像 get() 那样简单：只用 return 一个值即可。对于还原比较复杂的原始操作，自己去写逻辑实现是不现实的。因此系统提供了全局的 **反射（Reflect）** 对象来处理原始行为。我们只需要调用 Reflect 对象上的同名方法就可以轻松还原原始行为。

```js
let obj = { name: "zuo" }
let handler = {
  get(target, prop, receiver) {
    // 还原原对象 get 操作的默认逻辑
    // return target[prop]
    return Reflect.get(...arguments)
  }
}
let objProxy = new Proxy(obj, handler)
objProxy.name // "zuo"

// 简写方式 1
let obj = { name: "zuo" }
let handler = {
  get: Reflect.get
}
let objProxy = new Proxy(obj, handler)
objProxy.name // "zuo"

// 简写方式 2
let obj = { name: "zuo" }
let objProxy = new Proxy(obj, Reflect)
objProxy.name // "zuo"
```
## trap invariant、撤销代理、代理代理
使用代理的捕获器方法基本可以修改所有基本方法的行为，但也是有限制的，需要遵循 "捕获器不变式"（trap invariant），比如如果对象有一个属性是不可修改的(writable)，如果代理的捕获器有修改该值，就或抛出 TypeError 的异常。

```js
let obj = {}
Object.defineProperty(obj, 'age', {
  writable: false,
  value: 'bar'
})
let objProxy = new Proxy(obj, {
  get(target, prop, receiver) {
    return 'abc'
  }
})
objProxy.age
// TypeError: 'get' on proxy: property 'age' is a read-only and 
// non-configurable data property on the proxy target but the proxy 
// did not return its actual value (expected 'bar' but got 'abc')
```
使用 new Proxy创建的代理对象与原对象的关联一直会存在，如果想取消代理。使用使用 Proxy.revocable() 来创建代理对象。`Proxy.revocable(obj, handler)` 会返回一个对象 `{proxy: Proxy, revoke: ƒ}`，其中 `proxy` 属性为代理对象，`revoke` 函数可以用于撤销代理。撤销代理后，代理对象就无法使用了。
```js
const obj = { name: 'zuo' }
const handler = {
  get() {
    return 'li'
  }
}
const { proxy: objProxy, revoke } = Proxy.revocable(obj, handler) 
// {proxy: Proxy, revoke: ƒ}
obj.name  // "zuo"
objProxy.name // "li"
revoke()
objProxy.name 
// TypeError: Cannot perform 'get' on a proxy that has been revoked
```

如果我们为 obj 创建了一个代理对象 objProxy，我们也可以为代理对象创建代理 `new Proxy(objProxy, handler)`
## Reflect 实用场景
Reflect 除了可以用于还原 Proxy 代理捕获器的默认行为外，还有 3 种用途
1. 将部分 Object 函数捕获异常的 try...catch 写法，改为 if...else 写法，因为某些方法错误时直接抛异常，Reflect 则返回 false。相关函数有 `Reflect.defineProperty()`、`Reflect.preventExtensions()`、`Reflect.setPrototypeOf()`、`Reflect.set()`、`Reflect.deleteProperty()`
```js
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```
2. 让 Object 的默认命令操作符，变为函数行为，比如 in（使用 Reflect.has 代替）、delete（使用 Reflect.deleteProperty 代替）。另外 Reflect.get() 可以替代属性访问操作符(.)；Reflect.set() 可以替代 = 复制操作符；Reflect.construct() 可以替代 new 操作符。
```js
// 老写法
'assign' in Object // true
delete obj.name

// 新写法
Reflect.has(Object, 'assign') // true
Reflect.deleteProperty(obj, 'name')
```
3. 安全 apply 函数简写，在为了防止内部的 apply 或 toString 被重写，一般安全的调用函数使用的是 `构造函数.prototype.方法名.call()` 这种写法
```js
Function.prototype.applay.call() 
// 可以简写为 
Reflect.apply()
```
## 代理的缺陷
代理中的 this 问题。target 与它的代理对象 targetProxy 虽然基本一致，但他们却不是全等 === 的。当对象存在 this 相关调用时，可能会有问题。

```js
const wm = new WeakMap()
class User {
  cosntructor(id) {
    wm.set(this, id)
  }
  set id(id) {
    wm.set(this, id)
  }
  get id() {
    return wm.get(this)
  }
}


let user = new User('zuo')
user.id // 'zuo'   
// wm 映射中 key 为 user 对象
let userProxy = new Proxy(user, {})
// 代理后取的 this 为 userProxy 对象，和 user 对象地址不一样
userProxy.id // undefined
```
另外 Date 类型依赖内部 this 上的 `[[NumberDate]]` ，而这个属性无法通过 get/set 操作拿到，代理对象也获取不要，就会抛出异常
```js
let date = new Date()
let dateProxy = new Proxy(date, {})

dateProxy instanceof Date // true
date.getDate() // 19
dateProxy.getDate()
// Uncaught TypeError: this is not a Date object.
``` 
## 捕获器函数与对应的 Reflect 方法
代理捕获器可以捕获 13 中不同的基本操作。下面来看看
- **get(target, prop, receiver)**，会在获取属性值时被调用。对应 `Reflect.get()`，拦截操作 `proxyObj.prop`、`Object.create(proxyObj)[prop]`、`Reflect.get(proxyObj, prop, receiver)`。
- **set(target, prop, value, receiver)**, 会在设置属性值时被调用。对应 `Reflect.set()`，拦截操作 `proxyObj.prop = xxx`、`Object.create(proxyObj)[prop] = xxx`、`Reflect.set(proxyObj, prop, xxx, receiver)`。
- **has(target, prop)** 会在使用 in 操作符时被调用，对应 `Reflect.has()`，拦截操作 `prop in proxyObj`、`prop in Object.create(proxyObj)`、`with(proxyObj) { (prop); }`、`Reflect.has(proxyObj, prop)`
- **defineProperty(target, prop, descriptor)** 会在 Object.defineProperty() 时被调用。对应 `Reflect.defineProperty()`
- **getOwnpropertyDescriptor(target, prop)**，会在 Object.getOwnpropertyDescriptor() 时被调用，对应 `Reflect.getOwnpropertyDescriptor()`
- **deletePropery(target, prop)**，会在 delete 操作时被调用。对应 `Relect.deleteProperty()`
- **ownKeys(target)**，会在 Object.ownKeys() 时被调用。对应 `Reflect.ownKeys()` 拦截的其他操作 `Object.getOwnPropertySymbols(proxyObj)`、`Object.keys(proxyObj)`
- **getPrototypeOf(target)**，会在 Ojbect.getPrototypeOf 时被调用，对应 `Reflect.getPrototypeOf()`，拦截的其他操作 `proxyObj.__proto__`、`Object.prorotype.isPrototypeOf(proxyObj)`、`proxyObj instanceof Object`
- **setPrototypeOf(target)**，会在 Ojbect.setPrototypeOf 时被调用，对应 `Reflect.setPrototypeOf()` 
- **isExtensible(target)**，会在 Object.isExtensible() 时调用，对应 `Reflect.isExtensible()`
- **preventExtensions(target)**，会在 Object.preventExtensions() 时调用，对应 `Reflect.preventExtensions()`
- **apply(target, thisArg, ...argumentsList)**，会在 apply() 时被调用。对应 `Reflect.apply()`，拦截的其他操作 `proxyObj(...argumentsList)`、`Function.prototype.apply()`, `Function.prototype.call()`
- **construct(target, argumentsList)**，会在 new 时被调用，对应 `Reflect.construct()`，拦截 `new proxyObj(...argumentsList)`、`Reflect.construct(target, argumentsList)`

## 代理模式(代理实用场景)

1. 跟踪属性访问，最开始的例子中我们在 get、set 捕获器中都加了 console.log，可以用于判断对象什么时候被访问过。
2. 隐藏属性，修改 get、has 捕获器的默认行为，当访问某些属性时，直接返回 undefined 或 false。
3. 属性验证，修改 set 捕获器的默认行为，如果设置的值类型不对，可以抛出异常。
4. 函数与构造函数参数验证，修改 apply, construct 的捕获器默认行为，可以验证参数时候正确。
5. 数据双向绑定与可观察对象，Vue 3.0 使用 Proxy 代替 Object.defineProperty 来实现双向绑定。但缺点是不兼容 IE。
