---
title: JavaScript 小记
description: 归纳整理在 JavaScript 方面的细节问题，对 JS高程4、ES6入门 等书籍中没有提到的细节问题，进行深入探讨研究。
---

# JavaScript 小记
归纳整理在 JavaScript 方面的细节问题，对 JS高程4、ES6入门 等书籍中没有提到的细节问题，进行深入探讨研究。

## getElementsByTagName 为什么不可以 forEach ？和 querySelectorAll 有什么区别
在 JS DOM 编程艺术的例子中，看到 `getElementsByTagName` 后使用了 `Array.from(xx)` 将其结果转为标准数组后再使用 `forEach`。
下面写个例子来验证为什么？

```html
 <nav>
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
  </ul>
</nav>
<script>
  let nav = document.getElementsByTagName('nav')[0]
  let linkArr = nav.getElementsByTagName('a')
  console.log(linkArr) // HTMLCollection [] => Object
  console.log(linkArr[0].__proto__)  // HTMLAnchorElement
  // HTMLAnchorElement => HTMLElement => Element => Node => EventTarget => Object
  // <nav> HTMLElement
  // <li> HTMLLIElement 
  console.log(linkArr[0].nodeType, linkArr[0].nodeName) // 1 "A"
  console.log(linkArr.__proto__) // HTMLCollection [] 

  // Uncaught TypeError: linkArr.forEach is not a function
  linkArr.forEach(item => console.log(item))
</script>
```

**getElementsByTagName返回结果类型**

从上面的例子中，我们可以看到 `getElementsByTagName` 函数返回的数据类型是 `HTMLCollection`，它是直接使用 Object 创建的对象，并没有实现 forEach 方法，但它内部实现了遍历、for...of（Symbol.iterator）方法，因此可以使用 for、for...of 来遍历

![getElementsByTagName_1.png](/images/js/getElementsByTagName_1.png)

我们换个思路，使用 `Array.prototype.forEach.call` 来调用试试

```js
// forEach 基本用法
[1,2,3].forEach((item, index, array) => console.log(item, index, array))

// 使用 prototype.forEach 直接运行
let cb = (item, index, array) => console.log(item, index, array)
Array.prototype.forEach.call(linkArr, cb)
```
可以正常执行，执行结果如下图。因此 Array 下的一些方法，我们可以使用 prototype 方式使用

![getElementsByTagName_2.png](/images/js/getElementsByTagName_2.png)

**querySelectorAll返回结果类型**

同样是获取元素列表，`querySelectorAll` 返回的结果类型是 `NodeList`
```js
// 和 querySelectorAll 对比
let linkArr2 = document.querySelectorAll('li a')
console.log(linkArr2) // NodeList [] => Object
console.log(linkArr2[0].__proto__)  //  HTMLAnchorElement
console.log(linkArr2[0].nodeType, linkArr2[0].nodeName) // 1
console.log(linkArr2.__proto__) // NodeList [] 
linkArr2.forEach(item => console.log(item))
```

如下图，NodeList 类型实现了 forEach, for...of 等方法，所以可以直接使用 forEach 遍历

![NodeList_1.png](/images/js/NodeList_1.png)

综上：getElementsByTagName 返回的结果为 `HTMLCollection` 类型，而 querySelectorAll 返回的结果为 `NodeList`。HTMLCollection 并没有实现 forEach，无法使用点语法执行forEach，而 NodeList 是可以的。

## JS数据类型有多少种，有哪些细节需要注意的？
ES3 有 5 种基本数据类型，1种复杂数据类型。ES6+ 后面新增了两种基本数据类型：Symbol, bigint

注意：
1. typeof 函数值为 `function`, typeof null 值为 `object`，本质上其实有 9 种数据类型。
2. new String('12') 是字符串对象，不是 string，new Number(1) 是数字对象，不是 number，new Boolean(false) 是对象，不是 boolean
3. 新增的 Symbol 以及 bigint 都是不能 new 的，没有 constructor 构造函数方法

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