import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/index'
import Detail from '@/components/Detail/index'
import Cart from '@/components/Cart/index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/detail/:id',
      component: Detail
    },
    {
      path: '/cart',
      component: Cart
    }
  ]
})
