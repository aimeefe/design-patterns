# 发布-订阅模式

又称观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

## 实现一个通用的发布-订阅模式模板

- 首先制定好谁充当发布者
- 然后给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者
- 最后发布消息的时候，发布者会遍历这个缓存列表，一次触发里面存放的订阅者回调函数

代码如下：

```JavaScript
// 发布者
const event = {
  clientList: [],

  // 收集订阅
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    //订阅的消息添加到缓存列表
    this.clientList[key].push(fn); 
  },

  // 触发订阅
  trigger: function () {
    const key = [].shift.call(arguments);
    const fns = this.clientList[key];

    if (!fns || fns.length === 0) {
      return false;
    }

    for (fn of fns) {
      fn.apply(this, arguments);
    }
  },

  // 移除订阅事件
  remove: function (key, fn) {
    const fns = this.clientList[key];

    // 如果 key 对应的消息没有被订阅，则直接返回
    if (!fns) {
      return false;
    }

    if (!fn) {
      //如果没有传入具体的回调函数，标识需要取消 key 对应消息的所有订阅
      fns && (fns.length = 0)
    } else {
      // 删除订阅者的回调函数
      fns.forEach((value, key) => {
        if (value === fn) {
          fns.splice(key, 1);
        }
      });
    }
  }
}

// 定义 installEvent，它可以给所有对象动态安装发布 - 订阅功能
const installEvent = obj => {
  for (let i in event) {
    obj[i] = event[i];
  }
}
```

🍃基于上面模板，来实现几个例子：

###### demo01：小明等人去售楼处买房，但是到了售楼处被告知已售罄，销售人员告诉他不久后还有一些尾盘推出，开发商正在办理手续，手续好后便可购买，但是具体什么时候不清楚，小明在离开前，把电话号码留在了售楼处，销售人员答应他新楼盘一推出马上发消息给他们，他们的电话号码被记在售楼处的发名册上，新楼盘推出的时候，销售人员会翻开花名册，遍历上面的电话号码，依次发送一条短信来通知他们。

```JavaScript

// 给售楼处对象 salesOffices 动态添加发布-订阅功能
const salesOffices = {};
installEvent(salesOffices);

// 订阅者，监听发布者消息
salesOffices.listen('squareMeter88', fn1 = price => {
  console.log(`fn1:88平米价格：${price}`);
})
salesOffices.listen('squareMeter100', fn2 = price => {
  console.log(`fn2:100平米价格：${price}`);
})
salesOffices.listen('squareMeter100', fn3 = price => {
  console.log(`fn3:100平米价格：${price}`);
})

// fn1、fn2 不想买房子了，发布者可以取消他们的订阅
salesOffices.remove('squareMeter88', fn1); //移除fn1的订阅
salesOffices.remove('squareMeter100', fn3); //移除fn3的订阅

// 发布者开始发送消息
salesOffices.trigger('squareMeter100', 3000000); //fn2:100平米价格：3000000
```

###### demo02：商城开发，网站里的 header 头部、nav 导航等模块在渲染的时候需要请求后端接口数据拿到用户的登录信息，然后根据信息来渲染各自的模块。

```JavaScript
// 注册 login 发布者
const login = {};
installEvent(login);

const btn = document.querySelector('#btn');


// 模拟登录，登录成功后，发布登录成功的消息
btn.addEventListener('click', () => {
  console.log('登录成功');
  login.trigger('loginSuc', {
    avatar: 'http://img.qqzhi.com/uploads/2019-04-03/060633745.jpg'
  });
})


// 各模块监听登录成功的消息
const header = (() => {
  login.listen('loginSuc', data => {
    header.setAvatar(data.avatar);
  })
  return {
    setAvatar: avatar => {
      console.log(`头像数据：${avatar}`)
    }
  }
})()

const nav = (() => {
  login.listen('loginSuc', data => {
    nav.setAvatar(data.avatar);
  })
  return {
    setAvatar: avatar => {
      console.log(`导航数据：${avatar}`)
    }
  }
})()
```

> 分析：
>
>当登录成功时，登录模块只需发布登录成功的消息，而业务方接收到消息后，就会开始进行各自的业务处理，登录模块不需要关心业务方究竟要做什么，也不用去了解他们的内部细节。如果有一天又有其他模块需要依赖登录信息，那么只需在那个模块里加上监听消息的方法即可，不需要再去修改登录部分的模块代码了。






