<template>
  <ParentLayout>
    <AdSense slot="sidebar-top" adSlot="sidebar-top"/>
    <AdSense slot="page-bottom" adSlot="page-bottom"/>
    <AdSense slot="page-top" adSlot="page-top"/>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import AdSense from '../components/AdSense.vue'
export default {
  components: {
    ParentLayout,
    AdSense
  }
}
</script>