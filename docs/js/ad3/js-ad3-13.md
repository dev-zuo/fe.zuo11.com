---
title: 13. 客户端检测 - JS高程4
description: 客户端检测分为能力检测、用户代理检测、软件与硬件检测。- 能力检测，又称为特性检测，使用 JS 测试浏览器是否支持某种特性，功能。- 用户代理检测，也就是 user-agent 检测，简称 UA 检测，使用 navigator.userAgent 字符串来确定当前访问的是什么浏览器，以及对应的版本。- 软硬件检测，主要是通过 navigator / screen 对象暴露的 API 来获取软硬件信息
keywords: 特性检测,用户代理检测,电池信息,battery信息,网络连接信息
---

# 13. 客户端检测
客户端检测分为能力检测、用户代理检测、软件与硬件检测
- 能力检测，又称为特性检测，使用 JS 测试浏览器是否支持某种特性，功能。
- 用户代理检测，也就是 user-agent 检测，简称 UA 检测，使用 navigator.userAgent 字符串来确定当前访问的是什么浏览器，以及对应的版本。
- 软硬件检测，主要是通过 navigator / screen 对象暴露的 API 来获取软硬件信息

## 能力(特性)检测
能力检测不要求事先知道浏览器信息，只关心是否支持某个特性(功能)。下面的例子中先检测是否支持 document.querySelector，如果支持就使用它。如果不支持，就降级使用 document.getElementById。
```js
if (document.querySelector) {
	document.querySelector('#title')
} else {
	document.getElementById('title')
}

// 判断是否支持 Promise
if (!!Promise) {
	// 支持 Promise
}
```
上面的例子中，我们仅判断了 document.querySelector / Promise 是否存在，更安全/可靠的能力检测应该判断他是否是一个函数，比如
```js
if (typeof Promise === 'function') {
	// 支持 Promise
}
```

虽然可以通过能力检测来粗略判断浏览器型号，但它不能精确的反映特定的浏览器或版本。详情参考：p385
## 用户代理(UA)检测
navigator.userAgent 是用户代理字符串。里面包含了用户浏览器版本、系统信息等。在发送请求时，请求头（Request Headers）的 User-Agent 字段会携带 userAgent 信息给服务端。**它是不可靠的，因为很容易伪造。只有在没有其他办法的情况下再考虑使用。** 

用户代理最受争议的地方在于，很长一段时间里，浏览器通过在用户代理中包含错误或误导性的信息来欺骗服务器。

用户代理字符串的历史
1. 1993 年，美国国家超级计算应用中心(NCSA)发布的 Mosaic 是早期 web 浏览器的代表，UA字符串非常简单 `Mosaic/0.9` 产品名称/版本号。
2. 在网景（Netscape）公司准备开发浏览器时，代号确定为 "Mozilla"（Mosaic Killer的简写），第一个发行版 Netscape Naviagtor 2 的 UA 字符串如下 `Mozilla/Version [Language] (plantform; Encryption)` 加入了语言、浏览器所在的操作系统或平台，加密方法 	`Mozilla/2.02 [fr] (WinNT; I)`
3. 1996 年，Netscape Navigator 3 发布后，超过 Mosaic 称为最受欢迎的浏览器。删除了语言信息，将操作系统和 CPU 列为可选信息。后来微软首次对外发布了 IE3，**由于很多服务器在返回网页之前会特意检测浏览器 UA 字符串，如果 IE 因此打不开网页，对市场会有影响，于是 IE 在用户代理字符串中添加了兼容 Netscape UA 字符串的内容**，格式为 `Mozilla/2.0 (compatible; MSIE versioin; operating System)`。当时大多数浏览器检测程序只看用户代理字符串中的产品名称，因此 IE 将自己伪装成了 Mozilla。这个做法引起了一些争议，违反了浏览器标识的初衷。真正的浏览器版本跑到了字符串中间。
4. IE8 开始，IE 浏览器在 UA 字符串里新增它的浏览器渲染引擎 "Trident"（三叉戟） 字符串。
5. Gecko（壁虎）是 Firefox 浏览器的渲染引擎，最初是 Netscape6 的一部分。UA 字符串里面就加上了 Gecko。Mozilla 版本一直固定为 5.0。
6. 2003 年苹果发布了自己的浏览器 Safari，他的渲染引擎是 Webkit（基于 Linux 平台浏览器 Konqueror 的渲染引擎 KHTML 开发）。新的浏览器面临和之前 IE 同样的问题，因此 UA 字符串包含了之前通用的特定字符串，并加上了 Safari webkit。`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15`。
7. Chrome 浏览器的渲染引擎是 Blink, JavaScript 引擎是 V8。Chrome 浏览器 UA 字符串包含所有的 Webkit 字符串，又加上了 Chrome 版本号，还包含 Safari 信息 `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36`
8. Opera 浏览器，在 Opera8 及之前，使用 `Opera/7.54` 这种正确的 UA 字符串格式，但从 Opera9 开始就伪装成 IE 或 Firefox 了。他有特定的 `Opera` 或 `OPR` 标识。
9. 移动端 iOS 和 Android，移动端默认的浏览器都是基于 WebKit 内核的。具有和桌面浏览器一样的 UA 字符串格式。如果是 iOS 可以通过判断 `iPhone`、`iPad`、`iPod` 字符串来判断机型。如果是安卓，可以通过 `Mobile` 字符串来判断。


UA 字符串可以通过内部的 `__defineGetter__` 方法来修改

```js
window.navigator.userAgent
// "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
window.navigator.__defineGetter__('userAgent', () => "abcddd")
window.navigator.userAgent
// "abcddd"
```
对付这种伪造是吃力不讨好的事情，没有太大的意义。正常情况下，通过 UA 可以判断出 浏览器、浏览器版本、浏览器渲染引擎、设备类型（桌面/移动）、设备型号、操作系统、操作系统版本等。由于新浏览器、新操作系统、新的硬件设备随时可能出现，UA 解析程序需要与时俱进，频繁更新，以免过时。不推荐自己写一个解析程序，第四版推荐使用 Github 上维护的比较频繁的第三方 UA 解析程序：

- [Browser - lancedikson | Github](https://github.com/lancedikson/bowser)
- [UAParse.js - faisalman | Github](https://github.com/faisalman/ua-parser-js)

更多细节，参见 p386

## 软件与硬件检测
特性检测和 UA 检测是最常见的两种浏览器识别方式。而 navigator 和 screen 对象也提供了页面所在的软件环境信息。**要特别注意兼容性问题，有的属性只是 Chrome 有，Safari 没有**

```js
navigator
{
	appCodeName: "Mozilla",
	appName: "Netscape",
	product: "Gecko",
	productSub: "20030107",
	appVersion: "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
	userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
	vendor: "Google Inc.", // 浏览器开发商
	platform: "MacIntel", // 当前操作系统
	language: "zh-CN", // 语言
	onLine: true, // 是否在线
	cookieEnabled: true, // 是否允许使用 cookie

	hardwareConcurrency: 8, // CPU核心或线程
	deviceMemory: 8, // 设备大致内存大小
	maxTouchPoints: 0, // 屏幕触摸点数，一般触控屏才有
}

screen 
{
	colorDepth: 30, // 显示器每像素颜色的位深(每像素用于显示颜色的位数，不包含 alpha 通道)
	pixelDepth: 30, // 同上
	orientation: {
		angle: 0, // 屏幕的角度
		type: "landscape-primary", // 屏幕方向信息
		onchange: null
	}
}
```

### Geolocation API 位置信息
Geolocation API 在浏览器中的实现是 navigator.geolocation 对象，IE9+支持，调用时会触发提示：xxx想要获取您的地址位置信息，是否允许？发布到线上，需要是 https 才会生效。原第三版 25 章 新兴的 API 内容。

获取当前位置信息 navigator.geolocation.getCurrentPosition(successCb, failCb, PositionOptions)

```js
// 获取用户当前位置
// successCallback为必须，后两个参数可选
// navigator.geolocation.getCurrentPosition(successCallback, failCallback, options)
navigator.geolocation.getCurrentPosition(function(position) {
  // 获取位置信息成功(弹出是否允许使用地址位置信息时，点击了允许)
  console.log(position) // coords,timestamp
  console.log(position.coords.latitude, position.coords.longitude)
}, function(error) {
  // 获取位置信息失败或点击了不允许
  console.log('获取用户地理位置信息失败')
  console.log(error.message)
}, {
  //设定信息类型可选项
  enableHighAccuracy: true, // 尽可能使用最准确的位置信息，默认为false，true需要更多的电量，获取更耗时
  timeout: 5000, // 等待位置信息的最长时间，毫秒
  maximumAge: 25000// 上一次取得的坐标的有效时间，毫秒，如果到时间需要重新取得坐标信息
})
```
跟踪用户的位置, navigator.geolocation.watchPosition()，接收的参数完全与getCurrentPostion()一致，**第四版已删除**
```js
// watchPosition 与定时调用getCurrentPostion的效果相同
var watchId = navigator.geolocation.watchPosition(function(position) {
  // 获取位置信息成功(弹出是否允许使用地址位置信息时，点击了允许)
  console.log(position) // coords,timestamp
  console.log(position.coords.latitude, position.coords.longitude)
}, function(error) {
  // 获取位置信息失败或点击了不允许
  console.log('获取用户地理位置信息失败')
  console.log(error.message)
})

// 取消监控
clearWatch(watchId)
 ```

:::tip
- 手机 GPS 精度更高，IP 地址的精度会差很多
- 地理位置信息主要来源是手机 GPS 和 IP 地址、射频识别（RFID）、Wi-Fi及蓝牙 Mac 地址、GSM/CDMA 蜂窝 ID 以及用户输入等信息。
- 默认情况设备会选择最快、最省电的方法返回坐标。比如移动设备上使用 Wi-Fi 和蜂窝网络的定位信息，而在 PositionOptions 传入的 enableHighAccuracy 为 true 时，会设置设备的 GPS 来确定位置，更耗时、耗电。
:::


### connection 网络连接状态信息
通过 navigator.onLine 可以获取当前网络状态，true 有网，false 没网。HTML5定义了两个事件，可以通过监听 window 的 online 和 offline 事件来监听网络状态发生改变。

建议先通过 navigator.onLine 获取当前的网络状态，再通过监听上面两个事件来确定网络连接的状态是否改变
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>离线监测、监听</title>
  </head>
  <body>
    <input type="button" id="checkIsOnline" value="点击检测是否有网">
    <script>
        var mybtn = document.getElementById("checkIsOnline")
        // 点击检测是否有网
        mybtn.onclick = function(event) {
          alert(navigator.onLine ? '有网': '没有网')
        }

        // 当网络状态发生改变时（有网 => 无网，无网 => 有网），才会触发
        window.ononline = function(event) {
          alert('网络已连接')
        }
        window.onoffline = function(event) {
          alert('网络已断开')
        }
    </script>
  </body>
</html>
```

另外可以通过 NetworkInformation API，也就是 navigator.connection 属性可以获取网络的详细连接信息 
```js
{
	downlink: 0.15 // 当前设备带宽 MB/s
	effectiveType: "slow-2g" // 连接速度和质量
	onchange: null // 时间处理程序，连接状态发生变化时触发
	rtt: 3000 // 网络实际往返时间，毫秒
	saveData: false // 是否启用了 "reduced data" 节流模式
}

navigator.connection.addEventListener('change', (info) => {
	console.log(info.currentTarget) // info.target
	// { 
	// 	downlink: 7.5
	// 	effectiveType: "4g"
	// 	onchange: null
	// 	rtt: 50
	// 	saveData: false
	// }
})
```

effectiveType网络类型 | rtt往返时间 | 下行带宽
--- | --- | ---
slow-2g | > 2000ms  | < 50kbit/s
2g | 1400ms ~ 2000ms | 50kbit/s ~ 70kbit/s
3g | 270ms ~ 1400ms | 70kbit/s 700kbit/s
4g | 0 ~ 270ms | > 700 kbit/s

### Battery Status API
navigator.getBattery() 方法可以访问设备电池及充电信息，返回一个 Promise 实例。resolve 为一个 BatteryManager 对象

```js
navigator.getBattery().then(console.log).catch(console.log)

// BatteryManager {}
// {
// 	charging: true  // 是否在充电中
// 	chargingTime: 0 // 距离冲满还需要多少秒
// 	dischargingTime: Infinity // 预计距离电量耗尽还有多少秒
// 	level: 1 // 电池电量百分比  0.8 为 80%，1 为 100%
// 	onchargingchange: null // 充电状态变化
// 	onchargingtimechange: null // 充电时间变化
// 	ondischargingtimechange: null // 放电时间变化
// 	onlevelchange: null // 电量百分比变化
// }
```
该 API 提供了 4 个事件属性。用于监听电池状态信息。

```js
navigator.getBattery().then(battery => {
	battery.onchargingchange = (e) => {
		console.log('onchargingchange', e)
		// e.target
		// {
		// 	charging: false
		// 	chargingTime: Infinity
		// 	dischargingTime: Infinity
		// 	level: 1
		// }
	}
})
```