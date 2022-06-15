<template>
  <div id="app">
    <video loop="loop" autoplay="autoplay" ref="bg" class="bgvideo" x5-playsinline="" playsinline="" webkit-playsinline="true">
    </video>
    <router-view></router-view>
  </div>
</template>

<script>
import bg from './assets/bg.mp4'
export default {
  mounted () {
    this.$refs['bg'].src = bg
  }
}
</script>

<style>
  #app{
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  .bgvideo{
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit:cover;
  }
</style>
