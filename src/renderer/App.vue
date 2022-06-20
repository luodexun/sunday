<template>
  <div id="app">
    <div class="mark" v-if="loading">
      <Loading/>
    </div>
    <video loop="loop" autoplay="autoplay" ref="bg" class="bgvideo" x5-playsinline="" playsinline="" webkit-playsinline="true">
    </video>
    <router-view></router-view>
    <el-button icon="el-icon-setting" circle plain size="mini" @click="settingVisible=true" class="setting_btn"></el-button>
    <el-dialog
        :visible.sync="settingVisible"
        width="350px"
        :show-close="false"
        append-to-body>
      <el-row type="flex" justify="center" style="align-items: center">
        <el-col :span="6" class="label">
          <label  >host:&nbsp;</label>
        </el-col>
        <el-col :span="9">
          <el-input v-model="form.host" size="mini" id="host"></el-input>
        </el-col>
        <el-col :offset="1" :span="3" class="label">
          <label >port:&nbsp;</label>
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.port" size="mini" id="port"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="align-items: center;margin-top: 10px">
        <el-col :span="6"  class="label">
          <label >username:&nbsp;</label>
        </el-col>
        <el-col :span="18">
          <el-input v-model="form.user" size="mini" id="username"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="align-items: center;margin-top: 10px">
        <el-col :span="6"  class="label">
          <label >password:&nbsp;</label>
        </el-col>
        <el-col :span="18">
          <el-input v-model="form.password" size="mini" id="password"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="align-items: center;margin-top: 10px">
        <el-col :span="6"  class="label">
          <label >database:&nbsp;</label>
        </el-col>
        <el-col :span="18">
          <el-input v-model="form.database" size="mini" id="database"></el-input>
        </el-col>
      </el-row>
      <el-row  type="flex" justify="center" style="align-items: center;margin-top: 15px">
        <el-col :span="11" ><el-button size="mini" type="primary" style="width: 100%" @click="ping">测试</el-button></el-col>
        <el-col :span="11" :offset="2"><el-button size="mini" type="primary" style="width: 100%" @click="save">保存</el-button></el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import bg from './assets/bg.mp4'
import Loading from './components/Loading'
export default {
  data () {
    return {
      settingVisible: false,
      form: {
        host: '',
        port: '',
        user: '',
        password: '',
        database: ''
      },
      loading: true
    }
  },
  mounted () {
    const config = ipcRenderer.sendSync('config')
    if (config) {
      this.form = config
    }
    this.$refs['bg'].src = bg
    setTimeout(() => {
      this.loading = false
    }, 5000)
  },
  components: {
    Loading
  },
  methods: {
    ping () {
      if (!this.form.host) {
        this.$message('host不为空')
        return
      }
      if (!this.form.port) {
        this.$message('port不为空')
        return
      }
      if (!this.form.user) {
        this.$message('username不为空')
        return
      }
      if (!this.form.password) {
        this.$message('password不为空')
        return
      }
      if (!this.form.database) {
        this.$message('database不为空')
      }
      const {code, msg} = ipcRenderer.sendSync('ping', this.form)
      if (code === 0) {
        this.$message({type: 'success', message: msg})
      } else {
        this.$message({type: 'error', message: msg})
      }
    },
    save () {
      if (!this.form.host) {
        this.$message('host不为空')
        return
      }
      if (!this.form.port) {
        this.$message('port不为空')
        return
      }
      if (!this.form.user) {
        this.$message('username不为空')
        return
      }
      if (!this.form.password) {
        this.$message('password不为空')
        return
      }
      if (!this.form.database) {
        this.$message('database不为空')
      }
      let {code, msg} = ipcRenderer.sendSync('ping', this.form)
      if (code === 0) {
        let {code, msg} = ipcRenderer.sendSync('save', this.form)
        if (code === 0) {
          this.$message({type: 'success', message: msg})
        }
      } else {
        this.$message({type: 'error', message: msg})
      }
    }
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
  .setting_btn{
    position: absolute;
    top: 1rem;
    right: 2rem;
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
