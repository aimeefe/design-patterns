// 实现一个发布-订阅
/*
// 定义售楼处
let salesOffices = {};
// 缓存列表，存放订阅者的回调函数
salesOffices.clientLsit = [];
// 增加订阅者，如果还没订阅过此类消息，订阅的消息添加到缓存列表
salesOffices.listen = function (key, fn) {
  if (!this.clientLsit[key]) {
    this.clientLsit[key] = [];
  }
  this.clientLsit[key].push(fn);
}
// 发布消息
salesOffices.trigger = function () {
  //取出消息类型
  const key = [].shift.call(arguments);
  // 取出该消息对应的回调函数集合
  const fns = this.clientLsit[key];
  if (!fns || fns.length === 0) {
    return false;
  }
  for (fn of fns) {
    fn.apply(this, arguments);
  }
}

// 测试
// 小明的订阅消息
salesOffices.listen('squareMeter88', price => {
  console.log(`价格=${price}`);
})

// 小红的订阅消息
salesOffices.listen('squareMeter110', price => {
  console.log(`价格=${price}`);
})

salesOffices.trigger('squareMeter88', 2000000);
salesOffices.trigger('squareMeter110', 3000000);
*/

/*************************** 通用发布-订阅模式的实现 ***************************/
const event = {
  clientList: [],

  // 收集订阅
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn); //订阅的消息添加到缓存列表
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


/********************** demo01 售楼通知 测试**********************/

/*
// 给售楼处对象 salesOffices 动态添加 发布-订阅 功能
const salesOffices = {};
installEvent(salesOffices);

// 订阅者
salesOffices.listen('squareMeter88', fn1 = price => {
  console.log(`fn1:88平米价格：${price}`);
})
salesOffices.listen('squareMeter100', fn2 = price => {
  console.log(`fn2:100平米价格：${price}`);
})
salesOffices.listen('squareMeter100', fn3 = price => {
  console.log(`fn3:100平米价格：${price}`);
})

salesOffices.remove('squareMeter88', fn1); //移除fn1的订阅
salesOffices.remove('squareMeter100', fn3); //移除fn3的订阅

salesOffices.trigger('squareMeter88', 2000000); //null
salesOffices.trigger('squareMeter100', 3000000); //fn2:100平米价格：3000000
*/


/********************** demo02 登录通知 测试**********************/

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