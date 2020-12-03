---
title: 18. 动画与 Canvas 图形 - JS高程4
description: 早期 Web 中 JS 动画的实现使用的是 setTimeout() 与 setInterval()，但由于事件队列机制无法保证计时器的时间精度，无法创建平滑的动画。于是出现了 requestAnimationFrame() API，浏览器会使用最优的方式来绘制动画。HTML5 加入了 canvas 元素，IE9+ 支持，这个元素会占据一块页面区域，让 JavaScript 可以动态在上面绘制图片。canvas 仅支持基础绘图能力，是 2D、非矢量的。如果需要做 3D 绘图，可以使用 WebGL。
keywords: 动画,requestAnimationFrame,canvas,WebGL
---

# 18. 动画与 Canvas 图形
早期 Web 中 JS 动画的实现使用的是 setTimeout() 与 setInterval()，但由于事件队列机制无法保证计时器的时间精度，无法创建平滑的动画。于是出现了 requestAnimationFrame() API，浏览器会使用最优的方式来绘制动画。

HTML5 加入了 `<canvas>` 元素，IE9+ 支持，这个元素会占据一块页面区域，让 JavaScript 可以动态在上面绘制图片。canvas 仅支持基础绘图能力，是 2D、非矢量的。如果需要做 3D 绘图，可以使用 WebGL。

## 使用 requestAnimationFrame
很长时间以来，计时器和间隔执行一直都是 JavaScript 动画的核心。但 setTimeout() 和 setInterval() 计时器都不是十分精确，他们只是把动画代码添加到浏览器的任务队列，如果队列前面还有其他任务。实际执行时间会比正常时间晚一点。循环间隔会有误差。requestAnimationFrame() 可以避免这个误差，创建平滑的动画效果。

下面是使用 setInterval() 控制动画执行的例子
```js
(function() {
  function updateAnimations() {
    doAnimation1()
    doAnimation2()
  }
  setInterval(updateAnimations, 100)
})()

```
### 浏览器自身计时精度问题
创建平滑动画的关键是知道如何绘制下一帧。随着 canvas 的流行和 HTML5 游戏的兴起，开发者发现 setTimeout() 和 setInterval() 不精确是个大问题。而且浏览器自身计时器的精度让这个问题更加明显，另外浏览器在对切换到后台或不活跃标签页中的计时器进行限流。即使将时间间隔设置到最优，也只能得到近似的结果。

### requestAnimationFrame()
浏览器知道 CSS 过渡和动画应该什么时候开始执行，并据此计算出正确的时间间隔，到时间就刷新 UI。

对于 JS 而言，浏览器不知道动画什么时候开始，于是出现 requestAnimationFrame API，用来通知浏览器某些 JS 代码要执行动画了。这样浏览器就可以在运行某些代码后进行适当的优化。

requestAnimationFrame(callback) 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 window.requestAnimationFrame()

下面是一个例子，用 JS 实现一个 width 从 5% 到 100% 的动画

```html
<div id="status" style="width:5%;background:red;">测试</div>
<script>
  function updateProgress() {
    let div = document.getElementById("status")
    div.style.width = (parseInt(div.style.width, 10) + 1) + '%'
    if (div.style.width !== '100%') {
      window.requestAnimationFrame(updateProgress)
    }

  }
  window.requestAnimationFrame(updateProgress)
</script>
```
上面我们并没有规定多长时间内执行完毕，其实也可以将时间作为判断条件。回调函数会默认接收一个 timestamp 参数，类似于当前页面打开时间 performance.now() 的返回值，单位是毫秒。下面的例子中，将首次执行动画时的时间，保存到了 start 里。后面每次执行动画时，都将最新的时间与 start 进行比较，如果间隔 2000（2秒）就停止动画。这样就可以指定动画执行时间。下面的动画是将 status 元素向右平移 200px 的动画，动画时间 2s。
```js
<div id="status" style="width:5%;background:red;">测试</div>
<script>
  const element = document.getElementById('status'); 
  let start;

  function step(timestamp) {
    console.log('tiemstamp', timestamp, typeof timestamp)
    if (start === undefined) {
      start = timestamp;
    }
    console.log('start', start)
    const elapsed = timestamp - start;

    //这里使用`Math.min()`确保元素刚好停在200px的位置。
    element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 200) + 'px)';

    if (elapsed < 2000) { // 在两秒后停止动画
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
</script>
```
### cancelAnimationFrame() 
requestAnimationFrame() 返回一个请求 ID，可以用于通过 cancelAnimationFrame() 来取消重绘任务。下面的例子中，有一个 5 秒的动画，在 2 秒时取消。

```html
<script>
  let start, requestID;
  let cb = (t) => {
    !start && (start = t)
    console.log('重绘')
    // console.log "重绘"，持续 5 秒
    if (t - start < 5000) {
      requestID = window.requestAnimationFrame(cb) 
    } 
  }
  requestID = window.requestAnimationFrame(cb) 
  // 2 秒后取消打印
  setTimeout(() => {
    window.cancelAnimationFrame(requestID)
  }, 2000)
</script>

```

### 通过 requestAnimationFrame 节流
requestAnimationFrame 的每次调用，都会在队列上推入一个回调函数，浏览器可以保证每次重绘最多调用一次回调函数，可以用于节流。由于重绘是非常频繁的操作。所以需要加一个 setTimeout 限制重绘执行的频率。下面的例子中，限制 500ms 内只执行一次回调。
```html
<script>
  // 创建可滚动的页面
  let count = 100, 
      htmlStr = '';
  while(count--) {
    htmlStr += '<li>test</li>'
  }
  document.body.innerHTML = `<ul>${htmlStr}</ul>`

  // 监听滚动事件，使用 requestAnimationFrame 节流
  let enabled = true
  let cb = () => console.log('Invoked at ', Date.now())
  window.addEventListener('scroll', () => {
    if (enabled) {
      enabled = false
      window.requestAnimationFrame(cb)
      setTimeout(() => { 
        enabled = true 
      }, 500)
    }
  })
</script>
```
## 基本的 canvas 画布功能
canvas 元素必须设置 width 和 height 属性，指定绘图区域的大小，如果不添加样式或绘制内容是看不到该元素的，可以设置 border 看效果。元素中间可以设置内容，当浏览器不支持 canvas 元素时会显示。
```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;">
  A draw of something. 当前浏览器不支持 canvas.
</canvas>
```
在画布上绘制图形，需要先获取绘图上下文。使用 getContext() 方法可以获取绘图上下文的引用。对于 2D 平面图形，需要传入 "2d" 参数，表示获取 2D 绘图上下文对象。类型是 CanvasRenderingContext2D

```js
let drawing = document.getElementById('drawing')
// 如果浏览器支持 canvas
if (drawing.getContext) {
  let ctx = drawing.getContext('2d')
  // 开始使用 2d 绘图上下文对象 ctx 绘制图形
}
```

可以使用 toDataURL() 方法，导出 canvas 元素上的图像。这个方法接收一个参数：要生成图像的 MIME 类型，下面是将 canvas 绘制的内容，导出为一张 png 格式的图片。导出的图片大小与画布大小一致。

```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;">
</canvas>
<script>
  let drawing = document.getElementById('drawing')
  // 如果浏览器支持 canvas
  if (drawing.getContext) {
    // 在 (10,10) 位置上，绘制一个边长为 50 的正方形。
    let ctx = drawing.getContext('2d')
    ctx.fillStyle = "#ff0000"
    ctx.fillRect(10, 10, 50, 50)
    
    // 获取图像数据 URI，base64
    let imgURI = drawing.toDataURL('image/png')

    // 显示图片
    let img = document.createElement('img')
    img.src = imgURI
    document.body.appendChild(img)

    // 自动下载该图片
    let link = document.createElement('a')
    link.download = 'img'
    link.href = imgURI
    document.body.appendChild(link)
    link.click()
  }
</script>
```

## 2D 绘图上下文
2D 绘图上下文提供了绘制 2D 图形的方法，包括矩形、弧形和路径。2D 上下文的坐标原点是 (0, 0)，即 canvas 元素的左上角。所有坐标值都相对于该点计算。为了方便描述 2D 绘图上下文对象提供的属性、方法，这里将 2D 绘图上下文对象简写为 ctx。

### 填充和描边/绘制矩形
填充和描边是 2D 上下文的两个基本绘制操作。fillStyle 和 strokeStyle 用于指定填充和描边的样式。值可以是字符串颜色、渐变对象或图案对象。颜色字符串可以是 CSS 支持的任意格式：名称、十六进制、rgb、rgba、hsl 等。另外在描边时，可以使用 lineWidth 指定线条宽度，lineCap 控制线条端点的形状，比如圆角等。lienJoin 控制线条交点的形状。

- `ctx.fillStyle` 以指定样式，自动填充形状，默认值为 '#000000'
- `ctx.strokeStyle` 描边只是为图形边界着色，默认值 '#000000'
- `ctx.lineWidth` 整数，描边时，线条宽度
- `ctx.lineCap` 字符串，描边时，线条端点形状 butt(平头)、round(圆角)、square(方头) 
- `ctx.lineJoin` 字符串，描边时，线条交点形状 round(圆角)、bevel(取平)、miter(出尖)

矩形是唯一可以直接在 2D 绘图上下文中绘制的形状。与矩形相关的有三个方法，他们都接收 4 个参数，矩形开始的 x 坐标，y 坐标，矩形宽度、矩形高度
- `ctx.fillRect(x, y, w, h)` 绘制矩形，填充颜色使用 fillStyle 属性设置的颜色
- `ctx.strokeRect(x, y, w, h)` 绘制矩形边框(轮廓)，颜色使用 strokeStyle 属性设置的颜色。
- `ctx.clearRect(x, y, w, h)` 擦除画布中的某个矩形区域

```html
<canvas id="drawing" width="200" height="200" style='border:1px solid #ccc;'>
  A draw of something.
</canvas>
<script>
  var drawing = document.getElementById('drawing');
  var context = drawing.getContext('2d');

  // 设置描边颜色为红色，strokeRect画边框矩形时，边框的颜色，默认为黑色
  context.strokeStyle = 'red'; 
  // 设置填充颜色为蓝色，默认为黑色
  context.fillStyle = '#0000ff'; 
  // context.fillStyle = "rgba(0,0,255,0.1)";
  
  // 绘制矩形，在画布的 (10,10) 位置，填充宽 50 高 50 的蓝色矩形，
  context.fillRect(10, 10, 50, 50);

  // 修改填充颜色为蓝色透明，再在画布(30,30)位置，填充宽50高50的蓝色透明矩形
  context.fillStyle = "rgba(0,0,255,0.5)";
  context.fillRect(30, 30, 50, 50);

  // 在(100,100)位置，描边宽50高50的红色矩形框
  context.strokeRect(100, 100, 50, 50);

  // 修改描边的颜色为黑色，然后在(120,120)位置，描边宽50高50黑色矩形框
  context.strokeStyle = 'black';
  context.strokeRect(120, 120, 50, 50);

  // 清除指定位置的rect区域
  context.clearRect(40, 40, 10, 10);
</script>
```

绘制效果如下

![cavasrect](/images/js/cavasrect.png)

### 绘制路径
通过路径绘制可以创造出复杂的形状和线条。绘制路径前必须先调用 `ctx.beginPath()` 方法, 表示要开始绘制新路径。然后通过下面的方法来创建路径
- `ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise)` 以 (x, y) 为圆心绘制一条弧线，半径为 radius, 起始角度和结束角度分别为 startAngle、endAngle，counterclockwise 表示是否是逆时针方向绘制，默认为顺时针方向绘制
- `ctx.arcTo(x1, y1, x2, y2, radius)` 从上一点开始绘制一条弧线，到 (x2, y2) 为止，并以给定的半径，穿过 (x1, y1)，当 (x1,y1) 到 (x2, y2) 的距离大于半径，可能到达不了 (x2, y2) 停在中途
- `lineTo(x, y)` 从上一点开始绘制一条直线，到 (x, y) 为止
- `moveTo(x, y)` 将游标移动到 (x, y) 不画线
- `rect(x, y, width, height)` 从点 (x, y) 开始绘制一个矩形，宽为 widht，高为 height，与 strokeRect() 和 fillRect() 的区别在于这个方法绘制的是一条路径，而不是独立的图形。
- `bezierCurveTo(c1x, c1y, c2x, c2y, x, y)` 以 (c1x, c1y) 和 (c2x, c2y) 为控制点，绘制一条从上一点到 (x, y) 的弧线（三次贝塞尔曲线）
- `quadraticCurveTo(cx, cy, x, y)` 以 (cx, cy) 为控制点，绘制一条从上一点到 (x, y) 的弧线（二次贝塞尔曲线）

绘制完路径后，可以调用下面的方法，来填充路径、描画路径或剪切路径
- `ctx.closePath()` 绘制一条返回起点的线
- `ctx.fill()` 填充路径
- `ctx.stroke()` 描画路径 
- `ctx.clip()` 剪切路径

注意：使用 fill()、stroke()、clip() 绘制完后，如果需要继续绘制路径，需要重新调用 ctx.beginPath()

使用 ctx.arc()、ctx.moveTo()、ctx.stroke() 绘制时钟表盘

![canvas_clock.png](/images/js/canvas_clock.png)

```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;"></canvas>
<script>
  var darwing = document.getElementById('drawing');
  var ctx = darwing.getContext('2d');
  // 开始路径
  ctx.beginPath();

  ctx.arc(100, 100, 99, 0, 2*Math.PI, false); // 外圆
  // 由于画完圆后，坐标停留在(200, 100)的位置，需要移动下起点。
  ctx.moveTo(192, 100);
  ctx.arc(100, 100, 92, 0, 2*Math.PI, false); // 内圆

  // 将绘图游标移动到中心点，画指针
  ctx.moveTo(100, 100);
  ctx.lineTo(100, 20);
  ctx.moveTo(100, 100);
  ctx.lineTo(50, 100);
  ctx.stroke();
</script>
```
关于 arc()、arcTo() 函数的理解

![canvas_arc_arcTo绘制路线图](/images/js/canvas_arc_arcTo.png)

```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;"></canvas>
<script>
  var drawing = document.getElementById('drawing');
  var ctx = drawing.getContext('2d');
  ctx.beginPath();
  // 顺时针画圆 
  // ctx.arc(100, 100, 99, 0, 2*Math.PI, false)
  // ctx.arc(100, 100, 99, 0, 0.5*Math.PI, false)
  // ctx.arc(100, 100, 99, 0.5*Math.PI, 1*Math.PI, false)
  // ctx.arc(100, 100, 99, Math.PI, 1.5*Math.PI, false)
  // ctx.arc(100, 100, 99, 1.5*Math.PI, 2*Math.PI, false)

  // 逆时针画圆
  // ctx.arc(100, 100, 99, 2*Math.PI, 0, true)
  // ctx.arc(100, 100, 99, 1.5*Math.PI, 0, true)
  // ctx.arc(100, 100, 99, 1*Math.PI, 0, true)
  // ctx.arc(100, 100, 99, 0.5*Math.PI, 0, true)
  // ctx.arc(100, 100, 99, 0.3*Math.PI, 0, true)
  ctx.stroke()
</script>
```
上面的例子中，注释的语句如果正常执行，按顺序绘制效果如下

![canvas_arc_1.png](/images/js/canvas_arc_1.png)

![canvas_arc_2.png](/images/js/canvas_arc_2.png)

再来看 arcTo() 的例子，图1 ~ 图5 的代码如下

```js
ctx.beginPath();
ctx.moveTo(200, 100);
ctx.arcTo(100, 100, 100, 0, 100)   // 图 1
// ctx.arcTo(100, 100, 0, 0, 200)  // 图 2
// ctx13.arcTo(100, 100, 0, 0, 60) // 图 3
ctx.stroke()
// 开始绘制圆弧辅助线
ctx.beginPath();
ctx.strokeStyle = "rgba(0, 0, 255, 0.2)"
ctx.moveTo(100, 0);    // 图 1
// ctx12.moveTo(0, 0); // 图 2、图 3
ctx.lineTo(100, 100);
ctx.lineTo(200, 100);
ctx.stroke()
```

![canvas_arcTo.png](/images/js/canvas_arcTo.png)

```js
// 图 4
ctx14.beginPath();
ctx14.moveTo(200, 100);
ctx14.arcTo(100, 200, 0, 100, 30)
ctx14.moveTo(200, 100);
ctx14.arcTo(100, 200, 0, 100, 80)
ctx14.stroke()
// 开始绘制圆弧辅助线
ctx14.beginPath();
ctx14.strokeStyle = "rgba(0, 0, 255, 0.2)"
ctx14.moveTo(0, 100);
ctx14.lineTo(100, 200);
ctx14.lineTo(200, 100);
ctx14.stroke()

// 图 5
ctx15.beginPath();
ctx15.moveTo(200, 100);
ctx15.arcTo(0, 200, 100, 0, 10)
ctx15.moveTo(200, 100);
ctx15.arcTo(0, 200, 100, 0, 30)
ctx15.moveTo(200, 100);
ctx15.arcTo(0, 200, 100, 0, 80)
ctx15.stroke()
// 开始绘制圆弧辅助线
ctx15.beginPath();
ctx15.strokeStyle = "rgba(0, 0, 255, 0.2)"
ctx15.moveTo(100, 0);
ctx15.lineTo(0, 200);
ctx15.lineTo(200, 100);
ctx15.stroke()
```

完整代码：[canvas arc、arcTo demo | Github](https://github.com/zuoxiaobai/fedemo/blob/master/src/JS_ES6/JS%E9%AB%98%E7%A8%8B3/%E4%BD%BF%E7%94%A8Canvas%E7%BB%98%E5%9B%BE/2_cavasPath.html)，在线示例：[canvas arc、arcTo demo 在线示例](https://zuoxiaobai.github.io/fedemo/src/JS_ES6/JS%E9%AB%98%E7%A8%8B3/%E4%BD%BF%E7%94%A8Canvas%E7%BB%98%E5%9B%BE/2_cavasPath.html)

### 绘制文本
ctx.fillText() 和 ctx.strokeText() 绘制文本，或者文本边框。如 fillRect 类似，不需要像绘制路径那样需要先 beginPath()。绘制文本方法有 4 个参数，如下:
- text：要绘制的文本字符串
- x：要绘制的x坐标
- y: 要绘制的y坐标
- width：可选，占用的最大像素宽度。

2D 绘图上下文有 4 个关于绘制文本的基础属性、方法，如下：
- `ctx.font` 表示文本样式字体，用css指定字体的格式来。 如 "bold 10px Arial"
- `ctx.textAlign` 水平对齐方式 默认为start，还有end，center
- `ctx.textBaseline` 垂直对齐方式，默认为bottom，还有 top, middle  
- `ctx.measureText(text)` 返回一个 TextMetrics 对象，该对象只有一个 width 属性，表示绘制文本会占用的宽度。使用 while 循环调整 font size 再调用该函数，可以确定固定宽度时，什么字体大小刚好合适。

![canvas_drawtext](/images/js/canvas_fillText.png)

代码如下：
```html
<p>208*200, 20*20小网格</p>
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;"></canvas>
<script>
  var darwing = document.getElementById('drawing');
  var ctx = darwing.getContext('2d');
  // 开始路径
  ctx.beginPath();

  ctx.arc(100, 100, 99, 0, 2*Math.PI, false); // 外圆
  // 由于画完圆后，坐标停留在(200, 100)的位置，需要移动下起点。
  ctx.moveTo(192, 100);
  ctx.arc(100, 100, 92, 0, 2*Math.PI, false); // 内圆

  // 将绘图游标移动到中心点，画指针
  ctx.moveTo(100, 100);
  ctx.lineTo(100, 20);
  ctx.moveTo(100, 100);
  ctx.lineTo(50, 100);
  ctx.stroke();

  // 绘制参考线 20*20 的网格
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0,0,0,.1)"
  for (var i = 20; i < 200; i+=20) {
    ctx.moveTo(0, i);
    ctx.lineTo(200,i);
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 200);
  }
  ctx.stroke();

  // 绘制参考中心点
  fillPoint(100, 40);
  fillPoint(100, 80);
  fillPoint(100, 120);
  fillPoint(140, 60);
  fillPoint(140, 100);
  fillPoint(140, 140);
  function fillPoint(x, y, color) {
    var radius = 3;
    ctx.fillStyle = "rgba(0,0,255)"
    ctx.beginPath();
    ctx.moveTo(x+radius, y)
    ctx.arc(x, y, radius, 0, 2*Math.PI, false)
    ctx.fill();
  }

  // 绘制文本
  ctx.font = "bold 14px Arial"
  ctx.fillStyle = "red"
  // 默认textAlign为start
  ctx.fillText('12', 100, 40, 20)

  ctx.textAlign = "center"
  ctx.fillText('12', 100, 80, 20)

  ctx.textAlign = "end"
  ctx.fillText('12', 100, 120, 20)

  ctx.textBaseline = "bottom" // 默认textBaseline为bottom
  ctx.fillText('12', 140, 60, 20)

  ctx.textBaseline = "top"
  ctx.fillText('12', 140, 100, 20)

  ctx.textBaseline = "middle"
  ctx.fillText('12', 140, 140, 20)

  // 绘制measureText的测试矩形区域
  ctx.beginPath();
  ctx.strokeStyle = "rgb(0,0,255,.5)"
  ctx.rect(40, 140, 40, 20)
  ctx.stroke();

  // 需要在40px宽度的位置绘制Hello，用measureText(str), 确定字体后再绘制
  var fontsize = 100;
  ctx.font = fontsize + "px Arial"
  while (ctx.measureText('Hello').width > 40) {
    fontsize--;
    ctx.font = fontsize + "px Arial"
  }
  console.log(fontsize)
  console.log(ctx.measureText('Hello').width)
  ctx.textBaseline = "top";
  ctx.textAlign = "start";
  ctx.fillText('Hello', 40, 140)
</script>
```

### 变换
2D 绘图上下文提供了多个用于变换画布的 API
- `ctx.rotate(angle)` 围绕原点把图像旋转 angle 角度 Math.PI 为 180°，旋转后，整个画布都旋转了。初始坐标也会跟着旋转。
- `scale(scaleX, scaleY)` 通过在 x 轴乘以 scaleX，在 y 轴乘以 scaleY 来缩放图像。默认值都是 1.0
- `translate(x, y)` 把原点移动到 (x, y)，原点会从原来的 (0, 0) 变更到 (x, y)
- `transform(m1_1, m1_2, m2_1, m2_2, dx, dy)` 通过矩阵乘法直接修改矩阵
```js
m1_1 m1_2 dx
m2_1 m2_2 dy
0    0    1
```
- setTransform(m1_1, m1_2, m2_1, m2_2, dx, dy) 把矩阵重置为默认值，再以传入的参数调用 transform

来看一个例子
```html
<canvas id="drawing" width="200" height="200" style='border:1px solid #ccc;'>A draw of something.</canvas>
<script>
  let drawing = document.getElementById('drawing')
  let ctx = drawing.getContext('2d')
  ctx.beginPath()
  // 绘制外圆
  ctx.arc(100, 100, 99, 0, 2 * Math.PI, false)
  // 绘制内圆
  ctx.moveTo(194, 100)
  ctx.arc(100, 100, 94, 0, 2 * Math.PI, false)

  ctx.translate(100, 100) // 移动原点到表盘中心
  
  // 旋转图像
  // ctx.rotate(Math.PI / 3) // 围绕原点将图像旋转 60°
  // ctx.rotate(Math.PI / 2) // 围绕原点将图像旋转 90°
  // ctx.rotate(Math.PI) // 围绕原点将图像旋转 180°

  // 绘制分针与时针
  ctx.moveTo(0, 0)   // 相当于原来的 (100, 100)
  ctx.lineTo(0, -85) // 相当于原来的 (100, 15)
  ctx.moveTo(0, 0)   // 相当于原来的 (100, 100)
  ctx.lineTo(-65, 0) // 相当于原来的 (35, 100)

  ctx.stroke()
</script>
```

![canvas_change.png](/images/js/canvas_change.png)

此外，2D 绘图上下文还提供了 2 个函数，用于保存和恢复 fillStyle、strokeStyle 和变换的设置。
- `ctx.save()` 将当前的 fillStyle, strokeStyle，变换的设置保存到栈中
- `ctx.restore()` 从栈中恢复之前保存的设置

来看一个例子
```html
<canvas id="drawing" width="200" height="200" style='border:1px solid #ccc;width: 100px;'>A draw of something.</canvas>
<script>
  let drawing = document.getElementById('drawing')
  let ctx = drawing.getContext('2d')

  ctx.fillStyle = "red"
  ctx.save() // 将当前设置存到栈中

  ctx.fillStyle = "green"
  ctx.translate(100, 100)
  ctx.save() // 将当前设置存到栈中

  ctx.fillStyle = 'blue'
  ctx.fillRect(0, 0, 50, 50) // 在 (100, 100) 的位置绘制蓝色矩形

  ctx.restore()
  ctx.fillRect(10, 10, 50, 50) // 在 (110, 110) 的位置绘制绿色矩形

  ctx.restore()
  ctx.fillRect(0, 0, 50, 50) // 在 (0, 0) 的位置绘制红色矩形
</script>
```

![save_restore.png](/images/js/save_restore.png)

### 绘制图形
`ctx.drawImage()` 可以用来在画布上绘制图片，有三种传参方式：
- 3参 ctx.drawImage(image, x, y) 在画布 (x, y) 位置，开始绘制 image
- 5参 ctx.drawImage(image, x, y, width, height)， 在画布 (x, y) 位置，开始绘制 image，绘制的 image 宽为 width, 高为 height
- 9参 ctx.drawImage(image, 源图像x坐标, 源图像y坐标, 源图像width, 源图像height, 目标图像x坐标，目标图像y坐标，目标图像width，目标图像height)，从原图像的 (x, y) 坐标开始截图 width * height 大小的图片，绘制到画布 (x,y) 坐标位置

注意：图片加载是异步的，如果不等 image 加载完，drawImage() 会无效，参考：[canvas的drawImage()方法，图片不显示](https://zhidao.baidu.com/question/500218334361912884.html)

```html
<style>
  canvas { border: 1px solid #ccc; width: 100px; }
  .sec { margin-right:20px;}
</style>
<div>
  <p>图片原大小: 1078*681，下面展示的大小 100*300</p>
  <img src="cavasimg.png" width="500">
</div>
<div style="display: flex;">
  <div class="sec"> 
    <p>ctx.drawImage(image, 10, 10)</p>
    <canvas id="drawing" width="200" height="200"></canvas>
  </div>
  <div class="sec">
    <p> ctx2.drawImage(image, 10, 10, 100, 50)</p>
    <canvas id="drawing2" width="200" height="200"></canvas>
  </div>
  <div class="sec">
    <p>ctx3.drawImage(image, 100, 0, 150, 150, 10, 10, 150, 150)</p>
    <canvas id="drawing3" width="200" height="200"></canvas>
  </div>
</div>

<script>
  var image = document.images[0]
  image.onload = function(e) {
    var drawing = document.getElementById('drawing');
    var ctx = drawing.getContext('2d');

    // 从(10,10) 开始绘制 image，不改变原图大小
    ctx.drawImage(image, 10, 10) 

    var drawing2 = document.getElementById('drawing2');
    var ctx2 = drawing2.getContext('2d');
    // 从(10,10) 开始绘制 image，设置绘制的图片大小为 100*50
    ctx2.drawImage(image, 10, 10, 100, 50) 

    var drawing3 = document.getElementById('drawing3');
    var ctx3 = drawing3.getContext('2d');
    // 从原图像的 (100, 0) 坐标开始，截图宽 150 高 150 的图片，
    // 然后在画布 (10,10) 的位置开始绘制图形，宽为 150, 高为150
    ctx3.drawImage(image, 100, 0, 150, 150, 10, 10, 150, 150) 
    
  }
</script>
```

![canvas_img.png](/images/js/canvas_img.png)

### 阴影
2D 绘图上下文可以根据以下属性的值，自动为已有形状或路径生成阴影
- `ctx.shadowColor` css颜色值，阴影颜色，默认为黑色
- `ctx.shadowOffsetX` 阴影相对于形状或路径的 x 坐标偏移量, 默认为 0
- `ctx.shadowOffsetY` 阴影相对于形状或路径的 y 坐标偏移量, 默认为 0
- `ctx.shadowBlur` 阴影的模糊量，默认为 0，表示不模糊

```html
<canvas id="drawing" width="200" height="200"></canvas>
<script>
  var drawing = document.getElementById('drawing');
  var ctx = drawing.getContext('2d');
  // 设置阴影
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 4; // 模糊像素
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  // 1.1 绘制红色矩形，会自带阴影
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(10, 10, 50, 50);
  // 1.2 绘制蓝色矩形，会自带阴影
  ctx.fillStyle = "blue";
  ctx.fillRect(30, 30, 50, 50);
</script>
```

![canvas_shadow.png](/images/js/canvas_shadow.png)


### 渐变
渐变使用 CanvasGradient 实例表示。可以通过下面两个方法来创建渐变
- `ctx.createLinearGradient(startX, startY, endX, endY)` 创建一个线性渐变 CanvasGradient 实例。
- `ctx.createRadialGradient(起点圆心x, 起点圆心y, 起点圆半径r, 终点圆心x, 终点圆心y, 终点圆半径r)` 创建一个径向渐变（放射性渐变）实例。

创建 CanvasGradient 实例后，可以使用实例的方法来指定渐变的过渡颜色

- `addColorStop(渐变位置，颜色)` 渐变位置是 0 到 1 之间的值，0 表示开始位置，1 表示结束位置。0.5 表示中间位置。 

来看一个实例

```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;"></canvas>
<script>
  var drawing = document.getElementById('drawing');
  var ctx = drawing.getContext('2d');
  // 设置线性渐变 从(30 ,30) 到 (60,60) 渐变
  var gradient = ctx.createLinearGradient(30, 30, 60, 60); 
  gradient.addColorStop(0, 'white'); // 渐变的起点色为白色
  // gradient.addColorStop(0.5, 'blue'); 
  gradient.addColorStop(1, 'black'); // 渐变的结束色为白色
  // 绘制红色矩形
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 50, 50);
  // 绘制线性渐变矩形
  ctx.fillStyle = gradient;
  ctx.fillRect(30, 30, 50, 50)

  // 绘制辐射渐变, 绘制从 (150, 25) 起点，0 为半径的圆。到终点 (150, 25)，半径为 30 的圆渐变。
  var gradient = ctx.createRadialGradient(150, 25, 0, 150, 25, 30) 
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1, 'blue')
  ctx.fillStyle = gradient
  ctx.fillRect(125, 0, 50, 50)
</script>
```

![canvas_gradient.png](/images/js/canvas_gradient.png)


### 图案 pattern
patter 图案，之前翻译为 模式，用于填充和描绘重复图像。创建新图案，可以使用下面的方法
- `cxt.createPattern(html 中的 img 元素, 指定如果重复图像的字符串)` 第二个参数的值与 CSS 的 background-repeat 属性时一样的，包括：repeat、repeat-x、repeat-y、no-repeat

```html
<div>
  <img src="images/img.png" height="50" width="50">
</div>
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;width: 100px;"></canvas>
<script>
  var drawing = document.getElementById('drawing');
  var ctx = drawing.getContext('2d');
  var image = document.images[0]
  image.onload = function(e) {
    var pattern = ctx.createPattern(image, 'repeat'); // 创建重复的模式
    // var pattern = ctx.createPattern(image, 'repeat-x'); // 创建重复的模式
    // var pattern = ctx.createPattern(image, 'repeat-y'); // 创建重复的模式
    // var pattern = ctx.createPattern(image, 'no-repeat'); // 创建重复的模式
    ctx.fillStyle = pattern;
    ctx.fillRect(10, 10, 150, 150)
  }
</script>
```

![canvas_pattern.png](/images/js/canvas_pattern.png)

### 图像数据/调整图片像素

- `ctx.getImageData(x, y, width, height)` 获取图像的原始数据。它返回的结果是 ImageData 对象，包含三个属性
  - `width` 图像宽度 
  - `height` 图像高度
  - `data` 包含原始像素信息的数组。每个像素在数组中都由 4 个值表示：红、绿、蓝、透明度值。第一个像素的信息包含在第 0 - 3 个值中。第二个像素包含在第 4 - 7 个值中。
- `ctx.putImageData(ImageData实例, x, y)` 将图像数据绘制到画布，从坐标 (x,y) 开始

我们可以通过更改图像数据创建一个简单的灰阶过滤器，来看下面的例子

```html
<div>
  <img src="images/img.png" height="50" width="50">
</div>
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;width:100px;"></canvas>
<script>
  let drawing = document.getElementById('drawing');
  let ctx = drawing.getContext('2d');
  let img = document.images[0]
  // 图片加载完成后再绘制到 canvas
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
    let imgData = ctx.getImageData(0, 0, img.width, img.height)
    let { data } = imgData
    console.log(imgData) // { data: Uint8ClampedArray(10000) [], height: 50, width: 50 } 
    for (let i = 0, len = data.length; i < len; i += 4) {
      let [red, green, blue] = data.slice(i, i + 3)
      // 取得每个像素的 RGB 平均值
      let average = Math.floor((red + green + blue) / 3)
      // 设置 RGB 为平均值，不管透明度
      data[i] = average
      data[i + 1] = average
      data[i + 2] = average
    }
    // 修改后将数据写回 ImageData 并应用到画布上
    imgData.data = data
    ctx.putImageData(imgData, 0, 0)
  }
</script>
```

效果如下，等价于 CSS 滤镜 `filter: grayscale(1)` 的效果

![canvas_img_data.png](/images/js/canvas_img_data.png)

### 合成(composite)
2D 绘制上下文有两个属性，用于设置多个内容重叠时的行为
- `ctx.globalAlpha` 全局透明度 0 到 1 之间，0.5 为半透明，1 为完全不透明，默认值。书中说的默认值为 0，是错误的，p568。参考：[CanvasRenderingContext2D.globalAlpha | MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha)
- `ctx.globalCompositeOperation` 设置新绘制的内容与之前绘制的内容重合时，怎么处理，有 11 种情况。需要注意：不同浏览器可能会有差异
  - `source-over` 默认、新绘制内容在原图形上面，遮盖
  - `source-in` 新图形只绘制出与原图形重叠的部分，原图中其他部分全部透明(不可见)
  - `source-out` 新图形只绘制出不与原图形重叠的部分，原图中其他部分全部透明(不可见)
  - `source-atop` 新图形只绘制出与原图形重叠的部分，原图不受影响
  - `destination-over` 后绘制的内容在先绘制的下面
  - `destination-in` 新图形绘制在原图形下面。原图只有与新图形重叠的部分显示，其他都不可见
  - `destination-out` 新图形与原图形重叠的部分完全透明，其他不受影响
  - `destination-atop` 新图形绘制在原图形的下面，原图形与新图形不重叠的部分全部透明
  - `lighter` 新图形与原图形重叠的部分像素值相加，类似高亮的效果
  - `copy` 新图形完全取代旧图形
  - `xor` 新图形与原图形重叠部分的像素执行 "异或" 计算

```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;width:100px;"></canvas>
<script>
  // 设置全局透明度 ctx.globalAlpha
  var drawing = document.getElementById('drawing');
  var ctx = drawing.getContext('2d');
  // 绘制红色矩形
  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, 50, 50);
  // 修改全局透明度
  ctx.globalAlpha = 0.5;
  // 绘制蓝色矩形
  ctx.fillStyle = "blue";
  ctx.fillRect(30, 30, 50, 50);
  // 重置全局透明度
  ctx.globalAlpha = 1; // p568， 值为 0，貌似有问题

  ctx.fillStyle = 'red'
  ctx.fillRect(100, 100, 50, 50)
  // 设置合成（composite）操作
  // ctx.globalCompositeOperation = 'source-over' // 默认、新图像绘制在原图形上面
  // ctx.globalCompositeOperation = 'source-in' 
  // ctx.globalCompositeOperation = 'source-out' 
  // ctx.globalCompositeOperation = 'source-atop' 
  // ctx.globalCompositeOperation = 'destination-over' // 后绘制的位于先绘制的下面
  // ctx.globalCompositeOperation = 'destination-in' 
  // ctx.globalCompositeOperation = 'destination-out'
  // ctx.globalCompositeOperation = 'destination-atop'
  // ctx.globalCompositeOperation = 'lighter'
  // ctx.globalCompositeOperation = 'copy'
  // ctx.globalCompositeOperation = 'xor'
  ctx.fillStyle = 'rgba(0,0,255,1)'
  ctx.fillRect(125, 125, 50, 50)
</script>
```

上的例子中，在绘制蓝色矩形之前，将  ctx.globalCompositeOperation 设置为各种值，效果如下：

![canvas_compsition.png](/images/js/canvas_compsition.png)

## WebGL
WebGL 是 canvas(画布) 的 3D 上下文。它不是 W3C 的标准，而是 Khronos Group 的标准。

> Khronos Group 是非盈利性、会员资助的联盟，专注于多平台和设备下并行计算、图形和动态媒体的无专利费开放标准。Khronos Group 也定制了其他图形 API, 包括作为浏览器中 WebGL 基础的 OpenGL ES2.0

建议先了解 OpenGL ES2.0 基本概念，再看本节内容，推荐一个 WebGL 教程网站：Learn WebGL。定型数组(typed array)/类型数组是 WebGL 中执行操作的重要数据结构，详情参见第 6 章。

### WebGL 上下文
2D 绘图上下文获取上下文时，使用的是 "2d"。3D 绘图上下文 WebGL 也有对应的值。WebGL 2.0 参数是 "webgl2"，返回类型为 WebGL2RenderingContext。WebGL 1.0 上下文参数为 "webgl"，类型为 WebGLRenderingContext。如果浏览器不支持 WebGL 则返回 null。
```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;width: 100px;">
</canvas>
<script>
  let drawing = document.getElementById('drawing')
  let gl = drawing.getContext('webgl')
  console.log(gl) // WebGLRenderingContext {}
  // let gl= drawing.getContext('webgl1') // null
  // console.log(gl) // null
  // let gl = drawing.getContext('webgl2')
  // console.log(gl) // WebGL2RenderingContext {}
</script>
```

WebGL 上下文实例，一般命名为 gl

### WebGL基础
获取 WebGL 上下文后，就可以开始 3D 绘图了。由于 WebGL 是 OpenGL ES2.0 在 Web 中的实现，这里讨论的概率实际上都是 JS 实现的 OpenGL 概念。

使用 getContext() 获取 WebGL 上下文时，还可以通过第二个参数指定一些选项，第二个参数是一个 options 对象。可以包含如下属性：
- `alpha` 布尔值，是否为上下文创建透明通道缓冲区，默认为 true
- `depth` 布尔值，是否使用 16 位深缓冲区，默认为 true
- `stencil` 布尔值，是否使用 8 位魔板缓冲区，默认为 false
- `antialias` 布尔值，是否使用默认机制执行抗锯齿操作，默认为 true
- `premultipliedAlpha` 布尔值，绘图缓冲区是否预乘透明度值，默认为 true
- `preserveDrawingBuffer` 布尔值，表示绘图完成后是否保留绘图缓冲区，默认为 false

注意：修改默认值，可能会影响性能。由于有些浏览器在调用 getContext() 不能创建 WebGL上下文时会抛出错误，影响后面代码执行，因此使用时最好用 try/catch 包裹。

```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;width: 100px;">
</canvas>
<script>
  let drawing = document.getElementById('drawing'),
      gl;
  try {
     gl = drawing.getContext('webgl', {
      alpha: false
    })
  } catch(ex) {
    // 什么也不做
  }
  console.log(gl) // WebGLRenderingContext {}
  if (gl) {
    // 如果 gl 存在
  }
</script>
```

**1. 常量**，在 OpenGL 中，用于操作的各种常量都是以 GL_ 开头，在 WebGL 上下文中，常量不包含 GL_ 前缀。例子 GL_COLOR_BUFFER_BIT 常量在 WebGL 中要使用 gl.COLOR_BUFFER_BIT 访问。

**2. 方法命名**，WebGL 中的很多方法名中会包含数据类型，及参数个数信息。比如 gl.uniform4f() 表示需要 4 个浮点数值参数，而 gl.uniform3i() 表示需要 3 个整数值参数。数组类型一般使用字母 v 表示（"vector"）。gl.uniform3iv() 表示要接收一个包含三个值的数组参数。

**3. 准备绘图**，在绘图之前，需要先指定一种颜色，清除绘制区域 gl.clearColor(r, g, b, a)。

```js
// 使用黑色清除绘制区域
gl.clearColor(0, 0, 0, 1)
// 使用之前定义的颜色填充画布，canvas 会被填充为黑色
gl.clear(gl.COLOR_BUFFER_BIT)
```

**4. 视口与坐标**，绘图前还要定义 WebGL 视口，默认情况下视口使用整个 canvas 区域。要改变视口，可以调用 viewport() 方法并传入视口相对于 canvas 元素的 x, y 坐标及高度和高度。**注意：定义视口时 (0, 0) 是左下角**

```js
// 使用整个 canvas 区域作为视口
gl.viewport(0, 0, drawing.width, drawing.height)
// 视口是 canvas 左下角 1/4 区域
gl.viewport(0, 0, drawing.width/2, drawing.height/2)
// 视口是 canvas 左上角 1/4 区域
gl.viewport(0, drawing.height/2, drawing.width/2, drawing.height/2)
// 视口是右下角 1/4 区域
gl.viewport(drawing.width/2, 0, drawing.width/2, drawing.height/2)
```
定义视口时的坐标系统和视口中的坐标系统不一样。(0, 0) 是视口的中心点。左下角是 (-1, -1)，右上角是 (1, 1)

**5.缓冲区**，JS 中，定点信息保存在 typed array 中，要使用这些信息，需要先把他们转换为 WebGL 缓冲区。
- `gl.createBuffer()` 创建 WebGL 缓冲区，返回一个 WebGLBuffer 实例。
- `gl.bindBuffer(target, WebGLBuffer实例)` 将 WebGL 缓冲区，绑定到 WebGL 上下文，绑定后就可以用数据填充缓冲区了。target 的值可以是:
  - `gl.ARRAY_BUFFER`：包含顶点属性的缓冲区，例如顶点坐标，纹理坐标数据或顶点颜色数据。
  - `gl.ELEMENT_ARRAY_BUFFER` 用于元素数组缓冲区。
- `gl.bufferData(target, typed array数据, 如果使用缓冲区)` 使用 JS typed array 数据初始化当前 WebGL 缓冲区，将 JS 数组内容写入 buffer。第 3 个参数表示如何使用缓冲区，可以是以下常量值：
  - `gl.STATIC_DRAW` 数据加载一次，可以在多次绘制中使用。**最常用**
  - `gl.STREAM_DRAW` 数据加载一次，只能在几次绘制中使用。
  - `gl.DYNAMIC_DRAW` 数据可以重复修改，在多次绘制中使用。
- `gl.deleteBuffer()` 缓冲区会一直驻留在内存中，知道页面 unload 卸载。可以使用 gl.deleteBuffer() 释放其占用的内容。

```js
// 创建 WebGL 缓存区
let buffer = gl.createBuffer() 
// 将 buffer 设置为上下文的当前缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, buffer) 
// 使用一个 Float32Array 数组初始化 buffer（将内容写入 buffer）
// 通常把所有顶点点信息保存在 Float32Array 中
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0.5, 1]), gl.STATIC_DRAW)

// 如果不需要缓冲区了，可以释放其内存
fl.deleteBuffer(buffer)
```

**6. 错误**，WebGL 通常不会像 JS 那样直接抛出错误。必须在可能会执行失败的方法后，调用 gl.getError() ，该方法返回一个常量，表示错误类型，其值可能是：
- `gl.NO_ERROR` 上一次操作没错误发生 (0) 
- `gl.INVALID_ENUM` 上一次操作没有传入 WebGL 预定义的常量
- `gl.INVALID_VALE` 上一次操作需要无符号数，但传入了负数
- `gl.INVALID_OPERATION` 上一次操作在当前状态下无法完成
- `gl.OUT_OF_MEMORY` 上一次操作因内存不足无法完成
- `gl.CONTEXT_LOST_WEBGL` 上一次操作因为外部事件（如停电）而丢失了 WebGL 上下文

如果有多个错误，需要多次调用 gl.getError()，直到返回 gl.NO_ERROR（数值0）为止
```js
let errorCode = gl.getError()
while (errorCode) {
  console.log("Error: ", errorCode)
  errorCode = gl.getError()
}
```

**7. 着色器**，WebGL 中有两种着色器：
- **顶点着色器**，用于把 3D 顶点转换为可以渲染的 2D 点。
- **片段(或像素)着色器**，用于计算绘制一个像素的正确颜色。

WebGL 着色器不是 JS 实现的，而是使用类似于 C 语言的 GLSL(OpenGL Shading Language) 语言写的。每个着色器都有一个 main() 方法，会绘制期间重复执行。给着色器传递数据的方式有两种：
- attribute 用于将顶点传入顶点着色器
- uniform 用于将常量值传入任何着色器。

```html
<!-- 顶点着色器 -->
<script type="x-webgl/x-vertex-shader" id="vertexShader">
// 定义一个顶点着色器 aVertexPosition
// vec2 数据类型，包含两项的数组，(x, y)
attribute vec2 aVertexPosition; 
void main() {
  gl_position = vec4(aVertexPosition)
}
</script>

<!-- 片段着色器 -->
<script type="x-webgl/x-fragment-shader" id="fragmentShader">
// 定义一个片段着色器 uColor
uniform vec4 uColor;
void main() {
  gl_FragColor = uColor
}
</script>

<script>
  let vertexGlsl = document.getElmentById("vertexShader").text
  let fragmentGlsl = document.getElementById("fragmentShader").text
</script>
```
有了着色器代码的字符串，下一步是创建着色器（shader）对象 
- `gl.createShader(shader_type)` 创建着色器（shader）对象，类型为 WebGLShader，着色器类型有两种：`gl.VERTEX_SHADER` 或 `gl.FRAGMENT_SHADER`。分别对应顶点着色器和片段着色器
- `gl.shaderSource(着色器对象, GLSL着色器代码)` 将 GLSL 代码应用到着色器对象
- `gl.compileShader(着色器对象)` 编译着色器

```js
let vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexGlsl)
gl.compileShader(vertexShader)

let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragmentGlsl)
gl.compileShader(fragmentShader)
```
上面的代码中，创建了两个着色器对象，还需要把着色器对象链接到着色器程序
- `gl.createProgram()` 用于创建着色器程序（WebGLProgram）对象，它由两个编译过后的 WebGLShader 组成 - 顶点着色器和片段着色器（均由 GLSL 语言所写）。这些组合成一个可用的 WebGL 着色器程序。
- `gl.attachShader(着色器程序对象, 着色器对象)` 负责向 WebGLProgram 对象添加一个片段或者顶点着色器。
- `gl.linkProgram(着色器程序对象)` 链接着色器程序，完成片段着色器和顶点着色器 GPU 代码的准备工作
- `gl.userProgram(着色器程序对象)` 应用着色器程序到当前渲染状态中，后续的绘制操作都会使用这个程序

```js
let program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
gl.useProgram(program)
```
前面的着色器都需要传入一个值，才能工作。对于顶点
- `gl.getUniformLocation(program, name)` 返回着色器程序 program 中名为 name 的片段着色器内存地址。类型：WebGLUniformLocation
- `gl.uniform4fv(A WebGLUniformLocation object, value)` 为着色器设置值，参考：[WebGLRenderingContext.uniform[1234][fi][v] | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform)
- `gl.getAttribLocation(program, name)` 返回着色器程序 program 中名为 name 的顶点着色器内存地址。类型：WebGLUniformLocation
- `gl.enableVertexAttribArray(WebGLUniformLocation实例)` 激活内存地址（索引）
- `gl.vertexAttribPointer(index, size, type, normalized, stride, offset)` 告诉显卡从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据。index 指定要修改的顶点属性的索引，size 指定每个顶点属性的组成数量，必须是1，2，3或4。type 指定数组中每个元素的数据类型，normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。stride 指定连续顶点属性开始之间的偏移量(即数组中一行长度)。offset 指定顶点属性数组中第一部分的字节偏移量。参考：[WebGLRenderingContext.vertexAttribPointer() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/vertexAttribPointer)
```js
// 在着色器程序 program 中，找到片段着色器 uColor 的内存位置
let uColor = gl.getUniformLocation(program, "uColor")
// 向 uColor 内存位置，写入值 [0, 0, 0, 1]
gl.uniform4fv(uColor, [0, 0, 0, 1])

// 取得顶点着色器 aVertexPosition 的内存位置(索引)
let aVertexPpsition = gl.getAttribLocation(program, "aVertexPosition")
// 激活索引
gl.enableVertexAttribArray(aVertexPosition)
// 从当前缓冲区(bindBuffer()指定的缓冲区)读取顶点数据
let vertexSetSize = 2
gl.vertexAttribPointer(aVertexPosition, vertexSetSize, gl.FLOAT, false, 0, 0)
```

**一般着色器操作的失败是静默的，不会抛出真实的错误，需要自己去捕获。**，如果我们跑上面的例子会发现，在控制台有 warning：`WebGL: INVALID_OPERATION: useProgram: program not valid`，着色器程序是无效的。用以下方法可以进行调试
- `gl.getShaderParameter(shader实例, pname)` 返回着色器实例的 pname 信息， pname 的可选值如下：
  - `gl.COMPILE_STATUS` 着色器是否编译成功 true or false
  - `gl.DELETE_STATUS` 着色器是否被删除 true or false
  - `gl.SHADER_TYPE` 着色器类型（顶点着色器，还是片段着色器）
- `gl.getShaderInfoLog(shader实例)` 获取着色器 log 信息，It contains warnings, debugging and compile information.

我们使用上面的两个函数可以读取到 fragmentShader 编译的错误信息：`ERROR: 0:2: '' : No precision specified for (float)` 片段着色器代码没有添加精度描述，在前面加上一句 `precision mediump float;` 16 位浮点格式，即可
```js
if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(fragmentShader));
}
```
另外也可以通过 `gl.getProgramParameter()` 和 `gl.getProgramInfoLog()` 获取着色器程序的 log 信息
```js
if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getProgramInfoLog(program))
}
```
**8. 绘图** WebGL 只能绘制三种形状：点、线和三角形。绘图需要使用下面两个函数
- `gl.drawArrays(mode, first, count)` Renders primitives from array data. 使用数组缓冲区绘制图元，first GLint 类型 ，指定从哪个点开始绘制。count GLsizei 类型，指定绘制需要使用到多少个点。
- `gl.drawElements(mode, count, type, offset)` 使用 元素数组缓冲区绘制图元

mode，GLenum 类型，指定绘制图元的方式，可能值如下。
- `gl.POINTS` 绘制一系列点。
- `gl.LINE_STRIP` 绘制一个线条。即，绘制一系列线段，上一点连接下一点。
- `gl.LINE_LOOP` 绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
- `gl.LINES` 绘制一系列单独线段。每两个点作为端点，线段之间不连接。
- `gl.TRIANGLE_STRIP` 绘制一个三角带。
- `gl.TRIANGLE_FAN` 绘制一个三角扇。
- `gl.TRIANGLES` 绘制一系列三角形。每三个点作为顶点。

完整绘制三角形代码
```html
<canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;width: 100px;">
</canvas>
<!-- 顶点着色器 -->
<script type="x-webgl/x-vertex-shader" id="vertexShader">
attribute vec2 aVertexPosition;
void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
</script>
<!-- 片段着色器 -->
<!-- precision mediump float; -->
<script type="x-webgl/x-fragment-shader" id="fragmentShader">
precision mediump float;
uniform vec4 uColor;
void main() {
  gl_FragColor = uColor;
}
</script>
<script>
  let drawing = document.getElementById('drawing')
  let gl = drawing.getContext('webgl')

  // 使用白色清除绘制区域
  gl.clearColor(255, 255, 255, 1)
  // 使用之前定义的颜色填充画布，canvas 会被填充为黑色
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 设置视口视口
  gl.viewport(0, 0, drawing.width, drawing.height);

  // 定义三角形，三个顶点信息 typed array 数组
  let vertices = new Float32Array([0, 1, 1, -1, -1, -1])
  // x, y 两个点坐标
  let vertexSetSize = 2

  // 创建 WebGL 缓冲区
  let buffer = gl.createBuffer() 
  // 将 buffer 设置为上下文的当前缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer) 
  // 使用一个 Float32Array 数组初始化 buffer（将内容写入 buffer）
  // 通常把所有顶点点信息保存在 Float32Array 中
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  
  // 获取 glsl 着色器代码
  let vertexGlsl = document.getElementById("vertexShader").text
  let fragmentGlsl = document.getElementById("fragmentShader").text
  console.log(vertexGlsl, fragmentGlsl)

  // 根据着色器代码创建着色器实例 vertexShader、fragmentShader
  let vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vertexGlsl)
  gl.compileShader(vertexShader)
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fragmentGlsl)
  gl.compileShader(fragmentShader)
  // 测试片段着色器编译是否有异常
  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader));
  }
  console.log(vertexShader, fragmentShader) // WebGLShader {}

  // 创建着色器程序
  let program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  console.log(program) // WebGLProgram {}

  // 给着色器赋值
  // 在着色器程序 program 中，找到片段着色器 uColor 的内存位置
  let uColorLocation = gl.getUniformLocation(program, "uColor")
  // 向 uColor 内存位置，写入值 [0, 0, 0, 1]
  gl.uniform4fv(uColorLocation, [0, 0, 0, 1])
  // 取得顶点着色器 aVertexPosition 内存位置(索引)，并将顶点信息传入
  let aVertexPosition = gl.getAttribLocation(program, "aVertexPosition")
  // 激活索引
  gl.enableVertexAttribArray(aVertexPosition)
  // 从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据
  gl.vertexAttribPointer(aVertexPosition, vertexSetSize, gl.FLOAT, false, 0, 0)

  // 绘制三角形 从 index 0 开，3 个点
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / vertexSetSize)
  // gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / vertexSetSize)
  // gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / vertexSetSize)
</script>
```

![webgl_triangle.png](/images/js/webgl_triangle.png)

**9. 纹理** WebGL 纹理可以使用 DOM 中的图片，详情参考：[WebGL 纹理详解 - 知乎](https://zhuanlan.zhihu.com/p/52590272)

```html
<img src="img.png" height="50" width="50">
<script>
// 使用现有图片
// let image = document.images[0]
// 动态加载图片
let image = new Image()
image.src = "img.png"
image.onload = function(e) {
  // 创建纹理
  let texture = gl.createTexture()
  // 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // 开启 FlipY（UNPACK_FLIP_Y_WEBGL）不过不使用这个标准图片会倒过来
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  // 填充纹理内容
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  // 参数设置
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  console.log(texture)

  // 清除当前纹理
  gl.bindTexture(gl.TEXTURE_2D, null)
}
</script>
```

**10. 读取像素**，类似于 2D 上下文中的 `ctx.getImage()`，WebGL 上下文可以通过 `gl.readPixels()` 读取像素信息
- gl.readPixels(x, y, width, height, format, type, pixels) 参考: [WebGLRenderingContext.readPixels() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/readPixels)

下面的代码是读取帧缓冲区中 25 x 25 像素区域，把读到的像素信息存入 pixels。其中每个像素的颜色都已 4 个值表示，rgba。每个数值取值 0 ~ 255。
```js
let pixels = new Uint8Array(25 * 25)
gl.readPixels(0, 0, 25, 25, gl.RGB, gl.UNSIGNED_BYTE, pixels)
```

### WebGL1 与 WebGL2
WebGL1 与 WebGL2 几乎完全兼容，WebGL2 加入了一些扩展。WebGL1 的上下文与 WebGL2 向下文不同。
- "webgl" (或"experimental-webgl") 这将创建一个 WebGLRenderingContext 三维渲染上下文对象。只在实现WebGL 版本1(OpenGL ES 2.0)的浏览器上可用。
- "webgl2" (或 "experimental-webgl2") 这将创建一个 WebGL2RenderingContext 三维渲染上下文对象。只在实现 WebGL 版本2 (OpenGL ES 3.0)的浏览器上可用。

WebGL2 着色器语言 GLSL 从 GLSL 100 升级到 GLSL 300

更多 WebGL2 信息参考：[WebGL2RenderingContext | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL2RenderingContext)