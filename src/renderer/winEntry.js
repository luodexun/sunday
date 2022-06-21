import Vue from 'vue'
import axios from 'axios'
import './assets/main.css'
import './element-ui'
import './assets/index'
import Win from './Win'
import router from './router'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { Win },
  router,
  template: '<Win/>'
}).$mount('#app')
