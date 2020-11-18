---
title: 7. 迭代器与生成器(Iterator 与 Generator) - JS高程4
description: 本章节内容与《ES6 入门》中对应的核心内容基本一致。主要差异在于描述方法与知识点介绍的先后顺序。个人感觉这本书有些地方从概念上看好理解一点，最好两本书结合一起看。下面是在有 《ES6入门》Iterator、Generator 基础后，再来看本书时，做的一些重点笔记。
keywords: 迭代器,Iterator,生成器,Generator
---

# 7. 迭代器与生成器(Iterator 与 Generator)

本章节内容与《ES6 入门》中对应的核心内容基本一致。主要差异在于描述方法与知识点介绍的先后顺序。个人感觉这本书有些地方从概念上看好理解一点，最好两本书结合一起看。下面是在有 《ES6入门》Iterator、Generator 基础后，再来看本书时，做的一些重点笔记。之前 ES6入门 笔记参考：

- 迭代器 Iterator： [Iterator和for...of循环 - ES6入门笔记](http://fe.zuo11.com/js/es6/es6-12.html)
- 生成器 Generator：[Generator函数 - ES6入门笔记](http://fe.zuo11.com/js/es6/es6-13.html)

迭代器(Iterator)、生成器(Generator) 是 ES6 新增的两个特性，用于更好的实现迭代。迭代可以理解为遍历。

## 迭代器(Iterator)
ES6之前，遍历有 3 种方法：for（或while）、for...in、forEach，传统遍历方法的缺陷：
- 迭代方法不统一，其中 for、forEach 用于遍历数组。for...in 用于遍历对象。
- 迭代之前需要事先知道数据结构，一般使用数组索引来遍历。并不适用具有隐式顺序的数据结构来说。
- forEach 虽然解决了不用使用索引取值的问题，但无法终止循环，且回调函数的实现不够优雅，只适用于数组。

ES6 新增 Set、Map、解构、扩展运算符(...) 等，对于新增的数据类型，无法通过数组下标的方法来迭代，通过 for...in 也不合适，会比较乱。

Python、Java、C++ 等很多语言都通过 **迭代器模式** 解决了迭代不统一的问题。ES 第六版开始支持迭代器模式，也就是 ES6 的 Iterator。**只要数据类型实现了 Symbol.iterator 迭代器方法（也叫 Iterable 接口，可迭代协议），它就是可迭代的，可以使用 for...of 遍历。**

很多内置类型都实现了 Iterable 接口
- 字符串、数组、Map(映射)、Set(集合)、arguments对象、NodeList 等 DOM 集合类型

```js
let str = 'xyz' // string
let arr = [1, 2, 3] // object [1, 2, 3]
let map = new Map().set('x', 1).set('y', 2) // object Set {}
let set = new Set().add('a').add('b') // object Map {}
let elArr = document.querySelectorAll('div') // Nodelist []

str[Symbol.iterator] // [Symbol.iterator]() { }
let strIterator = str[Symbol.iterator]() // StringIterator {} 该方法返回一个 Iterator 对象
arr[Symbol.iterator]() // Array Iterator {}
map[Symbol.iterator]() // MapIterator {}
set[Symbol.iterator]() // SetIterator {}
elArr[Symbol.iterator]() // Array Iterator {}

strIterator.next() // {value: 1, done: false}
strIterator.next() // {value: 2, done: false}
strIterator.next() // {value: 3, done: false}
strIterator.next() // {value: undefined, done: true}
```

在 JS 的一些内部操作中，接收可迭代对象的场景有：
- for...of 循环
- 数组解构（let [a, b, c] = xx）
- 扩展操作符(...xx)
- 创建集合（new Set(xx)）
- 创建映射（new Map(xx)）
- Promise.all() 接收由 Promise 组成的可迭代对象
- Promise.race() 接收由 Promise 组成的可迭代对象
- yield* 操作符（yield* xx）

下面的例子中，对象 obj 实现了 Symbol.iterator 方法。该方法返回一个迭代器对象，该对象包含 next() 方法，每次调用 next() 方法，会返回一个有效的 IteratorResult 对象 { value: 'xx', done: 'true or false'}。这样就可以使用 for...of 遍历了。
```js
let obj = {
  count: 5,
  [Symbol.iterator]() {
    let index = 1,
        limit = this.count
    return {
      next() {
        if (index <= limit) {
          return { value: index++, done: false}
        } else {
          return { value: undefined, done: true}
        }
      },
      return() {
        console.log('exit iterator')
        return { done: true}
      }
    }
  }
}

for (item of obj) {
  if (item > 3) {
    break
  }
  console.log(item)
}
```

在提前终止迭代器中，除了实现了 next() 方法，还可以实现可选的 return() 方法，用于在迭代终止时执行，比如：break, continue, return, throw, 解构操作并未消费所有值时。

就算没有实现 return 方法，也是可以提前终止的。注意：**上面的例子中，每次 for...of 操作 obj 都会调用 Symbol.iterator 返回一个新的iterator 对象。如果使用 for...of 调用 `obj[Symbol.iterator]()` 那他的迭代器对象就是固定的。每次只是调用对应的 next 方法。**

## 生成器(Generator)

Generator 函数，拥有在函数块内 **暂停** 和 **恢复代码执行** 的能力。

这种函数不支持箭头函数创建，函数名前面有一个 *

```js
function * generatorFunc() { /***/ }
let generatorFunc = function * () { /***/ }
let obj = {
  * generatorFunc() { /***/ }
}
```

**调用 Generator 函数会生成一个 generator 对象(生成器对象)。这个对象最开始处于暂停(suspended)状态。生成器对象内部实现了 Iterator 接口，该对象调用 next() 方法可以让生成器开始或恢复执行。**

```js
function * generatorFunc() { /***/ }
let generatorObj = generatorFunc()
generatorObj // generatorFunc {<suspended>}
generatorObj.next() // {value: undefined, done: true}
```

调用 generator 函数生成的对象，只会在 next() 后采开始执行，return 用于退出生成器函数，会处于 { done: true } 状态

```js
function * generatorFunc() {
  console.log('abc')
  return 'text'
}
let generatorObj = generatorFunc()
generatorObj.next()
// abc
// {value: "text", done: true}
```
调用 generator 函数生成的对象，和该对象的迭代器对象是全等的。它默认的迭代器是自引用的。
```js
function * generatorFunc() { /***/ }
let generatorObj = generatorFunc()
generatorObj === generatorObj[Symbol.iterator]()
```

### 使用 yield 中断执行

```js
function * generatorFunc() {
  yield 'a'
  yield 'b'
  return 'c'
}
let generatorObj = generatorFunc() // 暂停状态
generatorObj.next() 
// 遇到 yield 停止，返回 yield 后面的 'a' { value: 'a', done: false }
generatorObj.next() 
// 遇到 yield 停止，返回 yield 后面的 'b' { value: 'b', done: false }
generatorObj.next()
// 遇到 return ，结束，返回 'c' { value: 'c', done: true }

[...generatorFunc()] // ['a', 'b']
```

::: tip
- 生成器（Generator）函数和迭代器 Iterator 函数一样，每次调用都会生成一个新的迭代器对象/生成器对象。多次调用生成的对象作用域隔离。
- yield 只能在 generator 函数内部，中间不能嵌套其他函数。
- 使用 for...of 在遍历生成器对象时，无法遍历 return 的值，只能遍历 yield 后面的值
:::

可以通过 next 表达式传参，指定上一次 yield 表达式的返回值。
```js
function * generatorFunc(initVal) {
  console.log(initVal)
  console.log(yield) // let temp = yield; console.log(temp)
  console.log(yield)
}
let generatorObj = generatorFunc('a') // 暂停状态
generatorObj.next('b') // 将 b 作为上次一的返回结果，但由于是第一次开始执行所以不会被使用。
// 'a'
// { value: undefined, done: false }
generatorObj.next('c') // 将 c 作为上一次 yield 表达式的返回结果
// 'c'
// { value: undefined, done: false }
generatorObj.next('d')
// 'd'
// { value: undefined, done: true }

```

一般 yield 后面跟的是字符串。如果 yield 后面需要跟可迭代的数据，就需要在后面加一个 * 了（ yield* ）。yield* 实际上只是将可迭代的值，序列化为已连串可以单独产出的值。
```js
function * generatorFunc() {
  yield 'a'
  yield* ['b', 'c', 'd']
  yield* ['e', 'f']
  yield 'g'
}
[...generatorFunc()] // ["a", "b", "c", "d", "e", "f", "g"]
```

yield* 可以用于实现递归，可以很优雅的用来遍历图数据结构，代码参见：p200

生成器作为默认迭代器

```js
class Obj {
  constructor() {
    this.values = [1, 2, 3]
  }
  *[Symbol.iterator]() {
    yield* this.values
  }
}
const obj = new Obj()
for (let item of obj) {
  console.log(item)
}
// 1
// 2
// 3
```

生成器 Generator 对象的 return() 和 throw() 方法

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};
var i = g();
i.next();  // 卡在yield
try {
  i.throw('a'); // 继续执行，并抛出一个错误，错误被内部捕获，可以继续向下执行
  i.throw('b'); // 执行完成后，Generator函数不能再捕获错误了，外部可以捕获。
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a  
// 外部捕获 b

function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
var g = gen();
g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```