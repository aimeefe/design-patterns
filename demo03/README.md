# 策略模式

定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换

## 目的

将`算法的使用`和`算法的实现`分离开来

## 结构

一个基于策略模式的程序至少由两部分组成：

- 一组策略类：定义一系列算法，将他们各自封装成策略类，算法被封装在策略内部的方法里

- 环境类Context：在对 Context 发起请求时，Context 把请求委托给这些策略对象中间的某一个进行计算

## 场景

- 封装算法

- 封装业务规则

## 封装算法

demo 计算每个人的奖金数额

### 初始版本

```
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

```
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

```
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



