<template>
  <div id="app">
    <div class="mark" v-if="loading">
      <Loading/>
    </div>
    <div class="title_custom">
      <div class="content"></div>
      <div class="option" v-if="platform==='win'">
        <svg-icon name="setting" className="setting" @click="settingVisible=true"></svg-icon>
        <svg-icon name="mini" className="mini" @click="mini"></svg-icon>
        <svg-icon :name="status" :className="status" @click="max"></svg-icon>
        <svg-icon name="close" className="close" @click="close"></svg-icon>
      </div>
    </div>
    <router-view></router-view>
    <el-button icon="el-icon-setting" circle plain size="mini" @click="settingVisible=true" class="setting_btn" v-if="platform==='mac'"></el-button>
    <el-dialog
        :visible.sync="settingVisible"
        width="370px"
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
    <Update ref="update"/>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import Loading from './components/Loading'
import Update from './components/Update'
export default {
  data () {
    return {
      platform: window.navigator.platform.toLocaleLowerCase().indexOf('win') === -1 ? 'mac' : 'win',
      settingVisible: false,
      form: {
        host: '',
        port: '',
        user: '',
        password: '',
        database: ''
      },
      loading: true,
      status: 'maximize'
    }
  },
  mounted () {
    const config = ipcRenderer.sendSync('config')
    if (config) {
      this.form = config
    }
    setTimeout(() => {
      this.loading = false
      this.$refs['update'].CheckUpdate()
    }, 3000)
  },
  components: {
    Loading,
    Update
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
    },
    mini () {
      ipcRenderer.send('mini')
    },
    max () {
      let {status} = ipcRenderer.sendSync('max')
      this.status = status
    },
    close () {
      ipcRenderer.send('close')
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
.title_custom{
  height: 31px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
}
.title_custom>div:first-child{
  flex: 1 1 auto;
  -webkit-app-region: drag;
}
.setting{
  color: #1b49bb;
  padding: 0.5rem 0.7rem;
}
.mini{
  color: #f18d0b;
  padding: 0.5rem 0.4rem;
}
.minimize,.maximize{
  color: #44a37c;
  padding: 0.5rem 0.4rem;
}
.close{
  color: #f60559;
  padding: 0.5rem 0.4rem;
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
