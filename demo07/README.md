# 模板方法模式

模板方法模式是基于继承的一种设计模式，父类封装了子类的算法框架和方法的执行顺序，子类继承父类之后，子类通知父类执行这些方法，即高层组件调用底层组件。

## 应用场景

搭建项目框架

## 初步实现

###### demo 泡一杯咖啡和泡一杯茶

咖啡和茶的冲泡过程是大同小异的，我们可以找到两者以下不同点：

- 原料不同：分别是咖啡和茶，它们可以抽象为”饮料“。
- 泡的方式不同：分别是冲泡和浸泡，它们可以抽象为”泡“。
- 加入的调料不同：分别是糖、牛奶和柠檬，它们可以抽象为”调料“。

因此，不管是泡咖啡还是泡茶，都可以整理为以下四步：

- 把水煮沸
- 用沸水泡饮料
- 把饮料倒进被子
- 加调料

我们首先把相同的部分抽象到父类中，统一为泡饮料：

```JavaScript

// 创建抽象父类
class Beverage {
  boilWater() {
    console.log('把水煮沸');
  }
  brew() {
    //空方法，应该由子类重写
  }
  pourInCup() {
    //空方法，应该由子类重写
  }
  addCondiments() {
    //空方法，应该由子类重写
  }
  init() {
    this.boilWater(); // 把水煮沸
    this.brew(); // 用户冲泡原料
    this.pourInCup(); // 把原料倒进杯子
    this.addCondiments(); // 添加调料
  }
}
```

然后，我们创建茶和咖啡，并继承饮料，把不同的部分由子类来重写扩展。

```JavaScript

// 创建咖啡子类
class Coffee extends Beverage {
  brew() {
    console.log('用水冲泡咖啡');
  }
  pourInCup() {
    console.log('把咖啡倒进杯子');
  }
  addCondiments() {
    console.log('加糖和牛奶');
  }
}

// 创建茶子类
class Tea extends Beverage {
  brew() {
    console.log('用水浸泡茶叶');
  }
  pourInCup() {
    console.log('把茶倒进杯子');
  }
  addCondiments() {
    console.log('加柠檬');
  }
}

// 使用
const coffee = new Coffee();
coffee.init();

const tea = new Tea();
tea.init();
```

其中，Beverage.prototype.init 的方法中已经规定好了泡饮料的顺序，所以我们能够成功的泡出一杯咖啡或茶。

这里的 Beverage.prototype.init 就是一个模板方法，该方法内封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法，将每一个步骤都清晰的展示在我们眼前。

## 抽象类

模板方法是一种严重依赖抽象类的设计模式。

JavaScript 中没有抽象类的，为了保证子类会重写父类中的抽象方法，我们可以让抽象方法直接抛出一个异常，如：

```JavaScript
// 创建抽象父类
class Beverage {
  brew() {
    throw new Error('子类必须重写 brew 方法');
  }
  // ...
}
```

## 钩子方法

钩子方法用来处理一些特殊的子类，比如有些客人的咖啡不加糖和牛奶。

放置钩子是隔离变化的手段，可以在父类中很容易变化的地方放置钩子，钩子可以有一个默认实现，要不要“钩子”由子类决定。钩子方法的返回结果决定了模板方法后面部分的执行步骤，也就是程序接下来的走向。

###### demo 一杯不要糖和牛奶的咖啡

```JavaScript
// 分离共同点 - 抽象一个饮料类
class Beverage {
  boilWater() {
    console.log('把水煮沸');
  }
  brew() {
    //空方法，应该由子类重写
    throw new Error('子类必须重写 brew 方法');
  }
  pourInCup() {
    //空方法，应该由子类重写
    throw new Error('子类必须重写 pourInCup 方法');
  }
  addCondiments() {
    //空方法，应该由子类重写
    throw new Error('子类必须重写 addCondiments 方法');
  }
  // 钩子：是否加调料
  isCondiments() {
    return true;
  }
  init() {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.isCondiments()) {
      this.addCondiments(); //如果钩子返回 true, 则要加调料
    }
  }
}

// 创建子类
class Coffee extends Beverage {
  brew() {
    console.log('用水冲泡咖啡');
  }
  pourInCup() {
    console.log('把咖啡倒进杯子');
  }
  addCondiments() {
    console.log('加糖和牛奶');
  }
  isCondiments() {
    return window.confirm('请问需要调料吗？')
  }
}

const coffee = new Coffee();
coffee.init();
```






