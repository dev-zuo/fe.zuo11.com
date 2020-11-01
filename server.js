
const Koa = require('koa')
const app = new Koa()

// const path = require('path')
// console.log(path.resolve(__dirname, './dist'))
// /Users/guoqzuo/Desktop/gitclone/zuo11.com/dist

app.use(require('koa-static')(__dirname + '/docs/.vuepress/dist'))

app.listen(3009, () => {
  console.log('zuo11.com local server listen on 3009')
})