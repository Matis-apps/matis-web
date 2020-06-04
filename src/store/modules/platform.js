export default {
  namespaced: true,
  state: {
    platform: null,
    availables: ['Deezer', 'Spotify'],
    enables: [],
  },
  mutations: {
    SET_PLATFORMS (state, platforms) {
      if (platforms.length > 0) {
        platforms.forEach(p => {
          if(state.availables.includes(p) && !state.enables.includes(p)) {
            state.enables.push(p);
          }
        })
      }
    },
    ADD_PLATFORM (state, platform) {
      if (state.availables.includes(platform) && !state.enables.includes(platform)) {
        state.enables.push(platform);
      }
    },
    SET_CURRENT_PLATFORM (state, platform) {
      state.platform = platform;
    },
  },
  actions: {
    setPlatforms ({commit, dispatch, state}, platforms) {
      commit('SET_PLATFORMS', platforms);
      if (state.platform == null && platforms.length > 0) {
        for(let i = 0; i < platforms.length; i++) {
          let platform = platforms[i];
          if(state.enables.includes(platform)) {
            dispatch('setCurrentPlatform', platform)
            break;
          }
        }
      }
    },
    addPlatform ({commit}, platform) {
      commit('ADD_PLATFORM', platform);
    },
    setCurrentPlatform ({commit, dispatch, state}, platform) {
      if (state.availables.includes(platform) && state.enables.includes(platform)) {
        commit('SET_CURRENT_PLATFORM', platform);
        let payload = {
          type: 'success',
          message: 'Platforme selectionnée : ' + platform,
        }
        dispatch('toast/show', payload, {root: true})
      } else {
        let payload = {
          type: 'error',
          message: "Vous n'avez pas accès à cette plateforme",
        }
        dispatch('toast/show', payload, {root: true})
      }      
    }
  },
  getters: {
    isUsingPlatform: state => !!state.platform,
    getCurrentPlatform: state => {
      return state.platform;
    },
    availablePlatforms: state => {
      return state.availables.map(i => ({
        name: i,
        active: state.enables.includes(i) ? true : false,
        current: i == state.platform ? true : false,
      }));
    }
  },
}