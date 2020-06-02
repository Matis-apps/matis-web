import Vue from 'vue'
import Vuex from 'vuex'
import platform from './modules/platform'
import auth from './modules/auth'
import toast from './modules/toast'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    platform,
    auth,
    toast,
  },
});

