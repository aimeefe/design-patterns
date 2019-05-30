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









