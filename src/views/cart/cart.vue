<template>
    <div class="cart">
        <nav-bar class="cart-nav">
            <div slot="center">购物车({{length}})</div>
        </nav-bar>
        <cart-list></cart-list>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import CartList from './childComps/cartList'

    import { mapGetters } from 'vuex'

    export default {
        name:'Cart',
        components:{
            NavBar,
            CartList
        },
        computed:{
            //两种语法：直接写数组（名字相同互相一一对应）；对象形式：名字可以自起
            // ...mapGetters(['cartLength','cartList'])
            ...mapGetters({
                length:'cartLength'
            })
        }
    }
</script>

<style scoped>
    .cart-nav {
        background: var(--color-tint);
        color: #fff;
    }
</style>