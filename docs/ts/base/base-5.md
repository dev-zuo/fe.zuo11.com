# 5. 函数的类型、接口与类数组



主要介绍函数类型、用接口表示数组、类数组

## 函数的类型
在JS中，有两种定义函数的方式：
1. 函数声明(Function declaration)
2. 函数表达式(Function expression)

```js
// 函数声明
function sum(x, y) {
  return x + y
}
// 函数表达式
let mySum = function(x, y) {
  return x + y
}
```

### ts函数声明
对函数的参数，返回值进行约束，参数多或少都是不允许的
```js
function sum(x: number, y: number): number {
  return x + y
}
sum(1, 2)
sum(1, 2, 3) // Error
sum(1) // Error
```
### ts函数表达式
```js
let mySum = function (x: number, y: number): number {
  return x + y
}
// 规范写法 ts的类型定义中，=> 用来表示函数的定义，左边是输入类型、需要用括号括起来，右边是输出类型
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y
}
```
### 用接口定义函数形状
```js
interface SearchFunc {
  // 接口里面的函数类型
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  return source.includes(subString)
}
```
### 可选参数
函数的可选参数必须要在必选参数后面，如果可选参数放前面，会提示错误
```js
function buildName(firstName: string, lastName?: string) {
  return lastName ? `${firstName} ${lastName}` : firstName
}
let tomcat = buildName('Tom', 'Shu');
let tom = buildName('Tom');
```
### 参数默认值
如果指定了默认参数，该参数即成为可选参数，且没有可选参数位置的限制
```js
function buildName(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let cat = buildName(undefined, 'Cat');
```
### 剩余参数
与es6一样，剩余参数只能是最后一个参数
```js
function push(array, ...items) {
  items.forEach(item => array.push(item))
}
let a = []
push(a, 1, 2, 3) // items [1, 2, 3]

// typescript 约束 
function push(array: any[], ...items: any[]) {
  items.forEach(item => array.push(item))
}
```

### 重载
函数重载是指允许同时定义几个名称相同的函数(但参数个数、类型、返回值可能会不一样)，一般js里后面定义的函数会直接覆盖前面的函数

例子：实现一个函数reverse，输入数字123时，输出321，输入字符串'hello'时，输出反转字符串 'olleh'

```js
// 普通联合类型实现
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''))
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('')
  }
}

// 联合类型缺点：表达不够精确，输入数字的时候，输出应该也是数字，输入字符串的时候，输出也为字符串
// 可以用函数重载，定义多个reverse函数
// 前两次是函数定义，最后一次是函数实现。ts会优先匹配最前面的，再匹配的后面的
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''))
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('')
  }
}
```


## 用接口表示数组
NumberArray 表示：只要索引的类型是数字时，那么值的类型必须是数字。除了类数组外，一般都不使用这种方式
```js
interface NumberArray {
  [index: number]: number
}
let array: NumberArrray = [1, 1, 2, 3, 5]
```

## 类数组
**类数组不是数组类型**，需要用接口来描述类数组
```js
// arguments 实际是一个类数组，但赋值给数组类型的变量会报错
function sum() {
  let args: number[] = arguments // Error 
}

// 用接口来描述类数组
function sum() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments
}

interface IArguments {
  [index: number]: number;
  length: number;
  callee: Function;
}

function sum() {
  let args: IArguments = arguments;
}
```