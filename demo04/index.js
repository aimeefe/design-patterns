/**************** 代理模式的实现 ****************/

// 晓明拜托 B 在 A 心情好的时候送花给 A
/*
class Flower {}

const xiaoming = {
  sendFlower: (target) => {
    const flower = new Flower();
    target.receiverFlower(flower);
  }
}

const A = {
  receiverFlower: (flower) => {
    console.log('收到花' + flower);
  },
  listenGoodMood: (fn) => {
    setTimeout(() => fn(), 5000)
  }
}

const B = {
  receiverFlower: (flower) => {
    A.listenGoodMood(() => {
      A.receiverFlower(flower);
    })
  }
}

xiaoming.sendFlower(B);
*/

/**************** demo01 虚拟代理和预加载  ****************/
/*
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
*/

/* 对外是一个函数
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
*/


/**************** demo02 虚拟代理合并http请求  ****************/
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

/**************** demo03 缓存代理 计算  ****************/
/*
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


let proxyMult = createProxyFactory(mult);
console.log(proxyMult(1, 2, 3, 4)) //24
console.log(proxyMult(1, 2, 3, 4, 5)) //120
console.log(proxyMult(1, 2, 3, 4)) //24
console.log(proxyMult(1, 2, 3, 4)) //24
*/