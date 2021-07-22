# 作用域和闭包(Scope & Closures)
## 作用域是什么
作用域是一套规则，用于确定在何处以及如何查找变量(标识符)。
### 编译原理
JS 是一门动态、解释执行语言。任何 JS 代码在执行前都要进行编译，编译完成后立即执行。

传统编译语言，编译过程
1. 分词/词法分析 (Tokenizing/Lexing) ：将字符串分解有意义的代码块（也叫词法单元 token），比如 "var a = 2;"，通常会被分解为 var、a、 =、2、;。
2. 解析/语法分析 (Parsing) ：将词法单元数组，转换成 AST（Abstract Syntax Tree），即由元素嵌套组成的代表了程序语法结构的树。
3. 代码生成：将 AST 转换为可以执行的代码，即一组机器指令。

分词 (tokenizing) 和词法分析 (lexing) 的区别在于，词法单元的识别是通过有状态的还是无状态的方式来进行的。如果是有状态的解析规则，则这个过程称为词法分析。

JS 引擎实际要复杂很多，例如，在语法分析和代码生成阶段有特定步骤对运行性能进行优化，包括对冗余元素进行优化等。

### 理解作用域
如果要理解 JS 工作原理，要学会像引擎一样思考
- 引擎：负责整个 JS 程序的编译和执行过程
- 编译器：引擎的好朋友之一，负责语法分析、代码生成等
- 作用域：引擎的另一位好朋友，负责收集并维护由所有声明的变量（标识符）组成的一系列查询，确定当前执行代码对这些变量的访问权限

var a = 2，变量的赋值会执行两个操作：
1. var a 编译器会判断 a 是否已经在当前作用域中声明过，如果没有则在当前作用域中声明该变量，否则忽略该声明，继续编译
2. 编译器将 var a = 2 编译成运行时的代码，引擎运行时，会在作用域中查找 a 变量，如果找到了就赋值

引擎执行代码时，会让作用域来协助查找变量 a，引擎查找分两种，可以简单的理解为赋值语句的左侧或右侧
1. LHS (Left-Hand-Side) 左侧
2. RHS (Right-Hand-Side) 右侧，准确理解为 retrieve his source value（取到它的源值）

核心：**如果查找目的是对变量进行赋值，会使用 LHS。如果目的是获取变量的值，会使用 RHS**。

例子
```js
console.log(a) // 查找 console 变量、查找 a 变量都是 RHS 查询

function foo(a) {
  console.log(a)
}
foo(2) 
// 执行时，先查找 foo 使用 RHS 查询
// 继续执行，将 2 赋值给形参 a，相当于 a = 2，会进行 LHS 查询
// 执行执行 console，做 3 次 RHS 查询 console, console.log, a
```
### 作用域嵌套与异常
当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。

LHS 和 RHS 都会先从当前执行作用域中开始，如果需要（当前找不到），就会向上级作用域继续查找，直到找到或者最后抵达全局作用域（顶层）就会停止。
```js
function foo(a) {
  console.log(a + b) // RHS 查找 b，函数作用域找不到，再到全局作用域找，找到为 2
}
var b = 2;
foo(2) // 4 
```

不成功的 RHS 会抛出 ReferenceError，比如 foo(a)，找不到 a 或 foo，都会报这个错
```js
foo(a) // Uncaught ReferenceError: foo is not defined
```

不成功的 LHS 会自动隐式的创建一个全局变量（非严格模式下），如果是严格模式，不会创建全局变量，会报 ReferenceError
```js
function foo(a) {
  b = a // 这里 LHS 找不到 b 会创建一个 window.b 
  console.log(a + b)
}
foo(2)
```
如果 RHS 查询到了一个变量，对该变量执行不合理的操作，比如非函数类型，执行函数调用会出现 TypeError
```js
let p = 1
p() // Uncaught TypeError: p is not a function
```
## 词法作用域
在编译的词法分析阶段，基本可以知道全部标识符（变量）是在哪以及如何声明的，从而预测在执行中如何对他进行查找。

词法作用域意味着 - 作用域是由书写代码时函数声明的位置来决定的。

下面的例子中，根据嵌套，有 3 层作用域：最外层全局作用域(foo) => foo 函数内作用域(a,b,bar) => bar 函数内作用域(c)
```js 
function foo(a) {
  var b = a + 2;

  function bar(c) {
    console.log(a, b, c)
  }

  bar(b * 3)
}
foo(2)
```
### 欺骗词法 eval 和 with
JS 有两种方法，可以 "欺骗" 词法作用域, 注意：欺骗词法作用域会导致性能下降

eval("var a = 2") 可以根据字符串参数动态执行 js，在运行时，假设里面有声明的变量，会修改默认的词法作用域

```js
function foo(str, a) {
  // "use strict" // 如果是严格模式，则 eval 不会影响词法作用域
  eval(str)
  console.log(a, b)
}
var b = 2;
foo('var b = 3', 1) // 1 3
```
按照正常的词法作用域，b 应该是 2，但 eval 中执行了 b 的声明语句，导致词法作用域被修改

with 的用处，减少重复引用
```js
var obj = {
  a: 1,
  b: 2
}
with(obj) {
  a = 2 // 加了 with 后，等价于 obj.a = 2
  b = 3 // 加了 with 后，等价于 obj.b = 3
}
```

with 对词法作用域的修改
```js
function foo (obj) {
  with(obj) {
    a = 2
  }
}
var o1 = {
  a: 3
}
var o2 = {
  b: 3
}
foo(o1)
console.log(o1.a) // 2
foo(o2)
console.log(o2.a) // undefined
console.log(a) // 2
```
foo(o1) 时，o1.a 被重写为 2.foo(o2) 时由于 o2.a 没有被定义，相当于 "a = 2" LHS，会在全局作用域上声明 a。

**以上两种机制的副作用是：引擎无法在编译时对作用域查找进行优化，因为在运行时，根据执行的内容，默认词法作用域可能会被修改。**

## 函数作用域与块级作用域

### 函数作用域
函数作用域中，外层函数无法访问内部嵌套函数作用域中的变量，可以用于隐藏内部实现

匿名函数的缺点：
1. 在栈追踪中不会显示有意义的函数名，不利于调试
2. 如果是在触发事件中，无法解绑该事件函数
3. 影响可读性

```js
setTimeout(() => {
  console.log('1s 后执行')
}, 1000)

// 建议改为
setTimeout(function timeoutHandler() {
  console.log('1s 后执行')
})
```

立即执行函数表达式（IIFE）: (function a() {})() 或者 (function a() {}())

```js
var a = 2;
(function foo() {
  var a = 3;
  console.log(a) // 3
})();
console.log(a); // 2
```
或者
```js
var a = 2;
(function foo() {
  var a = 3;
  console.log(a) // 3
}());
console.log(a); // 2
```

`(function` 开头的声明，和 `function` 开头的声明有很重要的区别，`(function` 会被当做函数表达式而不是一个标准的函数声明来处理。


UMD 项目中广泛使用 IIFE
```js
(function IIFE(def) {
  def(window)
})(function def(global) {
  var a = 3;
  console.log(a) // 3
  console.log(global.a) // 2
})
```

### 块级作用域
函数不是唯一的作用域单元，代码块也是，一般由 `{}` 包裹

ES3 中 try {} catch(e) {}， catch 分句中，具有块作用域。

ES6 新增的 let/const，在声明变量时，会隐式的将对应的变量劫持在所在的块作用域内。且在块作用域中，不会进行提升

```js
{
  console.log(bar) // Uncaught ReferenceError: Cannot access 'bar' before initialization
  let bar = 6;
}
console.log(bar)
```
ES6 之前 JS 没有块级作用域，if (){} 中的代码会泄露到全局。ES6 需要借助 let, const 来达到块级作用域效果
```js
var foo = true
if (foo) {
  var a = 2
  const b = 3
  a = 3
  // b = 4 // Uncaught TypeError: Assignment to constant variable.
}
console.log(a) // 3
console.log(b) // Uncaught ReferenceError: b is not defined
```

## 提升(hoisting)
JS 是弱语言类型，容错性很高，变量在没定义前，就可以使用，这里涉及变量提升的概念
```js
// 片段 1
a = 2;
var a;
console.log(a) // 为什么是 2，而不是 undefined

// 片段 2
console.log(a) // 为什么是 undefined，而不是 2
var a = 2 
```

我们习惯将 `var a = 2` 看做一条声明，**但 JS 引擎不这么认为，它将 var a 和 a = 2 当做两个单独的声明。第一个声明是编译阶段的任务，第二个声明是执行阶段的任务。**

这意味着，无论作用域中的声明出现在什么地方，JS 引擎会在编译阶段将所有的声明(变量、函数)移动到各自作用域的顶端，这个过程叫做提升(hoisting)。

```js
// 片段 1 实际执行代码
var a
a = 2
console.log(a) // 2

// 片段 2 实际执行代码
var a
console.log(a) // undefined
a = 2
```

函数声明
```js
foo()
function foo() {
  console.log(a)
  var a = 2
}

// 编译、执行时
function foo() {
  var a
  console.log(a)
  a = 2
}
foo()
```
需要注意两点
1. 声明本身会被提升，但函数表达式的赋值操作不会提升
3. 注意避免重复声明，比如不同的 var 声明 和 函数声明混合时，会引起危险问题

```js
foo(); // Uncaught TypeError: foo is not a function
bar(); // ReferenceError
var foo = function bar() {
  console.log('1')
}

// 等价于
var foo
foo() // 对 undefined 执行 RHS 时类型错误，报 TypeError 
bar() // 找不到该变量
foo = function() {
  var bar = ...self...
  console.log('1')
}
```

### 函数优先
函数声明和变量声明都会被提升，如果函数和变量名重复，函数会被优先提升
```js
foo() // 1
var foo;
function foo() {
  console.log('1')
}
foo = function() {
  console.log('2')
}
```
如果有多个重复的函数声明，后面的会覆盖前面的
```js
foo() // 3
function foo() {
  console.log('1')
}
foo = function() {
  console.log('2')
}
function foo() {
  console.log('3')
}
```
函数声明的提升，不会根据 if else 逻辑来走，编译时可能就会提升，这里的行为并不可靠，JS 未来版本可能会发生改变，因此需要避免在
块内部声明函数
```js
foo() 
// Safari 是 'b'
// Chrome/Firefox 是 Uncaught TypeError: foo is not a function
var a = true
if (a) {
  function foo() { console.log('a') }
} else {
  function foo() { console.log('b') }
}
```

## 作用域闭包（closures）
closures [ˈkləʊʒə(r)]，个人认为这一章讲的相对复杂，[JS 高级程序设计 函数 - 闭包 笔记](http://fe.zuo11.com/js/ad3/js-ad3-10.html#%E9%97%AD%E5%8C%85) 里面讲的要好理解一点。


## 词法作用域与动态作用域
和大部分语言一样，JS 是词法作用域，另外还有一中动态作用域。

- 词法作用域，**函数/标识符声明位置决定其作用域**，编译初期，词法分析时静态确定
- 动态作用域，**只关心他从何处调用，作用域基于调用栈**，和 JS 中的 this 机制有点像

```js
function foo() {
  console.log(a)
}

function bar() {
  var a = 3
  foo()
}

var a = 2
bar() // 2
```
如果是词法作用域，foo() 执行时， a 通过 RHS 找到了全局作用域的 a，输出 2

如果是动态作用域，作用域基于调用栈，bar() 会打印 3

总结，主要区别：
1. 词法作用域是在写代码或声明的时候确定的，动态作用域是在运行确定的。
2. 词法作用域关注函数在何处声明，动态作用域关注函数在何处调用

## this 词法
this 绑定丢失的问题

```js
var obj = {
  id: 'awesome',
  cool: function coolFn() {
    console.log(this.id)
  }
}
var id = 'not awesome'
obj.cool() // this.id 为 "awesome"
setTimeout(obj.cool, 100) // this.id 为 "not awesome"
```

该函数是谁在调用，this 就指向谁 obj.cool() 调用 this 就是 obj。obj.cool 赋值到 setTimeout，执行时 this 就是 window

一般可以使用 self 来解决 this 丢失的问题

ES6 新增的箭头函数，会继承父级作用域的 this，也就是 this 固定指向父级作用域

