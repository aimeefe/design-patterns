# 代理模式

为一个对象提供一个代用品或占位符，以便控制对它的访问。

JavaScript 中常用的代理有虚拟代理和缓存代理：

- 虚拟代理：把一些开销很大的对象，延迟到真正需要他的时候才去创建。

- 缓存代理：可以为一些开销大的运算结果提供暂时存储，下次运算时如果传进来的参数和之前一致，则直接返回前面存储的运算结果。

## 场景
- 预加载（虚拟代理）
- 合并 HTTP 请求（虚拟代理）
- 惰性加载（虚拟代理）
- 缓存（缓存代理）

## 虚拟代理和预加载

关键点：保持本体和代理对外接口的一致性，这样可以保证在任何使用本体的地方都可以替换成代理。

###### demo 图片加载好之前，设置一张 loading 占位图来提示用户图片正在加载。

```
// 本体
const myImage = (() => {
  let img = document.createElement('img');
  document.body.appendChild(img);

  return {
    setSrc: src => img.src = src
  }
})()


// 引入代理
const proxyImage = (() => {
  const img = new Image();
  img.onload = function () {
    myImage.setSrc(this.src);
  }
  return {
    setSrc: src => {
      myImage.setSrc('./loading.gif');
      img.src = src;
    }
  }
})()

// 使用
// myImage.setSrc('http://pic1.win4000.com/wallpaper/3/59914c7b38b18.jpg');
proxyImage.setSrc('http://pic1.win4000.com/wallpaper/3/59914c7b38b18.jpg');
```
> 分析：
>
> 代理的作用: 代理 proxyImage 负责加载图片，预加载操作完成后，把请求重新交给本体 myImage
>
> 这么做的好处：将img节点设置src的功能和预加载这两个功能解耦，使得他们可以各自变化而不影响对方。

另外：

如果代理对象和本体对象对外都是一个函数，函数必然都能被执行，则认为他们也具有一致性的接口，如下：

```
// 本体
const myImage = (() => {
  let img = document.createElement('img');
  document.body.appendChild(img);
  
  return src => img.src = src;
})()


// 引入代理
const proxyImage = (() => {
  const img = new Image();
  img.onload = function () {
    myImage(this.src);
  }
  
  return src => {
    myImage('./loading.gif');
    img.src = src;
  }
})()

// 使用
proxyImage('http://pic1.win4000.com/wallpaper/3/59914c7b38b18.jpg');
```

## 虚拟代理合并 HTTP 请求










## 总结

项目中，不需要预先猜测是否需要使用代理，真正发现不方便直接访问某个对象的时候，再编写代理也不迟。
