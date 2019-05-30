# 装饰者模式

装饰者模式是在不改变其原有结构和功能的基础上，给对象动态的增加新的功能。

## 特点

装饰者模式将一个对象嵌入另一个对象之中，形成一条包装链。请求随着这条链依次传递到所有对象，使每个对象都有处理这条请求的机会。

## 装饰者模式 VS 适配器模式

两者都是通过封装对象来实现设计的目的，区别在于：

- 适配器模式：由于数据格式等原因导致代码无法使用了，需要适配器转换成可用代码，比如电源适配器等。

- 装饰者模式：原有功能在正常使用，只是在原有功能的基础上再装饰一下使其更完美，比如手机壳等。


## 面向对象中的装饰者

###### demo01 飞机大战游戏中，随着经验值的增加，飞机也升级成了更厉害的飞机，一开始这些飞机只能发射普通子弹，升到第二级时发射导弹，第三级时可以发射原子弹

```
// 原始
var Plane = function () {}
Plane.prototype.fire = function () {
  console.log('发射普通子弹');
}

// 添加装饰
var MissileDecorator = function (plane) {
  this.plane = plane;
}
MissileDecorator.prototype.fire = function () {
  this.plane.fire();
  console.log('发射导弹');
}

var AtomDecorator = function (plane) {
  this.plane = plane;
}
AtomDecorator.prototype.fire = function () {
  this.plane.fire();
  console.log('发射原子弹');
}
```

测试：

```
var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
plane.fire(); // 依次输出：发射普通子弹，发射导弹，发射原子弹
```

> 分析:
>
> 导弹类和原子弹类的构造函数都接受参数 plane 对象，并且保存好这个参数，在他们的 fire 方法中，除了执行自身的操作之外，还调用 plane 对象的 fire 方法。
>
> 这种给对象动态增加职责的方式，并没有真正改动对象自身，而是将对象放入另一个对象之中，这些对象以一条链的方式进行引用，形成一个聚合对象，这些对象都拥有相同接口（fire），当请求达到链中的某个对象时，这个对象会执行自身操作，随后把请求发给链中的下一个对象。

## JavaScript 的装饰者

```
// 原始
const plane = {
  fire: () => {
    console.log('发射普通子弹');
  }
}

const missileDecorator = () => {
  console.log('发射导弹');
}

const atomDecorator = () => {
  console.log('发射原子弹');
}

const fire1 = plane.fire;
plane.fire = () => {
  fire1();
  missileDecorator();
}

const fire2 = plane.fire;
plane.fire = () => {
  fire2();
  atomDecorator();
}
plane.fire(); //依次输出：发射普通子弹，发射导弹，发射原子弹
```

## 装饰函数

装饰者模式可以让我们在不改变函数源代码的情况下，给函数增加功能。

我们可以把行为依照职责分成粒度更细的函数，随后通过装饰者把它们合并在一起，有助于我们编写一个送耦合和高复用性的系统。

###### demo01 登录功能：验证和发送请求隔离开来

```
// 插件式表单验证：验证和提交隔离开来

Function.prototype.before = function (beforefn) {
  var _self = this;
  return function () {
    if (beforefn.apply(this, arguments) === false) {
      //beforefn 返回 false 的情况直接 return, 不再执行后面的原函数
      return;
    }
    return _self.apply(this, arguments);
  }
}

const form = document.querySelector('#form');

// 验证
const validata = function () {
  if (!form.username.value) {
    alert('name is required!');
    return false;
  }
  if (!form.password.value) {
    alert('password is required!');
    return false;
  }
}


// 原始
var formSubmit = function () {
  var params = {
    username: form.username.value,
    password: form.password.value
  }
  console.log(params);
  console.log('发送请求...');
  // TODO 准备发送 post 请求
  // Axios.post(...)
}

// 装饰者
var formSubmit = formSubmit.before(validata);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSubmit();
})
```

> 分析：
>
> 上例中，校验输入和提交表单完全分离开来，他们不再有任何耦合关系，formSubmit = formSubmit.before(validata) 这句代码，如同把校验规则动态接在 formSubmit 函数之前， validata 成为了一个即插即用的函数，它甚至可以写成配置文件的形式，这有利于我们分开维护这两个函数。
 
