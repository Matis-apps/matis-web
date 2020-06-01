import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import moment from 'moment'


/**
 * Configuring axios
 */
axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(response => {
  return response; // Successful case
}, error => { // Error case
  const {
    config,
    response : {status, data}
  } = error;

  if (config.url.includes('/auth')) {
    return Promise.reject(error);
  }

  if (status === 401) {

    if (!config.__isRetryRequest) {
      config.__isRetryRequest = true;

      return store.dispatch('auth/refresh')
        .then((access_token) => {
          config.headers['Authorization'] = 'Bearer ' + access_token;
          return axios(config)
        })
        .catch(error => {
          return Promise.reject(error);
        });
    }
  } else {
    return Promise.reject(error);
  }
})

Vue.prototype.$moment = moment

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
