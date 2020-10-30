<template>
    <div class="cartlist">
        <scroll class="content" ref="scroll">
            <cart-list-item v-for="(item,index) in cartList"
                            :product="item"
                            :key="index"></cart-list-item>
        </scroll>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Scroll from 'components/common/scroll/Scroll'
    import CartListItem from './cartListItem'

    export default {
        name:'CartList',
        components:{
            Scroll,
            CartListItem
        },
        computed:{
            ...mapGetters(['cartList'])
        },
        activated(){
            // console.log('=======')
            this.$refs.scroll && this.$refs.scroll.refresh()
        }
    }
</script>

<style scoped>
    .cartlist {
        position: relative;
    }
    .content{
        height:  calc(100vh - 44px - 49px );
        overflow: hidden;
    }

</style>