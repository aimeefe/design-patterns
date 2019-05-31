# 代码重构

实际项目开发中，除了使用设计模式进行重构之外，还有一些常见而容易忽略的细节，这些细节也是帮助我们达到重构目标的重要手段。以下将对此进行简单介绍：

## 提炼函数

如果一个函数过长，不得不加上若干注释才能让这个函数易读一些，那这个函数就有必要进行重构。

### 方法

将可以独立的代码片段封装到另一个独立的函数中，这样做的好处：

- 避免出现超大函数
- 独立出的函数有助于代码复用
- 独立出的函数更容易被覆写
- 独立出的函数如有一个良好的命名，那它本身就起到了注释作用

### 举例

###### 在一个负责取得用户信息的函数里面，我们还需要打印跟用户信息有关的 log，那么打 印 log 的语句就可以被封装在一个独立的函数里

```JavaScript

const getUserInfo = () => {
  ajax('/api/userInfo', (data) => {
    console.log(`userId: ${data.userId}`);
    console.log(`userName: ${data.userName}`);
    console.log(`nickName: ${data.nickName}`);
  })
}
```

改为

```JavaScript

const getUserInfo = () => {
  ajax('/api/userInfo', (data) => {
    printDetails(data);
  })
}

const printDetails = (data) => {
  console.log(`userId: ${data.userId}`);
  console.log(`userName: ${data.userName}`);
  console.log(`nickName: ${data.nickName}`);
}
```


## 合并重复的条件片段

如果一个函数体内有一些条件分支语句，而这些条件语句内部散布了一些重复代码，那么最好合并去重。

### 举例

###### 有一个分页函数 paging，该函数接收一个参数 currPage，currPage 表示即将跳转的页码。在跳转之前，为防止 currPage 传入过小或者过大的数 字，我们要手动对它的值进行修正

```JavaScript

const paging = currPage => {
  if (currPage <= 0) {
    currPage = 0;
    jump(currPage);  //跳转
  } else if (currPage >= totalPage) {
    currPage = totalPage;
    jump(currPage);  //跳转
  } else {
    jump(currPage);  //跳转
  }
}
```

改为：

```JavaScript

const paging = currPage => {
  if (currPage <= 0) {
    currPage = 0;
  } else if (currPage >= totalPage) {
    currPage = totalPage;
  }
  jump(currPage);  //跳转
}
```


## 把条件分支语句提炼成函数

复杂的条件分支语句可以导致程序难以阅读、理解和冗余，而且会使函数变得庞大。

### 举例

###### 编写一个计算商品价格的 getPrice 函数，商品的计算只 有一个规则:如果当前正处于夏季，那么全部商品将以 8 折出售

```JavaScript

const getPrice = price => {
  const date = new Date();
  
  //夏天
  if (date.getMonth() >= 6 && date.getMonth() <= 9) {
    return price * 0.8;
  }
  return price;
}
```

其中，

`if ( date.getMonth() >= 6 && date.getMonth() <= 9 ){ // ...}`

这行代码要表达是判断当前是否正处于夏天(7~10月），但是这样写也并不太能准确表达出代码的意思，我们可以把这句提炼成一个函数，技能准确的表达出代码的意思，函数本身又能起到很好的注释作用

改为：

const isSummer = () => {
  const date = new Date();
  return date.getMonth() >= 6 && date.getMonth() <= 9;
}

const getPrice = price => {
  if (isSummer) {
    return price * 0.8;
  }
  return price;
}


## 提前让函数退出代替嵌套条件分支 

嵌套的 if、else 语句相比较平铺的 if、else，在阅读数理解更加困难，如果对函数剩余部分不感兴趣就应该立即退出。 

### 技巧

面对一个嵌套的 if 分支时，把外层 if 表达式进行反转

### 举例

```JavaScript

const del = obj => {
  let ret;
  if (!obj.isReadonly) {
    if (obj.isFolder) {
      ret = deleteFolder(obj);
    } else if (obj.isFile) {
      ret = deleteFolder(obj);
    }
  }
  return ret;
}
```

改为：

```JavaScript·

const del = obj => {

 //反转 if 表达式
 if (obj.isReadonly) {
   return; 
 }
 if (obj.isFlder) {
   return deleteFolder(obj);
 }
 if (obj.isFile) {
   return deleteFolder(obj);
 }
}
```

## 传递对象参数代替过长的参数列表

一个函数如果接收多个参数，而参数数量越多，函数就越难理解和使用。使用函数的人要搞明白全部参数的含义，以免少传或把参数位置搞反了。

### 技巧

把参数都放入一个对象内，然后把该对象作为参数传入，接收者需要什么数据就可以自行从该对象里获取，而不用再关心参数的数量和顺序，只要保证参数对应的 key 值不变即可

### 举例

```JavaScript

const setUserInfo = obj => {
  const {id, name, address, sex, mobile, qq} = obj;
  console.log(id, name, address, sex, mobile, qq);
};

setUserInfo(1213, 'sven', 'shenzhen', 'male', '13302022244', 13099922);
```
改为：

```Javascript

const setUserInfo = (id, name, address, sex, mobile, qq) => {
  console.log(id, name, address, sex, mobile, qq);
};

setUserInfo ({
  id: 1213, 
  name: 'sven', 
  address: 'shenzhen', 
  sex: 'male', 
  mobile: '13302022244', 
  qq: 13099922
})

```


## 合理的使用链式调用

### 技巧

链式调用的实现只需在方法调用结束后返回对象自身

如果该链条的结构相对稳定，后期不易发生修改，那么链式调用无可厚非。但如果该链条易发生变化，导致调试和维护困难，那么建议使用普通调用形式。

### 举例

```JavaScript

const user = {
  id: null,
  name: null,
  setId: function (id) {
    this.id = id;
    return this;
  },
  setName: function (name) {
    this.name = name;
    return this;
  }
}

// 使用
user.setId(123).setName('sven');
```
