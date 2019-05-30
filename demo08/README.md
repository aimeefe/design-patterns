# 职责链模式

一系列可能会处理请求的对象被连成一条链，请求在这些对象（节点）之间依次传递，直到遇到一个可以处理它的对象。

## 生活场景

期末考试，有个不老实的学生，考试被安排在第一排。遇到不回答的题目，就把题目编号写在小纸条上往后传递，坐在后面的同学如果也不会答，它就会把这个小纸条继续传给他后面的人

## 优点

请求发送者只需知道链中的第一个节点，从而弱化了发送者和一组接收者之间的强联系。

## 缺点

职责链使程序中多了一些节点对象，可能在某次传递中，大部分节点除了让请求传递下去之外并没有起到实质性的作用，从性能上考虑，要避免过长的职责链带来的性能损耗。

## 使用

###### demo：一个售卖手机的电商网站，经过分别缴纳500元定金和200元定金的两轮预定后，现在已经到了正式购买阶段。在正式购买后额规则如下：

###### 1. 已经支付过500元定金的用户会受到100元的优惠券，
###### 2. 200元的用户可以受到50元优惠券，
###### 3. 没有支付定金的没有优惠券，而且库存有限不一定保证能买到。

### 初始代码：

```JavaScript
const order = (orderType, pay, stock) => {
  //500 元定金购买模式
  if (orderType === 1) {
    // 如果支付过500定金，获得优惠券，否则将为普通购买
    if (pay) {
      console.log('500元定金预约，得到100优惠券');
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券');
      } else {
        console.log('手机库存不足');
      }
    }
  }
  // 200元定金购买模式
  else if (orderType === 2) {
    if (pay) {
      console.log('200元定金预约，得到50元优惠券');
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券');
      } else {
        console.log('手机库存不足');
      }
    }
  }
  // 普通购买
  else if (orderType === 3) {
    if (stock > 0) {
      console.log('普通购买，无优惠券');
    } else {
      console.log('手机库存不足');
    }
  }
}

// 测试结果
order(1, true, 500); //500元定金预约，得到100优惠券
```
> 分析：
>
> 上面这段代码虽然得到了正确结果，但是 order 函数非常臃肿难以维护

### 初级职责链重构

思路：把500元订单、200元订单、普通订单这三种购买模式分成 3 个节点函数，如果当前节点函数不符合规则就传递给下一个节点函数。

```JavaScript
// 500元定金订单
const order500 = (orderType, pay, stock) => {
  if (orderType === 1 && pay) {
    console.log('500元定金预约，得到100元优惠券');
  } else {
    //将请求传递给200元订单
    order200(orderType, pay, stock);
  }
}

// 200元定金订单
const order200 = (orderType, pay, stock) => {
  if (orderType === 2 && pay) {
    console.log('200元定金预约，得到50元优惠券');
  } else {
    //将请求传递给普通订单
    orderNormal(orderType, pay, stock);
  }
}

// 普通订单
const orderNormal = (orderType, pay, stock) => {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
}

// 测试结果
order500(1, true, 500); //500元定金预约，得到100元优惠券
order500(1, false, 500); //普通购买，无优惠券
order500(2, true, 500); //200元定金预约，得到50元优惠券
order500(3, false, 0); //手机库存不足
```

> 分析：
>
> 职责链重构的代码看起来结构清晰了很多，把一个大函数拆成了3个小函数，去掉了很多嵌套的条件分支语句。
>
> 但是这种写法比较僵硬，传递请求的代码被耦合在了业务函数中，如果某天需要删除或增加某个节点就得先砸烂这跟链条重新组装



### 灵活可拆分的职责链重构 

目标：让链中的各个节点可以灵活拆分和重组。

思路：
1. 定义节点函数，如果某个节点不能处理请求，就返回一个特定字符串'nextSuccessor'来标识该请求需要继续往后面传递
2. 定义构造函数 chain，包含指定链中下一个节点、传给请求给节点
3. 把3个节点函数分别包装成职责链节点并指定节点在职责链中的顺序

###### 定义节点函数，如果某个节点不能处理请求，就返回一个特定字符串'nextSuccessor'来标识该请求需要继续往后面传递

```JavaScript

  // 500元定金订单
const order500 = (orderType, pay, stock) => {
  if (orderType === 1 && pay) {
    console.log('500元定金预约，得到100元优惠券');
  } else {
    //不知道下一个节点是谁，反正把请求往后传递
    return 'nextSuccessor';
  }
}

// 200元定金订单
const order200 = (orderType, pay, stock) => {
  if (orderType === 2 && pay) {
    console.log('200元定金预约，得到50元优惠券');
  } else {
    //不知道下一个节点是谁，反正把请求往后传递
    return 'nextSuccessor';
  }
}

// 普通订单
const orderNormal = (orderType, pay, stock) => {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
}
```

###### 定义职责链构造函数 chain，包含指定链中下一个节点、传给请求给节点

```JavaScript

class Chain {
  constructor(fn) {
    this.fn = fn; //需要被包装的函数
    this.successor = null; //链中的下一个节点
  }

  // 指定链中的下一个节点
  setNextSuccessor(successor) {
    return this.successor = successor;
  }

  // 传递请求给某个节点
  passRequest() {
    // 符合规则的情况处理
    const ret = this.fn.apply(this, arguments); 
    
    // 不符合规则的情况处理
    if (ret === 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    }

    return ret;
  }
}

```

###### 把3个节点函数分别包装成职责链节点并指定节点在职责链中的顺序

```JavaScript
// 将函数包装进责任链节点
const chainOrder500 = new Chain(order500);
const chainOrder200 = new Chain(order200);
const chainOrderNormal = new Chain(orderNormal);

// 指定节点在职责链中的顺序
chainOrder500
  .setNextSuccessor(chainOrder200)
  .setNextSuccessor(chainOrderNormal);
 
```

###### 测试结果

```JavaScript
chainOrder500.passRequest(1, true, 500); //500元定金预约，得到100元优惠券
chainOrder500.passRequest(1, false, 500); //普通购买，无优惠券
chainOrder500.passRequest(2, true, 500); //200元定金预约，得到50元优惠券
chainOrder500.passRequest(3, false, 0); //手机库存不足
```

### 用 APO 重构职责链

利用JavaScript函数式特性，有更方便的方法来创建职责链，基于上例中的三个节点函数，来改下下这个demo。

```JavaScript
// 利用JavaScript函数式特性，来创建职责链
Function.prototype.after = function (fn) {
  const self = this;
  return function () {
    const ret = self.apply(this, arguments);
    if (ret === 'nextSuccessor') {
      return fn.apply(this, arguments);
    }
    return ret;
  }
}

let order = order500.after(order200).after(orderNormal);

// 测试
order(1, true, 500); //500元定金预约，得到100元优惠券
order(1, false, 500); //普通购买，无优惠券
order(2, true, 500); //200元定金预约，得到50元优惠券
order(3, false, 0); //手机库存不足
```


## 总结

职责链可以很好的帮我们管理飞马，降低发送请求的对象和处理请求的对象之间的耦合性。职责链中的节点数量和顺序是可以自由变化的，我们可以在运行时决定链子中包含哪些节点。 
