---
title: 26. 模块(Modules) - JS高程4
description: 为什么会有模块？现代 JS 开发会遇到代码量大、广泛使用第三方库的问题，解决该问题的方法是将代码拆分为很多部分，每一个部分就是一个模块。ES6 之前原生不支持模块，一般都是使用 JS 特性伪造出类似模块的行为。ES6 原生模块之前有几种模块规范，使用时需要在浏览器中额外加载库或者在构建时完成预处理。包括 CommonJS、AMD、UMD、ES Modules
keywords: CommonJS,AMD,UMD,ES6 模块,ES Modules
---
# 26. 模块(Modules) 

为什么会有模块？现代 JS 开发会遇到代码量大、广泛使用第三方库的问题，解决该问题的方法是将代码拆分为很多部分，每一个部分就是一个模块。ES6 之前原生不支持模块，一般都是使用 JS 特性伪造出类似模块的行为。

## 理解模块模式
将代码拆分为独立的模块，然后再连接起来。核心是：逻辑分块、各自封装、相互独立、每个模块自行决定对外暴露什么，自行决定引入执行哪些代码。

**模块标识符（变量）**，在模拟模块的系统中可能是字符串，在原生实现中可能是模块文件的实际路径。Node.js 中会通过搜索 node_modules 目录查找对应标识符对应的模块

**模块依赖**，指的是模块中依赖的其他外部模块

**模块加载**，引入某个模块后，会开始分析执行对应的代码，浏览器先判断该模块是否有依赖，如果有，会先将依赖都加载完成后，再执行。模块加载是阻塞的，前置操作必须完成才能执行后续操作。

**入口**，模块必须指定一个模块入口（entry point），他是代码执行的起点。

**异步依赖**，假设在 A 模块中使用了 B 模块的功能，我们需要等 B 模块加载好了，再执行对应的内容。对应的伪代码如下

```js
// 模块 A 代码
load('moduleB').then(moduleB => {
  moduleB.doSomething()
})
```

**动态依赖**，有些模块系统需要开发者在开始前就列出所有依赖，而有些模块系统允许在代码中动态加载依赖的模块
```js
// 模块开始前事先声明
cosnt a = require('a')
cosnt b = require('b')
// ...
// 动态依赖
if (xxx) {
  require('c')
}
```

**静态分析**，静态分析类似于 tree sharking（摇树）的功能，将用到的模块才打包到最终输出模块。动态依赖会导致静态分析更加困难。

**循环依赖**，如果模块 A 依赖模块 B，模块 B 又依赖模块 A，这种就叫做循环依赖，一般的模块系统都支持循环依赖。循环依赖中模块的价值顺序会出人意料，具体参见 p775

## 凑合的模块系统，立即执行函数
较早之前一般会将模块封装在匿名闭包中，使用立即执行函数 (IIFE) 模拟模块
```js
var Foo = (function() {
  return {
    bar: 'baz',
    baz: function() {
      console.log(this.bar)
    }
  }
})()
console.log(Foo.bar) // 'baz'
Foo.baz() // 'baz'
```
类似的还有 revealing modlue pattern 暴露模块模式
```js
var Foo = (function() {
  var bar = 'baz'
  var baz = function() {
      console.log(this.bar)
    }
  return {
    bar: bar,
    baz: baz
  }
})()
Foo.ns = (function() {
  return {
    baz: function() {
      console.log('123')
    }
  }
})()
console.log(Foo.bar) // 'baz'
Foo.baz() // 'baz'
Foo.ns.baz() // '123'
```
为了让模块正确使用外部值，立即执行函数中可以传参
```js
var globalBar = 'baz'
var Foo = (function(bar) {
  return {
    bar: bar,
    baz: function() {
      console.log(bar)
    }
  }
})(globalBar)

console.log(Foo.bar) // 'baz'
Foo.baz() // baz
```
可以在模块定义后，在扩展模块
```js
var Foo = (function(bar) {
  var bar = 'baz'
  return {
    bar: bar
  }
})()
// 扩展 Foo，新增 baz() 方法
var Foo = (function(FooModule) {
  FooModule.baz = function() {
    console.log(FooModule.bar)
  }
  return FooModule
})(Foo || {})

console.log(Foo.bar) // 'baz'
Foo.baz() // baz
```
## ES6 之前的模块加载器
ES6 原生模块之前有几种模块规范，使用时需要在浏览器中额外加载库或者在构建时完成预处理

### CommonJS 规范
CommonJS 规范是同步声明依赖的模块定义。主要用于在服务端（比如 Node.js）实现模块化代码组织，也可以用于浏览器中，浏览器中不支持直接运行 CommonJS 语法。Node.js 的模块系统使用了轻微修改版的 CommonJS，它主要在服务端使用，不需要考虑网络延迟的问题。

使用 require() 来指定依赖，模块标识符可以是文件路径，也可以是文件目录字符串（默认会从 node_modules 目录查找对应的目录名）
```js
var moduleB = require('./moduleB')
// var moduleB = require('modlueB') 

module.exports = {
  todo: moduleB.todo
}
```
需要注意: 
1. 无论模块被引用多少次，模块永远是单例，只会加载一次并缓存，后续会获取对应的缓存。
2. 模块加载时同步操作
3. 如果没有使用 module.exports，则模块不会导出任何内容
4. 支持动态依赖，比如在执行过程中 `if (condition) { const A = require('xx') }`
5. CommonJS 规范的代码在浏览器中执行，需要先打包构建。如果直接运行会创建全局变量。一般构建时会将模块代码封装在函数闭包中，最终只提供一个文件。为了以正确顺序打包模块，需要事先生成全面的依赖图。
```js
console.log('moduleA')
var a1 = require('./moduleA')
var a2 = require('./moduleA')
console.log(a1 === a2) // true

// 模块A
module.exports = 'foo'
// 使用模块A
var moduleA = require('./moduleA')
console.log(moduleA) // 'foo'

module.exports = {
  a: 'A',
  b: 'B'
}
// 等价于
module.exports.a = 'A'
module.exports.b = 'B'

class A {}
module.exports = A
```

### AMD 异步模块定义
CommonJS 的执行环境一般是在服务端，可以一次性把所有模块都加载到内存，而 AMD（Asynchronous Module Definition）异步模块定义的执行环境一般是在浏览器，需要考虑网络延迟的问题。
```js
// 模块A依赖模块B，模块B异步加载
define('moduleA', ['moduleB'], function(moduleB) {
  return {
    todo: modlueB.todo
  }
})
```
需要注意：
1. AMD 的策略是让模块声明自己的依赖，运行在浏览器中是会按需获取依赖并加载。
2. 它使用函数包装模块定义，防止声明全局变量。使用 define 全局变量来加载模块。define 由 AMD 加载器库的实现定义。
3. 在依赖模块加载完毕后，会立即调用模块工厂函数。
4. 支持 require、exports 对象，可以在工厂函数内部定义 CommonJS 风格的模块，依靠该方法可以实现动态依赖
```js
define('moduleA', ['require', 'exports'], function(require, exports) {
  var moduleB = require('moduleB')
  exports.todo = moduleB.todo
})
// 动态依赖
define('moduleB', ['require'], function(require) {
  if (condition) {
    var moduleB = require('moduleB')
  }
})
```
### UMD 通用模块定义
UMD（Universal Module Definition）规范的出现是为了统一 CommonJS 和 AMD。它可以创建这两个系统都可以使用的模块代码。模块在启动时，会检测当前执行环境，进行适当配置，并把所有逻辑包装在一个立即执行函数（IIFE）中。虽然不完美，但在大多数场景下足以实现两个生态的共存。一般 webpack 打包构建后就是这种模块系统。以下是 UMD 模块定义示例代码

```js
// 立即执行函数
((function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD 注册为匿名模块
    define(['modlueB'], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node，类 CommonJS 环境
    module.exports = factory(require('modlueB'))
  } else {
    // 浏览器全局上下文（root 是 window）
    root.returnExports = factory(root.moduleB)
  }
}(this, function (moduleB) {
  // 以某种方式使用 moduleB

  // 将返回值作为模块导出
  return {}
}))
```
一般不会手写，而是由构建工具自动生成

### 模块加载器终将没落
随着 ES6 Modules（ES6 原生模块）越来越广泛支持，本章展示的模式最终会走向没落，但了解还是很有必要的。

## 使用 ES6 模块（ES Modules）
ES6 最大的一个改进是引入了模块规范。简化了之前出现的模块加载器。ES6 模块系统是集 AMD 和 CommonJS 之大成者。

### 模块标签及定义
ES6 模块式作为一整块 JS 代码而存在的，带有 type="module" 属性的 `<script>` 标签会告诉浏览器相关代码应该作为模块执行，而不是作为传统脚本执行。模块可以嵌入在网页中，也可以作为外部文件引入
```html
<!-- 内嵌模块代码 -->
<script type="module">
  // 模块代码
</script>

<!-- 作为外部引入 -->
<script type="module" src="myModlue.js"></script>
```
注意：
1. `type="module"` 模块都会像 `<script defer>` 脚本加载顺序一样，解析到该标签时立即下载模块文件，但执行会延迟到文档解析完成。无论是嵌入的代码还是引入的外部模块文件都是这样。
2. `<script type="module">` 在页面中的出现顺序就是他们执行的顺序。
3. 可以给模块指定 async 属性，这样不仅模块执行顺序和在页面中出现顺序不一致，模块也不会等待文档完成解析才执行。但入口模块必须等待其他依赖加载完成再执行。
4. 一个页面中，重复加载同一个模块，实际只会加载一次
5. 嵌入代码的模块定义不能使用 import 加载到其他模块，只适合作为入口模块。
```html
<!-- 第二个执行 -->
<script type="module"> //... </script>
<!-- 第三个执行 -->
<script type="module"> //... </script>
<!-- 第一个执行 -->
<script> //... </script>

<!-- moduleA 只会加载一次 -->
<script type="module">
  import './moduleA.js'
</script>
<script type="module">
  import './moduleA.js'
</script>
<script type="module" src="./moduleA.js"></script>
<script type="module" src="./moduleA.js"></script>
```

### 模块加载
ES6 模块即可以通过浏览器原生加载，也可以通过第三方加载器和构建工具一起加载。有些浏览器还没有原生支持 ES6 模块，因此还需要第三方工具。

完全支持 ES6 模块的浏览器可以从顶级模块加载整个依赖图，而且是异步完成的。浏览器会解析入口模块，确定依赖并发送对依赖模块的请求，如果有嵌套会递归加载，直至依赖图解析完成。依赖 OK 后，就可以正式加载模块了。

这个过程和 AMD 风格的模块加载非常相似，模块文件按需加载，这种加载方式效率很高，但加载大型项目的深度依赖图可能要花费很长时间。

### 模块行为
ES6 模块借用了 CommonJS 和 AMD 的很多优秀特性，比如
- 模块代码只在加载后执行
- 模块是单例，只加载一次
- 模块可以定义公共接口，其他模块可以基于这个公共接口进行二次开发
- 模块可以请求加载其他模块
- 支持循环依赖

ES6 模块也新增了一些新的行为
- ES6 模块默认在严格模式下执行
- ES6 模块不共享全局命名空间
- 模块定义 this 为 undefined，常规脚本中是 window
- 模块中的 var 声明不会添加到 window 对象
- ES6 模块是异步加载和执行的

与 `<script type="modlue">` 关联或者通过 import 语句加载的 JS 文件会被认定为模块。
### 模块导出
ES6 模块导出与 CommonJS 非常相似，使用 `export` 关键字，不同的导出对应不同的导入方式。

注意：
1. export 必须在模块顶级，不能嵌套在某个模块中（比如 if）。export 可以放到开头位置，但最好放到末尾。
2. export 分为命名导出（named export）或默认导出（default export）
```js
export ... // 允许

// 不允许
if (condition) {
  export ...
}
```
命名导出，可以在同一行执行变量声明。
```js
const foo = 'foo'
export { foo }
// 行内命名导出
export const foo = 'foo'
// 导出时提供别名
const foo = 'foo'
export { foo as myFoo}
// 支持多个命名导出
export const foo = 'foo'
export const bar = 'bar'
export const baz = 'baz'
// 可以分组导出
const foo = 'foo'
const bar = 'bar'
const baz = 'baz'
export { foo, bar as myBar, baz }
```
默认导出，使用 default 关键字将一个值声明为默认导出，每个模块只允许一个默认导出，重复导出会导致语法错误 SyntaxError
```js
const foo = 'foo'
export default foo
// 等价于 export { foo as default }
```
命名导出和默认导出不会冲突，同一个模块中可以同时定义两种导出
```js
const foo = 'foo'
const bar = 'bar'
export { bar }
export default foo
// 等价于 export { foo as default, bar }
```
注意：
1. 行内默认导出不能出现变量声明
2. 只有标识符可以出现在 export 子句中
3. 别名只能在 export 子句中出现

```js
export default const foo = 'bar' // 错误
export { 123 as foo } // 错误
export const foo = 'foo' as myFoo // 错误
```
正确的形式
```js
// 命名行内导出
export const baz = 'baz';
export const foo = 'foo', bar = 'bar';
export function foo() {}
export function* foo() {}
export class Foo {}

// 命名子句导出
export { foo };
export { foo, bar };
export { foo as myFoo, bar };

// 默认导出
export default 'foo';
export default 123;
export default /[a-z]*/;
export default { foo: 'foo' };
export { foo, bar as default };
export default foo
export default function() {}
export default function foo() {}
export default function* () {}
export defualt class {}
```
export 和 export default 关键字的使用很容易混淆，建议声明、赋值、导出标识符最好分开

### 模块导入
import 关键字可以使用其他模块导出的值
```js
import ... // 允许
// 不允许
if (condition) {
  import ...
}

import { foo } from './fooModule.js'
console.log(foo)
```
注意：
1. import 必须出现在模块的顶级，不能嵌套。import 可以出现在末尾，但建议放到开头。
2. import 模块标识符可以是路径，必须是存字符串，**不能是动态计算的结果，比如字符串拼接**
3. 在浏览器中通过标识符原生加载模块，必须带有 `.js` 后缀，不然可能无法正确解析。如果是构建工具或第三方模块加载器，可以不需要扩展名
4. 不是必须通过导出的成员才能导入模块，如果不需要特定导出可以直接 `import './xxx.js'`
5. 导入模块式只读的，相当于 const 声明。赋值给别名(as) 的命名导出就好像使用 Object.freeze() 冻结过一样，无法直接修改导出对的属性。

```js
// foo 是一个对象
import foo, * as Foo './foo.js';
foo = 'foo' // 错误
Foo.foo = 'foo' // 错误
foo.bar = 'bar' // 允许
```
命名导出和默认导出的区别反映在他们的导入上。**命名导出可以使用 * 批量获取并赋值给保存导出结合的别名，而不需列出每个标识符**
```js
// foo.js
const foo = 'foo', bar =' bar', baz = 'baz';
export { foo, bar, baz }

import * as Foo from './foo.js'
console.log(Foo) // { foo: 'foo', bar: 'bar', baz: 'baz' }

// 或者
import { foo, bar, baz as myBaz } from './foo.js'
console.log(foo, bar, myBaz) // 'foo' 'bar' 'baz'
```
默认导出就好像整个模块就是导出值一样
```js
import { default as foo } from './foo.js'
// 等价于
import foo from './foo.js'
```
如果模块同时导出了命名导出和默认导出，可以在 import 语句中同时获取他们
```js
import foo, { bar, baz } from './foo.js'
// 等价于
import { default as foo, bar, baz } from './foo.js'
// 也可以将 export 导出的所有使用 * as 来聚合成一个对象
import foo, * as Foo from './foo.js'
```
import() 动态导入模块在本书写作时还没确定，所以没涉及，是 ES2020 的内容。

### 模块转移导出
模块导入的值可以通过管道转移到导出，也可以将默认导出转为命名导出，或者相反。下面的例子中，将模块中的所有命名导出集中在一起，再使用 export 导出。如果 foo.js 有默认导出则该语法会忽略它
```js
export * from './foo.js'
```
再来看一个例子
```js
// foo.js
export const baz = 'origin:foo'
// bar.js
export * from './foo.js'
export const baz = 'origin:bar' // 重写导出的值

// main.js
console.log(baz) // 'origin:bar'
```
另外转移导出时也支持别名
```js
export { foo, bar as myBar } from './foo.js'
export { default } from './bar.js'
export { foo as default } from './foo.js'
```
### Web Worker Modules
在 Web Worker 中，可以使用 ES6 模块。在初始化 worker 时，使用第二个参数指定
```js
// 第二个参数默认为 { type: 'classic' }
const scriptWorker = new Worker('scriptWorker.js')

const moduleWorker = new Worker('moduleWorker.js', { type: 'module' })
```
另外在基于 module 的 worker 内部，使用 self.importScripts() 加载外部脚本会抛出错误，因为模块的 import 行为包含了 importScripts()。

### 向后兼容
使用 nomodule 属性实现向后兼容
```html
<!-- 支持模块的浏览器会执行该脚本，不支持的浏览器不会执行 -->
<script type="module" src="module.js"></script>

<!-- 支持模块的浏览器不会执行该脚本，不支持模块的浏览器会执行该脚本 --->
<script nomodule scr="script.js"></script>
```