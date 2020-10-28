# 6. 类型别名/字符串字面量类型/内置对象


## 类型别名
类型别名是指，用 `type` 给一个类型起一个新名字
```js
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver
function getName(n: NameOrResolver): Name {
  return n === 'string' ? n : n()
}
```

## 字符串字面量类型
使用 type 定义一个字符串字面量类型 EventNames，它只能取三种字符串中的一种。
```js
type EventNames = 'click' | 'scroll' | 'mousemove'
function handleEvent(ele: Element, event: EventNames) {
  //
}
// OK
handleEvent(document.getElementById('hello'), 'scroll'); 
// Error event 不能为 'dbclick'
handleEvent(document.getElementById('world'), 'dbclick'); 
```

## 内置对象
内置对象是指在全局作用域上存在的对象

### ECMAScript 内置对象
Boolean、Error、Date、RegExp 等。可以在ts中将变量定义为这些类型，更多内置对象 [内置对象 - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
```js
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

### DOM和BOM的内置对象
Document、HTMLElement、Event、NodeList 等。
```js
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
});
```

### ts核心库的定义文件
> TypeScript 核心库的定义文件中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。
当你在使用一些常用的方法的时候，TypeScript 实际上已经帮你做了很多类型判断的工作了

比如 Math.pow函数
```js
Math.pow(10, '2'); // Error
// 内部处理
interface Math {
  /**
   * Returns the value of a base expression taken to a specified power.
   * @param x The base value of the expression.
   * @param y The exponent value of the expression.
   */
  pow(x: number, y: number): number;
}
```
再比如 addEventListener
```js
document.addEventListener('click', function(e) {
  console.log(e.targetCurrent);
  // Error: Property 'targetCurrent' does not exist on type 'MouseEvent'.
});

// 内部处理
interface Document extends Node, GlobalEventHandlers, NodeSelector, DocumentEvent {
  addEventListener(type: string, listener: (ev: MouseEvent) => any, useCapture?: boolean): void;
}
```

### ts 核心库的定义中不包含 Node.js 部分
Node.js 不是内置对象的一部分, 如果用ts写node，需要引入第三方声明文件
```sh
npm install @types/node --save-dev
```