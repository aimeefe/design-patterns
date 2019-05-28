/****************** 咖啡与茶 ******************/
/*
// 泡一杯咖啡
class Coffee {
  boilWater() {
    console.log('把水煮沸');
  }
  brewCoffeeGriends() {
    console.log('用沸水冲泡咖啡');
  }
  pourInCup() {
    console.log('把咖啡倒进杯子');
  }
  addSugarAndMilk() {
    console.log('加糖和牛奶');
  }
  init() {
    this.boilWater();
    this.brewCoffeeGriends();
    this.pourInCup();
    this.addSugarAndMilk();
  }
}

const coffee = new Coffee();
coffee.init();

// 泡一壶茶
class Tea {
  boilWater() {
    console.log('把水煮沸');
  }
  steepTeaBag() {
    console.log('用沸水浸泡茶叶');
  }
  pourInCup() {
    console.log('把茶水倒进杯子');
  }
  addLemon() {
    console.log('加柠檬');
  }
  init() {
    this.boilWater();
    this.steepTeaBag();
    this.pourInCup();
    this.addLemon();
  }
}

const tea = new Tea();
tea.init();
*/


/****************** 模板方法重写咖啡与茶 ******************/
/*
// 分离共同点 - 抽象一个饮料类
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
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
  }
}

//创建咖啡子类
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
const coffee = new Coffee();
coffee.init();

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
const tea = new Tea();
tea.init();
*/

/****************** 钩子方法******************/
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
