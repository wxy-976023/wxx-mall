<template>
    <div class="check-button" :class="{check:isChecked}">
        <img src="~assets/img/common/tick.svg" alt="">
    </div>
</template>

<script>
    export default {
        name:'CheckButton',
        props:{
            isChecked:{
                type:Boolean,
                default:false
            }
        }
    }
</script>

<style scoped>
    .check-button {
        border: 2px solid #ccc;
        border-radius: 50%;
    }
    .check-button img {
        width: 15px;
    }
    .check {
        background-color: red;
        border-color: red;
    }
</style>