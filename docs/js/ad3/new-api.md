
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
