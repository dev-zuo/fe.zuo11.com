export default ({ router }) => {
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

        let script = document.createElement("script");
        script.setAttribute("data-ad-client", "ca-pub-9527676606416641");
        script.setAttribute("async", "");
        script.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        document.body.appendChild(script);
      })
    }
  })
}

