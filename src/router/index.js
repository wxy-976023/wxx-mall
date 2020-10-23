import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('@/views/home/home')
const CateGory =() => import('@/views/category/category')
const Cart =() => import('@/views/cart/cart')
const Profile =() => import('@/views/profile/profile')
const Details =() => import('@/views/details/details')

Vue.use(VueRouter)

const routes = [
    {
        path:'',
        redirect:'/home'
    },
    {
        path:'/home',
        component:Home
    },
    {
        path:'/category',
        component:CateGory
    },
    {
        path:'/cart',
        component:Cart
    },
    {
        path:'/profile',
        component:Profile
    },
    {
        path:'/details/:iid',
        component:Details
    }
]

const router = new VueRouter({
    routes,
    mode:'history'
})

export default router