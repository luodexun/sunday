<template>
  <div class="container">
    <div id="echart"></div>
  </div>
</template>
<script>
import {init} from 'echarts'
import resizeMixins from '@/utils/resizeMixins'
export default {
  props: ['option'],
  mixins: [resizeMixins],
  // 页面初始化挂载dom
  mounted () {
    this.getLoadEcharts()
  },
  methods: {
    getLoadEcharts () {
      this.chart = init(
        document.getElementById('echart')
      )
      this.chart.setOption(this.option)
    }
  },
  watch: {
    option: {
      deep: true,
      handler (newValue) {
        this.chart.setOption(newValue)
      }
    }
  }
}
</script>
<style scoped>
.container{
  width: 100%;
  height: 100%;
}
#echart{
  width: 100%;
  height: 100%;
}
</style>

