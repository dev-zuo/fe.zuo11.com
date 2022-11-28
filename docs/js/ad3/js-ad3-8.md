---
title: 8. 对象、类与面向对象编程 - JS高程4
description: ECMA-262把对象定义为"无序属性的集合，属性可以包含基本的值、对象或函数"，可以把 ES 的对象，想象成一张散列表，其中的内容就是一组键值对。值可以是数据或函数。本章介绍了创建对象的方法、JS继承、原型链，类 Class。
keywords: 对象,类,原型链,Class,JS继承
---
# 8. 对象、类与面向对象编程
ECMA-262把对象定义为"无序属性的集合，属性可以包含基本的值、对象或函数"，可以把 ES 的对象，想象成一张散列表，其中的内容就是一组键值对。值可以是数据或函数。
```js
// 创建一个Person对象
var person = new Object();
person.name = "zuo";
person.age = 29;
person.sayName = function () {
    alert(this.name);
};

// 早期开发人员经常使用上面的模式创建新对象
// 几年后对象字面量成为创建这种对象的首选模式，如下:
var person2 = {
    name: "zuo",
    age: 29,
    sayName: function () {
        alert(this.name);
    }
};
```
## 对象属性
对象的属性（也可以理解为key）分为两种，数据属性和访问器属性；Object.defineProperty() 可以定义对象的属性。
### 数据属性(key:value/配置/枚举/写)
一般的属性都是数据属性，都对应一个值（可以是对象或函数），每个数据属性有四个特征，除了属性的Value（值）之外，属性还有3个特征。
- Value 数据值，默认值为undefined
- configurable（属性是否可以用delete删除，是否可配置, 上面的例子中直接在对象上定义属性，默认为true
- enumerable 是否可枚举，能否用for-in来遍历该属性，上面的例子中直接在对象上定义属性，默认为true
- writable  能否修改属性的值, 上面的例子中直接在对象上定义属性，默认为true
```js
var person = {
    name: "zuo"
};
// 这里person的name属性，其特征Value = "zuo"，其他三个特征为true

// ES5里面Object.defineProperty(对象，新增的属性名，特征配置对象)
// IE11及以上才支持
// 特征配置对象4个特征可以是0个到4个，value默认为undefined，其他特征均为false
// 新增一个age属性
Object.defineProperty(person, "age", { 
    configurable: false,
    enumerable: false,
    writable: false,
    value: 27
});
delete person.age; // 执行后 person {name: "zuo", age: 27}
// 由于configurable:false, 删除属性是无效的, 严格模式下会报错
// 且无法再使用Object.defineProperty修改对应的值

for (var p in person) {
    console.log(p); 
}
// 由于enumerable:false 不可枚举，只会打印name属性
// JSON.stringify(person); 这里age是显示不出来的。不能枚举

person.age = 30; // writable：false 写值后值不会变，严格模式会报错

```

::: warning
使用 Object.defineProperty 创建新的属性时，如果不指定，configurable、enumerable 默认为 false
:::
### 访问器属性(隐式key:set/get/配置/枚举)
访问器属性不包含数据值，它包含一对getter和setter方法(但都不是必须的)，读取访问器属性时，会访问getter方法，在写入访问器属性时，会调用setter函数并传入新值。访问器属性有如下4个特征：
- configurable（属性是否可以用delete删除，是否可配置, 上面的例子中直接在对象上定义属性，默认为true
- enumerable 是否可枚举，能否用for-in来遍历该属性，上面的例子中直接在对象上定义属性，默认为true
- set 赋值时调用的函数，默认为undefined
- get 读取属性时调用的函数，默认为undefined

**访问器属性不能直接定义。必须使用Object.defineProperty()来定义, defineProperty创建新的属性时，如果不指定，configurable、enumerable 默认为false**
<!-- 与一般的数据属性不同，访问器属性枚举时不会显示，一般是只限内部使用，_year，提供一个供外部访问的接口 -->
```js
var book = {
    _year: 2004,
    edition: 1,
		// Object.defineProperty(book, "year", {get, set} 
		// 访问器属性是隐式的属性，不能直接写在下面，下面的key对应的对象。
    // year: {
		// 	get: function () {
		// 			return this._year;
		// 	},
		// 	set: function (newValue) {
		// 			if (newValue > 2004) {
		// 					this._year = newValue;
		// 					this.edition += newValue - 2004;
		// 			}
		// 	}
    // }
};
Object.defineProperty(book, "year", {
    get: function () {
        return this._year;
    },
    set: function (newValue) {
        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;
        }
    },
    // enumerable: true  // 如果加了这个，for in就可以找到该访问器属性
});
alert(book.year); // 2004
console.log(book); // {_year:2004, edition:1}
for (var p in book) { // _year, edition
    console.log(p);
}
book.year = 2005; 
// {_year:2005, edition: 2} // 可以不指定set，但这样值就不能写，严格模式下会报错，get不写同理
alert(book.year);

// ES5出现这个方法之前，创建访问器，有两个非标准的方法, firefox、chrome、safari都支持
// IE11及以上才支持
book.__defineSetter__("year", function (){
    return this._year;
});
book.__defineGetter__("year", function (newValue){
    if (newValue > 2004) {
        this._year = newValue;
        this.edition += newValue - 2004;
    }
});
```

### 定义多个属性 Object.defineProperties(obj, {})
```js
var book = {};

Object.defineProperties(book, {
   _year: {
       value: 2004 // 如果没设置值，不可枚举，不可修改
   },
   edition: {
       value: 1
   },
   year: {
       get: function () {
           return this._year;
       },
       set: function (num) {
           this._year = num;
           this.edition = this.edition++;
       }
   }
});
console.log(book); // {_year:2004,edition:1}
alert(JSON.stringify(book)); // 不可枚举为空 {}
```
### 获取属性的特性 Object.getOwnPropertyDescriptor/s
- Object.getOwnPropertyDescriptor(obj, key) 获取属性的属性描述符（特性）
- Object.getOwnPropertyDescriptors(obj), ES2017 新增，获取所有属性的特性(属性描述符)
``` js
// 获取属性的特征 Object.getOwnPropertyDescriptor()
Object.getOwnPropertyDescriptor(book, "_year"); 
// {"value":2004,"writable":false,"enumerable":false,"configurable":false}

Object.getOwnPropertyDescriptor(book, "year");
// {"enumerable":false,"configurable":false, get:function(){}, set:function(){}}

Object.getOwnPropertyDescriptors(book) 
// {_year: {…}, edition: {…}, year: {…}}
// … 表示对应的属性描述符对象
```

## ES6+对象的扩展
第四版新增了 ES6 对象的一些扩展，这部分功能在 《ES6入门》中有更为详细 API 介绍，参考 [8. 对象的扩展与新增方法 | ES6入门笔记](http://fe.zuo11.com/js/es6/es6-8.html)

举个例子，在介绍 Object.getOwnPropertyDescriptors 时 ES6入门有介绍该方法的引入目的，主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。这是因为Object.assign方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。这时，Object.getOwnPropertyDescriptors()方法配合Object.defineProperties()方法，就可以实现正确拷贝。

## 创建对象 
虽然Object构造函数和字面量对象都可以创建单个对象，但使用同一个接口创建多个对象，会产生大量的重复代码。
后来就出现了用工厂模式来创建对象。
### 工厂模式
> 缺点：无法识别对象类型

由于 ES6 之前没有类(class)的概念，创建对象需要使用函数来封装
```js
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        alert(this.name);
    };
    return o;
}
var person1 = createPerson("zuo",27,"web-fe");
var person2 = createPerson("lin",45,"Doctor");
```
工厂模式虽然解决了创建多个相似对象的问题，但却无法识别这个对象的类型(标识)，于是又出现了构造函数模式

### 构造函数模式
> 缺点：每个方法都要在每个实例上重新创建一遍

ES中的构造函数可用来创建特定类型的对象，原生的构造函数有Object, Array,我们也可以自定义，构造函数没有显示的创建对象，直接将属性和方法赋值给了this，没有return语句。
```js
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        alert(this.name);
    }  
}
var person1 = new Person("zuo",27,"web-fe");
var person2 = new Person("lin",45,"Doctor");

alert(person1.constructor); // Person
alert(person2 instanceof Person);  // true

```
用构造函数创建对象，必须使用new操作符(如果没有new相当于执行了一个函数，为全局对象window添加了几个属性)，函数开头的字母要大写，与普通函数区别，每次用 new 创建对象，实际上经历了 5 个步骤：
1. 创建一个新对象
2. 设置新对象的 `__proto__` (`[[prototype]]`) 设置为构造函数的 prototype（第四版新增）
3. 将构造函数内部的 this 赋值给新对象（this就指向了新对象）
4. 执行构造函数中的代码（为这个对象添加属性、方法）
5. 返回新对象
#### 将构造函数当做函数
构造函数可以作为普通函数调用，或者在一个对象的作用域中调用
```js
// 作为普通函数调用
Person("zuo",27,"web-fe"); // 添加到window对象
window.sayName(); // "zuo"

// 在另一个对象的作用域中调用
var o = new Object;
Person.call(o, "zuo", 25, "web-fe");
o.sayName(); // "zuo"
```
#### 构造函数的问题
当属性里面有函数时，每个方法都要在每个实例上重新创建一遍
```js
this.sayName = function () {
    alert(this.name);
};
// 等价于:
// this.sayName() = new Function("alert(this.name)");

// 解决这个问题可以在函数外包定义函数
function sayName() {
    alert(this.name);
}
this.sayName = sayName;

// 但如果有多个函数，会创建好几个全局函数，会破坏定义的引用类型的封装性
// 可以使用原型模式来解决
```

### 原型模式
> 缺点：如果原型的属性是引用类型，实例都会共用该引用类型。改变一个实例的值，其他实例的该值也会改变。

每个函数都会创建一个 prototype (原型) 属性，这个属性是一个指针，指向函数的原型对象。使用构造函数创建的实例都共用该原型的属性、方法。
#### 理解原型
将 sayName 放到原型属性上，那么 person1 和 person2 就都共用一个 sayName 函数了。
```js
function Person() {}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    alert(this.name);
};

var person1 = new Person(); 
var person2 = new Person(); 
person1.sayName === person2.sayName // true
JSON.stringify(person1); // {}, 这里是空，但 for (var prop in person1) 可以遍历出三个属性
```

![函数的原型属性image](/images/js/6_1_原型模式.png)

如上图所示：
1. 只要创建一个函数(比如 Person)，就会为函数创建一个 prototype 属性，指向原型对象（Person.prototype = Person原型对象）。
2. 原型对象自动获得一个 constructor 的属性，指向与之关联的构造函数(Person原型对象.constructor = Person)，即 `Person.prototype.constructor === Person`
3. 自定义构造函数时，对应的原型对象只会获得一个 constructor 属性，其他所有方法都继承自 Object。即 Person.prototype 是 Object 构造函数的实例。
4. 构造函数每次 new 创建的实例（比如 person1），都有一个 `[[prototype]]` 指针（对应 Firefox、Safari、Chrome 浏览器暴露的 `__proto__` 属性）指向构造函数的原型对象。即 `person1.__proto__ === Person.prototype`
5. 注意：实例与构造函数原型(对象)之间有直接的联系，但实例与构造函数之间没有。
```js
Person.prototype.constructor === Person // true
person1.__proto__ === Person.prototype // true
person1.__proto__ === person2.__proto__

// 正常的原型都会终止于 Object 原型对象
// Object 原型的原型是 null
Person.prototype.__proto__ === Object.prototype // true
Person.prototype.__proto__.constructor === Object // true
Person.prototype.__proto__.__proto__ === null // true

// 构造函数、原型对象、实例是 3 个完全不通过的对象
person1 !== Person
person1 !== Person.prototype
Person !== Person.prototype

person1 instanceof Person // true
person1 instanceof Object // true
Person.prototype instanceof Object // true
```
::: tip
第四版，在理解原型这里，增加了更为细致的解释
:::

可以使用 isPrototypeOf 来判断原型对象是否是某个实例的原型。可以使用 Object.getPrototypeOf() 来获取某个实例的原型。
```js
Person.prototype.inPrototypeOf(person1) // true
Object.getPrototypeOf(person1) === Person.prototype // true
```
Object.setPrototypeOf(函数, 原型对象) 可以为函数指定原型。可以重写一个对象的原型继承关系。
```js
let obj = {
	name: "zuo"
}
let person = {
	age: 100
}
Object.setPrototypeOf(person, obj)
person.name // "zuo"
person.age // 100
Object.getPrototypeOf(person) === obj // true
```

::: warning
Object.setPrototypeOf() 可能会严重影响代码性能，建议通过使用 Object.create() 来创建一个新的对象，并指定其原型
:::
```js
let obj = {
	name: "zuo"
}
let person = Object.create(obj)
person.age = 100

person.name // "zuo"
person.age // 100
Object.getPrototypeOf(person) === obj // true
```
#### 原型的层级
访问对象的属性时，会优先看该对象本身是否有该属性，如果没有实例属性，那就去他的原型对象上去找。实例属性会覆盖原型对象上的同名属性。
1. `判断是否为实例属性`。可以使用 obj.hasOwnProperty(属性名) 来判断属性是否是 obj 实例的属性。
2. `判断是否是实例属性或原型属性`。可以使用 in 操作符。`属性名 in 实例对象` 和 for...in 的行为一样，不管属性是实例属性还是原型属性，只要有，就返回 true。
3. `判断是否为原型属性`。如果使用 in 操作符是为 true，且使用 hasOwnProperty 为 false，那么就是原型属性。

```js
function Person() {}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    alert(this.name);
};

var person1 = new Person(); 
var person2 = new Person(); 
JSON.stringify(person1); // {}, 这里是空，但 for (var prop in person1) 可以遍历出三个属性

person2.name = "editTest";  
person2.sayName(); // "editTest" 
person1.sayName(); // "Nicholas"
alert(person1.sayName == person2.sayName); // true
// person1 与 person2 内部都指向了原型对象，但不能直接访问 prototype
// Person.prototype指向了原型对象，Person.prototype.constructor又指回了Person
```

上面说原型对象的属性是实例共用的，但为什么修改 person2.name 值后，person1 的 name 值没有变？**如果实例重新设置的原型对象属性的值，会创建一个对应的实例属性**，通过实例访问该属性时，优先查找实例属性，再找原型对象属性。delete实例的这个属性后，访问的就是原型属性了。
```js
person1.hasOwnProperty("name"); // false 虽然通过原型可以访问，但不是实例的属性
person2.hasOwnProperty("name"); // true 创建了一个实例属性
delete person2.name; // 
person2.name; // "Nicholas" 访问原型
person2.hasOwnProperty("name"); // false

// ES5获取实例对象的原型 Object.getPrototypeOf()
alert(Object.getPrototypeOf(person1) == Person.prototype); // true

alert("name" in person1); // true 
// 只要可以通过person1访问到name属性就是true，不管是原型属性还是实例属性


alert(hasPrototypeProperty(person1, "name")); // true  是原型属性
alert(hasPrototypeProperty(person2, "name")); // false 
// 设置了person2.name的值后，就非原型属性了

// 关于枚举
// ES5 提供了 Object.keys(),返回对象可以枚举的字符串数组
// 无论是否可枚举都列出属性 Object.getOwnPropertyNames()
var keys = Object.getOwnPropertyNames(Person.prototype); 
// ["constructor", "name", "age", "sayName"]

var keys2 = Object.keys(Person.prototype); // 与for-in结果类似
// ["name", "age", "sayName"]
```

![6_0_实例属性与原型属性.png](/images/js/6_0_实例属性与原型属性.png)

#### 属性的枚举顺序与对象的迭代
参考：[深入JS遍历对象，从4个维度比较遍历对象的8种方法 | dev-zuo 技术日常](http://www.zuo11.com/blog/2020/2/js_obj_iterator.html)

#### 更简单的原型语法
```js
function Person() {
}
Person.prototype = {
    name: "zuo",
    age: 29,
    sayName: function () {
        alert(this.name);
    }
};

var name1 = new Person(); // name1.constructor == Object
alert(name1 instanceof Person); // true
alert(name1 instanceof Object); // true
// name1.constructor  =   {}     Person.prototype == name1.__proto__
alert(name1.constructor == Person); // false  这里如果需要让prototype里的constructor返回Person，需要手动设置值
alert(name1.constructor == Object); // true   

// 在Person.prototype手动加入constructor: Person, 可以解决问题，但会让这个属性可枚举
// 可以使用这种方式来解决上面的问题，但只支持ES5及以上
Object.defineProperty(Person.prototype, "constructor", {
    enumerable: false,
    value: Person
})
```
#### 原型的动态性
可以先创建实例，再修改原型
```js
var friend = new Person();

Person.prototype.sayHi = function () {
    alert("Hi");
};
firend.sayHi(); // "Hi"
```
虽然是动态的，但不能在创建实例后，重写整个原型对象,否则之前的实例无法访问新的原型对象
```js
function Person() {    
}

var friend = new Person(); 

Person.prototype = { 
    constructor: Person,  // 重写原型对象，constructor 会消失，需手动补上
    name: "Nicholas",
    age: 29,
    sayName: function () {
        alert(this.name);
    }
};
// 如果重写整个原型对象之后，再访问新定义的方式，会报错。friend指向的还是原来的原型
friend.sayName(); // error, sayName is not function
```
![重写原型对象image](/images/js/6_2_重写原型属性.png)

#### 原生对象的原型
Array.prototype.sort, String.prototype.substring都是原生对象的原型，我们可以使用原型，给原生对象定义方法
```js
// 为string添加一个startWith方法
String.prototype.startWith = function (text) {
    return this.indexOf(text) == 0;
};

var msg = "Hello world!";
msg.startWith("Hello"); // true

// 不推荐使用，可能会意外的重写原生方法
```

#### 原型对象的问题
原型模式共享了方法和属性，函数倒没什么，属性相互影响就不合理了，比如有一个属性是数组，使用原型模式创建两个实例，它们会共享这个数组属性，实例1 push 一个新元素进去，实例 2 的该属性也会被影响

::: tip
第四版，创建对象就介绍完了，直接就到继承了。后面的几个创建对象的内容属于无关紧要的，可以不看，后面推荐使用 class。
:::
### 组合使用构造函数和原型模式(第4版已删)
> 缺点：原型的设置和构造函数分开写，显得不是一个整体。

创建自定义类型的最常见方式，就是组合使用构造函数与原型模式,构造函数定义实例属性，原型模式定义方法和共享的属性
```js
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ["Shelby", "Court"];
}

Person.prototype = {
    custructor: Person,
    sayName: function () {
        alert(this.name);
    }
};    

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1.friends.push("Van");
alert(person1.friends); // Shelby,Court,Van
alert(person2.friends); // Shelby,Court
alert(person1.friends === person2.friends); // false
alert(person1.sayName === person2.sayName); // true

```

### 动态原型模式(第4版已删)
上面组合的方式，构造函数和原型是独立的，动态原型的模式可以将所有信息都封装到构造函数中
```js
function Person(name, age, job) {
    // 属性
    this.name = name;
    this.age = age;
    this.job = job;
    
    // 方法  只会在初次调用构造函数时执行
    if (typeof this.sayName != "function") {
        Person.prototype.sayName = function () {
            alert(this.name);
        }
    }
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();
```
**注意：不能使用对象字面量重写原型，否则会切断现有实例和新原型之间的联系。**

### 寄生构造函数模式(第4版已删)
除了使用new操作符并把使用的包装函数叫做构造函数之外，这个模式与工厂模式其实是一模一样的。当上面的模式都不可用时，再使用这个，主要用在特殊情况下为对象创建构造函数，比如创建为数组新增一个方法，而不直接修改Array()构造函数
```js
function Person(name, age, job) {
    var o = new Object();
    
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        alert(this.name);
    };
    
    return o;
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName(); // "Nicholas"

// 特殊数组
function SpecialArray() {
    var values = new Array();
    
    // 添加值
    values.push.apply(values, arguments);
    // 添加方法
    values.toSomeString = function () {
        return this.join('|');
    };
    
    return values;
}

var colors = new SpecailArray("red","blue","green");
colors.toSomeString(); // "red|blue|green"
```

### 稳妥的构造函数模式(第4版已删)
没有公共属性，且方法不引用this对象
```js
function Person(name, age, job) {
    // 创建要返回的对象
    var o = new Object();
    
    // 可以在这里定义私有变量或函数
    
    // 添加方法
    o.sayName = function() {
        alert(name);  
    };
    
    return o;
}
// 在这个模式创建的对象中，除了使用sayName()方法外，没有其他方法访问name的值
var friend = Person("zuo", 29, "sw");
friend.sayName(); // "zuo"

```

## 继承
ECMAScript 实现继承主要是依靠原型链来实现
### 原型链
继承的基本思想是利用原型，让一个引用类型继承另一个引用类型的属性和方法。构造函数、原型、和实例的关系：
- 每一个构造函数都有一个原型对象
- 原型对象的 constructor 指向构造函数
- 构造函数创建实例都包含一个指向原型对象的指针。

如果把一个对象的实例（如 person1），赋值给另一个对象（Man）的原型属性。(Man.prototype = person1) 那另一个对象就可以获得这个对象的属性及方法。

![6_3_原型对象为另一个对象的实例.png](/images/js/6_3_原型对象为另一个对象的实例.png)

#### 使用原型链实现继承
下面的例子是仿照书上写的，如果觉得不好理解，可以直接看书，p238
```js
function Person() {
    this.personName = "Li";
}
Person.prototype.getPersonName = function() {
    return this.personName;
};

function Man() {
    this.manName = "Zuo";
}
// 继承Person
Man.prototype = new Person();
Man.prototype.getManName = function() {
    return this.manName;
};

// 注意： 使用字面量添加原型方法，会重写原型。如果之前设置了继承(Man.prototype = new Person())，会失效
// Man.prototype = {
//   getManName: function() {
//     return this.manMan;
//   }
// }

// // 重写Person里面的方法
// Man.prototype.getPersonName = function() {
//    return "Test";
// };

var aboy = new Man();
alert(aboy.getPersonName()); // Li
// 查找getPersonName时，先搜索实例aboy，再搜索Man.prototype，再搜索Person.prototype

alert(aboy instanceof Object); // true
alert(aboy instanceof Person); // true
alert(aboy instanceof Man); // true

alert(Object.prototype.isPrototypeOf(aboy)); // true
alert(Person.prototype.isPrototypeOf(aboy)); // true
alert(Man.prototype.isPrototypeOf(aboy)); // true
```
如下图所示，注意由于Man的原型被重写，constructor指向被改变 aboy.constructor === Person

![原型链继承image](/images/js/6_4_原型链继承.png)

#### 原型链的问题
- 如果包含引用类型值的原型。由于原型是实例共享的，引用类型改变某个值，其他的都会变
- 创建子类型的实例时，无法向父类型的构造函数中传递参数

由于以上的问题，实际中很少会单独使用原型链
```js
function SuperType() {
    this.colors = ["red", "blue", "green"];
}
function SubType() {
}

// 继承SuperType
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors); // red,blue,green,black

var instance2 = new SubType();
alert(instance2.colors); // red,blue,green,black
```

### 借用/盗用构造函数（constructor stealing）
盗用构造函数，也叫 "对象伪装" 或者 "经典继承"，不使用原型链，直接在子类型构造函数中，用 call 或 apply 调用父类型构造函数。可以解决原型中包含引用类型值所带来的问题。
```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayColor = function() {
  alert("blue");
}

function SubType() {
  // 继承了 SuperType  还可以传递参数  SuperType.call(this，"参数");
  SuperType.call(this);
  
  // 实例属性
  this.age = 27;
}

var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors); // red,blue,green,black

var instance2 = new SubType();
alert(instance2.colors); // red,blue,green

// 借用构造函数无法获取父对象的原型属性
instance1.sayColor // undefined
```
仅仅只用借用构造函数，也存在一些问题。
- 无法避免构造函数模式存在的问题 - 方法都在构造函数中定义，不能复用函数。
- 父类型对象的原型中定义的方法，对子类型不可见

考虑到这些问题，盗用构造函数的技术也是很少单独使用的

### 组合继承（combination inheritance）
JS 里面最常见的继承模式，也叫 **伪经典继承**，将原型链和盗用构造函数结合起来使用。
- 使用原型链实现对原型属性和方法的继承，
- 通过借用构造函数来实现对实例属性的继承。

这样通过原型定义方法实现了函数复用，且每个实例也有他自己的属性。
```js
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
    alert(this.name);
};

function SubType(name, age) {
    // 使用构造函数继承实例属性
    SuperType.call(this, name);
    
    this.age = age;
}
// 使用原型链继承原型属性及方法
SubType.prototype = new SuperType();
SubType.prototype.sayAge = function () {
    alert(this.age);
};

var instance1 = new SubType("Li", 29);
instance1.colors.push("black");
alert(instance1.colors); // red,blue,green,black
instance1.sayName(); // Li
instance1.sayAge(); // 29

var instance2 = new SubType("Zuo", 27);
alert(instance2.colors); // red,blue,green
instance2.sayName(); // Zuo
instance2.sayAge(); // 27
```

### 原型式继承
与原型链类似，但并没有使用严格意义上的构造函数
```js
function object(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
// 根据一个对象，copy出对象，中间借用了一个临时性的空构造函数
var person = {
    name: "zuo",
    friends: ["Li", "Zhang", "Wang"]
};
var person2 = object(person);
person2.name = "You"; // 如果赋值创建一个实例实现，会共享person的原型属性
person2.friends.push("Rob");

var person3 = object(person);
person3.name = "Shang";
person3.friends.push("Barble");

alert(person.friends); // Li,Zhang,Wang,Rob,Barble

```
![6_5_原型式继承.png](/images/js/6_5_原型式继承.png)

ES5新增 Object.create() 方法规范化了原型式继承，该方法接收两个参数，一个用作新对象原型的对象和一个为新对象定义额外属性的对象（可选）
```js
var person = {
    name: "zuo",
    friends: ["Li", "Zhang", "Wang"]
};

// var person2 = Object.create(person);
// person2.name = "You"; // 如果赋值创建一个实例实现，会共享person的原型属性
// person2.friends.push("Rob"); // 这里仅push，没有重写。会改变原型属性的值
// 如果传入第二个参数
var person2 = Object.create(person, {
    name: { // 这个也是实例属性
        value: "You"
    },
    friends: { // 如果设置了该属性，就为实例属性了，这个对象不会共享原来原型属性。
        value: ["Rob"]
    }
});
alert(person2.friends) // ["Rob"]


var person3 = Object.create(person);
person3.name = "Shang";
person3.friends.push("Barble");

alert(person.friends); // Li,Zhang,Wang,Barble
```
### 寄生式继承
与原型继承紧密相关，多了一点扩展。与构造函数类似，不能函数复用
```js
function createAnother(original) {
    var clone = object(original);
    clone.sayHi = function (){
        alert("Hi");
    };
    return clone;
}

var person = {
    name: "zuo",
    friends: ["Li", "Zhang", "Wang"]
};

var p1 = createAnother(person);
p1.sayHi(); // Hi
```

![6_6_寄生式继承.png](/images/js/6_6_寄生式继承.png)

### 寄生组合式继承
前面提过，组合继承是 JS 最常用的继承模式，但是它也有不足，它最大的问题就是，无论什么情况下都需要调用两次超类型构造函数：一次是在创建子类原型的时候，一次是在子类构造函数内部。 寄生组合式继承可以使用原型式继承少执行一次超类型构造函数。避免了在 SubType.prototype 上创建不必要的，多余的属性。开发人员普遍认为寄生组合式继承是引用类型继承的最佳模式。
```js
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
    alert(this.name);
};

function SubType(name, age) {
    // 继承实例属性和实例方法
    SuperType.call(this, name);
    
    this.age = age;
}
// 下面注释的行时组合继承的实现，主要目的是继承原型属性和原型方法，
// SubType.prototype = new SuperType();
// 不足之处在于：实例属性已经通过借用构造函数继承了。
// new SuperType() 的实例还是会有实例的属性 name、colors，存在重复。

// 这里是寄生组合式继承的实现方式 
// 组合继承会可能会为 SubType 添加一些实例属性。这种方法不会
// 它只是直接把原型对象做了处理，和实例属性无关，还可以减少一次 new 构造函数的操作
function inheritPrototype(subType,superType) {
    var prototype = object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
inheritPrototype(SubType, SuperType);

// 等价于
// subType.prototype = object(superType.prototype)
// subType.prototype.constructor = subType;

SubType.prototype.sayAge = function () {
    alert(this.age);
};

var instance1 = new SubType("Li", 29);
instance1.colors.push("black");
alert(instance1.colors); // red,blue,green,black
instance1.sayName(); // Li
instance1.sayAge(); // 29

var instance2 = new SubType("Zuo", 27);
alert(instance2.colors); // red,blue,green
instance2.sayName(); // Zuo
instance2.sayAge(); // 27

```

## 类 Class
类本质上就是构造函数+原型的语法糖，支持继承。本章介绍的核心 API 与《ES6入门》介绍的内容大致一样。笔记略，详情参考：[Class - ES6入门笔记](http://fe.zuo11.com/js/es6/es6-15.html)
