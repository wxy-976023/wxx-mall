import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

//非父子组件之间的传递信息，用到$bus事件总线
Vue.prototype.$bus=new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
