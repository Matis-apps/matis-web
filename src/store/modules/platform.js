export default {
  namespaced: true,
  state: {
    platform: null,
    platforms: [
      {name: 'Deezer', switched: true, enable: false}, 
      {name: 'Spotify', switched: true, enable: false}, 
      {name: 'Discogs', switched: false, enable: false}
    ],
  },
  mutations: {
    SET_PLATFORMS (state, platforms) {
      if (platforms.length > 0) {
        state.platforms.map(p => p.enable = platforms.includes(p.name));
      }
    },
    SET_CURRENT_PLATFORM (state, platform) {
      state.platform = platform;
    },
    CLEAR_PLATFORMS (state) {
      state.platform = null;
      state.platforms.map(p => p.enable = false);
    }
  },
  actions: {
    setPlatforms ({commit, dispatch, state}, platforms) {
      commit('SET_PLATFORMS', platforms);
      const first = state.platforms.find(p => p.switched && p.enable);
      if (state.platform == null && first) {
        dispatch('setCurrentPlatform', first.name)
      }
    },
    clearPlatforms ({commit}) {
      commit('CLEAR_PLATFORMS');
    },
    setCurrentPlatform ({commit, dispatch, state}, platformName) {
      const newCurrent = state.platforms.find(p => p.enable && p.name == platformName);
      if (newCurrent) {
        if(newCurrent.switched) {
          commit('SET_CURRENT_PLATFORM', newCurrent.name);
          let payload = {
            type: 'success',
            message: 'Platforme selectionnée : ' + newCurrent.name,
          }
          dispatch('toast/show', payload, {root: true})
        } else {
          let payload = {
            type: 'default',
            message: 'Cette plateforme n\'est pas ouverte à la navigation : ' + newCurrent.name,
          }
          dispatch('toast/show', payload, {root: true})
        }
        
      } else {
        let payload = {
          type: 'error',
          message: "Vous n'avez pas accès à cette plateforme : " + platformName,
          keepIt: true,
        }
        dispatch('toast/show', payload, {root: true})
      }      
    }
  },
  getters: {
    isUsingPlatform: state => !!state.platform,
    getCurrentPlatform: state => state.platform,
    availablePlatforms: state => state.platforms,
    enabledPlatforms: state => {
      return Array.from(state.platforms).filter(p => p.switched).map(i => ({
        name: i.name,
        enable: i.enable,
        current: i.name == state.platform,
      }));
    },
    isEnabled: (state) => (platformName) => {
      return state.platforms.find(p => p.name == platformName).enable;
    }
  },
}