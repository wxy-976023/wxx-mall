import {debounce} from './utils';
import BackTop from 'components/content/backTop/BackTop';

export const itemListenerMixin = {
    components:{

    },
    methods:{

    },
    data(){
        return {
            itemImgListener:null
        }
    },
    mounted(){
        const refresh =debounce(this.$refs.scroll.refresh,500)
            this.itemImgListener = ()=>{ 
                refresh()
            }
            this.$bus.$on('itemImageLoad',this.itemImgListener)
            // console.log('我是混入内容')
    }
}

export const backTopMinin = {
    components:{
        BackTop
    },
    data(){
        return {
            isshowBackTop:false
        }
    },
    methods:{
        backClick(){

            //其一：直接访问
            // 拿到scroll组件里的scroll属性的scrollTo方法
            //第三个参数表示延迟时间
            // this.$refs.scroll.scroll.scrollTo(0,0,500)

            //其二，在scroll.vue中封装起来访问其方法
            this.$refs.scroll.scrollTo(0,0,300)
        },
        listenShowBackTop(position){
            this.isshowBackTop=(-position.y) > 1000
        }
    }
}