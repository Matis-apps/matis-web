export default {
  namespaced: true,
  state: {
    toasts: [],
    options : {
      'loading' : {
        theme: 'bubble',
        type: 'info',
        icon : 'hourglass_empty',
        action : {
          text : 'Wait',
          class: 'text-white',
          onClick : (e, tObj) => {
            tObj.goAway(0);
          }
        },
      },
      'error' : {
        theme: 'bubble',
        type: 'error',
        icon : 'error',
        action : {
          text : 'Ack',
          class: 'text-white',
          onClick : (e, tObj) => {
            tObj.goAway(0);
          }
        },
      },
      'success' : {
        theme: 'bubble',
        type: 'success',
        icon : 'check',
        action : {
          text : 'Good',
          class: 'text-white',
          onClick : (e, tObj) => {
            tObj.goAway(0);
          }
        },
      },
      'default' : {
        theme: 'bubble',
        type: 'info',
        icon : 'info_outline',
        action : {
          text : 'OK',
          class: 'text-white',
          onClick : (e, tObj) => {
            tObj.goAway(0);
          }
        },
      }
    },
  },
  mutations: {
    SHOW_TOAST (state, {type, message, keepIt}) {
      let options = state.options[type || 'default'];
      let toast = this._vm.$toasted.show(message, options);
      toast.keepIt = keepIt;
      if (type != 'error') {
        toast.goAway(5000)
      } else {
        toast.goAway(30000)
      }
      state.toasts.push(toast);
    },
    CLEAR_TOASTS (state) {
      for (let i = 0; i < state.toasts.length; i++) {
        if(!state.toasts[i].keepIt) {
          state.toasts[i].goAway(0);
        } else {
          state.toasts[i].goAway(2500);
        }
        state.toasts.slice(i, 1);
      }
    }
  },
  actions: {
    show ({commit}, payload) {
      commit('SHOW_TOAST', {
        type: payload.type, 
        message: payload.message,
        keepIt: payload.keepIt||false
      });
    },
    clearStates({commit}) {
      commit('CLEAR_TOASTS')
    }
  },
}