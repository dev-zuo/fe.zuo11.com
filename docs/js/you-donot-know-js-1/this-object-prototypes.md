# this 和对象原型(this & object prototypes)
## 关于 this
### 为什么要使用 this
this 可以减少对象的显示传递，**以更优雅的方式隐式的传递一个对象的引用，可以将 API 设计的更加简洁且更容易复用。**
```js
function foo() {
  console.log('my name is', this.name)
}
foo.call({ name: "zuo" }) // my name is zuo
foo.call({ name: "xiaobai" }) // my name is xiaobai
```
如果没有 this
```js
function foo(context) {
  console.log('my name is', context.name)
}
```
当涉及对象、原型时，函数可以自动引用合适的上下文象是非常重要的。
### 对 this 的误解
1. 函数中的 this 指向函数本身(错误)

```js
function foo() {
  this.count++
}
foo.count = 0
for (let i = 0; i < 10; i++) {
  foo()
}
console.log(foo.count) // 0
```
foo 函数在 window 下面调用 this 指向 window。如果想让 foo.count 为 10，有两种解决方法：1). foo 函数中使用 foo.count++，2). 在 for 循环中 使用 foo.call(foo) 

2. this 指向函数的作用域（错误），它不指向函数的词法作用域

```js
function foo() {
  var a = 1;
  this.bar()
}
function bar() {
  console.log(this.a, this)
}
foo() // this.a 为 undefined，this 为 window，指向 window
```

总结：**this 在函数调用时发生绑定，指向谁取决于函数的调用位置（在哪里被调用）**

## this 全面解析

### 调用位置
