<template>
    <swiper>
        <swiper-item v-for="item in banners">
            <a :href="item.link">
                <img :src="item.image" alt="" @load="ImageLoad">
            </a>
        </swiper-item>
    </swiper>
</template>

<script>
    import {Swiper,SwiperItem} from 'components/common/swiper';

    export default {
        name:'HomeSwiper',
        data(){
            return {
                isLoad: false
            }
        },
        props:{
            banners:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        components:{
            Swiper,
            SwiperItem
        },
        methods:{
            ImageLoad(){
                if(!this.isLoad){
                    this.$emit('swiperImageLoad'),
                    this.isLoad=true
                }
            }
        }
    }
</script>

<style>

</style>