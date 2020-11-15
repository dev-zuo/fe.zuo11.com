---
title: 5. 基本引用类型 - JS高程4
description: 对象是某个特定引用类型的实例。在 ECMAScript 中，引用类型是一种用于将数据和功能组织在一起的结构，类似于类，可以简单的理解为一种数据类型。引用类型一般都有对应的 构造函数（constructor），通过 new 操作符后面加一个构造函数可以创建对应引用类型的实例。
keywords: 基本引用类型,原始值包装类型,单例内置对象等
---

# 5. 基本引用类型

对象是某个特定引用类型的实例。在 ECMAScript 中，**引用类型** 是一种用于将数据和功能组织在一起的结构，类似于类，可以简单的理解为 **一种数据类型**。

引用类型一般都有对应的 **构造函数（constructor）**，通过 `new` 操作符后面加一个构造函数可以创建对应引用类型的 **实例**。

```js
let now = new Date()
```

上面的代码创建了引用类型 Date 的一个新实例，并将它保存在变量 now 中。 这里面 Date() 就是构造函数。

函数 `Function` 也是一种引用类型，由于函数内容较多，第四版将对应的内容移动到了第 10 章 函数。

## Date 类型
ECMAScript 中的 Date 类型，使用的是 UTC（Universal Time Coordinated ，协调世界时）, 从 1970 年 1 月 1 日午夜 0 时至今所经过的毫秒数。低于 1970 年的时间解析的毫秒数为负数。

**UTC 与 GMT 有什么区别？**
1. GMT（Greenwich Mean Time 格林尼治标准时间）**是老的时间计量标准**。是根据地球的自转和公转来计算时间，也就是太阳每天经过位于英国伦敦郊区的皇家格林威治天文台的时间就是中午 12 点。
2. UT：Universal Time 世界时。根据原子钟计算出来的时间。世界上最精确的原子钟 50 亿年才会误差 1 秒
3. UTC：Coordinated Universal Time 协调世界时。因为地球自转越来越慢，每年都会比前一年多出零点几秒，每隔几年协调世界时组织都会给世界时 +1 秒，让基于原子钟的世界时和基于天文学（人类感知）的格林尼治标准时间相差不至于太大。并将得到的时间称为 UTC，**这是现在使用的世界标准时间**。

GMT 并不等于 UTC，而是等于 UTC+0，只是格林尼治刚好在0时区上。GMT = UTC+0

参考：[UTC 和 GMT 什么关系？| 知乎](https://www.zhihu.com/question/27052407)


new Date() 时如果不传任何参数，默认为获取当前时间。要基于其他时间或日期创建日期对象，需要传对应的毫秒数(时间戳)。为此 ECMAScript 提供了两个辅助方法：Date.parse() 与 Date.UTC()

**Date.parse("时间字符串")**，将对应的时间字符串转为毫秒数。**new Date("时间字符串") 等价于 new Date(Date.parse("时间字符串"))**

```js
let time = new Date(); // 获取当前时间
// "年-月-日" 默认为 08:00:00 加了中国时区 8 小时
let time2 = Date.parse('2020-10-10') // 1602288000000 
// "月/日/年" 默认为 00:00:00 没有加中国时区 8 小时
let time3 = Date.parse('10/10/2020') // 1602259200000
// "月名 日, 年" 默认为 00:00:00
let time4 = Date.parse('Oct 10, 2020') // 1602259200000

new Date(time2)
// Sat Oct 10 2020 08:00:00 GMT+0800 (中国标准时间)
new Date(time3)
// Sat Oct 10 2020 00:00:00 GMT+0800 (中国标准时间)
new Date(time4)
// Sat Oct 10 2020 00:00:00 GMT+0800 (中国标准时间)

let time = new Date(Date.parse('2020-10-10'))
// 等价于
let time = new Date('2020-10-10')
```

**Date.UTC(年, 0起点月, 日, 时, 分, 秒, 毫秒)**，返回对应时间的毫秒数。**new Date(年, 月, 日) 基本等价于 new Date(Date.UTC(年, 月, 日))**，注意 new Date(年,月,日) 返回的是本地日期，不是 

```js
let time2 = new Date(Date.UTC(2012,3)); // 年月日，没填的补0
let time3 = new Date(2012,3); // 等价于上面的。年月日，没填的补0
```

**Date.now()** 获取当前日期时间毫秒数，可以用于计算代码耗时。

```js
let start = Date.now(); // 1519748501146
doSomething()
let stop = Date.now(),
    result = stop - start; // doSomething 执行时间
```
Date 类型重写了 toLocaleString()、toString()、valueOf() 方法
```js
new Date('2020-10-10').toString()
// "Sat Oct 10 2020 08:00:00 GMT+0800 (中国标准时间)"
new Date('2020-10-10').toLocaleString()
// "2020/10/10 上午8:00:00"

// valueOf() 返回的不是字符串，是毫秒数
new Date('2020-10-10').valueOf() // 1602288000000
// 因此比较大小时，可以直接使用对应的返回值
new Date('2020-10-10') < new Date('2020-10-11') // true
```
Date类型有几个专门用于格式化日期的方法，都会返回字符串
```js
// console 下执行 （CST，中国标准时间）
t = new Date();  // Tue Feb 27 2018 23:45:26 GMT+0800 (CST) 
t.toDateString() // "周名 月名 日 年"，例如 "Tue Feb 27 2018"
t.toTimeString() // "时:分:秒 时区"，例如 "23:45:26 GMT+0800 (CST)"
t.toLocaleDateString() // "2018/2/27"
t.toLocaleTimeString() // "下午11:45:26"
t.toGMTString()  // "Tue, 27 Feb 2018 15:45:26 GMT" 存在目的是为了向下兼容
t.toUTCString()  // "Tue, 27 Feb 2018 15:45:26 GMT", 与上面等价，推荐使用这个
t.toISOString()  // "2018-02-27T15:45:26.639Z"
```
上面的时间字符串因浏览器显示差异不推荐在用户界面上显示。页面如果显示时间，推荐下面的方法。
```js
t.getFullYear() // 返回 4 位数年，2018 
t.getMonth()    // 月份、0-11，要+1 , 0 表示 1 月
t.getDate()     // 日、27 
t.getDay()      // 周几的数值，0周日，6周六。2 星期2
t.getHours()    // 23 时
t.getMinutes()  // 45 分
t.getSeconds()  // 26 秒
t.getMilliseconds() // 毫秒
t.getTimezoneOffset() // -480 返回以分钟计的 UTC 与本地时区的偏移量

// 获取毫秒数
t.getTime() // 1519746326639
t.valueOf() // 1519746326639
+t          // 1519746326639
```
::: tip
- Date 实例还可以设置对应的时间。getFullYear()、getMonth() 分别对应 setFullYear()、setMonth()
- 默认获取的时间是当地时间，是有时区偏移的。方法中间加 UTC 可以获取没有时区偏移的时间。比如 getUTCFullYear()、getUTCMonth()
:::

## RegExp 类型
ES 通过 RegExp (regular expression) 类型来支持正则表达式。建议从解决实际问题的角度来理解，比如表单校验这一块，怎么去校验用户名、身份证号、手机号等。
- 正则表达式可视化工具: https://regexper.com/ 
- 参考: [看完你就会正则表达式了 - segmentfault](https://segmentfault.com/a/1190000009226796) 

**基本语法**
```js
// 字面量
let expression = /pattern/flags;
// 构造函数
let expresssion = new RegExp("pattern", "flags"); // 这里的pattern
// pattern 正则表达式的匹配模式
// flags 可选，正则表达式的标记，也可选多个。
```
flags 标记用于控制正则表达式的行为。flags 可选值如下：
- `g` glabal 全局匹配，查找字符串全部内容，而不是找到第一个匹配的内容就结束。
- `i` case-insensitive 不区分大小写，匹配时忽略大小写。
- `m` multiline 多行模式，找到到一行文本末尾后继续查找。
- `y` sticky 粘附模式，只查找 lastIndex 开始及之后的字符串
- `u` Unicode 模式，启用 Unicode 匹配
- `s` dotAll 模式，表示元字符 . 匹配任何字符（包括 \n 或 \r）

```js
// Match all instances of "at" in a string.
// 匹配字符串中所有的 "at"
let pattern1 = /at/g;
         
// Match the first instance of "bat" or "cat", regardless of case.
// 匹配第一个 "bat" 或 "cat"，忽略大小写
let pattern2 = /[bc]at/i;
         
// Match all three-character combinations ending with "at", regardless of case.
// 匹配所有以 "at" 结尾的三字符组合，忽略大小写
let pattern3 = /.at/gi;
```
匹配模式中如果包含元字符（正则表达式内部使用的一些字符），必须要在前面加一个反斜杠（ \ ）来转义。
```js
// 需要转义的字符
* + ? $ ^ . | \ ( ) { } [ ]

// Match the first instance of "bat" or "cat", regardless of case.
let pattern1 = /[bc]at/i;
         
// Match the first instance of "[bc]at", regardless of case.
let pattern2 = /\[bc\]at/i;
         
// Match all three-character combinations ending with "at", regardless of case.
let pattern3 = /.at/gi;
         
// Match all instances of ".at", regardless of case.
let pattern4 = /\.at/gi;
```
::: warning 
需要特别注意的是，如果使用非字面量，RegExp 构造函数来生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次。
:::

```js
let pattern2 = /\[bc\]at/i;
// 等价于 
let pattern2 = new RegExp("\\[bc\\]at", "i");
```

### 正则表达式常用字符（扩展）
在书中，没有讲正则表达式的一些基础字符。下面是在其他地方收集整理的相关资料
```js
边界
^	^a	以a开头（注意与[^]区分，后者表示匹配不在字符集合中的元素）
$	a$	以a结尾
\b	// 单词边界 单词和符号之间的边界
\B	// 非单词边界 单词与单词,符号与符号之间的边界
// 参考：详解正则表达式中的\B和\b https://blog.csdn.net/qq_33248299/article/details/53559924

字符集合
[]  [xyz] 匹配xyz中任意一个字符，等价于[x-z]
[^] [^xyz] 匹配任意不在xyz中的一个字符，等价于[^x-z] （注意与^x区分，后者表示匹配以x开头的字符）
[-]	[1-3]	匹配123中的任意一个字符，等价于[123]。注意：连字符只有出现在方括号中才表示连续的字符序列。

预定义模式 - 某些常用模式的简写
.	除\r和\n之外的任意字符，等价于[^\r\n]
\d	数字0-9，等价于[0-9]     
\D	非数字字符，等价于[^0-9]     
\w	// 字母数字下划线，等价于[A-Za-z0-9_] /\w/.test('字符串')  看字符串里是否包含数字或字母或下划线
\W	// 非字母数字下划线，等价于[^A-Za-z0-9_]
\s	空白符
\S	非空白符
\n	换行符

数量词
?	匹配前面的模式 0或1次 {0,1}
*	匹配前面的模式 0或多次 {0,}
+	匹配前面的模式 1或多次 {1,}
{n}	匹配前面的模式 n 次
{n,} 匹配前面的模式 至少n次
{n,m} 匹配前面的模式 至少n次，至多m次
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
let regExp1 = /\d{3,6}/;
"1234567890".replace(regExp1, "X");
//"X7890"

// 若想手动开启懒惰模式，需要在模式后加 ?
let regExp1 = /\d{3,6}?/;
"1234567890".replace(regExp1, "X");
//"X4567890"

// 分组与反向引用
//无分组
let regExp1 = /abc{2}/; //这样量词{2}只能匹配到c一个字符

//分组
let regExp2 = /(abc){2}/; //这样量词{2}就可以匹配到abc三个字符啦 
//同时 abc 也有了一个组号 $1
```

### RegExp 实例的属性和方法
**实例属性** 
- `global` 布尔值，是否设置了 g 标志
- `ignoreCase` 是否设置了 i 标志
- `unicode` 是否设置了 u 标志
- `sticky` 是否设置了 y 标志
- `lastIndex` 整数，开始搜索的位置, 始终从 0 开始
- `multiline` 是否设置了 m 标志
- `dotAll` 是否设置了 s 标志
- `source` 正则表达式的匹配模式字面量字符串（不是传给构造函数的字符串）。没有开头和结尾的斜杠。
- `flags` 正则表达式的标记字符串

**实例方法** 主要是 `exec()` 方法. 如果找到了匹配的文本，则返回一个结果数组。否则，返回 null。

```js
let exepress = /a/; // 如果匹配模式中没有捕获组，返回的数组只有一项
let matches = exepress.exec("abcabc");
alert(matches[0]); // "a"
alert(matches.index); // 0
alert(matches.input); // "a"
```
返回的结果 matches 数组的第 0 个元素是与正则表达式相匹配的文本。如果包含子表达式匹配，第 1 个元素是与 RegExpObject 的第 1 个子表达式相匹配的文本，第 2 个元素是与 RegExpObject 的第 2 个子表达式相匹配的文本，以此类推。

除了数组元素和 length 属性之外，exec() 方法还返回两个属性。
- index 属性声明的是匹配文本的第一个字符的位置
- input 属性则存放的是被检索的字符串 string

```js
// exec() 匹配模式多个捕获组
let express2 = /a (and b (and c)?)?/g;
let matches2 = pattern.exec("a and b and c");
alert(matches2.index); // 0
alert(matches2.input); // "a and b and c"
alert(matches2[0]);    // "a and b and c"
alert(matches2[1]);    // "and b and c"
alert(matches2[2]);    // "and c"
```

多次使用exec()，如果不设置 g 标志，每次都是从最开始找起，设置 g 后，会接着上一次的地方开始找。下面是不使用 g 标志的示例
```js
// 
let text = "cat, bat, sat, fat";    
let pattern = /.at/;
         
let matches = pattern.exec(text);    
console.log(matches.index);       // 0
console.log(matches[0]);          // cat
console.log(pattern.lastIndex);   // 0
         
matches = pattern.exec(text);    
console.log(matches.index);       // 0
console.log(matches[0]);          // cat
console.log(pattern.lastIndex);   // 0 
```
使用 g 标志
```js
let text = "cat, bat, sat, fat";    
let pattern = /.at/g;
         
let matches = pattern.exec(text);    
console.log(matches.index);       // 0
console.log(matches[0]);          // cat
console.log(pattern.lastIndex);   // 3
         
matches = pattern.exec(text);    
console.log(matches.index);       // 5
console.log(matches[0]);          // bat
console.log(pattern.lastIndex);   // 8
         
matches = pattern.exec(text);    
console.log(matches.index);       // 10
console.log(matches[0]);          // sat
console.log(pattern.lastIndex);   // 13
```
使用 y 粘附标志，每次调用 exex() 只会在 lastIndex 的位置上寻找匹配项，y 标记覆盖全局标记
```js
let text = "cat, bat, sat, fat";    
let pattern = /.at/y;
         
let matches = pattern.exec(text);    
console.log(matches.index);       // 0
console.log(matches[0]);          // cat
console.log(pattern.lastIndex);   // 3
         
// There is no match starting at character index 3, so exec() will return null
// exec() finding no matches resets lastIndex to 0
matches = pattern.exec(text);    
console.log(matches);             // null
console.log(pattern.lastIndex);   // 0

// Advancing lastIndex will allow a sticky regex exec() to find the next match:
pattern.lastIndex = 5; 
matches = pattern.exec(text);    
console.log(matches.index);       // 5
console.log(matches[0]);          // bat
console.log(pattern.lastIndex);   // 8
```
**test() 方法**，接收一个字符串参数，如果输入的文本与模式匹配，返回 true。
```js
// test() 测试字符串是否匹配该实例 
let text = "000-00-0000";
let pattern = /\d{3}-\d{2}-\d{4}/;
alert(pattern.test(text)); // true
```
toStinrg()、toLocalString 都会返回对应的字面量字符串。valueOf() 会返回字面量本身，不是字符串
```js
a = /a/ 
a.valueOf() // /a/
a.toString() // "/a/"
a.toLocaleString() // "/a/"
```

::: warning 
RegExp 构造函数的所有属性都没有任何 Web标准出处，因此不要用于生产环境。所以这部分笔记未整理。
:::

### 练习（扩展）
1. 写一个匹配手机号的正则（第一位是1，第二位是 [3,4,5,7,8] 中的一个，后面还有 9 位数字），为了防止新增的号码，如 199 等号段，第二位建议所有都加上，所以只匹配 1+10 个数字
2. 写一个匹配 2017-01-01 或 2017/01/01 这两种格式日期的正则表达式
```js
// 1.
/^1\d{10}$/
// 2.
/^\d{4}[-/]\d{2}[-/]\d{2}$/
```
表单输入校验等
```js
// 正则表达式校验
// 校验用户名是否输入正确，只能是数字、字母、下划线、且以字母开头
let a1 = /^[a-z]\w{7,11}$/;   // 以小写字母开头，后面的字符需要为数字字母下划线，最低8位，最多12位
a1.test('aB0_');a1.test('aB0_444');   // true

let a2 = /^[a-zA-Z][0-9a-zA-Z_]{5,9}$/; // 以字母开头，只能是数字、字母下划线，长度6-10位， $标记结束用来校验长度
// 等价于 /^[a-zA-Z]\w{5,9}$/

// 校验邮箱格式是否正确  xxx@domail.com
let b1 = /^[a-zA-Z1-9]\w*@/;  // 校验开头的部分，必须以字母或数字开头
let b2 = /^[a-zA-Z1-9]\w*@[a-z1-9]([a-zA-Z0-9\.])+\.[a-z]{2,3}$/;
// 先判断以字母或数字开头，不能是0，再匹配数字、字母下划线0-n次，再匹配一个@符号，再匹配一个字符串和数字，再匹配数字、字母、. 一次或多次，
// 再匹配一个.，再匹配小写字符串2到3个

// 简单校验身份证号格式是否正确  18位，第一位不为0，最后一位可以是X  [暂时不校验地区、日期、最后一位计算值]
let c4 = /^[1-9]\d{16}[0-9X]$/;

// 校验ip地址是否正确
let d1 = /^((1\d{0,2})|(2[0-5]?[0-5]?)|(2\d))$/;
// 1,10-19或100-199 | 2，20-25，200-255  |  20-29   还差3-9，30-99
let d2 = /^((1\d{0,2})|(2[0-5]?[0-5]?)|(2\d)|([3-9][0-9]?))$/; // 1-255
// 0-255
let d3 = /^(0|(1\d{0,2})|(2[0-5]?[0-5]?)|(2\d)|([3-9][0-9]?))$/;
// IP地址  第一位1-255，后面三个  .(0-255)
let d4 = /^((1\d{0,2})|(2[0-5]?[0-5]?)|(2\d)|([3-9][0-9]?))(.(0|(1\d{0,2})|(2[0-5]?[0-5]?)|(2\d)|([3-9][0-9]?))){3}$/;

// 校验密码是否满足要求  不低于6位必须同时包含数字字母及符号
// 英文字符 [`~!@#\$%\^&\*\(\)-_=\+\[\]\{\}\|\\;:'",<\.>/?]  // 有些要转义的字符签名加了\
let e1 = /[`~!@#\$%\^&\*\(\)-_=\+\[\]\{\}\|\\;:'",<\.>/?]/;
let e2 = /\d/;
let e3 = /a-zA-Z/;
let estr = "xxx";
if((estr.length >= 6) && e1.test(estr) && e2.test(estr) && e3.test(estr)) {
    // true   
}

// 校验姓名格式是否正确\u4E00-\u9FA5 2-4个中文字符
// 不适用对于少数名族有 · 的情况
let f1 = /^[\u4E00-\u9FA5]{2,4}$/;

// 校验地址是否正确    中文、数字、字母,不低于10位
let g1 = /^([\u4E00-\u9FA5]|\w){10,50}$/;


// 正则表达式替换、过滤
// 过滤掉字符串里面的 特殊字符，如果只允许输入中文、数字、或英文字母
let istr = "xxx";
let i1 = /[^(\u4E00-\u9FA5)0-9a-zA-Z]/g;
str.replace(i1,'');

// 将数据库text字段内容里面的 zuo11.com 全部替换为 jstomp.com
let i2str = "xxx";
let i2 = /zuo11.com/g;
i2str.replace(i2,'jstomp.com');
```
### 应用（扩展）
使用正则改变数据结构
```js
let re = /(\w+)\s(\w+)/;
let str = "John Smith";
let newstr = str.replace(re, "$2, $1");
console.log(newstr); //Smith, John
```
在多行中使用正则
```js
let s = "Please yes\nmake my day!";
s.match(/yes.*day/); // null
s.match(/yes[^]*day/); //'yes\nmake my day'
```

## 原始值包装类型(基本包装类型)
为了方便操作原始值，ES 提供了 3 种特殊的引用类型：Boolean、 Number、String。来看一个例子
```js
let s1 = "some text"
let s2 = s1.substring(2)
```
理论上，原始值本身不是对象，逻辑上是不能有属性、方法的。这里第 2 行可以正常执行。后台进行了一些处理
1. 临时创建一个 String 类型的实例 `let t = new String("some text")`
2. 调用实例上的特定方法 `s2 = t.substring(2)`
3. 销毁实例 `t = null`

这种行为可以让原始值拥有对象的行为。对布尔值和数值而言，以上三步也会在后台发生。只是使用的是 Boolean 和 Number 包装类型而已。

引用类型和原始值包装类型的主要区别在于对象的生命周期，引用类型的实例会在离开作用域时销毁。而自动创建的原始值包装对象，只存在于访问它的那行代码执行期间。来看一个例子
```js
let s1 = "some text"
s1.color = "red"
console.log(s1.color) // undefined
```
### Boolean 类型
Boolean 类型是对应布尔值的引用类型。true，false 是基本的数据类型，而 Boolean 创建的实例是引用类型。Boolean 引用类型重写了 valueOf()方法，返回一个原始值 false 或 true。toString() 也重写了，返回字符串 "true" 或 "false"
```js
let falseObj = new Boolean(false); // false 对象
let falseValue = false; // false 值

// 对象永远都是true，尽管其值为false
if (falseObj) {  // 建议永远不要使用new Boolean()，会造成歧义
  // 这里为真
}

alert(typeof falseObj); // object
alert(typeof falseValue); // bollean

alert(falseValue instanceof Boolean); // false
alert(falseObj instanceof Boolean); // true
```

### Number 类型
Number 是数值的引用类型。Number类型重写了 valueOf() 返回对应的原始数值。toLocalString() 与 toString() 都返回对应的字符串。toString() 方法可以接收一个可选的参数，执行数值的进制。
```js
let num = 10
num.toString() // "10"
num.toString(2) // "1010"
num.toString(8) // "12"
num.toString(10) // "10"
num.toString(16) // "a"
```
- `toFixed()` 方法返回包含指定小数点位数的数值字符串。可以用于处理货币，0.1 + 0.2 = 0.30000000000000004 的情况就需要舍入了。 
- `toExponential()` 方法可以将数值转换为科学计数法(也叫指数计数法)。
- `toPrecision(几位数表示)` 方法会返回对应数值最适当的形式。根据具体要处理的数值决定用toFied()还是toExponential()
```js
let numObj = new Number(10); // 可以用构造函数赋值, 与非对象的区别类似于Boolean
let num = 10.005;
alert(num.toFixed(2)); // 保留两位小数 10.01
alert(num.toExponential()); // 转换为指数 1.005e+1

// toPrecision() 会根据具体要处理的数值决定用toFied()还是toExponential()
let num = 99;
alert(num.toPrecision(1)); // 1e+2 用 1 位数表示 99 时
alert(num.toPrecision(2)); // "99" 用 2 位数表示 99 时
alert(num.toPrecision(3)); // "99.0" 用 3 位数表示 99 时
```
- `isInteger()` 判断是否为整数
- `isSafeInteger()` 是否是安全整数， Munber.MIN_SAFE_INTEGER（-2 ** 53 + 1 到 2 ** 53 - 1）
```js
console.log(Number.isInteger(1));     // true
console.log(Number.isInteger(1.00));  // true
console.log(Number.isInteger(1.01));  // false

Number.isSafeInteger(2 ** 53 -1) // true
Number.isSafeInteger(2 ** 53) // false
Number.isSafeInteger((-2) ** 53 + 1) // true
Number.isSafeInteger((-2) ** 53) // false
```

### String 类型
String 是字符串的引用类型。每个 String 对象都有一个 length 属性，表示字符串中字符的数量。
```js
let strObj = new String("hello world");
let strValue = "hello world";
strValue.length; // 11
```
**JavaScript 字符**，JS 字符由 16 位码元(code unit) 组成。对字符来说，每 16 位码元对应一个字符。charAt() 方法可以返回指定索引位置的字符。

```js
let strValue = "abcde";
strValue.charAt(2); // 字符串位置 1 处的字符 "c"，等价于 strValue[1]
```
JS 字符串使用了两种 Unicode 编码混合的策略：UCS-2 和 UTF-16。对于可以采用 16 位编码的字符 (U+0000 ~ U+FFFF) 这两种编码是一样的。使用 charCodeAt() 可以获取指定字符的字符编码。formCharCode() 可以根据 code 获取拼接起来的字符串。
```js
let strValue = "abcde";
// Unicode "Latin small letter C" 的编码是 U+0063
strValue.charCodeAt(2); // c 99 ，16进制为 0x63

String.fromCharCode(0x61, 0x62, 0x63, 0x64, 0x65) // "abcde"
String.fromCharCode(97, 98, 99, 100, 101) // "abcde"
```
对于 U+0000 ~ U+FFFF，使用 length、chartAt()、charCodeAt()、fromCharCode() 返回的结果和预期的都一样。因为在这个范围内每个字符都是 16 位，但 16 位只能表示 65536 个字符，对大多数语言字符集来说足够了，在 Unicode 中称为 **基本多语言平面(BMP)**，**但是为了支持更多的字符，有的字符会使用两个 16 位表示，即 32 位，也称为 "代理对"**，这种情况就会有问题了。比如 "😊" 这个字符串。

```js
// The "smiling face with smiling eyes" emoji is U+1F60A
// 0x1F60A === 128522
let message = "ab😊de";
message.length          // 6
message.charAt(1);      // b
message.charAt(2);      // ? 乱码
message.charAt(3);      // ? 乱码
message.charAt(4);      // d

message.charCodeAt(1);  // 98
message.charCodeAt(2);  // 55357
message.charCodeAt(3);  // 56842
message.charCodeAt(4);  // 100

String.fromCodePoint(0x1F60A);  // 😊

String.fromCharCode(97, 98, 55357, 56842, 100, 101); // ab😊de
```
为正确的解析 16位 、32 位字符可以使用  codePointAt() 代替 charCodeAt()
```js
let message = "ab😊de";

console.log(message.codePointAt(1));  // 98
console.log(message.codePointAt(2));  // 128522
console.log(message.codePointAt(3));  // 56842 
console.log(message.codePointAt(4));  // 100

console.log([..."ab😊de"]);  // ["a", "b", "😊", "d", "e"]

String.fromCharCode(97, 98, 55357, 56842, 100, 101) // ab😊de
String.fromCodePoint(97, 98, 128522, 100, 101) // ab😊de
```
**normalize() 方法**，对于某些 Unicode 字符，可能有多种编码方式，即可以使用 BMP 的 16位表示，也可以使用代理对 32 位表示。
```js
// U+00C5: Latin capital letter A with ring above
// 上面带圆圈的大写拉丁字母 A
console.log(String.fromCharCode(0x00C5));          // Å
// U+212B: Angstrom sign 长度单位 "埃"
console.log(String.fromCharCode(0x212B));          // Å
// U+0041: Latin captal letter A 大写拉丁字母A
// U+030A: Combining ring above 上面加圆圈
console.log(String.fromCharCode(0x0041, 0x030A));  // Å
```
上面三个编码都是同样的字符，在使用 === 比较时 会出现不一相等的情况
```js
let a1 = String.fromCharCode(0x00C5),
    a2 = String.fromCharCode(0x212B),
    a3 = String.fromCharCode(0x0041, 0x030A);

console.log(a1, a2, a3);  // Å, Å, Å

console.log(a1 === a2);  // false
console.log(a1 === a3);  // false
console.log(a2 === a3);  // false
```
为了解决这个问题，Unicode 提供了 4 种规范化形式：`NFD`、`NFC`、`NFKD`、`NFKC` 使用 normalize(规范化形式) 可以对字符进行规范化，选择同一种规范会形式，=== 就正常了
```js
let a1 = String.fromCharCode(0x00C5),
    a2 = String.fromCharCode(0x212B),
    a3 = String.fromCharCode(0x0041, 0x030A);

a1.normalize('NFD') === a2.normalize('NFD') // true
a2.normalize('NFKC') === a3.normalize('NFKC') // true
a1.normalize('NFC') === a3.normalize('NFC') // true
```

**字符串方法**

- 字符串操作方法，不修改原字符串
  - `concat()` 连接字符串 "a".concat("b") => "ab", "a".concat("b", "c“) => "abc"，基本等价于字符串向加 "+"
  - `slice(start[, end])` 提取字符串，从 start 索引开始，到 end 索引结束（不包含 end 索引位置字符）
  - `substring(start[, end])` 提取字符串，从 start 索引开始，到 end 索引结束（不包含 end 索引位置字符）
  - `substr(start[, num])` 提取字符串，从 start 索引开始，向后取 num 个字符
  ```js
  let str = "hello ";
  str.concat("world", "!"); // "hello world!", 不改变str的值，生成新的字符串

  // - 截取部分字符串 slice() substring() substr()
  str.slice(3);     // "lo world"
  str.substring(3); // "lo world"
  str.substr(3);    // "lo world"

  str.slice(3, 7);     // "lo w
  str.substring(3, 7); // "lo w" // 不包括7
  str.substr(3, 7);    // "lo worl" // 第二个参数为从后面取7个

  // 上面三个函数当传值时负数时，等价于字符串长度 + 负数
  // IE8在处理 substr 负数时会有问题，返回原始字符串，IE9 修护了这个问题
  ```
- 字符串位置方法，用于在字符串中定位子字符串，找到了返回对应的索引 index，没找到返回 -1（~-1 = 0，判断是否等于 -1，**!~值**）
  - `indexOf(str[, startIndex])` 判断 str 在 字符串中的位置索引
  - `lastIndexOf(str[, startIndex])` 从字符串末尾开始搜索，判断 str 在字符串中的位置
  ```js
  // "hello world!"
  str.indeOf("o");      // 4
  str.lastIndexOf("o"); // 7

  str.indexOf("o", 6);     // 7  从第6个位置开始，搜索
  str.lastIndexOf("o", 6); // 4  从第6个位置开始，反向搜索
  ```
- 字符串包含方法，第四版，ES6 新增方法，用于判断一个字符串是否在另一个字符串中
  - `includes(str[, startIndex])` 是否包含某个字符串
  - `startsWith(str[, startIndex])` 是否以某个字符串开头
  - `endsWith(str[, endIndex])` 是否以某个字符串结尾
  ```js
  let message = "foobarbaz";
  console.log(message.startsWith("foo"));  // true
  console.log(message.endsWith("baz"));    // true
  console.log(message.includes("bar"));    // true
  console.log(message.includes("qux"));    // false

  console.log(message.startsWith("foo", 1));  // false
  console.log(message.includes("bar"));       // true
  console.log(message.includes("bar", 4));    // false
  ```
- 其他字符串方法，不修改原字符串
  - `trim()` 去掉首尾空格 ES5，
  - `repeat(字符串复制次数)` ES6 复制字符串多少次，返回对应的副本。
  - `padStart(num[, 填充字符])` ES6 复制字符串到 num 长度的新字符串，如果不够将填充字符(如果没传就是空格)填充到字符串开始部分。
  - `padEnd(num[, 填充字符])` ES6 复制字符串到 num 长度的新字符串，如果不够将填充字符(如果没传就是空格)填充到字符串结束部分。
  - `localeCompare(str[, locales])`，比较两个字符串在字母表中的顺序，字符串排在 str 前面返回 1，排在 str 后面返回 -1。相等返回 0 。区分大小写英文字母，以大写字母在前。第二个参数可以传语言，比如 "ch"， 可以对中文按首字母进行排序，参考 [js使用localeCompare函数对中文进行首字母排序](http://fe.zuo11.com/daily/2020-10.html#js%E4%BD%BF%E7%94%A8localecompare%E5%87%BD%E6%95%B0%E5%AF%B9%E4%B8%AD%E6%96%87%E8%BF%9B%E8%A1%8C%E9%A6%96%E5%AD%97%E6%AF%8D%E6%8E%92%E5%BA%8F)
  ```js
  let str2 = "  hello world   "; 
  str2.trim() // "hello world";
  let stringValue = "foo";

  console.log(stringValue.padStart(6));       // "   foo"
  console.log(stringValue.padStart(9, "."));  // "......foo" 
  console.log(stringValue.padEnd(6));         // "foo   "
  console.log(stringValue.padEnd(9, "."));    // "foo......"

  let stringValue = "yellow";   
  console.log(stringValue.localeCompare("brick"));  // 1
  console.log(stringValue.localeCompare("yellow")); // 0
  console.log(stringValue.localeCompare("zoo"));  // -1

  ['中文zw', '啊啊啊aaa', '猜猜猜ccc'].sort((a, b) => a.localeCompare(b, 'ch'))
  //  ["啊啊啊aaa", "猜猜猜ccc", "中文zw"]
  ```
- 字符串大小写转换，不会改变原字符串
  - toLocaleUpperCase() 带地域的 转大写字母
  - toUpperCase() 转大写字母
  - toLocaleLowerCase() 带地域的 转小写字母
  - toLowerCase() 转小写字母
  ```js
  let stringValue = "hello world";
  console.log(stringValue.toLocaleUpperCase());  // "HELLO WORLD"
  console.log(stringValue.toUpperCase());        // "HELLO WORLD"
  console.log(stringValue.toLocaleLowerCase());  // "hello world"
  console.log(stringValue.toLowerCase());        // "hello world"
  ```
- 字符串模式匹配
  - match(pattern) 返回匹配的子字符串数组
  - search() 查找匹配的首字符的位置, 没有返回 -1
  - replace() 替换字符串
  - split() 返回分割后的数组
  ```js
  // match
  let reg = /\d{2}/g;
  let str = "1sss23sss456";
  str.match(reg); // ["23","45"];

  // search
  let reg = /\d{2}/;
  let str = "1sss23sss456";
  str.search(reg); // 4

  // replace
  let reg = "\d{2}";
  let str = "1sss23sss456";
  alert(str.replace(reg, "?")); // "1sss?sss456" 
  // 消除收尾多余的空格
  let str2 = "   abc def ggg   ";
  let reg2 = /\s/g;
  let reg3 = /^\s+|\s+$/g; // 匹配多个以空格开头/多个以空格结尾的字符
  str2.replace(reg2, ""); // abcdefggg  清除所有空格
  str2.replace(reg3, ""); // "abc def ggg" 清楚首尾空格

  let re = /(\w+)\s(\w+)/;
  let str = "John Smith";
  let newstr = str.replace(re, "$2, $1");
  console.log(newstr); //Smith, John

  // split
  let reg = /\d{2}/;
  let str = "1sss23sss456";
  str.split(reg); //["1sss","sss","6"]
  ```
- 快速生成HTML字符串方法
  - "hello world".anchor("myAnchor") => `<a name="myAnchor">hello world</a>`
  - "hello world".bold() => `<b>hello world</b>`
  - "hello world".link(url) => `<a href="url">hello world</a>`
  - "hello world".fontcolor(color) => `<font color="color">hello world</font>`
  ```js
  // HTML 方法 link(url)、anchor()尽量不要使用，创建的标记通常无法表达语义
  let str4 = "hello world";
  str4.anchor("myAnchor");  // `<a name="myAnchor">hello world</a>`
  str4.bold(); // `<b>hello world</b>`
  let url = "zuo11.com"; 
  str4.link(url); // `<a href="zuo11.com">hello world</a>`
  srt4.fontcolor("red") // `<font color="red">hello world</font>`
  ```
- 字符串迭代与解构
  ```js
  let message = "abc";
  let stringIterator = message[Symbol.iterator]();

  console.log(stringIterator.next());  // {value: "a", done: false}
  console.log(stringIterator.next());  // {value: "b", done: false}
  console.log(stringIterator.next());  // {value: "c", done: false}
  console.log(stringIterator.next());  // {value: undefined, done: true}

  for (const c of "abcde") {
    console.log(c);
  }
  // a b c d e

  let msg = "abcde"
  [...msg] // ["a", "b", "c", "d", "e"]
  ```

## 单例内置对象（单体内置对象）
内置对象不依赖宿主环境对象，这些对象在 ECMAScript 程序执行之前就已经存在了。如 Object、Array、String
ECMA-262还定义了两个单例内置对象: Global、Math

### Global 对象
Global 对象是 ES 中最特别的对象，代码不会显式的访问它，是一个兜底对象。针对的是不属于任何对象的属性和方法。全局变量和函数，都是 Global 对象的属性。包括 isNaN、isFinite()、parseInt()、parseFloat 等。Global 对象上还有另外一些方法，这里来看 URL 编码方法。

URI编码方法 `encodeURL()` 和 `encodeURLComponent()`, URI 编码方法一般有3种类型的字符

字符类型(中) | 字符类型(英) | 包含 | encodeURI | encodeURIComponent
---|---|---|---|---
URI保留字符 | Reserved Characters | `;,/?:@&=+$#` | 不转义 | 转义(escaped)
非转义字符 | Unreserved Marks or Alphanumeric Characters | `-_.!~*'()`以及数字(0-9)、字母(a-zA-Z) | 不转义 | 不转义
空格等其他字符/中文等 | space or other character etc | " 中文？"等其他字符 | 转义 | 转义

- encodeURI 不会编码 URI 保留字符/非转义字符，只会对空格等其他字符(如中文字符，中文等)进行编码  
- encodeURIComponent 不会编码非转义字符，URI保留字符和其他字符都会编码 

encodeURI 与 encodeURIComponent 的区别是：encodeURIComponent 会对 URI 保留字符进行编码，而 encodeURI 则不会，其他逻辑基本一致。 更多细节参考：[为什么有效的URI不能包含空格等其他字符，URI编码方法详解 - 左小白的技术日常](http://www.zuo11.com/blog/2020/9/uri.html)

```js
// URI (Uniform Resource Identifiers，统一资源标识符) 在某个规则下把资源独一无二的标识出来
// URL (Uniform Resource Locator，同一资源定位符) URL是用定位的方式实现的URI。
// 区别详情参见: https://www.zhihu.com/question/21950864/answer/154309494

// 由于有效的URI不能包含某些字符，如空格。这两个函数可以对URI进行编码，以便发送给浏览器
let uri = "http://www.zuo11.com/test value.html#start";
encodeURI(url); // "http://www.zuo11.com/test%20value.html#start"  只转义空格
encodeURIComponent(url); // "http%3A%2F%2Fwww.zuo11.com%2Ftest%20value.html%23start" 
// encodeURI只转义空格中文字符, encodeURIComponent()除了会转义空格和中文字符外，还会转义URI保留字

// 解码"http://www.zuo11.com/test value.html#start"
// 只解码空格、中文等
decodeURI("http://www.zuo11.com/test%20value.html#start");
// 除了会解码空格和中文字符外，还会解码 URI 保留字
decodeURIComponent("http%3A%2F%2Fwww.zuo11.com%2Ftest%20value.html%23start");
```
**eval() 方法**，整个 ES 语言中最强大的函数，这个方法就是一个完整的 ES 解释器。只接收一个参数，即要执行的 JS 字符串
```js   
eval("alert('123')") // alert("123");
eval("var msg = 'hello'");
alert(msg); // hello

// 注意作用域
eval("let msg = 'hello'");
alert(msg); // ReferenceError: msg is not defined
```
**Global 对象的属性**，undefined、NaN、Infinity等，ES5 禁止给 undefined、NaN、Infinity赋值

**window对象**，JS 中 window 对象除了扮演 ES 规定的 Global 对象角色外，还承担了很多别的任务如 BOM

### Math 对象
ES 为保存数学公式和信息提供了 Math 对象。与 js 直接编写的计算功能相比，Math 对象提供的功能执行会快得多
```js
// 1. Math对象的属性 PI,E,SQRT2等
Math.PI // π 的值， 3.141592653589793

// 2. min()和max() // 最大值，最小值
let max = Math.max(3, 54, 32, 16); // max 54
let min = Math.min(3, 54, 32, 16); // min 3
let numArr = [3, 54, 32, 16];
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
注意：Math.random() 方法出于演示目的可以，如果是为了加密而需要生成随机数，建议使用较高不确定性的 window.crypto.getRandomValues()
