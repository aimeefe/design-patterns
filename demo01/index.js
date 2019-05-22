/************ 作为对象的方法调用 ************/
/*
var obj = {
  a: 1,
  getA: function () {
    console.log(this === obj);  //true
    console.log(this.a);  //1
  }
}
obj.getA();
*/



/************ 作为普通函数调用 ************/
/*
name = 'globalName';

var myObject = {
  name: 'sven',
  getName: function () {
    return this.name;
  }
};

var getName = myObject.getName;
console.log(getName()); //globalName
*/



/************ 构造器调用 ************/
// 情况1：构造函数显示的 return 了一个 object 类型对象时
/*
var MyClass = function () {
  this.name = 'sven';

  //显示的返回了一个对象
  return {
    name: 'anne'
  }
}
var obj = new MyClass();
console.log(obj.name); //anne
*/

// 情况2：构造函数显示的 return 了一个 非object 类型对象时
/*
var MyClass = function () {
  this.name = 'sven';

  //显示的返回了一个非object类型的对象
  return  'anne'
}
var obj = new MyClass();
console.log(obj.name); //sven
*/

// 情况3：构造函数没有显示返回
/*
var MyClass = function () {
  this.name = 'sven';
}
var obj = new MyClass();
console.log(obj.name); //sven
*/


/************ call、apply ************/
/*
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
*/


/************ call、apply的用处 ************/
// 借用构造函数
/*
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
*/

(function () {
  console.log(arguments); //[1, 2]
  Array.prototype.push.call(arguments, 3);
  console.log(arguments); //[1, 2, 3]
})(1, 2)