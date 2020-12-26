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
class StackArray {
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
let stack = new StackArray()
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
以上是手动测试的 demo，我们可以使用 Mocha 来写测试用例。
```js
// test/1-stack-array.spec.js 
const StackArray = require('../src/1-stack-array')
const expect = require('chai').expect
let stack = null

describe('StackArray Test', () => {
  beforeEach(() => {
    stack = new StackArray()
  })

  it('empty test', () => {
    expect(stack.isEmpty()).to.equal(true)
    expect(stack.size()).to.equal(0)
  })

  it('push()/size()/toString() test', () => {
    stack.push('a')
    expect(stack.isEmpty()).to.equal(false)
    expect(stack.size()).to.equal(1)
    stack.push('b')
    expect(stack.size()).to.equal(2)
    stack.push('c')
    expect(stack.size()).to.equal(3)
    stack.push('d', 'e', 'f')
    expect(stack.length).to.equal(6)
    expect(stack.toString()).to.equal('a,b,c,d,e,f')
  })

  it('pop()/length test', () => {
    stack.push('a', 'b', 'c', 'd')
    expect(stack.pop()).to.equal('d')
    expect(stack.length).to.equal(3)
    expect(stack.pop()).to.equal('c')
    expect(stack.length).to.equal(2)
    expect(stack.pop()).to.equal('b')
    expect(stack.length).to.equal(1)
    expect(stack.pop()).to.equal('a')
    expect(stack.length).to.equal(0)
    expect(stack.pop()).to.equal(undefined)
    expect(stack.length).to.equal(0)
  })

  it('peek() test', () => {
    stack.push('a', 'b', 'c', 'd')
    expect(stack.peek()).to.equal('d')
    expect(stack.length).to.equal(4)
    stack.pop()
    stack.pop()
    expect(stack.peek()).to.equal('b')
  })

  it('clear()/isEmpty() test', () => {
    stack.push('a', 'b')
    expect(stack.length).to.equal(2)
    expect(stack.isEmpty()).to.equal(false)
    stack.clear()
    expect(stack.length).to.equal(0)
    expect(stack.isEmpty()).to.equal(true)
  })
})
```

运行 `mocha test/1-stack-array.spec.js` 测试结果如下图，完整 demo 参见：[1-stack-array.spec.js - Github](https://github.com/zuoxiaobai/fedemo/tree/master/src/data_struct/test)

![mocha_test_pass.png](/images/base/mocha_test_pass.png)

### 实现一个基于对象的栈
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
  get length() {
    return this.count
  }
  // 从栈中弹出元素
  pop() {
    if (this.isEmpty()) {
      return undefined
    }
    this.count--
    const result = this.items[this.count]
    delete this.items[this.count]
    return result
  }
  peek() {
    if (this.isEmpty()) {
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
    if (this.isEmpty()) {
      return ''
    } else {
      let i = 0,
        len = this.count,
        result = ''
      while (i < len) {
        result += this.items[i]
        if (i !== len - 1) {
          result += ','
        }
        i++
      }
      return result
    }
  }
}
```
以上方法中，除了 toString() 方法，其他方法复杂度均为 O(1)，以上代码单元测试地址：[2-stack-obj.spec.js - Github](https://github.com/zuoxiaobai/fedemo/tree/master/src/data_struct/test)

### 用栈解决问题
栈可以用于存储访问过的任务或路径、撤销操作。还可以处理进制转换、平衡括号、汉诺塔问题。

#### 十进制转二进制
要将十进制数转化成二进制，可以将 10 进制数除 2（二进制满 2 进 1）取余, 然后 Math.floor(除 2 的结果) 继续取余，直到 Math.floor(除 2) 的结果为 0。将所有余数组合起来就是对于的二进制
```js
10 
10 / 2 余 0，Math.floor(10 / 2) => 5
 5 / 2 余 1，Math.floor(5 / 2) => 2
 2 / 2 余 0，Math.floor(2 / 2) => 1
 1 / 2 余 1，Math.ceil(1 / 2) => 0
// 余数 1010 就是 10 的二进制
```
我们将取余的数 push 到栈中，最后逐个出栈即可将 10 进制转换为二进制
```js
// src/3-stack-to-binary.js
const Stack = require('./2-stack-obj')
function decimalToBinary(num) {
  let stack = new Stack()
  let result = ''
  while (num) {
    stack.push(num % 2)
    num = Math.floor(num / 2)
  }
  while (!stack.isEmpty()) {
    result += stack.pop()
  }
  return result || '0'
}

module.exports = decimalToBinary
```
单元测试
```js
// test/3-stack-to-binary.spec.js
const expect = require('chai').expect
const decimalToBinary = require('../src/3-stack-to-binary')

describe('DecimalToBinary Test', () => {
  it('10进制转2进制', () => {
    expect(decimalToBinary(0)).to.equal('0')
    expect(decimalToBinary(1)).to.equal('1')
    expect(decimalToBinary(2)).to.equal('10')
    expect(decimalToBinary(5)).to.equal('101')
    expect(decimalToBinary(10)).to.equal('1010')
    expect(decimalToBinary(15)).to.equal('1111')
    expect(decimalToBinary(233)).to.equal('11101001')
    expect(decimalToBinary(1000)).to.equal('1111101000')
  })
})
```
#### 十进制转其他进制
除了将 10 进制转换为 2 进制外，还可以将 10 进制转换为 2 - 36 的任意进制
```js
// src/4-stack-decimal-converter.js
const Stack = require('./2-stack-obj')
function decimalConverter(num, base) {
  let stack = new Stack()
  let result = ''
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (base < 2 || base > 36) {
    return ''
  }
  while (num) {
    stack.push(num % base)
    num = Math.floor(num / base)
  }
  while (!stack.isEmpty()) {
    result += digits[stack.pop()]
  }
  return result || '0'
}

module.exports = decimalConverter
```
单元测试
```js
// src/4-stack-decimal-converter.spec.js
const expect = require('chai').expect
const decimalConverter = require('../src/4-stack-decimal-converter')

describe('decimalConverter Test', () => {
  it('10进制转其他进制', () => {
    expect(decimalConverter(0, 2)).to.equal('0')
    expect(decimalConverter(1, 2)).to.equal('1')
    expect(decimalConverter(1, 37)).to.equal('')
    expect(decimalConverter(100345, 2)).to.equal('11000011111111001')
    expect(decimalConverter(100345, 8)).to.equal('303771')
    expect(decimalConverter(100345, 16)).to.equal('187F9')
    expect(decimalConverter(100345, 35)).to.equal('2BW0')
  })
})
```
#### 平衡圆括号
> Balanced parentheses means that each opening symbol has acorresponding closing symbol and the pairs of parentheses are properly nested.Consider the following correctly balanced strings of parentheses:

平衡括号的意思是，每个左括号一定对应着一个右括号，括号内又套着括号。看下面这些个括号组成的平衡表达式：
```
(()()()())
(((())))
(()((())()))
```
> Compare those with the following, which are not balanced:

对比下面这些不平衡的括号：
```
((((((())
()))
(()()(()
```
> The ability to differentiate between parentheses that are correctlybalanced and those that are unbalanced is an important part of recognizing manyprogramming language structures.

正确地区分平衡和不平衡括号，对很多编程语言来说，都是重要的内容。

> The challenge then is to write an algorithm that will read a stringof parentheses from left to right and decide whether the symbols are balanced.

现在的问题就是，写一个算法，读入一串括号字符串，并判断它们是否平衡。

可以使用栈来解决这个问题，遇到左括号 "(" 就将它 push 到栈中，遇到右括号 ")" 就将栈中的内容 pop() 一次。如果出现 ")" 时栈是空的，则缺少 "("。如果字符串到末尾后栈中还有内容，则缺少 ")"。

```js
// src/5-stack-balance-parentheses.js
const Stack = require('./2-stack-obj')
function isBalanceParentheses(str) {
  let stack = new Stack()
  if (typeof str !== 'string') {
    return false
  }
  const len = str.length
  let i = 0
  while (i < len) {
    if (str[i] === '(') {
      stack.push('(')
    }
    if (str[i] === ')') {
      if (stack.isEmpty()) {
        return false
      }
      stack.pop()
    }
    i++
  }
  return stack.isEmpty()
}

module.exports = isBalanceParentheses
```
单元测试
```js
// test/5-stack-balance-parentheses.spec.js
const expect = require('chai').expect
const isBalanceParentheses = require('../src/5-stack-balance-parentheses')

describe('BalanceParentheses Test', () => {
  it('平衡括号测试', () => {
    expect(isBalanceParentheses(0)).to.be.false
    expect(isBalanceParentheses(')')).to.be.false
    expect(isBalanceParentheses('(')).to.be.false
    expect(isBalanceParentheses('()')).to.be.true
    expect(isBalanceParentheses('(()()()())')).to.be.true
    expect(isBalanceParentheses('(((())))')).to.be.true
    expect(isBalanceParentheses('(()((())()))')).to.be.true
    expect(isBalanceParentheses('((((((())')).to.be.false
    expect(isBalanceParentheses('()))')).to.be.false
    expect(isBalanceParentheses('(()()(()')).to.be.false
  })
})
```

参考：[python数据结构与算法 5栈的应用之圆括号平衡_量变到质变-CSDN博客](https://blog.csdn.net/python2014/article/details/21239321)

#### 汉诺塔
有三根相邻的柱子，标号为 A, B, C。A 柱子上从下到上按金字塔状叠放着 n 个不同大小的圆盘，要把所有盘子移动到柱子 B 上，一次只能移动一个圆盘，且大圆盘不能在小圆盘上面，求移动步骤和次数

![hanoi.jpeg](/images/base/hanoi.jpeg)

有两种解法，一种是递归，一种是栈。先来看递归的实现
- 将 n - 1 个圆盘从 A 移动到 C（借助 B）
- 将第 n 个圆盘从 A 移动到 B
- 将 n - 1 个圆盘从 C 移动到 B（借助 A）

移动次数为 2 的 n 次方 - 1
```js
let count = 0
function move(number, from, to, depend) {
  console.log(`将第 ${number} 号圆盘从 ${from} 移动到 ${to}`)
  count++
}
// 将 n 个圆盘从 a 移动到 b 借助 c
function hanoi(n, a, b, c) {
  if (n === 0) {
    return
  }
  hanoi(n - 1, a, c, b) // 将 n -1 个圆盘从 a 移动到 c，借助 b
  move(n, a, b) // 将第 n 个圆盘从 a 移动到 b
  hanoi(n - 1, c, b, a) // 将 n -1 个圆盘从 c 移动到 b，借助 a
}
hanoi(3, 'A', 'B', 'C')
console.log('移动次数', count)
// 将第 1 号圆盘从 A 移动到 B
// 将第 2 号圆盘从 A 移动到 C
// 将第 1 号圆盘从 B 移动到 C
// 将第 3 号圆盘从 A 移动到 B
// 将第 1 号圆盘从 C 移动到 A
// 将第 2 号圆盘从 C 移动到 B
// 将第 1 号圆盘从 A 移动到 B
// 移动次数 7
```
重构上面的例子，使用一个函数搞定
```js
function hanoiRecursion(n, a, b, c, moves = []) {
  if (n === 0) {
    return moves
  }
  hanoiRecursion(n - 1, a, c, b, moves) // 将 n -1 个圆盘从 a 移动到 c，借助 b
  moves.push([a, b]) // move(n, a, b) // 将第 n 个圆盘从 a 移动到 b
  hanoiRecursion(n - 1, c, b, a, moves) // 将 n -1 个圆盘从 c 移动到 b，借助 a
  return moves
}
let moves = hanoiRecursion(3, 'A', 'B', 'C')
console.log('移动路径', moves)
console.log('移动次数', moves.length)
// // 移动路径
// // [
// //  ["A", "B"], ["A", "C"], ["B", "C"], ["A", "B"],
// //  ["C", "A"], ["C", "B"], ["A", "B"]
// // ]
// // 移动次数 7
```
参考：[汉诺塔的图解递归算法 - Dmego - 博客园](https://www.cnblogs.com/dmego/p/5965835.html)

使用栈其实也需要使用递归，只是我们通过 3 个栈，表示三个圆柱，可以实时看对应的效果
```js
const Stack = require('./2-stack-obj')
function hanoi(n, source, dest, depend, a, b, c, moves = []) {
  if (n === 0) {
    return
  }
  hanoi(n - 1, source, depend, dest, a, c, b, moves) // 将 n - 1 个圆盘从 source 移动到 depend
  moves.push([a, b])
  dest.push(source.pop()) // 将第 n 个圆盘从 source 移动到 dest
  hanoi(n - 1, depend, dest, source, c, b, a, moves) // 将 n - 1 个圆盘从 depend 移动到 dest
}
function hanoiStack(n) {
  let source = new Stack()
  let dest = new Stack()
  let depend = new Stack()
  let count = n
  while (count) {
    source.push(count--)
  }
  let moves = []
  console.log('source: ', source)
  hanoi(n, source, dest, depend, 'A', 'B', 'C', moves)
  console.log('source: ', source)
  console.log('dest: ', dest)
  console.log('depend: ', depend)
  return moves
}
console.log(hanoiStack(3))
// source:  Stack { count: 3, items: { '0': 3, '1': 2, '2': 1 } }
// source:  Stack { count: 0, items: {} }
// dest:  Stack { count: 3, items: { '0': 3, '1': 2, '2': 1 } }
// depend:  Stack { count: 0, items: {} }
// [
//   [ 'A', 'B' ],
//   [ 'A', 'C' ],
//   [ 'B', 'C' ],
//   [ 'A', 'B' ],
//   [ 'C', 'A' ],
//   [ 'C', 'B' ],
//   [ 'A', 'B' ]
// ]
```
单元测试
```js
// test/6-stack-hanoi.spec.js
const expect = require('chai').expect
let { hanoiStack, hanoiRecursion } = require('../src/6-stack-hanoi')

describe('Hanoi Test', () => {
  it('递归实现测试', () => {
    for (let i = 1; i <= 10; i++) {
      expect(hanoiRecursion(i, 'a', 'b', 'c').length).to.equal(2 ** i - 1)
    }
  })
  it('栈+递归实现测试', () => {
    for (let i = 1; i <= 10; i++) {
      expect(hanoiStack(i).length).to.equal(2 ** i - 1)
    }
  })
})
```