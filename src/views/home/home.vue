<template>
    <div id="home">
        <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <home-swiper :banners="banners"></home-swiper>
        <recommend-view :recommends="recommends"></recommend-view>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar';
    import HomeSwiper from './childComps/HomeSwiper';
    import RecommendView from './childComps/RecommendView';

    import {getHomeMultidata} from "network/home";
    

    export default {
        name:'Home',
        components:{
            NavBar,
            HomeSwiper,
            RecommendView
        },
        data(){
            return {
                banners:[],
                recommends:[]
            }
        },
        created(){
            //1.请求多个数据
            getHomeMultidata().then(res=>{
                // console.log(res);
                //res会在箭头函数调用结束被回收掉，用result指向res的对象，就会避免数据被垃圾回收
                // this.result=res;
                //this可以用，this在箭头函数里向上找作用域
                //因为created里有this，向上找就找到data里的result
                this.banners=res.data.banner.list;
                this.recommends=res.data.recommend.list
            })
        }
    }
</script>

<style>
    .home-nav {
        background-color: var(--color-tint);
        color: #fff;
    }
</style>

<!-- 
    函数调用-》压入函数栈（保存函数中所有变量）
    函数调用结束-》弹出函数栈（释放所有的变量） -->