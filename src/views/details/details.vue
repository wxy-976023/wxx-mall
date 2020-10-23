<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav"></detail-nav-bar>
        <scroll class="content" ref="scroll">
            <detail-swiper :top-images="topImages"></detail-swiper>
            <!-- 传递数据的两个名字也要起的一样 暂时没搞懂 先放着疑问 -->
            <detail-base-info :goods-info="goodsInfo"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :detail-info="detailInfo"
                               @imageLoad="imageLoad"></detail-goods-info>
            <detail-param-info :param-info="paramInfo"></detail-param-info>
            <detail-comment-info :comment-info="commentInfo"></detail-comment-info>
            <goods-list :goods="recommends"></goods-list>
        </scroll>
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
    import GoodsList from 'components/content/goods/GoodsList';

    import Scroll from 'components/common/scroll/Scroll';

    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail';

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
            GoodsList,
            Scroll
        },
        data(){
            return {
                iid:null,
                topImages:[],
                goodsInfo:{},
                shop:{},
                detailInfo:{},
                paramInfo:{},
                commentInfo:{},
                recommends:[]
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
                
            })
            getRecommend().then(res=>{
                this.recommends = res.data.list
            })
        },
        methods: {
            imageLoad(){
                this.$refs.scroll.refresh()
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