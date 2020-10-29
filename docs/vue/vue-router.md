# Vue Router路由

## 从零开始简单的路由
简单原理：根据url路径改变渲染的模板

- window.location.pathname 为当前url的路径
- 利用render函数、计算属性动态改变渲染的模板
- 注意：前提条件是需要开启http服务，且所有请求都需要指向一个页面。

```html
<!-- 0_从零开始简单的路由.html -->
<body>
  <div id="app">
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script>
    const NotFound = { template: '<p>Page not found</p>'}
    const Home = { template: '<p>Home page</p>'}
    const About = { template: '<p>About page</p>'}

    const routes = {
      '/': Home,
      '/about': About
    }

    let app = new Vue({
      el: '#app',
      data: {
        currentRoute: window.location.pathname
      },
      computed: {
        ViewComponent() {
          return routes[this.currentRoute] || NotFound
        }
      },
      render(h) {
        return h(this.ViewComponent)
      }
      // 等价于
      // render: function(h) {
      //   return h(this.ViewComponent)
      // }
    })
  </script>
</body>
```
### 利用node来开启HTTP服务
- 1.在 0_从零开始简单的路由.html 目录下，打开控制台
- 2.npm init 初始化node，安装express
- 3.创建index.js文件，并写入下面的代码，开启http服务，并将所有请求重定向到一个页面
- 4.node index.js后，浏览器访问 127.0.0.1:3000 测试，效果类似于vue-router的history模式
  - 访问 http://127.0.0.1:3000   页面显示 Home page
  - 访问 http://127.0.0.1:3000/about  页面显示 About page
  - 访问未知页面 http://127.0.0.1:3000/test  页面显示 Page not found
```js
// index.js
const express = require('express');
const fs=require("fs");
const app = express();

app.use('*', function(req, res) {
  console.log('接收到请求')
  console.log(req.baseUrl)

  res.sendfile('0_从零开始简单的路由.html')
})

app.listen(3000, function() {  
    console.log("server start at 127.0.0.1:3000");
});
```

## vue-router(官方路由)
对于大多数单页面应用(SPA)，都推荐使用官方支持的 vue-router 库。

- vue-router [开源地址](https://github.com/vuejs/vue-router)
- vue-router [官方文档](https://router.vuejs.org/zh/)

### 安装
#### 直接下载/CDN 
https://unpkg.com/vue-router/dist/vue-router.js

使用示例
```html
<!-- 先加载vue，再加载vue-router -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
```
#### npm安装
npm install vue-router

使用示例
```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

### 介绍
> 对于TypeScript用户来说，vue-router@3.0+ 依赖 vue@2.5+，反之亦然。

Vue Router是Vue.js官方的路由管理。和Vue.js核心深度集成。自定义了两个组件RouterView及RouterLink，均使用render函数渲染，包含功能：

- 嵌套的路由/视图表
- 模块化、基于组件的路由配置
- 路由参数、查询、通配符
- 基于Vue.js过渡系统的视图过渡效果
- 细粒度的导航控制
- 带有自动激活的 CSS class的链接
- HTML5历史模式或hash模式，在IE9中自动降级
- 自定义的滚动条行为

vue-router 3.1.3版本源码只有 2900 行左右，有时间可以仔细看看

### 基础
#### 起步(第一个vue-router页面)
```html
<body>
  <div id="app">
    <h1>Hello App!</h1>
    <p>
      <!-- router-link标签会默认渲染为一个a标签，to属性用来指定链接-->
      <router-link to="/foo">Go to Foo</router-link>
      <router-link to="/bar">Go to Bar</router-link>
    </p>

    <!-- 路由出口，路由匹配到组件将在这里渲染-->
    <router-view></router-view>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
  <script>

    // 1. 定义 (路由) 组件。
    const Foo = { template: '<p>foo page</p>'}
    const Bar = { template: '<p>bar page</p>'}

    // 2. 定义路由
    const routes = [
      { path: '/foo', component: Foo },
      { path: '/bar', component: Bar }
    ]

    // 3. 创建 router 实例，然后传 `routes` 配置
    const router = new VueRouter({
      routes // 相当于 routes: routes
    })

    let app = new Vue({
      el: '#app',
      router,
    })
    // 也可以这样写
    // const app = new Vue({
    //   router
    // }).$mount('#app')
  </script>
</body>
```

- 可以在任何组件内通过 this.\$router 访问路由器，也可以通过 this.\$route 访问当前路由
- 使用 this.$router 的原因是我们并不想在每个独立需要封装路由的组件中都导入路由。
- 注意，当 router-link 对应的路由匹配成功，将自动设置 class 属性值 .router-link-active

```js
// Home.vue
export default {
  computed: {
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
```

#### 动态路由匹配
动态路径参数(dynamic segment) 可以将某种模式匹配到的所有路由都映射到同一个组件。

- 路径参数使用 **:** 标记, 当匹配到路由时，参数值会被设置到 this.$route.params，可以在每个组件中使用
```js
// 下面的例子中 /user/foo 和 /user/bar 都将映射到相同的路由
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```
- \$route.params相关

模式 | 匹配路径 | $route.params
--- | --- | ---
/user/:un | /user/guoqzuo | { un: 'guoqzuo'}
/user/:un/post/:post_id | /user/guoqzuo/post/666 | { un: 'guoqzuo', post_id: '123' }

- \$route.query 等其他参数，以下图为例
  - name 路由名称
  - fullPath: "/user/kevin?a=b&k=a"
  - hash: ""
  - name: undefined
  - params: { id: "kevin" }
  - path: "/user/kevin"
  - query: { a: "b", k: "a" }

![1_路由route值.png](/images/vue/1_路由route值.png)

##### 响应路由参数的变化
使用路由参数时（例如从/user/foo导航到/user/bar），原来的组件实例会被复用。**这也意味着组件生命周期的钩子函数不会再被调用。** 当组件复用时，想对路由参数的变化做出响应，有两种方法：

- 可以使用watch来监听 \$route 对象:
- 使用 v2.2 中引入的 beforeRouteUpdate 导航守卫
```js

// 组件复用时，对路由参数变化做出响应的方法
const User = {
  template: '...',

  // 方法1:
  watch: {
    '$route' (to, from) {
      // 对路由变化做出响应
      // to, from 都是一个 $route 对象
    }
  },

  // 方法2: 
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
    // 如果这里不调用next()，RouterView不会加载新的页面
  }
}
```
##### 捕获所有路由或404
- 匹配任意路径，使用通配符 (\*)，使用通配符路由时，需要确保路由的顺序正确(一般放到最后，用于404)
- 通过 this.$route.params.pathMatch 可以获取匹配到的信息
```js
{
  path: '*' // 匹配所有路径
}
{
  path: '/user-*' // 匹配以 'user-' 开头的任意路径
}

// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'

// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```
##### 高级匹配模式与匹配优先级
- vue-router 使用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0) 作为路径匹配引擎，所以支持很多高级的匹配模式，如：可选的动态路径参数、匹配0个或多个、一个或多个，甚至自定义正则匹配。
- 谁先定义的，谁的优先级就最高。

#### 嵌套路由
嵌套路由指的是 router-view 里面再嵌套 router-view 的情况。
```html
<div id="app">
  <router-view></router-view>  
</div>

<script>
  const User = {
    template: `
      <div class="user">
        <h2> User {{ $route.params.id }} </h2>
        <router-view></router-view>
      </div>
    `
  }
  const UserHome = { template: '<p>UserHome</p>' }
  const UserProfile = { template: '<p>UserProfile</p>' }
  const UserPosts = { template: '<p>UserPosts</p>' }
  const router = new VueRouter({
    routes: [
      {
        path: '/user/:id',
        component: User,
        children: [
          {
            // 当 /user/:id 匹配成功，
            // UserHome 会被渲染在 User 的 <router-view> 中
            path: '',
            component: UserHome
          },
          {
            // 当 /user/:id/profile 匹配成功，
            // UserProfile 会被渲染在 User 的 <router-view> 中
            path: 'profile',
            component: UserProfile
          },
          {
            // 当 /user/:id/posts 匹配成功
            // UserPosts 会被渲染在 User 的 <router-view> 中
            path: 'posts',
            component: UserPosts
          }
        ]
      }
    ]
  })
</script>
```
- 以 / 开头的嵌套路径会被当做根路径，可以充分的使用嵌套组件而无须设置嵌套的路径。
```js
// 访问 /testuser 可以直接使用嵌套组件
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        {
          path: '/testuser',
          component: TestUser
        }
      ]
    }
  ]
})
```
- 如果嵌套的路由没有匹配到，会影响上级路由的显示，上面的例子中，User里的router-view如果没匹配到，整个User都不会显示。

#### 编程式的导航
##### router.push
> router.push(location, onComplete?, onAbort?)

声明式 | 编程式
--- | ---
\<router-link :to="..."\> | router.push(...)

想要导航到不同的 URL，则使用 router.push 方法（内部可以使用this.\$router.push）。这个方法会向 history 栈添加一个新的记录，当用户点击浏览器后退按钮时，会回到之前的 URL。
```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```
- **注意：如果提供了 path，params 会被忽略**, 需要提供路由的 name 或手写完整的带有参数的 path
```js
onst userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```

##### router.replace
> router.replace(location, onComplete?, onAbort?)

声明式 | 编程式
--- | ---
\<router-link :to="..." replace \> | router.replace(...)

跟 router.push 类似，唯一的不同是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

##### router.go
参数是一个整数，在 history 记录中向前或者后退多少步，类似 window.history.go(n)。
```js
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)
```
##### 操作history
- router的api效仿了 window.history API 

router API | window.history API
--- | ---
router.push | window.history.pushState
router.replace | window.history.replaceState
router.go | window.history.go

- Vue Router 的导航方法 (push、 replace、 go) 在各类路由模式 (history、 hash 和 abstract) 下表现一致。

#### 命名路由
有时候，通过一个名称来标识一个路由会更方便
```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      name: 'user',
      component: User
    }
  ]
})
```
跳转到命名路由的两种方式
- router-link，to属性传一个对象
```html
<!-- 把路由导航到 /user/123 -->
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```
- router.push
```js
// 把路由导航到 /user/123
router.push({ name: 'user', params: { userId: 123 }})
```
#### 命名视图
如果需要同级展示多个视图，可以使用命名视图, 如果 router-view 没有设置名字，那么默认为 default。
```html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```
同一个路由渲染多个视图就需要多个组件，需要使用components参数
```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```
##### 嵌套命名视图
![1_2_嵌套命名视图.png](/images/vue/1_2_嵌套命名视图.png)
- Nav 只是一个常规组件。
- UserSettings 是一个视图组件。
- UserEmailsSubscriptions、UserProfile、UserProfilePreview 是嵌套的视图组件。
```html
<!-- UserSettings.vue -->
<div>
  <h1>User Settings</h1>
  <NavBar/>
  <router-view/>
  <router-view name="helper"/>
</div>

<script>
{
  path: '/settings',
  // 你也可以在顶级路由就配置命名视图
  component: UserSettings,
  children: [{
    path: 'emails',
    component: UserEmailsSubscriptions
  }, {
    path: 'profile',
    components: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}
</script>
```

#### 重定向和别名
##### 重定向
可以将某个url重定向到另一个url，比如，将 /a 重定向到 /b，在routes数组元素里使用redirect属性即可，redirect属性有三种参数类型：
- 字符串，直接定向到另一个链接
- 对象，重定向到一个命名的路由
- 函数，动态返回重定向目标
```js
const router = new VueRouter({
  routes: [

    // 1.
    { path: '/a', redirect: '/b' },

    // 2.
    { path: '/c', redirect: { name: 'foo' }},

    // 3.
    { path: '/d', redirect: to => {
      // 方法接收 目标路由(to) 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
```
注意：导航守卫并没有应用在跳转路由上，而仅仅应用在其目标上。上面的例子中，为 /a, /c, /d 路由添加一个 beforeEach 或 beforeLeave 守卫并不会有任何效果。

##### 别名
路由访问/b 时，url保持为/b，实际显示的是/a的页面
```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```
#### 路由组件传参
如果组件内部使用了 $route 的相关属性值，组件和路由会形成高耦合，组件只能在特定的url上使用，限制了其灵活性。可以通过路由传参的方式，将组件和路由解耦
```js
// 这里组件里使用了路由的参数，路由和组件高耦合
const User = {
  template: '<p> User {{ $route.params.id }} </p>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})

// 使用props传参来解耦, 这样可以在任何地方使用该组件
const User = {
  props: ['id'],
  template: '<p> User {{ id }} </p>'
}
const router = new VueRouter({

  // 如果 props 被设置为 true，route.params 将会被设置为组件属性
  routes: [
    { path: '/user/:id', component: User , props: true },

    // 如果包含命名视图，必须为每个视图加上props属性
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```
##### props的值有三种
- 布尔模式, 如果 props 被设置为 true，route.params 将会被设置为组件属性
- 对象模式, 如果 props 是一个对象，它会被按原样设置为组件属性。当 props 是静态的时候有用。
```js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```
- 函数模式, 可以创建一个函数返回props 
```js
// URL /search?q=vue 会将 {query: 'vue'} 作为属性传递给 SearchUser 组件
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```
#### HTML5 History 模式
vue-router 默认为 hash 模式, 使用hash来模拟完整的url，当URL改变时，页面不会重新加载, 如果不想使用这种模式，可以使用history模式(这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。)
```js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```


路径 | 本地File访问-hash | http服务 - hash |  http服务 - history
--- | --- | --- | ---
/ | 4_嵌套路由.html#/  | http://127.0.0.1:3000/#/ |  http://127.0.0.1:3000/
/bar | 4_嵌套路由.html#/bar | http://127.0.0.1:3000/#/bar | http://127.0.0.1:3000/bar
/testuser | 4_嵌套路由.html#/testuser | http://127.0.0.1:3000/#/testuser | http://127.0.0.1:3000/testuser


```js
// http服务 配置 node ,所有路由均指向4_嵌套路由.html
const express = require('express');
const fs=require("fs");
const app = express();

app.use('*', function(req, res) {
  console.log('接收到请求')
  console.log(req.baseUrl)

  res.sendfile('4_嵌套路由.html')
})

app.listen(3000, function() {  
    console.log("server start at 127.0.0.1:3000");
});
```
更多后台配置，参考：[后端配置例子](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)


### 进阶
#### 导航守卫
导航表示路由正在发生改变，守卫的意思类似于钩子函数，从一个链接跳转到另一个链接过程中会触发不同的钩子函数，在函数内部可以对跳转进行拦截处理。
- 路由钩子函数和路由守卫的区别，钩子函数没有next参数，不可以对路由进行拦截。路由守卫函数有next参数，可以对路由进行拦截

##### 全局前置守卫 router.beforeEach()
```js
const router = new VueRouter({...})

router.beforeEach((to, from, next)=> {
  // 
})
```
当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。如果不调用第三个参数resolve这个钩子，那么导航不会完成跳转。
每个守卫方法接收3个参数:
- to 类型为Route, 将要进入的目标路由对象
- from 类型为Route, 导航正要离开的路由
- next 类型为Function，一定要调用该方法来resolve这个钩子, 执行效果依赖该参数
  - next() 进入管道中的下一个钩子，如果全部ok，则会跳转
  - next(false) 中断当前的导航，如果URL改变了，那边URL地址会重置到from路由对应的地址
  - next('/') 或 next({ path: '/' }) 跳到一个不同的地址
  - next(error) (2.4.0+) 如果参数是一个 Error 实例，导航会被终止且该错误会被传递给 router.onError() 注册过的回调。

应用：在每次跳转前检查token信息，如果过期，则跳转到登陆页面
```js
router.beforeEach((to, from, next) => {
  if (window.localstorage.getItem('token')) {
    next();
  } else {
    next('/login');
  }
})
```
##### 全局后置钩子 router.afterEach()
钩子和守卫不同的是，钩子没有next参数，跳转到新的页面后调用。
```js
router.afterEach((to, from)=> {
  // 可以用来将滚动重置，如果一个页面比较长，滚动到某个位置，跳转到另一个页面，滚动默认在上一次停留的位置, 可以通过这个钩子，返回顶部
  window.scrollTo(0, 0)
})
```
##### 全局解析守卫 router.beforeResolve()
> 2.5.0 新增

和router.beforeEach类似，区别是在导航被确认之前，且所有组件内守卫何异步路由组件被解析之后，解析守卫才被调用，在 router.afterEach() 之前

##### 路由独享的守卫 beforeEnter()
```js
// 可以在定义路由时，单独为某个路由设置守卫
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

##### 组件内的守卫 beforeRoute*()
可以在路由组件内直接定义下面的路由守卫
- beforeRouteEnter() 在进入该组件前，this无法使用，组件实例还没被创建
- beforeRouteUpdate()  2.2新增，路由改变，组件复用时调用
- beforeRouteLeave() 导航离开该组件的对应路由时调用
```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      // 通过 `vm` 访问组件实例，其他组件内的守卫无法通过回调来调用实例。直接用this就可以
    })
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`

    // 可以用来在跳转下一页时确认提示
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}
```
##### 完整的导航解析流程
- 1.导航被触发
- 2.失活的组件调用组件内的离开守卫 beforeRouteLeave()
- 3.调用全局的beforeEach() 守卫
- 4.在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)
- 5.在路由配置里调用 beforeEnter()
- 6.解析异步路由组件
- 7.在激活的组件里调用 beforeRouteEnter()
- 8.全局调用beforeResolve() 守卫
- 9.导航被确认
- 10.调用全局的 afterEach 钩子
- 11.触发DOM更新
- 12.用创建好的组件实例，调用组件里 beforeRouteEnter 守卫中传给 next 的回调函数

#### 路由元信息
定义路由的时候，可以配置meta字段，用途：在全局导航守卫中检查元字段，看是否需要检查权限
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```
路由匹配到的路由记录会存放到 \$route.matched 数组，通过获取对应的meta字段来进行校验
```js
router.beforeEach((to, from, next) => {

  // .some() 对数组的每一项运行给定函数, 如果函数对数组的任一项返回的true，return true
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```
#### 过渡效果
RouterView 是基本的动态组件，所以我们可以用 transition 组件给它添加一些过渡效果
```html
<transition>
  <router-view></router-view>
</transition>
```
##### 单个路由的过渡
上面的用法为每个组件都设置了一样的过渡效果，如果想让每个组件有不同的过渡效果，可以在各路由组件内使用 transition 设置不同的name
```js
const Foo = {
  template: `
    <transition name="slide">
      <div class="foo">...</div>
    </transition>
  `
}

const Bar = {
  template: `
    <transition name="fade">
      <div class="bar">...</div>
    </transition>
  `
}
```
##### 基于路由的动态过渡
可以根据当前路由与目标路由的变化关系，动态设置过渡效果，[完整示例](https://github.com/vuejs/vue-router/tree/dev/examples/transitions)
```html
<!-- 使用动态的 transition name -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>

<script>
  // 在父组件内，watch $route，决定使用哪种过渡
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }
</script>
```

#### 数据获取
进入某个路由，需要从服务器获取数据，有两种方式实现
- 导航完成后获取，先完成导航，在接下来的组件生命钩子中获取数据，数据获取期间显示 ‘加载中’之类的提示
- 导航完成前获取, 导航完成前，在路由进入的守卫中获取数据，数据获取成功后执行导航
##### 导航完成后获取数据
```html
<template>
  <div class="post">
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.fetchData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace getPost with your data fetching util / API wrapper
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
</script>
```
##### 导航完成前获取数据
在导航到新的路由前获取数据。在to的组件的 beforeRouteEnter 守卫中获取数据，当数据获取成功后调用 next 方法。为后一个页面获取数据时，页面会停留在当前页，需要给一个加载的提示，以及如果数据获取错误，给出错误提示
```js
export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // 路由改变前，组件就已经渲染完了
  // 逻辑稍稍不同
  beforeRouteUpdate (to, from, next) {
    this.post = null
    getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    })
  },
  methods: {
    setData (err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    }
  }
}
```
#### 滚动行为
当切换到新的路由，想要页面滚到顶部，或者保持原先的滚动位置，就像重新加载页面一样，vue-router支持在路由切换时，定义页面如何滚动 , **该功能只支持在history.pushState的浏览器中可用**

创建Router实例时，可以提供scrollBehavior方法，返回值格式:
- { x: number, y: number }
- { selector: string, offset? : { x: number, y: number }} (offset 只在 2.6.0+ 支持)

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置

    // 示例1
    return { x: 0, y: 0 }

    // 示例2
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }

    // 示例3 模拟“滚动到锚点”的行为
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
})
```
使用路由元信息，更细粒度的控制滚动, [完整示例](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js)

##### 异步滚动 2.8.0新增
scrollBehavior可以返回一个Promise
```js
scrollBehavior (to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 500)
  })
}
```

#### 路由懒加载
打包构建应用时，js包会变的比较大，影响页面加载。可以把不同的路由对应的组件分割成不同的代码块，当路由被访问时才加载对应的组件。

结合Vue的异步组件 + Webpack的代码分割功能，可以轻松实现路由懒加载
- 1.将异步组件定义为一个Promise工厂函数
```js
const Foo = () => Promise.resolve({ /* 组件定义对象 */ })
```
- 2.在webpack中，使用动态import语法来定义代码分块点
```
import('./Foo.vue') // 返回Promise
```
> 如果使用的是Babel，需要添加 syntax-dynamic-import 插件，Babel 才能正确地解析语法。

结合上面的两者，就是如何定义一个能被Webpack自动代码分割的异步组件
```js
const Foo = () => import('./Foo.vue')
```
##### 使用注释将组件按组分块
如果想把某个路由下的所有组件都打包在同个异步块中，需要特殊的注释语法提供块名称 (Webpack 2.4+)
```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

### TODO 
[完整API](https://router.vuejs.org/zh/api/#router-link) 整理

- router-link 属性
  - tag 使用 tag 属性指定标签名，依旧会监听点击，触发导航。
  ```html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- 渲染结果 -->
  <li>foo</li>
  ```
  - active-class, 设置链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 linkActiveClass 来全局配置。默认值为 "router-link-active"

## 整合第三方路由
第三方路由这里暂不讨论，参考 [第三方路由](https://cn.vuejs.org/v2/guide/routing.html#%E6%95%B4%E5%90%88%E7%AC%AC%E4%B8%89%E6%96%B9%E8%B7%AF%E7%94%B1)