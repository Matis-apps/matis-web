import Vue from 'vue'
import VueRouter from 'vue-router'
import Releases from '../views/Releases.vue'
import Social from '../views/Social.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Account from '../views/Account.vue'
import Search from '../views/Search.vue'
import Playlists from '../views/Playlists.vue'
import Home from '../views/Home.vue'
import Logout from '../views/Logout.vue'
import GetStarted from '../views/GetStarted.vue'
import Tool from '../views/Tool.vue'
import DiscogsTransfer from '../views/DiscogsTransfer.vue'
import SocialNetwork from '../views/SocialNetwork.vue'
import store from '../store' // your vuex store 

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/get-started',
    name: 'Get Started',
    component: GetStarted,
  },
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
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { requiresAuth: true },
  },
  {
    path: '/news',
    name: 'Releases',
    component: Releases,
    meta: { requiresAuth: true, platform: true, },
  },
  {
    path: '/social',
    name: 'Social',
    component: Social,
    meta: { requiresAuth: true, platform: true, },
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { requiresAuth: true, platform: true, },
  },
  {
    path: '/playlists',
    name: 'Playlists',
    component: Playlists,
    meta: { requiresAuth: true, platform: true, },
  },
  {
    path: '/tool',
    name: 'Tool',
    component: Tool,
    meta: { requiresAuth: true, platform: true, },
  },
  {
    path: '/tool/discogs',
    name: 'Tool Discogs',
    component: DiscogsTransfer,
    meta: { requiresAuth: true, platform: true, },
  },
  {
    path: '/tool/netwok',
    name: 'Netwok',
    component: SocialNetwork,
    meta: { requiresAuth: true, platform: true, },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'router-link-exact-active',
  routes
})

router.beforeEach((to, from, next) => {
  store.dispatch('toast/clearStates');

  document.title = 'Matis - ' + to.name;

  if (to.matched.some(record => record.meta.platform) && !store.getters['platform/isUsingPlatform'] && store.getters['auth/isAuthenticated']) {
    let payload = { type: 'error', message: 'Il faut utiliser une platforme pour accéder à cette page.', keepIt: true }
    store.dispatch('toast/show', payload);
  }

  if (to.matched.length == 0) {
    let payload = { type: 'error', message: 'Page inexistante.', keepIt: true }
    store.dispatch('toast/show', payload);
    next({
      path: '/',
    })
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters['auth/isAuthenticated']) {
      store.dispatch('auth/refresh')
        .then(() => {
          next()
        })
        .catch(() => {
          let payload = { type: 'error', message: 'Il faut être connecté pour accéder à cette page.', keepIt: true }
          store.dispatch('toast/show', payload);
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        })
    } else {
      next() // everything looks fine
    }
  } else {
    if (!store.getters['auth/isAuthenticated']) {
      store.dispatch('auth/refresh') // test anyway
    }
    next() // make sure to always call next()!
  }
})

export default router
