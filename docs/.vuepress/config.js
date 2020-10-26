module.exports = {
  base: '/fenote/',
  title: '左小白的前端笔记',
  description: '左小白的前端笔记，用于记录、完善个人前端知识体系结构',
  themeConfig: {
    sidebar: [
      {
        title: '指南',   // 必要的
        children: [
          '/',
          '/a.md',
          '/b.md'
        ]
      }
    ],
    nav: [
      { text: '指南', link: '/' },
      { text: '配置', link: '/config.md' },
      { text: 'Github', link: 'https://www.github.com/zuoxiaobai/fenote' }
    ]
  }
}