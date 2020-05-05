import Vue from 'vue'
import VueRouter from 'vue-router'
import Social from '../views/Social.vue'
import FriendsSocial from '../views/FriendsSocial.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Social',
    component: Social
  },
  {
    path: '/friends',
    name: 'FriendsSocial',
    component: FriendsSocial
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
