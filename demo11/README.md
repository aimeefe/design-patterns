# 适配器模式

又叫包装器，是用一个新接口对现有接口进行包装，以解决他们之间不兼容的问题。

## 场景

- 期待的接口与现有提供的接口不兼容
- 数据格式转换

## 生活场景

两根垂直相交的水管连接处的直角弯管是一个适配器，它可以使两个不同方向的水管可以疏通流水。

## 应用

### 期待的接口与现有提供的接口不兼容

###### demo：向 googleMap 和 baiduMap 都发出显示的请求时，他们分别以各自的方式在页面中展示地图。

### 初始代码

```JavaScript

const googleMap = {
  show: () => console.log('开始渲染谷歌地图')
}

const baiduMap = {
  show: () => console.log('开始渲染百度地图')
}

const renderMap = map => {
  if (map.show instanceof Function) {
    map.show();
  }
}

renderMap(googleMap); //开始渲染谷歌地图
renderMap(baiduMap); //开始渲染百度地图
```

上面这段程序的关键是 googleMap 和 baiduMap 提供了一只的 show 方法，但是第三方的接口方法不在我们的控制内，假如百度提供的显示地图的方法不叫 show 而是 display 的话，上面那段代码就不灵了，正常情况下对于来源于第三方的对象，我们不该去改动它，因此我们可以通过适配器模式来解决它，如下：

### 适配器改写

```JavaScript
const googleMap = {
  show: () => console.log('开始渲染谷歌地图')
}

const baiduMap = {
  display: () => console.log('开始渲染百度地图')
}

//适配器处理接口不一致的问题
const baiduMapAdapter = {
  show: () => {
    return baiduMap.display();
  }
}

// 渲染
const renderMap = map => {
  if (map.show instanceof Function) {
    map.show();
  }
}

// 使用
renderMap(googleMap); //开始渲染谷歌地图
renderMap(baiduMapAdapter); //开始渲染百度地图
```

### 数据格式转换

###### demo：后端传递过来一串字母，而我们需要的是这串字母的倒叙并且大写以及附上标题

```
const data = 'abcdefg';

//适配器
const reverse = (data) => {
  let r = data.split('').reverse().join('').toUpperCase();
  return `sign - ${r}`;
}

const result = reverse(data);
console.log(result); //sign - GFEDCBA
```


