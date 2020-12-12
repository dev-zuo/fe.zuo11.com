---
title: 23. JSON - JS高程4
description: 曾经 XML 是互联网上传送结构化数据的事实标准，但后来出现的 JSON 被认为在 JS 中读写结构化数据更好、更方便，现在普遍用 JSON 来传输数据。需要注意的是 JSON 是一种数据格式，不是编程语言。
keywords: JSON格式
---

# 23. JSON

曾经 XML 是互联网上传送结构化数据的事实标准，但后来出现的 JSON 被认为在 JS 中读写结构化数据更好、更方便，现在普遍用 JSON 来传输数据。需要注意的是 JSON 是一种数据格式，不是编程语言。

## 语法
JSON的语法可以表示三种类型的值:
- `简单值` 字符串、数值、布尔值 和 null，**不支持undefined**， JSON 表示数值: 5 ，JSON表示字符串: "Hello world!", JSON 字符串与普通字符串的最大区别在于，**JSON字符串必须使用双引号，单引号会导致语法错误**。
- `对象` 无序的键值对
- `数组` 有序的列表

```js
let Person = {
  name: "guoqzuo",
  age: 29
}
// 上面是js字面量写法，JSON格式的的属性名如果是字符串，需要用 ""包裹，如下：
let jsonStr = {
  "name": "guoqzuo",
  "age": 29
}

let values = [25, "hi", true];
```

## 解析与序列化
JSON 之所以流行，其中一个重要的原因是可以把 JSON 数据结构解析为可用的 JS 对象。IE8+ 支持
### JSON.stringify()
- JSON.stringify(value, replacer, space) 可以将 JS 对象，序列化为 JSON 字符串。
  - 1 参，最常见的用法，输出的 JSON 字符串不包括任何空格和缩进
  - 2 参，过滤器，可以是一个数组，可以是一个函数。当第二个参数为数组，序列化时只会输出数组里的属性，其他属性会跳过。当第二个参数为函数，可以对指定的属性的值进行修改
  - 3 参，第三个参数用于控制结果中的缩进和空白符, 可以是 Number 数字，也可以是字符串。当第三个参数为数字，表示字符串每个级别缩进的空格数, 如果大于10，会自动转为10。当第三个参数为字符串，会用对应的字符串代替缩进的空格。限制字符长度为10，超过10的字符，不会出现。会被忽略
- 使用 JSON.stringify() 时，默认会调用对象的 toJSON() 方法，重写该方法，可以修改对象序列化的默认行为
- JSON.stringify() 执行顺序
  - (1) 如果对象中存在 toJSON 方法，且能通过它获取有效的值，则调用该方法，返回对应的值用于下一步，否则返回对象本身。
  - (2) 如果提供了第二个参数，根据对应的参数过滤第 (1) 步得到的值
  - (3) 对第 (2) 步返回的每个值进行进行相应的序列化
  - (4) 如果提供了第三个参数，执行相应的格式化

```js
let book = {
  title: "JS",
  authors: [
    "N.C"
  ],
  edition: 3,
  year: 2011
};

// 1.一参，普通用法
let jsonText = JSON.stringify(book) // 输出的JSON字符串不包括任何空格和缩进
console.log(jsonText) 
// {"title":"JS","authors":["N.C"],"edition":3,"year":2011} 

// 2.二参, 过滤器，可以是一个数组，可以是一个函数
// 2.1 当第二个参数为数组，序列化时只会输出数组里的属性，其他属性会跳过
let jsonText = JSON.stringify(book, ["title", "edition"])
console.log(jsonText) // {"title":"JS","edition":3} 

// 2.2 当第二个参数为函数，可以对指定的属性的值进行修改
let jsonText = JSON.stringify(book, function(key, value) {
  switch (key) {
    case "authors":
      return value.join(',');
      break;
    case "year":
      return 5000;
      break;
    case "edition":
      return undefined; // 如果返回undefined，这个值会被忽略，不会序列化输出
      break;
    default:
      return value;
  }
})
console.log(jsonText) // {"title":"JS","authors":"N.C","year":5000}

// 3. 三参 第三个参数用于控制结果中的缩进和空白符, 可以是Number数字，也可以是字符串
// 3.1 当第三个参数为数字，表示字符串每个级别缩进的空格数, 如果大于10，会自动转为10
let jsonText = JSON.stringify(book, null, 4);
console.log(jsonText);
// 打印结果
//"{
//    "title": "JS",
//    "authors": [
//        "N.C"
//    ],
//    "edition": 3,
//    "year": 2011
//}"

// 3.2 当第三个参数为字符串，会用对应的字符串代替缩进的空格。限制字符长度为10，超过10的字符，不会出现。会被忽略
let jsonText = JSON.stringify(book, null, '--');
console.log(jsonText);
// 打印如下
// "{
// --"title": "JS",
// --"authors": [
// ----"N.C"
// --],
// --"edition": 3,
// --"year": 2011
// }"

// 4. toJSON(), JSON.stringify(对象A)，如果对象A中定义了toJSON()方法会先执行该方法，
let book2 = {
  title: "JS",
  authors: [
    "N.C"
  ],
  edition: 3,
  year: 2011,
  toJSON: function() {
    return this.title
  }
};
let jsonText2 = JSON.stringify(book2);
console.log(jsonText2); // "JS"
// JSON.stringify()执行顺序
// (1) 如果对象中存在toJSON方法，且能通过它获取有效的值，则调用该方法，返回对应的值用于下一步，否则返回对象本身。
//（2）如果提供了第二个参数，根据对应的参数过滤第(1)步得到的值
// (3) 对第(2)步返回的每个值进行进行相应的序列化
// (4) 如果提供了第三个参数，执行相应的格式化
let book3 = {
  title: "JS",
  authors: [
    "N.C"
  ],
  edition: 3,
  year: 2011,
  toJSON: function() {
    return {
      "a": 2,
      "b": 3
    }
  }
};
let jsonText3 = JSON.stringify(book3, ["a"]);
console.log(jsonText3); // {"a":2}

```
### JSON.parse()
- JSON.parse() 可以将 JSON 字符串解析为原生 JS 值，可以使用二参的函数对 parse 的结果进行自定义
```js
// JSON.parse中传入的字符串对象名是单引号会出错
JSON.parse("{'k':2}") // Uncaught SyntaxError: Unexpected token ' in JSON at position 1
JSON.parse('{"k":2}') // 解析正确 {"k": 2}

let book = {
  title: "JS",
  authors: [
    "N.C"
  ],
  edition: 3,
  year: 2011,
  releaseDate: new Date(2011,11,1)
};
let jsonText = JSON.stringify(book);
// "{"title":"JS","authors":["N.C"],"edition":3,"year":2011,"releaseDate":"2011-11-30T16:00:00.000Z"}"

// 自定义解析规则
let bookCopy = JSON.parse(jsonText, function(key, value) {
  if (key === "releaseDate") { // 如果不进行此操作，那么parse后Date返回的是字符串不是Date对象
    return new Date(value)
  } else {
    return value
  }
})
console.log(bookCopy)
```
