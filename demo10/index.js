// 装饰者模式


/************************* 面向对象语言中的装饰者 *************************/

/**
 * 飞机大战 - 飞机技能升级
 */
/* 原始
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

var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
plane.fire(); //依次输出：发射普通子弹，发射导弹，发射原子弹
*/

/************************* JavaScript 的装饰者 *************************/
/**
 * 飞机大战 - 飞机技能升级
 */
/*
 原始
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
*/

/************************* 装饰函数 *************************/
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