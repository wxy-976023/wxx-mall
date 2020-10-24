export default {
    addCart(context,payload){
        //payload添加新商品
        let oldproduct = null
        for(let item of context.state.cartList){
            if(item.iid === payload.iid){
                oldproduct=item;                    
            }
        }
        //判断oldproduct
        if(oldproduct){ 
            // oldproduct.count+=1
            context.commit('addCounter',oldproduct)
        }else{
            payload.count=1;
            // context.state.cartList.push(payload)
            context.commit('addToCart',payload)
        }
    }
}