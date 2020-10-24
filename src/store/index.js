import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

//安装插件
Vue.use(Vuex)

//创建对象
const state = {
    cartList:[]
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

//导出挂载
export default store