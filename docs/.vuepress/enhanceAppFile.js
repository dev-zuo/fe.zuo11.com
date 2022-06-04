export default ({ router, Vue}) => {
  /**
    * 路由切换事件处理
    */
   router.beforeEach((to, from, next) => {
      // console.log("切换路由", to.fullPath, from.fullPath);
      //触发百度的pv统计
      if (typeof _hmt != "undefined") {
          if (to.path) {
              _hmt.push(["_trackPageview", to.fullPath]);
              console.log("上报百度统计", to.fullPath);
          }
      }

      // continue
      next();
  });
  // router.afterEach(function (to) {
  //   if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  //     // var _hmt = _hmt || [];
  //     // (function () {
  //     //   var hm = document.createElement("script");
  //     //   hm.src = "https://hm.baidu.com/hm.js?5d5a0f94bb1b694bbb5de712d00a8490";
  //     //   var s = document.getElementsByTagName("script")[0];
  //     //   s.parentNode.insertBefore(hm, s);
  //     // })();


  //     // var _hmt2 = _hmt2 || [];
  //     // (function() {
  //     //   var hm = document.createElement("script");
  //     //   hm.src = "http://zuo11.com:3000/zs.js?283281668cc3440449274d1f93c04de6";
  //     //   var s = document.getElementsByTagName("script")[0]; 
  //     //   s.parentNode.insertBefore(hm, s);
  //     // })();
  //   }

  //   // if (typeof window !== 'undefined') {
  //   //   import('vue-google-adsense')
  //   //     .then(module => {
  //   //       const Ads = module.default
  //   //       Vue.use(require('vue-script2'))
  //   //       Vue.use(Ads.Adsense)
  //   //       Vue.use(Ads.InArticleAdsense)
  //   //       Vue.use(Ads.InFeedAdsense)
  //   //     })
  //   //     .catch(e => {
  //   //       console.log(e)
  //   //     })
  //   // }
  // })
}

