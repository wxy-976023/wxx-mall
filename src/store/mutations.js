export default {
    //mutations唯一的目的是修改state中的状态
    //mutations中每个方法要尽可能的完成的事件单一一点
    
    addCounter(state,payload){
        payload.count++
    },
    addToCart(state,payload){
        payload.checked=true
        state.cartList.push(payload)
    }
}