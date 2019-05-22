# this、call、apply

## this

JavaScript 中，this 总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而不是函数被声明时的环境。

### this 的指向

this 的指向大致可以分为以下4种：

- 作为对象的方法调用
- 作为普通函数调用
- 构造器调用
- Function.prototype.call 或 Function.prototype.apply 调用

#### 作为对象的方法调用

当函数作为对象的方法被调用时，this 指向该对象，如：

```
var obj = {
  a: 1,
  getA: function () {
    console.log(this === obj);  //true
    console.log(this.a);  //1
  }
}
obj.getA();

```
### 作为普通函数调用

作为普通函数调用时：

- 非严格模式：this 指向全局对象
- 严格模式：this 指向 undefined

```
name = 'globalName';

var myObject = {
  name: 'sven',
  getName: function () {
    return this.name;
  }
};

var getName = myObject.getName;
console.log(getName()); //globalName
```

> 分析：
>
> 当调用 myObject.getName 时，getName 是作为 obj 对象的属性被调用的，此时 this 指向 obj 对象，所以 myObject.getName() 输出 'sven'。
>
>当用另一个变量 getName 来引用 myObject.getName 时，调用 getName()，此时是普通函数调用的方式，this 指向全局，因此结果是 globalName

### 构造器调用

当使用 new 运算符调用构造函数时，this 指向：

- 构造函数显示的 return 了一个 object 类型对象时：this 指向 return 的这个对象
- 构造函数没有显示的 return 一个对象或者 return 了一个非 object 类型对象时：this 指向返回的这个默认对象

```
/* 情况1：构造函数显示的 return 了一个 object 类型对象时 */
var MyClass = function () {
  this.name = 'sven';

  //显示的返回了一个对象
  return {
    name: 'anne'
  }
}
var obj = new MyClass();
console.log(obj.name); //anne

/* 情况2：构造函数显示的 return 了一个 非object 类型对象时 */

var MyClass = function () {
  this.name = 'sven';

  //显示的返回了一个非object类型的对象
  return  'anne'
}
var obj = new MyClass();
console.log(obj.name); //sven

/* 情况3：构造函数没有显示返回 */
var MyClass = function () {
  this.name = 'sven';
}
var obj = new MyClass();
console.log(obj.name); //sven
```

### call、apply 调用

call、apply 可以动态改变传入函数的 this，this 指向 call、apply 传入的第一个参数

```
var obj1 = {
  name: 'sven',
  getName: function () {
    return this.name;
  }
}
var obj2 = {
  name: 'anne'
}
console.log(obj1.getName()); //sven
console.log(obj1.getName.call(obj2)); //anne
```

-----------------------------

## Function.prototype.call 或 Function.prototype.apply

### 区别

call、apply 的区别在于传入参数的形式不同：

apply 接受两个参数，第一个参数指定了函数体内 this 对象的指向，第二个参数为一个带下标的数组或类数组。

```
//如果第一个参数传入 null 时，函数体内的 this 会指向默认宿主对象
func.apply(null, [1, 2, 3])
```

call 接受的参数数量不固定，第一个参数也是指定了函数体内 this 对象的指向，从第二个参数开始往后，每个参数被依次传入函数

```
func.call(null, 1, 2, 3, 4)
```

### 用途

- 改变函数内部 this 指向

- 借用其他对象方法

#### 借用其他对象方法

##### 场景1：借用构造函数

```
var A = function (name) {
  this.name = name;
}
var B = function () {
  A.apply(this, arguments);
}
B.prototype.getName = function () {
  return this.name;
}
var b = new B('sven');
console.log(b.getName()); //sven
```

##### 场景2：像数组一样操作类数组

```
(function () {
  console.log(arguments); //[1, 2]
  Array.prototype.push.call(arguments, 3);
  console.log(arguments); //[1, 2, 3]
})(1, 2)
```
