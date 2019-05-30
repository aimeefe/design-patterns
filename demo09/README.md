# 中介者模式

中介者模式使网状的多对多关系变成了简单的一对多关系。

## 场景

对模块或对象间依赖关系解耦。

## 生活场景

机场指挥塔

如果没有机场的指挥塔，每一架飞机要和方圆100公里的所有飞机通信才能确定航线及飞行状况，后果是不可想象的。现实中的情况是，每架飞机只需和指挥塔通信，指挥塔作为调停者，知道每一架飞机的飞行状况，可以安排所有飞机的起降时间及航线调整。

## 优点

中介者模式可以使各个对象之间得以解耦，以中介者和对象之间的一对多关系取代了对象之间的网状多对多关系。各个对象只需关注自身功能的实现，对象之间的交互关系交给中介者对象来实现和维护。

## 缺点

系统中会新增一个中介者对象，因为对象之间交互的复杂性转移到了中介者对象的复杂性，使得中介者对象是巨大的，本身成了一个难以维护的对象。

## 使用

###### demo 购买手机，在购买的流程中可以选择手机颜色及购买数量，同时页面中有两个区域，分别展示刚刚选好的颜色和数量，还有一个按钮动态显示下一步操作，包括库存状态等。

```JavaScript

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
```

### 原始代码

```JavaScript
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
  const color = form.color.value; 
  const number = e.target.value;
  const stock = goods[color];

  numberInfo.innerHTML = number;

  // 颜色处理
  if (!color) {
    btn.disabled = true;
    btn.value = '请选择手机颜色';
    return;
  }

  // 数量处理
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
```

如上，当触发了 colorSelect 的 change 事件后：

- 首先，让 colorInfo 显示当前选中的颜色
- 然后，获取用户输入的购买数量
- 最后，根据库存判断 button 显示的状态

同样，当触发了 numberInput 的 change 事件后，也需要做类似处理，那么，如果这时候增加了内存、系统...等一系列的选择，这些对象紧紧的耦合在一起，他们之间的联系也错综复杂，增加任何一个节点对象都要通知到其他相关对象。

### 中介者模式重构

```JavaScript
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
```

我们用中介者模式重构之后，会发现省去了很多重复的处理，并且如果以后再增加相应的需求，比如 CPU 型号等，直接修改 mediatot 即可，维护起来相对来说更容易了。

### 总结

中介者模式可以方便的对模块或对象进行解耦，但对象之间并非一定需要解耦。实际项目中，模块或对象之间有一些依赖关系很正常，关键在于如何去衡量对象间的耦合度。如果对象之间的耦合度确实导致了调用和维护困难，而且这些耦合度随着项目的变化呈指数增长曲线，那我们就可以考虑用中介者模式来重构。

