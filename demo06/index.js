/****************** 命令模式基本实现 ******************/
const btn1 = document.querySelector('#btn1');
/* 面向对象中的命令模式
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
*/

/*  javascript 中的命令模式
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
*/

/******************** 重做 & 撤销 ********************/
/*
//demo 重复播放录像

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

*/

/******************** 宏命令 ********************/
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
macroCommand().add(closeDoorCommand).add(openPcCommand).add(openQQCommand).execute();