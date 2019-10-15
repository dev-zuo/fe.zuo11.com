# vuex状态管理
> 参考文档
> Vuex 是什么？- Vuex https://vuex.vuejs.org/zh/
> 状态管理 - Vue.js https://cn.vuejs.org/v2/guide/state-management.html

## 前言
### vuex是什么？
Vuex是一个专门为Vue.js 应用开发的**状态管理模式**，有如下特点：
- 采用集中式存储管理所有的组件状态
- 制定相应的规则保证状态以一种可预测的方式发生变化
- Vue官方调试工具 devtools extension集成了Vuex，提供了零配置的time-travel调试、状态快照导入导出等高级调试功能。

### 安装
#### 直接下载/CDN引用
> https://unpkg.com/vuex 这里除了可以用来引入，还可以查看源码，源码才1200行不到

上面的链接会一直指向 NPM 上发布的最新版本。您也可以通过 https://unpkg.com/vuex@2.0.0 方式指定特定的版本。
```html
<!-- 在vue之后引用 -->
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```
#### NPM
```shell
npm install vuex --save
```
在一个模块化的打包系统中，必须显式地通过 Vue.use() 来安装 Vuex：
```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 当使用全局 script 标签引用 Vuex 时，不需要以上安装过程
```
#### 注意事项
**Vuex 依赖 Promise** 如果浏览器不支持Promise，可以使用一个 polyfill 的库，例如 es6-promise,你可以通过 下面的 CDN 将其引入, 然后 window.Promise 会自动可用。
```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```
如果npm打包工具构建，需要
```shell
npm install es6-promise --save
```
在使用Vuex之前，导入
```js
import 'es6-promise/auto'
```
### 为什么需要使用Vuex状态管理？
当多个组件共享状态时，单向数据流的简洁性很容易被破坏：
- 多个视图依赖同一状态，多层嵌套组件里传递参数会非常繁琐，且无法进行兄弟组件间的状态传递
- 来自不同视图的行为需要变更同一状态，用下面的两种方法变更和同步状态的多份拷贝，会非常脆弱，通常会导致代码难以维护
  - 通过父子组件直接引用 this.\$refs，this.\$root, this.\$parent, this.\$children
  - 通过事件，props 和 this.\$emit

为了解决上面的问题，就需要用到Vuex了，Vuex把组件的共享状态抽取出来，以一个全局单例模式管理，不管在树的哪个位置，任何组件都能获取状态或者触发行为，这样就易于维护了。

### 什么时候需要使用Vuex
- 如果不打算开发大型单页面应用，使用Vuex可能会增加复杂度。
- 如果应用够简单，最好不要使用Vuex, 简单的store模式就够了。

### 一个简单的store模式
下面的例子中，两个组件引入相同全局变量, commonData发生变化vmA和vmB都将更新相应的视图，子组件也可以通过this.$root.$data去访问对应的数据，但调试会有问题，**应用中的任何部分，在任何数据改变后，都不会留下变更过的记录**，为了解决这个问题，就可以采用一个简单的 **store模式**
```js
const commonData = {}
const vmA = new Vue({
  data: commonData
})

const vmB = new Vue({
  data: commonData
})
```
store模式
- 所有store中state的改变，都放置在store自身的action中去管理。当错误出现时，会有一个log记录bug之前发生了什么
- 每个实例/组件依然可以拥有和管理自己的私有状态
```js
var store = {
  debug: true,
  state: {
    message: 'Hello!',
  },
  setMessageAction(newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}

var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```
如果继续延伸约定，**组件不允许直接修改属于store实例的state，而应该执行action来分发事件，通知store去改变**，这样约定的好处是：
- 可以记录store中发生的state改变
- 继续扩展功能可以做到记录变更 (mutation)、保存状态快照、历史回滚/时光旅行的先进的调试工具，把这些功能都加上，慢慢完善优化，就是vuex的实现

### 全局对象也可以管理状态，为什么需要vuex?
Vuex和单纯的全局对象，有以下两点不同:
- vuex不能直接改变store中的状态，改变store中的状态唯一的途径是显示的提交(commit) mutation。(为什么这样做？这样做 可以方便跟踪每一个状态的变化，可以实现一些工具来更好地了解应用的执行，方便debug)
- vuex的状态存储是响应式的，当Vue组件从store中读取状态的时候，如果store中的状态发生变化，name相应的组件也会进行高效更新。

### 最简单的 Store
```js
// 如果在模块化构建系统中，请确保在开头调用了 Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

// 调用示例
store.commit('increment')
console.log(store.state.count) // -> 1
```
> 再次强调，我们通过提交 mutation 的方式，而非直接改变 store.state.count，是因为我们想要更明确地追踪到状态的变化。这个简单的约定能够让你的意图更加明显，这样你在阅读代码的时候能更容易地解读应用内部的状态改变。此外，这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。有了它，我们甚至可以实现如时间穿梭般的调试体验。

> 由于 store 中的状态是响应式的，在组件中调用 store 中的状态简单到仅需要在计算属性中返回即可。触发变化也仅仅是在组件的 methods 中提交 mutation。

## vuex核心概念
```js
// vuex 基本功能概览
const store = new Vuex.Store({

  // state 用来存储多个组件实例需要共用的状态
  state: { 
    count: 0
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },  

  // getters，从store.state中派生的状态，用于进行一些state值初步的计算或过滤。
  getters: { 
    doneTodosCount() {
      return this.$store.state.todos.filter(todo => todo.done).length
    }
  },

  // 为了方便调试，禁止直接修改state，mutations 用于更变state的操作，同步修改
  mutations: {
    increment (state) {
      state.count++
    }
  },

  // 将异步操作单独提出来，用actions来管理，异步操作完成，修改state也是通过mutations来变更状态
  actions: { 
    // 参数为context，结构出其commit属性, context.commit提交一个 mutation
    incrementAsync ({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  },

  // 对于非常复杂的应用，store对象会变得十分臃肿，modules属性用于将store分割为模块。
  modules: {
    a: moduleA,
    b: mouduleB
  }
})

// 每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块
const moduleA = {
  state: { ... },
  mutations: { ... },
}
const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

store.state.a // => moduleA 的状态
store.state.b // => moduleB 的状态
```
### state属性
#### 单一状态树
Vuex使用单一状态树，用一个对象就包含了全部的应用层级状态。每个应用仅包含一个store实例，好处：
- 单一状态树可以直接定位任一特定状态片段
- 在调试的过程中也可以轻易的取得整个应用状态的快照。

单状态树何模块化并不冲突
f在Vue组件中获得Vuex状态
由于Vuex的状态存储是响应式的，从store实例中读取状态最简单的方法就是**在计算属性中返回某个状态**：
```js
// 没当store.state.count变化的时候，都会重新求取计算属性，并触发更新相关联的DOM
const Counter = {
  template: '<div>{{ count }}</div>',
  computed: {
    count () {
      return store.state.count
      // 将store的实例注入到所有的子组件中后 
      // return this.$store.state.count
    }
  }
}

// 新建Vue实例时，使用store属性，可以将store的实例注入到所有的子组件中
const app = new Vue({
  el: '#app',
  store,
  components: { Counter },
  template: `
    <div class="app">
      <couter></counter>
    </div>
  `
})
```
#### mapState辅助函数
当组件需要多个状态的时候，状态声明为计算属性显得有点冗余，可以使用mapState辅助函数生成计算属性。
```js
import { mapState } from 'vuex'

export default {
  // ... 
  // 一. mapState(对象)
  computed: mapState({
    // 1.参数值是一个箭头函数
    count: state => state.count,

    // 2.参数值是一个字符串， 等价于 state => state.count
    countAlias: 'count',

    // 3.参数值是一个常规函数，可以用this获取局部状态
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })

  // 二. mapState(数组)
  // 当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。
  computed: mapState(['count']) // 映射 this.count 为 store.state.count
}
```
#### 对象展开运算符
```js
computed: {
  localComputed () { /* ... */},

  // 使用对象扩展运算符将此对象混入到外部对象中
  // 对象的扩展运算符：https://www.yuque.com/guoqzuo/js_es6/rxu7ms#0d337474
  ...mapState({
    // ...
  })
}
```

### getters属性
当多个组件需要用到某个state属性计算或过滤后的数据，可以将使用getters属性

```js
// 如果多个组件需要用到 doneTodosCount 这个属性，会比较繁琐
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}

// 将 doneTodosCount 封装到 getters
// 类似于计算属性，只有当它的依赖值发生了改变才会被重新计算
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    // 暴露属性-1，通过属性访问时，**会缓存结果**
    // store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
    // 暴露属性-2：第二个参数为getters
    // store.getters.doneTodosCount // -> 1
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    }

    // 暴露方法, getter 在通过方法访问时，每次都会去进行调用，**不会缓存结果**
    // store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
    getTodoById: (state) => (id) => {
      return state.todos.filter(todo => todo.id === id)
    }
  }
})
```
#### mapGetters 辅助函数
mapGetters 辅助函数可以将 store 中的 getter 映射到局部计算属性：
```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    // 1.使用数组作为参数
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])

    // 2.使用对象作为参数
    ...mapGetters({
      // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
      doneCount: 'doneTodosCount'
    })
  }
}
```

### mutations属性
### actions属性
### modules属性
