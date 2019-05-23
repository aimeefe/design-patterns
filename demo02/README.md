# 单例模式

确保只有一个实例，并提供全局访问

## 逻辑

用一个变量标识是否创建过对象，如果是，则下次直接返回这个已创建好的对象：

```
var obj;
if (!obj) {
  obj = xxx;
}
```

## 应用

- 降低全局变量带来的命名污染
- 惰性单例

## 降低全局变量带来的命名污染

### 使用命名空间

最简单的变化时使用字面量的方式，如：

```
var namespace1 = {
 a: function() { console.log(1) },
 b: function() { console.log(2) },
}
```
> 分析：
>
> 把a, b都定义为 namespace1 的属性，这样可以减少变量和全局作用域打交道的机会。

### 使用闭包封装私有变量

把一些变量封装在闭包内部，只暴露一些接口跟外界通信，如：

```
var user = (function () {
  var name = 'sven',
    age = 29;
  return {
    getUserInfo: function () {
      return `${name}-${age}`
    }
  }
})();
console.log(user.getUserInfo()); //sven-29
```
> 分析：
>
> name、age被封装在闭包产生的作用域中，外部是访问不到这两个变量的，可以避免全局命名污染

## 惰性单例

需要的时候才创建对象，并且只创建唯一一个。

通常我们会把`创建实例对象`的职责和`管理单例的职责`分别放在两个方法里，这两个方法可以独立变化互不影响，当他们连在一起的时候就完成了创建唯一实例对象的功能。

###### 抽出通用单例

```
var getSingle = function(fn) {
  var result;
  return function() {
    return result || (result = fn.apply(this, arguments));
  }
}
```

###### 应用举例: 创建唯一的一个iframe来加载图片

```
const createSingleIframe = getSingle(function () {
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  return iframe;
})

document.querySelector('#btn').addEventListener('click', function () {
  const layer = createSingleIframe();
  layer.src = "http://pic1.win4000.com/wallpaper/9/5450ae2fdef8a.jpg";
})
```




