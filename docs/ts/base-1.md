

# 1. 前言



该系列笔记整理自：
1. [TypeScript入门教程](https://ts.xcatliu.com/)
2. [ts官方文档](http://www.typescriptlang.org/docs/home.html)
3. [ts非官方中文文档](https://zhongsp.gitbooks.io/typescript-handbook/content/)

## 什么是TypeScript
- TypeScript是JS的超集，主要提供了类型系统和对ES6的支持。Type Script 从字面意思来看，type 为类型。
- 官方解释：**TypeScript is a superset of JavaScript that compiles to clean JavaScript output.** （TypeScript 是 JavaScript 的类型的超集，它可以编译成纯 JavaScript。编译出来的 JavaScript 可以运行在任何浏览器上。TypeScript 编译工具可以运行在任何服务器和任何系统上。TypeScript 是开源的）
- TypeScript 第一个版本发布于 2012 年 10 月，由微软开发，开源地址：[microsoft/TypeScript](https://github.com/Microsoft/TypeScript)
- TypeScript 之父是 [Anders Hejlsberg](https://github.com/ahejlsberg)，一个60岁还在写代码的大神。相关介绍: [程序员之神](https://mp.weixin.qq.com/s/zyxpaouWaUcb5jS5kGJg4Q)
- TypeScript 简称 ts
- TypeScript 编写的文件以 .ts 为后缀，用 TypeScript 编写 React 时，以 .tsx 为后缀。

## 为什么要学习TypeScript
vscode、vue3.0、Angular2 都是使用TypeScipt编写，有可以写客户端软件，又可以写前端。

> [如何评价TypeScript - 知乎](https://www.zhihu.com/question/21879449)

**为什么大佬们都开始使用TypeScript，从js换成ts，有哪些好处，可以举几个例子吗？**

### 没系统学习ts前的理解
- 对前端的友好性：ts完全兼容js(ts就是js的超集), .ts文件里完全写js都可以(把.js命名为.ts也可以)，js可以做的ts都可以，ts还额外增加了很多功能特性。

### 系统学习ts后的理解
待学习后补充

## 怎么安装使用TypeScript
安装ts
```shell
# 使用npm全局安装typescript
npm install -g typescript
```
安装完成后，就可以在terminal里使用 `tsc` 命令了, 运行tsc命令可以查看对应的文档。

### tsc 是做什么用的?
编写一个hello.ts文件，运行 `tsc hello.ts` 会在当前目录生成一份对应的js文件，也就是 **将对应的ts文件编译为js文件**

hello.ts
```ts
// 这里用一个ts的功能特性，函数传参时，使用 : 约束参数的类型，: 的前后有没有空格都可以。
function sayHello(name: string) {
  return 'Hello, ' + name
}

sayHello('Tom')
```
tsc hello.ts 后生成的 hello.js, ts 编译为 js 之后，并没有什么检查的代码被插入进来。
```js
function sayHello(name) {
    return 'Hello, ' + name;
}
sayHello('Tom');
```

**这里sayHello参数name约定为string类型，如果传了数字123，会怎么样?**
```ts
// hello.ts
function sayHello(name: string) {
  return 'Hello, ' + name
}
sayHello('Tom');
sayHello(123)
```
1. vscode会直接报错

![0_0_vscode_check.png](/images/ts/0_0_vscode_check.png)

2. tsc hello.ts时会报错，注意：**就算报错但依旧可以编译生成js**
```sh
0_hello.ts:7:10 - error TS2345: Argument of type '123' is not assignable to parameter of type 'string'.
7 sayHello(123)
           ~~~
Found 1 error.
```
编译后的js
```js
function sayHello(name) {
    return 'Hello, ' + name;
}
sayHello('Tom');
sayHello(123);
```

## tsconfig.json
上面的例子中，就算编译错误，也会生成js。如果要在报错的时候终止 js 文件的生成，可以在 tsconfig.json 中配置 noEmitOnError 即可。

关于tsconfig.json可以参考: [工程配置 · TypeScript Handbook（中文版）](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html) 

