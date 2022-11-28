---
title: 19. 表单脚本 - JS高程4
description: JS 较早的一个用途是在客户端承担一部分服务器表单处理的任务。虽然 Web 和 JS 都发展了很多年，但 Web 表单一直变化不大，一般 JS 既用于表单验证，又用于增强标准表单控件的默认行为。本章主要介绍表单基础、文本框验证与交互、选择框编程、富文本编辑器等。
keywords: 富文本编辑器,表单编程,选择框编程,文本框编程
---

# 19. 表单脚本
JS 较早的一个用途是在客户端承担一部分服务器表单处理的任务。虽然 Web 和 JS 都发展了很多年，但 Web 表单一直变化不大，一般 JS 既用于表单验证，又用于增强标准表单控件的默认行为。本章主要介绍表单基础、文本框验证与交互、使用其他表单控件。

## 表单基础
Web 表单在 HTML 中以 `<form>` 元素表示，在 JS 中以 HTMLFormElement 表示，它继承自HTMLElement, 其独特的属性和方法如下：
- `action` 提交表单时请求的 URL
- `enctype` 求的编码类型
- `method` 发送的 http 请求类型，get 或 post
- `name` 表单的名称
- `target` 用于发送/接收响应的窗口名字。 _blank 新窗口，_self 默认，在当前窗口打开 action URL
- `elements` 表单中所有的控件集合 HTMLCollection
- `length` 表单中控件的数量
- `reset()` 将所有表单域重置为默认值
- `submit()` 提交表单

### 获取表单元素
```js
let form = document.getElementById('form1');
let firstForm = document.forms[0]; // 获取页面中的第一个表单
let myForm = document.forms['form2']; // 获取页面中 name 为 form2 的表单
```
### 提交表单
表单是通过用户点击提交按钮或图片按钮的方式提交的。提交按钮的 type 属性为 "submit" 或者 type 为 "image" 的按钮。点击 type 为 submit 的按钮，默认会触发表单提交。
- 如果表单校验失败，可以用 event.preventDefault() 来阻止表单提交。
- 在 onsubmit 事件中 return false 也可以取消表单提交
```js
// <input type='submit' value='Submit Form'> 通用提交按钮
// <button type='submit'>Submit Form</button> 自定义提交按钮
// <input type='image' src="graphic.gif"> 图片按钮
let form = docuemnt.getElementById('myForm');
// 提交表单
form.submit();
form.addEventListener('submit', function(event) {
  // 阻止默认行为
  event.preventDefault();
});
```
### 重置表单
点击 type 为 "reset" 的按钮可以充值表单，也可以使用 JS 的方法 from.reset()
```js
form.reset();
// 阻止表单重置
form.addEventListener(, 'reset', function(event) {
  // 阻止默认行为
  event.preventDefault(event);
});
```
### 表单字段
表单中的元素可以使用 form.elements 获取，类型为 HTMLCollection 类数组对象。它包括表单中所有的 input、textarea、button、 select、fieldset 等。他们会按照 HTML 标记中出现的顺序依次保存。可以通过索引位置或name属性访问
```js
// 获取第一个字段
form.elements[0] 
// 获取名为'textbox1'的字段，会是一个NodeList，可能不止一个
form.elements['textbox1'] 
// 获取表单中包含的字段数量
form.elements.length 
```
表单字段的公共属性、方法如下：
- `disabled` 是否被禁用
- `value` 当前字段提交给服务器的值，对文件字段来说，该属性只读。
- `form` 指向所属的表单指针，只读
- `name` 当前字段的名称
- `readOnly` 表示是否只读
- `type` 当前字段的类型，如 checkbox, radio 等，对于 input 和 button 元素，可以动态修改，其值可以是：
  - `select-one` 单选 select
  - `select-multiple` 多选 select multiple
  - `submit`
  - `button`
  - `reset`
- `autofocus` 是否是 autofocus HTML5 新增，无需 JS，使用 HTML 属性就可以聚焦
- `tabIndex` 表示当前字段的切换(tab)序号
- `focus()` 聚焦
- `blur()` 移除焦点, 与 focus 相对应

JS 可以动态的修改属性，比如修改 value、type、disabled、readOnly 等，修改按钮的 disabled 属性，可以避免多次提交
```js
// 避免表单多次提交
form.addEventListener('submit', function(event) {
  // 取得提交按钮
  let btn = event.target.elements['submit-btn'];
  // 禁用按钮
  btn.disabled = true;
});

// 聚焦
document.forms[0].elements[0].focus() 
// <input type="text" autofocus>  
element.autofocus // true
```
表单字段公共事件
- `blur` 字段失去焦点时触发
- `change` 对于 `<input>` 和 `<textarea>` 元素，在失去焦点且 value 值改变时触发；对于 select 元素，在其选项改变时触发
- `focus` 当前字段获取焦点时触发

注意：不要依赖 blur 和 change 触发的先后顺序，不同的浏览器顺序可能不同

```html
<form>
  <input type='text' placeholder="请输入值">
</form>
<script>
  let textbox = document.forms[0].elements[0];
  function fieldEventHandler(event) {
    let target = event.target
    switch(event.type) {
      case 'focus':
        // focus时，背景色改为黄色
        target.style.backgroundColor = 'yellow'
        break;
      case 'blur':
        target.style.backgroundColor = ''
        break;
      case 'change':
        console.log(target.value)
        break;
    }
  }
  textbox.addEventListener('focus', fieldEventHandler);
  textbox.addEventListener('blur', fieldEventHandler);
  textbox.addEventListener('change', fieldEventHandler);
</script>
```

## 文本框编程
HTML 中有两种输入文本框：input 单行文本框，textarea 多行文本框。如果 input 不指定 type，默认为 text。
- 可以通过 size 指定文本框宽度(字符数量)。
- 可以通过 maxLength 指定最多允许输入的字符。
- 可以通过 value 指定初始值或获取文本框的值。

```html
<form>
  <p>input 输入框宽度为25个字符，最多允许输入50个字符</p>
  <input type='text' placeholder="请输入值" size="25" maxlength="50">
  <p>input 输入框宽度为50个字符，最多允许输入5个字符</p>
  <input type='text' placeholder="请输入值" size="50" maxlength="5">
  <p>input 输入框宽度为 20</p>
  <input type='text' placeholder="请输入值">
  <p>多行文本 textarea 25行，5列</p>
  <textarea rows="25" cols="5">initial value</textarea>
</form>
<script>
  let text = document.forms[0].elements[0];
  text.addEventListener('change', function(event) {
    // 通过value属性，获得文本的值
    console.log(event.target.value)
  });
</script>
```
### 在文本框中选择文本
两种文本框都支持 select() 方法，用于选中文本框中的文本。如果获取到 
```html
<form>
  <input>
  <input>
  <button id="select">select</button>
</form>
<script>
  let textInput = document.forms[0].elements[0]
  let selectBtn = document.querySelector('#select')
  // 默认情况下直接调用会直接刷新页面，清除输入框内容
  selectBtn.addEventListener('click', (e) => {
    textInput.select()
  })

  // Chrome 和 Firefox 获取焦点后选中全部文本
  // Safari 效果相当与选中后，又点击了一次文本输入框内容的末尾
  textInput.addEventListener('focus', (e) => {
    e.target.select()
  })
</script>
```
我们可以监听文本框的 select 事件，当发生选中时，会触发该事件。但 select 事件里面，并不能提供选中了哪些文本，HTML5 对此进行了扩展，为文本框元素提供了两个属性:
- `selectionStart` 已选中文本的起点，IE9+
- `selectionEnd` 已选中文本的终点，IE9+

这样我们可以在 select 事件中，使用上面的属性，获取选中的具体内容
```html
<form>
  <input>
</form>
<script>
  let textInput = document.forms[0].elements[0]
  textInput.addEventListener("select", e => {
    let { selectionStart: start, selectionEnd: end } = textInput
    console.log('选中文本：', textInput.value.substring(start, end))
  })
</script>
```
对于 IE8 以及之前的版本，可以使用包含整个文档中文本选择信息的 document.selection 对象。一般无法确认选中的文本在页面中什么位置，但与 select 事件一起使用时，可以确定是触发这个事件文本框中选中的文本。获取文本必须先创建一个范围，然后再从中提取文本。
```js
if (document.selection) {
  return document.selection.createRange().text
}
```
除了选中全部文本的 select() 外，HTML5 新增选择部分文本的 **setSelectionRange(start, end)** 方法，如果想看到选中必须在设置前或设置后，将焦点设置到文本框中。IE9+ 支持，与 select() 类似的是，如果 focus 后，再设置选中 Safari 会没有效果。
```js
// 设置选中后再设置焦点
textInput.value = "Hello world!"
textInput.setSelectionRange(4, 7) // 选中 "o w"
textInput.focus()

// 有焦点后再设置
textInput.addEventListener('focus', (e) => {
  // focus 后选中全部
  textInput.setSelectionRange(0, textInput.value.length)
  // focus 后选中 "Hel"
  textInput.setSelectionRange(0, 3)
  // focus 后选中 "o w"
  textInput.setSelectionRange(4, 7)
})
```
IE8 及之前的版本选中部分文本，需要先创建一个范围 createTextRange()，再调用 collapse() 把范围折叠刀文本框开始的地方，并使用 moveStart() 和 moveEnd() 范围方法，把范围放在正确的位置上，最后在调用范围的 select() 方法选中文本
```js
textInput.value = "Hello world!"
let range = textInput.createTextRange()
// 选中所有文本
range.collapse(true)
range.moveStart("character", 0)
range.moveEnd("character", textInput.value.length)
range.select()

// 选中前三个字符
range.collapse(true)
range.moveStart("character", 0)
range.moveEnd("character", 3)
range.select()

// 选中第 4~6 个字符
range.collapse(true)
range.moveStart("character", 4)
range.moveEnd("character", 6)
range.select()
```
如果想要看到效果，要让文本框获取焦点。自动选中文本对自动完成建议项等高级文本输入框是很有用的。

### 输入过滤/操作粘贴板
阻止文本框的 keypress 事件的默认行为，输入不会生效。这样就可以在输入的过程中，屏蔽一些字符了。
```html
<form>
  <input>
</form>
<script>
  let textInput = document.forms[0].elements[0]
  textInput.addEventListener('keypress', event => {
    let data1 = event.key
    let data2 = String.fromCharCode(event.charCode)
    console.log(data1, data2)
    // 如果是非数字不允许输入
    if (!/\d/.test(data2)) {
      event.preventDefault()
    }
  })
</script>
```
注意：上面的方法，无法屏蔽输入法组合文字过程中输入的字符。与粘贴相关的事件如下：
- `beforecopy` 复制操作前触发
- `copy` 复制操作时触发 
- `beforecut` 剪切操作发生前触发
- `cut` 剪切操作发生时触发
- `beforepaste` 粘贴操作前触发
- `paste` 粘贴操作时发生

beforecopy, beforecut, beforepaste 不能取消 copy、cut、paste 操作，需要在 copy、cut、paste事 件中阻止默认行为，才能取消。主要是 paste 事件，可以修改 copy 后的内容. 书中的例子跑不起来，用了 MDN 看到的新方法，下面是在复制的时候，向粘贴板追加内容。
```html
<form>
  <p>据了解，为了让深圳市民能真正感知、体验到智慧新生活，深圳电信将以沉浸式体验为核心，计划展出5大版块内容：智慧城市、5G+智慧警务、智慧民生展播、VR直播、云VR游戏/云VR视频。另外，市民还有机会抢先体验福田中心区5G巴士精品路线。值得一提的是，5G时代，深圳的派出所借助5G网络已经解锁了各种破案"黑科技"，无人机、警用摩托车、AR眼镜、人脸识别……进一步提升警务效力，打造了首个5G智慧派出所。据了解，这其中离不开深圳电信运用5G+天翼云+专线+警务云应用融合创新的领先技术，这也是本次深圳5G体验周的重点内容。</p>
  <p>input 长度为25个字符，最多允许输入50个字符</p>
  <textarea type='text' placeholder="请copy后粘贴信息" rows="20" cols="100"></textarea>
</form>
<script>
  let text = document.forms[0].elements[0];
  text.addEventListener('change', function(event) {
    console.log(event.target.value)
  });

  text.addEventListener('paste', function(event){
      console.log('paste', event)
    //   event.preventDefault();
  });

  // 这个方法是重点，需要参考 https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event
  document.addEventListener('copy', function(event){
      console.log('copy', event);
      // 获取copy的内容
      console.log(document.getSelection().toString());
      // 在copy内容里加入信息
      let msg = `\n ----------------------------\n 作者: guoqzuo \n 链接: https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event \n 标题：Element: copy event\n`
      event.clipboardData.setData('text/plain', `${document.getSelection().toString()} ${msg}`);
      event.preventDefault();
  });

  document.addEventListener('cut', function(event){
    console.log('cut', event)
  });

  document.addEventListener('beforecut', function(event){
    console.log('beforecut', event)
  });

  document.addEventListener('beforecopy', function(event){
      console.log('beforecopy', event)
  });

  document.addEventListener('beforepaste', function(event){
      console.log('beforepaste', event)
  });
</script>
```

### 自动切换到下一个输入框
以输入验证码为例，输入一个数字后，自动 focus 到下一个输入框，下面是一个简单的例子
```html
<style> input { width: 25px; text-align: center; }</style>
<form>
  <input maxlength="1">
  <input maxlength="1">
  <input maxlength="1">
  <input maxlength="1">
  <input maxlength="1">
</form>
<script>
  let inputs = document.forms[0].elements
  for (let item of inputs) {
    item.addEventListener('keyup', e => {
      if (e.target.value.length == e.target.maxLength) {
        item.nextElementSibling && item.nextElementSibling.focus()
      }
    })
  }
</script>
```
### HTML5 约束验证 API
当文本框有 required 属性时，点击 submit 后，如果输入为空，会阻止表单提交，并提示请填写此栏。
```html
<form action="/submit">
  <input required>
  <input type="submit" value="提交">
</form>
<script>
  let textInput = document.forms[0].elements[0]
  console.log(textInput.required) // true
</script>
```

![html5_required.png](/images/js/html5_required.png)

在 HTML5 中，新增了多个 type，包括 email、url、search、color、date 等，当 type 为数值输入（number, range, datetime, date, month, time 等）时，可以指定 min(最大值)、max(最小值)、step(从 min 到 max 的步长值) 属性，比如
```html
<form>
  <input type="number" min="-100" max="100" step="5" name="count">
</form>
<script>
let inputText = document.forms[0].elements[0]
inputText.stepUp() // + step  = 5
// inputText.stepUp(6) // + 6 * step = 30
// inputText.stepDown() // - step = -5
// inputText.stepDown(3) // - 3 * step = -15
</script>
```

![html5_input_type.png](/images/js/html5_input_type.png)

更多属性参见：[HTML 5 input type 属性 | W3School](https://www.w3school.com.cn/html5/att_input_type.asp)

HTML5 还新增了一个 pattern 属性，可以指定一个正则表达式，用户的输入必须与之匹配。在 submit 时会做校验。注意模式开头末尾不用加 `^` 和 `$` 符号，自带就有。

```html
<form action="/submit">
  <input name="username" required pattern="\d+">
  <input type="submit" value="提交">
</form>
```

![html5_pattern.png](/images/js/html5_pattern.png)

检测表单字段或表单的有效性
- `checkValidity()` 检测表单的某个字段或表单整体的输入是否有效，表单字段或表单都可以调用该方法，有字段输入无效就返回 false
- `validity` 属性，由于 checkValidity() 只会告诉我们字段是否有效，无法知道为什么无效，validity 属性返回一个对象，可以知道字段为什么无效。返回对象的属性值如下：
  - `customError` 如果设置了 setCustomValidity() 就返回 true， 否则返回 false
  - `patternMismatch` 字段不匹配 pattern 属性就返回 false
  - `rangOverflow` 如果字段大于 max 就返回 true
  - `rangUnderflow` 如果字段小于 min 就返回 true
  - `stepMisMatch` 如果字段值与 min、max 和 step 的值不符就返回 true
  - `tooLong` 如果字段长度超过 maxlength 属性返回 true，一般浏览器会限制输入，一般都是 false
  - `typeMisMatch` 如果字段值不是 "email" 或 "url" 等要求的格式则返回 true
  - `valueMissing` 必填字段但没填，返回 true
  - `valid` 其他属性都为 false，则返回 true
```js
if (document.forms[0].elements[0].checkValidity()) {
  // 字段有效
} else {
  // 字段无效
}

if (document.forms[0].checkValidity()) {
  // 表单有效，继续
} else {
  // 表单无效
}
```

通过 novalidate 属性，可以禁用默认的表单的验证。也可以通过设置表单元素（form）的 noValidate 为 true，达到同样的效果
```html
<form action="/submit" novalidate>
  <input required>
  <input type="submit" value="提交">
</form>
<script>
  document.forms[0].noValidate = true // 关闭验证
</script>
````
如果表单中有多个提交按钮，可以给特定的提交按钮添加 formnovalidate 属性，禁止 submit 时的默认校验。使用 JS 设置提交按钮元素的 formNoValidate 为 ture 也会有同样的效果
```html
<form action="/submit">
  <input required>
  <input type="submit" value="提交">
  <input type="submit" name="btnValidate" formnovalidate value="无验证提交">
</form>
<script>
  document.forms[0].elements['btnValidate'].formNoValidate = true;
</script>
```

## 选择框脚本
选择框是通过 select 和 option 元素创建的。分别对应 HTMLSelectElement、HTMLOptionElement 类型。除公共方法外它们还提供了一些特有的方法或属性

HTMLSelectElement 属性及方法：
- `add(newOption, relOption)` 向 select 中插入新的 option 元素，其位置在相关项 (relOption) 之前，relOption 为 undefiend 时，添加到末尾
- `remove(index)` 移除给定位置的选项
- `multiple` 是否多选? 等价于 HTML 中的 multiple 属性，默认为 false，选择框元素 type 属性值为 "select-one"，当 multiple 为 true 时，type 属性值为 "select-multiple"
- `options` select 控件中所有 option 元素的 HTMLCollection
- `selectedIndex`: 基于 0 的选项中的索引，如果没有选中项，则值为-1，对于多选，只保存选项中第一列的索引
- `size` 选择框中可见的行数

HTMLOptionElement 属性
- `index` 当前 options 集合中的索引
- `label` 当前选项的标签，等价于 HTML 的 label 特性
- `selected` 是否被选中
- `text` 选项的文本
- `value` 选项的值

关于 option 在页面的显示，只会显示 `<option>` 和 `</option>` 中间的文本内容，如果为空，选择项就是空白，不会显示 label 属性的内容。

select 元素的 value 取值问题：
- 如果没有选中项 value 为空字符串
- 如果选中的 option 有 value 属性，就取 value 属性的值，就算 `value=""`，也取空字符串为值
- 如果没有 value 属性，仅有文本内容，value 值就是文本内容
- 如果是 multiple 多选，value 仅取第一个选中项的值，如果要获取选中的所有值，需要遍历 select 元素 options 中 selected 为 true 的元素，取其值放到一个数组中。

```html
<select>
  <option value="cn">China</option>
  <option value="" selected>Test</option>
  <option selected>just text</option>
  <option label="label" value="value">text</option>
  <option label="label" value="value"></option>
<select>
```

添加选项 add() 方法
```js
// 添加选项的通用操作
let newOption = document.createElement('option');
newOption.appendChild(document.createTextNode('Option text'));
newOption.setAttribute('value', 'Option value');
selectbox.appendChild(newOption);

// 最佳添加方案
let newOption = new Option('Option text', 'Option value');
selectbox.add(newOption, undefined); // 添加到末尾最佳方案
```

移除选项 remove
```js
 // 移除第一个选项的三种方法
// 方法1:
selectbox.removeChild(selectbox.options[0]);
// 方法2: 最佳方法
selectbox.remove(0);
// 方法3：
selectbox.options[0] = null;
```

整体示例
```html
<!-- <select name="location" id="selLocation"> -->
<select name="location" id="selLocation" multiple>
  <option value="cn">China</option>
  <option value="usa" selected>American</option>
  <option value="jp" selected>Japan</option>
  <option value="rus">Russia</option>
  <option value="" selected>Test</option>
  <option selected>just text</option>
  <option label="label" value="value">text</option>
  <option label="label" value="value"></option>
</select>
<script>
  let sel = document.getElementById('selLocation');

  // select的属性
  console.log('multiple: ' + sel.multiple); // 是否为多选, true为多选，否则为false
  console.log('selectedIndex: ' + sel.selectedIndex); // 如果没选中，返回-1，有选择或多个选择，返回第一个选择的index，select单选时默认为0
  console.log('size: ' + sel.size); // 0
  console.log('value: ' + sel.value); // 选中的值，为option value的值。单选或多选，只是第一个index的值。没选中，值为""
  console.log('type: ' + sel.type); // 单选type为select-one, 多选值为select-multiple
  console.log('options: ', sel.options) // 获取select的optinos HTMLCollection

  // 每一个option选项，都是HTMLOptionElement对象
  let option = sel.options[0] // 第一个option
  console.log('option.index: ' + option.index); // 0
  console.log('option.label: ' + option.label); // China
  console.log('option.selected: ' + option.selected); // false
  console.log('option.text: ' + option.text); // China
  console.log('option.value: ' + option.value); // cn

  // 获取select选择项的值
  function getSelectedValue(selectObj) {
      // 如果是单选，直接返回值
      if (selectObj.type === 'select-one') {
          return selectObj.value
      }

      let options = selectObj.options;
      let selectArr = [];
      for (let i = 0; i < options.length; i++) {
          if (options[i].selected) {
              selectArr.push(options[i].value)
          }
      }
      return selectArr
  }
  console.log(getSelectedValue(sel));
  
  // 添加选项1, 通用DOM操作
  // let newOption = document.createElement('option');
  // newOption.appendChild(document.createTextNode('Option text'));
  // newOption.setAttribute('value', 'Option value');
  // sel.appendChild(newOption);

  // 添加选项2，最佳方法
  let newOption = new Option('Option text', 'Option value');
  sel.add(newOption, undefined);

  // 移除选项
  sel.remove(1);
</script>
```

## 表单序列化
表单序列化（form serialization）是将 from 表单中所有字段的 name 和 value 属性值根据 `name1=value1&name2=value2` 的格式拼凑成一个字符串。用于 Ajax 请求将表单数据发送到到服务端。细节规则如下：
- 字段名和值时 URL 编码的，并以 `&` 分隔
- 禁用字段不会发送
- 复选框（checkbox）或单选框（radio）如果没有选中时不会发送
- 多选每个选中项都有一个值
- 通过点击提交按钮（类型为 'image' 的 input 也算提交按钮）提交表单时，会发送提交按钮
- select option 如果没有 value 属性，有 text，就取 text 的值，使用 `option.hasAttribute('value')` 或者 `option.attributes['value'].specified` 来判断是取 value 的值，还是 text 的值。

下面是一个简单的例子，更多详情参考 p602
```html
<form>
  姓名：
  <input type="text" name="name" maxlength="15"><br><br>
  年龄：
  <input type="number" name="age" min="0" max="150"><br><br>
  出生日期：
  <input type="date" name="birthday"><br><br>
  背景色：
  <input type="color" name="bgcolor"><br><br>

  地区：
  <select name="location">
    <option value="shenzhen">深圳</option>
    <option value="wuhan">武汉</option>
    <option value="beijing">北京</option>
    <option value="dalian">大连</option>
    <option value="hangzhou">杭州</option>
    <option value="xizang">西藏</option>
    <option value="chengdu">成都</option>
  </select>
  <br><br>

  喜欢颜色：
  <select name="lovecolor" multiple>
    <option value="white">白色</option>
    <option value="black">黑色</option>
    <option value="purple">紫色</option>
    <option value="pink">粉色</option>
    <option value="green">绿色</option>
    <option value="yellow">黄色</option>
    <option value="orange">橙色</option>
  </select>
  <br><br>
  手机
  <input type="tel" name="tel" maxlength="15"><br><br>
  密码：
  <input type="password" name="pw" maxlength="15"><br><br>
  email：
  <input type="email" name="email" maxlength="30"><br><br>

  <input type="submit" value="提交"><br><br>
  <input type="reset" value="重置"><br><br>
</form>
<script>
  // serialize form
  let formObj = document.forms[0];
  formObj.addEventListener('submit', function(event) {
    console.log(serializeForm(formObj));
    event.preventDefault();
  });

  function serializeForm(formObj) {
    let fields = formObj.elements;
    let contentArr = [];

    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      // 如果没有name属性, 跳过
      if (!field.name.length) {
        continue;
      } 
      switch(field.type) {
        case undefined: // 字符集
        case 'file': // 文件输入
        case 'submit': // 提交按钮
        case 'reset': // 重置按钮
        case 'button': // 自定义按钮
          // 非输入内容，break
          break;
        case 'select-multiple': // 多选，需要特殊处理
          let options = field.options;
          let selectArr = [];
          for (let j = 0; j < options.length; j++) {
              if (options[j].selected) {
                  selectArr.push(options[j].value)
              }
          }
          contentArr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(selectArr.join(';')));
          break;
        default:
          contentArr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value))
        }
    }
    console.log(contentArr);
    return contentArr.join("&")
  }
</script>
```

## 富文本编辑器
前面提到过文本框，就是可以输入文本内容的输入框，它是纯文本内容。富文本指的是在普通文本的基础上，增加样式效果、图片、表情、列表、代码等内容比较丰富的文本。富文本编辑也就是所谓的 "所见即所得"（WYSIWYG，what you see is what you get）编辑。可以在网页中编辑富文本内容。

富文本编辑器的两种实现方式：
- iframe 内嵌空白 HTML，通过设置 designMode 属性为 on，空白的 HTML 就可以编辑，注意 "file://" 方式访问会没有效果，需要使用 http 协议访问
- 给普通 div 设置 contenteditable 属性，就可以编辑了

```html
<!-- null.html 文件内容为空，不包含任何内容 -->
<p>1. iframe可编辑区域：</p>
<iframe name="richedit" src="null.html" style="width:400px;height:400px;"></iframe>
<p>2. div contenteditable可编辑区域</p>
<div id="editdiv" contenteditable style="width:400px;height:400px;border:1px solid #ccc;">
</div>
<script>
  window.onload = function() {
    frames['richedit'].document.designMode = 'on'
  }
</script>
```

与富文本编辑器交互的主要方法是使用 `document.execCommand(command, aShowDefaultUI, aValueArgument)`
- `command` 要执行的命令字符串，包括设置字体样式，增加 url、copy，cut 等各种命令，参见 p604
- `aShowDefaultUI` 可选，是否展示用户界面，默认 false，应该始终设置为 false，因为实则为 true，Firfox 会报错
- `aValueArgument` 可选，一些命令（例如 insertImage ）需要额外的参数（ insertImage 需要提供插入 image 的 url），默认为 null。


两种富文本编辑器（iframe 和 div）在执行 execCommand 和获取内容时有些许区别
```html
<!-- <p>1. iframe可编辑区域：</p> -->
<iframe name="richedit" src="null.html" style="width:800px;height:400px;"></iframe>
<!-- <p>2. div contenteditable可编辑区域</p> -->
<div id="editdiv" contenteditable style="width:800px;height:400px;border:1px solid #ccc;overflow: scroll;">
</div>
<script>
  // 如果是 iframe 其 document 为 optDocument，否则可以直接使用 document
  let optDocument = isFrame ? frames['richedit'].document : document
  // 获取富文本内容
  let iframeRichText = frames['richedit'].document.body.innerHTML
  let editRichText = document.getElementById('editdiv').innerHTML
</script>
```
下面是一个简单的 html 富文本编辑器 demo，它的在线示例地址：[富文本编辑器 demo 在线示例](https://zuoxiaobai.github.io/fedemo/src/JS_ES6/JS%E9%AB%98%E7%A8%8B3/%E8%A1%A8%E5%8D%95%E8%84%9A%E6%9C%AC/%E5%AF%8C%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%99%A8/richEditor.html)
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>richEditor</title>
    <style>
      input { margin: 5px 10px;padding:3px 5px; }
      button { padding: 10px; margin-right:20px; }
    </style>
  </head>
  <body>
    <div id="tooldiv" style="margin:10px;border:1px solid #ccc;padding:10px;">
      <input type="button" id="set-backcolor" value="设置背景颜色">
      <input type="button" id="set-selectall" value="选中所有文本">

      <input type="button" id="set-copy" value="copy选中">
      <input type="button" id="set-cut" value="cut选中">
      <input type="button" id="set-delete" value="delete选中">
      <!-- <input type="button" id="set-paste" value="将粘贴板中的文本粘贴到选择的文本"> -->
      <input type="button" id="set-bold" value="将选中设置为粗体">
      <input type="button" id="set-italic" value="将选中设置为斜体">
      <input type="button" id="set-underline" value="将选中的文本添加下划线">

      <input type="button" id="set-createlink" value="选中文本转链接，指定URL">
      <input type="button" id="set-unlink" value="移除选中的文本链接，撤销createlink操作">
      <input type="button" id="set-fontname" value="选中文本，指定字体">
      <input type="button" id="set-fontsize" value="选中文本，指定大小1-7">
      <input type="button" id="set-forecolor" value="选中文本指定字体颜色">
      <input type="button" id="set-formatblock" value="使用指定的HTML标签来格式化选中文本，如h1等">
      <!-- <input type="button" id="set-removeformat" value="移除光标所在的文本块的块级格式，撤销formatblock操作"> -->

      <input type="button" id="set-indent" value="缩进选中文本">
      <input type="button" id="set-outdent" value="凸排(减少缩进)选中文本">

      <input type="button" id="set-inserthorizontalrule" value="在输入处，插入一个hr元素">
      <input type="button" id="set-insertimage" value="在输入处，插入一个图片,图片的url">
      <input type="button" id="set-insertorderedlist" value="在输入处，插入一个ol元素">
      <input type="button" id="set-insertunorderedlist" value="在输入处，插入一个ul元素">
      <input type="button" id="set-insertparagraph" value="在输入处，插入一个p元素">

      <input type="button" id="set-justifycenter" value="将插入光标所在的文本块居中对齐">
      <input type="button" id="set-justifyleft" value="将插入光标所在的文本块左对齐">
    </div>

    <div id="tabtool" style="margin:20px 10px;">
      <button id="iframe">iframe可编辑区域</button>
      <button id="contenteditable">div contenteditable可编辑区域</button>
    </div>

    <!-- <p>1. iframe可编辑区域：</p> -->
    <iframe name="richedit" src="null.html" style="width:800px;height:400px;"></iframe>
    <!-- <p>2. div contenteditable可编辑区域</p> -->
    <div id="editdiv" style="width:800px;height:400px;border:1px solid #ccc;overflow: scroll; display: none" contenteditable>
    </div>
    
    <div>
      <button id="getrichcontent">获取当前富文本的内容</button>
    </div>
            
    <script>
      window.onload = function() {
        frames['richedit'].document.designMode = 'on'
      }

      // tabtool
      let tabtool = document.getElementById('tabtool');
      tabtool.onclick = function(event) {
        let iframeObj =  document.getElementsByTagName('iframe')[0]
        let divObj = document.getElementById('editdiv')
        if (event.target.id === 'iframe') {
          iframeObj.style.display = 'block'
          divObj.style.display = 'none'
        } else {
          iframeObj.style.display = 'none'
          divObj.style.display = 'block'
        }
      }

      // 工具栏按钮点击执行操作
      let tooldiv = document.getElementById('tooldiv');
      tooldiv.onclick = function(event) {
        let id= event.target.id;
        // let optDocument = frames['richedit'].document;
        // let optDocument = document;
        let optDocument = document.getElementById('editdiv').style.display === 'none' ? frames['richedit'].document : document;
        switch(id) {
          case 'set-backcolor': // 设置背景颜色
            let setColor = Math.round(Math.random()) ? 'red': 'yellow'; // 随机颜色
            optDocument.execCommand('backcolor', false, setColor)
            break;
          case 'set-createlink': // 选中文本转链接，指定URL
            optDocument.execCommand('createlink', false, 'http://zuo11.com')
            break;
          case 'set-fontname': // 选中文本，指定字体, "serif"、"sans-serif"、"cursive"、"fantasy"、"monospace"
            let fontArr = ["serif","sans-serif","cursive","fantasy","monospace"]
            let fontRandom = fontArr[Math.round(Math.random() * 5)]
            optDocument.execCommand('fontname', false, fontRandom)
            break;
          case 'set-fontsize': // 选中文本，指定大小1-7
            let randomSize = Math.round(Math.random() * 7)
            optDocument.execCommand('fontsize', false, randomSize)
            break;
          case 'set-forecolor': // 选中文本指定字体颜色
            let setColor = Math.round(Math.random()) ? 'red': 'yellow'; // 随机颜色
            optDocument.execCommand('forecolor', false, setColor)
            break;
          case 'set-formatblock': // 使用指定的HTML标签来格式化选中文本，如h1等
            let formatArr = ['<h1>','<h2>','<h3>','<h4>','<h5>']
            let randomFormat = formatArr[Math.round(Math.random() * 5)]
            optDocument.execCommand('formatblock', false, randomFormat)
            break;
          case 'set-insertimage': // 使用指定的HTML标签来格式化选中文本，如h1等
            optDocument.execCommand('insertimage', false, 'index.png')
            break;

          // 为了熟悉功能，把case都写了上去，也可以直接删掉下面的case，直接用default:
          case 'set-selectall': // 选中所有文本
          case 'set-copy': // copy选中
          case 'set-cut': // cut选中
          case 'set-delete': // delete选中
          case 'set-bold': // 将选中设置为粗体，再次执行会取消
          case 'set-italic': // 将选中设置为斜体，，再次执行会取消
          case 'set-underline': // 将选中的文本添加下划线，，再次执行会取消
          case 'set-unlink': // 移除选中的文本链接，撤销createlink操作
          case 'set-removeformat': // 移除光标所在的文本块的块级格式，撤销formatblock操作
          case 'set-indent': // 缩进选中文本, 类似与tab效果
          case 'set-outdent': // 凸排(减少缩进)选中文本，去掉tab效果
          case 'set-inserthorizontalrule': // 在输入处，插入一个hr元素
          case 'set-insertorderedlist': // 在输入处，插入一个ol元素
          case 'set-insertunorderedlist': // 在输入处，插入一个ul元素
          case 'set-insertparagraph': // 在输入处，插入一个p元素
          case 'set-justifycenter': // 将插入光标所在的文本块居中对齐
          case 'set-justifyleft': // 将插入光标所在的文本块左对齐
            let opt = id.split('-')[1];
            console.log('执行了通用操作')
            optDocument.execCommand(opt, false, null);
            break;
        }
      }
      
      // 显示富文本内容
      document.getElementById('getrichcontent').onclick = function() {
        let editdiv = document.getElementById('editdiv')
        let opt = editdiv.style.display === 'none' ? frames['richedit'].document.body : editdiv;
        alert(opt.innerHTML)
      }
    </script>
  </body>
</html>
```
除了 document.execCommand() 外，还有与命令相关的其他方法
- `document.queryCommandEnabled(command)` 确定当前选中的文本或光标所在位置是否适合（注意不是 "可以"）执行相关命令。
- `document.queryCommandState(command)` 确定相关命令是否应用到了当前选中的文本（选区）。比如确定当前选区的文本是否为粗体，可以使用 document.queryCommand('bold')
- `document.queryCommandValue(command)` 返回执行命令时使用的值，也就是 execCommand() 函数的第三个参数。


### 富文本选择
在富文本编辑器中（iframe 方式）使用 document.getSelection() 可以获取富文本选区，即选中的内容。在使用 contenteditable 的 div 作为富文本编辑器时，需要判断 document.getSelection() 是否是当前富文本编辑器 div 区域的选中。该函数执行后返回一个表示当前选中文本的 Selection 对象。每个 Selection 对象都有以下属性及方法：
- `anchorNode` 选区开始的节点
- `anchorOffset` 在 anchorNode 中，从开头到选区开始跳过的字符数
- `focusNode` 选区结束的节点
- `focusOffset` focusNode 中包含在选区内的字符数
- `isCollapsed` 选区起点和重点是否在同一个地方
- `rangeCount` 选区中包含的 DOM 范围数量
- `addRange(range)` 把给定的 DOM 范围添加到选区
- `collapse(node, offset)` 将选区折叠刀给定节点中给定的文本偏移处
- `collapseToEnd()` 将选区折叠到终点。
- `collapseToStart()` 将选区折叠到起点 
- `containsNode(node)` 确定给定节点是否包含在选区中
- `deleteFromDocument()` 从文档中删除选区文本，与执行 execDocument('delete', false, null) 命令结果相同
- `extend(node, offset)` 通过将 focusNode 和 focusOffset 移动到指定值来扩展选区
- `getRangeAt(index)` 返回选区中指定索引处的 DOM 范围
- `removeAllRanges()` 从选区中移除所有的 DOM 范围
- `removeRange(range)` 从选区中移除指定的 DOM 范围
- `selectAllChildren(node)` 清除选区并选择给定节点的所有子节点
- `toString()` 返回选区中的文本内容

与之相关的 DOM 范围内容可以参考第 16 章： [DOM 范围(range) - 16. DOM2 和 DOM4](http://fe.zuo11.com/js/ad3/js-ad3-16.html#%E8%8C%83%E5%9B%B4-range)

Selection 结合 DOM 范围可以实现比 execCommand() 更细粒度的控制。因为可以直接对选中文本的 DOM 内容进行操作。

```js
let selection = frames['richedit'].getSelection()
// 获得选中的文本
let selectedText = selection.toString()
// 获取选区范围
let range = selection.getRangeAt(0)
// 高亮选中的文本
let span = frames['richedit'].document.createElement('span')
span.style.backgroundColor = 'yellow'
range.surroundContents(span) // 使用 span 包裹选区内容
```

IE8 及以下的版本不支持 DOM 范围，可以使用专有的 selection 对象来操作选中的文本。

```js
let range = frames['richedit'].document.selection.createRange()
let selectedText = range.text

range.pasteHTML(`<span style="background-color: yellow">${range.htmlText}</span>`)
```

富文本编辑器如果只是写 demo 就比较简单，但如果应用于生产环境或者实现某些特定的功能，其兼容性以及各种情况的特殊处理，坑是非常多的。开发中尽量使用社区现有的，尽量少自定义。相关内容参见：

- [为什么都说富文本编辑器是天坑？- 知乎](https://www.zhihu.com/question/38699645)
- [输入过程中，怎么实时高亮部分文字(@xxx高亮实现) - dev-zuo 技术日常](http://www.zuo11.com/blog/2020/9/highlight_when_input.html)
- [Vue @ 功能实现 - dev-zuo 技术日常](http://www.zuo11.com/blog/2020/11/vue_mentions.html)