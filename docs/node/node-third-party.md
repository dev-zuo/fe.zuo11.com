# Node.js 第三方模块笔记

## log4js
部署到服务器时，console.log 打印的 log 是没有时间戳的，不利于线上查 bug，[log4js](https://github.com/log4js-node/log4js-node) 最基础的一个作用就是可以打印带时间戳的 log，当然它的功能不仅仅如此。对于 node 相关程序，建议都使用 log4js 来管理 log

```js
const log4js = require('log4js')
const logger = log4js.getLogger()
logger.level = 'debug' // default level is OFF - which means no logs at all.
logger.info("打印带时间戳的基本信息")
logger.error("打印带时间戳的错误信息")
```

## pm2
使用 ssh 在终端连接 linux 服务器时，只有一个 terminal。对于 node http 服务，运行 node 项目后，终端会被占用。如果想运行其他程序需要 ctrl + c 结束当前 node 服务。[pm2(Process Manager 2)](https://github.com/Unitech/pm2) 可以很好的解决这个问题，使用 pm2 start 运行 node 项目，不会占用当前终端。相关 log 可以通过 pm2 logs 查看，如果想停止服务，使用 pm2 stop。

```bash
pm2 start index.js # 使用 pm2 运行 Node.js 项目
pm2 start index.js -n '重命名服务' # 默认名为 index，防止重复建议重命名
pm2 list # 列出当前使用 pm2 开启的项目
pm2 logs # 显示 log，默认为最后 15 行
pm2 logs --lines 100 # 显示最近 100 行
pm2 logs APP-NAME|id # 显示某个项目的 log，使用 pm2 list 中的 name 字段
pm2 stop     <app_name|namespace|id|'all'|json_conf> # 停止服务
pm2 restart  <app_name|namespace|id|'all'|json_conf> # 重启服务
pm2 delete   <app_name|namespace|id|'all'|json_conf> # 删除服务
``` 

在 docker 中，pm2 对应 pm2-runtime，支持 .yml 配置文件

## long-timeout
setTimeout 和 setInterval 当指定时间大于 2^31-1 毫秒(24.8 天)时，功能会失效，回调函数会立即执行。使用 [long-timeout](https://www.npmjs.com/package/long-timeout) 模块可以解决这个问题。

Long timeout makes it possible to have a timeout or interval that is longer than 24.8 days (2^31-1 milliseconds).
```js
var lt = require('long-timeout')

var timeout = lt.setTimeout(function() {
  console.log('in 30 days')
}, 1000 * 60 * 60 * 24 * 30)

var interval = lt.setInterval(function() {
  console.log('every 30 days')
}, 1000 * 60 * 60 * 24 * 30)


// Clear them
lt.clearTimeout(timeout)
lt.clearInterval(interval)
```

核心逻辑源码如下，内部也是使用的 setTimeout 或 setInterval，当大于系统限制时间时，递归执行
```js
// index.js
var TIMEOUT_MAX = 2147483647; // 2^31-1
// ...
Timeout.prototype.start = function() {
  if (this.after <= TIMEOUT_MAX) {
    this.timeout = setTimeout(this.listener, this.after)
  } else {
    var self = this
    this.timeout = setTimeout(function() {
      self.after -= TIMEOUT_MAX
      self.start()
    }, TIMEOUT_MAX)
  }
  if (this.unreffed) {
    this.timeout.unref()
  }
}
```

## node-schedule
[node-schedule](https://github.com/node-schedule/node-schedule) 是一个用于执行定时任务的模块。

如果仅需要简单的间隔执行，使用 setInterval 即可。如果需要在指定的时间，执行某个任务，使用 node-schedule 会很方便。

指定时间如下
```js
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun) // 每周几执行
│    │    │    │    └───── month (1 - 12) // 每年的几月执行
│    │    │    └────────── day of month (1 - 31) // 每月的几号执行
│    │    └─────────────── hour (0 - 23) // 每天的几点执行
│    └──────────────────── minute (0 - 59) // 每小时的第几分钟执行
└───────────────────────── second (0 - 59, OPTIONAL) // 每分钟的第几秒执行
```
使用示例
```js
const schedule = require('node-schedule')
schedule.scheduleJob('5 * * * * *', () => {
  console.log('每分钟第 5 秒执行')
})
schedule.scheduleJob('1,20,42 * * * * *', () => {
  console.log('每分钟第 1、20、42 秒执行')
})
schedule.scheduleJob('1-10 * * * * *', () => {
  console.log('每分钟第 1 到 10 秒执行')
})
```
执行 schedule.scheduleJob() 会返回一个 Job 实例（j），执行 j.cancel() 可以取消该计划任务。

核心源码逻辑如下，递归判断当前时间是否是指定时间，如果到了指定时间，就执行任务，否则继续递归判断
```js
// lib/schedule.js
/* Date-based scheduler */
function runOnDate(date, job) {
  var now = Date.now();
  var then = date.getTime();

  return lt.setTimeout(function() {
    if (then > Date.now())
      runOnDate(date, job);
    else
      job();
  }, (then < now ? 0 : then - now));
}
```

