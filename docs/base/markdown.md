# Markdown 基础语法
markdown语法学习笔记，来源 github 官方 markdown 教程，markdown文件后缀名一般为 `.md`，一般推荐使用 Typora 查看 markdown 文档

## badge 徽章
通过链接引入小的徽章图片，一般可以自定义
```markdown
[![](https://img.shields.io/travis/rust-lang/rust/master.svg#alt=Travis%20branch)]()
[![](https://img.shields.io/packagist/l/doctrine/orm.svg#alt=Packagist)]()
[![](https://img.shields.io/scrutinizer/coverage/g/phpmyadmin/phpmyadmin/master.svg#alt=Scrutinizer%20branch)]()
[![](https://img.shields.io/badge/zuoxiaobai-testBadge-orange.svg#alt=zuoxiaobai)]()
```
效果如下:

[![](https://img.shields.io/travis/rust-lang/rust/master.svg#alt=Travis%20branch)]()
[![](https://img.shields.io/packagist/l/doctrine/orm.svg#alt=Packagist)]()
[![](https://img.shields.io/scrutinizer/coverage/g/phpmyadmin/phpmyadmin/master.svg#alt=Scrutinizer%20branch)]()
[![](https://img.shields.io/badge/zuoxiaobai-testBadge-orange.svg#alt=zuoxiaobai)]()

From [Basic writing and formatting syntax](https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-text)

Create sophisticated formatting for your prose and code on GitHub with simple syntax.

## 标题(Headings)

需要在 # 字符后面加空格
```markdown
# 一级标题
## 二级标题
###### 最小层级标题
```
效果如下：

# 一级标题
## 二级标题
###### 最小层级标题

## 样式文本(Styling text)

- 粗体 **需要设置为粗体的文字**  

```markdown
**需要设置为粗体的文字**
```

- 斜体 *需要设置为斜体的文字*  

```markdown
*需要设置为斜体的文字*
```

- 删除线 ~~需要设置为删除线的文字~~  

```markdown
~~需要设置为删除线的文字~~
```

- 粗体里内置斜体 **粗体文字 *粗体里面的斜体* 粗体文字**  

```markdown
**粗体文字 *粗体里面的斜体* 粗体文字**
```


## 引用文本(Quoting text)
```markdown
> 需要引用的文本
```
> 需要引用的文本


## 引入代码块(Quoting code)
符号为数字 1 左边的字符, 后面跟语法高亮的语言类型
````markdown
```c
// 需要引入的代码块
const PI = 3.1415;
```
````
效果如下，如果是这个例子中的代码中引入代码块，使用 4 个 ```` 符号包裹代码块
```c
// 需要引入的代码块
const PI = 3.1415;
```

## 网页链接(Links)

文字链接格式：`[链接文字](点击链接，跳转的URL)`, 显示图片格式 `![图片alt内容，图片加载失败时占位文本]（图片链接）`

```markdown 
[zuo11.com](http://zuo11.com)
![zuo11.com logog](http://www.zuo11.com/images/logo.png)
```
效果如下
[zuo11.com](http://zuo11.com) 
![zuo11.com logog](http://www.zuo11.com/images/logo.png)

## 关联链接(Relative links)

链接到项目的其它文件 ，可以使用相对路径
```
[JS笔记](JS_Note/JS高程3学习笔记.md)
```
## 无序列表(unordered list)

每个子项 以 * 或 -开头
```
- list1
- list2
- list3
```
- list1
- list2
- list3

## 有序列表(order list)
```
1. list1
2. list2
```
1. list1
2. list2

## 任务列表(Task lists)

类似于checkbox，多选框效果
```js
- [x] 已完成的计划
- [ ] 待完成 1
- [ ] 待完成 2
- [x] 已完成的计划
- [ ] 待完成 1
- [ ] 待完成 2
```
效果如下

- [x] 已完成的计划
- [x] 待完成 1
- [ ] 待完成 2
- [x] 已完成的计划
- [x] 待完成 1
- [x] 待完成 2

## 提及某个人或team(@某个人或team)

对方会收到对应的通知
```markkdown
@github/support what do you think about these updates?

[@zuoxiaobai ](/zuoxiaobai) what do you think about these updates? 
```

## 引用一个issue或pull request

[具体示例](https://help.github.com/articles/autolinked-references-and-urls/)

## 表情
`:表情对应的字符:`
```
:truck: 
:+1: 
:fire:
```
效果如下：
:truck: 
:+1: 
:fire:

查看所有支持的表情: [emoji-cheat-sheet.com.](https://www.webpagefx.com/tools/emoji-cheat-sheet/)

## 忽略markdown格式

在前面加 \

## 表格
注意在表格开始时的上下都留空行，表格行与行之间不要留空行。
```
第一表头 | 第二表头
--- | ---
第一单元格内容 | 第二单元格内容
第一列内容 | 第二列内容
```

效果如下

| 第一表头 | 第二表头 |
| --- | --- |
| 第一单元格内容 | 第二单元格内容 |
| 第一列内容 | 第二列内容 |

