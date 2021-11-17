import HelloWorld from './components/HelloWorld';
import Test from './components/Test';
import City3d from './components/city3d/City3d';

const install = function (Vue) {
  // 全局注册组件
  Vue.component('HelloWorld', HelloWorld);
  Vue.component('Test', Test);
};

export { HelloWorld, Test, City3d, install };

export default {
  install,
};


const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.head.appendChild(script);
    script.onload = function () {
      resolve();
    };
    script.onerror = function () {
      reject();
    };
  });
};

// https://www.jianshu.com/p/8a8353e7a45b
const list = [
  {
    package: 'gis',
    script: 'xxxx',
    style: 'xxx',
    components: ['City3d', 'xx'],
  }
];
