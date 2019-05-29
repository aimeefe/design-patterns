// 职责链模式


/**
 * demo 01
 * 一个售卖手机的电商网站，经过分别缴纳500元定金和200元定金的两轮预定后，现在已经到了正式购买阶段。
 * 在正式购买后，已经支付过500元定金的用户会受到100元的优惠券，200元的用户可以受到50元优惠券，没有支付定金的没有优惠券，而且库存有限不一定保证能买到。
 */
/******************** 初步代码 ********************/
/*
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

// 使用
order(1, true, 500); //500元定金预约，得到100优惠券
*/

/******************** 初级职责链重构 ********************/
/*
 * 这种初级写法的缺点：僵硬，传递请求的代码被耦合在了业务函数中，如果某天需要删除或增加某个节点就得先砸烂这跟链条重新组装
 */

/*
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
*/


/******************** 灵活可拆分的职责链节点 ********************/
/**
 * 目标：让链中的各个节点可以灵活拆分和重组
 * 思路：
 * 1. 把500元订单、200元订单、普通订单这三种购买模式分成 3 个节点函数，如果某个节点不能处理请求，就返回一个特定字符串'nextSuccessor'来标识该请求需要继续往后面传递
 * 2. 把定义构造函数 chain， 包含指定链中下一个节点、 传给请求给节点
 * 3. 把3个节点函数分别包装成职责链节点并指定节点在职责链中的顺序
 * 优点： 如果某天需要删除或增加某个节点时不用理会原来订单函数代码， 我们要做的只是增加一个节点， 然后重新设置链子中相关节点的顺序
 */


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

/*

// 定义构造函数 Chain
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
    const ret = this.fn.apply(this, arguments);

    if (ret === 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    }

    return ret;
  }
}

// 将函数包装进责任链节点
const chainOrder500 = new Chain(order500);
const chainOrder200 = new Chain(order200);
const chainOrder100 = new Chain(order100);
const chainOrderNormal = new Chain(orderNormal);

// 指定节点在职责链中的顺序
chainOrder500
  .setNextSuccessor(chainOrder200)
  .setNextSuccessor(chainOrder100)
  .setNextSuccessor(chainOrderNormal);

// 测试结果
chainOrder500.passRequest(1, true, 500); //500元定金预约，得到100元优惠券
chainOrder500.passRequest(1, false, 500); //普通购买，无优惠券
chainOrder500.passRequest(2, true, 500); //200元定金预约，得到50元优惠券
chainOrder500.passRequest(3, true, 500); //100元定金预约，得到20元优惠券
chainOrder500.passRequest(3, false, 500); //普通购买，无优惠券
chainOrder500.passRequest(3, false, 0); //手机库存不足
*/


/******************** 用 APO 实现职责链 ********************/
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