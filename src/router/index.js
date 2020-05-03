import Vue from 'vue'
import VueRouter from 'vue-router'
import Social from '../views/Social.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Social',
    component: Social
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
