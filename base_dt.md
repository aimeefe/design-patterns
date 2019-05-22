# 多态

给不同的对象发送同一个消息的时候，这些对象会根据这个消息分别给出不同的反馈。

## 思想

将`做什么`和`谁去做以及怎样去做`分离开来，也就是将`不变的事物`与`可能改变的事物`分离开来。

## 作用

通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。

举例：实现一个地图应用，现在有两家可选地图 API 提供商供我们接入应用，如下：

```
var googleMap = {
   show: function() {
     console.log('开始渲染谷歌地图');
   }
};

var baiduMap = {
  show: function() {
    console.log('开始渲染百度地图');
  }
};

var renderMap = function(type) {
  if (type === 'google') {
    googleMap.show();
  } else if (type === 'baidu') {
    baiduMap.show();
  }
}

renderMap('google');  //开始渲染谷歌地图
renderMap('baidu');  //开始渲染百度地图

```
上面这个代码，如果我们替换成搜搜地图，那么就要改动 renderMap，继续添加条件判断语句。

我们先把程序中相同部分抽象出来，那就是显示某个地图：

```
var renderMap = function(map) {
  if (map.show instanceof Function) {
    map.show();
  }
}

renderMap(googleMap);  //开始渲染谷歌地图
renderMap(baiduMap);  //开始渲染百度地图

```
先找出这段代码的多态性。当我们像谷歌地图对象和百度地图对象分别发出“展示地图”的消息时，会分别调用他们的 show 方法，就会产生不同的执行结果。
对象的多态性可以让我们将`做什么`和`怎么做`分开，即使以后再添加其他类型的地图，renderMap 依然不需要做任何改变，如下：

```
//添加搜搜地图
var sosoMap = {
  show: function() {
    console.log('开始渲染搜搜地图');
  }  
}

renderMap(sosoMap);  //开始渲染搜搜地图
```

JavaScript 中，函数本身也是对象，它可以用来封装行为并被四处传递。当我们调用函数的时候，这些函数会返回不同的执行结果，这也是`多态性`的一种体现。

