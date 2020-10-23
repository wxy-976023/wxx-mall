<template>
    <div class="goods-list-item" @click="itemClick">
        <img :src="goodsitem.show.img" alt="" @load="ImageLoad">
        <div class="goods-info">
            <p>{{goodsitem.title}}</p>
            <span class="price">{{goodsitem.price}}</span>
            <span class="collect">{{goodsitem.cfav}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name:'GoodsListItem',
        props:{
            goodsitem:{
                type:Object,
                default(){
                    return []
                }
            }
        },
        methods:{
            ImageLoad(){
                this.$bus.$emit('itemImageLoad')
            },
            itemClick(){
                this.$router.push('/details/'+this.goodsitem.iid)
            }
        }
    }
</script>

<style scoped>
    .goods-list-item {
        position: relative;
        padding-bottom: 40px;
        width: 48%;
    }
    .goods-list-item img{
        width: 100%;
        border-radius: 5px;
    }
    .goods-info {
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        overflow: hidden;
        font-size: 12px;
        text-align: center;
    }
    .goods-info p {
        overflow: hidden;
        /* ellipsis:显示省略符号来代表被修剪的文本 */
        text-overflow: ellipsis;
        /* 规定段落中的文本不进行换行： */
        white-space: nowrap;
        margin-bottom: 3px;
    }
    .goods-info .price {
        color: var(--color-high-text);
        margin-right: 20px;
    }
    .goods-info .collect {
        position: relative;
    }
    .goods-info .collect::before {
        content: '';
        position: absolute;
        top: -1px;
        left: -15px;
        width: 14px;
        height: 14px;
        background: url('~assets/img/common/collect.svg') 0 0/14px 14px;
    }

</style>