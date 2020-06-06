import axios from "axios";

export default {
  namespaced: true,
  state: {
    token: null,
    status: ''
  },
  mutations: {
    AUTH_REQUEST: (state) => {
      state.status = 'loading';
    },
    AUTH_SUCCESS: (state, token) => {
      state.status = 'success';
      state.token = token;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    },
    AUTH_ERROR: (state) => {
      state.status = 'error';
    },
    AUTH_LOGOUT: (state) => {
      state.token = null;
      state.status = '';
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  actions: {
    register ({commit, dispatch}, params) {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit('AUTH_REQUEST')
        axios.post("/auth/register", params)
          .then(response => {
            const token = response.data.access_token.token;
            commit('AUTH_SUCCESS', token);
            let payload = {
              type: 'success',
              message: 'Have a nice trip on Matis !',
              keepIt: true,
            }
            dispatch('toast/show', payload, {root: true})
            const platforms = response.data.has;
            dispatch('platform/setPlatforms', platforms, {root: true});
            resolve(response);
          })
        .catch(error => {
          commit('AUTH_ERROR', error)
          reject(error)
        })
      })
    },
    login ({commit, dispatch}, params) {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit('AUTH_REQUEST')
        axios.post("/auth/login", params)
          .then(response => {
            const token = response.data.access_token.token;
            commit('AUTH_SUCCESS', token);
            let payload = {
              type: 'success',
              message: 'Welcome back !',
              keepIt: true,
            }
            dispatch('toast/show', payload, {root: true})
            const platforms = response.data.has;
            dispatch('platform/setPlatforms', platforms, {root: true});
            resolve(response);
          })
        .catch(error => {
          commit('AUTH_ERROR', error)
          reject(error)
        })
      })
    },
    refresh ({commit, dispatch}, user) {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit('AUTH_REQUEST')
        axios.get("/auth/token")
          .then(response => {
            const token = response.data.access_token.token;
            commit('AUTH_SUCCESS', token)
            let payload = {
              type: 'success',
              message: 'Back in the game !',
            }
            dispatch('toast/show', payload, {root: true})
            const platforms = response.data.has;
            dispatch('platform/setPlatforms', platforms, {root: true});
            resolve(token)
          })
        .catch(error => {
          commit('AUTH_ERROR', error)
          reject(error)
        })
      })
    },
    logout: ({commit, dispatch}) => {
      return new Promise((resolve, reject) => {
        axios.get("/auth/logout")
          .then(() => {
            commit('AUTH_LOGOUT');
            dispatch('platform/clearPlatforms', undefined, {root: true});
            resolve()
          })
        .catch(error => {
          commit('AUTH_ERROR', error)
          reject(error)
        })
      })
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getToken: state => state.token,
    authStatus: state => state.status,
  },
}