
# 8. 设置文本样式



![7_0_设置文本样式.png](/images/css/7_0_设置文本样式.png)

## 基本的文本样式

### text-align 文本对齐
- start、left 文本左对齐
- end、right 文本右对齐
- justify 两端对齐，该属性时，可以使用text-justify设置文本添加空白的方式，但只有IE支持。
- center 居中对齐

```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      #p1 {
        width:400px;
        border: medium double black;
        padding: 10px;
        background-color: rgba(0, 255, 0, 0.4);
        background-clip: content-box;
      }
    </style>
  </head>
  <body>
      <p id="p1">
        P1 There are lots of different kinds of fruit - there are over 500 varieties
        of banana alone. <span>By the time we add the countless</span> type of apples, oranges
        and other well-known fruit, we are faced with thousands of choices.
      </p>
      <p>
        <button>start</button>
        <button>end</button>
        <button>left</button>
        <button>right</button>
        <button>justify</button>
        <button>center</button>
      </p>
      <script>
        var btns = document.getElementsByTagName("button"),
            p1 = document.getElementById("p1"),
            len = btns.length,
            i;
        
        for (i = 0; i < len; i++) {
          btns[i].onclick = function(e) {
            p1.style.textAlign = e.target.innerHTML;
          }
        }
      </script>
  </body>
```
![7_1_text_align.png](/images/css/7_1_text_align.png)

### white-space 处理空白
- normal 默认值，压缩空白，文本行自动换行
- nowarp 压缩空白，不换行
- pre  保留空白，文本只在遇到换行符的时候换行。
- pre-line 压缩空白，文本在一行排满或遇到换行符时换行。
- pre-wrap 不压缩空白，文本在一行排满或遇到换行符时换行。
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      #p1 {
        width:400px;
        border: medium double black;
        padding: 10px;
        background-color: rgba(0, 255, 0, 0.4);
        background-clip: content-box;
      }
    </style>
  </head>
  <body>
      <p id="p1">
        P1 There are lots of different kinds of fruit.
        By       the time       we add the countless type of apples, 
        we are faced with thousands of choices.
      </p>
      <p>
        <button>normal</button>
        <button>nowrap</button>
        <button>pre</button>
        <button>pre-line</button>
        <button>pre-wrap</button>
      </p>
      <script>
        var btns = document.getElementsByTagName("button"),
            p1 = document.getElementById("p1"),
            len = btns.length,
            i;
        
        for (i = 0; i < len; i++) {
          btns[i].onclick = function(e) {
            p1.style.whiteSpace = e.target.innerHTML;
          }
        }
      </script>
  </body>
```
![7_2_white_space.png](/images/css/7_2_white_space.png)

### direction 文本方向
direction 设置文本方向，值为 ltr（默认） 或 rtl
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p:first-child {
        direction: ltr;
      }
      p:last-child {
        direction: rtl;
      }
    </style>
  </head>
  <body>
    <p>
      This is left-to-right text。
    </p>
    <p>
      This is right-to-left text。
    </p>
  </body>
```

![7_3_direction.png](/images/css/7_3_direction.png)

### 指定字母、单词、行之间的间距
#### letter-spacing 字母之间间距
#### word-spacing 单词之间间距
#### line-height 行高
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p {
        padding: 10px;
        border: thin double black;
        background-color: lightgray;
        background-clip: content-box;
      }
      #p2 {
        letter-spacing: 10px;
      }
      #p3 {
        word-spacing: 10px;
      }
      #p4 {
        line-height: 2em;
      }
    </style>
  </head>
  <body>
    <p id="p1">
      P1 There are lots of different kinds of fruit - there are over 500 varieties
      of banana alone. <span>By the time we add the countless</span> type of apples, oranges
      and other well-known fruit, we are faced with thousands of choices.
    </p>
    <p id="p2">
      P1 There are lots of different kinds of fruit - there are over 500 varieties
      of banana alone. <span>By the time we add the countless</span> type of apples, oranges
      and other well-known fruit, we are faced with thousands of choices.
    </p>
    <p id="p3">
      P1 There are lots of different kinds of fruit - there are over 500 varieties
      of banana alone. <span>By the time we add the countless</span> type of apples, oranges
      and other well-known fruit, we are faced with thousands of choices.
    </p>
    <p id="p4">
      P1 There are lots of different kinds of fruit - there are over 500 varieties
      of banana alone. <span>By the time we add the countless</span> type of apples, oranges
      and other well-known fruit, we are faced with thousands of choices.
    </p>
  </body>
```
![7_4_字母_单词_行高.png](/images/css/7_4_字母_单词_行高.png)


### word-wrap 溢出文本断行
当一个单词的长度超出包含块的宽度时如何处理
- normal 默认，单词不断开，即使无法完全放入包含块。
- break-word 断开单词，使其放入包含块。
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p {
        width: 100px;
        margin:20px;
        border: medium double black;
      }
      p:last-child {
        word-wrap: break-word;
      }
    </style>
  </head>
  <body>
    <p>
      This is lefttorightabcdefghijkmn text。
    </p>
    <p>
      This is lefttorightabcdefghijkmn text。
    </p>
  </body>
```
![7_5_word_wrap.png](/images/css/7_5_word_wrap.png)

### text-indent 首行缩进
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p {
        width: 300px;
        padding:20px;
        text-indent: 2em; /* 文本首行缩进 */
        border: medium double black;
        background-color: rgba(0, 255, 0, 0.3);
        background-clip: content-box;
      }
    </style>
  </head>
  <body>
    <p>
      There are lots of different kinds of fruit - there are over 500 varieties
      of banana alone. <span>By the time we add the countless</span> type of apples, oranges
      and other well-known fruit, we are faced with thousands of choices.
    </p>
  </body>
```
![7_6_text_indent.png](/images/css/7_6_text_indent.png)

## 文本装饰与大小写转换
### text-decoration 文本装饰
text-decoration 为文本块应用装饰效果
- none 不使用任何装饰效果
- underline 文本顶部划线
- overline 下划线
- line-through 删除线
- blink 闪烁，浏览器基本不支持
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p:nth-child(1) { text-decoration: none; }
      p:nth-child(2) { text-decoration: overline; }
      p:nth-child(3) { text-decoration: underline; }
      p:nth-child(4) { text-decoration: line-through; }
      p:nth-child(5) { text-decoration: blink; }
    </style>
  </head>
  <body>
    <p>There are lots of different kinds of fruit.</p>
    <p>There are lots of different kinds of fruit.</p>
    <p>There are lots of different kinds of fruit.</p>
    <p>There are lots of different kinds of fruit.</p>
    <p>There are lots of different kinds of fruit.</p>
  </body>
```
![7_7_text_decoration.png](/images/css/7_7_text_decoration.png)

### text-transform 大小写转换
- none 默认，不进行转换
- capitalize 首字母大写
- uppercase 全部大写
- lowercase 全部小写
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p:nth-child(1) { text-transform: none; }
      p:nth-child(2) { text-transform: capitalize; }
      p:nth-child(3) { text-transform: uppercase; }
      p:nth-child(4) { text-transform: lowercase; }
    </style>
  </head>
  <body>
    <p>there are lots of DIFFERENT kinds of fruit.</p>
    <p>there are lots of DIFFERENT kinds of fruit.</p>
    <p>there are lots of DIFFERENT kinds of fruit.</p>
    <p>there are lots of DIFFERENT kinds of fruit.</p>
  </body>
```
![7_8_text_transform.png](/images/css/7_8_text_transform.png)

## text-shadow 文本阴影
text-shadow 为文本块应用阴影，值为 h-shadow v-shadow blur color
- h-shadow, v-shadow 阴影水平、垂直偏移
- blur 一个长度值，阴影的模糊程度
- color 阴影颜色
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p:nth-child(2) { 
        text-shadow: 5px 5px 10px red;
      }
      p:nth-child(3) { 
        text-shadow: 0 0 10px blue;
      }
    </style>
  </head>
  <body>
    <p>there are lots of DIFFERENT kinds of fruit.</p>
    <p>there are lots of DIFFERENT kinds of fruit.</p>
    <p>there are lots of DIFFERENT kinds of fruit.</p>
  </body>
```
![7_9_text_shadow.png](/images/css/7_9_text_shadow.png)

## 使用字体
### font-family 选择字体
css定义了几种任何情况下都可以使用的通用字体：
- serif
- sans-serif
- cursive
- faantasy
- monospace
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p:nth-child(2) { font-family: serif; }
      p:nth-child(3) { font-family: sans-serif; }
      p:nth-child(4) { font-family: cursive; }
      p:nth-child(5) { font-family: fantasy; }
      p:nth-child(6) { font-family: monospace; }
    </style>
  </head>
  <body>
    <p>默认: This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>serif: This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>sans-serif: This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>cursive: This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>fantasy: This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>monospace: This is left-to-right text。这是一段从左到右显示的文本。</p>
  </body>
```
![7_10_字体.png](/images/css/7_10_字体.png)

### font-size 字体大小
Chrome默认字体16px, medium

![7_11_font_size.png](/images/css/7_11_font_size.png)

```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p:nth-child(2) { font-size:xx-small }
      p:nth-child(3) { font-size:x-small }
      p:nth-child(4) { font-size:small }
      p:nth-child(5) { font-size:medium }
      p:nth-child(6) { font-size:large }
      p:nth-child(7) { font-size:x-large }
      p:nth-child(8) { font-size:xx-large }
      p:nth-child(9) { font-size:smaller }
      p:nth-child(10) { font-size:larger }
      p:nth-child(11) { font-size:16px; }
    </style>
  </head>
  <body>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>This is left-to-right text。这是一段从左到右显示的文本。</p>
  </body>
```

![7_12_font_size.png](/images/css/7_12_font_size.png)

### font-weight 设置字体粗细
已Chrome为例，只有三种粗细：
- lighter, 100, 200, 300  细字体
- normal, 400, 500 普通
- bold, bolder, 600, 700, 800, 900 粗字体
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p:nth-child(2) { font-weight: lighter }
      p:nth-child(3) { font-weight: normal }
      p:nth-child(4) { font-weight: bold }
      p:nth-child(5) { font-weight: bolder }
      p:nth-child(6) { font-weight: 100 }
      p:nth-child(7) { font-weight: 200 }
      p:nth-child(8) { font-weight: 300 }
      p:nth-child(9) { font-weight: 400 }
      p:nth-child(10) { font-weight: 500 }
      p:nth-child(11) { font-weight: 600; }
      p:nth-child(12) { font-weight: 700; }
      p:nth-child(13) { font-weight: 800; }
      p:nth-child(14) { font-weight: 900; }
    </style>
  </head>
  <body>
    <p>默认：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>lighter：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>normal：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>bold：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>bolder：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>100：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>200：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>300：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>400：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>500：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>600：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>700：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>800：This is left-to-right text。这是一段从左到右显示的文本。</p>
    <p>900：This is left-to-right text。这是一段从左到右显示的文本。</p>
  </body>
```
![7_13_font_weight.png](/images/css/7_13_font_weight.png)

### font-style 字体样式
- normal 普通
- italic 斜体
- oblique /ə'bliːk/ 倾斜
- inhrit 从父元素继承
```html
  <head>
    <meta charset="utf-8">
    <title>文本样式</title>
    <style>
      p:nth-child(1) { font-style: normal; }
      p:nth-child(2) { font-style: italic; }
      p:nth-child(3) { font-style: oblique; }
    </style>
  </head>
  <body>
    <p>There are lots of different kinds of fruit.</p>
    <p>There are lots of different kinds of fruit.</p>
    <p>There are lots of different kinds of fruit.</p>
  </body>
```
![7_14_font_style.png](/images/css/7_14_font_style.png)

## @font-face 使用web字体
@font-face 可以从网络上获取安装字体，并使用。 [免费字体下载](http://free.homefont.cn/)

```html
<head>
  <meta charset="utf-8">
  <title>文本样式</title>
  <style>
    @font-face {
      font-family: 'MyFont';
      src: url('actionj.ttf');
    }

    @font-face {
      font-family: 'antibiotech';
      src: url('antibiotech.ttf');
    }

    #p1 {
      font-family: MyFont;
      font-size: 35px;
    }
    #p2 {
      font-family: antibiotech;
      font-size: 35px;
    }
  </style>
</head>
<body>
  <p id="p1">There are lots of different kinds of fruit. 这是一段文本</p>
  <p id="p2">There are lots of different kinds of fruit. 这是一段文本</p>
</body>
```
![7_15_font_face.png](/images/css/7_15_font_face.png)
