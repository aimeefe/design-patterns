# 策略模式

定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换。

## 目的

将`算法的使用`和`算法的实现`分离开来

## 结构

一个基于策略模式的程序至少由两部分组成：

- 一组策略类：定义一系列算法，将他们各自封装成策略类，算法被封装在策略内部的方法里

- 环境类Context：Context 将请求委托给策略对象，这些策略对象会根据请求返回不同执行结果，这也是对象多态性的表现

## 优点

- 利用组合、委托和多态等技术和思想，可以有效的避免多重条件选择语句。
- 将算法独立封装在 strategy 中，易于切换、理解和扩展。
- 可复用性高。

## 场景

- 封装算法

- 封装业务规则

- 高阶函数

## 封装算法

demo 计算每个人的奖金数额

### 初始版本

```JavaScript
var calculateBonus = function (level, salary) {
  if (level === 'S') {
    return salary * 4;
  }
  if (level === 'A') {
    return salary * 3;
  }
  if (level === 'B') {
    return salary * 2;
  }
}

// 使用
calculateBonus('B', 20000); //40000
calculateBonus('S', 6000); //24000
```
> 分析:
>
> 这样写存在的缺点：
>
> calculateBonus 函数庞大，包含大量 if 判断语句，需要覆盖所有逻辑分支
>
> calculateBonus 函数缺乏弹性，如果绩效系数有变动，不得不改动其内部实现，违反开放 - 封闭原则
>
> 算法复用性差

### 用策略模式重构

我们在 JavaScript 中，函数也是对象，所以更简单直接的做法是把 strategy 直接定义成函数：

```JavaScript
// 第一步：创建策略组
const strategies = {
  "S": (salary) => {
    return salary * 4;
  },
  "A": (salary) => {
    return salary * 3;
  },
  "B": (salary) => {
    return salary * 2;
  }
}

// 第二步：环境
const calculateBonus = (level, salary) => {
  return strategies[level](salary);
}

//使用
calculateBonus('B', 20000); //40000
calculateBonus('S', 6000); //24000
```

## 封装业务规则

策略模式也可以用来封装业务规则，只要这些业务规则指向的目标一致，我们就可以用策略模式来封装他们。

demo 表单校验

### 初始版本

```JavaScript
const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!form.name.value) {
    alert('用户名不能为空');
    return false;
  }
  if (form.password.value.length < 6) {
    alert('密码长度不得少于6位!');
    return false;
  }
  if (!/(^1[3|5|8][0-9]{9}$)/.test(form.phone.value)) {
    alert('手机号码格式不正确');
    return false;
  }

  //TODO 发送请求 ...
})
```

这样写的缺点跟计算每个人的奖金数额的缺点类似，下面用策略模式来重构它：

### 策略模式重构

第一步：把校验逻辑封装成策略对象

```JavaScript
const strategies = {
  // 必填项
  isNonEmpty: (value, errorMsg) => {
    if (!value) {
      return errorMsg;
    }
  },

  // 最小长度
  minLength: (value, length, errorMsg) => {
    if (value.length < length) {
      return errorMsg;
    }
  },

  //手机号码格式
  isMobile: (value, errorMsg) => {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
}
```

第二步：实现 Validator 类，这里作为 Context，负责接收用户请求并委托给 stategy 对象处理

```JavaScript
class Validator {
  constructor() {
    this.cache = [];
  }

  // 添加校验规则
  add(dom, rules) {
    rules.map(rule => {
      let strategyAry = rule.strategy.split(':');
      let errorMsg = rule.errorMsg;

      this.cache.push(() => {
        let strategy = strategyAry.shift();
        strategyAry.unshift(dom.value);
        strategyAry.push(errorMsg);
        console.log(strategyAry)
        return strategies[strategy].apply(dom, strategyAry); //strategyAry: [value, ruleVal, errorMsg]
      })
    })

  }

  // 启动校验
  start() {
    for (let validator of this.cache) {
      const errorMsg = validator();
      if (errorMsg) {
        return errorMsg;
      }
    }
  }
}
```

第三步：客户端调用

```JavaScript
const validataFunc = () => {
  const validator = new Validator();

  // 添加校验规则
  validator.add(form.name, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  }, {
    strategy: 'minLength:6',
    errorMsg: '用户名长度不得少于6位'
  }]);
  validator.add(form.password, [{
    strategy: 'minLength:6',
    errorMsg: '密码长度不得少于6位'
  }]);
  validator.add(form.phone, [{
    strategy: 'isMobile',
    errorMsg: '手机号码格式不正确'
  }]);

  //获得校验结果
  const errorMsg = validator.start();
  return errorMsg;
}
```

第四步：表单提交处理

```JavaScript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const errorMsg = validataFunc();
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
  // TODO 提交表单
  // ...
  // console.log(form.name.value, form.password.value, form.phone.value);
})
```
> 分析：
>
> 使用策略模式重构代码后，我们仅仅通过“配置”的方式就可以完成一个表单的校验，这些校验规则也可以复用在其他对象，还可以作为插件的形式方便的被移植到其他项目中。


## 策略模式与高阶函数

我们可以用函数来封装不同的行为，并把它传递到另一个函数中去，当我们对这些函数发出调用的消息时，不同函数会返回不同的执行结果

demo 计算奖金

```JavaScript
const S = salary => {
  return salary * 4;
}

const A = salary => {
  return salary * 3;
}

const B = salary => {
  return salary * 2;
}

const calculateBonus = (func, salary) => {
  return func(salary);
}

// 使用
calculateBonus(S, 10000); //40000
calculateBonus(A, 5000); //15000
```



