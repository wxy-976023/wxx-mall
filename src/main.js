import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//非父子组件之间的传递信息，用到$bus事件总线
Vue.prototype.$bus=new Vue()

//解决移动端300ms的延迟：
//1.安装2.导入3.调用attach函数
FastClick.attach(document.body)

//安装toast插件
Vue.use(toast)
//使用懒加载的插件
Vue.use(VueLazyLoad,{
  //加入占位图片
  loading:require('./assets/img/detail/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
