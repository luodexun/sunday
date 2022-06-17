<template>
  <div id="app">
    <div class="mark" v-if="loading">
      <Loading/>
    </div>
    <video loop="loop" autoplay="autoplay" ref="bg" class="bgvideo" x5-playsinline="" playsinline="" webkit-playsinline="true">
    </video>
    <router-view></router-view>
  </div>
</template>

<script>
import bg from './assets/bg.mp4'
import Loading from './components/Loading'
export default {
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.$refs['bg'].src = bg
    setTimeout(() => {
      this.loading = false
    }, 5000)
  },
  components: {
    Loading
  }
}
</script>

<style>
  #app{
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  .mark{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    z-index: 10;
  }
  .bgvideo{
    /*filter: blur(1px);*/
    position: absolute;
    top: -5%;
    width: 100%;
    height: 105%;
    object-fit:cover;
  }
</style>
