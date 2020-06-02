export default {
  namespaced: true,
  state: {
    platform: null,
    availables: ['Deezer', 'Spotify', 'Test'],
    enables: [],
  },
  mutations: {
    SET_PLATFORMS (state, platforms) {
      if (platforms.length > 0) {
        platforms.forEach(p => {
          if(state.availables.includes(p)) {
            state.enables.push(p);
          }
        })
      }
    },
    ADD_PLATFORM (state, platform) {
      if (state.enables.includes(platform)) {
        state.enables.push(platform);
      }
    },
    SET_CURRENT_PLATFORM (state, platform) {
      if (state.availables.includes(platform) && state.enables.includes(platform)) {
        state.platform = platform;
      }
    },
  },
  actions: {
    setPlatforms ({commit, state}, platforms) {
      commit('SET_PLATFORMS', platforms);
      if (state.platform == null && platforms.length > 0) {
        for(let i = 0; i < platforms.length; i++) {
          if(state.enables.includes(platforms[i])) {
            commit('SET_CURRENT_PLATFORM', platforms[i])
            break;
          }
        }
      }
    },
    addPlatform ({commit}, platform) {
      commit('ADD_PLATFORM', platform);
    },
    setCurrentPlatform ({commit}, platform) {
      commit('SET_CURRENT_PLATFORM', platform);
    }
  },
  getters: {
    getCurrentPlatform: state => {
      return state.platform;
    },
    availablePlatforms: state => {
      return state.availables.map(i => ({
        name: i, 
        active: state.enables.includes(i) ? true : false, 
        current: i == state.platform ? true : false 
      }));
    }
  },
}