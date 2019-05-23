/*************** 使用闭包封装私有变量 ***************/
/*
var user = (function () {
  var name = 'sven',
    age = 29;
  return {
    getUserInfo: function () {
      return `${name}-${age}`
    }
  }
})();
console.log(user.getUserInfo()); //sven-29
*/



/*************** 惰性单例 ***************/
// 封装单例
const getSingle = function (fn) {
  var result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  }
}

// 加载第三方界面
const createSingleIframe = getSingle(function () {
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  return iframe;
})


document.querySelector('#btn').addEventListener('click', function () {
  const layer = createSingleIframe();
  layer.src = "http://pic1.win4000.com/wallpaper/9/5450ae2fdef8a.jpg";
})