const el = element => {
  return document.querySelector(element);
}

// 手机库存
const goods = {
  red: 3,
  blue: 6,
  yellow: 10,
  green: 5
};


/********************** 初始代码 **********************/
/*
const btn = el('#btn');
const form = el('#form');
const colorSelect = el('#color');
const numberInput = el('#number');
const colorInfo = el('#color-info');
const numberInfo = el('#number-info');

// 当颜色值有改动时
colorSelect.addEventListener('change', (e) => {
  const color = e.target.value; //颜色
  const number = form.number.value; //数量
  const stock = goods[color]; //库存

  colorInfo.innerHTML = color;

  if (!color) {
    btn.disabled = true;
    btn.value = '请选择手机颜色';
    return;
  }

  if (!number) {
    btn.disabled = true;
    btn.value = '请输入购买数量';
    return;
  }

  if (number > stock) {
    btn.disabled = true;
    btn.value = '库存不足';
    return;
  }

  btn.disabled = false;
  btn.value = '加入购物车';
})

// 当数量值有改动时
numberInput.addEventListener('change', (e) => {
  const color = form.color.value; //颜色
  const number = e.target.value; //数量
  const stock = goods[color];

  numberInfo.innerHTML = number;

  // 颜色处理
  if (!color) {
    btn.disabled = true;
    btn.value = '请选择手机颜色';
    return;
  }

  // 用户输入的购买数量是否是正整数
  if (!number) {
    btn.disabled = true;
    btn.value = '请输入购买数量';
    return;
  }

  // 库存处理
  if (number > stock) {
    btn.disabled = true;
    btn.value = '库存不足';
    return;
  }

  btn.disabled = false;
  btn.value = '加入购物车';
})
*/

/********************** 引入中介者 **********************/
const btn = el('#btn');
const form = el('#form');
const colorSelect = el('#color');
const numberInput = el('#number');

const mediator = function () {
  const colorInfo = el('#color-info');
  const numberInfo = el('#number-info');

  return {
    changed: (obj) => {
      const color = form.color.value;
      const number = form.number.value;
      const stock = goods[color];

      // 如果颜色有改变
      if (obj.target === colorSelect) {
        colorInfo.innerHTML = color;
      } else if (obj.target === numberInput) {
        numberInfo.innerHTML = number;
      }

      // 颜色处理
      if (!color) {
        btn.disabled = true;
        btn.value = '请选择手机颜色';
        return;
      }

      // 用户输入的购买数量是否是正整数
      if (!number) {
        btn.disabled = true;
        btn.value = '请输入购买数量';
        return;
      }

      // 库存处理
      if (number > stock) {
        btn.disabled = true;
        btn.value = '库存不足';
        return;
      }

      btn.disabled = false;
      btn.value = '加入购物车';
    }
  }
}()


// 事件函数
colorSelect.addEventListener('change', (e) => {
  mediator.changed(e);
})

numberInput.addEventListener('change', (e) => {
  mediator.changed(e);
})