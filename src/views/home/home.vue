<!-- ref如果绑定再组件上的，那么this.$refs.refname获取到得是一个组件对象
ref如果绑定再元素上的，那么this.$refs.refname获取到得是一个元素对象 -->
<template>
    <div id="home">
        <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <scroll class="content" 
                ref="scroll" 
                :probe-type="3" 
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="LoadMore">
            <home-swiper :banners="banners"></home-swiper>
            <recommend-view :recommends="recommends"></recommend-view>
            <feature-view></feature-view>
            <tab-control class="tab-control"  
                        :titles="['流行','新款','精选']"
                        @tabClick="tabClick"></tab-control>
            <goods-list :goods="showGoods"></goods-list>
        </scroll>
        <!-- .native 监听组件的原生事件，不然无法监听 -->
        <back-top @click.native="backClick" v-show="isshowBackTop"></back-top>
    </div>
</template>

<script>
    import HomeSwiper from './childComps/HomeSwiper';
    import RecommendView from './childComps/RecommendView';
    import FeatureView from './childComps/FeatureView';

    import NavBar from 'components/common/navbar/NavBar';
    import TabControl from 'components/content/tabControl/TabControl';
    import GoodsList from 'components/content/goods/GoodsList';
    import Scroll from 'components/common/scroll/Scroll';
    import BackTop from 'components/content/backTop/BackTop';

    import {getHomeMultidata,getHomeGoods} from "network/home";
    

    export default {
        name:'Home',
        components:{
            HomeSwiper,
            RecommendView,
            FeatureView,
            NavBar,
            TabControl,
            GoodsList,
            Scroll,
            BackTop
        },
        data(){
            return {
                banners:[],
                recommends:[],
                goods:{
                    'pop':{page:0,list:[]},
                    'new':{page:0,list:[]},
                    'sell':{page:0,list:[]}
                },
                currentype:'pop',
                isshowBackTop:false
            }
        },
        computed:{
            showGoods(){
                return this.goods[this.currentype].list
            }
        },
        created(){
            //1.请求多个数据
            this.getHomeMultidata()
            //2.请求商品数据
            this.getHomeGoods('pop')
            this.getHomeGoods('new')
            this.getHomeGoods('sell')
        },

            methods:{
                /**
                * 事件监听相关方法
                */
                tabClick(index){
                    switch(index){
                        case 0:
                            this.currentype='pop'
                            break
                        case 1:
                            this.currentype='new'
                            break
                        case 2:
                            this.currentype='sell'
                            break
                    }
                },
                backClick(){

                    //其一：直接访问
                    // 拿到scroll组件里的scroll属性的scrollTo方法
                    //第三个参数表示延迟时间
                    // this.$refs.scroll.scroll.scrollTo(0,0,500)

                    //其二，在scroll.vue中封装起来访问其方法
                    this.$refs.scroll.scrollTo(0,0)
                },
                contentScroll(position){
                    this.isshowBackTop=(-position.y) > 1000
                },
                LoadMore(){
                    this.getHomeGoods(this.currentype);
                    this.$refs.scroll.scroll.refresh()
                },
                /**
                * 网络请求相关方法
                */
                getHomeMultidata(){
                    getHomeMultidata().then(res=>{
                    // console.log(res);
                    //res会在箭头函数调用结束被回收掉，用result指向res的对象，就会避免数据被垃圾回收
                    // this.result=res;
                    //this可以用，this在箭头函数里向上找作用域
                    //因为created里有this，向上找就找到data里的result
                    this.banners=res.data.banner.list;
                    this.recommends=res.data.recommend.list
                    })
                },
                getHomeGoods(type){
                    const page = this.goods[type].page+1;
                    getHomeGoods(type,page).then(res=>{
                        //...代表遍历数组，再依次push进去
                        this.goods[type].list.push(...res.data.list)
                        this.goods[type].page += 1
                        
                        this.$refs.scroll.finishPullUp()
                    })
                }
            }
    }
</script>


<style scoped>
    /*scoped作用域 */
    #home {
        /* padding-top: 44px; */
        /* vh:视口 */
        height: 100vh;
    }
    .home-nav {
        background-color: var(--color-tint);
        color: #fff;

        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9;
    }
    .tab-control {
         /* sticky停留效果 */
        position: sticky;
        top: 44px;
        z-index: 9;
    }
    .content {
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
        overflow: hidden;

        /* height: calc(100% - 93px);
        overflow: hidden;
        margin-top: 44px; */
    }
</style>

<!-- 
    函数调用-》压入函数栈（保存函数中所有变量）
    函数调用结束-》弹出函数栈（释放所有的变量） -->