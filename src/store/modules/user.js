export default {
  namespaced: true,
  state: {
    access_token: null,
  },
  mutations: {
    SET_TOKEN (state, token) {
      state.access_token = token;
    },
  },
  actions: {
    setToken ({commit}, token) {
      commit('SET_TOKEN', token);
    },
  },
  getters: {
    getToken: state => {
      return state.access_token;
    }
  },
}