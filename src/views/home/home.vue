<!-- ref如果绑定再组件上的，那么this.$refs.refname获取到得是一个组件对象
ref如果绑定再元素上的，那么this.$refs.refname获取到得是一个元素对象 -->
<template>
    <div id="home">
        <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <tab-control class="tab-control"  
                        :titles="['流行','新款','精选']"
                        @tabClick="tabClick"
                        ref="tabControl1"
                        v-show="isTabFixed"></tab-control>
        <scroll class="content" 
                ref="scroll" 
                :probe-type="3" 
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="LoadMore">
            <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
            <recommend-view :recommends="recommends"></recommend-view>
            <feature-view></feature-view>
            <tab-control :titles="['流行','新款','精选']"
                         @tabClick="tabClick"
                         ref="tabControl2"></tab-control>
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
    // import BackTop from 'components/content/backTop/BackTop';

    import {getHomeMultidata,getHomeGoods} from "network/home";
    import {debounce} from 'common/utils'
    import {itemListenerMixin,backTopMinin} from 'common/mixin'
    

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
            // BackTop
        },
        //mixins：混入对象，组件之间复用代码，继承只能用于类代码的复用
        mixins:[itemListenerMixin,backTopMinin],
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
                tabOffseTop:0,
                isTabFixed:false,
                saveY:0
            }
        },
        computed:{
            showGoods(){
                return this.goods[this.currentype].list
            }
        },
        activated(){
            this.$refs.scroll && this.$refs.scroll.scrollTo(0,this.saveY,0)
            this.$refs.scroll && this.$refs.scroll.refresh()
            // console.log('active')
            // console.log(this.saveY)
        },
        //离开首页时
        deactivated(){
            // console.log('deactive')
            // console.log(this.saveY)
            //1.保存Y值
            this.saveY=this.$refs.scroll.getScrollY();
            //2.取消全局事件监听
            this.$bus.$off('itemImgLoad',this.itemImgListener);
        },
        created(){
            //1.请求多个数据
            this.getHomeMultidata()
            //2.请求商品数据
            this.getHomeGoods('pop')
            this.getHomeGoods('new')
            this.getHomeGoods('sell')
        },
        mounted(){
             //1.图片加载完成的事件监听：监听item中事件加载完成
            //  this.$bus.$on('itemImageLoad',()=>{
            //     // console.log('--------')
            //     this.$refs.scroll.refresh()})

            //监听事件中-加入防抖动函数：
            // const refresh =debounce(this.$refs.scroll.refresh,500)

            // 对监听事件进行保存
            // this.itemImgListener = ()=>{
            //     refresh()
            // }
            // this.$bus.$on('itemImageLoad',this.itemImgListener)
            // console.log('hmounted')
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
                    this.$refs.tabControl1.currentIndex=index;
                    this.$refs.tabControl2.currentIndex=index;
                },
                contentScroll(position){
                    this.listenShowBackTop(position)
                    this.isTabFixed=(-position.y)>this.tabOffseTop
                },
                LoadMore(){
                    this.getHomeGoods(this.currentype)
                },
                swiperImageLoad(){
                    //2.获取tabControl的offsetTop
                    //所有的组件都有一个属性$el:用于获取组件中的元素
                    this.tabOffseTop=this.$refs.tabControl2.$el.offsetTop;
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
                        
                        //完成了上拉加载更多
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

        /* 下面的定位在原生滚动时才有用，better-scroll中不起效 */
        /* position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9; */
    }
    /* tab-control因为better-scroll的加入已经不起效果了 */
    /* .tab-control {
         sticky停留效果
        position: sticky;
        top: 44px;
        z-index: 9;
    } */
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
    .tab-control {
        position: relative;
        z-index: 9;
    }
</style>

<!-- 
    函数调用-》压入函数栈（保存函数中所有变量）
    函数调用结束-》弹出函数栈（释放所有的变量） -->