# Vue3 options 改 setup 快速参考

这里主要介绍 setup 写法相关，TS 相关修改参考：[ts 常见问题处理](/ts/ts-best-guide.html#ts-常见问题处理)

vue 官方迁移指南：[Vue 3 Migration Guide](https://v3-migration.vuejs.org/)

## name

### 组件 name 属性问题

```vue
<script lang="ts" setup>
// 业务逻辑
</script>
<script lang="ts">
export default {
  name: "XxxComp",
};
</script>
```

### Component name "Xxx" should always be multi-word

Xxx.vue 可以不修改组件名，修改 export default name 属性即可

```vue
<!-- Xxx.vue -->
<script lang="ts">
export default {
  name: "XxxXxx",
};
</script>
```

## data

### 对象用 ref 还是 reactive

一般数组、字符串等使用 ref, 对象可以使用 reactive。

但下面的情况需要使用 ref, 以 form 为例

- 对于 form = xx 赋值的情况，reactive 原始值丢失，建议使用 ref

对于不会修改的对象，比如 rules，可以使用 reactive

### reactive 怎么置空

对象有情况操作，虽然可以用下面的方法，但还是建议用 ref

```ts
const info = reactive<{ name: string; age: string; gender: string }>({
  name: "1",
  age: "2",
  gender: "3",
});
```

重置方法

```ts
const clear = () => {
  const keys = Object.keys(info);
  let obj: { [name: string]: string } = {};
  keys.forEach((item) => {
    obj[item] = "";
  });
  Object.assign(info, obj);
};
```

参考：[vue3 关于 reactive 的重置问题及解决](https://www.jb51.net/article/249500.htm)

### this.xxx 与局部变量 xxx 重名导致的 bug，需要全局搜索检查 .value =

局部变量名和 data 变量名重复，如果有赋值，只是修改的局部变量，而不是 data，导致功能异常

```ts
const xxxList = xxxList.value;
// 对 xxxList 进行修改
// ...
xxxList.value = xxxList; // 会产生问题
// 原先不会有问题的代码 this.xxxList = xxxList
```

## methods

注意：

- 对于没有使用的 methods，全局搜索，看是否有通过 $refs 调用。如果有，加上 defineExpose 暴露该方法到外部
- 对于大量 methods，手动修改比较快的方法：1、先粘贴所有 const 2、在方法后面加 = 3、在() 后面粘贴 => 4、挪动 async 到 () 之前

```ts
const xx = () => {};

// 假设没使用，检查是否有外部调用，有就暴露
defineExpose(xx);
```

## mounted

```js
onMounted(() => {});
```

## watch

注意：

- 防止代码补全时 watch 自动从 'fs' 引入，要从 'vue' 引入；vue3 watch Overload 1 of 4, (No overload matches this call. Overload 1 of 4, `(filename: PathLike, options: (WatchOptions & { encoding: "buffer"; }) | "buffer", listener?: WatchListener<Buffer> | undefined): FSWatcher`, gave the following error.)

- watch(formData.value.name, () => {}) watch 类型不对；Invalid watch source: A watch source can only be a **getter/effect function**, a **ref**, a **reactive object**, or an **array** of these types.

```ts
watch: {
    exportData(val, old) {
        if (val) {
            this.xxxDownload(val.dta)
        }
    }
}
```

改为

```ts
watch(exportData, (newVal, old) => { 不需要加 xx.value })
```

注意设计到 value.xx 下面的属性，需要使用函数 () => xxx.value.xx

```ts
watch(
  () => formData.value.xxxName,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      // xx
    }
  },
  { immediate: true }
);

watch(
  editData,
  (val, oldVal) => {
    // xxx
  },
  { immediate: true, deep: true }
);
```

## Props

注意：对于 vue2 没有加 required 的，需要使用 ?: 可选参

```ts
props: {
    exportData: {
        type: Object,
        default: null
    }
}
```

改为

```ts
const props = withDefaults({
    defineProps<{
        dialogVisible?: boolean;
        dialogParams?: Record<string, any>;
    }>(),
    {
        dialogVisible: false,
        dialogParams: () => ({})
    }
})

const { dialogVisible, dialogParams } = toRefs(props);
```

### No overload matches this call, props 默认值不要为 null

```ts
const exportData: Ref<Record<string, unknown> | null>;
```

No overload matches this call. The last overload gave the following error.ts(2769)

```ts
const props = withDefaults({
    defineProps<{
        exportData: Record<string, unknown> | null;
    }>(),
    {
        exportData: null
    }
})
```

改为

```ts
const props = withDefaults({
    defineProps<{
        exportData: Record<string, unknown>;
    }>(),
    {
        exportData: () => ({})
    }
})
```

### Cannot read property 'content' of null - defineProps 中不能包含变量

vue3 Syntax Error: TypeError: Cannot read property 'content' of null, 参考 [Vue@3 - Syntax Error: TypeError: Cannot read property 'references' of null 可能的问题汇总](https://zhuanlan.zhihu.com/p/425771208)

Module Error (form ./node_modules/vue-loader/dist/index.js):

@vue/compiler-sfc `defineProps()` in script setup cannot reference locally declared variables because it will be hoisted outside of the setup() function. If your component options require initialization in the module scope, use a separate normal script to export the options instead.

```ts
// defineProps 中不能包含变量 xxxXX 方法，如果调用函数，初始赋值不会成功
const xxxXX = () => {
    // 逻辑
    return '数据'
}

const props = withDefaults({
    defineProps<{
        info: '数据'
    }>(),
    {
        // info: xxxXX(), // error
        info: () => { // ok
            // 逻辑
            return '数据'
        }
    }
})
```

## emits

```ts
const emit = defineEmits(["xxx", "close"]);

emit("xxx"); // 等价于 this.$emits('xxx')
```

## create 改 onBeforeMount

vue2 升级 vue3，建议逆序，从最下面的 methods 依次向上。

## vuex - store

一般 vue3 状态管理建议使用 pinia，但对于大型老项目，可以先使用 vuex，后面在迁移 pinia

### mapGetters

```js
computed: {
    ...mapGetters('aModule/aFunc', ['xxA', 'xxB'])
}
```

修改为

```ts
import { _mapGetters } from "@/core/";

const { userInfo } = _mapGetters("global");
const { xxA } = _mapGetters("aModule/aFunc");

// 使用时，xxA.value
```

其中 \_mapGetters 实现

```ts
import { useStore } from "@/core/store";
import { computed } from "vue";

/**
 * @description vuex mapGetters helpers
 * @param moduleName 模块名: 'global' 或 'xxModule/xxFunc' 等
 * @returns _mapGetters('xxModule/xxFunc') => { xxA: xx, xxB:xx }
 *          _mapGetters('global') => { userInfo: xxx }
 */
const _mapGetters = (moduleName: string) => {
  const store = useStore();
  const info = Object.fromEntries(
    Object.keys(
      store.getters
        .filter((getter) => getter.indexOf(`${moduleName}/`) === 0)
        .map((getter) => {
          // getter 值 { 'global/userInfo': {}, 'xxModule/xxFunc/xxA': {}, 'xxModule/xxFunc/xxB': {}, }
          return [
            getter.split(`${moduleName}/`)[1],
            computed(() => store.getters[`${getter}`]),
          ];
        })
    )
  );
  return info;
};
export { _mapGetters };
```

## vue-router

### this.$router.push 与 $route

注意：

- useRouter/userRoute 放到顶部(import 后)，不要放到函数内部
- 除了 this.$router 替换为 router 外，检查 template 直接使用 $route 的情况

```ts
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
router.push();
```

### beforeRouteLeave 钩子

next() 不再需要，默认不拦截， return false 表示拦截

```ts
beforeRouteLeave(to, from, next) => {
    next(vm => vm.emit('xxx')
}
```

改为

```ts
import { onBeforeRouteLeave } from "vue-router";

onBeforeRouteLeave((to, from) => {
  emit("xxx");
});
```

vue-router 3.x 与 vue-router 4.x 对比

```ts
// vue-router 3.x
beforeRouteLeave(to, from, next) {
}

// vue-router 4.x
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
onBeforeRouteLeave((to, from) => {
    const answer = window.confirm('Do you xxx?')

    // cancel navigation and stay on the same page
    if (!answer) return false;
})
```

## this.$refs 与 ref

注意：变量命名建议为 xxRef，一看就知道是组件引用

```ts
const xxRef = ref();
xxRef.value; // 等价于之前的 this.$refs.xxRef
```

### this.$refs.xx 拿不到子组件的值

setup 写法时，需要子组件使用 defineExpose 暴露变量，父组件才能使用 xxRef.value.xxx 拿到值，建议使用 options chain(?.) 语法 xxxRef.value?.xx

```ts
defineExpose({
  xxxInfo,
  xxxProps,
  xxMethods,
});
```

### ref 与 :ref，不使用 :变量形式

注意: `:ref` 时拿不到值得，需要使用 ref。

主要是因为之前可能会在 for 循环使用 `:ref="xxxRef${index}"` 变量形式，对于 v-for 多个的情况使用

```ts
const xxRefs = ref([]);
// xxRefs.value 为 数组
```

### 多个 refs, 不符合 v-for 场景，使用 curInstance.proxy?.$refs 代替 this.$refs

table 中有多个 refs / setup table 中的多个 refs，且 v-for 的场景拿不到 refs 值，旧代码迁移到 vue3 时，可以使用 hack 方法拿到原先的 this.$refs

```ts
import { getCurrentInstance } from "vue";

const curInstance: any = getCurrentInstance();
curInstance.proxy?.refs; // 相当于 this.$refs
```

## this.$utils、this.$cookies - Vue 原型属性

```ts
import { app } from "@/core/";

const utils = app.config.globalProperties.$utils;
const cookies = app.config.globalProperties.$cookies;
```

## directives 指令

vue3 指令不在支持 bind 钩子函数, 改为 mounted 方法

vu2 directives Hook Functions

- bind，只调用一次，指令第一次绑定到元素时调用，可以进行初始化操作
- inserted，插入到父节点时
- update
- unbind 只调用一次，指令与元素解绑时调用

vue3 新的钩子，参考：[custom-directives](https://v3-migration.vuejs.org/breaking-changes/custom-directives.html#custom-directives)

- created - 新增！在元素的 attribute 或事件监听器被应用之前调用。
- bind → beforeMount
- inserted → mounted
- beforeUpdate：新增！在元素本身被更新之前调用，与组件的生命周期钩子十分相似。
- update → 移除！该钩子与 updated 有太多相似之处，因此它是多余的。请改用 updated。
- componentUpdated → updated
- beforeUnmount：新增！与组件的生命周期钩子类似，它将在元素被卸载之前调用。
- unbind -> unmounted

```ts
const MyDirective = {
  created(el, binding, vnode, prevVnode) {}, // 新增
  beforeMount() {},
  mounted() {},
  beforeUpdate() {}, // 新增
  updated() {},
  beforeUnmount() {}, // 新增
  unmounted() {},
};
```

例子

```vue
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus(),
};
</script>

<template>
  <input v-focus />
</template>
```

### 自定义指令，el-select 下拉加载更多逻辑

vue2 写法

```vue
<template>
  <el-select
    v-model="formData.list"
    v-el-select-loadmore="listLoadMore"
  ></el-select>
</template>
<script>
export default {
  // 指令
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取 ElementUI 定义好的 scroll 盒子
        const selectWrapEl = el.querySelector(
          ".el-select-dropdown .el-select-dropdown_wrap"
        );
        selectWrapEl.addEventListener("scroll", function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          // 如果滚动到了底部
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
};
</script>
```

vue3 修改为

```vue
<template>
  <el-select
    v-model="formData.list"
    v-el-select-load-more:customPopperClass="listLoadMore"
    popper-class="customPopperClass"
  ></el-select>
</template>
<script lang="ts" setup>
// TODO: 这里没有 unbind 可能会有异常
const vElSelectLoadMore = {
  mounted(el, binding) {
    // vue3 el.querySelector 查不到 select 弹窗面板，需要使用 x-xxx:arg 结合 popper-class 来找到对应滚动容器
    const selectWrapEl = document.querySelector(
      `.${binding.arg} .el-select-dropdown__wrap`
    ) as HTMLElement;
    selectWrapEl.addEventListener("scroll", function () {
      // @ts-ignore
      const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
      // 如果滚动到了底部
      if (condition) {
        binding.value();
      }
    });
  },
};
</script>
```

### 普通 v-load-more 指令

```ts
// global/composition/use-load-more.ts
export const useLoadMore = () => {
    let loadMoreMethod: any = null; // 用于 unbind 事件
    const vLoadMore = {
        mounted(el, binding) {
            loadMoreMethod = () => { 
                // 前端页面缩放时，页面可能有小数点，缩放比列较大时，可能差 1-2
                // 为了fix缩放时无法触底的问题，加上误差处理
                const condition = el.scrollHeight - Math.ceil(el.scrollTop || 0) <= el.clientHeight + 2;
                if (condition) {
                    binding.value()
                }
            }
            el.addEventListener('scroll', loadMoreMethod);
        }
        unmounted(el) {
            el.removeEventListener('scroll', loadMoreMethod)
        }
    }
    return { vLoadMore }
}
```

## mixins

在 vue3 中，不推荐使用 mixins，建议全部删除，使用 composition 替代。

这样多有变量都知道从哪里来的。可维护性能大幅提升

### mixin data 与组件 data 重名问题：data 会覆盖 mixin data，但 v-model 修改时 mixin data 也会变更

data 变量和引入的 mixin 中的 data 变量名相同存在的问题

- 1、优先级：data 会覆盖 mixin 中的 data 值
- 2、如果修改这个值(v-model 绑定)， mixin 和 data 里面的值都会改变（改为 composition 时，可能会漏掉这一点，注意修改对应值）

测试 demo

```html
<html>
<head>
    <meta charset="utf-8">
    <title>vue</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
</head>
<body>
    <div id="app">
        b: {{b}}
        a: {{a}}
        <button @click="b = 8">测试</button>
    </div>
    <script>
        var myMixin = { 
            data() {
                return { 
                    a: 3,
                    b: 4
                }
            },
            watch: {
                b(val, oldVal) {
                    console.log('b change', val, oldVal)
                }
            }
        }
        // 定义一个使用混入对象的组件
        var app = new Vue({
            el: '#app',
            mixins: [myMixin],
            data: {
                message: 'Hello Vue!',
                b: 5
            }
        })
    </script>
</body>
</html>
```

## provide/inject

## $parent 怎么修改

## element-plus 相关

### this.$message, this.$confirm

### this.$messagebox, h render 函数转换

### 怎么在项目中调试 element-plus 源码

### form-item 指定 rules 与 form 指定的 rules 合并(vue3)还是覆盖(vue2)策略问题

## 构建相关

### process.env.Config.xxxx

### vue 编译渲染错误 Unhandled error during execution of scheduler flush
