<template>
  <div class="systemExample width100 height100">
    <main>
      <div class="right-side">
        <div class="doc">
          <div class="title alt">您可以点击的按钮测试功能</div>
          <el-button type="primary" round @click="CheckUpdate">检查更新, 不可用于开发环境</el-button>
        </div>
      </div>
    </main>
    <el-dialog
        title="下载进度"
        :visible.sync="dialogVisible"
        :show-close="true"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        center
        width="50%"
        top="45vh">
      <div class="conten">
        <el-progress :percentage="percentage" :color="colors" :status="progressStaus"></el-progress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
export default {
  name: 'Update',
  data: () => ({
    percentage: 0,
    colors: [
      { color: '#f56c6c', percentage: 20 },
      { color: '#e6a23c', percentage: 40 },
      { color: '#6f7ad3', percentage: 60 },
      { color: '#1989fa', percentage: 80 },
      { color: '#5cb87a', percentage: 100 }
    ],
    dialogVisible: false,
    progressStaus: null
  }),
  mounted () {
    ipcRenderer.on('UpdateMsg', (event, arg) => {
      switch (arg.state) {
        case 1:
          this.$confirm('检查到商盟订货有新版本，是否更新?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogVisible = true
            ipcRenderer.send('confirm-downloadUpdate')
          })
          break
        case 3:
          this.percentage = arg.msg.percent.toFixed(1)
          break
        case 4:
          this.progressStaus = 'success'
          this.$alert('下载完成！', '提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              ipcRenderer.send('confirm-update')
            }
          })
          break
        default:
          break
      }
    })
  },
  methods: {
    // 下面方法点击按钮去检查，那么如果你想实现应用打开就去检查呢，你就吧此文件写在你项目的根页面，然后然后开始就去执行这个方法即可！
    CheckUpdate () { this.ipcRenderer.send('check-update') }
  }
}
</script>