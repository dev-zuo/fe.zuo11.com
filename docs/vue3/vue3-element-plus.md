# Vue3 + Element Plus

## el-draw/el-dialog 組件内使用 .el-draw 样式不生效，去掉 scoped 才生效

## v-popover 将废弃，使用 virtual-ref 替代

## this.$set 直接改为普通对象设置值方法

vue3 拦截换成 proxy，不再需要 $set

## element-plus input border 设置不生效的问题

el-input_wrapper 用的是 box-shadow 做的边框

```scss
.el-input_wrapper {
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}
```

## ::v-deep 替换为 :deep()

## el-dialog v-model:visible => v-model

```vue
<template>
  <div>
    <el-dialog v-model="dialogVisible" title="Tips" width="30%">
      <span>This is a message</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">Cancel</el-button>
          <el-button type="primary" @click="confirm">Confirm</el-button>
        </div>
      </template>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, toRefs } from 'vue';
import type { Ref } from 'vue';

const props = withDefaults({
    defineProps<{
        showDialog: boolean;
    }>(),
    {
        showDialog: false
    }
})
const { showDialog } = toRefs(props)
const emit = defineEmits(['update:showDialog']);
const dialogVisible: Ref<boolean> = ref(false);

watch(showDialog, val => {
    dialogVisible.value = val
})

const closeDialog = () => {
    emit('update:showDialog', false)
}

const confirm = () => {
    closeDialog()
}
</script>
```
