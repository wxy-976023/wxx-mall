export default {
    addCart(context,payload){
        return new Promise((resolve,reject)=>{
            //1.payload添加新商品
        let oldproduct = null
        for(let item of context.state.cartList){
            if(item.iid === payload.iid){
                oldproduct=item;                    
            }
        }
        //2.判断oldproduct
        if(oldproduct){ //数量+1
            // oldproduct.count+=1
            context.commit('addCounter',oldproduct)
            resolve('商品数量加1')

        }else{    //添加了新的商品
            payload.count=1;
            // context.state.cartList.push(payload)
            context.commit('addToCart',payload)
            resolve('新商品加入')
        }
        })
    }
}