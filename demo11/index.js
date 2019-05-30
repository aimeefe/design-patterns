// 适配器模式
/************ 期待的接口与现有提供的接口不兼容 ************/

/**
 * 初始代码
 * 向 googleMap 和 baiduMap 都发出显示的请求时， 他们会 分别以各自的方式在页面中展示地图
 */
/*
const googleMap = {
  show: () => console.log('开始渲染谷歌地图')
}

const baiduMap = {
  show: () => console.log('开始渲染百度地图')
}

const renderMap = map => {
  if (map.show instanceof Function) {
    map.show();
  }
}

renderMap(googleMap); //开始渲染谷歌地图
renderMap(baiduMap); //开始渲染百度地图
*/

/**
 * 适配器转换
 * 向 googleMap 和 baiduMap 都发出显示的请求时， 他们会 分别以各自的方式在页面中展示地图
 * 处理 baiduMap 的显示方法名称变更的问题
 */
const googleMap = {
  show: () => console.log('开始渲染谷歌地图')
}

const baiduMap = {
  display: () => console.log('开始渲染百度地图')
}

//适配器处理接口不一致的问题
const baiduMapAdapter = {
  show: () => {
    return baiduMap.display();
  }
}

// 渲染
const renderMap = map => {
  if (map.show instanceof Function) {
    map.show();
  }
}


// 使用
renderMap(googleMap); //开始渲染谷歌地图
renderMap(baiduMapAdapter); //开始渲染百度地图




/************ 数据格式转换 ************/
// demo：向 googleMap 和 baiduMap 都发出显示的请求时， 他们分别以各自的方式在页面中展示地图。

// 后端接口数据
const data = 'abcdefg';

//适配器
const reverse = (data) => {
  let r = data.split('').reverse().join('').toUpperCase();
  return `sign - ${r}`;
}

const result = reverse(data);
console.log(result); //sign - GFEDCBA