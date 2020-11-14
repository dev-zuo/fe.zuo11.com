# 6. 集合引用类型

## Object 类型
``` js
var person = new Object(); // 等价于 var person = {} 推荐对象的字面量语法只在考虑程序的可读性时使用
peson.name = "zuo";
person.age = 29;

// 简写 对象字面量写法
var person = {
    name : "zuo",
    age: 20
}

// 访问对象属性 person.name 或 person["name"]  []可以是变量。可以含空格，es6对象的属性可以使用变量
```
## Array 类型
EMCAScript中的数组Array是有序列表，但它的每一项都可以保存任何数据类型
``` js
// 创建一个数组
var colors = new Array(); // 也可以 var colors = Array(20); 创建长度为20的元素的数组

// 构造函数中可以赋值
var colors = new Array("red", "green", "yellow");

// 省略new的写法
var colors = Array(3); // 等价于 new Array(3);
var names = Array("zuo");

//字面量写法
var colors = ["red", "green", "yellow"];
var names = [];
var values = [1,2,]; //类似最后加,的写法不要有，IE8及之前的版本会创建3个元素，1,2,undefined，而其他浏览器创建两个
var values = [,,,,,]; // 同上

var colors = ["red", "green", "yellow"];
colors[99] = "black";  
alert(colors.lenght); // 数组长度会增长到100，中间填充undefined

// 手动修改colors.length = 104, 长度也会改变，中间填充undefined
```
### 检测是否为数组
```js
// 判断是否为数组，在进行后续操作
if (value instanceof Array) {
    // 对数组执行某些操作
}
// ES5之后可以用 Array.isArray(value) 来替代，解决多个框架不同版本的Array构造函数问题

```
### Array转换方法
所有对象都有toLocalString()、toString()、valueOf()方法。
```js
var colors = ["red", "blue", "green"];
alert(colors.toString()); // red,blue,green
alert(colors.valueOf()); // red,blue,green  valueOf()返回的函数数组
alert(colors); // red,blue,green

// join()
alert(colors.join(",")); // red,blue,green
alert(colors.join("||")); // red||blue||green
```
### Array栈方法
pop() 与 push(), 后进先出
```js
var colors = [];
var count = colors.push("red","green"); // colors.push("a") 再末尾添加元素，返回数组长度

var item = colors.pop(); // 取出最后一项, 返回其值
alert(item); // "green"
alert(colors.length); // 1
```
### Array队列方法
shift() 和 push()，先进先出, shift()与pop()类似，但每次移除的是数组的首个元素。unshift()可以在数组前端添加任意个元素。
### Array排序方法
将数组反转可以使用 reverse()，排序使用sort(). 操作前需要注意，会直接改变原数组。
```js
var values = [1,2,3,4,5];
values.reverse(); 
alert(values); // 5,4,3,2,1

// sort() 在不传参数的情况下，会将数组的每一项转换为字符串在按从小到大的情况排序
var vals = [0, 1, 5, 10, 15];
vals.sort();
alert(vals); // 0,1,10,15,5    //转换为字符串时 "5" > "10"

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
```
实际应用：如果有一个数组，元素都是对象。需要根据对象的date属性，按先后顺序排序。就可以用到自定义排序的功能
https://github.com/zuoxiaobai/foodDiary/blob/master/miniprogram/server/request.js?1566628181327

![5_0_自定义排序.png](/images/js/5_0_自定义排序.png)

### Array操作方法（3个）
- concat() 合并多个数组,字符串生成新数组,不会影响原数组
```js
var colors = ["red", "green"];
var colors2 = colors.concat(); // 直接创建了一个副本。
// 如果单纯的复制数组 colors2 = colors 那如果colors值变化，colors2也会变。

var colors3 = colors.concat("blue", ["yellow", "black"]);
alert(colors3); // red,green,blue,yellow,black
```
- slice() 取数组的某个一部分,生成新数组，不影响原数组
```js
var colors= ["red", "green", "blue", "yellow", "purple"];
var colors2 = colors.slice(); // 创建副本，同colors.concat();

var colors3 = colors.slice(1);
var colors4 = colors.slice(1,4);

alert(colors3); // green,blue,yellow,purple
alert(colors4); // green,blue,yellow

// slice里面的数如果是负数，等价与加上其数据长度的值 包含5个元素的数组 slice(-2,-1) => 等价于 slice(3,4);
```
- splice() 删除、插入、替换数组元素，根据参数个数及值来执行对应的操作
```js
var colors = ["red", "green", "blue"];

// 删除数组元素
var removed = colors.splice(0,1); // 从第0个元素开始移除1个元素
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

### Array位置方法
ES5的方法indexOf(),lastIndexOf()，判断元素在数组中的位置, IE8也支持
```js
var numbers = [1,2,3,4,5,4,3,2,1];
alert(numbers.indexOf(2)); // 判断元素2在数组中的位置   1
alert(numbers.indexOf("2")); // 对于不存在的返回-1
```

### Array迭代方法
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
var numbers = [1,2,3,4,5];

var isGreaterThan2 = function (item, index, array) {
    return (item > 2)
};

var everyResult = numbers.every(isGreaterThan2);
var someResult = numbers.some(isGreaterThan2);
var filterResult = numbers.filter(isGreaterThan2);

alert(everyResult); // false   是否所有值都大于2
alert(someResult); // true 是否有一个值大于2
alert(filterResult); // [3,4,5]  返回所有大于2的项

var mapResult = numbers.map(function (item, index, array) {
    return (item * 2);
});
alert(mapResult); // [2,3,6,8,10] 返回每个元素执行完*2后的数组

numbers.foreach(function(item, index, array) {
  cosnole.log(item)  // 依次打印数组的值
})

```
### Array归并方法
ES5新增了两个缩小数组的方法reduce()和reduceRight(), 会迭代数组的所有项，然后构建一个最终返回的值。reduce从数组的第一项开始，逐个遍历到最后。reduceRight则从数组的最后一项开始，向前遍历到第一项。
- 该方法接收两个参数：一个在每一项上调用的函数，和（可选的）作为归并基础的初始值。
- 第一个参数的函数，接收4个参数：前一个值；当前值；项的索引；数组对象；这个函数返回的任何值，都会作为第一个参数传个下一项。第一次迭代发生在数组的第二项上，第一个参数是第一项，第二个参数为数组的第二项。
```js
// 一参的情况
var values = [1,2,3,4,5];
var sum = values.reduce(function(prev, cur, index, array) {
    return prev + cur;
});
alert(sum); // 15

// 二参的情况，reduce二参为初识值，然后函数第一个参数为初识值，第二个参数为数组第一个元素，再依次遍历
var numbers = [15.5, 2.3, 1.1, 4.7];
// 四舍五入相加
numbers.reduce(function(total, num) {
  return total + Math.round(num);
}, 0)

// 计算数组中每个元素出现的次数
// MDN文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

var countedNames = names.reduce(function (allNames, name) { 
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

## 定型数组(typed array 类型化数组)

## Map、WeakMap、Set、WeakSet

## 迭代与扩展操作
