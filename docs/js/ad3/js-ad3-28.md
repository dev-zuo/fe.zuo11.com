---
title: 28. 最佳实践 - JS高程4
description: 主要介绍三个部分内容：编写可维护的代码、保证代码性能、上线部署。随着 Web 应用程序越来越复杂，编写可维护的代码越来越重要，因为大多数开发者都需要花大量时间去维护别人写的代码。代码可维护性好，可以保证其他开发者更好的完成自己的工作。
keywords: JS最佳实践,js什么是可维护的代码,js编码惯例,js性能优化,js部署流程
---

# 28. 最佳实践
主要介绍三个部分内容：编写可维护的代码、保证代码性能、上线部署。随着 Web 应用程序越来越复杂，编写可维护的代码越来越重要，因为大多数开发者都需要花大量时间去维护别人写的代码。代码可维护性好，可以保证其他开发者更好的完成自己的工作。

## 可维护性
1. 什么是可维护的代码
2. 编码规范
3. 松散耦合
4. 编码惯例

### 什么是可维护的代码
一般来说，如果代码是可维护的，它应该遵循以下特点
- 容易理解，其他人可以接手代码并理解它的意图，而无需原开发人员完成解释
- 符合常识，代码中的东西一看就能明白，不管其操作过程多复杂
- 容易适配，可用于多个场景，稍微变化，不需要重写方法。
- 容易扩展，在代码构架上已考虑到在未来允许对核心功能进行扩展
- 容易调试，当有地方出错时，代码可以给予你足够的信息来确定问题所在

::: tip
能够写出可维护的 JavaScript 代码是一项重要的专业技能。这就是业余爱好者和专业开发人员之间的区别，前者用一个周末就拼凑出一个网站，而后者真正了解自己的技术。
:::

### 编码规范（代码约定）
一种让代码变得可维护的简单途径就是形成一套 JS 代码的书写约定
- 可读性
- 变量和函数命名
- 变量类型透明化

#### 可读性
`缩进` 和 `注释` 可以带来更可读的代码。代码使用同一种缩进，会更易阅读。需要写注释的地方：
- **函数和方法**。需要注释函数的功能、参数代表什么，返回值。
- **大段代码**。用于完成单个任务的多行代码，应该在前面放一个描述任务的注释
- **复杂的算法**。如果使用一种独特的方式解决问题，需要解释是怎么做的。方便别人维护或者自己后面查看理解
- **使用黑科技（Hack）**。由于浏览器差异，JS 会包括一些 hack，需要注明是用来特别处理哪个浏览器的。

#### 变量和函数命名
适当给变量和函数起名字对于增加代码可理解、可维护性是非常重要的。命名的规则一般如下；
- **变量名应该为名词**，如 car 或 person
- **函数名应该以动词开始**，如 getName()，返回布尔值的函数一般以 is 开头，如isEnable()
- 变量和函数都应**使用合乎逻辑的名字**，~~不要担心长度~~，代码混淆压缩会处理长度问题（会被转成 a, b, c, d, f, g 等）
- **变量、函数和方法应该以小写字母开头，使用驼峰大小写**（camelCase）形式，如 getName() 和 isPerson。**类名首字母应该大小**。如 Person、RequestFactory。**常量值应该全部大写，并以下划线相接**，比如：REQUEST_TIMEOUT。
- 名称尽量用**描述性和直观的词汇**，**但不要过于冗长**，如果 getName()，一看就是返回名称。

**要完全避免没有用的变量名，例如不能表示所包含数据类型的变量名。通过适当命名，代码读起来就像故事，更容易理解。**

#### 变量类型透明
由于 JS 中变量是松散类型的，很容易忘记变量所应包含的数据类型，有三种表示数据类型的方式：

1. 通过 **初始化** 标明数据类型。ES6之后，可以在函数参数里指定默认值标明参数类型。

```js
// 定义一个变量后初始化对应的值，指定变量类型
var found = false; // 布尔型
var count = -1;    // 数字
var name = '';     // 字符串
var person = null; // 对象
// 缺点: 在用于函数参数时会显得用处不大
```

2. 使用 **匈牙利标记法** 标明数据类型，在变量名之前加一个或多个字符来表示数据类型。比如：o 表示对象，s 表示字符串，i 表示整数，f 表示浮点数，b 表示布尔值。缺点：使代码可读性降低，不够直观，破坏了类似句子的阅读流畅性，不推荐使用。

```js
// 匈牙利标记法标明数据类型
var bFound; // 布尔型
var iCount; // 整数
var sName;  // 字符串
var oPerson; // 对象
```

3. **使用类型注释**，类型注释放到变量名后面，初始化表达式的前面。缺点：/* */注释无法嵌套。

```js
// 指定变量类型的方式使用类型注释
var found  /* :Boolean */ = false;
var count  /* :int */ = 10;
var name   /* :String */ = "guoqzuo";
var person /* :Object */ = null;
```

以上三种方法，可根据实际情况选择合适自己的，但要注意保持一致性。

### 松散耦合
如果应用的某个部分依赖于另一个部分过于紧密，代码就是耦合过紧，难以维护。
1. 解耦 HTML/JS
2. 解耦 CSS/JS
3. 解耦应用程序逻辑/事件处理程序

- **解耦 HTML/JS**，直接写在 HTML 里的 JS，或在 JS 里面写的 HTML 尽量避免。绑定方法及函数最好都写在 JS 里。HTML 呈现尽可能与 JS 保持分离，如果 JS 需要操作 TML，尽量先隐藏再显示，而不是用 JS 生成。理论上这样更优利与维护，可以快速知道是 HTML 的问题还是 JS 的问题。

```html
<!-- 使用了<script>的紧密耦合的 HTML/JS -->
<script>
  document.write("hello world!")
</script>

<!-- 使用事件处理程序属性值的紧密耦合的HTML/JS -->
<input type="button" value="Click me" onclick="doSomething()">

<!-- 将 HTML 紧密耦合到 JS，下设下面的代码在某个 JS 中 -->
<script>
  function insertMessage(msg) {
    var container = document.getElementById("container");
    container.innerHTML = "<div class='msg'><p class='post'>"+ msg + "</p></div>"
  }
</script>
```

- **解耦 CSS/JS**，样式操作尽量只放到 css 中，不要放到 JS 中操作。如果必须，可以使用改变 class 的方式来切换样式
```js
// CSS 对 JS 的松散耦合
element.style.color = "red";
element.style.backgroundColor = "blud"

// 需要通过 class 来解耦
element.className = "edit"
```

- **解耦应用程序逻辑/事件处理程序**，下面的代码中，事件处理程序 handleKeyPress，与应用程序逻辑（当 target.value > 2 时显示错误）耦合。

```js
function handleKeyPress(event) {
  if (event.keyCode === 13) {
    let target = event.target
    let value = 5 * parseInt(target.value)
    if (value > 10) {
      document.getElementById('error-msg').style.display = "block"
    }
  }
}
```
更好的方法
```js
// 应用程序逻辑
function validateValue(value) {
  value = 5 * parseInt(target.value)
  if (value > 10) {
    document.getElementById('error-msg').style.display = "block"
  }
}

// 事件处理程序
function handleKeyPress(event) {
  if (event.keyCode === 13) {
    let target = event.target
    validateValue(target.value)
  }
}
```

这样做的好处：
- 如果后续事件也会对应相同应用程序逻辑，则会导致重复代码，分离后如果有变动，改动很小。
- 可以在不添加事件的情况下测试代码，这样创建单元测试或自动化应用程序都会更简单。

应用和业务逻辑之间松散耦合的几条原则：
- 不要将 event 对象传给其他方法，只传来自 event 对象中所需的数据
- 任何可以在应用层面的动作都应该可以在不执行任何事件处理程序的情况下进行
- 任何事件处理程序都应该处理该事件，然后将处理交给应用逻辑

### 编码惯例（推荐的编程实践）
1. 尊重对象所有权
2. 不声明全局变量
3. 避免与 null 进行比较
4. 使用常量

**尊重对象所有权**，如果不是你自己负责创建和维护的某个对象、构造函数或方法。

- 不要为实例或原型添加属性
- 不要为实例或原型添加方法
- 不要重定义已存在的方法

推荐方法
- 创建包含所需功能的新对象，并用它与别人的对象交互
- 创建自定义类型，继承需要修改的类型，然后为自定义类型添加额外功能


**不声明全局变量**，如果需要，最多只创建一个全局变量，用对象的形式包裹

```js
// 两个全局变量要避免
var name = "guoqzuo";
function sayName() {
  alert(name)
}

// 推荐改为一个全局变量
var MyApplication = {
  name: "guoqzuo",
  sayName: function() {
    alert(this.name);
  }
}
```
全局变量为了避免与其他人或其他引入库的名称有冲突，尽量使用特别一点的名称，用项目名称加前缀
```js
// 例如 YAHOO 的 Wrox
// 创建全局变量
var Wrox = {}
Wrox.ProJS = {} // 创建Professional JS 命名空间
Wrox.ProJS.EventUtil = {}
Wrox.ProJS.CookieUtil = {}
```

**避免与 null 进行比较**，如果看到了与null比较的代码，尝试使用以下技术替换：
- 如果值应该是一个引用类型，使用 instanceof 操作检查器构造函数
- 如果值是一个基本类型，使用 typeof 检查其类型

```js
function sortArray(values) {
  if (values != null) { // 避免
    values.sort()
  }
}

// 必须按照所期望的值进行检查，而非按照不期望的那些
function sortArray(values) {
  if (values instanceof Array) { // 推荐
    values.sort()
  }
}
```
**使用常量**, 下面是需要使用常量的几个地方：
1. **重复值**，任何使用超过一次的值都应该抽取为一个常量，这样可以消除一个值改变了，而另一个值没改照成的错误。
2. **用户界面的字符串**，任何用于显示给用户的字符串，都应该被抽取出来，以方便国际化。
3. **URL**，在web应用中，资源位置很容易变更，推荐用一个公共的地方存放所有的URL。
4. **任何可能变化的值**，任何时候如果在代码中使用字面量值，需要问一下自己，这个值以后是否会变化，如果是，就可以把它提取到常量中。

## 性能
JS 是一种解释型语言，比编译型语言要慢的多。Chrome 是第一款内置优化引擎，将 JS 编译为原生代码的浏览器，此后主流浏览器陆续效仿实现了 JS 编译执行。即使到了编译执行的 JS 新阶段，但仍然会存在低效率代码。不过还是有一些方式可以改进代码的整体性能

### 注意作用域
访问全局变量总是要比访问局部变量慢，因为需要遍历作用域链。只要减少花费在作用域链上的时间，就能增加脚本的整体性能
- **避免全局查找**，将一个函数中会用到多次的全局对象存储为局部变量总是没错的。下面的函数看上去完全正常，但包含了三个对全局 document 对象的引用。如果页面有很多图片，for 循环中，需要引用 document 几十甚至上百次，每次都要遍历一次作用域链。
```js
// 
function updateUI() {
  var img = document.getElementByTagName('img');
  for (var i = 0, len=imgs.length; i < len; i++) {
    imgs[i].title = document.title + 'image' + i;
  }
  var msg = document.getElementById("msg");
  msg.innerHTML = "Update complete";
}
```
可以通过创建一个指向 document 的局部变量，来优化。这样在当前函数的作用域内就能找到。
```js
function updateUI() {
  var doc = document;
  var img = doc.getElementByTagName('img');
  for (var i = 0, len=imgs.length; i < len; i++) {
    imgs[i].title = doc.title + 'image' + i;
  }
  var msg = doc.getElementById("msg");
  msg.innerHTML = "Update complete";
}
```

- **避免with语句**（with语句会创建自己的作用域，会增加其中执行代码的作用域长度）

### 选择正确的方法
算法的复杂度使用 O 符号表示，最简单、最快捷的算法是常数值，即 O(1)。

表示法  | 说明
--- | ---
O(1) | 不管有多少值，执行的时间恒定。一般表示简单值何存储在变量中的值。
O(log n) | 总执行时间和值的数量相关，但是要完成算法并不一定要获取每个值，如：二分查找
O(n) | 总执行时间和值的数量相关，如：遍历某个数组中的所有元素
O(n²) | 总执行时间和值的数量有关，每个值至少获取 n 次，如：插入排序

**1. 避免不必要的属性查找**，使用变量和数组要比访问对象的属性更有效率，后者是一个O(n)操作。对象上的任何属性查找都要比访问变量或者数组花费的时间更长。属性查找越多，执行时间越长。一般只要能减少算法的复杂度，就要尽可能减少。

**能够使用数组的情况，就不要使用对象，数组访问元素O(1)，对象访问属性时间复杂度O(n)。**
```js
// 不推荐
var values = { first: 5, second: 10 };
var sum = values.first + values.second;
alert(sum);

// 数组查找的速度比上面的属性查找要快
var values = [5, 10]
var sum = values[0] + values[1]
alert(sum)
```
另外避免多次查找获取一个值，例如下面的例子中存在重复的属性查找
```js
let query = window.location.href.substring(window.location.href.indexOf('?'))
```
可以优化为
```js
let url = window.location.href
let query = url.substring(url.indexOf('?'))
```

**2. 优化循环**，一个循环的基本优化步骤如下：
- ~~减值迭代~~，第四版已删除，旧版浏览器效率更高，现代浏览器基本无差别。
- 简化终止条件，由于每次循环过程都会记录终止条件，所以必须保证它尽可能快，也就是说避免属性查找或其他 O(n) 的操作
- 简化循环体，循环体内需要最大限度的优化，确保没有某些可以被很容易移出循环体的密集计算
- 使用后测试循环，for 循环和 while 循环都是先测试循环。而 do-while 这种后测试循环，避免了对终止条件的初始评估，会更快。

```js
for (let i = 0; i < values.length; i++) {
  process(values[i]);
}
```
优化 => 减值迭代、简化终止条件，只执行一次 .length属性查找（前提是改变遍历顺序对功能没影响）
```js
for (let i = values.length - 1; i >= 0; i--) {
  process(values[i])
}
```
后循环优化 => 至少要确保处理的值有一个，空数组会导致多余的一次循环，前测试循环可以避免这种情况
```js
let i = values.length - 1;
if (i > -1) {
  do {
    process(values[i]);
  } while(--i >= 0)
}
```

**3. 展开循环**，如果循环的次数是确定的，消除循环直接调用多次函数，往往更快
```js
// 有限次数的循环
for (let i = 0; i < 3; i++) {
  process(values[i])
}

// 消除循环
process(values[0]);
process(values[1]);
process(values[2]);
```
如果循环中的迭代次数不能事先确定，可以考虑一种叫做 `达夫设备（Duff's Device` 技术。该技术以其发明者 Tom Duff 命名，最早建议在 C 语言中使用该技术，在 JS 中实现 Duff's device 的是 Jeff Greenberg。它的基本思路是：以 8 的倍数作为迭代次数，从而将循环展开。**对于大型数据集，可以节省很多时间，但如果对于小数据集，额外的开销则可能得不偿失。**
```js
// Jeff Greenberg 在 JS 中实现 Duff’s Device(达夫设备)
// 假设 values.length > 0
let iterations = Math.ceil(values.length / 8)
let startAt = values.length % 8
let i = 0

do {
  switch(startAt) {
    case 0: process(values[i++]);
    case 7: process(values[i++]);
    case 6: process(values[i++]);
    case 5: process(values[i++]);
    case 4: process(values[i++]);
    case 3: process(values[i++]);
    case 2: process(values[i++]);
    case 1: process(values[i++]);
  }
  startAt = 0
} while (--iterations > 0)
```
上面的例子中，switch 中没有用 break，startAt 取余为 0 ，就执行 8 次，为 7 就执行 7 次，再依次递减。**这样展开之后，能够加快数据集的处理速度**。

再来看一个更快的达夫设备实现

```js
// Andrew B.King《Speed Up Your Site》快 40% 左右
let iterations = Math.ceil(values.length / 8)
let leftover = values.length % 8
let i = 0

if (leftover > 0) {
  do {
    process(values[i++])
  } while (--leftover > 0)
}

do {
  process(values[i++])
  process(values[i++])
  process(values[i++])
  process(values[i++])
  process(values[i++])
  process(values[i++])
  process(values[i++])
  process(values[i++])
} while (--iterations > 0)
```

**4. 避免重复解释**，这种问题存在于当 JS 代码尝试解释 JS 代码的时候。使用 eval() 函数或 Function 构造函数，或者 setTimeout() 传入一个字符串参数时，都会发生这种情况
```js
// 某些代码求值 --- 避免！！
eval("alert('hello world')");
// 创建新函数 --- 避免！！
var sayHi = new Function("alert('Hello world!')");
// 设置超时 --- 避免!!
setTimeout("alert('hello world!')", 500)
```
修正
```js
// 直接写出来
alert('hello world')
// 创建新函数，直接写出来
var sayHi = function() {
  alert('hello world')
}
// 设置超时函数，直接写出来
setTimeout(function() {
  alert('Hello world!');
}, 500)
```

**5. 性能的其它注意事项**
- **原生的方法较快**，只要有可能，使用原生的方法而不是自己写一个。原生方法是用诸如 C/C++ 之类的编译型语言写出来的，比 js 要快很多。
- **switch 语句很快**, 如果有复杂的 if-else，使用 switch 会更快，可以通过将 case 语句按照最可能到最不可能的顺序进行组织会更高效。
- **位运算符很快** ，当进行数学运算时，位运算比任何布尔运算或数值计算更快。像求模、逻辑与 和 逻辑或 都可以考虑用位运算替换。

### 最小化语句数
找出可以组合为一起的语句组合为一条语句，比执行多条语句要快

1. 多个变量声明，合成一个
```js
// 不推荐
let count = 5;
let color = "blue";
let values = [1, 2, 3];
let now = new Date();

// 推荐优化 => 4个语句转换为一个语句
let count = 5,
    color = "blue",
    values = [1, 2, 3],
    now = new Date();
```
2. 插入迭代值
```js
var name = values[i];
i++;
// 可以优化为
var name = values[i++] 
```
3. 使用数组和对象字面量
```js
// 用4个语句创建和初始化数组 --- 浪费
var values = new Array()
values[0] = 123;
values[1] = 456;
values[2] = 789;

// 只用一条语句创建何初始化数组
var values = [124, 456, 789];

// 用4个语句创建何初始化对象 --- 浪费
var person = new Object();
person.name = 'guoqzuo';
person.age = 29;
person.sayName = function() {
  alert(this.name);
}

// 只用一条语句创建何初始胡对象
var person = {
  name: "guoqzuo",
  age: 29,
  sayName: function() {
    alert(this.name);
  }
}
```

::: warning
适当的减少语句可以提升执行速度，但一味的追求语句最小化，可能导致一条语句容纳过多的逻辑，难以理解。
:::

### 优化DOM交互
在 JS 的各个方面中，DOM 毫无疑问是最慢的一部分，DOM 操作要消耗大量的时间，因为他们往往需要重新渲染整个页面或者某一部分。理解如何优化DOM 的交互可以极大提高脚本完成的速度。

- 1. **实时更新最小化**，访问 DOM 时，只要访问的 DOM 部分已经是显示页面的一部分，就是在执行实时更新操作。每一个更新，浏览器要重新计算千项指标以进行更新。实时更新越多，代码执行耗费时间越长。
```js
// ul 添加 10 个 li，每次 for 循环都需要执行实时更新：总共20个实时更新。
var list = document.getElementById('myList'),
    item,
    i;
for (i = 0; i < 10; i++) {
  item = document.createElementByIf("li");
  list.appendChild(item);
  item.appendChild(document.createTextNode("Item" + i));
}
```
用文档碎片（createDocumentFragment）来构建 DOM 结构，只会进行一次现场更新
```js
var list = document.getElementById('myList'),
    fragment = document.createDocumentFragment(),
    item,
    i;
for (i = 0; i < 10; i++) {
  item = document.createElementByIf("li");
  item.appendChild(document.createTextNode("Item" + i));
  fragment.appendChild(item)
}
list.appendChild(fragement)
```

- **2. 使用innerHTML**，有两种方法创建新的 dom 结点：使用 createElement() 和 appendChild()，或者 innerHTML。如果是少量 DOM 更新，两种技术区别不大，对于大量 DOM 更改，对使用 innerHTML 比标准 DOM 方法创建同样的 DOM 结构快的多，当赋值 innerHTML 时，后台会创一个 HTML 解析器，使用原生 DOM 调用，而不是 JS 的 DOM 方法创建 DOM 结构。内部方法是编译好的，所以执行的会快很多。
```js
// 改写上面的方法
var list = document.getElementById("myList"),
    html = "",
    i;
for (i = 0; i < 10; i++) {
  html += "<li>Item " + i + "</li>"; 
}
list.innerHTML = html;
```

- **3. 使用事件代理**，页面上的事件处理数量越多，页面响应用户交互的速度会较慢，尽量可以多个时间相结合。共用一个事件处理程序.
- **4. 注意HTMLCollection**， 不要在循环的判断里使用该对象的 length 属性。只要访问 HTMLCollection ，无论是它的属性还是方法，都会触发查询文档，这个查询文档相当耗时。减少访问 HTMLCollection 的次数，可以极大提升性能。

```js
// 1. 初始化时，优化 len，不用每次遍历都去取; 
// 2. 每次遍历都先把对应的值用局部全量存起来，避免对 HTMLCollection 查询
let imgs = document.getElementsByTagName("img"),
    image;
for (let i = 0, len = imgs.length; i < len; i++) {
  image = images[i]
  // 处理
}
```

发生以下情况会返回HTMLCollection对象:
- 进行了 getElementsByTagName()
- 获取了元素的 childNodes
- 获取了元素的 attributes 属性
- 访问了特殊的集合，如 document.forms，document.images 等

## 部署
部署上线之前一般需要打包构建、验证、压缩。这一章主要讲打包构建的一些细节处理。

### 构建流程
为什么需要构建：
- 知识产权问题：将源码直接部署到服务器，会有安全风险，可以直接看到 JS 代码。
- 文件大小：文件多余的空格、缩进，冗余的函数和变量名存在优化文件 Size 的空间。
- 代码组织：JS 各个模块需要比较好的组织，用以提高性能。

**任务运行器**：任务运行器可以完成代码检查、打包、转译、启动本地服务器、部署，以及其他可以脚本化的任务。如：Grunt、Gulp。

**摇树优化（tree shaking）**：可以按需打包，将没有用到的代码，排除在打包文件之外。

**模块打包器**：Webpack、Rollup等，将基于模块的代码转换为普遍兼容的网页脚本。

### 验证
一般使用 JSLint/ESLint 验证，发现 JS 代码中语法错误和常见的编码错误。

### 压缩
1. **代码压缩（compression）**，去掉空格、换行、注释、缩短变量名，函数名或其他标识符。
2. **JS 编译（compilation）**，类似于最小化（minification）。删除未使用的代码，将某些代码转换为更简洁的语法，全局函数调用、常量、变量行内化。
3. **JS 转译（transpilation）**，使用 Babel 将 ES6+ 代码转换为 ES3/ES5 代码，兼容性更好。
4. **HTTP 压缩**，一般 HTTP 请求支持 Content-Encoding，一般是 gzip 压缩或 br，可以减少文件大小，让网络传输更快。
