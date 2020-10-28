
# 7. 函数表达式与闭包



定义函数的方式有两种，一种是函数声明，另一种就是函数表达式
```js
/**
 * 1.函数声明
 * 函数声明具有函数声明提升的特性，在执行代码前，会先读取函数声明，可以把函数声明放到调用它语句的后面
 */
func();  
function func(arg0, arg1) {
    
}

// 2.函数表达式，创建一个匿名函数，赋值给func
// 函数表达式使用前必须先赋值，不然会错误
func() // 错误：函数还不存在 func is not function
var func = function (arg0, grg1) {
    
};

// ECMAScript 无效语法 错误的语法
if (condition) {
    function sayHi() {
        alert('Hi');
    }
} else {
    function sayHi() {
        alert('hehe');
    }
}

// 应该改为
var sayHi;

if (condition) {
    sayHi = function () {
        alert('Hi');
    }
} else {
    sayHi = function () {
        alert('hehe');
    }
}
```
## 递归
函数自己调用自己
```js
function factorial_a(num) {
    if (num <= 1) {
        return 1;
    }
    return num * factorial_a(num - 1);
}
var fun2 = factorial_a;
factorial_a = null;
fun2(4); // 这里会出错

// 如果用 arguments.callee 来代替函数名即可，但严格模式不支持
function factorial_b(num) {
    if (num <= 1) {
        return 1;
    }
    return num * arguments.callee(num - 1);
}

// 解决方法   使用命名函数表达式
var factorial_c = (function f(num) {
    if (num <= 1) {
        return 1;
    }
    return num * f(num - 1);
})
```
## 闭包
**闭包是指有权访问另一个函数作用域中变量的函数。** 创建闭包的常用方式是，在一个函数内部创建另一个函数，然后内部函数访问外部函数的变量
- 闭包是一种函数
- 闭包可以访问另一个函数(外部函数)作用域中的变量。(是由于**外部函数执行完了，其活动对象不会删除，还是会停留在闭包的作用域链里**)。
```js
function compareFunc(propertyName) {
    return function(obj1, obj2) {
        return obj1[propertyName] - obj2[propertyName] // 一个函数内部可以访问另一个函数作用域中的变量propertyName
    }
}
var temp = compareFunc('age');

var p1 = {name: "A", age: 18};
var p2 = {name: "B", age: 26};

console.log(temp(p1, p2)); // -8
```
![闭包.png](/images/js/闭包.png)

### 普通函数执行时的作用域链
```js
function compare(value1, value2) {
    return value1 - value2;
}
var result = compare(5, 10)
```
compare函数执行：
- 1.创建一个执行环境(execution context)，以及相应的作用域链。(作用域链的终点是全局变量对象)
- 2.初始化一个变量对象(也叫活动对象)：里面包含argument对象、函数参数变量等。并放到该函数的作用域链的第一位
- 3.**函数执行完成后局部活动对象会删除，只保留全局执行环境的变量对象。**
![7_1_普通函数执行作用域链.png](/images/js/7_1_普通函数执行作用域链.png)
- compare execution context (compare 执行环境)
- Scope Chain (作用域链)
- Global variable object (全局变量对象)
- compare() activation object (compare活动对象)

### 闭包的作用域链
```js
function createComparisonFunction(propertyName) {
    return function(object1, object2) {
        var value1 = object1[propertyName]
        var value2 = object2[propertyName]
        return value1 > value2 ? 1 : (value1 < value2 ? -1 : 0)
    }
}
// 创建函数
var compare = createComparisonFunction("name");
// 执行函数
var result = compare({name: "Nicholas"}, {name: "Greg"});
// 解除对匿名函数的引用（以便释放内存）
compare = null;
```
闭包的外部函数执行完成后，不会销毁其活动对象。所以闭包仍然可以访问外部函数的变量。
- anonymous execution context 匿名函数的执行环境
- Closure activation object 闭包活动对象
![7_2_闭包函数执行的作用域链.png](/images/js/7_2_闭包函数执行的作用域链.png)


### 闭包会产生的副作用
由于循环中赋值给result[i]的函数是闭包，所以变量i，访问的是createFunc函数执行环境里的活动对象里的i，所有函数访问的都是同一个变量i，导致执行后，全部是10
```js
function createFunc() {
    var result = new Array();

    for (var i = 0; i < 10; i++) {
        result[i] = function() {
            return i;
        }
    }
    return result;
}
var tempfunc = createFunc()  // [function() {return i;}, function() {return i;}, function() {return i;}, ...]
tempfunc[0]() // 10 
tempfunc[9]() // 10
```
![7_4_闭包作用域副作用.png](/images/js/7_4_闭包作用域副作用.png)

- 解决方法：闭包外面再用一个函数包裹，再形成一个闭包，每个闭包都会有一个单独的变量，**由于闭包会携带包含它函数的作用域，因此会比其他函数占用更多的内存，需要谨慎的使用闭包。**
```js
function createFunc() {
    var result = new Array();

    for (var i = 0; i < 10; i++) {
        result[i] = function(num) {
            return function() {
                return num;
            }
        }(i);
    }
    return result;
}
var tempfunc = createFunc()
tempfunc[0]() // 0
tempfunc[9]() // 9
```
![7_5_闭包副作用解决方法.png](/images/js/7_5_闭包副作用解决方法.png)

### 闭包中this问题
一般this是基于函数的执行环境绑定的，全局环境this等于window，匿名函数的this具有全局性，也指向window
```js
var name = "The window";

var object = {
    name: "My Object",
    getNameFunc: function() {
        return function() {
            return this.name
        }
    }
}
alert(object.getNameFunc()()) // The window  ，非严格模式下

// 这种情况可以使用that过渡
var object = {
    name: "My Object",
    getNameFunc: function() {
        var that = this;
        return function() {
            return that.name
        }
    }
}
```
语法的细微变化也有可能改变this的指向
```js
var name = "The window"
var object = {
    name: "My Object",
    getName: function() {
        return this.name
    }
}
object.getName() // "My Object"
(object.getName)() //  "My Object"
(object.getName = object.getName)() // "The window" // 非严格模式下
```
### 闭包导致的内存泄漏
IE9之前的版本使用了引用计数的垃圾回收机制，如果闭包里引用了HTML元素，会导致元素将无法销毁。尽量避免在闭包内引用html元素。

## 模仿块级作用域
```js
// 1.用一个匿名函数包裹要执行的内容，执行完成后，里面的变量会被销毁。
var func = function() {
    // 块级作用域
}
func()

// 2.简写
(function() {
    // 块级作用域，
})()

// 实列
(function() {
    for (var i = 0; i < 10; i++) {
        console.log(i)
    }
})()
alert(i) // 错误 ReferenceError: i is not defined
```