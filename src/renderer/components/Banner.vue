<template>
  <div ref="mySwiper" class="swiper-container" :id="currentIndex"  >
    <div class="swiper-wrapper custom_swiper">
      <div class="swiper-slide my-swiper-slide" v-for="item of 29" :key="item">
        <div :style="{width:'100%',height:'100%',background:`url(./static/banner/${item}.jpg) center/cover no-repeat`}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.css'
export default {
  name: 'banner',
  props: ['currentIndex'],
  data () {
    return {
      currentSwiper: null
    }
  },
  mounted () {
    this.initSwiper()
  },
  methods: {
    // 鼠标移入暂停自动播放
    stopAutoPlay () {
      this.currentSwiper.autoplay.stop()
    },
    // 鼠标移出开始自动播放
    startAutoPlay () {
      this.currentSwiper.autoplay.start()
    },
    // 初始化swiper
    initSwiper () {
      // 一个页面有多个swiper实例时，为了不互相影响,绑定容器用不同值或变量绑定
      this.currentSwiper = new Swiper('#' + this.currentIndex, {
        loop: true, // 循环模式选项
        simulateTouch: false, // 鼠标无效
        followFinger: false, // 拖动后释放鼠标或手指时slide滑动
        keyboardControl: false, // 设置为true时，能使用键盘方向键控制slide滑动。
        effect: 'fade',
        autoplay: {
          // 自动播放,不同版本配置方式不同
          delay: 20000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        }
      })
    },
    // 销毁swiper
    destroySwiper () {
      try {
        this.currentSwiper.destroy(true, false)
      } catch (e) {
        console.log('删除轮播')
      }
    },
    // 更新swiper
    updateSwiper () {
      this.destroySwiper()
      this.$nextTick(() => {
        this.initSwiper()
      })
    }
  },
  destroyed () {
    this.destroySwiper()
  }
}
</script>
<style scoped>
.swiper-container{
  background-color: gray;
  position: absolute;
  width: 100%;
  height: 100%;
}
/*slide样式*/
.my-swiper-slide{
  background-color: pink;
  height: 100%;
}

.custom_swiper{
  height: 100% !important;
}
</style>5