# 16. HTML脚本编程



HTML5规范定义了很多Javascript API，用来简化此前实现起来困难的任务
## 跨文档消息传送
与iframe内嵌的网页通信，利用postMessage()，与message事件监听，需要同域，本地可开启nginx看调试效果，下面是示例xdm.html的源码:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>xdm-document</title>
  </head>
  <body>
    <div id="msg"></div>
    <p>跨文档消息传送(XDM)：</p>
    <iframe src="iframe.html" width="300" height="300"></iframe>
    <script>
      window.onload = function() {
        setTimeout(function () {
          try {
            console.log('开始postmessage')
            document.getElementsByTagName('iframe')[0].contentWindow.postMessage('1111', 'http://127.0.0.1/xdm/xdm.html')
          } catch(e) {
            console.log(e)
          }
        }, 2000)
        window.onmessage = function(event) {
          var msg = document.getElementById('msg');
          msg.innerHTML = event.data
          console.log(event)
          console.log('接收到消息：', event.data)
        }
      }
    </script>
  </body>
</html>
```
iframe.html代码如下:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>xdm-document2</title>
  </head>
  <body>
    跨文档传输消息:
    <div id="msg"></div>
    <script>
      window.onmessage = function(event) {
        var msg = document.getElementById('msg');
        msg.innerHTML = event.data
        console.log(event)
        console.log('接收到消息：', event.data)
        event.source.postMessage('消息已成功收到！', 'http://127.0.0.1/xdm/iframe.html')
        console.log('消息已收到')
      }
    </script>
  </body>
</html>
```
## 原生拖放
**该章节由于没有实例，且重要部分介绍内容有两处与实际不符，不好理解，不建议阅读本章来学习原生拖放**
> HTML标签draggable属性，表示是否可拖动，img和a标签、选中的文本默认为是可拖动的，其他元素默认为false, 无法拖动。如果想让某个区域成为可放置区域，只需要将该区域dragover事件，阻止其默认行为

拖动某个元素时，会依次触发**dragstart, drag, dragend** 事件。当某个元素被拖动到一个有效的目标位置时，目标元素会依次触发**dragenter, dragover**，**dragleave(不可放置)或drop(可放置)**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>drag demo</title>
    <style>
      .sec-content { width:600px;height: 400px;border:1px solid #ccc; }
      .dragdiv {width:50px; height:50px;border:1px solid blue; margin-right:10px;}
      .flexdiv { display: flex;}
      #square1 { display: flex; flex-wrap: wrap}
    </style>
  </head>
  <body>
    <div>
      <p class="sec-title">可拖动模块</p>
      <div id="flexdiv" class="flexdiv">
        <div id="dragdiv1" class="dragdiv" draggable="true">1</div>
        <div id="dragdiv2" class="dragdiv" draggable="true">2</div>
        <div id="dragdiv3"class="dragdiv" draggable="true">3</div>
        <div id="dragdiv4" class="dragdiv" draggable="true">4</div>
      </div>
    </div>

    <div>
      <p class="sec-title">放置区域1</p>
      <div id="square1" class="sec-content">
      </div>
    </div>

    <script>
      var flexdiv = document.getElementById('flexdiv');
      flexdiv.addEventListener('dragstart', dragdivHandle, false);
      flexdiv.addEventListener('drag', dragdivHandle, false);
      flexdiv.addEventListener('dragend', dragdivHandle, false);

      var square1 = document.getElementById('square1');
      square1.addEventListener('dragenter', squareEventHandle, false);
      square1.addEventListener('dragover', squareEventHandle, false);
      square1.addEventListener('dragleave', squareEventHandle, false);
      square1.addEventListener('drop', squareEventHandle, false);

      function dragdivHandle(event) {
        console.log(event.type)
        switch(event.type) {
          case 'dragstart':
            // 针对拖动元素，设置event.effectAllowed
            // event.dataTransfer.effectAllowed = 'copy'; // 这个设置与不设置貌似没什么作用
            event.dataTransfer.setData('Text', event.target.id)
            break;
        }
      }

      function squareEventHandle(event) {
        console.log(event.type)
        switch(event.type) {
          // case 'dragenter': // JS高程3里面p482内容: 如果想要让元素成为可放置区域，需要这里也阻止默认行为，但实际不用
          //   event.preventDefault();
          //   break;
          case 'dragover':
            event.preventDefault(); // 取消默认操作，可以让元素成为可放置区域
            // 针对放置目标，设置event.dropEffect
            // event.dataTransfer.dropEffect = 'copy'; // 这个设置与不设置貌似没什么作用
            break;
          case 'drop': // 该操作是动作执行的核心
            // 防止火狐下，每次拖拽都会打开新的标签页
            event.stopPropagation(); //阻止冒泡
            event.preventDefault(); // 阻止默认事件

            var id = event.dataTransfer.getData('Text');
            console.log(id)
            // 如果克隆了节点，不会删除源节点，如果通过getElementById获取对应的节点，会删除原来拖动的节点
            // 如果是拖拽文件到该区域
            console.log(event.dataTransfer.files); // 得到files数组，里面都是File文件对象
            square1.appendChild(document.getElementById(id).cloneNode(true))
            break;
        }
      }

    </script>
  </body>
</html>
```

## 媒体元素video/audio
HTML5新增了两个与媒体相关的标签，让开发人员不必依赖任何插件就能在网页中嵌入音频与视频内容。标签为video和audio，IE9+ 支持。视频支持格式video/mp4; video/ogg; video/webm; 音频支持格式 audio/mp4; audio/mpeg(mp3); audio/ogg; audio/wav; 

![video元素](/images/js/video.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>video</title>
  </head>
  <body>
    <!-- 嵌入视频, 如果浏览器不支持会显示Video element not support -->

    <video src="最后一公里.mp4" controls>Video element not support</video>
    <video src="最后一公里.mp4">Video element not support</video>

    <video id="video" src="最后一公里.mp4" controls poster="posterimg.png">Video element not support</video>

    <video src="最后一公里.mp4" controls poster="posterimg.png" width="300">Video element not support</video>

    <!--- 如果单独设置了autoplay，无法播放，需要再加一个muted属性才能自动播放，muted是让视频静音-->
    <video src="最后一公里.mp4" controls poster="posterimg.png" width="300" autoplay muted>Video element not support</video>

    <div>
        <input type="button" onclick="play()" value="播放">
        <input type="button" onclick="pause()" value="暂停">
        <span id="curPlayTime"></span>/<span id="totalPlayTime"></span>  音量：<span id="volume"></span>
    </div>
    <script>
      var video = document.getElementById('video')
      // 无效
      // setTimeout(function() {
      //   console.log(video)
      //   video.play()
      // }, 5000)
      // 需要点击事件才能触发，如果一进来直接调用函数会无效，除非播放时加如muted属性无声音。放在oncanplay里也无效
      function play() {
        console.log('video.play')
        video.play()
      }
      function pause() {
        console.log('video.pause')
        video.pause()
      }
      var curPlayTimeEle = document.getElementById('curPlayTime');
      var totalPlayTimeEle = document.getElementById('totalPlayTime');
      var volumeEle = document.getElementById('volume');
      // 只有在视频可以播放时才能获取到视频总时长
      video.oncanplay = function() {
        // video.play()
        var duration = Math.ceil(video.duration)
        totalPlayTimeEle.innerHTML = Math.floor(duration / 60) + '分' + duration % 60 + '秒';
        console.log(video.duration);
      }
      // 更新当前播放时长及音量
      setInterval(() => {
        curPlayTimeEle.innerHTML = video.currentTime;
        volumeEle.innerHTML = video.volume;
      }, 250);
    </script>
  </body>
</html>
```
- audio
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>video</title>
  </head>
  <body>
    <!-- 嵌入audio, 如果浏览器不支持会显示Video element not support -->
    <p>播放mp4声音: 最后一公里.mp4</p>
    <audio src="最后一公里.mp4" controls>audio element not support</audio>

    <p>播放mp3声音: 王菲 - 匆匆那年.mp3</p>
    <audio id="audio" src="王菲 - 匆匆那年.mp3" controls>audio element not support</audio>
    <div>
        <input type="button" onclick="play()" value="播放">
        <input type="button" onclick="pause()" value="暂停">
    </div>
    <script>
      var audio = document.getElementById('audio')
      audio.oncanplaythrough = function() {
        console.log('可以播放了')
        // 这样也无效，还是要用按钮click触发
        // chrome 和 firefox无效，IE11有效
        // audio.play()
      }
      function play() {
        console.log('audio.play')
        audio.play()
      }
      function pause() {
        console.log('audio.pause')
        audio.pause()
      }
    </script>
  </body>
</html>
```

## 历史状态管理
```js
// 在不加载新页面的情况下，改变当前的url, 需要开启HTTP服务访问，"file://" 访问会没有效果
history.pushState({name: 'test'}, 'page', 'event.html')
```
