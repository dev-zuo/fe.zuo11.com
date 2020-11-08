---
title: 3. ES基本概念(语言基础) - JS高程4
description: 主要介绍 ECMAScript 的基本语法：变量、数据类型；8种操作符；流程控制语句等。ES语法：区分大小写, typeof 和 typeOf是不同的。标识符（也就是变量名，函数名、属性名）：只能以字母、下划线(_)或美元符号($)开头，其他字符可以是字母、下划线、美元符号或数字；按照惯例，ECMAScript标识符采用驼峰大小写格式，如firstSecond、myCar；不能把关键字、保留字、true、false、null等ES自身实现需要的用作标识符
keywords: ES变量,ES数据类型,ES操作符,ES流控制语句
---

# 3. ECMAScript基本概念（语言基础）

主要介绍 ECMAScript 的基本语法：变量、数据类型；8种操作符；流程控制语句等。

## ES语法
- 区分大小写, typeof 和 typeOf是不同的
- 标识符（也就是变量名，函数名、属性名）
  - 只能以字母、下划线(_)或美元符号($)开头，其他字符可以是字母、下划线、美元符号或数字
  - 按照惯例，ECMAScript标识符采用驼峰大小写格式，如firstSecond、myCar
  - 不能把关键字、保留字、true、false、null等ES自身实现需要的用作标识符
- 关键字和保留字 是ES自身实现控制语句、执行某些特定操作等需要使用或未来需要使用的。不能作为标识符，否则会出错，如 var、if、else等。
- 注释 单行 //  多行  /* */
- ES中的语句以分号结尾，如果省略分号，则由解析器确定结尾，最好不要省略，有以下好处
  - 理论上可以增加性能，因为加了分号解析器就不必再花时间来推测在哪插入分号了
  - 可以删除多余的空格来压缩代码
- 代码块，依然是以 { } 的形式表示。 if (xx) { } else {}, 为了减少错误，方便以后迭代维护，最好不要省略{}
- 严格模式 (strict mode) ES5引入的概念，严格模式为JS定义了一种不同的解析与执行模型，ES3不确定的行为会得到处理，
而且对某些不安全的操作会抛出错误,关于兼容性问题，不用担忧，IE9及以下的版本，会忽略这个字符串，不开启严格模式。
``` js
// 使用方法1: 在顶部添加 "use strict"，使整个脚本文件都使用严格模式
"use strict";

// 使用方法2: 在函数内部添加，指定函数在严格模式下执行
function doSomething () {
    "use strict";
    // 函数体
}
```

## ES变量
- 声明一个变量需要使用var
- 变量是弱类型的，无需明确的类型声明。每个变量仅仅是一个保存值的占位符而已
``` js
// 定义一个变量study，该变量可以用来保存任何值(数字、字符串、函数等)可以不用初始化，默认值为undefined
var study;

// 定义并初始化test变量
var test = "hello world";
test = 3; // 有效但不推荐，最好不要改变变量所保存值的数据类型
```
- 局部变量与全局变量, 全局变量是整个脚本都可以使用的变量，局部变量只在函数内部有效
  - 函数内部以var定义的变量就是局部变量，这个变量在函数退出后会被销毁，外部是不能使用的。
  - 在非严格模式下，函数内部可以不定义变量，直接给其赋值，这个变量会变成全局变量，外部可以使用。
- 可以使用一条语句定义多个变量, 以逗号分隔
``` js
// 代码的换行和缩进不是必须的，这样做可以提高可读性和性能，执行1条语句比执行3条语句要快
var test = "hello",
    isTrue = false,
    age;
```

::: tip
ES6里面可以使用let、const，在 《JS高程4》 中有介绍 let、const，其实和阮一峰 《ES6入门》的 let 与 const 内容基本一致。只是多给了一个最佳实践：建议不要使用 var，const优先，let次之。更多详情参见 [let与const | ES6入门笔记](http://fe.zuo11.com/js/es6/es6-2.html#let%E4%B8%8Evar%E7%9A%84%E5%8C%BA%E5%88%AB)
:::

## 数据类型
ES3有五种基本数据类型Undefined、Null、Boolean、Number 和 String，以及一种复杂数据类型 Object(本质上是由一组无序的键值对组成的)。
使用typeof操作符可以检测对应变量的数据类型
``` js
/**
 * typeof 变量名; 会返回对应的数据类型字符串
 * "undefined" - 如果这个值是未定义;
 * "boolean"   - 如果这个值是布尔值;
 * "string"    - 如果这个值是字符串;
 * "number"    - 如果这个值是数值;
 * "object"    - 如果这个值是对象或null;
 * "function"  - 如果这个值是函数
 */

var test = "hello";
alert(typeof test);  // "string"
alert(typeof(test)); // "string"
alert(typeof 95);    // "number"
```
- Undefined 类型，当变量未定义或者变量定以后未初始化，或者变量变赋值为 undefined
- Null类型 表示一个空对象指针，typeof null会返回object，null可以用来初始化一个空对象 undefined == null
- Boolean 布尔值 true or false 区分大小写，可以使用Boolean()函数对任何对象判断是否为true or false
``` js
var str = "hello world";
/**
 * 这里系统会自动对str执行一次Boolean(str)，将其转换为boolean类型值
 * 当str为以下值时，Boolean(str)为false:
 * String类型：空字符串 ""; Number类型：0 和 NaN; Object类型：null; undefined
 */
if (str) {
    alert("value is true");
}
```

::: tip
ES6+ 后面新增了两种基本数据类型：Symbol, bigint
::: 

注意：
1. typeof 函数值为 `function`, typeof null 值为 `object`，本质上其实有 9 种数据类型。
2. new String('12') 是字符串对象，不是 string，new Number(1) 是数字对象，不是 number，new Boolean(false) 是对象，不是 boolean
3. 新增的 Symbol 以及 bigint 都是不能 new 的，没有 constructor 够着函数方法

```js
var a = null,       // null
    b = undefined, // undefined 
    c = false, // bollean
    d = 1, // mumber
    e = "123", // string
    f = {}, // object
    g = Symbol("3"), // symbol
    h = BigInt(4); // 4n bigint
[a, b, c, d, e, f, g, h].forEach(item => console.log(`typeof `, item, `: ${typeof item}`))
// typeof  null : object
// typeof  undefined : undefined
// typeof  false : boolean
// typeof  1 : number
// typeof  123 : string
// typeof  {} : object
// typeof  Symbol(3) : symbol
// typeof  4n : bigint
```

关于 Symbol 可以参考: []()

关于 bigint 可以参考: [ES2020 bigint数据类型，为什么要新增这个数据类型?](http://www.zuo11.com/blog/2019/12/bigint.html)

### Number类型
- 整数(十进制、八进制(0开头)、十六进制(0x开头))
  - 严格模式不支持八进制 八进制后面如果有数值>=8，整个数会被当做10进制处理
  - 八进制、十六进制，数学运算后返回的值都是十进制
- 浮点数/小数, 保存浮点数所需的内存空间为保存整形数值的两倍，ES会在某些情况将其转化为整数
  - 可以用科学计数法来表示过小或过大的值，用e表示
  - 浮点数值的最高精度是17位小数，但计算时精度会有误差，0.1 + 0.2不等于0.3，而是0.30000000000000004
  - ~~默认情况下，ES会将小数点后面带有6个0以上的自动转换为科学计数法(e)表示~~ JS高程 3 原话，但 Chrome 下试验时却不是这样的
``` js
// 基础浮点数
var floatNum1 = 1.1,
    floatNum2 = 0.1,
    floatNum3 = .1; // 有效但不推荐

// 科学计数法
var floatNum4 = 3.125e7, // 3.125 x 10的7次方 = 31250000
    floatNum5 = 3e-7; // 3 x 10的-7次方 = 0.0000007

// 浮点数值计算会产生误差，这个是基于IEEE754数值的浮点数计算的通病，ES并非独此一家
if (a + b == 0.3) { // 由于浮点计算可能会有误差，不要做类似于这样的操作
    alert("you got 0.3.")
}
```
- 特殊的Number值
  - Number的数值范围，最大值Infinity（Number.MAX_VALUE），最小值-Infinity（Number.MIN_VALUE），可以用isFinity()函数来检测是否位于最大值和最小值之间，Number.Number.MAX_SAFE_INTEGER 是最大安全整数，超过后计算可能会异常，这种情况就需要使用 bigint 了。最大安全整数值为 `9007199254740991`，大概九千万零七亿。
  - NaN 表示非数值(not a Number, Number.NaN)，当非空字符串/数字时，得到的值就是NaN，NaN与任何值都不相等，包括他自己
``` js
/**
 * 可以用isNaN()来判断是否是非数值
 * 这个函数先会像对象转换为数值，任何不能转换为数值的都会返回true
 */
alert(isNaN(NaN));    // true
alert(isNaN(10));     // false
alert(isNaN("10"));   // false可以转换为数值10
alert(isNaN("blue")); // 不能转换为数值
alert(isNaN(true));   // false 可以转换为数值1
alert(NaN === NaN);   // false
```
- 数值转换, 有三个函数可以将非数值转换为数值: Number(), parseInt(), parseFloat()，Number()转换可以用于任何数据类型，
  而另两个函数则专门用于把字符串转换成数值。如果是字符串都会默认去掉最前面的空格, 如"   12" => 12
  - Number(undefined) => NaN; Number(null) => 0; Number(true) => 1;
  - Number(字符串), 空字符串 => 0; "八进制整数"默认去掉前置0,如"011" => 11; "十六进制整数0x"转换为对应的十进制整数,其他字符串 => NaN
  - Number()在处理复杂的字符串时比较复杂不够合理，处理整数的时候，通常用parseInt(), parseInt()会从左至右寻找第一个非空字符，如果第一个非空字符不是数字字符或负号，就会返回NaN,如果是数字会继续向后解析，直到解析完或遇到非数字字符停止。
  - parseFloat() 与parseInt()类似, 它是以寻找浮点数 . 为目标向右寻找，之后遇到 . 或字符会终止
``` js
var n1 = parseInt("1234bl"); // 1234
var n2 = parseInt("");       // NaN
var n3 = parseInt(false);    // NaN
var n4 = parseInt(22.5);     // 22
var n5 = parseInt("0xA");    // 10

/**
 * ES3里面解析为 56， ES5之后解析为70
 * 为了避免歧义，关于进制的转换，可以使用parseInt()的第二个参数指定转换的类型, 不强制要求以0x或0开头
 * parseInt("070", 8) => 56;  parseInt("070", 10) => 70;  parseInt("070", 16) => 112;
 */
var n6 = parseInt("070");
var n7 = parseInt("AF", 16); // 175

var na = parseFloat("1234bl");  // 1234
var nb = parseFloat("0xA");     // 0
var nc = parseFloat("22.5");    // 22.5
var nd = parseFloat("22.34.5"); // 22.34
var ne = parseFloat("3.125e7"); // 31250000

```

### String类型
字符串，一般以双引号或单引号表示, "字符串"、'字符串'。
- 特殊字符串，转义字符,有一些特殊的转义字符需要在前面加 `\`，比如表示反斜线使用 `\\`, 单引号用 `\'` 等。十六进制转义字符'\xnn' '\x41' => 'A' => 65, Unicode字符 '\unnnn', '\u03a3'表示希腊字符 Σ
- 字符串的长度可以使用length属性取得，转义字符只算一个字符长度
- 非字符串可以通过toString()方法转为字符串, 数字转字符串时可指定对应的进制(2, 8, 16)
- 对于不能使用toString()方法的null, undefined可以使用String(str)函数来转
``` js
var num = 10;
var num2 = true;
var num3 = null;
var num4;

alert(num.toString());   // "10"
alert(num.toString(2));  // "1010"
alert(num.toString(8));  // "12"
alert(num.toString(10)); // "10"
alert(num.toString(16)); // "a"
alert(num2.toString());  // "true"

alert(String(num2));     // "true"
alert(String(num3));     // "null"
alert(String(num4));     // "undefined"
```

::: tip
JS高程4中新增 模板字面量、字符串插值、模板字面量标签函数，原始字符串 String.raw 标签函数相关介绍，和 ES6入门 描述内容基本一致。
:::

参考 [模板字符串 | ES6入门笔记](http://fe.zuo11.com/js/es6/es6-4.html#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)

### Symbol类型
相比ES6入门教程，新增了异步迭代 for...await...of 内置属性 Symbol.asyncIterator 描述，其他参考：[Symbol | ES6入门笔记](http://fe.zuo11.com/js/es6/es6-10.html#symbol)

他与 Symbol.iterator 类似。for...of 遍历对象，就是调用对象的 Symbol.iterator 迭代器方法。同理，for...await...of 遍历对象，就是调用对象的 Symbol.asyncIterator 异步迭代器方法。

```js
class Emitter {
  constructor(max) {
    this.max = max;
    this.asyncIdx = 0;
  }
  async *[Symbol.asyncIterator]() {
    while(this.asyncIdx < this.max) {
      yield new Promise((resolve) => resolve(this.asyncIdx++));
    }
  }
}
let emitter = new Emitter(5)
for await (const x of emitter) {
  console.log(x)
}
// 0
// 1
// 2
// 3
// 4
```

### Object类型
对象可以通过执行 new 操作符后跟要创建的对象类型的名称来创建。可以为其添加属性或方法。之后会具体再讨论
``` js
// 创建一个对象实例
var o = new Object();

// Object的每个实例都具有以下属性和方法
alert(o.constructor); // 保存着该对象的构造函数Object()
alert(o.hasOwnProperty("name")); // 检查该对象实例是否拥有某个属性或方法
alert(o.toString()); // 对象的字符串表示
```

## 操作符 
共8种：5种基础，3种特殊
- 一元操作符(++、--、-、+)
- 位操作符(&、|、~、^、<<、>>、>>>)
- 逻辑运算符(&&、||、!)
- 算术运算符(+、-、*、/、%)
- 关系运算符(<、>、<=、>=、==、!==、===、!==)
- 条件操作符(isTrue?a:b)
- 赋值运算符(=、+=、*=、/=、%=、<<=、>>=)
- 逗号运算符(,)
### 一元操作符
自增++, 自减--, 负号-，正号+
- 自增与自减，目标会+1或-1，如果在表达式里做运算时，注意前后差异
- 对不能转换为数字的字符串使用，结果会是NaN

### 位操作符(二进制运算)
按位与&、按位或|、按位非~、按位异或^、左移<<、有符号右移>>、无符号右移>>>

一般是以32位二进制来计算的，高位补0, 负数存储的形式是二进制补码。0正 1负

1. 负数的原码是其绝对值的原码取反再 +1，取反时记得补足 32位
2. 根据源码计算负数。负数的源码以 1 开头，减 1，取反，加负号

``` js
// 18的二进制表示 10010
0000 0000 0000 0000 0000 0000 0001 0010

/**
 * 负数的二进制存储形式为补码（其绝对值的原码取反再加1），-18的二进制表示
 * -18绝对值的原码 0000 0000 0000 0000 0000 0000 0001 0010 =>
 * 取反 1111 1111 1111 1111 1111 1111 1110 1101 =>
 * 加一 1111 1111 1111 1111 1111 1111 1110 1110
 */
1111 1111 1111 1111 1111 1111 1110 1110

/**
 * 根二进制码转换为10进制，默认为32位，没有32位前面就全部朴0，0正 1负数
 * 正数：10010   =>  18
 * 负数：1111 1111 1111 1111 1111 1111 1110 1110
 * 32位 1开头的为负数，逆向解析
 * -1 => 取反 => 加-号
 * 1111 1111 1111 1111 1111 1111 1110 1101 =>
 * 0000 0000 0000 0000 0000 0000 0001 0010 =>  18
 * -18
 */


// 按位非 ~   全部取反
var num1 = 25;    // 0000 0000 0000 0000 0000 0000 0001 1001
var num2 = ~num1; // 1111 1111 1111 1111 1111 1111 1110 0110 => -1、取反 => 11010 => 加负号 => -26

// 按位与 &   两个数转换为二进制（符号位也算），全1为1，其他为0
// 按位或 |   ...，全0为0，其他为1
// 按位异或 ^  ...，相同为0 不同为1
```

在 `koa-router` 源码里面的真实使用场景，用 `!~某个值`，来判断值是否等于 -1 。`~-1` 等于 0.

```js
// 源码出处 https://github.com/koajs/router/blob/master/lib/router.js
// if (!~implemented.indexOf(ctx.method)) { ... }
// -1 的原码按位取反后，再取非
// -1 的原码，1 的源码 => 取反 => +1
0000 0000 0000 0000 0000 0000 0000 0001
1111 1111 1111 1111 1111 1111 1111 1110
// -1 原码
1111 1111 1111 1111 1111 1111 1111 1111
// -1 源码 ~ 为 0
```

```js
1111 1111 1111 1111 1111 1111 1111 1110
```

- 左移动 << 不会影响符号位 2 << 5  0010 => 0100 0000 => 64, -2 << 5 => -64
- 有符号的右移 >> 同<<一样，符号位不影响 -64 >> 5 => -2   64 >> 5 => 2
- 无符号的右移 >>> 正数右移值无影响，负数又移高位补0，成了很大的正数

注意，左移和又移要慎用，因为并不是左移几位就是乘以 2 的多少次方，比如

```js
1 << 2 // 4
1 << 31 // -2147483648
1 << 32 // 1
```

### 逻辑运算符
逻辑与&&、逻辑或||、逻辑非!
- 逻辑与两者都为true，结果才为true，逻辑或，有任意一个操作数为true结果就是true，逻辑非就是true=>false, false=>true
- 如果第一个操作数是对象, &&会返回第二个操作数，||会返回第一个操作数
- && 如果第二个操作数是对象，第一个操作数结果为true才会返回第二个操作数，否则返回false
- && 如果有一个操作数是NaN返回NaN，类似的有null、undefined
- &&、|| 短路问题，&&前一个操作数为true后面的不会执行，||前一个为true后面的不会执行
- || 第一个操作数为false，返回第二个操作数
- || 两个操作数都为NaN才返回NaN,类似的有null、undefined
- ! 如果是对象或非空字符串或非0数值 均返回 false
- ！如果是空字符串，数字0，null、NaN、undefined，均返回true

### 算术运算符
加+、减-、乘*、除/、求模(取余)%
一般对于非Number类型的会用Number()转换再进行计算，对于特殊情况NaN、undefined值为NAN,Infinity及+0、-0的问题不做深究
- 字符串加时会从左至右执行计算，字符串+数字结果会是字符串 "2"+1 => "21"

### 关系运算符
大于>、小于<、大于等于>=、小于等于<=、相等不相等==/!==、全等不全等===/!==
- 如果两个操作符都是数值，则进行数值比较,
- 有一个数值，另一个不是的，需通过Number转换后再比较，"a" => NaN, NaN与任何数比较结果都是false
- 如果都是字符串，转换成对应的ASCII码再逐个比较 "abc" > "Bac"; "234" < "3", 数字是从48("0")开始，大小字母65("A")、小写字母97("a")
- **如果是对象比较会调用其valueOf()方法，没有则toString方法再比较**
- === 全等，不转换，直接比较是否相等，值一致，类型一致。 "3" === 3 => false
- == 经过转换后再比较，类型可以不一致，转换或的值一致也可以。 "3" == 3 > true

非全等 ==，涉及隐式转换。调用 valueOf 或 toString，一般面试题问什么情况下 a == 1 && a == 2 会成立。就是考的隐式转换

```js
a = { i: 1, toString() {return this.i++;}}
a == 1 && a == 2
a = { i: 1, valueOf() {return this.i++;}}
a == 1 && a == 2
```

参考：[什么情况下 a == 1 && a == 2，什么情况 a + 1 === a + 2 - 左小白的技术日常](http://www.zuo11.com/blog/2020/8/js_a1_a2.html)

### 条件操作符(isTrue?a:b)
也叫三目运算符, 判断是否为真?为真时执行:不为真时执行，注意加括号，防止复杂运算时优先级的问题导致逻辑异常

### 赋值运算符 =
算术运算符与赋值运算符结合使用，可以简化赋值操作，但不会带来任何性能提升

### 逗号操作符
用于在一条语句中执行多条操作
``` js
// 条件运算符 当 a > 3 时打印a>3，a小于3时打印a<3
(a>3)?console.log('a>3'):console.log('a<3');

// 赋值简化操作
a += 2; // a = a + 2;
a %= 2; // a = a % 2;

// 逗号运算符
var num = 1, num2 = 2, num3 = 3;
var num = (1, 2, 3, 4, 5); // 赋值时，取最后一个值

```

## 语句（流控制语句）
和其他语言一样，控制语句有if else, do-while, for, while，break，continue，switch等，这里只介绍需要注意的地方
- for-in 语句, ES5之前，对null和undefined使用for-in会报错，ES5之后改为不执行, 为保证兼容性，建议在遍历前,先判断对应的值是否为null或undefined
- for-in 遍历对象的属性是~~无序的，各浏览器的顺序可以不一样~~。
``` js
// for-in语句用来遍历一个对象
var k = new Object();
k.a = "2";
k.b = "hello";
for (var propName in k) { // propName可以是其他可用的关键字
    console.log(propName); // 逐个打印对象的属性，a、b
    console.log(k[propName]); // 打印属性对应的值
}
```

::: tip
在 JS高程4 中说 for...in 遍历是无序的，但实际是按一定规则来的：**首先遍历所有数值键，按照数值升序排列；其次遍历所有字符串键，按照加入时间升序排列；最后遍历所有 Symbol 键，按照加入时间升序排列；最后遍历继承自父元素的原型属性，按照先数值、再字符串的顺序。**
:::

参考：[深入JS遍历对象，从4个维度比较遍历对象的8种方法 - 左小白的技术日常](http://www.zuo11.com/blog/2020/2/js_obj_iterator.html)

- for-of 第四版新增，一般数组都可以使用 for...of 遍历的，而对象默认是不能使用 for...of 遍历的，需要自己实现对象的 Symbol.iterator 方法。常规使用 for...of 遍历对象，一般是使用 Object.keys/values/entries 等先把对象转数组，再使用 for...of 遍历。

![for-of_vs_for-in.png](/images/js/for-of_vs_for-in.png)

::: tip
for...of 与 for...in 的区别：在用法上，**for...of 用于遍历数组，而 for...in 用于遍历对象；for...of 可以遍历实现了 Symbol.iterator 方法的对象，for...in 可以遍历数组，遍历时数组 [a, b], 相当于对象 {0: a, 1: b}**。
:::
- with语句，可以将一段代码的作用域设置为特定的对象。严格模式下禁止使用，大量使用with语句会导致性能下降（会延长作用域链，导致查找时间变长），不建议使用with语句

```js
with (location) {
  console.log(hostname,href)
}
// 等价于
console.log(location.hostname, location.href)
```

::: tip
虽然不建议使用 with，但有些需要使用 with 的地方还是可以使用的。比如 Vue.js 的源码中就用到了 with。
:::

```js
// vue.js 源码
function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}
// ....
// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  var originalPreState = state.pre;
  if (el.pre) {
    state.pre = el.pre;
  }
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  state.pre = originalPreState;
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}
```

- 标签语句，第四版新增。用于给语句加标签。可以解决 for 循环中 break、continue 不能跳出多层嵌套的问题。

```js
let num = 0
outermost:
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    if (i === 5 && j === 5) {
      // break outermost // 中断最外层循环
      continue outermost // 继续最外层循环
    }
    num++
  }
}
console.log(num) // break outermost 55
console.log(num) // continue outermost 95
```

- switch 语句 比较的变量可以是任何数据类型, 比较时使用的是全等(===)比较, 不会出现类型比较
- 函数 函数与其他语言大致一致，传参方面，arguments变量记录了传入参数数组。严格模式下无法修改对应的值，传入的参数可多可少，不受函数定义时参数个数限制
- 不存在函数签名特性，ES函数无法重载，定义两个同名的函数，后面的会覆盖前面的
