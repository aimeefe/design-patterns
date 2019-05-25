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

```JavaScript
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

```JavaScript
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

同步功能：列表中每条数据，当我们选中某条数据的 checkbox 的时候，对应的文件就会被同步到另一台备用服务器上，如果点击频率过快，频繁的网络请求将会给服务器带来相当大的开销，因此设置一个代理来收集一段时间内的请求，最后一次性发给服务器，这样可以大大的减轻了服务器压力，如下：

```JavaScript
// 本体
const syncFile = id => {
  console.log(`开始同步文件，id 为 ${id}`);
}

// 代理
const proxySyncFile = (() => {

  let cache = [], // 保存一段时间内需要同步的ID
    timer; //定时器

  return id => {
    cache.push(id);

    // 保证不会覆盖已经启动的定时器
    if (timer) return;
    timer = setTimeout(() => {
      // 2秒后向本体发送需要同步的 ID 集合
      syncFile(cache.join(','));
      // 清除定时器
      clearTimeout(timer);
      timer = null;
      // 清空 ID 集合
      cache.length = 0;
    }, 2000)
  }
})()

// 使用
const checkboxs = document.querySelectorAll('input');

for (let i of checkboxs) {
  i.addEventListener('click', function () {
    if (this.checked) {
      proxySyncFile(i.id);
    }
  })
}
```

## 虚拟代理和惰性加载

## 缓存代理

###### demo 计算

```JavaScript
// 创建缓存代理工厂
const createProxyFactory = fn => {
  let cache = {};
  return function () {
    let args = [].join.call(arguments, ',');
    
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = fn.apply(this, arguments);
  }
}

// 计算乘积
const mult = function () {
  console.log('----- 开始计算乘积 ----');
  let a = 1;
  for (let i = 0; i < arguments.length; i++) {
    a = a * arguments[i];
  }
  return a;
}

// 使用
let proxyMult = createProxyFactory(mult);

console.log(proxyMult(1, 2, 3, 4)) //24
console.log(proxyMult(1, 2, 3, 4, 5)) //120
console.log(proxyMult(1, 2, 3, 4)) //24
console.log(proxyMult(1, 2, 3, 4)) //24

```
> 分析
>
> 打印的结果依次为：
> - ----- 开始计算乘积 ----
> - 24
> - ----- 开始计算乘积 ----
> - 120
> - 24
> - 24
>
> 由上可以看出，当再次传入相同参数时，缓存代理会直接返回之前所保存的响应的结果，不需要通过本体重复计算。


## 总结

项目中，不需要预先猜测是否需要使用代理，真正发现不方便直接访问某个对象的时候，再编写代理也不迟。
