<template>
  <div id="app">
    <!-- exclude写的应该是name值 -->
    <keep-alive exclude="Details">
      <router-view></router-view>
    </keep-alive>
    <main-tabbar></main-tabbar>
  </div>
</template>

<script>
import MainTabbar from 'components/content/mainTabbar/mainTabbar'


export default {
  name: 'App',
  components: {
    MainTabbar,
  }
}
</script>

<style>
  @import "assets/css/base.css";

  </style>
