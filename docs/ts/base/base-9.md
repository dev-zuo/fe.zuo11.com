# 9. 泛型与声明合并



## 泛型(Generics)
泛型是只定义函数、接口或类时，不预先指定具体类型，而在使用的时候才指定类型。
```js
// 这个例子中，并没有准确的定义返回值类型，数组中每一项都应该是输入的value的类型
function createArray(length: number, value: any): Array<any> {
  let result = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```
使用泛型来处理, 函数名后面添加 `<T>` 其中，T用来表示任意输入的类型
```js
function createArray<T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
createArray(3, 'x'); // ['x', 'x', 'x']
```

### 多个类型参数
定义了一个 swap 函数，用来交换输入的元组
```js
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

### 泛型约束
在函数内部使用泛型变量时，由于预先不知道它是什么类型，不能随意操作其属性或方法
```js
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length) // Error
  return arg
}

// 优化方法：使用接口对泛型进行约束
interface Lengthwise {
  length: string
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length) // Error
  return arg
}
```
多个类型参数之间可以互相约束
```js
// 这个例子中，T继承自U，所以U的所有属性，T也有，否则会报错
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });
```
### 泛型接口
使用接口定义函数的形状
```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```
使用泛型来定义函数形状
```js
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']

// 把泛型参数提前到接口名上
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

### 泛型类
与泛型接口类似，泛型也可以用于类的类型定义中
```js
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型参数的默认类型
ts v2.3+，可以为泛型中的类型参数指定默认类型
```js
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```

## 声明合并
如果定义了两个相同的函数、接口或类，那他们会合并为一个类型，函数的合并就是函数重载，这里就不介绍了。

### 接口的合并
```js
interface Alarm {
  price: nubmer;
}
interface Alarm {
  weight: nubmer;
}

// 相当于
interface Alarm {
  price: nubmer;
  weight: nubmer;
}
```
#### 合并属性的 **类型** 必须是唯一的
```js
interface Alarm {
    price: number;
}
interface Alarm {
    price: number;  // 虽然重复了，但是类型都是 `number`，所以不会报错
    weight: number;
}

interface Alarm {
    price: number;
}
interface Alarm {
    price: string;  // 类型不一致，会报错
    weight: number;
}

// index.ts(5,3): error TS2403: Subsequent variable declarations must hav
```
#### 方法的合并，与函数合并一样
```js
interface Alarm {
    price: number;
    alert(s: string): string;
}
interface Alarm {
    weight: number;
    alert(s: string, n: number): string;
}

// 相当于
interface Alarm {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}
```

### 类的合并
与接口的合并规则一致