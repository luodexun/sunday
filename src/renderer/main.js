import Vue from 'vue'
import axios from 'axios'
import './assets/main.css'
import './element-ui'
import './assets/index'
import App from './App'
import router from './router'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')

if (module.hot) {
  module.hot.accept()
}
