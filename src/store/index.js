import Vue from 'vue'
import Vuex from 'vuex'
import platform from './modules/platform'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    platform,
    user,
  },
});

