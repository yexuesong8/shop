<template>
  <div id="app">
    <upNav/>
    <Search/>
    <MainMenu/>
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script>
import upNav from './components/Public/upNav/index'
import Search from './components/Public/Search/index'
import MainMenu from './components/Public/MainMenu/index'
import Footer from './components/Public/Footer/index'
import './assets/css/style.less'
export default {
  components: {
    upNav, Search, MainMenu, Footer
  }
}
</script>

<style>

</style>
