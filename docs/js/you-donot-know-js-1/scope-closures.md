# 你不知道的 JavaScript 上卷

## 作用域和闭包(Scope & Closures)
### 作用域是什么
作用域是一套规则，用于确定在何处以及如何查找变量(标识符)。
#### 编译原理
JS 是一门动态、解释执行语言。任何 JS 代码在执行前都要进行编译，编译完成后立即执行。

传统编译语言，编译过程
1. 分词/词法分析 (Tokenizing/Lexing) ：将字符串分解有意义的代码块（也叫词法单元 token），比如 "var a = 2;"，通常会被分解为 var、a、 =、2、;。
2. 解析/语法分析 (Parsing) ：将词法单元数组，转换成 AST（Abstract Syntax Tree），即由元素嵌套组成的代表了程序语法结构的树。
3. 代码生成：将 AST 转换为可以执行的代码，即一组机器指令。

分词 (tokenizing) 和词法分析 (lexing) 的区别在于，词法单元的识别是通过有状态的还是无状态的方式来进行的。如果是有状态的解析规则，则这个过程称为词法分析。

JS 引擎实际要复杂很多，例如，在语法分析和代码生成阶段有特定步骤对运行性能进行优化，包括对冗余元素进行优化等。

#### 理解作用域
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
#### 作用域嵌套与异常
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

## this 和对象原型(this & object prototypes)