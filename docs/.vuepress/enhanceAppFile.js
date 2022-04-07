export default ({ router, Vue}) => {
  router.afterEach(function (to) {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        console.log('~~ onload')
        var _hmt = _hmt || [];
        (function () {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?5d5a0f94bb1b694bbb5de712d00a8490";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
        
        <script>
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "http://zuo11.com:3000/zs.js?283281668cc3440449274d1f93c04de6";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
        </script>

    //     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9527676606416641"
    //  crossorigin="anonymous"></script>

        // let script = document.createElement("script");
        // script.setAttribute("crossorigin", "anonymous");
        // script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9527676606416641";
        // document.body.appendChild(script);
      })
    }

    if (typeof window !== 'undefined') {
      import('vue-google-adsense')
        .then(module => {
          const Ads = module.default
          Vue.use(require('vue-script2'))
          Vue.use(Ads.Adsense)
          Vue.use(Ads.InArticleAdsense)
          Vue.use(Ads.InFeedAdsense)
        })
        .catch(e => {
          console.log(e)
        })
    }
  })
}

