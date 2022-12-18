# TS 类型定义最佳实践

## 最佳实践

### eslint中ts插件规则

[@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)（12k star）包含超过 100 条规则，用于检测专门针对 TS 代码的最佳实践违规、错误或风格问题。

所有规则参见：[Overview | typescript-eslint](https://typescript-eslint.io/rules/)

### 不要使用 any

请尽量不要使用 any 类型，除非你正在将 JS 代码迁移到 TS 代码。编译器实际上会将 any 视作 "对其关闭类型检查"。

使用它与在每个变量前使用 @ts-ignore 注释是一样的。它只在首次将 JS 工程迁移到 TS 工程时有用，因为你可以把还没迁移完的实体标记为 any 类型，但在完整的 TS 工程中，这样做就会禁用掉类型检查。

如果你不清楚要接收什么类型的数据，或者你希望接收任意类型并直接向下传递而不使用它，那么久可以使用 unknown 类型。

### 类型定义声明统一放在指定的文件（比如: xx.d.ts）

类型定义统一放到 xx.d.ts 文件中，分模块

```bash
src/views/home/dto.d.ts 或 src/views/home/home.d.ts
src/views/user/dto.d.ts 或 src/views/user/user.d.ts
```

使用类型时

```ts
import type { xxInfoType, xxType } from '@/views/home/dto.d.ts'

const userInfo: xxInfoType = { ... }
```

### 常规类型使用 TS 类型而非 import

[TS 3.8 版本 type-only-imports-exports](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports) 引入了 import type, 希望能够使用一种更加清晰易懂的方式来控制某一个导入是否要被删除掉。

```ts
import type { Ref } from 'vue' // import Ref 类型
```

更多细节参考：[import 和 import type的区别](https://juejin.cn/post/7111203210542448671)

### 常规类型使用 TS 类型而非 JS 类型

不要使用以下 JS 类:  Number, String, Boolean, Symbol 和 Object。

应该使用 number, string, boolean 和 symbol 类型。

```ts
/* 错误 */
function reverse(s: String) : String;

/* 正确 */
function reverse(s: string): string;
```

### 使用 Record<string, unknown> 代替 object

对象类型定义使用 Record 而非 object

### 回调函数的返回值类型

不要为返回值会被忽略的回调函数设置返回值类型位 any。应该用 void

```ts
/* 错误 */
function fn(x: () => any) { 
    x();
}

/* 正确 */
function fn(x: () => void) { 
    x();
}
```

### 什么时候使用泛型

当你的函数，接口或类，需要使用到很多类型的时候，当我们需要一个 id 参数，函数的参数可以是任何值，返回值就是将参数原样返回，并且其只能接受一个参数，在 js 时代我们会很轻易的使用一行

```js
const id = arg => arg
```

由于其可以接受任意值，也就是说入参和返回值可以是任意类型，如果不使用泛型，只能重复的进行定义

```ts
type isBoolean = (arg: boolean) => boolean
type idNumber = (arg: number) => number
type idString = (arg: string) => string
```

如果使用泛型，我们只需要

```ts
function id<T>(arg: T): T {
    return arg
}
// 或
const id1: <T>(arg: T) => T = arg => {
    return arg
}
```

### Type 和 interface 的选用时机

- 在定义公共 API 时（比如编辑一个库）使用 interface, 这样可以方便使用者继承接口
- 定义组件属性 Props 和状态 State 时，建议使用 type 因为 type 约束性更强
- type 类型不能二次编辑，而 interface 可以随时扩展

参考：[2021-TypeScript + React 最佳实践](https://juejin.cn/post/7012496703488000037)

## TS 常见问题处理

### as 指定类型时添加 unknown 转换

![ts-best-guide-as-unknown.png](/images/ts/best-guide/ts-best-guide-as-unknown.png)

类型 "string|undefined" 到类型 "ConfigProps" 的转换可能是错误的，因为两种类型不能充分重叠。如果这是有意的，请先将表达式转换为 "unknown"。类型 "string" 不可与类型 "ConfigProps" 进行比较

```vue
<script lang="ts" setup>
interface ConfigProps {
    link: Record<string, unknown>
}
const urlName = (process.env?.CONFIG as ConfigProps).link.XXXX_NAME;
</script>
```

解决方法：为非重叠类型添加 unknown 转换

```ts
const urlName = (process.env?.CONFIG as unknown as ConfigProps).link.XXXX_NAME;
```

### echarts 变量 - window 下新增属性报错问题

自定义 window 属性会报错，可以通过自定义一个新的 CustomWindow 来解决

```ts
// src/global.d.t
export interface CustomWindow extends Window {
    echarts?: any;
}
```

使用

```ts
import { customWindow } from '@/global.d.ts'

(window as CustomWindow).echarts.init(echartRef.value, { ... })
```

### 事件监听中 this 报错问题

实现 bind(this) 或者节流防抖函数时，this 一直报错的问题

- 1、上一行加 `//@ts-ignore`
- 2、 eslint 如果还是报错，vscode 中按住 ctrl 鼠标移动到报错位置，选择快速修复，忽略这一行的 eslint 检查

或者参考：[解决 TS 语法中 This 报错问题](https://blog.csdn.net/So_I_like/article/details/122664507)

### typescript 版本导致的 @typescript-eslint/parser 报错

低版本 TS 可能会导致新建 vue 组件时，eslint 一直报错，无法 npm run dev， 升级 TS 版本即可

![ts-best-guide-ts-upgrade](/images/ts/best-guide/ts-best-guide-ts-upgrade.png)

参考：[error: Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser.](https://github.com/typescript-eslint/typescript-eslint/issues/967)

### axios 出入参

- Property 'list' doesnot exist on type `AxiosResponse<any>`
- Object literal may only specify known properties, and 'noToastErr' does not exist in type 'AxiosRequestConfig'

最快速的方法，加 any，比如在迁移代码时

```ts
const res: any = await api.xxx()
```

也可以这样 继承 axios 参数类型，自定义扩展类型

```ts
import type { AxiosResponse, AxiosRequestConfig } from 'axios-response'

interface AxiosRequestConfigCustom extends AxiosRequestConfig {
    noToastErr: boolean;
}

ajax.get('xxx', { params, noToastErr: true} as AxiosRequestConfigCustom);
```

### arguments 函数参数变量报错问题

上一行加 // eslint-disable-next-line prefer-rest-params

或者参数手动指定为 ...params

```ts
function extend() {
    const result = {}
    // eslint-disable-next-line prefer-rest-params
    for(let i = 0; i < arguments.length; i++) {
        const attr = arguments[i];
        // ....
    }
}
```

或者改为

```ts
function extend(...params) {
    const result = {}
    for(let i = 0; i < params.length; i++) {
        const attr = params[i];
        // ....
    }
}
```

### 函数有3个参数，只传了1个, 参数个数不匹配问题

指定函数出入参类型，使用 ?: 可选参数

```ts
const css = (el, prop, val) => {}
css(ele)
```

修改函数定义

```js
const css: (el: any, prop?: any, val?: any) => any = (el, prop, val) => {
    // ..
}
```

### is not assignable to type 'null'

Type '{start: string; end: string;}' is not assignable to type 'null':ts(2322)，给一个类型为 null 变量赋值为对象时

```ts
let curInfo = null;
curInfo = { start: 'xx'; end: 'xx'; };

// 添加类型
let curInfo: Record<string, unknown> | null = null
```

### 关于 number 数字类型，input 输入框初始值为空字符串的场景

比如数量，理论上是 number 类型，但绑定到 v-model 时，需要是空字符串。就有两种类型，建议：

```ts
// 定义时
const num: Ref<number | string> = ref('')

// 使用时
num as number 
```

如果还是报错，使用 num as unknown as number

### 数组 is not assignable to parameter of type 'never'

Argument of type `Record<string, unknown>` is not assignable to parameter of type 'never'.ts(2345)

```ts
const dayInfo = ref([])
dayInfo.push(curInfo);
```

修改

```ts
const dayInfo: Record<string, unknown>[] = []
// 或者
const dayInfo: any = ref([])
```

### vue2/vue3 代码共存时，mixin 改为 ts 后大量 this，一次性无法解决的过渡方案

对于 mixin 中大量的 this，改动量很大，可以临时在稳健头部加上 //@ts-nocheck 忽略整个文件的 TS 检查

```ts
// @ts-nocheck

// 文件内容 ..
```

这样可以暂时忽略 this 问题，后面全部改为 composition 写法后，在删除对应的 mixin 文件即可

## 参考

- [TS 官网 - handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Microsoft - TypeScript官网 wiki - FAQ](https://github.com/microsoft/TypeScript/wiki/FAQ)
- [TS 类型练习 type-challenges](https://github.com/type-challenges/type-challenges)
- [总结TS在项目开发中的应用实践体会 - 掘金](https://juejin.cn/post/6970841540776329224)
- [2021-TS + React 最佳实践 - 掘金](https://juejin.cn/post/7012496703488000037)
- [最佳实践 - TypeScript 手册](https://bosens-china.github.io/Typescript-manual/download/zh/declaration-files/do-s-and-don-ts.html)
- [TypeScript 中高级应用与最佳实践 - 腾讯 AlloyTeam](http://www.alloyteam.com/2019/07/13796/)
