import Vue from 'vue'
import VueRouter from 'vue-router'
import Feed from '../views/Feed.vue'
import Social from '../views/Social.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/feed',
    name: 'Feed',
    component: Feed
  },
  {
    path: '/social',
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
