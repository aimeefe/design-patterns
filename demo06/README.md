# 命令模式

一个执行某些特定事情的指令。

## 应用场景

有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道请求的操作是什么，此时希望用一种松耦合的方式来设计程序，使得请求发送者和接受者可以消除彼此之间的耦合关系。

## 生活场景

订餐，客人需要向厨师发送请求，但是完全不知道这些厨师的名字和联系方式，也不知道厨师炒菜的方式和步骤。

命令模式把客人订餐的请求封装成 command 对象，也就是订餐中的订单对象。这个订单对象可以在程序中被四处传递，就像订单可以从服务员手中传送到厨师手中。这样一来，客人不需要知道厨师的名字，从而解开了请求调用者和请求接收者之间的耦合关系。

## 思路

将过程式的请求调用封装在 command 对象的 execute 方法里，通过封装方法调用，我们可以把运算块包装成形。

## 使用

### 面向对象中的命令模式

```JavaScript
const btn1 = document.querySelector('#btn1');

// setCommand 负责往按钮上安装命令
const setCommand = (button, command) => {
  button.onclick = () => {
    command.execute();
  }
}

// 功能模块
const menuBar = {
  refresh: () => {
    console.log('刷新菜单目录');
  }
}

// 将功能封装到命令类中
class RefreshMenuCommand {
  constructor(reveiver) {
    this.reveiver = reveiver;
  }
  execute() {
    this.reveiver.refresh();
  }
}

// 将命令接受者传入 command 对象中，并把 command 对象安装到 btn 上
setCommand(btn1, new RefreshMenuCommand(menuBar));
```
### JavaScript 中的命令模式

```JavaScript
const btn1 = document.querySelector('#btn1');

// 功能模块
const menuBar = {
  refresh: () => {
    console.log('刷新菜单界面');
  }
}

// 命令
const refreshMenuCommand = (receiver) => {
  return {
    execute: () => {
      receiver.refresh();
    }
  }
}

// 往按钮上安装命令
const setCommand = (button, command) => {
  button.onclick = () => {
    command.execute();
  }
}

setCommand(btn1, refreshMenuCommand(menuBar));
```

### 撤销和重做

思路：将执行过的命令保存在堆栈中，然后重复执行他们。

###### demo: 在键盘上敲下 W、A、S、D这几个键完成一些动作之后，按下 Replay 按钮来重复播放之前的动作。

```JavaScript

// 功能模块
const ryu = {
  attack: () => console.log('攻击'),
  defense: () => console.log('防御'),
  jump: () => console.log('跳跃'),
  crouch: () => console.log('蹲下')
}

// 创建命令
const mackCommand = (receiver, state) => {
  return () => {
    receiver[state]();
  }
}

const commands = {
  '119': 'jump', //W
  '115': 'crouch', //s
  '97': 'defense', //A
  '100': 'attack' //d
}

let commandStack = []; // 保存命令堆栈

document.onkeypress = (ev) => {
  const keycode = ev.keyCode;
  const command = mackCommand(ryu, commands[keycode]);

  if (command) {
    command(); //执行命令
    commandStack.push(command); //将刚刚执行过得命令保存仅堆栈
  }
}
```

### 宏命令

宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。

思路：
  - 第一步：定义宏命令`macroCommand`
  - 第二步：定义`macroCommand.add`方法将自命令添加进宏命令对象
  - 第三步：定义`macroCommand.execute`来迭代这一组宏命令，并依次执行他们的`execute`方法

###### demo 万能遥控器发布命令，依次执行关门、开电脑、登录QQ的动作。

```
// 命令模块
const closeDoorCommand = {
  execute: () => console.log('关门')
}

const openPcCommand = {
  execute: () => console.log('开电脑')
}

const openQQCommand = {
  execute: () => console.log('登录QQ')
}

// 宏命令
const macroCommand = () => {
  return {
    commandList: [],
    add: function (command) {
      this.commandList.push(command);
      return this;
    },
    execute: function () {
      this.commandList.forEach(command => {
        command.execute();
      })
      return this;
    }
  }
}

// 使用
macroCommand()
  .add(closeDoorCommand)
  .add(openPcCommand)
  .add(openQQCommand)
  .execute();

//依次输出：关门、开电脑、登录QQ
```

### 智能命令 & 傻瓜命令

#### 傻瓜命令

在 command 对象中保存一个接收者来负责执行客户的请求，它只负责把客户的请求转交给接收者来执行。

这样模式的好处是`请求发起者`和`请求接收者`尽可能的得到了解耦。

如：

```JavaScript
// 功能模块
const menuBar = {
  refresh: () => {
    console.log('刷新菜单界面');
  }
}

// 命令
const refreshMenuCommand = (receiver) => {
  return {
    execute: () => {
      receiver.refresh();
    }
  }
}
```

#### 智能命令

智能的命令对象可以直接实现请求，不需要接收者的存在。

如：

```JavaScript
const closeDoorCommand = {
  execute: () => console.log('关门')
}
```


