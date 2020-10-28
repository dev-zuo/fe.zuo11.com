
// css
const cssSidebar = {
  title: 'CSS/CSS3',
  sidebarDepth: 5,
  children: [
    '/css/flex-grid.md',
    {
      title: 'HTML5权威指南(CSS部分)笔记',
      sidebarDepth: 5,
      children: [
        '/css/html5-css-1.md',
        '/css/html5-css-2.md',
        '/css/html5-css-3.md',
        '/css/html5-css-4.md',
        '/css/html5-css-5.md',
        '/css/html5-css-6.md',
        '/css/html5-css-7.md',
        '/css/html5-css-8.md',
        '/css/html5-css-9.md',
        '/css/html5-css-10.md'
      ]
    }
  ]
}

// js
const jsSidebar = {
  title: "JS/ES6",
  sidebarDepth: 5,
  children: [
    // {title: 'JavaScript DOM编程艺术(第二版)笔记', }
    '/js/js-dom-art.md',
    {
      title: 'JavaScript高级程序设计(第三版)笔记',
      sidebarDepth: 5,
      children: [
        '/js/ad3/js-ad3-1.md',
        '/js/ad3/js-ad3-2.md',
        '/js/ad3/js-ad3-3.md',
        '/js/ad3/js-ad3-4.md',
        '/js/ad3/js-ad3-5.md',
        '/js/ad3/js-ad3-6.md',
        '/js/ad3/js-ad3-7.md',
        '/js/ad3/js-ad3-8.md',
        '/js/ad3/js-ad3-9.md',
        '/js/ad3/js-ad3-10.md',
        '/js/ad3/js-ad3-11.md',
        '/js/ad3/js-ad3-12.md',
        '/js/ad3/js-ad3-13.md',
        '/js/ad3/js-ad3-14.md',
        '/js/ad3/js-ad3-15.md',
        '/js/ad3/js-ad3-16.md',
        '/js/ad3/js-ad3-17.md',
        '/js/ad3/js-ad3-20.md',
        '/js/ad3/js-ad3-21.md',
        '/js/ad3/js-ad3-22.md',
        '/js/ad3/js-ad3-23.md',
        '/js/ad3/js-ad3-24.md',
        '/js/ad3/js-ad3-25.md'
      ]
    },
    { 
      title: 'ES6标准入门(第三版)笔记',
      sidebarDepth: 5,
      children: [
        '/js/es6/es6-1.md',
        '/js/es6/es6-2.md',
        '/js/es6/es6-3.md',
        '/js/es6/es6-4.md',
        '/js/es6/es6-5.md',
        '/js/es6/es6-6.md',
        '/js/es6/es6-7.md',
        '/js/es6/es6-8.md',
        '/js/es6/es6-9.md',
        '/js/es6/es6-10.md',
        '/js/es6/es6-11.md',
        '/js/es6/es6-12.md',
        '/js/es6/es6-13.md',
        '/js/es6/es6-14.md',
        '/js/es6/es6-15.md',
        '/js/es6/es6-16.md',
        '/js/es6/es6-17.md'
      ]
    }
  ]
}

// ts
const tsSidebar = {
  title: 'TypeScript',
  children: [
    {
      title: 'TypeScript入门教程笔记',
      sidebarDepth: 5,
      children: [
        '/ts/base-1.md',
        '/ts/base-2.md',
        '/ts/base-3.md',
        '/ts/base-4.md',
        '/ts/base-5.md',
        '/ts/base-6.md',
        '/ts/base-7.md',
        '/ts/base-8.md',
        '/ts/base-9.md',
        '/ts/base-10.md'
      ]
    }
  ]
}

module.exports = {
  // base: '/fenote/',
  title: '左小白的前端笔记',
  description: '左小白的前端笔记，用于记录、完善个人前端知识体系结构',
  themeConfig: {
    // logo: '/logo.png',
    sidebar: [
      {
        title: 'Web FE',   // 必要的
        collapsable: false, // 展开
        sidebarDepth: 5,
        children: [
          '/nav.md',
          '/docker.md',
          '/git.md'
        ]
      },
      cssSidebar,
      jsSidebar,
      tsSidebar,
      {
        title: 'webpack',
        sidebarDepth: 5,
        children: [
          '/webpack/base.md',
        ]
      }
      
    ],
    nav: [
      { text: '指南', link: '/' },
      { text: '配置', link: '/config.md' }
    ],
    lastUpdated: 'Last Updated', // string | boolean
    smoothScroll: true, // 滚动效果
    // 右上角自动生成 github 导航连接
    repo: 'zuoxiaobai/fenote',
    repoLabel: 'Github',
  },
  plugins: ['@vuepress/back-to-top']
}