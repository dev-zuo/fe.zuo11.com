# 学习 JavaScript 数据结构与算法(第三版) 笔记

原书名为 Learning JavaScript Data Structures and Algorithms, Thrid Edition。作者 Loiane Groner（罗伊安妮·格罗纳），翻译：吴双、邓钢、孙晓博等。

这是一本用 JavaScript/TypeScript 介绍数据结构与算法的书，比较适合前端开发人员。书中的示例代码比较全，JS/TS 都有，而且还有测试用例。示例代码地址：[PacktPublishing/Learning-JavaScript-Data-Structures-and-Algorithms-Third-Edition | Github](https://github.com/PacktPublishing/Learning-JavaScript-Data-Structures-and-Algorithms-Third-Edition)

## 第 1~3 章 JS/TS简介、数组基础

前三章比较基础，对于有 JS/TS 基础的同学，粗略的看看即可。相关内容之前有做笔记
- JavaScript/EcmaScript 基础参考：[JavaScript 高级程序设计(第四版) 笔记](http://fe.zuo11.com/js/ad3/js-ad3-1.html)
- TypeScript基础参考：[TypeScript入门教程笔记](http://fe.zuo11.com/ts/base-1.html)
- JS 数组参考：[Array 类型 - 集合引用类型 - JS高程4笔记](http://fe.zuo11.com/js/ad3/js-ad3-6.html#array-%E7%B1%BB%E5%9E%8B)

在数组开头插入元素 unshift() 简单实现
```js
Array.prototype.insertFirstPosition = function (value) {
  for (let i = this.length; i >= 0; i--) {
    this[i] = this[i - 1]
  }
  this[0] = value
  return this.length
}
```
在数组开头删除元素 shift() 简单实现 
```js
Array.prototype.deleteFirstPosition = function () {
  let lastIndex = this.length - 1
  let firstValue = this[0]
  for (let i = 0; i < lastIndex; i++) {
    this[i] = this[i + 1]
  }
  this.length = lastIndex
  return firstValue
}
```

## 第 4 章 栈（Stack）
> Stack `[stæk]` 

LIFO(last in first out) 后进先出，类似于一摞书或者餐厅里叠放的盘子。
- 实现一个基于数组的栈
- 实现一个基于对象的栈
- 用栈解决问题

### 实现一个基于数组的栈
创建一个 Stack 类，用于实现栈，通过数组来实现栈。需要实现的方法、属性如下
- `push()` 添加一个或多个元素到栈顶
- `pop()` 移除栈顶的元素，同时返回被删除的元素
- `peek()` 返回栈顶的元素，不对栈做任何修改
- `isEmpty()` 返回布尔值，栈里是否没有任何元素
- `clear()` 移除栈里的所有元素
- `size()` 返回栈里元素个数，和 length 类似
- `length` 返回栈里元素个数
```js
class Stack {
  constructor() {
    this.items = []
  }
  push(...args) {
    this.items.push(...args)
    return this.items.length
  }
  pop() {
    return this.items.pop()
  }
  peek() {
    return this.items[this.length - 1]
  }
  isEmpty() {
    return this.items.length === 0 
  }
  clear() {
    this.items = []
  }
  size() {
    return this.items.length
  }
  get length() {
    return this.items.length
  }
  toString() {
    return this.items.join(',')
  }
}
```
测试 demo
```js
let stack = new Stack()
stack.push(1) // 1 [1]
stack.push('a', 'b', 'c') // 4 [1, 'a', 'b', 'c']
stack.length // 4
stack.size() // 4
stack.pop() // "c"
stack.toString() // "1,a,b"
stack.peek() // "b"
stack.toString() // "1,a,b"
stack.isEmpty() // false
stack.clear()
stack.isEmpty() // true
```
### 实现一个基于对象的 Stack
实现栈的最简单方式是用数组来存储其元素。但它有以下缺点
- 使用数组时，大部分方法时间复杂度是 O(n)，需要迭代整个数组直到找到对应的元素
- 数组是一个有序集合，为了保证元素排列有序，会占用更多空间

使用对象来存储栈元素，也可以保证 LIFO 原则，下面来看看基于对象的栈实现
```js
class Stack {
  constructor() {
    this.count = 0
    this.items = {}
  }
  // 向栈中插入元素
  push(element) {
    this.items[this.count] = element
    this.count++
  }
  isEmpty() {
    return this.count === 0
  }
  size() {
    return this.count
  }
  // 从栈中弹出元素
  pop() {
    if (this.isEmpty) {
      return undefined
    }
    this.count--
    const result = this.items[this.count]
    delete this.items[this.count]
    return result
  }
  peek() {
    if (this.isEmpty) {
      return undefined
    }
    return this.items[this.count - 1]
  }
  clear() {
    this.items = {}
    this.count = 0
    // 或者 
    // while(!this.isEmpty()) {
    //   this.pop()
    // }
  }
  toString() {
     if (this.isEmpty) {
      return ''
    }

  }
}
```
以上方法中，除了 toString() 方法，其他方法复杂度均为 O(1)
### 用栈解决问题