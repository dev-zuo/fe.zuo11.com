---
title: 10. 函数 - JS高程4
description: 第四版将原来第三版的引用类型中的 Function 类型放到了这一章，并加入了箭头函数等 ES6 新特性的介绍。这里以 《ES6入门》函数的扩展为基础，对本章的重点做一些总结。创建一个函数，一般有 3 种方法：1. 使用 Function 构造函数（不推荐使用）2. 函数声明 function funcName() {} 3. 函数表达式 let func = function() {} 
keywords: 函数,函数参数,函数this指向,闭包
---
# 10. 函数
第四版将原来第三版的引用类型中的 Function 类型放到了这一章，并加入了箭头函数等 ES6 新特性的介绍。这里以 《ES6入门》函数的扩展为基础，对本章的重点做一些总结。

- [函数的扩展 - ES6入门笔记](http://fe.zuo11.com/js/es6/es6-6.html)

## 函数/箭头函数/函数名
创建一个函数，一般有 3 种方法：
1. 使用 Function 构造函数（不推荐使用）
2. 函数声明 function funcName() {}
3. 函数表达式 let func = function() {} 
```js
// 方式 1 利用构造函数来创建一个 function，不推荐使用，代码会被解释两次，会影响性能
var sum = new Function("num1", "num2", "return num1+num2");
sum(1,2); // 3

// 方式 2 最常用的函数声明方式
// function 函数声明可以先使用再声明
sum(1, 2) // 3
function sum(num1, num2) {
	return num1 + num2
}

// 方式 3 函数表达式，声明一个匿名函数，并赋值给sum
// 函数表达式定义的，不管是 var 还是 let 定义的，不可以先使用再声明
let sum = function(num1, num2) {
	return num1 + num2
}

// 函数表达式使用前必须先赋值，不然会错误
func() // 错误：函数还不存在 func is not function
var func = function (arg0, grg1) {};

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
**箭头函数**，使用箭头函数重写上面的函数
```js
// 箭头函数写法
let sum = (num1, num2) => {
	return num1 + num2
}
// 箭头函数简写
let sum = (num1, num2) => num1 + num2
sum(1, 2) // 3

// 如果函数参数只有一个，参数的括号也可以省略
let func = num => num * num
func(3) // 9
```
**函数名**，函数名是一个指针，因此一个函数可以有多个名称
```js
function sum(num1, num2) {
	return num1 + num2
}
sum(1, 2) // 3

let sum2 = sum
sum2(1, 2) // 3

sum = null
sum(1, 2) // TypeError: sum is not a function
sum2(1, 2) // 3

function funcA() {}
let funcB = function() {}
let funcC = () => {}
funcA.name // funcA
funcB.name // funcB
funcC.name // funcC
(() => {}).name // ""
(new Function()).name // "anonymous"
(function(){}).name // ""
```
## 函数参数/重载/默认值/扩展收集
- 函数声明或定义时，即使不写(命名)参数，也可以在内部使用 arguments 获取函数参数。arguments 是一个数组，包含函数参数列表。**注意：箭头函数里面不能使用 arguments**
```js
function sum(num1, num2) {
	return num1 + num2
}
sum(1, 2) // 3

// 等价于
function sum() {
	return arguments[0] + arguments[1]
}
sum(1, 2) // 3

// 箭头函数里面不能使用 arguments
let sum = () => {
	console.log('arguments', arguments)
	return arguments[0] + arguments[1]
}
sum(1, 2) // ReferenceError: arguments is not defined
```
- 默认参数，ES6 开始，函数支持默认参数，如果没有传入该参数就使用默认参数，**注意：参数变量做默认值时，需要先在前面声明，否则会像 let 声明顺序一样出现暂时性死区**
```js
function sum(num) {
	return 10
}
function sum(num1 = 1, num2 = 2) {
	return num1 + num2
}
sum(3, 4) // 7
sum(3) // 5
sum()  // 3

// 默认参数与暂时性死区
function add(a = 1, b = a) {
	return a + b
}
add() // 2

function add(a = b, b = 1) {
	return a + b
}
add() // ReferenceError: Cannot access 'b' before initialization
```
通过上面的例子，可以知道 ES 中的函数是没有重载的，后面定义的重名函数，会覆盖前面的函数。在 TypeScript 中，函数名相同，函数参数个数不同会被当做不同的函数，这种就是函数的重载。参考：[函数重载 - TypeScript入门教程笔记](http://fe.zuo11.com/ts/base-5.html#%E9%87%8D%E8%BD%BD)

- 扩展/收集参数，使用 `...` 语法
```js

function add() {
	let sum = 0
	Array.from(arguments).forEach(item => sum += item)
	return sum
}
// 扩展参数
add(...[1, 2, 3, 4, 5]) // 5

// 收集参数，
function add(...nums) {
	console.log(nums)
}
add(1, 2, 3, 4, 5) // [1, 2, 3, 4, 5]

// 收集参数只能放到最后
function add(a, ...nums) {
	console.log(a, nums)
}
add(1, 2, 3, 4, 5) // 1 [2, 3, 4, 5]
```
- ES 中函数也可以作为参数，函数的返回值也可是函数，这是在其他语言中少见的。
## 函数内部arguments/this/new.target
arguments 前面提到过，arguments.callee 指向函数本身，可以在递归函数中将函数与名词解耦。这里主要介绍函数中的 this。
- 普通函数中，谁调用函数，this 就指向谁。
- 箭头函数中，this 是固定的，它指向当前定义箭头函数的上下文。
```js
window.color = "red";
var o = { color: "blue"};

function showColor() {
	cosole.log(this.color);
}

showColor(); // red，这里是全局对象window调用的函数，this指向window
o.showColor = showColor;
o.showColor(); // blue, this是 o对象 
```
使用箭头函数改写上面的例子，箭头函数是在 window 上下文中定义的，所有 this 一直指向 window。
```js
window.color = "red";
var o = { color: "blue"};
let showColor = () => console.log(this.color);
showColor(); // red，这里是全局对象window调用的函数，this指向window

o.showColor = showColor;
o.showColor(); // red

// 箭头函数 this 的实用场景
function sayName() {
	this.name = 'zuo'
	// 如果非箭头函数，就获取不到 name
	setTimeout(() => {
		console.log(this.name) // 'zuo'
	}, 1000)
}
```
- new.target 是 ES6 新增的属性。用于检测函数是否是通过 new 调用，如果 new.target 是 Person 构造函数，那么就是 new 调用。如果不是 new 调用，new.target 为 undefined。
```js
function Person() {
	console.log(new.target)
	console.log(this instanceof Person)
	this.name = 'zuo'
}
new Person() 
// function Person() {}
// true
Person()
// undefined
// false
```
## 函数的属性和方法length/call/apply/bind
每个函数都包含两个属性 length 和 prototype, length 等于函数参数的个数，每个函数都包含两个非继承而来的方法 apply() 和 call(), 都可以指定函数执行的this，扩充函数作用域。注意箭头函数的 this 都无法通过call、apply，bind 改变
- `length` 参数个数
- `prototype` 指向函数原型对象
- `apply(thisObj, [arg1, arg2, ...])` 调用函数，使用 thisObj 作为函数的作用域 this，参数为数组
- `call(thisObj, arg1, arg2, ...)` 调用函数，使用 thisObj 作为函数的作用域 this，参数以逗号分隔
- `bind(thisObj)` 返回一个作用域 this 指向 thisObj 的新函数
```js
// apply(对应的作用域this,参数数组)
function sum (n1, n2) {
    return n1 + n2;  
}
function callSum1(n1, n2) {
    return sum.apply(this, arguments);
}
function callSum2(n1, n2) {
    return sum.apply(this, [n1,n2])
}
alert(callSum1(10,10)); // 20
alert(callSum2(10,10)); // 20

// 严格模式下 this指针指向undefined，除非使用 call()和apply()
// call() 和 apply() 类似，就是把第二个参数的数组用,一个个传入 
// apply(this,[a,b]) 等价于 call(this,a,b) 

// call 扩充函数的作用域
window.color = "red";
var o = {color: "blue"};

function sayColor() {
    alert(this.color);
}

sayColor(); // red
sayColor.call(this); // red
sayColor.call(window); // red
sayColor.call(o);  // blue
```
ECMAScript 5还定义了一个bind方法,会创建一个函数实例，可以指定作用域，IE9+支持
```js
window.color = "red";
var o = {color: "blue"};

function sayColor() {
    alert(this.color);
}

var objSayColor = sayColor.bind(o);
objSayColor(); // blue
```
## 递归
函数自己调用自己
```js
// 计算阶乘
function factorial(num) {
	if (num <= 1) {
		return 1;
	} else {
		return num * factorial(num -1); 
		// 等价于 return num * arguments.callee(num -1);
	}
}
alert(factorial(5)); // 120
```
递归的一个缺点
```js
function factorial(num) {
    if (num <= 1) {
        return 1;
    }
    return num * factorial(num - 1);
}
var fun2 = factorial;
factorial = null;
fun2(4); // 这里会出错

// 如果用 arguments.callee 来代替函数名即可，但严格模式不支持
function factorial(num) {
    if (num <= 1) {
        return 1;
    }
    return num * arguments.callee(num - 1);
}

// 解决方法: 使用命名函数表达式
var factorial_c = (function f(num) {
    if (num <= 1) {
        return 1;
    }
    return num * f(num - 1);
})
```

## ES6新增尾调用优化
个人感觉《ES6入门》里讲的尾调用优化，比本书中好理解一点。参考：[函数的扩展 - 尾调用优化 - ES6入门笔记](http://fe.zuo11.com/js/es6/es6-6.html#%E5%B0%BE%E8%B0%83%E7%94%A8%E4%BC%98%E5%8C%96)
## 闭包
**闭包是指引用了另一个函数作用域中变量的函数。** 创建闭包的常用方式是，在一个函数内部创建另一个函数，然后内部函数访问外部函数的变量
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
- 1.创建一个执行上下文(execution context)，以及相应的作用域链。(作用域链的终点是全局变量对象)
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


### var + 作用域链机制产生的副作用

::: tip
第四版将这个问题放到 p28 语言基础 - for 循环中的 let 声明中了。使用闭包解决这个问题已经过时了，用 let 即可。
:::

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
使用 let 块级作用域也可以，每一次循环都是一个单独的作用域变量
```js
for (let i = 0; i < 10; i++) {
}
```
![7_5_闭包副作用解决方法.png](/images/js/7_5_闭包副作用解决方法.png)

### 闭包中this问题
闭包中的 this 会让代码变的复杂。先来回顾下 this 的指向问题
1. 普通函数中，谁调用函数，this 就指向谁。
2. 箭头函数中，this 是固定的，它指向当前定义箭头函数的上下文。

**如果是普通函数，闭包的情况下，this会在运行的时后绑定执行上下文**
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
// object.getNameFunc() 会创建一个函数，创建函数是在 window 环境创建的
alert(object.getNameFunc()()) // The window  ，非严格模式下

// 这种情况可以使用that过渡，或者内部函数使用箭头函数
var object = {
    name: "My Object",
    getNameFunc: function() {
        var that = this;
        return function() {
            return that.name
        }
        // 或者 
        // return () => this.name
    }
}
```
语法的细微变化也有可能改变 this 的指向
```js
var name = "The window"
var object = {
    name: "My Object",
    getName: function() {
        return this.name
    }
}
object.getName() // "My Object"
// 因为按照规范 object.getName 与 (object.getName) 是相等的
(object.getName)() //  "My Object"
(object.getName = object.getName)() // "The window" // 非严格模式下
// 如果不明白上面的一行，来看下面的情况，拆开来看是正常的。
// 注意赋值表达式的值是函数本身，this值不再指向任何绑定对象
// 在 window 执行上下文执行，所以返回 window
object.getName = object.getName
object.getName() // "My Object"
```
### 闭包导致的内存泄漏
IE9之前的版本使用了引用计数的垃圾回收机制，如果闭包里引用了HTML元素，会导致元素将无法销毁。尽量避免在闭包内引用html元素

## 立即调用函数表达式(IIFE)与模仿块级作用域
立即调用的匿名函数又被称为 **立即调用函数表达式** (IIFE, Immediately Invoked Function Expression），用一个匿名函数包裹要执行的内容，执行完成后，里面的变量会被销毁。这样可以用于模拟块级作用域。在一些框架的源码中时常会看到这种写法，ES6 之后 IIFE 就没有那么必要了。因为 let、const 自带块级作用域了。
```js
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

## 私有变量
严格来讲 ES 没有私有成员的概念，一般所有对象属性都是公有的。私有成员可以通过使用闭包的方式来实现。下面的例子中，name 就算是一个私有变量。不能通过 Person 的实例直接访问，只能通过暴露的 getName，setName 公共方法访问。
```js
function Person() {
	let name = "zuo"
	this.getName = function () {
		return name
	}
	this.setName = function(value) {
		name = value
	}
}
```
ES 最新的提案在 Class 类中，已经有私有变量/方法了，使用 # 开头，只能内部自己调用，外部无法访问
```js
class A { 
	// 私有变量
	#count = 1;
	// 私有方法
	#sayCount() {
		console.log('say count')
	} 
	get publicCount() { 
		return this.#count 
	}
	publicSayCount() {
		this.#sayCount()
	}
}
let a = new A()
a.count // SyntaxError: Private field '#count' must be declared in an enclosing class
a.publicCount // 1
a.#sayCount() // SyntaxError
a.publicSayCount() // say count
```

