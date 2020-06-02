import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import moment from 'moment'
import material from 'material-icons'
import Toasted from 'vue-toasted';
import store from './store'

Vue.config.productionTip = false;
Vue.prototype.$moment = moment;
Vue.use(Toasted, { 
  iconPack: 'material' 
});

/**
 * Configuring axios
 */
axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(response => {
  return response; // Successful case
}, async (error) => { // Error case
  const {
    config,
    response : {status, data}
  } = error;

  // The routes about authentication doesn't have to retry
  if (config.url.includes('/auth')) {
    return Promise.reject(error);
  }

  // 1. Catching all 401 errors
  // 2. Unauthorized indicated that the token is not valid or that the user is not authenticated
  // 3. __isRetryRequest is a tag to avoid looping on the same request
  if (status === 401 && data == 'Unauthorized' && !config.__isRetryRequest) {
    config.__isRetryRequest = true;

    try {
      let access_token = await store.dispatch('auth/refresh');
      config.headers['Authorization'] = 'Bearer ' + access_token;
      return axios(config);

    } catch (err) {
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
})

if (!store.getters['auth/isAuthenticated']) {
  try {
    store.dispatch('auth/refresh')
  } catch (err) {
    // Redirect to login ?
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
