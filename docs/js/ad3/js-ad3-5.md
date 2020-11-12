---
title: 5. 基本引用类型 - JS高程4
description: 
keywords:
---

# 5. 基本引用类型

在 ECMAScript 中，**引用类型**是一种用于将数据和功能组织在一起的结构， 类似于类，可以简单的理解为**一种数据类型**。

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

## Date 类型
ECMAScript中的Date类型，使用的是UTC(Coordinated Universal，国际协调时间), 从1970年1月1日午夜0时开始经过的毫秒数来保存日期。
低于1970年的chrome/safari/Firefox解析的毫秒数为负数
```js
// 获取当前时间
var time = new Date();
var time2 = new Date(Date.UTC(2012,3)); // 年月日，没填的补0
var time3 = new Date(2012,3); // 等价于上面的。年月日，没填的补0

// ES5获取当前时间戳, 毫秒
var start = Date.now(); // 1519748501146
var startDate = new Date(start); // 转换为 Wed Feb 28 2018 00:24:38 GMT+0800 (CST)

// console 下执行
t = new Date();
t                // Tue Feb 27 2018 23:45:26 GMT+0800 (CST)
t.toDateString() // "Tue Feb 27 2018"
t.toGMTString()  // "Tue, 27 Feb 2018 15:45:26 GMT" 存在目的是为了向下兼容
t.toUTCString()  // "Tue, 27 Feb 2018 15:45:26 GMT", 与上面等价，推荐使用这个
t.toISOString()  // "2018-02-27T15:45:26.639Z"

t.toLocaleDateString() // "2018/2/27"
t.toLocaleTimeString() // "下午11:45:26"
t.toLocaleString()     // "2018/2/27 下午11:45:26"

t.getFullYear() // 2018 年
t.getMonth()    // 1 月份是0-11，要+1  2月
t.getDate()     // 27 日
t.getDay()      // 2 星期2
t.getHours()    // 23 时
t.getMinutes()  // 45 分
t.getSeconds()  // 26 秒

// 获取毫秒数
t.getTime() // 1519746326639
+t          // 1519746326639
```

## RegExp类型
RegExp类型是ES支持正则表达式的一个接口，提供了最基本的和一些高级的正则表示式功能。建议从解决实际问题的角度来理解，比如表单校验这一块，怎么去校验用户名、身份证号、手机号等？
- 正则表达式可视化工具: https://regexper.com/ 
- 参考: [看完你就会正则表达式了 - segmentfault](https://segmentfault.com/a/1190000009226796) 
### 语法
```js
// 字面量
var expression = /pattern/flags;
// 构造函数
var expresssion = new RegExp("pattern", "flags"); // 这里的pattern
// pattern 正则表达式的匹配模式
// flags 可选，正则表达式的标识，也可选多个。g全局匹配，i忽略大小写，m匹配多行，不填就是只匹配第一个,区分大小写
// g (glabal全局模式)、i (case-insensitive不区分大小写模式)、m (multiline多行模式)

// 字面量和构造函数是有区别的，for循环时，ES3里字面量定义的实例，总是一个，不向new那样每次创新新的实例。
// ES5中规定字面量和构造函数总是一样，每次都new一个新的实例
```
### 常用特殊字符

```js
字符集合
[]  [xyz] 匹配xyz中任意一个字符，等价于[x-z]
[^] [^xyz] 匹配任意不在xyz中的一个字符，等价于[^x-z] （注意与^x区分，后者表示匹配以x开头的字符）
[-]	[1-3]	匹配123中的任意一个字符，等价于[123]。注意：连字符只有出现在方括号中才表示连续的字符序列。

预定义模式 - 某些常用模式的简写
.	除\r和\n之外的任意字符，等价于[^\r\n]
\d	数字0-9，等价于[0-9]     
\D	非数字字符，等价于[^0-9]     
\w	// 字母数字下划线，等价于[A-Za-z0-9_]      /\w/.test('字符串')  看字符串里是否包含数字或字母或下划线
\W	// 非字母数字下划线，等价于[^A-Za-z0-9_]
\s	空白符
\S	非空白符
\n	换行符

需要转义的字符
* + ? $ ^ . | \ ( ) { } [ ]
需要特别注意的是，如果使用RegExp方法生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次。

边界
^	^a	以a开头（注意与[^]区分，后者表示匹配不在[^]中的元素）
$	a$	以a结尾
\b	// \bsmart，smart\b	单词边界，即[A-Za-z0-9_]之外的字符  --- ???
\B	// \Bsmart	非单词边界 --- ???

数量词
?	匹配前面的模式 0或1次 {0,1}
*	匹配前面的模式 0或多次 {0,}
+	匹配前面的模式 1或多次 {1,}
{n}	匹配前面的模式 n次
{n,}	匹配前面的模式 至少n次
{n,m) 匹配前面的模式 至少n次，至多m次
{0,m} 匹配前面的模式 至多m次
x(?=y) 
只有x后面紧跟着y时，才匹配x，但是y不是匹配结果的一部分。
例如/smart(?=girl)/只有后面有girl时，才匹配smart，但是girl不是匹配结果的一部分。
x(?!y)	
只有x后面不紧跟着y时，才匹配x。
例如/\d+(?!\.)/只有一个数字后面没有紧跟着小数点时才会匹配该数字，/\d+(?!\.)/.exec("3.141")匹配结果是141。

| 将两个或多个可选的项目分隔开，任何一个满足条件就能形成匹配 

// 贪婪与懒惰(非贪婪)
// 默认是贪婪模式匹配，即匹配尽可能多的字符。
var regExp1 = /\d{3,6}/;
"1234567890".replace(regExp1, "X");
//"X7890"

// 若想手动开启懒惰模式，需要在模式后加 ?
var regExp1 = /\d{3,6}?/;
"1234567890".replace(regExp1, "X");
//"X4567890"

// 分组与反向引用
//无分组
var regExp1 = /abc{2}/; //这样量词{2}只能匹配到c一个字符

//分组
var regExp2 = /(abc){2}/; //这样量词{2}就可以匹配到abc三个字符啦 
//同时 abc 也有了一个组号 $1
```
### RegExp实例属性和方法
- 实例属性
global:布尔值，是否设置了g标志；ignoreCase: 是否设置了i标志；multiline: 是否设置了m标志;
lastIndex(开始搜索的位置,整数,从0开始)、source(匹配模式，返回字面量字符串)等
- 实例方法
主要是 exec(), RegExpObject.exec(string). 如果exec()找到了匹配的文本，则返回一个结果数组。否则，返回 null。
此数组的第 0 个元素是与正则表达式相匹配的文本，第 1 个元素是与 RegExpObject 的第 1 个子表达式相匹配的文本（如果有的话），
第 2 个元素是与 RegExpObject 的第 2 个子表达式相匹配的文本（如果有的话），以此类推。
除了数组元素和 length 属性之外，exec() 方法还返回两个属性。index 属性声明的是匹配文本的第一个字符的位置。input 属性则存放的是被检索的字符串 string。
多次使用exec()，如果不设置g标志，每次都是从最开始找起，设置g后，会接着上一次的地方开始找
```js
// exec()
var exepress = /a/; // 如果匹配模式中没有捕获组，返回的数组只有一项
var matches = exepress.exec("abcabc");
alert(matches[0]); // "a"
alert(matches.index); // 0
alert(matches.input); // "a"

// exec() 匹配模式多个捕获组
var express2 = /a (and b (and c)?)?/g;
var matches2 = pattern.exec("a and b and c");
alert(matches2.index); // 0
alert(matches2.input); // "a and b and c"
alert(matches2[0]);    // "a and b and c"
alert(matches2[1]);    // "and b and c"
alert(matches2[2]);    // "and c"

// test() 测试字符串是否匹配该实例 
var text = "000-00-0000";
var pattern = /\d{3}-\d{2}-\d{4}/;
alert(pattern.test(text)); // true

// toStinrg() 会返回对应的字面量字符串
```
### 字符串对象方法
str.replace(); // 根据正则，返回替换后的值
```js
var reg = "\d{2}";
var str = "1sss23sss456";
alert(str.replace(reg, "?")); // "1sss?sss456" 

// 消除收尾多余的空格
var str2 = "   abc def ggg   ";
var reg2 = /\s/g;
var reg3 = /^\s+|\s+$/g; // 匹配多个以空格开头/多个以空格结尾的字符
str2.replace(reg2, ""); // abcdefggg  清除所有空格
str2.replace(reg3, ""); // "abc def ggg"

```
str.match(); 返回匹配的子字符串数组
```js
var reg = /\d{2}/g;
var str = "1sss23sss456";
str.match(reg); // ["23","45"];
```
str.search(); 查找匹配的首字符的位置, 没有返回-1
```js
var reg = /\d{2}/;
var str = "1sss23sss456";
str.search(reg); //4
```
str.split();  返回分割后的数组
```js
var reg = /\d{2}/;
var str = "1sss23sss456";
str.split(reg); //["1sss","sss","6"]
```
### 练习
- 1.写一个匹配手机号的正则（第一位是1，第二位是[3,4,5,7,8]中的一个，后面还有9位数字），为了防止新增的号码，如199等号段，第二位建议所有都加上，所以只匹配1+10个数字
- 2.写一个匹配 2017-01-01 或 2017/01/01 这两种格式日期的正则表达式
答案：
```js
// 1.
/^1\d{10}$/
// 2.
/^\d{4}[-/]\d{2}[-/]\d{2}$/
```
表单输入校验等
```js
// 正则表达式校验
// 1.校验用户名是否输入正确，只能是数字、字母、下划线、且以字母开头
var a1 = /^[a-z]\w{7,11}$/;   // 以小写字母开头，后面的字符需要为数字字母下划线，最低8位，最多12位
a1.test('aB0_');a1.test('aB0_444');   // true

var a2 = /^[a-zA-Z][0-9a-zA-Z_]{5,9}$/; // 以字母开头，只能是数字、字母下划线，长度6-10位， $标记结束用来校验长度
// 等价于 /^[a-zA-Z]\w{5,9}$/

// 2.校验邮箱格式是否正确  xxx@domail.com
var b1 = /^[a-zA-Z1-9]\w*@/;  // 校验开头的部分，必须以字母或数字开头
var b2 = /^[a-zA-Z1-9]\w*@[a-z1-9]([a-zA-Z0-9\.])+\.[a-z]{2,3}$/;
// 先判断以字母或数字开头，不能是0，再匹配数字、字母下划线0-n次，再匹配一个@符号，再匹配一个字符串和数字，再匹配数字、字母、. 一次或多次，
// 再匹配一个.，再匹配小写字符串2到3个

// 3.校验手机号格式是否正确
// 手机号的前三位需要用到或 |
var c1 = /(13[0-9]|14[5-9]|15[012356789]|16[6]|17[0135678]|18[0-9]|19[8-9])\d{8}$/; // c1.test('1113500000000') true
// 前三位匹配 130-139或者145-149或...，后面再匹配8个数字
// 正解, 需要以130等开头    ex: var cn = /2[0-5]?/; cn.test('12'); // true  注意只要有匹配的就true
var c2 = /^(13[0-9]|14[5-9]|15[012356789]|16[6]|17[0135678]|18[0-9]|19[8-9])\d{8}$/;

// 4.简单校验身份证号格式是否正确  18位，第一位不为0，最后一位可以是X  [暂时不校验地区、日期、最后一位计算值]
var c4 = /^[1-9]\d{16}[0-9X]$/;

// 5.校验ip地址是否正确
var d1 = /^((1\d{0,2})|(2[0-5]?[0-5]?)|(2\d))$/;
// 1,10-19或100-199 | 2，20-25，200-255  |  20-29   还差3-9，30-99
var d2 = /^((1\d{0,2})|(2[0-5]?[0-5]?)|(2\d)|([3-9][0-9]?))$/; // 1-255
// 0-255
var d3 = /^(0|(1\d{0,2})|(2[0-5]?[0-5]?)|(2\d)|([3-9][0-9]?))$/;
// IP地址  第一位1-255，后面三个  .(0-255)
var d4 = /^((1\d{0,2})|(2[0-5]?[0-5]?)|(2\d)|([3-9][0-9]?))(.(0|(1\d{0,2})|(2[0-5]?[0-5]?)|(2\d)|([3-9][0-9]?))){3}$/;

// 6.校验密码是否满足要求  不低于6位必须同时包含数字字母及符号
// 英文字符 [`~!@#\$%\^&\*\(\)-_=\+\[\]\{\}\|\\;:'",<\.>/?]  // 有些要转义的字符签名加了\
var e1 = /[`~!@#\$%\^&\*\(\)-_=\+\[\]\{\}\|\\;:'",<\.>/?]/;
var e2 = /\d/;
var e3 = /a-zA-Z/;
var estr = "xxx";
if((estr.length >= 6) && e1.test(estr) && e2.test(estr) && e3.test(estr)) {
    // true   
}

// 7.校验姓名格式是否正确     \u4E00-\u9FA5   2-4个中文字符
var f1 = /^[\u4E00-\u9FA5]{2,4}$/;

// 8.校验地址是否正确    中文、数字、字母,不低于10位
var g1 = /^([\u4E00-\u9FA5]|\w){10,50}$/;


// 正则表达式替换、过滤
// 1.过滤掉字符串里面的 特殊字符，如果只允许输入中文、数字、或英文字母
var istr = "xxx";
var i1 = /[^(\u4E00-\u9FA5)0-9a-zA-Z]/g;
str.replace(i1,'');

// 2.将数据库text字段内容里面的 zuo11.com 全部替换为 jstomp.com
var i2str = "xxx";
var i2 = /zuo11.com/g;
i2str.replace(i2,'jstomp.com');
```
### 应用
使用正则改变数据结构
```js
var re = /(\w+)\s(\w+)/;
var str = "John Smith";
var newstr = str.replace(re, "$2, $1");
console.log(newstr); //Smith, John
```
在多行中使用正则
```js
var s = "Please yes\nmake my day!";
s.match(/yes.*day/); // null
s.match(/yes[^]*day/); //'yes\nmake my day'
```

## Function 类型
函数的声明可以写在后面，但如果函数的声明位于初始化语句中，需要先初始化再使用函数的内部属性 arguents 和 this，arguments.callee指向拥有arguments对象的函数(ES5严格模式下不支持arguments.callee)
```js
// 利用构造函数来创建一个function, 最后一个参数被当做函数体，前面的为参数
// 函数是对象，函数名是指针。不推荐使用，会影响性能
var sum = new Function("num1", "num2", "return num1+num2");
sum(1,2); // 3

// 计算阶层
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
关于this，谁调用函数，谁就是函数中的this
```js
window.color = "red";
var o = { color: "blue"};

function showColor() {
    alert(this.color);
}

showColor(); // red，这里是全局对象window调用的函数，this指向window

o.showColor = showColor;
o.showColor(); // blue, this是 o对象

// arguments.caller、arguments.callee.caller、函数名.caller 严格模式都不支持   
```
### 函数的属性和方法
每个函数都包含两个属性 length和prototype, length等于函数参数的个数，每个函数都包含两个非继承而来的方法 apply()和call(), 都可以指定函数执行的this，扩充函数作用域
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

## 基本包装类型
### Boolean类型
true，false是基本的数据类型，而Boolean创建的实例是引用类型
```js
var falseObj = new Boolean(false); // false对象
var falseValue = false; // false 值

// 对象永远都是true，尽管其值为false
if (falseObj) {  // 建议永远不要使用new Boolean()，会造成歧义
    // 这里为真
}

alert(typeof falseObj); // object
alert(typeof falseValue); // bollean

alert(falseValue instanceof Boolean); // false
alert(falseObj instanceof Boolean); // true
```
### Number类型
基础的number类型，toFixed()方法可以四舍五入小数 
```js
var numObj = new Number(10); // 可以用构造函数赋值, 与非对象的区别类似于Boolean
var num = 10.005;
alert(num.toFixed(2)); // 保留两位小数 10.01

alert(num.toExponential()); // 转换为指数 1.005e+1

// 表达某个数值最合适的方式
// toPrecision() 会根据具体要处理的数值决定用toFied()还是toExponential()
var num = 99;
alert(num.toPrecision(1)); // 1e+2
alert(num.toPrecision(2)); // "99"
alert(num.toPrecision(3)); // "99.0"
```

### String类型
```js
var strObj = new String("hello world");
var strValue = "hello world";

// - 字符串属性 length
alert(strValue.length); // 11

// - 字符方法  charAt()
strValue.charAt(1); // 字符串位置1处的字符 "e"，等价于 strValue[1]
// IE7 及以下不支持 strValue[]语法，这个是ES5的，IE8及其他都支持

var str = "hello ";
str.concat("world","!"); // hello world!, 不改变str的值，生成新的字符串

// - 截取部分字符串 slice() substring() substr()
str.slice(3);     // "lo world"
str.substring(3); // "lo world"
str.substr(3);    // "lo world"

str.slice(3,7);     // "lo w
str.substring(3,7); // "lo w" // 不包括7
str.substr(3,7);    // "lo wor" // 第二个参数为从后面取7个

// 上面三个函数当传值时负数时，等价于字符串长度+负数
// IE8在处理substr负数时会有问题，返回原始字符串，IE9修护了这个问题

// - 位置方法 indexOf() lastIndexOf()(从字符串末尾开始搜索)
str.indeOf("o");      // 4
str.lastIndexOf("o"); // 7

str.indexOf("o", 6);     // 7  从第6个位置开始，搜索
str.lastIndexOf("o", 6); // 4  从第6个位置开始，反向搜索

// - ES5删除前后置空格 trim(), IE8不支持，IE9支持
var str2 = "  hello world   "; 
alert(str2);        // "  hello world   "
alert(str2.trim()); // "hello world";

// - 比较字符串 localeCompare() 
var str3 = "423"; 
str3.localCompare("345");  // "345" < "423"   1
str3.localCompare("445");  // "445" > "423"  -1, 相等则为0

// - 构造函数方法 将一个或多个字符编码转成字符串 fromCharCode()
String.fromCharCode(48,65,97,98); // "0Aab"
"0Aab".charCodeAt(2); // 97

// -HTML 方法 link(url)、anchor()尽量不要使用，创建的标记通常无法表达语义
var str4 = "hello world";
str4.anchor("myAnchor");  // <a name="myAnchor">hello world</a>
str4.bold(); // <b>hello world</b>"
var url = "zuo11.com"; 
str4.link(url); // <a href="zuo11.com">hello world</a>
```

## 单体内置对象
内置对象不依赖宿主环境对象，这些对象在ECMAScript程序执行之前就已经存在了。如Object、Array、String
ECMA-262还定义了两个单体内置对象: Global、Math
### Global对象
```js   
// 1. URI编码方法 encodeURL() 和 encodeURLComponent  
// URI (Uniform Resource Identifiers，统一资源标识符) 在某个规则下把资源独一无二的标识出来
// URL (Uniform Resource Locator，同一资源定位符) URL是用定位的方式实现的URI。
// 区别详情参见: https://www.zhihu.com/question/21950864/answer/154309494

// 由于有效的URI不能包含某些字符，如空格。这两个函数可以对URI进行编码，以便发送给浏览器
var uri = "http://www.zuo11.com/test value.html#start";
encodeURI(url); // "http://www.zuo11.com/test%20value.html#start"  只转义空格
encodeURIComponent(url); // "http%3A%2F%2Fwww.zuo11.com%2Ftest%20value.html%23start" 
// encodeURI只转义空格, encodeURIComponent()会转义所有的非字母数字字符

// 解码"http://www.zuo11.com/test value.html#start"
// 只解码空格
decodeURI("http://www.zuo11.com/test%20value.html#start");
// 解码非数字字母字符
decodeURIComponent("http%3A%2F%2Fwww.zuo11.com%2Ftest%20value.html%23start");

// 2.eval() 方法，像是一个完整的ES解析器，只接收一个参数，即要执行的JS字符串
eval("alert('123')") // alert("123");
eval("var msg = 'hello'");
alert(msg); // hello

// 3.Global对象的属性
// undefined、NaN、Infinity等，ES5 禁止给 undefined\NaN\Infinity赋值

// 4.window对象
// JS中window对象除了扮演ES规定的Global对象角色外，还承担了很多别的任务如BOM
```
### Math对象
ES为保存数学公式和信息提供了Math对象。与js直接编写的计算功能相比，Math对象提供的功能执行会快得多
```js
// 1. Math对象的属性 PI,E,SQRT2等
Math.PI // π 的值， 3.141592653589793

// 2. min()和max() // 最大值，最小值
var max = Math.max(3, 54, 32, 16); // max 54
var min = Math.min(3, 54, 32, 16); // min 3
var numArr = [3, 54, 32, 16];
Math.min.apply(Math, numArr); // 3 

// 3. 舍入方法 ceil()、round()、floor()
// 向上取整
Math.ceil(25.9); // 26
Math.ceil(25.5); // 26
Math.ceil(25.1); // 26
// 标准四舍五入
Math.round(25.9); // 26
Math.round(25.5); // 26
Math.round(25.1); // 25
// 向下取整
Math.floor(25.9); // 25
Math.floor(25.5); // 25
Math.floor(25.1); // 25

// 4. random() // 随机方法
// Math.random() 会返回0~1之间的随机数，不包括0，1
Math.round(Math.random()*5); // 取0-5之间的随机数
Math.round(Math.random()*8 + 2); // 取 0-8之间的随机数+2 就是2-10之间

// 5. 其他方法 Math.abs() 取绝对值等
```