const tokenKey = 'token';

export default {
  namespaced: true,
  state: {
    token: null,
    status: ''
  },
  mutations: {
    AUTH_REQUEST: (state) => {
      state.status = 'loading'
    },
    AUTH_SUCCESS: (state, token) => {
      state.status = 'success'
      state.token = token
    },
    AUTH_ERROR: (state) => {
      state.status = 'error'
    },
  },
  actions: {
    AUTH_REQUEST ({commit, dispatch}, user) {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit(AUTH_REQUEST)
        this.$axios.post(process.env.VUE_APP_ROOT_API + "/auth/login", user)
          .then(resp => {
            const token = resp.data.data.access_token
            this.$axios.defaults.headers.common['Authorization'] = token
            commit(AUTH_SUCCESS, token)
            dispatch(USER_REQUEST)
            resolve(resp)
          })
        .catch(err => {
          commit(AUTH_ERROR, err)
          reject(err)
        })
      })
    },
    AUTH_LOGOUT: ({commit, dispatch}) => {
      return new Promise((resolve, reject) => {
        commit(AUTH_LOGOUT)
        delete this.$axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
  },
}