# 18. 动画与 Canvas 图形
HTML5加入了canvas元素，IE9+支持，这个元素负责在页面中设定一个区域，然后可以通过js动态的在这个区域中绘制图形。canvas 必须设置width和height属性，指定可以绘图区域的大小，如果不添加样式或绘制内容是看不到该元素的，可以设置下border看效果
## canvas绘制2d图形
```js
// chrome 下下面的字是显示不出来的
// <canvas id="drawing" width="200" height="200" style="border:1px solid #ccc;">A draw of something.</canvas>
// 如果需要在canvas上绘图，需要先获取绘图上下文，即 canvas元素.getContext('2d')
```
- 用获取到的2d上下文绘制矩形、矩形边框、清除矩形，效果及代码如下：

![cavasrect](/images/js/cavasrect.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>canvas base</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200" style='border:1px solid #ccc;'>A draw of something.</canvas>

    <script>
      var drawing = document.getElementById('drawing');
      var context = drawing.getContext('2d');

      context.strokeStyle = 'red'; // 设置描边颜色为红色，strokeRect画边框矩形时，边框的颜色，默认为黑色
      context.fillStyle = '#0000ff'; // 设置填充颜色为蓝色，默认为黑色
      // context.fillStyle = "rgba(0,0,255,0.1)";
      
      // 绘制矩形，fillRect()、strokeRect()、clearRect() 都接收4个参数：矩形的x坐标，矩形的y坐标，矩形的宽度，矩形的高度
      // 在画布的(10,10)位置，填充宽50高50的蓝色矩形，
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
  </body>
</html>
```
### 绘制路径
通过路径绘制可以创造出复杂的形状和线条。要绘制路径必须先调用beginPath()方法, 表示要开始绘制新路径。然后通过方法来创建路径，然后通过 fill()、stroke()、clip()来填充、描边、剪切路径。
```js
// - ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise) 
// 以(x,y)为圆心绘制一条弧线，半径为radius, 起始角度和结束角度分别为startAngle、endAngle，counterclockwise：是否是逆时针方向？
// - ctx.arcTo(x1, y1, x2, y2, radius) 
// 从上一点开始绘制一条弧线，到(x2,y2)为止，并以给定的半径，穿过(x1, y1)，当(x1,y1)到(x2,y2)的距离，大于半径，可能到达不了x2,y2.停在中途
// - lineTo(x, y) 从上一点开始绘制一条直线，到(x, y)为止
// - moveTo(x, y) 将游标移动到(x, y)，不画线
// - rect(x, y, width, height) 从点(x, y)开始绘制一个矩形，宽为widht，高为height，这个方法绘制的是矩形路径。
// 绘制曲线的bezierCurveTo(c1x, c1y, c2x, c2y, x, y); quadraticCurveTo(cx, cy, x, y) 待后续研究 p449
```
画线、移动游标，绘制矩形比较简单，就不举例子了，arc()、arcTo(),rect() demo如下：
![canvas_arc_arcTo绘制路线图](/images/js/canvas_arc_arcTo.png)
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>canvas base</title>
        <style>
            .div { 
                text-align: center; padding:5px; margin:10px; width: 200px;
            }
            .label { font-size: 13px; margin-bottom: 10px;} 
            .highlight { color: red }
            pre {
                white-space: pre-line;margin-left:15px;
                border-left: 5px solid #ccc;
                padding-left: 10px;
            }
            .flex {
                display: flex;
            }
            canvas {
                border: 1px solid #ccc;
            }
        </style>
    </head>
    <body>
        <div>
            <h2>ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise)</h2>
            <blockquote>
                以(x,y)为圆心绘制一条弧线，半径为radius, 起始角度和结束角度分别为startAngle、endAngle，counterclockwise：是否是逆时针方向？
            </blockquote>
            <div>
                <pre>
                    var drawing = document.getElementById('drawing');
                    var ctx = drawing.getContext('2d');
                    ctx.beginPath();
                    ctx.arc(100, 100, 99, <span class="highlight">开始位置, 结束位置</span>, false) // 以(100,100)为中心，99半径，从开始位置到结束位置，顺时针绘制
                    ctx.stroke()
                </pre>
            </div>
            <div class="flex">
                <div class="div">
                    <div class="label">drawing: ctx.arc(100, 100, 99, <span class="highlight">0, 2*Math.PI</span>, false)</div>
                    <canvas id="drawing" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing2: ctx.arc(100, 100, 99, <span class="highlight">0, 0.5*Math.PI</span>, false)</div>
                    <canvas id="drawing2" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing3: ctx.arc(100, 100, 99, <span class="highlight">0.5*Math.PI, Math.PI</span>, false)</div>
                    <canvas id="drawing3" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing4: ctx.arc(100, 100, 99, <span class="highlight">Math.PI, 1.5*Math.PI</span>, false)</div>
                    <canvas id="drawing4" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing5: ctx.arc(100, 100, 99, <span class="highlight">1.5*Math.PI, 2*Math.PI</span>, false)</div>
                    <canvas id="drawing5" width="200" height="200" >A draw of something.</canvas>
                </div>
            </div>

            <div>
                <pre>
                    var drawing6 = document.getElementById('drawing6');
                    var ctx6 = drawing6.getContext('2d');
                    ctx6.beginPath();
                    ctx6.arc(100, 100, 99, <span class="highlight">开始位置, 结束位置</span>, <span style="color:blue">true</span>) // 以(100,100)为中心，99半径，从开始位置到结束位置，逆时针绘制
                    ctx6.stroke()        
                </pre>
            </div>
            <div class="flex">
                <div class="div">
                    <div class="label">drawing6: ctx.arc(100, 100, 99, <span class="highlight">2*Math.PI, 0</span>, true)</div>
                    <canvas id="drawing6" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing7: ctx.arc(100, 100, 99, <span class="highlight">1.5*Math.PI, 0</span>, true)</div>
                    <canvas id="drawing7" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing8: ctx.arc(100, 100, 99, <span class="highlight">1*Math.PI, 0</span>, true)</div>
                    <canvas id="drawing8" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing9: ctx.arc(100, 100, 99, <span class="highlight">0.5*Math.PI, 0</span>, true)</div>
                    <canvas id="drawing9" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing10: ctx.arc(100, 100, 99, <span class="highlight">0.3*Math.PI, 0</span>, true)</div>
                    <canvas id="drawing10" width="200" height="200" >A draw of something.</canvas>
                </div>
            </div>
        </div>
 
        <div>
            <h2>ctx.arcTo(x1, y1, x2, y2, radius)</h2>
            <blockquote>
                从上一点开始绘制一条弧线，到(x2,y2)为止，并以给定的半径，穿过(x1, y1)，当(x1,y1)到(x2,y2)的距离，大于半径，可能到达不了x2,y2.停在中途
            </blockquote>
            <div>
            <pre>
                var drawing11 = document.getElementById('drawing11');
                var ctx11 = drawing11.getContext('2d');
                ctx11.beginPath();
                ctx11.moveTo(0, 200);
                ctx11.lineTo(200, 100);
                ctx11.arcTo(<span class="highlight">圆弧经过点x1, , 圆弧经过点y1, 目的点x2, 目的点y2, 圆弧半径radius</span>)
                ctx11.stroke()
                // 开始绘制辅助线，有利于更好的理解arcTo函数
                ctx11.beginPath();
                ctx11.strokeStyle = "rgba(0, 0, 255, 0.2)"
                ctx11.moveTo(100, 0);
                ctx11.lineTo(100, 100);
                ctx11.lineTo(200, 100);
                ctx11.stroke()
            </pre>
            <div class="flex">
                <div class="div">
                    <div class="label">drawing11: ctx11.arcTo(<span class="highlight">100, 100, 100, 0, 100</span>)</div>
                    <canvas id="drawing11" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing12: ctx11.arcTo(<span class="highlight">100, 100, 0, 0, 200</span>)</div>
                    <canvas id="drawing12" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing13: ctx11.arcTo(<span class="highlight">100, 100, 0, 0, 60</span>)</div>
                    <canvas id="drawing13" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing14: ctx.arc(<span class="highlight">100, 200, 0, 100, 30/80</span>)</div>
                    <canvas id="drawing14" width="200" height="200" >A draw of something.</canvas>
                </div>
                <div class="div">
                    <div class="label">drawing15: ctx.arc(<span class="highlight">0, 200, 100, 0, 10/30/80</span>)</div>
                    <canvas id="drawing15" width="200" height="200" >A draw of something.</canvas>
                </div>
            </div>
        </div>
        
        <div>
            <h2>rect(x, y, width, height)</h2>
            <blockquote>
                从点(x, y)开始绘制一个矩形，宽为widht，高为height，这个方法绘制的是矩形路径。
            </blockquote>
            <div>
            <pre>
                var drawing16 = document.getElementById('drawing16');
                var ctx16 = drawing16.getContext('2d');
                ctx16.beginPath();
                ctx16.rect(50,100,100,100)
                ctx16.stroke();
            </pre>
            <div class="flex">
                <div class="div">
                    <div class="label">drawing16: ctx16.rect(50,100,100,100)</div>
                    <canvas id="drawing16" width="200" height="200" >A draw of something.</canvas>
                </div>
            </div>
        </div>
        <script>
            var drawing = document.getElementById('drawing');
            var ctx = drawing.getContext('2d');
            ctx.beginPath();
            ctx.arc(100, 100, 99, 0, 2*Math.PI, false)
            ctx.stroke()

            var drawing2 = document.getElementById('drawing2');
            var ctx2 = drawing2.getContext('2d');
            ctx2.beginPath();
            ctx2.arc(100, 100, 99, 0, 0.5*Math.PI, false)
            ctx2.stroke()

            var drawing3 = document.getElementById('drawing3');
            var ctx3 = drawing3.getContext('2d');
            ctx3.beginPath();
            ctx3.arc(100, 100, 99, 0.5*Math.PI, 1*Math.PI, false)
            ctx3.stroke()

            var drawing4 = document.getElementById('drawing4');
            var ctx4 = drawing4.getContext('2d');
            ctx4.beginPath();
            ctx4.arc(100, 100, 99, Math.PI, 1.5*Math.PI, false)
            ctx4.stroke()

            var drawing5 = document.getElementById('drawing5');
            var ctx5 = drawing5.getContext('2d');
            ctx5.beginPath();
            ctx5.arc(100, 100, 99, 1.5*Math.PI, 2*Math.PI, false)
            ctx5.stroke()
            
            var drawing6 = document.getElementById('drawing6');
            var ctx6 = drawing6.getContext('2d');
            ctx6.beginPath();
            ctx6.arc(100, 100, 99, 2*Math.PI, 0, true)
            ctx6.stroke()
                    
            var drawing7 = document.getElementById('drawing7');
            var ctx7 = drawing7.getContext('2d');
            ctx7.beginPath();
            ctx7.arc(100, 100, 99, 1.5*Math.PI, 0, true)
            ctx7.stroke()

            var drawing8 = document.getElementById('drawing8');
            var ctx8 = drawing8.getContext('2d');
            ctx8.beginPath();
            ctx8.arc(100, 100, 99, 1*Math.PI, 0, true)
            ctx8.stroke()

            var drawing9 = document.getElementById('drawing9');
            var ctx9 = drawing9.getContext('2d');
            ctx9.beginPath();
            ctx9.arc(100, 100, 99, 0.5*Math.PI, 0, true)
            ctx9.stroke()

            var drawing10 = document.getElementById('drawing10');
            var ctx10 = drawing10.getContext('2d');
            ctx10.beginPath();
            ctx10.arc(100, 100, 99, 0.3*Math.PI, 0, true)
            ctx10.stroke()
            
            var drawing11 = document.getElementById('drawing11');
            var ctx11 = drawing11.getContext('2d');
            ctx11.beginPath();
            ctx11.moveTo(200, 100);
            ctx11.lineTo(200, 100);
            ctx11.arcTo(100, 100, 100, 0, 100)
            ctx11.stroke()
            // 开始绘制圆弧辅助线
            ctx11.beginPath();
            ctx11.strokeStyle = "rgba(0, 0, 255, 0.2)"
            ctx11.moveTo(100, 0);
            ctx11.lineTo(100, 100);
            ctx11.lineTo(200, 100);
            ctx11.stroke()

            var drawing12 = document.getElementById('drawing12');
            var ctx12 = drawing12.getContext('2d');
            ctx12.beginPath();
            ctx12.moveTo(200, 100);
            ctx12.lineTo(200, 100);
            ctx12.arcTo(100, 100, 0, 0, 200)
            ctx12.stroke()
            // 开始绘制圆弧辅助线
            ctx12.beginPath();
            ctx12.strokeStyle = "rgba(0, 0, 255, 0.2)"
            ctx12.moveTo(0, 0);
            ctx12.lineTo(100, 100);
            ctx12.lineTo(200, 100);
            ctx12.stroke()

            var drawing13 = document.getElementById('drawing13');
            var ctx13 = drawing13.getContext('2d');
            ctx13.beginPath();
            ctx13.moveTo(200, 100);
            ctx13.lineTo(200, 100);
            ctx13.arcTo(100, 100, 0, 0, 60)
            ctx13.stroke()
            // 开始绘制圆弧辅助线
            ctx13.beginPath();
            ctx13.strokeStyle = "rgba(0, 0, 255, 0.2)"
            ctx13.moveTo(0, 0);
            ctx13.lineTo(100, 100);
            ctx13.lineTo(200, 100);
            ctx13.stroke()

            var drawing14 = document.getElementById('drawing14');
            var ctx14 = drawing14.getContext('2d');
            ctx14.beginPath();
            ctx14.moveTo(200, 100);
            ctx14.lineTo(200, 100);
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

            var drawing15 = document.getElementById('drawing15');
            var ctx15 = drawing15.getContext('2d');
            ctx15.beginPath();
            ctx15.moveTo(200, 100);
            ctx15.lineTo(200, 100);
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

            var drawing16 = document.getElementById('drawing16');
            var ctx16 = drawing16.getContext('2d');
            ctx16.beginPath();
            ctx16.rect(50,100,100,100)
            ctx16.stroke();

            // ctx16.moveTo(200, 100);
        </script>
    </body>
</html>
```
- 绘制时钟表盘
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>canvas clock</title>
  </head>
  <body>
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
  </body>
</html>
```
### 绘制文本
fillText() 和 strokeText()绘制文本，或者文本边框。如fillRect类似，不必像绘制路径那样需要先beginPath()。绘制文本方法有4个参数，如下:
- text：要绘制的文本字符串
- x：要绘制的x坐标
- y: 要绘制的y坐标
- with：可选，占用的最大像素宽度。

ctx，2D绘图上下文有三个关于绘制文本的基础属性，如下：
- font: 表示文本样式字体，用css指定字体的格式来。 如 "bold 10px Arial"
- textAlign: 水平对齐方式 默认为start，还有end，center
- textBaseline: 垂直对齐方式，默认为bottom，还有 top, middle  
![canvas_drawtext](/images/js/canvas_fillText.png)
示例代码如下：
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>canvas clock</title>
  </head>
  <body>
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
  </body>
</html>
```

### 变换
暂时未发现大的用途，p453，以后再看，无意中用setTimeout写了个动画。待用window.requestAnimationFrame()做出更细致的动画
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>canvas 变换</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200" style='border:1px solid #ccc;'>A draw of something.</canvas>

    <script>
      var drawing = document.getElementById('drawing');
      var ctx = drawing.getContext('2d');

      ctx.beginPath();
      ctx.arc(100, 100, 99, 0, 2*Math.PI, false);
      ctx.moveTo(192, 100);
      ctx.arc(100, 100, 92, 0, 2*Math.PI, false);
      ctx.moveTo(60,100);
      ctx.lineTo(100,100);
      ctx.lineTo(100, 40);
      ctx.stroke();

      let x = 200, y = 200;
      var timer = setInterval(function() {
        if (y === 0) {
          clearInterval(timer)
        }
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(x, y)
        ctx.stroke();
        y = y - 10
      }, 1000)
    </script>
  </body>
</html>
```
### 绘制图形
drawImage()可以用来在画布上绘制图片，有三种传参方式：
- 3参 ctx.drawImage(image, x, y) 在画布(x, y)位置，开始绘制image
- 5参 ctx.drawImage(image, x, y, width, height)， 在画布(x, y)位置，开始绘制image，绘制的image宽为width,高为height
- 9参 ctx.drawImage(image, 源图像x坐标, 源图像y坐标, 源图像width, 源图像height, 目标图像x坐标，目标图像y坐标，目标图像width，目标图像height)，从原图像的(x,y)坐标开始截图width*height大小的图片，绘制到画布(x,y)坐标位置
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>canvas 绘制图片</title>
    <style>
      canvas { border: 1px solid #ccc;}
      .sec { margin-right:20px;}
    </style>
  </head>
  <body>
    <div>
      <p>图片原大小: 1078*681，下面展示的大小 100*300</p>
      <img src="cavasimg.png" width="1000" height="250">
    </div>
    <div style="display: flex;">
      <div class="sec"> 
        <p>ctx.drawImage(image, 10, 10)</p>
        <canvas id="drawing" width="200" height="200">A draw of something.</canvas>
      </div>
      <div class="sec">
        <p> ctx2.drawImage(image, 10, 10, 100, 50)</p>
        <canvas id="drawing2" width="200" height="200">A draw of something.</canvas>
      </div>
      <div class="sec">
        <p>ctx3.drawImage(image, 100, 0, 150, 150, 10, 10, 150, 150)</p>
        <canvas id="drawing3" width="200" height="200">A draw of something.</canvas>
      </div>
    </div>

    <script>
      var image = document.images[0]

      // 图片加载是异步的，如果不等image加载完，drawImage()会无效
      // 参考：canvas的drawImage()方法，图片不显示。
      // https://zhidao.baidu.com/question/500218334361912884.html

      image.onload = function(e) {
        var drawing = document.getElementById('drawing');
        var ctx = drawing.getContext('2d');

        ctx.drawImage(image, 10, 10) // 从(10,10) 开始绘制image，不改变原图大小

        var drawing2 = document.getElementById('drawing2');
        var ctx2 = drawing2.getContext('2d');
        ctx2.drawImage(image, 10, 10, 100, 50) // 从(10,10) 开始绘制image，设置绘制的图片大小为100*50

        var drawing3 = document.getElementById('drawing3');
        var ctx3 = drawing3.getContext('2d');
        ctx3.drawImage(image, 100, 0, 150, 150, 10, 10, 150, 150) 
        // 从原图像的(100, 0)坐标开始，截图宽150高150的图片，然后在画布(10,10)的位置开始绘制图形，宽为1500,高为150
      }
    </script>
  </body>
</html>
```
### 阴影、渐变、模式(pattern)、合成(composite)
![canvas_composite](/images/js/canvas_composite.png)
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>canvas shadow gradient</title>
    <style>
      canvas { border:1px solid #ccc; }
    </style>
  </head>
  <body>
    <div>
      <img src="img.png" height="100" width="100">
    </div>
    <canvas id="drawing" width="200" height="200"></canvas>
    <canvas id="drawing2" width="200" height="200"></canvas>
    <canvas id="drawing3" width="200" height="200"></canvas>
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

      // 清除阴影
      ctx.shadowBlur = 0; // 模糊像素为0时，即没有模糊
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 2.设置线性渐变
      var gradient = ctx.createLinearGradient(130, 130, 160, 160); // 从(130,130)到(160,160)渐变
      // var gradient = ctx.createLinearGradient(130, 130, 180, 180);
      gradient.addColorStop(0, 'white'); // 渐变的起点色为白色
      // gradient.addColorStop(0.4, 'pink'); 
      // gradient.addColorStop(0.5, 'blue'); 
      // gradient.addColorStop(0.7, 'red'); 
      gradient.addColorStop(1, 'black'); // 渐变的结束色为白色
      // 绘制红色矩形
      ctx.fillStyle = 'red'
      ctx.fillRect(100, 100, 50, 50);
      // 绘制线性渐变矩形
      ctx.fillStyle = gradient;
      ctx.fillRect(130, 130, 50, 50)

      // 3.绘制辐射渐变
      var gradient = ctx.createRadialGradient(25, 175, 0, 25, 175, 30) // 绘制从(25,175)起点，0为半径到终点(25,175)，半径为30的渐变。
      gradient.addColorStop(0, 'red')
      gradient.addColorStop(1, 'blue')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 150, 50, 50)

      // 4.模式，其实就是重复的图像
      var drawing2 = document.getElementById('drawing2');
      var ctx2 = drawing2.getContext('2d');
      var image = document.images[0]
      image.onload = function(e) {
        var pattern = ctx2.createPattern(image, 'repeat'); // 创建重复的模式
        // var pattern = ctx2.createPattern(image, 'repeat-x'); // 创建重复的模式
        // var pattern = ctx2.createPattern(image, 'repeat-y'); // 创建重复的模式
        // var pattern = ctx2.createPattern(image, 'no-repeat'); // 创建重复的模式
        ctx2.fillStyle = pattern;
        ctx2.fillRect(10, 10, 150, 150)
      }

      // 5. 导出canvas为图片，透明无背景
      var imgurl = drawing.toDataURL('image/png');
      console.log(imgurl)
      var imgEle = document.createElement('img');
      imgEle.src = imgurl;
      document.body.appendChild(imgEle);

      // 6.设置全局透明度ctx.globalAlpha
      var drawing3 = document.getElementById('drawing3');
      var ctx3 = drawing3.getContext('2d');
      // 绘制红色矩形
      ctx3.fillStyle = 'red';
      ctx3.fillRect(10, 10, 50, 50);
      // 修改全局透明度
      ctx3.globalAlpha = 0.5;
      // 绘制蓝色矩形
      ctx3.fillStyle = "blue";
      ctx3.fillRect(30, 30, 50, 50);
      // 重置全局透明度
      ctx3.globalAlpha = 1; // p462， 值为0，貌似有问题

      // 7.ctx.globalCompositeOperation 设置后绘制的矩形怎样与先绘制的矩形结合。默认值为后绘制的位于先绘制的上方， source-over
      // 绘制红色矩形
      // ctx3.globalAlpha = 1;
      ctx3.fillStyle = 'red'
      ctx3.fillRect(100, 100, 50, 50)
      // 设置合成（composite）操作
      // 默认为 source-over
      ctx3.globalCompositeOperation = 'destination-over' // 后绘制的位于先绘制的下面
      // ctx3.globalCompositeOperation = 'destination-out' // 后绘制的图形擦除与先绘制的图形重叠部分
      // 更多参数见p463
      ctx3.fillStyle = 'rgba(0,0,255,1)'
      ctx3.fillRect(125, 125, 50, 50)
    </script>
  </body>
</html>
```
### 动画、物理效果、碰撞检测等
详情待后续学习 <<HTML5 Canvas核心技术>> 图形、动画与游戏开发 时再研究

## WebGL绘制3D图形
WebGL是针对Canvas的3D上下文，浏览器中使用的WebGL就是基于OpenGL ES2.0制定的，这里暂不讨论，后面有时间学习 <<WebGL入门指南>> 时，再研究这一块。
```js
var gl = drawing.getContext("experimental-webgl") // 创建webgl上下文，"experimental-webgl"，实验性的webgl
```