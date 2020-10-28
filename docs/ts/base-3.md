# 3. 类



ts除了实现所有ES6中的类功能外，还添加了一些新的方法

## 类(class)相关概念
- 类(class)：对事物的抽象，包含属性和方法
- 对象(Object)：类的实例，通过 `new` 生成
- 面向对象的三大特性：封装、继承、多态
  - 封装(Encapsulation)：将对数据操作细节隐藏，只暴露对外接口。只能通过暴露的接口来访问对象，而不能任意更改对象内部的数据
  - 继承(Inheritance)：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
  - 多态(Polymorphism)：有了继承才有多态，在调用类实例方法的时候，尽量把变量视作父类类型，这样，所有子类类型都可以正常被接收
- setter或getter：用来改变属性的读取和赋值行为
- 修饰符：修饰符是一些关键字，用于限定成员或类的性质，如 `public` 表示公有属性或方法
- 抽象类(Abstract Class)：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现。
- 接口(Interfaces)：不同类之间公有的属性或方法，可以抽象为一个接口。接口可以被类实现(implements)。一个类只能继承自另一个类，但可以实现多个接口。

## ES6+中类的用法
```js
// 属性和方法
class Animal {
  constructor(name) {
    this.name = name
  }
  sayHi() {
    return `My name is ${this.name}`
  }
}

// 类的继承
class Cat extends Animal {
  constructor(name) {
    super(name) // 调用父类的 constructor(name)
    console.log(this.name)
  }
  sayHi() {
    return `Cat, ` + super.sayHi() // 调用父类的sayHi
  }
}
let c = new Cat('Miao') // Miao
console.log(c.sayHi()) // Cat, My name is Miao

// setter 和 getter 
class Animal {
  constructor(name) {
    this.name = name
  }
  get name() {
    reutrn 'Jack'
  }
  set name(value) {
    console.log('setter: ' + value)
  }
}
let a = new Animal('kitty'); // setter: Kitty
a.name = 'TT' // setter: TT
console.log(a.name) // Jack

// 静态方法：可以通过类名直接调用的方法
class Animal {
  static isAnimal(a) {
    return a instanceof Animal
  }
}
let a = new Animal('jack')
Animal.isAnimal(a) //true
a.isAnimal(a) // Error: a.isAnimal is not a function

// 实例属性
class Animal {
  name = 'Jack' // 实例可以直接调用
  constructor() {

  }
}
let a = new Animal()
console.log(a.name) // Jack

// 静态属性，类可以直接调用的属性
class Animal {
  static num = 42
  constructor() {

  }
}
console.log(Animal.num) // 42
```

## TypeScript中类的用法
修饰符、抽象类等
### 访问修饰符public、private、protected
TypeScript 可以使用三种访问修饰符，分别是：public，private, protected
- public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是public的
- private 修饰的属性或方法是私有的，不能在声明它的类的外部使用，包括子类
- protected 修饰符是受保护的，和private类似，区别是它在子类中是允许被访问的。

#### private、protected属性示例
```js
// 示例1
class Animal {
  public name;
  public constructor(name) {
    this.name = name
  }
}
let a = new Animal('Jack')
console.log(a.name) // Jack
a.name = 'Tom'
console.log(a.name) // Tom

// 示例2
class Animal {
  private name;
  // protected name;
  public constructor(name) {
    this.name = name
  }
  get getName() {
    return this.name
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name)
    console.log('cat', name)
  }
  get catName() {
    return this.name
  }
}
let a = new Animal('Jack')
console.log(a.getName) // Jack
console.log(a.name) // Error
a.name = 'Tom' // Error
// Property 'name' is private and only accessible within class 'Animal'.

let ce = new Cat('xx')
console.log(ce.name) // Error 不管是protected还是private
console.log(ce.catName) // protected name 则ok，private name 则Error
```
#### private、protected用来修饰构造函数
当构造函数修饰为 private 时，该类不允许被继承或者实例化
```js
class Animal {
    public name;
    private constructor (name) {
        this.name = name;
  }
}
class Cat extends Animal { // Error 继承
    constructor (name) {
        super(name);
    }
}

let a = new Animal('Jack'); // Error 实例化
```
当构造函数修饰为 protected 时，该类只允许被继承
```js
class Animal {
    public name;
    protected constructor (name) {
        this.name = name;
  }
}
class Cat extends Animal { // OK
    constructor (name) {
        super(name);
    }
}

let a = new Animal('Jack'); // Error
```
#### 在构造函数参数中使用修饰符
等同于类中定义该属性，使代码更简洁
```js
class Animal {
    // public name: string;
    public constructor (public name) {
        this.name = name;
    }
}
```

### 只读属性关键字readonly
```js
class Animal {
    readonly name;
    public constructor(name) {
        this.name = name;
    }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom'; // Error
```
如果readonly和其他访问修饰符一起使用，需要写在其后面。
```js
class Animal {
    // public readonly name;
    public constructor(public readonly name) {
        this.name = name;
    }
}
```
### 抽象类(abstract)
abstract 用于定义抽象类和其中的抽象方法
#### 抽象类是不允许被实例化的
```js
abstract class Animal { // 抽象类
    public name; 
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi(); // 抽象方法
}

let a = new Animal('Jack'); // Error 不允许被实例化
```
#### 抽象类中的抽象方法必须被子类实现
```js
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}

class Cat extends Animal { // Error，子类没有实现抽象方法
    public eat() {
        console.log(`${this.name} is eating.`);
    }
}

let cat = new Cat('Tom');
```

#### 正确示例
注意 TypeScript的编译结果中，仍然存在这个抽象类
```js
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}

class Cat extends Animal {
    public sayHi() {
        console.log(`Meow, My name is ${this.name}`);
    }
}

let cat = new Cat('Tom');
```
### 类类型
```js
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name
  }
  sayHi(): string {
    return `My name is ${this.name}`
  }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()) // My name is Jack
```