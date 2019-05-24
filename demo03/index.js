// 策略模式
/**************** demo01 计算奖金数额 *****************/

// 传统写法
/*
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

console.log(calculateBonus('B', 20000)); //40000
console.log(calculateBonus('S', 6000)); //24000
*/

// 策略模式重写
/*
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

// 第二步：创建环境
const calculateBonus = (level, salary) => {
  return strategies[level](salary);
}

//使用
console.log(calculateBonus('B', 20000)); //40000
console.log(calculateBonus('S', 6000)); //24000
*/


/**************** demo02 表单验证 *****************/
// 初始版本
const form = document.getElementById('form')

/*
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

  //TODO 发送请求
  // ...
  console.log(form.name.value, form.password.value, form.phone.value);
})
*/

// 策略模式
/*
//第一步 策略对象
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


// 第二步 Validator 类
class Validator {
  constructor() {
    this.cache = [];
  }

  // 添加规则
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

  // 开始校验
  start() {
    for (let validator of this.cache) {
      const errorMsg = validator();
      if (errorMsg) {
        return errorMsg;
      }
    }
  }
}


// 第三步 客户调用代码
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

// 第四步 表单提交处理
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
*/

/**************** demo03 高阶函数与策略模式：计算奖金 *****************/
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