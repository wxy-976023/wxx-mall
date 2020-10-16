<template>
    <div class="tab-bar-item" @click="itemClick">
        <div v-if="!isActive"><slot v-if="!isActive" name="item-icon"></slot></div>
        <div v-else><slot name="item-icon-active"></slot></div>
        <div :style="activeStyle"><slot name="item-text"></slot></div>
    </div>
</template>

<script>
    export default {
        name:'TabBarItem',
        props:{
            path:String,
            activeColor:{
                type:String,
                default:'#d4237a'
            }
        },
        data() {
            return {
                // isActive:true
            }
        },
        computed:{
            isActive(){
                // 判断是否处于活跃状态
                return this.$route.path.indexOf(this.path) !== -1
            },
            activeStyle(){
                // 动态绑定活跃状态字体颜色
                return this.isActive ? {color:this.activeColor} : {}
            }
        },
        methods:{
            itemClick(){
                this.$router.replace(this.path)
            }
        }
    }
</script>

<style scoped>
  .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item>div>img {
      width: 24px;
      height: 24px;
      margin-top: 3px;
      vertical-align: middle;
      margin-bottom: 2px;
  }
  /* .active {
      color: #d4237a;
  } */
</style>