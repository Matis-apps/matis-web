import Vue from 'vue'
import VueRouter from 'vue-router'
import Releases from '../views/Releases.vue'
import Social from '../views/Social.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Account from '../views/Account.vue'
import Search from '../views/Search.vue'
import Playlists from '../views/Playlists.vue'
import store from '../store' // your vuex store 

Vue.use(VueRouter)

/*
const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}*/

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
  },  
  {
    path: '/releases',
    name: 'Releases',
    component: Releases,
  },
  {
    path: '/social',
    name: 'Social',
    component: Social,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/playlists',
    name: 'Playlists',
    component: Playlists,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'router-link-exact-active',
  routes
})

export default router
