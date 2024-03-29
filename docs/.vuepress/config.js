const path = require('path')

// 技术日常记录 独立侧边栏
const dailySidebar = [
  {
    title: '指南',
    sidebarDepth: 5,
    collapsable: false,
    children: [
      '',
      '2023-02',
      '2023-01',
      '2022',
      '2021-06',
      '2021-05',
      '2021-04',
      '2021-03',
      '2021-02',
      '2020-12',
      '2020-11',
      '2020-10',
      '2020-09',
      '2020-08',
      '2020-07',
      '2020-06',
      '2020-05',
      '2020-04',
      '2020-03',
      '2020-02',
      '2020-01',
      '2019-12',
      '2019-11',
      '2019-10',
    ]
  }
]

// 英语 独立侧边栏
const englishSidebar = [
  {
    title: '英语语法',
    sidebarDepth: 5,
    children: [
      'grammer-base',
    ]
  },
  {
    title: '英语(二)笔记',
    sidebarDepth: 5,
    collapsable: false,
    children: [
      'en2/1',
      'en2/2',
      'en2/3',
    ]
  }
]

// 计算机基础 独立侧边栏
const baseSidebar = [
  {
    title: '计算机基础',
    sidebarDepth: 5,
    children: [
      'js-data-struct',
      'mocha-test',
      'git',
      'markdown'
    ]
  },
  {
    title: '数据库系统原理笔记',
    sidebarDepth: 5,
    children: [
      'dbtheory/1',
      'dbtheory/2',
      'dbtheory/3',
      'dbtheory/4',
      'dbtheory/5',
      'dbtheory/6',
      'dbtheory/7',
      'dbtheory/8',
      'dbtheory/9',
    ]
  }
]

// HTML/HTML5 独立侧边栏
const htmlSidebar = [
  {
    title: 'HTML5权威指南笔记',
    sidebarDepth: 5,
    children: [
      'html/1',
      'html/2',
      'html/3',
      'html/4',
      'html/5',
      'html/6',
      'html/7',
      'html/8',
      'html/9',
      'html/10',
      'html/11',
      'html/12',
      'html/13',
    ]
  }
]

// CSS/CSS3 独立侧边栏
const cssSidebar = [
  {
    title: 'CSS/CSS3',
    sidebarDepth: 5,
    collapsable: false,
    children: [
      'less',
      'flex-grid',
      {
        title: 'HTML5权威指南(CSS部分)笔记',
        sidebarDepth: 5,
        children: [
          'html5-css-1',
          'html5-css-2',
          'html5-css-3',
          'html5-css-4',
          'html5-css-5',
          'html5-css-6',
          'html5-css-7',
          'html5-css-8',
          'html5-css-9',
          'html5-css-10'
        ]
      }
    ]
  }
]

// JS/ES6 独立侧边栏
const jsSidebar = [{
  title: "JS/ES6",
  sidebarDepth: 5,
  children: [
    {
      title: 'ES6标准入门(第三版)笔记',
      sidebarDepth: 5,
      children: [
        'es6/es6-1',
        'es6/es6-2',
        'es6/es6-3',
        'es6/es6-4',
        'es6/es6-5',
        'es6/es6-6',
        'es6/es6-7',
        'es6/es6-8',
        'es6/es6-9',
        'es6/es6-10',
        'es6/es6-11',
        'es6/es6-12',
        'es6/es6-13',
        'es6/es6-14',
        'es6/es6-15',
        'es6/es6-16',
        'es6/es6-17'
      ]
    },
    {
      title: '你不知道的 JavaScript - 上卷',
      sidebarDepth: 5,
      children: [
        'you-donot-know-js-1/scope-closures',
        'you-donot-know-js-1/this-object-prototypes.md'
      ]
    },
    {
      title: 'JavaScript高级程序设计(第四版)笔记',
      sidebarDepth: 5,
      children: [
        'ad3/js-ad4-diff',
        'ad3/js-ad3-1',
        'ad3/js-ad3-2',
        'ad3/js-ad3-3',
        'ad3/js-ad3-4',
        'ad3/js-ad3-5',
        'ad3/js-ad3-6',
        'ad3/js-ad3-7',
        'ad3/js-ad3-8',
        'ad3/js-ad3-9',
        'ad3/js-ad3-10',
        'ad3/js-ad3-11',
        'ad3/js-ad3-12',
        'ad3/js-ad3-13',
        'ad3/js-ad3-14',
        'ad3/js-ad3-15',
        'ad3/js-ad3-16',
        'ad3/js-ad3-17',
        'ad3/js-ad3-18',
        'ad3/js-ad3-19',
        'ad3/js-ad3-20',
        'ad3/js-ad3-21',
        'ad3/js-ad3-22',
        'ad3/js-ad3-23',
        'ad3/js-ad3-24',
        'ad3/js-ad3-25',
        'ad3/js-ad3-26',
        'ad3/js-ad3-27',
        'ad3/js-ad3-28',
        'ad3/js-ad3-old'
      ]
    },
    // {title: 'JavaScript DOM编程艺术(第二版)笔记', }
    'js-dom-art'
  ]
}]

// Node.js 独立侧边栏
const nodejsSidebar = [{
  title: 'Node.js',
  sidebarDepth: 5,
  children: [
    // {
    //   title: 'Node.js 笔记',
    //   sidebarDepth: 5,
    //   children: [
    //     'base/1',
    //     'base/2',
    //     'base/3',
    //     'base/4',
    //     'base/5'
    //   ]
    // },
    'node-doc',
    'node-third-party',
    'base/1',
    'base/2',
    'base/3',
    'base/4',
    'base/5'
  ]
}]

// webpack 独立侧边栏
const webpackSidebar = [
  {
    title: 'webpack',
    sidebarDepth: 5,
    children: [
      'base',
    ]
  }
]

// ts 独立侧边栏
const tsSidebar = [{
  title: 'TypeScript',
  sidebarDepth: 5,
  children: [
    {
      title: 'TypeScript入门教程笔记',
      sidebarDepth: 5,
      children: [
        'base/base-1',
        'base/base-2',
        'base/base-3',
        'base/base-4',
        'base/base-5',
        'base/base-6',
        'base/base-7',
        'base/base-8',
        'base/base-9',
        'base/base-10'
      ]
    },
    'ts-best-guide',
    'ts-exercise',
    'ts-interview',
  ]
}]

// Vue.js 独立侧边栏
const vueSidebar = [
  {
    title: '深入浅出 Vue.js 笔记',
    sidebarDepth: 5,
    children: [
      'head-first-vue-js/1',
      'head-first-vue-js/2',
      'head-first-vue-js/3',
      'head-first-vue-js/4',
      'head-first-vue-js/5',
    ]
  },
  {
    title: 'Vue 基础',
    sidebarDepth: 5,
    children: [
      'base/1',
      'base/2',
      'base/3',
      'base/4',
      'base/5',
      'base/6',
      'base/7',
      'base/8',
      'base/9',
    ]
  },
  {
    title: '深入理解组件',
    sidebarDepth: 5,
    children: [
      'comps/1',
      'comps/2',
      'comps/3',
      'comps/4',
      'comps/5',
      'comps/6'
    ]
  },
  {
    title: '可复用性与组合',
    sidebarDepth: 5,
    children: [
      'reuse/1',
      'reuse/2',
      'reuse/3',
      'reuse/4',
      'reuse/5'
    ]
  },
  {
    title: '规模化',
    sidebarDepth: 5,
    children: [
      'vue-router',
      'vuex'
    ]
  }
]

const vue3Sidebar = [
  {
    title: 'Vue3',
    sidebarDepth: 5,
    children: [
      'vue3-options-to-setup',
      'vue3-element-plus'
    ]
  }
]

// Read 独立侧边栏
const readSidebar = [
  {
    title: '传记',
    sidebarDepth: 5,
    children: [
      'xinRuoPuTi'
    ]
  },
  {
    title: '小说',
    sidebarDepth: 5,
    children: [
      'life'
    ]
  }
]


module.exports = {
  // base: '/fenote/',
  title: 'dev-zuo 笔记',
  description: 'dev-zuo 笔记，归纳整理自己在前端工作、学习中的一些心得笔记，有利于前端知识系统化。包括 Vue.js、前端工程化（TypeScript、Node.js、webpack）、Docker、JS/ES6、CSS/CSS3、HTML/HTML5、数据可视化、计算机基础、英语等笔记。',
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
      // title: 'VuePress',
      // description: 'Vue-powered Static Site Generator'
    },
    // '/zh/': {
    //   lang: 'zh-CN',
    //   title: 'VuePress',
    //   description: 'Vue 驱动的静态网站生成器'
    // }
  },
  themeConfig: {
    // logo: '/logo.png',
    sidebar: {
      '/daily/': dailySidebar,
      // '/en/': englishSidebar,
      '/base/': baseSidebar,
      '/html5/': htmlSidebar,
      '/css/': cssSidebar,
      '/js/': jsSidebar,
      '/node/': nodejsSidebar,
      '/webpack/': webpackSidebar,
      '/ts/': tsSidebar,
      '/vue/': vueSidebar,
      '/vue3/': vue3Sidebar,
      // '/read/': readSidebar,
      '/': [
        {
          title: '指南',
          collapsable: false,
          children: [
            '',
            'nav'
          ]
        }
      ]
    },
    nav: [
      {
        text: '指南', items: [
          { text: "首页", link: '/' },
          { text: "前端网址导航", link: '/nav.md' }
        ]
      },
      {
        text: '前端进阶', items: [
          { text: '技术日常记录', link: "/daily/" },
          { text: 'Docker 基础', link: "/server/docker.md" },
          {
            text: 'Vue.js', items: [
              { text: '深入浅出 Vue.js 笔记', link: '/vue/head-first-vue-js/1.md' },
              { text: 'Vue.js 笔记', link: '/vue/base/1.md' },
              { text: 'Vue Router 笔记', link: '/vue/vue-router.md' },
              { text: 'Vuex 笔记', link: '/vue/vuex.md' },
            ]
          },
          {
            text: 'Vue3', items: [
              { text: 'Vue3 options 改 setup 快速参考', link: '/vue3/vue3-options-to-setup.md' },
              { text: 'Vue3 + Element Plus', link: '/vue3/vue3-options-to-setup.md' },
            ]
          },
          {
            text: '前端工程化', items: [
              { text: 'TypeScript 入门教程笔记', link: '/ts/base/base-1.md' },
              { text: 'TypeScript 最佳实践', link: '/ts/ts-best-guide.md' },
              { text: 'Node.js 笔记', link: '/node/base/1.md' },
              { text: 'webpack 基础', link: '/webpack/base.md' },
            ]
          },
          {
            text: '数据可视化', items: [
              { text: 'Echarts 笔记', link: '/visual/echarts.md' },
            ]
          }
        ]
      },
      {
        text: '前端基础', items: [
          {
            text: 'JS/ES6', items: [
              { text: 'ES6标准入门(第三版)笔记', link: '/js/es6/es6-1.md' },
              { text: '你不知道的 JavaScript - 上卷', link: '/js/you-donot-know-js-1/scope-closures.md' },
              { text: 'JavaScript高级程序设计(第四版)笔记', link: '/js/ad3/js-ad3-1.md' },
              { text: 'JavaScript DOM编程艺术(第二版)笔记', link: '/js/js-dom-art.md' },
            ]
          },
          {
            text: 'CSS/CSS3', items: [
              { text: 'CSS 预处理器 Less.js', link: '/css/less.md' },
              { text: 'Flex与Grid布局', link: '/css/flex-grid.md' },
              { text: 'HTML5权威指南(CSS部分)笔记', link: '/css/html5-css-1.md' }
            ]
          },
          {
            text: 'HTML/HTML5', items: [
              { text: 'HTML5权威指南(HTML部分)笔记', link: '/html5/html/1.md' },
            ]
          }
        ]
      },
      {
        text: '计算机基础', items: [
          { text: '学习JavaScript数据结构与算法(第三版)笔记', link: '/base/js-data-struct.md' },
          { text: 'Mocha - JavaScript测试框架', link: '/base/mocha-test.md' },
          { text: 'Git 笔记', link: '/base/git.md' },
          { text: 'Markdown 基础语法', link: '/base/markdown.md' },
          { text: '数据库系统原理笔记', link: '/base/dbtheory/1.md' }
        ]
      },
      // {
      //   text: '读书', items: [
      //     {
      //       text: '传记', items: [
      //         { text: '心若菩提(曹德旺)', link: '/read/xinRuoPuTi.md' },
      //       ]
      //     },
      //     {
      //       text: '小说', items: [
      //         { text: '人生(路遥)', link: '/read/life.md' },
      //       ]
      //     }
      //   ]
      // },
      {
        text: '开源项目', items: [
          { text: 'zuo-deploy', link: 'https://github.com/zuoxiaobai/zuo-deploy' },
          { text: 'visitors', link: 'https://github.com/zuoxiaobai/visitors' },
          { text: 'food', link: 'https://github.com/zuoxiaobai/food' }, // 饮食
          { text: 'service-monitor', link: 'https://github.com/zuoxiaobai/service-monitor' },
          { text: 'zuo-blog', link: 'http://zuoblog.zuo11.com' },
          { text: '博客 zuo11.com', link: 'http://www.zuo11.com' },
          // { text: 'cli.zuo11.com' }, // 快速 demo 模板生成
          // { text: 'config.zuo11.com' }, // 配置中心，接口生成
          // { text: 'en.zuo11.com' }, // 中英双语、翻译、划词，类似扇贝阅读
          // { text: 'life.zuo11.com' }, // 站在巨人的肩膀上（书、经验积累）
          // { text: 'code.zuo11.com' }, // 代码片段、工具库代码收集
          // { text: 'ux.zuo11.com' }, // UE 交互收集、展示
          // { text: 'lab.zuo11.com' }, // 实验室
        ]
      },
      { text: 'Github', link: 'https://github.com/zuoxiaobai' }
    ],
    lastUpdated: '上次更新', // string | boolean
    smoothScroll: true, // 滚动效果
    // 右上角自动生成 github 导航连接
    // repo: 'zuoxiaobai/fenote',
    // repoLabel: 'Github',
  },
  // 完全兼容 PWA
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['link', { rel: 'stylesheet', href: '/common.css' }], // 添加自定义样式
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    ['script', {},
      `
      var _hmt = _hmt || [];
      (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?5d5a0f94bb1b694bbb5de712d00a8490";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
      })();
      `
    ],
    // 暂时注释
    // ['script', { src: "http://zuo11.com:3000/zs.js?283281668cc3440449274d1f93c04de6", defer: true }],
    // [
    //   "script",
    //   {
    //     "crossorigin": "anonymous",
    //     async: true,
    //     src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9527676606416641",
    //   },
    // ],
  ],
  plugins: [
    '@vuepress/back-to-top',
    [
      '@vuepress/search', {
        searchMaxSuggestions: 8
      }
    ],
    [
      '@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: true
      }
    ],
    'fulltext-search',
    // [
    //   "vuepress-plugin-google-adsense",
    //   {
    //     adClient: "ca-pub-9527676606416641", // replace it with your adClient
    //   },
    // ],
    // ['sitemap', {
    //   hostname: 'http://fe.zuo11.com',
    //   exclude: ['/404.html']
    // },]
  ],
  markdown: {
    plugins: ['task-lists']
  },
  clientRootMixin: path.resolve(__dirname, 'mixin.js'),
  enhanceAppFiles: path.resolve(__dirname, 'enhanceAppFile.js')
  // enhanceAppFiles: path.resolve(__dirname, 'common.js')
}