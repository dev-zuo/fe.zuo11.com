
## JavaScript DOM编程艺术(第二版)笔记
> 大概花了3个小时把书看了一遍，相对来说比较基础。之前在JS高程3看过对DOM相关的章节，所以这本书显得简单很多。这里只记录一些我认为重要的知识点。

## 简单提要
- 第一掌、第二章简单介绍了js历史、DOM、以及简单的js语法（这里就不介绍了）
- 第三、四、七、九章 主要介绍DOM相关API 
- 第五、六、八、十主要是DOM API相关示例、实践及优化
- 第十一章、附录 介绍HTML5、js库(主要是jQuery，jQuery这里就不介绍了)
- 第十二章 综合示例、实战写个小demo

## DOM 相关API
> 涵盖3、4、6、7、9、10章内容
- 1.获取元素节点及节点之间的关系 
> Chapter 3、Chapter 4
```js
// 三种获取元素节点的方法 (Chapter 3)
document.getElementById()
document.getElementsByClassName()
document.getElementsByTagName()

// 根据节点之间的关系(父节点、子节点、兄弟节点)，获取节点 (Chapter 4)
e.parentNode // 父节点
// 子节点
e.firstChild  // 第一个子节点
e.lastChild // 最后一个子节点
e.childNodes // 子节点数组
// 兄弟节点
e.previousSibling // 上一个节点
e.nextSibling // 下一个节点
```

- 2.获取/设置元素节点属性/特性(Attribute)
> Chapter 3、Chapter 6
```js
// 传统HTML-DOM方法，仅浏览器环境可使用 (Chapter 6)
element.title // 获取title属性
element.title = '122' // 设置title属性
e.src
e.href
document.forms 

// DOM方法 支持DMO标准的都可以使用，包括XML (Chapter 3)  
element.getAttribute() // 比如title属性
element.setAttribute() // 设置title属性  ('title', '测试')
```

- 3.动态创建元素节点、并添加到文档中
> Chapter 7 
``` js
// 1).传统方法
document.write('<div><p>123</p></div>')
e.innerHTML = '<div><p>123</p></div>'

// 2).DOM方法
// 创建节点
document.createElement() // 创建一个元素节点 'div'、'ul'、'li'、'text'
document.createTextNode() // 创建一个文本节点 document.createTextNode('hello world')

// 将孤儿节点添加到节点树里面
e.appendChild() // 父元素给自己添加一个子元素，放到子元素最后面
e.insertBefore() // 在目标节点之前添加一个节点
```
- 4.CSS-DOM 
> Chapter 9
```js
// style属性 获取与设置
element.style.color 
element.style.fontFamily // 如果是 element.font-family 需要改为驼峰命名
element.style.font
element.style.backgroundColor

// 动态根据条件设置，可以根据条件改变css样式，或者改变className、id属性，实现样式动态切换
```
- JS动画
> Chapter 10，主要改变元素的位置 + setTimeout控制动画
 ```js
// 修改元素位置, 前提条件 position: absolute
element.style.left 
element.style.top
````

## JS最佳实践
> Chapter 5
- 1. 平稳退化：在不支持javascript的情况下，也可以正常工作
```html
<!-- 不支持js会执行js，显示图片。不支持js会执行默认动作，跳转到href属性指定的链接里 -->
<a href="/images/7.png" onclick="showPic(this); return false;" title="img">链接a</a>
```
- 2. 分离JavaScript：将网页的结构和内容与js脚本动作行为分开，类似于不要使用内嵌的style一样
- 3. 向后兼容：老浏览器可能不支持DOM api，先进行判断、现在基本可以不处理了。但思维可以借鉴
- 4. 性能考虑: 1).尽量减少dom的访问很操作; 2).合并多个脚本文件为一个; 3).压缩代码，变为 .min.js

## HTML5简介
- Canvas绘图
- 音频和视频 <audio>、<video>
- 表单相关 
```js
// 1.input的type属性除了之前的text、radio、checkbox，新增email、url、date、number、range、search、tel、color
// 2. 输入属性(特性Attribute) 新增 autocomplete； autofocus ； from； min、max、step（type=number或range；pattern 正则；placeholder、required

```
- 其他：localStorage、sessionStorage; webSocket; web Wroker; 标准拖放实现；浏览器中地理位置信息；

## 补充内容

## 实战项目
根据该书学到的知识，灵活运用。实战写一个小项目
单独开了一个仓库放对应的源码，地址：https://github.com/zuoxiaobai/js_dom_chapter12_project
在线预览：http://zuoguoqing.com/js_dom_chapter12_project/
