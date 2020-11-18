---
title: 6. 集合引用类型 - JS高程4
description: 集合引用类型包括：Object、Array、定型数组(typed array)、Map、WeekMap、Set、WeekSet。Object 是 ES 中最常用的类型之一，可以使用 Object() 构造函数创建，也可以使用简写：字面量写法。推荐使用对象的字面量语法。MCAScript 中的数组 Array 是有序列表，和其他语言不同的是，它的每一项都可以保存任何数据类型。
keywords: Object,Array,定型数组(typed array),Map,WeekMap,Set,WeekSet
---

# 6. 集合引用类型

## Object 类型
Object 是 ES 中最常用的类型之一，可以使用 Object() 构造函数创建，也可以使用简写：字面量写法。推荐使用对象的字面量语法。
``` js
let person = new Object(); // 等价于 let person = {} 
peson.name = "zuo";
person.age = 29;

// 简写 对象字面量写法
let person = {
    name : "zuo",
    age: 20
}

// 访问对象属性 person.name 或 person["name"]  
// [] 里面可以是变量。可以含空格 ES6 对象的属性可以使用变量
```
第 8 章 对象、类与面向对象编程会更加全面、深入的介绍 Object 类型。

## Array 类型
EMCAScript 中的数组 Array 是有序列表，和其他语言不同的是，它的每一项都可以保存任何数据类型。创建数组有 4 种方法：
1. 使用 Arra() 构造函数创建 let arr = new Array(1, 2, 3) 或 new Array(100)
2. 使用数组字面量 let arr = [1, 2, 3]
3. Arrray.from() 将类似数组的对象转为数组，类似数组有字符串、set集合，可迭代(for...of)的对象等。
4. Arrray.of() 将一组参数转换为数组。
``` js
// 创建一个数组
let colors = new Array(); 
// 也可以 let colors = Array(20); 创建长度为 20 的元素的数组

// 构造函数中可以赋值
let colors = new Array("red", "green", "yellow");

// 省略new的写法
let colors = Array(3); // 等价于 new Array(3);
let names = Array("zuo");

//字面量写法
let colors = ["red", "green", "yellow"];
let names = [];
let values = [1,2,]; 
// 类似最后加,的写法不要有，IE8及之前的版本会创建3个元素，1,2,undefined，而其他浏览器创建两个
let values = [,,,,,]; // 同上

// 数组索引从 0 开始，0 到 arr.length -1, arr[0] ~ arr[arr.length - 1]
let colors = ["red", "green", "yellow"];
colors[99] = "black";  
alert(colors.length); // 数组长度会增长到100，中间填充undefined

// 手动修改colors.length = 104, 长度也会改变，中间填充undefined
```
Array.from 与 Array.of 是 ES6 新增的创建数组静态方法。这部分内容和 ES6 入门 有重复
```js
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};
// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']
let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']

// Array.from 第二个参数等价于在 转数组后，再执行数组的 map 操作
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]

Array.from({ length: 2 }, () => 'jack')
// ['jack', 'jack']

// from ES6 入门
// Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 Unicode 字符，可以避免 JavaScript 将大于\uFFFF的 Unicode 字符，算作两个字符的问题
let message = "ab😊de";
message.length // 6
function countSymbols(string) {
  return Array.from(string).length; // ["a", "b", "😊", "d", "e"]
}
countSymbols(message) // 5 
// 更精简的写法 
[...message].length // 5

// Array.of
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1

// 类似于
function ArrayOf(){
  return [].slice.call(arguments);
}
```

### 检测是否为数组
判断是否为数组一般有三种方法
1. **xx instanceof Array** ，它有一个缺点。当网页含有多个 frame 框架，会有两个不同版本的 Array 构造函数，会出现问题。
2. **Object.prototype.toString.call(xx)** 转换为 String 来判断数据类型。
3. **Array.isArray(xx)** ES6 新增，它不用管数组是在哪个执行上下文，建议使用。
```js
// 判断是否为数组，在进行后续操作
if (value instanceof Array) {
  // 对数组执行某些操作
}

if (Object.prototype.toString.call(value) === '[Object Array]') {
  //
}

Array.isArray(value) // 解决多个框架不同版本的Array构造函数问题
```
### Array 迭代器方法(遍历方法)
ES6 中，Array新增 3 个用于检索（遍历）数组内容的方法。keys() 是对数组索引(数组下标)的遍历、values() 是对键值的遍历，entries() 是对键值对的遍历。注意 keys()、values()、entries() 返回的是数组元素的迭代器（Array Iterator）。可以使用 for...of 遍历，或者先使用 Array.from 将他们转为真正的数组，再遍历。
```js
[1,2,3,4].keys()
// Array Iterator {}
// __proto__: Array Iterator
// next: ƒ next()
// Symbol(Symbol.toStringTag): "Array Iterator"
// __proto__: Object

let arr = ['a', 'b']
const arrKeys = Array.from(arr.keys()) //  [0, 1]
const arrValues = Array.from(arr.values()) // ["a", "b"]
const arrEntries = Array.from(arr.entries()) // [[0, "a"], [1, "b"]]

for (let index of ['a', 'b'].keys()) {  
  console.log(index);
}
// 0
// 1
for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'
for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```
### Array 复制和填充方法
ES6 新增，Array.fill() 与 Array.copyWithin()
- `fill(value[, startIndex[, endIndex]])` 填充 value 的内容从数组的 startIndex 开始 endIndex，如果没有传索引开始或结束，默认为全部。
- `copyWithin(insertIndex[, startIndex[, endIndex]])` 拷贝当前数组中 startIndex 到 endIndex 的内容，填充到当前数组 insertIndex 索引开始的位置，覆盖原数组内容。

这两个方法都会修改原数组内容，参数中对于索引过低、过高或反向的传参，均会忽略，不执行任何操作。
```js
const zeroes = [0, 0, 0, 0, 0];

// Fill the entire array with 5
zeroes.fill(5);
alert(zeroes);   // [5, 5, 5, 5, 5]
zeroes.fill(0);  // reset

// Fill all indices >=3 with 6
zeroes.fill(6, 3);
alert(zeroes);   // [0, 0, 0, 6, 6]
zeroes.fill(0);  // reset

// Fill all indices >= 1 and < 3 with 7
zeroes.fill(7, 1, 3);
alert(zeroes);   // [0, 7, 7, 0, 0]; 
zeroes.fill(0);  // reset

// Fill all indices >=1 and < 4 with 8
// (-4 + zeroes.length = 1)
// (-1 + zeroes.length = 4)
zeroes.fill(8, -4, -1);
alert(zeroes);   // [0, 8, 8, 8, 0];
```
注意：如果 fill 填充的是引用类型，那么他的没一个元素都是同一个地址，修改一个，会修改所有。参考：[Array.prototype.fill()填充引用类型值的问题 - 左小白的技术日常](http://www.zuo11.com/blog/2020/7/araay_fill.html)

```js
let ints,
    reset = () => ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset();

// Copy the contents of ints beginning at index 0 to the values beginning at index 5.
// Stops when it reaches the end of the array either in the source
// indices or the destination indices.
ints.copyWithin(5);
alert(ints);  // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
reset();

// Copy the contents of ints beginning at index 5 to the values beginning at index 0.
ints.copyWithin(0, 5);
alert(ints);  // [5, 6, 7, 8, 9, 5, 6, 7, 8, 9]
reset();

// Copy the contents of ints beginning at index 0 and ending at index 3 to values
// beginning at index 4.
ints.copyWithin(4, 0, 3);
alert(ints);  // [0, 1, 2, 3, 0, 1, 2, 7, 8, 9]
reset();

// The JS engine will perform a full copy of the range of values before inserting,
// so there is no danger of overwrite during the copy.
ints.copyWithin(2, 0, 6);
alert(ints);  // [0, 1, 0, 1, 2, 3, 4, 5, 8, 9]  
reset();

// Support for negative indexing behaves identically to fill() in that negative 
// indices are calculated relative to the end of the array
ints.copyWithin(-4, -7, -3);
alert(ints);  // [0, 1, 2, 3, 4, 5, 3, 4, 5, 6] 
```

### Array 转换方法
所有对象都有 toLocalString()、toString()、valueOf() 方法。数组的 valueOf() 返回数组本身。toString() 方法返回各个元素以逗号拼接的字符串。toLocalString() 会调用数组每个值的 toLocalString() 方法。
```js
let colors = ["red", "blue", "green"];
colors.toString(); // "red,blue,green"
colors.valueOf()); // [red, blue, green]  valueOf() 返回数组本身

// join()
alert(colors.join(",")); // red,blue,green
alert(colors.join("||")); // red||blue||green
```
::: tip
如果数组中的某一项是 null 或 undefined，则在 join()、toLocalString()、toString() 和 valueOf() 返回的结果中会以空字符串表示。
:::

### Array 栈方法
pop() 与 push(), 后进先出（LIFO，Last-In-First-Out）
```js
let colors = [];
let count = colors.push("red","green"); // colors.push("a") 再末尾添加元素，返回数组长度

let item = colors.pop(); // 取出最后一项, 返回其值
alert(item); // "green"
alert(colors.length); // 1
```
### Array 队列方法
shift() 和 push()，先进先出（FIFO，First-In-First-Out），shift() 与 pop() 类似，但每次移除的是数组的首个元素。unshift()可以在数组前端添加任意个元素。
```js
let colors = [];
let count = colors.push("red","green"); // 2

let item = colors.shift(); // 取出最前面一项, 返回其值
alert(item); // "red"
alert(colors.length); // 1

count = colors.unshift('a', 'b') // 返回数组长度 3
colors // ["a", "b", "green"]
```
### Array 排序方法
将数组反转可以使用 reverse()，排序使用sort(). 操作前需要注意，会直接改变原数组。

::: warning
sort() 在不传参数时，默认的情况下，会将数组的每一项转换为字符串在按从小到大的情况排序，排序数字时要特别注意
:::

```js
let values = [1, 2, 3, 4, 5];
values.reverse(); 
values // [5, 4, 3, 2, 1]

// sort() 在不传参数的情况下，会将数组的每一项转换为字符串在按从小到大的情况排序
let vals = [0, 1, 5, 10, 15];
vals.sort();
alert(vals); // 0, 1, 10, 15, 5 转换为字符串时 "5" > "10"

// 鉴于上面的bug，数组的排序sort可以自定义排序方式。需要传入对应的规则函数参数就
// value1 < value2   return -1 [value1, value2]  如果return 1; [value2,value1]
function compare(value1, value2) {
    if (value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
    // 可以简写问 return value1 - value2
}
vals.sort(compare); // 0,1,5,10,15

// 如果逆序，将 compare里-1和1互换 或 return value2 - value1

// 使用 ES6 箭头函数可以简写为
vals.sort((x,y) => x - y)
```
实际应用：如果有一个数组，元素都是对象。需要根据对象的 date 属性，按先后顺序排序。就可以用到自定义排序的功能

![5_0_自定义排序.png](/images/js/5_0_自定义排序.png)

### Array 操作方法（3个）
- concat() 合并多个数组, 字符串生成新数组, 不会影响原数组。注意：会将元素的没一项都扁平化。如果参数数 array 也会被展开。他是基于 Symbol.isConcatSpreadable 来决定是否扁平化数组，默认为 true，如果是 false，则不扁平化数组。
```js
let colors = ["red", "green"];
let colors2 = colors.concat(); // 直接创建了一个副本。
// 如果单纯的复制数组 colors2 = colors 那如果colors值变化，colors2也会变。

let colors3 = colors.concat("blue", ["yellow", "black"]);
alert(colors3); // red,green,blue,yellow,black

let newColors = ["a", "b"]
newColors[Symbol.isConcatSpreadable] = false
colors.concat("c", newColors) // ["a", "b", "green", "c", ["a", "b"]]
```
- slice() 取数组的某个一部分, 生成新数组，不影响原数组
```js
let colors= ["red", "green", "blue", "yellow", "purple"];
let colors2 = colors.slice(); // 创建副本，同colors.concat();

let colors3 = colors.slice(1);
let colors4 = colors.slice(1, 4);

alert(colors3); // green,blue,yellow,purple
alert(colors4); // green,blue,yellow

// slice里面的数如果是负数，等价与加上其数据长度的值 
// 包含5个元素的数组 slice(-2,-1) => 等价于 slice(3,4);
```
- splice() 删除、插入、替换数组元素，根据参数个数及值来执行对应的操作
```js
let colors = ["red", "green", "blue"];

// 删除数组元素
let removed = colors.splice(0,1); // 从第0个元素开始移除1个元素
alert(removed); // red
alert(colors); // green,blue

// 插入数组元素
removed = colors.splice(1, 0, "yellow", "orange"); // 从位置1开始插入两项，删除0项
alert(colors); // green,yellow,orange,blue
alert(removed); //  空

// 替换数组元素
removed = colors.splice(1, 1, "red", "purple"); // 从位置1开始删除一项，再插入两项
alert(colors); // green,red,purple,orange,blue
alert(removed); //  yellow
```

### Array 位置方法
- ES5 方法 indexOf(val[, startIndex]), lastIndexOf(val[, startIndex])，判断元素在数组中的位置, 有则返回索引 index，没有则返回 -1。他们比较时使用的是严格相等（===）
- ES6 方法 includes(val[, startIndex]) 返回 true 或 false，可以正确的判断 indexOf 不能判断的 NaN
```js
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
numbers.indexOf(2) // 判断元素2在数组中的位置 1
numbers.indexOf("2") // 对于不存在的返回 -1
numbers.lastIndexOf(2) // 7

[1, 2, NaN].includes(NaN) // true
[1, 2, NaN].indexOf(NaN) // -1
```
- find()、findIndex() 第四版新增，翻译为断言函数。用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。

```js
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;}
) // 10

// 数组实例的findIndex方法的用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;}
) // 2

// 这两个方法都可以接受第二个参数，用来绑定回调函数的 this 对象。
function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);    // 26

// 这两个方法都可以发现NaN，弥补了数组的indexOf方法的不足,indexOf方法无法识别数组的NaN成员，但是 findIndex 方法可以借助 Object.is 方法做到。
[NaN].indexOf(NaN)
// -1
[NaN].findIndex(y => Object.is(NaN, y))
// 0
```

### Array 迭代方法
ES5定义了5个迭代方法，每个方法都接收两个参数，运行函数及作用域对象(this)，IE9+支持
- 检测数组里的元素是否满足条件。every()、some() 返回Boolean值
  - every() 对数组的每一项运行给定函数，函数对每一项都返回true，则返回true
  - some() 对数组的每一项运行给定函数, 如果函数对数组的任一项返回的true，return true
- 只做遍历，不返回任何值 
  - forEach()  对数组的每一项运行给定函数, 不返回任何值，只做函数操作 类似于 for () { do something }
- 返回数组
  - filter()  对数组的每一项运行给定函数, 返回该函数会返回true的项组成的数组
  - map()  对数组的每一项运行给定函数, 返回每次函数调用结果组成的数组
```js
let numbers = [1,2,3,4,5];

let isGreaterThan2 = function (item, index, array) {
    return (item > 2)
};

let everyResult = numbers.every(isGreaterThan2);
let someResult = numbers.some(isGreaterThan2);
let filterResult = numbers.filter(isGreaterThan2);

alert(everyResult); // false   是否所有值都大于2
alert(someResult); // true 是否有一个值大于2
alert(filterResult); // [3,4,5]  返回所有大于2的项

let mapResult = numbers.map(function (item, index, array) {
    return (item * 2);
});
alert(mapResult); // [2,3,6,8,10] 返回每个元素执行完*2后的数组

numbers.foreach(function(item, index, array) {
  cosnole.log(item)  // 依次打印数组的值
})

```
### Array 归并方法
ES5新增了两个缩小数组的方法 reduce() 和 reduceRight(), 会迭代数组的所有项，然后构建一个最终返回的值。reduce 从数组的第一项开始，逐个遍历到最后。reduceRight 则从数组的最后一项开始，向前遍历到第一项。
- 该方法接收两个参数：一个在每一项上调用的函数，和（可选的）作为归并基础的初始值。
- 第一个参数的函数，接收4个参数：前一个值；当前值；项的索引；数组对象；这个函数返回的任何值，都会作为第一个参数传个下一项。第一次迭代发生在数组的第二项上，第一个参数是第一项，第二个参数为数组的第二项。
```js
// 一参的情况
let values = [1,2,3,4,5];
let sum = values.reduce(function(prev, cur, index, array) {
    console.log(prev, cur, index)
    return prev + cur;
});
// prev, cur, index
// 1 2 1
// 3 3 2
// 6 4 3
// 10 5 4

alert(sum); // 15

// 二参的情况，reduce二参为初识值，然后函数第一个参数为初识值，第二个参数为数组第一个元素，再依次遍历
let numbers = [15.5, 2.3, 1.1, 4.7];
// 四舍五入相加
numbers.reduce(function(prev, cur, index) {
  console.log(prev, cur, index)
  return prev + Math.round(cur);
}, 0)
// 0 15.5 0
// 16 2.3 1
// 18 1.1 2
// 19 4.7 3

// 计算数组中每个元素出现的次数
// MDN文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
let countedNames = names.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;
  }
  else {
    allNames[name] = 1;
  }
  return allNames;
}, {});
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

## 定型数组(typed array)
typed array 是 ES 新增的结构，目的是提升向原生库传输数据的效率。JS 中并没有 "TypedArray" 类型，它指的是一种特殊的包含数值类型的数组。

**typed array 历史**

在 WebGL 的早起版本中，JS 数组与原生数组之间不匹配，出现了性能问题。JS 数组中的数值存在内存中使用的是双精度浮点格式。图形驱动程序 API 通常不需要以双精度浮点格式传递数值。每次 WebGL 与 JS 运行时之间传递数据时，WebGL 都要先把数组里的数值转换为合适的格式再操作，消耗了很多时间。

Mozilla 为了解决这个问题，实现了 `CanvasFloatArray`，是 C 语言风格的浮点值数组。JS 可以使用这个类型分配、读取、写入数组。它可以直接传给底层图形驱动程序 API，也可以直接从底层获取到，最终 `CanvasFloatArray` 变成了 `Float32Array`，也就是今天定型数组中可用的第一个 "类型"。

**ArrayBuffer**，Float32Array 实际上是一种 "视图"，它允许 JS 运行时访问一块名为 ArrayBuffer 的预分配内存。ArrayBuffer 是所有定型数组及视图引用的基本单位。**ArrayBuffer 是一个普通的构造函数，可用于在内存中分配特定数量的字节空间**。

```js
// 在内存中分配 16 字节
const buf = new ArrayBuffer(16) // ArrayBuffer(16) {}
buf.byteLength // 16

let buf2 = buf.slice(4, 12) // 复制 4 ~ 12 索引内容
buf2.byteLength // 8
```
ArrayBuffer 创建后就不能再调整大小，可以使用 slice() 复制全部或部分内容到另一个新的实例中。它在某种程度上类似于 C++ 的 malloc()，在 JS 中它会有一些差异，比如分配失败时会直接报错，分配成功后会将所有的二进制位初始化为 0，分配的堆内存可以被当成垃圾回收，不用手动释放。

::: tip
不能直接读写 ArrayBuffer 实例，需要通过视图对 ArrayBuffer 读写。视图有不同的类型，但引用的都是 ArrayBuffer 中存储的二进制数据。
:::

### DataView 视图
DateView 是第一种允许读写 ArrayBuffer 的视图是 DataView。这个视图专门为文件 I/O 和 网络 I/O 设计。支持对缓冲数据的高度控制，相比其他类型的视图性能也差一些。

```js
const buf = new ArrayBuffer(16);

// DataView default to use the entire ArrayBuffer
// DataView 默认使用整个 ArrayBuffer
const fullDataView = new DataView(buf);
alert(fullDataView.byteOffset);      // 0
alert(fullDataView.byteLength);      // 16
alert(fullDataView.buffer === buf);  // true

// Constructor takes an optional byte offset and byte length
//  byteOffset=0 begins the view at the start of the buffer 视图从缓冲起点开始
//  byteLength=8 restricts the view to the first 8 bytes 限制视图为前 8 个字节
// 构造函数接收一个可选的字节偏移量和字节长度
const firstHalfDataView = new DataView(buf, 0, 8);
alert(firstHalfDataView.byteOffset);      // 0
alert(firstHalfDataView.byteLength);      // 8
alert(firstHalfDataView.buffer === buf);  // true

// DataView will use the remainder of the buffer unless specified 
//  byteOffset=8 begins the view at the 9th byte of the buffer 视图从第 9 个字节开始
//  byteLength default is the remainder of the buffer 未指定，默认为剩余缓冲
// 如果不指定，则 DataView 会使用后面的缓存区
const secondHalfDataView = new DataView(buf, 8);
alert(secondHalfDataView.byteOffset);      // 8
alert(secondHalfDataView.byteLength);      // 8
alert(secondHalfDataView.buffer === buf);  // true 
```
DataView 要读写 ArrayBuffer 还需要使用 ElementType 来实现 JS 的 Number 类型到缓冲区二进制格式的转换。例如

```js
const buf = new ArrayBuffer(2)
const view = new DataView(buf)
// 第一个字符和第二个字符二进制位都是 0
view.getInt8(0) // 0
view.getInt8(1) // 0
// 整个缓冲区 为 0 
view.getInt16(0) // 0

// 将整个缓冲区都设置为 1
view.setUint8(0, 255) // 11111111
view.setUint8(1, 0xFF) // 11111111

// 获取缓冲区内容
view.getInt16(0) // -1   // 11111111 被看成是负数的补码。
```

ElementType | 字节 | 说明 | 对应的 C 类型 | 值范围
--- | --- | --- | --- | ---
Int8 | 1 | 8 位有符号整数 | signed char | -128~127
Uint8 | 1 | 8 位无符号整数 | unsigned char | 0~255
Int16 | 2 | 16 位有符号整数 | short | -32768~32767
Uint16 | 2 | 16 位无符号整数 | unsigned short | 0~65535
Int32 | 4 | 32 位有符号整数 | int | 略
Uint32 | 4 | 32 位无符号整数 | unsigned int | 略
Float32 | 4 | 32 位 IEEE-754 浮点数 | float | 略
Float64 | 8 | 64 位 IEEE-754 浮点数 | double | 略

**字节序**，指的是一种字节顺序约定。DataView 支持两种约定：
1. 大端字节序，也叫网络字节序，第一个字节：最高有效位。最后一个字节：最低有效位。
2. 小端字节序，第一个字节：最低有效位，最后一个字节：最高有效位。

DataView 默认是大端字节序，接收一个可选的二参，设置为 true，则开启小端字节序
```js
const buf = new ArrayBuffer(2)
const view = new DataView(buf)
view.setUint8(0, 0x80)
view.setUint8(1, 0x01)
// 16 进制 0x80      0x01    
//  2 进制 1000 0000 0000 0001

// 0x80 是高字节，0x01 是低字节
// 按大端字节序取 Uint16 => 0x8001
view.getUint16(0) // 32769 = 2 ** 15 + 1

// 按小端字节序取 Uint16 => 0x0180
view.getUint16(0, true) // 384 = 2 ** 8 + 2 ** 7 

// 按大端字节序写入 Uint16
view.setUint16(0, 0x0004)
view.getUint8(0) // 0
view.getUint8(1) // 4

// 按小端字节序写入 Uint16
view.setUint16(0, 0x0002, true)
view.getUint8(0) // 2
view.getUint8(1) // 0
```
**边界情形**，如果 index 超出缓冲区内容，会直接报错：RangeError

### 定型数组
定型数组是另一种形式的 ArrayBuffer 视图，它特定于一种 ElementType，且遵循原生的字节序，API更多，性能更高。创建定型数组的方法：
1. 读取已有的缓冲，`new <ElementType>Array(new ArrayBuffer(字节数))`
2. 使用自有缓冲，`new <ElementType>Array(数组长度)`
3. 填充可迭代结构 `new  ElementType>Array(可迭代数组)`
4. 填充基于任意类型的定型数组 `new  ElementType>Array(定型数组)`
5. `<ElementType>.from()`
6. `<ElementType>.of()`
```js
// Creates a buffer of 12 bytes
const buf = new ArrayBuffer(12);
// Creates an Int32Array that references this buffer
// 1. 读取已有的缓冲
const ints = new Int32Array(buf);
// The typed array recognizes it needs 4 bytes per element,
// and therefore will have a length of 3
alert(ints.length);  // 3

// Creates an Int32Array of length 6
// 2. 使用自有缓冲
const ints2 = new Int32Array(6);
// Each number uses 4 bytes, so the ArrayBuffer is 24 bytes
alert(ints2.length);             // 6
// Like DataView, typed arrays have a reference to their associated buffer
alert(ints2.buffer.byteLength);  // 24

// Creates an Int32Array containing [2, 4, 6, 8]
// 3. 填充可迭代结构
const ints3 = new Int32Array([2, 4, 6, 8]); 
alert(ints3.length);             // 4
alert(ints3.buffer.byteLength);  // 16
alert(ints3[2]);                 // 6

// Creates an Int16Array with values copies from ints3
// 4. 填充基于任意类型的定型数组
const ints4 = new Int16Array(ints3);
// The new typed array allocates its own buffer, and each value
// is converted to its new representation at the same index 
alert(ints4.length);             // 4
alert(ints4.buffer.byteLength);  // 8
alert(ints4[2]);                 // 6 

// Creates an Int16Array from a normal array
// 5. <ElementType>.from()
const ints5 = Int16Array.from([3, 5, 7, 9]); 
alert(ints5.length);             // 4
alert(ints5.buffer.byteLength);  // 8
alert(ints5[2]);                 // 7 

// Creates a Float32Array from arguments
// 6. <ElementType>.of()
const floats = Float32Array.of(3.14, 2.718, 1.618); 
alert(floats.length);             // 3
alert(floats.buffer.byteLength);  // 12
alert(floats[2]);                 // 1.6180000305175781
```
定型数组的构造函数和实例都有一个 BYTES_PER_ELEMENT，表示每个元素所占的字节数
```js
alert(Int16Array.BYTES_PER_ELEMENT);  // 2
alert(Int32Array.BYTES_PER_ELEMENT);  // 4

const ints = new Int32Array(1),
      floats = new Float64Array(1);

alert(ints.BYTES_PER_ELEMENT);        // 4
alert(floats.BYTES_PER_ELEMENT);      // 8 
```
**定型数组行为** ，定型数组与普通数组很相似。定型数组支持以下操作符、属性、和方法
- `[]`
- `forEach()`、`map()`、`some()`、`every()`、`filter()`、`keys()`、`values()`、`entries()`、`fill()`、`slice()`、`reduce()` 等
```js
const ints = new Int16Array([1, 2, 3]);
const doubleints = ints.map(x => 2 * x);
alert(doubleints instanceof Int16Array);  // true
[...ints] // [1, 2, 3]
```
**合并、复制和修改定型数组**，定型数组使用数组缓冲来存储数据，而数组缓冲无法调整大小。因此像 concat()、push() 等方法不适用于定型数组。它提供了两个新方法，用于快速向外或向内复制数据：`set()` 和 `subarray()`
```js
// Create an int16 array of length 8
const container = new Int16Array(8);

// Copy in typed array into first four values
// Offset default to an index of 0
container.set(Int8Array.of(1, 2, 3, 4));
alert(container);  // [1,2,3,4,0,0,0,0]
// Copy in normal array into last four values
// Offset of 4 means begin inserting at the index 4
container.set([5,6,7,8], 4);
alert(container);  // [1,2,3,4,5,6,7,8]

// An overflow will throw an error
container.set([5,6,7,8], 7);
// RangeError 
```
subarray() 执行和 set() 相反的操作
```js
const source = Int16Array.of(2, 4, 6, 8);

// Copies the entire array into a new array of the same type
const fullCopy = source.subarray();
alert(fullCopy);  // [2, 4, 6, 8]

// Copy the array from index 2 on
const halfCopy = source.subarray(2);
alert(halfCopy);  // [6, 8]

// Copy the array from index 1 up until 3
const partialCopy = source.subarray(1, 3);
alert(partialCopy);  // [4, 6] 
```

**上溢和下溢（underflow与overflow）**

```js
// Signed ints array of length 2
// Each index holds a 2's complement signed integer which can
// range from -128 (-1 * 2^7) to 127 (2^7 – 1)
const ints = new Int8Array(2);

// Unsigned ints array of length 2
// Each index holds an unsigned integer which can range from
// 0 to 255 (2^7 – 1) 
const unsignedInts = new Uint8Array(2);

// Overflow bits will not spill into adjacent indices.
// The index only takes the least significant 8 bits
// 上溢不会影响相邻的索引，只会取最低有效位上的 8 位
unsignedInts[1] = 256;    // 0x100
alert(unsignedInts);      // [0, 0] 取 0x00
unsignedInts[1] = 511;    // 0x1FF
alert(unsignedInts);      // [0, 255] 取 0xFF

// Underflow bits will be converted to their unsigned equivalent.
// 0xFF is -1 as a 2's complement int (truncated to 8 bits), 
// but is 255 as an unsigned int 
// 下溢的位会被转换为其无符号的等价值 0xff -1的补码
unsignedInts[1] = -1  // 0xFF (truncated to 8 bits)
alert(unsignedInts);  // [0, 255]

// Overflow in 2's complement occurs transparently.
// 0x80 is 128 in unsigned int but -128 in 2's complement int
ints[1] = 128;   // 0x80
alert(ints);     // [0, -128]

// Underflow in 2's complement occurs transparently.
// 0xFF is 255 in unsigned int but -1 in 2's complement int
ints[1] = 255;  // 0xFF
alert(ints);    // [0, -1] 
```
除了 8 种元素类型，还有一种 "夹板" 数组类型：Uint8ClampedArray，不允许任何方向溢出，超过 255，即取 255，小于 0 取 0。它完全是 HTML5 Canvas 元素的历史遗存。除非真的做 canvas 开发相关，否则不要使用它。
```js
const clampedInts = new Uint8ClampedArray([-1, 0, 255, 256]);
alert(clampedInts);  // [0, 0, 255, 255]
```
## Map、WeakMap、Set、WeakSet
ES6 新增了 Map、WeakMap、Set、WeakSet 4 种引用类型。由于 ES6 入门有对应的内容，笔记重复。这里就不讲基础语法了。基础语法参见：[Set和Map数据结构 | ES6入门笔记](http://fe.zuo11.com/js/es6/es6-9.html)

### Map、WeakMap
**Map** 类似于 Object，是键值对的形式。Object 只能使用数值、字符串或符号作为键名，**Map 可以使用任何 JS 数据类型作为键，包括对象 undefined 等**

**选择 Object 还是 Map？** 选择 Object 还是 Map 只是个人偏好问题，影响不多。对于在乎内存和性能的开发者来说，对象和映射之间确实存在明显差异
- 内存占用，给定固定大小的内存，Map 大约可以比 Object 多存储 50%的键值对。
- 插入性能，Map一般会稍快，如果涉及大量的插入操作，选择 Map
- 查找速度，基本差不多，但 Object 会有一些优化，选择 Object 可能会好点。
- 删除性能，Map 的 delete() 操作比插入、查找更快。如果涉及大量的删除操作，选择 Map

**WeakMap 与 Map 的区别：**
1. WeakMap 只接受对象作为键名（null除外），不接受其他类型的值作为键名。
2. WeakMap 中键值对任何时候都可能被销毁。如果键对象被销毁或设置为 null，这个键值对就会在垃圾回收期间被清理。
3. WeakMap 不可迭代，没有clear() 方法。因为键值对随时可能被销毁。当 dom 节点作为键时，dom 节点销毁后，垃圾回收就可以立即释放其内存，减少内存开销。

### Set、WeakSet
**Set** 类似于数组，**但成员都是唯一的**，注意引用类型由于是地址，相同对象，不同的地址，也算是唯一，可以 转字符串之后再存入。

Set 与 WeakSet 的区别和 Map 与 WeakMap的区别基本一致。

## 迭代与扩展操作
即 for...of 和 ...，有四种原生集合类型内置了迭代器（Iterator）: Array，所有定型数组，Map，Set。基本和数组的迭代、扩展一致，代码略！