export default {
  namespaced: true,
  state: {
    platform: null,
    availables: ['Deezer', 'Spotify'],
    enables: [],
  },
  mutations: {
    SET_PLATFORMS (state, platforms) {
      state.enables = platforms;
    },
    ADD_PLATFORM (state, platform) {
      if (state.enables.includes(platform)) {
        state.enables.push(platform);
      }
    },
    SET_CUURENT_PLATFORM (state, platform) {
      if (state.availables.includes(platform) /*&& state.enables.includes(platform)*/) {
        state.platform = platform;
        console.log(state.platform)
      }
    },
  },
  actions: {
    setPlatforms ({commit}, platforms) {
      commit('SET_PLATFORMS', platforms);
    },
    addPlatform ({commit}, platform) {
      commit('ADD_PLATFORM', platform);
    },
    setCurrentPlatform ({commit}, platform) {
      commit('SET_CUURENT_PLATFORM', platform);
    }
  },
  getters: {
    getCurrentPlatform: state => {
      return state.platform;
    },
    availablePlatforms: state => {
      return state.availables.some(i => i.active = state.enables.includes(i) ? true : false);
    }
  },
}