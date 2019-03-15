import Vue from 'vue'
import Router from 'vue-router'
import Drawing from '@/pages/Drawing'
import Start from '@/pages/Start'
import Gameover from '@/pages/Gameover'
import scoreDetail from '@/pages/scoreDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start
    },
    {
      path: '/Drawing',
      name: 'Drawing',
      component: Drawing
    },
    {
      path: '/Gameover',
      name: 'Gameover',
      component: Gameover
    },
    {
    	path:'/scoreDetail',
    	name:'scoreDetail',
    	component:scoreDetail
    }
  ]
})
