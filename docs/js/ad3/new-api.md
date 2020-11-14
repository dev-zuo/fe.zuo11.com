
# 22. 高级技巧

## 高级函数
### 安全的类型检测
instanceof 在多个全局作用域下（一个页面多个frame），可能会出现误判的情况，建议用 **Object.prototype.toString.call(value)** 转换为String来判断
```js
// 判断一个值是否为数组
if (Object.prototype.toString.call(value) === '[Object Array]') {
  // value 是数组
}
// 判断一个值是否为函数
function isFunctioin(value) {
  return Object.prototype.toString.call(value) === '[Object Function]'
}
```
### 作用域安全的构造函数
```js
// 构造函数是一个使用new操作符调用的函数
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}
var person = new Person('guoqzuo', 20, 'it')
// 上面会正常执行。如果忘了写new，this会直接指向window，各个属性会直接赋值到window上
var person2 = Person('guoqzuo', 20, 'it'); // person2 为 undefined， window.name  为 "guoqzuo"

// 作用域安全的构造函数
function Person(name, age, job) {
  if (this instanceof Person) {
    this.name = name;
    this.age = age;
    this.job = job;
  } else {
    return new Person(name, age, job);
  }
}

// 这里要注意，如果是父类使用了作用域安全的构造函数，子类想继承，不能单独使用借用构造函数来实现继承，需要组合继承方式。
```

### 惰性载入函数
惰性载入表示函数执行的分支仅会发生一次。如果函数里包含if判断分支，且函数需要多次调用，如果不优化，每次调用都会执行if分支判断。优化后if只会在第一次执行，不会每次执行
```js
// 函数里多if判断，函数可能被多次调用，每次调用，都会执行if判断
function createXHR() {
  if (typeof XMLHttpRequest !== 'undefined') {
    return new XMLHttpRequest()
  } else if (typeof ActiveXObject !== 'undefined') {
    // ie处理方式省略
  } else {
    throw new Error("No XHR object available")
  }
}

// 惰性载入函数改造有两种方法
// 方法一: 第一次在函数第一次执行时就用用if分支的内容覆盖原有函数
function createXHR() {
  if (typeof XMLHttpRequest !== 'undefined') {
    createXHR = function() {
      return new XMLHttpRequest()
    }
  } else if (typeof ActiveXObject !== 'undefined') {
     createXHR = function() {
      // ie处理方式省略
    }
  } else {
    createXHR = function() {
      throw new Error("No XHR object available")
    }
  }
  return createXHR();
}

// 方法二: 立即执行函数，在代码首次载入时损失一点性能。以后每次调用就都不用if判断了。
var createXHR = (function() {
  if (typeof XMLHttpRequest !== 'undefined') {
    return function() {
      return new XMLHttpRequest()
    }
  } else if (typeof ActiveXObject !== 'undefined') {
    return function() {
      // ie处理方式省略
    }
  } else {
    return function() {
      throw new Error("No XHR object available")
    }
  }
})()

```
### 函数绑定(使用闭包，指定this)
```js
var handler = {
  message: "Event handled",
  handleClick: function(event) {
    alert(this.message)
  }
};
var btn = document.getElementById('my-btn');
btn.addEventListener('click', handler.handleClick);
// 点击后alert的是undefined, this指向了dom按钮，而非handle

// 1.用闭包将函数绑定到指定环境
var handler = {
  message: "Event handled",
  handleClick: function(event) {
    alert(this.message)
  }
};
var btn = document.getElementById('my-btn');
btn.addEventListener('click', function(event) {
  handler.handleClick(event)
});

// bind 函数的实现，用于指定this(context)
function bind(fn, context) {
  return function() {
    return fn.apply(context, arguments)
  }
}
var handler = {
  message: "Event handled",
  handleClick: function(event) {
    alert(this.message)
  }
};
var btn = document.getElementById('my-btn');
btn.addEventListener('click', bind(handler.handleClick, handler));

// ES5 原生支持bind，可直接使用, IE9+
var handler = {
  message: "Event handled",
  handleClick: function(event) {
    alert(this.message)
  }
};
var btn = document.getElementById('my-btn');
btn.addEventListener('click', handler.handleClick.bind(handler));
```

### bind()、call()、apply()
- Function.prototype.call()
```js
func.call(thisArg, arg1, arg2, ...) // 用指定的this值，和一些参数来调用函数func
```
- Function.prototype.apply()
```js
func.apply(thisArg, [argsArray])// 用指定的this值，和参数数组来调用函数func
```
- Function.prototype.bind()
```js
function.bind(thisArg[, arg1[, arg2[, ...]]]) //  返回一个原函数的拷贝，并拥有指定的this值和初始参数。
// MDN文档 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
```

### 函数柯里化
函数柯里化：用于创建已经设置好了一个或多个参数的函数。
- 函数柯里化可以理解为: 函数A柯里化，就是返回一个新的函数B，在函数B里调用函数A，并默认加入一些参数。主要的核心就是加参数，如果不加参数，就和bind类似了。
- 函数柯里化的方法和函数绑定是一样的，使用一个闭包，返回一个函数。两者的区别是在函数调用时，返回的函数还需要设置一些传入的参数。
```js
function add(num1, num2) {
  return num1 + num2;
}
function curriedAdd(num2) { // 类型于柯里化
  return add(5, num2)
}
alert(add(2,3)) // 5
alert(curriedAdd(3)) // 8
```
函数柯里化的通用方式
```js
function curry(fn) {
  var args = Array.prototype.slice.call(arguments, 1)
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(innerArgs) // [...args, ...innerArgs]
    return fn.apply(null, finalArgs)
  }
}
function add(num1, num2) {
  return num1 + num2;
}
var curriedAdd = curry(add, 5);
alert(curriedAdd(3)) // 8

var curriedAdd2 = curry(add, 5, 12);
alert(curriedAdd2()) // 17
```
函数柯里化常常作为函数绑定的一部分，包含在其中，构造出更复杂的bind函数，在前面通用函数的基础上，指定作用域
```js
function bind(fn, context) {
  var args = Array.prototype.slice.call(arguments, 2) // bind(func, context, 传入的参数1, 传入的参数2)
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(innerArgs) // [...args, ...innerArgs]
    return fn.apply(context, finalArgs)
  }
}

// 应用
var handler = {
  message: "Event handled",
  handleClick: function(name, event) { // 函数柯里化传的值"my-btn"，会在默认事件处理函数event之前
    alert(this.message, name, event)
  }
};
var btn = document.getElementById('my-btn');
btn.addEventListener('click', bind(handler.handleClick, handler, "my-btn"));
// ES5 原生bind
// btn.addEventListener('click', handler.handleClick.bind(handler, "my-btn"));
```

## 防篡改对象
由于JS任何对象都可以被在同一环境中运行的代码修改，开发人员很可能会意外的修改别人的代码。未防止这种情况，ES5出了三个函数来定义防篡改对象。
（第6章讨论了对象属性的问题，可以通过手工设置每个属性的 Configurable、Writable、Enumerable，来防止对象被修改。和ES5新出的功能类似。）
### 不可扩展对象
不能为对象添加属性和方法，Object.preventExtensions(需要操作的对象)
```js
var person = { name: 'guoqzuo'};
Object.preventExtensions(person); // 不可扩展
person.age = 29; // 添加的属性会无效，不可扩展
alert(person.age); // undefined
```
### 密封的对象
不能扩展、且不能删除属性和方法 Object.seal(需要操作的对象)
```js
var person = { name: 'guoqzuo'};
Object.seal(person); // 密封的对象

person.age = 29; // 添加的属性会无效, 不可扩展
alert(person.age); // undefined

delete person.name; // 删除会无效，密封的对象
alert(person.name); // guoqzuo
```
### 冻结的对象
不可扩展、又密封(不能删除属性和方法)，且无法修改属性和方法。Object.freeze(需要操作的对象)
```js
var person = { name: 'guoqzuo'};
Object.freeze(person); // 密封的对象

person.age = 29; // 添加的属性会无效, 不可扩展
alert(person.age); // undefined

delete person.name; // 删除会无效，密封的对象
alert(person.name); // guoqzuo

person.name = "Greg"; 
alert(person.name); // guoqzuo

// 判断一个对象是否是可扩展的
Object.isExtensible(person); // false
// 判断一个对象是否是可密封的
Object.isSealed(person); // true
// 判断一个对象是否是冻结的
Object.isFrozen(person); // true
```

## 高级定时器
- JS是运行于单线程环境中的，setTimeout和setInterval并不是开一个线程来执行对应的代码。而是将代码加入到一个队列，等待执行。
- 设定一个150ms后执行的定时器不代表150ms后代码立即执行，他表示代码会在150ms后被加入到队列中。如果在这个时间点，队列没有其他东西，这个代码就会被执行。
```js
// 下面的代码中按钮点击后，会将onclick事件处理程序加入到队列，该程序执行后，再设置定时器，再有250ms才执行定时器代码
// 但如果onclick事件处理程序执行了300ms，那定时器代码最早的执行时机就是300ms后。
var btn = document.getElementById('my-btn');
btn.onclick = function() {
  setTimeout(function() {
    document.getElementById('message').style.visibility = 'visible'
  }, 250)
}
```
### 重复定时器(类似递归)
- 1.setInterval的缺陷，比如click处理函数是setInterval，每隔200ms执行一个内容。当onclick处理程序执行后，会在200ms/400ms/600ms 位置添加处理程序。假设处理了300ms，第一个程序会在300ms执行。第二个程序会在400ms执行。这样就不是相同的间隔执行了。
```js
// 为了让每次处理都在相同的间隔里，可以使用链式的setTimeout（setTimeout里调用setTimeout执行内容）来代替setInterval()
// 这样做的好处是，在第一个定时器未执行完前，不会像队列插入新的定时器代码
setTimeout(function() {
  // 处理中
  setTimeout(arguments.callee, 200); // 获取当前函数执行的引用
}, 200)

// 示例
setTimeout(function() {
  var div = document.getElementById('myDiv');
  left = parseInt(div.style.left) + 5;
  display.style.left = left = 'px';
  
  if (left < 200) {
    setTimeout(arguments.callee, 50);
  }
}, 50)
```

- 2.Yielding Processes(分块执行)
如果某个循环处理时间较长可能会让用户等待的事件比较久，如果代码运行超过特定时间，会提升错误。这时可以用settimeout分块执行。
```js
// 如果该处理不需要同步完成，且数据不是必须按顺序完成可以考虑用这个方法
setTimeout(function() {
  // 取出下一个条目并处理
  var item = array.shift();
  process(item);
  
  // 如果还有条目，再设置一个定时器
  if (array.length > 0) {
    setTimeout(arguments.callee, 100)
  }
});

// 封装数组分块执行函数
// context 当前执行环境 this
function chunk(array, process, context) {
  setTimeout(function() {
    var item = array.shift();
    process.call(context, item);
    
    if (array.length > 0) {
      setTimeout(arguments.callee, 100);
    }
  }, 100)
}

var data = [12,123,1234,453,436,232,23,5,4123,45,346,6534,2234,345,342];
function printValue() {
  var div = document.getElementById('myDiv');
  div.innerHTML += item + '<br>';
}
chunk(data, printValue);
```
### 函数节流与防抖
> 频繁触发一个函数，如果想限制函数的执行次数，有两次方法，节流和防抖。书中并没有区分节流和防抖，书中说的节流和网上查到的防抖比较类似。

- 函数节流(throttle): 频繁触发, 特定的时间内只执行一次代码，比如函数第一次触发执行后，1s内再次触发的都不会执行。
- 函数防抖(debounce)：当调用函数n秒后，才会执行该动作，若在这n秒内又调用该函数则将取消前一次并重新计算执行时间，举个简单的例子，我们要根据用户输入做suggest，每当用户按下键盘的时候都可以取消前一次，并且只关心最后一次输入的事件。

**两者区别在于函数节流是固定时间做某一件事，比如每隔1秒发一次请求。而函数防抖是在频繁触发后，只执行一次（两者的前提都是频繁触发）**

![函数的节流和防抖.gif](/images/js/函数的节流和防抖.gif)

#### 函数节流(throttle)
throttle 减少函数执行的频率，可能会出现单位等待时间内，后面触发的改动不执行的问题
```js
// 使用场景
// 1.拖拽场景：固定时间内只执行一次，防止超高频次触发位置变动
// 2.缩放场景：监控浏览器resize
// 3.动画场景：避免短时间内多次触发动画引起性能问题
// 节流方法1：
var startTime = 0;
var processTime = 0;
function resizeDiv() {
   // 计算当前时间并存入到第一次执行时间
   var curTime = +(new Date())
   processTime = curTime;
   if (processTime - startTime < 1000) { // 如果点击间隔小于1s不执行
     return;
   } else {
     startTime = curTime;
   }
   var div = document.getElementById('myDiv');
   div.style.height = div.offsetHeight + 'px'
}
window.onresize = resizeDiv()

// 节流方法2：
const throttle = (fn, delay = 500) => {
  let flag = true;
  return (...args) => {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
};
// 第一次执行时，设置一个变量为false，开启一个定时器，delay时间后，执行代码
// 如果中间时间多次触发，均会return，不会开启新的定时器。到时间执行代码后，flag为true后，开启下一个周期。
```
#### 函数防抖
```js
// 使用场景
// 1.按钮提交场景：防止多次提交按钮，只执行最后提交的一次
// 2.服务端验证场景：表单验证需要服务端配合，只执行一段连续的输入事件的最后一次，还有搜索联想词功能类似
```
```js
var processor = {
  timeoutId: null,
  
  // 执行要进行的操作
  performProcessing: function() {
    // 实际执行的代码
  },
  
  // 初始化调用方法
  process: function() {
    clearTimeout(this.timeoutId);
    
    this.timeoutId = setTimeout(() => {
      this.performProcessing()
    }, 1000); 
    // 比如突然触发了20次事件，开启20个1秒后执行的代码，前面的会清除掉后面的
  }
}
processor.process()

// 简化方法
function debounce(method, context) {
  clearTimeout(method.tId)
  method.tId = setTimeout(function() {
    method.call(context)
  }, 1000)
}

// 普通处理
window.onresize = function() {
  var div = document.getElementById('myDiv');
  div.style.height = div.offsetHeight + 'px'
}
//节流优化后的处理
function resizeDiv() {
   var div = document.getElementById('myDiv');
   div.style.height = div.offsetHeight + 'px'
}
window.onresize = function() {
  debounce(resizeDiv)
}


// 另一种写法
// 防抖函数
const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
```

- 参考1: https://juejin.im/post/5a142de15188251c11404085
- 参考2: https://blog.csdn.net/qq_40421277/article/details/87990882， 


## 自定义事件
自定义事件是一种创建松散耦合代码的技术，暂时未发现有什么大的用处。有时间研究 p616

## 拖放
一般利用mousemove事件监听来移动元素。使用绝对定位 position:absolute; 通过动态改变left,top实现拖放
```js
// <div id="dragdiv" style="position:absolute;left:10px; top:10px;width:100px;height:100px;border:1px dashed #333;"></div>
// 简单的div拖放，鼠标移动上去就可以拖动
var dragdiv = document.getElementById('dragdiv')
dragdiv.onmousemove = function(event) {
  dragdiv.style.left = event.clientX - 20 + 'px'
  dragdiv.style.top = event.clientY - 20 + 'px'
}
```

- 实现点击开始后拖动，点击停止后停止拖动, 利用mousedown, mouseup, mousemove来实现
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>drag demo</title>
  </head>
  <body>
    <div id="dragdiv" style="position:absolute;left:10px; top:10px;width:100px;height:100px;border:1px dashed #333;"></div>
    <script>
      // 鼠标左键点击后拖动，移开后停止移动
      // 监听mousedown，就开始拖动监听，mousemove才开始生效，移动，放手后mouseup后，停止监听
      let draging = null
      let diffx = 0
      let diffy = 0
      let dragdiv = document.getElementById('dragdiv')

      dragdiv.onmousedown = function(event) {
        draging = "can drag"
        console.log('mousedown: ', draging)
        diffx = event.clientX - dragdiv.offsetLeft
        diffy = event.clientY - dragdiv.offsetTop
      } 
      dragdiv.onmousemove = function(event) {
        if (draging !== null) {
          dragdiv.style.left = event.clientX - diffx  + 'px'
          dragdiv.style.top = event.clientY - diffy + 'px'
        }
        console.log('mousemove: ', draging)
      } 
      dragdiv.onmouseup = function(event) {
        draging = null
        console.log('mouseup: ', draging)
      } 
      document.documentElement.onmouseup = function(event) {
        draging = null
        console.log('body mouseup: ', draging)
      } 
    </script>
  </body>
</html>
```

- 优化，封装为对象
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>drag demo</title>
    <style>
      .div {
        position:absolute;
        width:100px;height:100px;border:1px dashed #333;
        text-align: center;
        user-select: none;  /* 让元素不可选中 */
      }
      .div1 { left:10px; top:10px; background: rgba(0, 255, 0, .2) }
      .div2 { left:200px; top:10px; background: #ddd }
      .div3 { left:400px; top:10px; background: rgba(0, 255, 0, .2) }
    </style>
  </head>
  <body>
    <div class="div div1 dragable">可drag1</div>
    <div class="div div2">不可drag</div>
    <div class="div div3 dragable">可drag2</div>
    
    <script>

      var DragDrop = function() {
        var draging = null
        var offsetx = 0
        var offsety = 0

        function handleEvent(event) {
          switch(event.type) {
            case 'mousedown':
              // 如果元素包含drageable class则可移动
              if (event.target.className.includes('dragable')) {
                draging = event.target
                offsetx = event.clientX - draging.offsetLeft
                offsety = event.clientY - draging.offsetTop
              }
              break;
            case 'mousemove':
              if (draging !== null) {
                draging.style.left = event.clientX - offsetx + 'px'
                draging.style.top = event.clientY - offsety + 'px'
              }
              break;
            case 'mouseup':
              draging = null
              break;
          }
        }

        return {
          enable: function() {
            document.onmousedown = handleEvent
            document.onmousemove = handleEvent
            document.onmouseup = handleEvent
          },
          disable: function() {
            document.onmousedown = null
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
      
      // 开启
      new DragDrop().enable()
    </script>
  </body>
</html>
```


# 离线应用与客户端存储

## 离线监测
> 通过 navigator.onLine 可以获取当前网络状态，true 有网，false 没网。HTML5定义了两个事件，可以通过监听window的online和offline事件来监听网络状态发生改变。

建议先通过navigator.onLine获取当前的网络状态，再通过监听上面两个事件来确定网络连接的状态是否改变
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

## 应用缓存
HTML5 application cache 快要被废弃，由 Service Workers取代，参见: https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache , 后续要了解applicationCatch、Service Workers、PWA 的区别


# 25. 新兴的API

## requestAnimationFrame()
> 很长时间以来，计时器何循环间隔一直都是JS动画的核心。但setInterval()和setTimeout()都不十分精确，他们只是把动画代码添加到浏览器UI线程队列，如果队列正在执行其他操作。实际实行时间会比正常时间晚一点。循环间隔会有误差。requestAnimation可以避免这个误差，创建平滑的动画效果

他会告诉浏览器：有一个动画开始了，进而浏览器可以确定重绘的最佳方式。window.requestAnimationFrame(callback);
理解参考: https://www.cnblogs.com/onepixel/p/7078617.html
```js
// <div id="SomeElementYouWantToAnimate" style="position:absolute;height:100px;width:100px;border:1px solid #ccc;">111</div>
// <script>
  var progress = 0;
  var element = document.getElementById('SomeElementYouWantToAnimate');

  //回调函数
  function render() {
    progress += 10; //修改图像的位置， 加快动画时间  progress += 100
    element.style.left = progress + 'px'  // 自动控制速度

    if (progress < 200) {
      //在动画没有结束前，递归渲染
      window.requestAnimationFrame(render);
    }
  }

  //第一帧渲染
  window.requestAnimationFrame(render);
// </script>
```

## Page Visibility API(页面可见性API)
如果页面最小化了或者隐藏在了其他标签页面后面，有些功能可以停下来，比如轮询服务器或某些动画效果。而Page Visibility API就是为了让开发人员知道页面是否对用户可见而推出的。
```js
// - document.hidden // 页面是否隐藏
// - document.visibilityState(不推荐使用)  IE10和Chrome对应的状态值有较大差异
// IE值为 document.MS_PAGE_HIDDEN(0) document.MS_PAGE_VISIBLE(1)，  
// chrome值为: hidden, visible, prerender
// - visibilitychange事件，当文档从可见变为不可见或从不可见变为可见时，触发该事件

// 实现tab间切换时，隐藏页面title改变功能
var title = document.title;
document.addEventListener('visibilitychange', function (event) {
  console.log('--------------------')
  console.log(event)
  console.log(document.hidden)
  console.log(document.visibilityState)
  console.log('--------------------')

  document.title =  document.hidden ? '~ 你快回来 ~ ' : title
  if (document.hidden) {
    // 做一些暂停操作
  } else {
    // 开始操作
  }
}, false)
```

## Geolocation API(地理位置)
Geolocation API在浏览器中的实现是navigator.geolocation对象，IE9+支持，调用时会触发提示：xxx想要获取您的地址位置信息，是否允许？
- 获取当前位置信息navigator.geolocation.getCurrentPosition()
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
- 跟踪用户的位置, navigator.geolocation.watchPosition()，接收的参数完全与getCurrentPostion()一致
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

## File API
> 2000年以前，处理文件的唯一方式就是在表单中加入input type="file"字段。File API 在表单中的文件输入字段的基础上，添加了一些直接访问文件新兴的接口。HTML5在DOM中为文件输入元素添加了一个files集合。通过文件输入字段选择一个或多个文件时，files集合里面会包含一组File对象，一个File对象对应着一个文件。

每个File对象，都有下列只读属性:
- name 本地文件系统中的文件名
- size 文件的字节大小
- type 字符串，文件的MIME类型
- lastModifiedDate: 字符串，文件上一次被修改的时间

```html
  <!-- 通过document.getElementById('file').files 即可获取对应的文件信息 -->
  <input id="file" type="file">
  <input id="files" type="file" multiple="multiple">
  <script>
    var file = document.getElementById('file')
    var files = document.getElementById('files')

    // 文件内容改变时，显示文件信息
    file.addEventListener('change', fileChangeHandle, false)
    files.addEventListener('change', fileChangeHandle, false)

    function fileChangeHandle(e) {
      for (var i = this.files.length - 1; i >= 0; i--) {
        var fileInfo = this.files[i] // File对象
        console.log('name: ', fileInfo.name)
        console.log('lastModified: ', new Date(fileInfo.lastModified).toISOString()) // timestamp
        console.log('type: ', fileInfo.type)
        console.log('size: ', fileInfo.size)  // B 字节  /1000 kb
      }
    }
  </script>
```
### FileReader
FileReader是一种异步文件的读取机制，可以把FileReader想象成XMLHttpRequest，区别只是它读取的是文件系统，而不是远程服务器数据。FileReader提供了如下几个方法，来读取文件中的数据

- readAsText(file, encoding): 以纯文本形式读取文件，将读取到的文本保存在对应FileReader实例的result属性中
- reader.readAsDataURL(fileInfo): 读取文件，将文件以数据URI(base64格式字符串)的形式保存在result属性中
- reader.readAsBinaryString(fileInfo): 读取文件，并将一个字符串保存在result中，字符串中的每个字符表示一字节。
- reader.readAsArrayBuffer(fileInfo): 读取文件，并将一个包含文件内容的ArrayBuffer保存在result属性中

```js
var reader = new FileReader();
// 如果是图片，直接获取数据URI直接显示
// 如果是其他，直接读取文本
if (this.files[0].type.includes('image')) {
  reader.readAsText(this.files[0]) // 读取文件，file为 input type="file" 对象.files里面的子元素
} else {
  reader.readAsDataURL(this.files[0]) // 获取文件URL
}

// 由于读取是异步的，读取文件时，reader会触发三个事件，如果读取错误触发error事件，读取中触发progress事件，读完了整个文件会触发load事件
reader.onerror = function() {
  var errMsg = [null, '未找到文件', '安全性错误', '读取中断', '文件不可读', '编码错误']
  let errCode = reader.error.code
  console.log('读取文件错误, code: ' + errCode + '，错误提示: ' + errMsg[errCode])
}
reader.onprogress = function(e) {
  // 文件读取中，大概 50ms 刷新一次
  console.log(`加载进度 ${e.loaded} / ${e.total}`)
}
reader.onload = function(e) {
  // 文件读取完成会存到 reader.result里面
  console.log(reader.result)
}
```
示例
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>文件操作</title>
</head>
<body>
  <input id="file" type="file" style="border:1px solid #ccc;">
  <input id="files" type="file" multiple="multiple">
  <script>
    var file = document.getElementById('file')
    var files = document.getElementById('files')

    // 文件内容改变时，显示文件信息
    file.addEventListener('change', fileChangeHandle, false)
    files.addEventListener('change', fileChangeHandle, false)

    function fileChangeHandle(e) {
      for (var i = this.files.length - 1; i >= 0; i--) {
        var fileInfo = this.files[i] // File对象
        console.log('name: ', fileInfo.name)
        console.log('lastModified: ', new Date(fileInfo.lastModified).toISOString()) // timestamp
        console.log('type: ', fileInfo.type)
        console.log('size: ', fileInfo.size)  // B 字节  /1000 kb

        let reader = new FileReader(); // for循环中的var变量要特别注意，如果是var，选择多个图片时，只能显示一个

        if (fileInfo.type.includes('image')) {
          reader.readAsDataURL(fileInfo)
        } else {
          reader.readAsText(fileInfo)
        }

        // 由于读取是异步的，读取文件时，reader会触发三个事件，如果读取错误触发error事件，读取中触发progress事件，读完了整个文件会触发load事件
        reader.onerror = function() {
          var errMsg = [null, '未找到文件', '安全性错误', '读取中断', '文件不可读', '编码错误']
          let errCode = reader.error.code
          console.log('读取文件错误, code: ' + errCode + '，错误提示: ' + errMsg[errCode])
        }
        reader.onprogress = function(e) {
          // 文件读取中，大概 50ms 刷新一次
          console.log(`加载进度 ${e.loaded} / ${e.total}`)
        }
        reader.onload = function(e) {
          // 文件读取完成会存到 reader.result里面
          // console.log(reader.result)
          var fragment = document.createDocumentFragment();
          if (fileInfo.type.includes('image')) {
            var img = document.createElement('img')
            img.src = reader.result
            fragment.appendChild(img)
          } else {
            var div = document.createElement('div')
            div.appendChild(document.createTextNode(reader.result.substr(0, 100)))
            fragment.appendChild(div)
          }
          document.body.appendChild(fragment)
        }
      }
    }
  </script>
</body>
</html>
```
### 读取部分文件内容
如果只想读取文件的一部分，而不是全部，可以使用File对象的 slice(起始字节，要读取的字节数)方法。会返回一个Blob实例，Blob是File了下的父类型
```js
console.log(File.__proto__  === Blob) // true
```
示例
```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>blob slice</title>
</head>
<body>
  <input type="file" id="file">
  <script>
    var file = document.getElementById('file')
    file.onchange = function (e) {
      var myfile = this.files[0]
      var blob = myfile.slice(0, 32) // 只读取32B的内容
      if (blob) {
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onerror = function() {
          console.log('读取文件错误, ' + reader.error.code)
        }
        reader.onload = function() {
          console.log('读取文件成功，' + reader.result)
          var div = document.createElement('div')
          div.appendChild(document.createTextNode(reader.result))
          document.body.appendChild(div);
        }
        reader.onprogress = function(e) {
          console.log('读取中.....' + e.loaded + '/' + e.total)
        }
      } else {
        alert('您的浏览器不支持blob.slice()')
      }
    }
  </script>
</body>
</html>
```
### 对象URL
对象URL，也称为blob URL，引用保存在File或Blob中数据的URL，好处是，不必把文件内容读取到JS中而直接使用文件内容。IE10+支持
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
  <input type="file" id="file">
  <img src="" id="img">
  <script>
    var file = document.getElementById('file')
    file.onchange = function (e) {
      var myfile = this.files[0]
      var img = document.getElementById('img')
      var dataUrl = window.URL.createObjectURL(myfile)
      console.log('dataURL: ' + dataUrl)
      // dataURL: blob:http://localhost:63342/b42b5b0a-fef8-4cb2-b26d-1973517ac08a
      img.src = dataUrl
      // 页面卸载时会自动释放对象URL占用的内存。如果不用了，还是建议手工释放，节约内存，调用后，dataUrl还是会有值
      setTimeout(function() {
        window.URL.revokeObjectURL(myfile);
      }, 3000)
    }
  </script>
</body>
</html>
```
### 读取拖拽文件并上传
使用H5拖放API，从桌面上把文件拖放到浏览器中也会触发drop事件。在event.dataTransger.files中可以读取到防止的文件，与通过input取得的File一样
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <style>
    #dragDiv { width:300px;height: 150px;border:2px dashed #ccc; }
    .draging { border:2px dashed red !important; }
  </style>
</head>
<body>
  <div>拖拽文件到下面的方框区域</div>
  <div id="dragDiv"></div>
  <script>
    var dragDiv = document.getElementById('dragDiv')

    dragDiv.ondragenter = function(e) {
      // 当文件拖动到区域，设置red边框样式
      dragDiv.className = "draging"
    }
    dragDiv.ondragover = function (e) {
      e.preventDefault() // 取消默认行为，设置可拖放
    }
    dragDiv.ondrop = function (e) { // 有文件拖放触发
      dragDiv.className = ""
      e.preventDefault() // drop默认行为会打开新的窗口，取消默认行为
      console.log(e.dataTransfer.files)

      // 这里只显示了一个文件，如果多个文件拖拽，需要用for循环显示
      dragDiv.innerHTML = e.dataTransfer.files[0].name

       // 将文件用XHR上传操作
      // 1. 准备数据
      var files = e.dataTransfer.files
      var data = new FormData()
      for (let i = files.length - 1; i >= 0; i--) {
        data.append('file' + i, files[i])
      }
      console.log(data)

      // 2. 开始上传
      var xhr = new XMLHttpRequest()
      xhr.open('post', '/fileupdate', true) // 异步发送请求
      xhr.onload = function () {
        if (xhr.status === 200) { // 请求成功
          alert(xhr.responseText)
        } else {
          alert('请求异常', xhr.status)
        }
      }
      xhr.send(data)
    }
    dragDiv.ondragleave = function (e) { // 文件移出
      dragDiv.className = ""
    }
  </script>
</body>
</html>
```

## Web计时
Web Timing API，核心是window.performance对象。可以全面的了解页面再被加载到浏览器的过程中都经历了哪些阶段，页面哪些阶段可能是影响性能的瓶颈。IE10+支持。
- performance.navigation记录了页面加载器重定向的次数，导航类型(页面第一次加载，页面重载过等状态)
- performance.timing 记录了开始导航到当前页面的时间，浏览器开始请求页面的时间、浏览器成功连接到服务器的时间等。

## Web Wrokers
使用Web Workers可以在后台异步执行JS，防止长时间运行的JS进程会导致浏览器"冻结"用户页面。IE10+支持，暂时没有想到应用场景，待后续研究。p718