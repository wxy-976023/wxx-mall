<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleclick" ref="detailnav"></detail-nav-bar>
        <scroll class="content" ref="scroll" :probe-type="3"  @scroll="contentScroll">
            <detail-swiper :top-images="topImages"></detail-swiper>
            <!-- 传递数据的两个名字也要起的一样 暂时没搞懂 先放着疑问 -->
            <!-- 对上面的解释：：属性：topImage 传入值：top-image 事件不用注意此种-->
            <detail-base-info :goods-info="goodsInfo"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :detail-info="detailInfo"
                               @imageLoad="imageLoad"></detail-goods-info>
            <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
            <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
            <goods-list ref="recommend" :goods="recommends"></goods-list>
        </scroll>
        <detail-bottom-bar @addToCart="addtocart"></detail-bottom-bar>
        <back-top @click.native="backClick"  v-show="isshowBackTop"></back-top>
    </div>
</template>

<script>
    import DetailNavBar from './childComps/detailNavBar';
    import DetailSwiper from './childComps/detailSwiper';
    import DetailBaseInfo from './childComps/detailBaseInfo';
    import DetailShopInfo from './childComps/detailShopInfo';
    import DetailGoodsInfo from './childComps/detailGoodsInfo';
    import DetailParamInfo from './childComps/detailParamInfo';
    import DetailCommentInfo from './childComps/detailCommentInfo';
    import DetailBottomBar from './childComps/detailBottomBar';
    import GoodsList from 'components/content/goods/GoodsList';
    import Scroll from 'components/common/scroll/Scroll';

    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail';
    import {debounce} from 'common/utils'
    import {itemListenerMixin,backTopMinin} from 'common/mixin'

    import { mapActions}  from 'vuex'

    export default {
        name:'Details',
        components:{
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailBottomBar,
            GoodsList,
            Scroll
        },
        mixins:[itemListenerMixin,backTopMinin],
        data(){
            return {
                iid:null,
                topImages:[],
                goodsInfo:{},
                shop:{},
                detailInfo:{},
                paramInfo:{},
                commentInfo:{},
                recommends:[],
                themeTopYs:[],
                gethemeTopYs:null,
                currentIndex:0
            }
        },
        created(){
            //1.先保存传来的iid
            this.iid=this.$route.params.iid;
            //2.根据iid请求数据
            getDetail(this.iid).then(res=>{
                //3.获取顶部图片进行轮播图展示
                console.log(res)
                const data = res.result;
                this.topImages = data.itemInfo.topImages;
                //4.获取商品信息
                this.goodsInfo = new Goods(data.itemInfo,data.columns,data.shopInfo.services);
                //5.获取店铺信息
                this.shop = new Shop(data.shopInfo);
                //获取详情信息
                this.detailInfo = data.detailInfo;
                //获取参数信息
                this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
                //获取评论信息
                if(data.rate.cRate !== 0){
                    this.commentInfo=data.rate.list[0]
                }

                //获取根据navbar跳转内容的尝试，以下：
                //首先created里压根不能获取；mounted里面数据还没有获取到
                // 1/放到外面获取不对：因为$el压根没有渲染成功
                // this.themeTopYs=[]
                // this.themeTopYs.push(0);
                // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

                // this.$nextTick(()=>{
                    // 2.$nexttick能根据最新的数据，将对应的DOM是已经被渲染出来
                    // 但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
                    // offsetTop值不对一般都是图片加载问题
                    // this.themeTopYs=[]
                    // this.themeTopYs.push(0);
                    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                // })
                
            })
            getRecommend().then(res=>{
                this.recommends = res.data.list
            })

            //防抖提高性能，避免多次打印出来
            this.gethemeTopYs = debounce(()=>{
                    this.themeTopYs=[];
                    this.themeTopYs.push(0);
                    this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                    this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                    this.themeTopYs.push(Number.MAX_VALUE);
                    // console.log(this.themeTopYs)
                })
        },
        mounted(){
            // console.log('dmounted')
            

        },
        // deactived() 此页面没有keep-alive缓存，不可以调用此方法
        destroyed(){
            //离开时取消掉
            this.$bus.$off('itemImageLoad',this.itemImgListener)
        },
        methods: {
            ...mapActions(['addCart']),
            imageLoad(){
                this.$refs.scroll.refresh()
                this.gethemeTopYs()
            },
            titleclick(index){
                this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
            },
            //实现联动效果
            contentScroll(position){
                //1.获取y值
                const positionY = -position.y
                //2.positionY与主题值对比
                //[0,7938,9120,9452]
                //positionY在0与7938之间 index=0
                //positionY在7938与9120之间 index=1
                //positionY在9120与9452之间 index=2
                //positionY超过9452 index=3
                // this.currentIndex !== i 防止赋值过程过于频繁
                let length=this.themeTopYs.length
                // for(let i=0;i<length;i++){
                    //普通做法：
                    // if(this.currentIndex !== i && ((i<length-1 && positionY>=this.themeTopYs[i] && 
                    //     positionY<this.themeTopYs[i+1])||(i === length-1 && positionY>=this.themeTopYs[i]))){
                    //         this.currentIndex = i;
                    //         this.$refs.detailnav.currentIndex=this.currentIndex;
                    // }
                // }
                //上面的较长if的优化，多加一个最大值：
                for(let i=0;i<length-1;i++){
                    if(this.currentIndex !== i && (positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1])){
                        this.currentIndex = i;
                        this.$refs.detailnav.currentIndex=this.currentIndex;
                    }
                }
                //显示是否回到顶部
                this.listenShowBackTop(position)
            },
            addtocart(){
                //1.获取购物车需要展示的信息
                const product = {}
                product.image = this.topImages[0];
                product.title = this.goodsInfo.titleclick;
                product.desc = this.goodsInfo.desc;
                product.price = this.goodsInfo.realPrice;
                product.iid = this.iid
                //2.将商品添加到购物车中
                // this.$store.commit('addCart',product) mutations时用commit
                // this.$store.dispatch('addCart',product).then(res=>{//then调用promise
                //     console.log(res)
                // })
                //映射actions里的
                this.addCart(product).then(res=>{
                    this.$toast.show(res,2000)
                })
            }
        }
    }
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 10;
        background-color: #fff;
        height: 100vh;
    }
    .detail-nav {
        position: relative;
        z-index: 10;
        background-color: #fff;
    }
    .content {
        height: calc(100% - 44px);
    }
</style>