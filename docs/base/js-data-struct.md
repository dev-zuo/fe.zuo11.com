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

## 第 4 章 栈
LIFO(last in first out) 后进先出，类似于一摞书或者餐厅里叠放的盘子。
- 实现一个基于数组的栈
- 实现一个基于对象的 Stack
- 用栈解决问题

### 实现一个基于数组的栈
创建一个 Stack 类，用于实现栈，通过数组来实现栈。需要实现的方法、属性如下
- push() 添加一个或多个元素到栈顶
- pop() 移除栈顶的元素，同时返回被删除的元素
- peek() 返回栈顶的元素，不对栈做任何修改
- isEmpty() 返回布尔值，栈里是否没有任何元素
- clear() 移除栈里的所有元素
- size() 返回栈里元素个数，和 length 类似
- length 返回栈里元素个数
```js
class Stack {
  constructor() {
    this.items = []
  }
  push(...args) {
    this.items.push(...args)
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
}
```
测试 demo
```js
let stack = new Stack()

```
### 实现一个基于对象的 Stack

### 用栈解决问题