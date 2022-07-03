import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: r => require.ensure([], () => r(require('@/pages/Home')), 'home')
    },
    {
      path: '/details',
      name: 'details',
      component: r => require.ensure([], () => r(require('@/pages/Details')), 'details')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
