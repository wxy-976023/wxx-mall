<template>
    <div class="bottom-bar">
        <div class="check-content">
            <check-button class="check-button" 
                          :is-checked="isSelectAll"
                          @click.native="chcClick"></check-button>
            <span>全选</span>
        </div>
        <div class="check-total">总计：{{totalPrice}}</div>
        <div class="check-go" @click="goClick">去结算({{checkLength}})</div>
    </div>
</template>

<script>
    import CheckButton from 'components/content/checkButton/CheckButton'
    import {mapGetters} from 'vuex'
    export default {
        name:'CartBottomBar',
        components:{
            CheckButton
        },
        computed:{
            ...mapGetters(['cartList']),
           totalPrice(){
                return '￥'+this.cartList.filter(item =>{
                    return item.checked
                }).reduce((preValue,item)=>{
                    return preValue+item.price*item.count
                },0).toFixed(2)
           },
           checkLength(){
            return this.cartList.filter(item=>{
                return item.checked
            }).length
           },
           isSelectAll(){
            if(this.cartList.length===0) return false
            //    需要遍历，性能不够高：
            //    return !(this.cartList.filter(item=>!item.checked).length)
            //    find函数只要找到就可
            return !this.cartList.find(item=>!item.checked)
           }
        },
        methods:{
            chcClick(){
                if(this.isSelectAll){ //全部选中状态
                    this.cartList.forEach(item => item.checked = false);
                }else{  //部分不选中or全部不选中状态
                    this.cartList.forEach(item => item.checked = true);
                }
            },
            goClick(){
                if(!this.isSelectAll){
                    this.$toast.show('请选择购买的商品',2000)
                }
            }
        }
    }
</script>

<style scoped>
    .bottom-bar {
        position: fixed;
        bottom: 49px;
        left: 0;
        right: 0;
        height: 40px;
        background-color: #eee;
        display: flex;
        align-items: center;
        justify-items: center;
        font-size: 14px;
    }
    .check-content{
        /* border: 1px solid red; */
        flex: 1;
        display: flex;
        align-items: center;
        justify-items: center;
        margin-left: 5px;
        /* height: 40px; */
        /* line-height: 40px; */
    }
    .check-button {
        /* border: 1px solid red; */
        /* line-height: 40px; */
        margin-right: 5px;
    }
    .check-total {
        flex: 2;

    }
    .check-go {
        flex: 1;
        height: 40px;
        background-color: rgba(255, 123, 0, 0.719);
        line-height: 40px;
        text-align: center;
        color: #fff;
        padding: 0 5px 0 5px;
        /* border: 1px solid #ccc; */
    }
</style>