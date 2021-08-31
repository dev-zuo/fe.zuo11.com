<template>
  <div class="adsense-content">
    <!-- <div class="adsense-title">ad</div> -->
    <div>
      <!-- 博客首页 文章内嵌 -->
      <ins
        v-if="adSlot == 'page-bottom'"
        class="adsbygoogle"
        style="display: block; text-align: center"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-9527676606416641"
        data-ad-slot="4599183110"
      ></ins>

      <!-- 文字底部信息流 - 纯文本 - 728 * 90 -->
      <ins
        v-if="adSlot == 'page-top'"
        :style="{ 'padding-top': adSlot == 'page-top' ? '4.6rem' : '0'}"
        class="adsbygoogle"
        style="display: block"
        data-ad-format="fluid"
        data-ad-layout-key="-gw-3+1f-3d+2z"
        data-ad-client="ca-pub-9527676606416641"
        data-ad-slot="8870245163"
      ></ins>

      <!-- 300 * 250 -->
      <ins
        v-if="adSlot == 'sidebar-top'"
        class="adsbygoogle"
        style="display: inline-block; width: 300px; height: 250px"
        data-ad-client="ca-pub-9527676606416641"
        data-ad-slot="9476232907"
      ></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  </div>
</template>

<script>
export default {
  props: ["adSlot"],
};
</script>
<style scoped>
.adsense-content {
  max-width: 740px;
  margin: 0 auto;
}
/* .adsense-title {
  color: #999;
  transition: color 0.15s ease;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  padding: 0 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
} */
</style>