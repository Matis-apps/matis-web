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
      if(state.toasts.length > 8) { // limit the number of toasts displayed
        if (state.toasts[state.toasts.length-1].alert) state.toasts[state.toasts.length-1].alert.goAway(0);
        state.toasts.pop();
      }

      let toast = {message, type, keepIt}

      if (keepIt === true) {
        let options = state.options[type||'default'];
        let alert = this._vm.$toasted.show(message, options);
        alert.goAway(5000)
        toast.alert = alert;
      }

      state.toasts.unshift(toast);
    },
    CLEAR_TOASTS (state) {
      for (let i = 0; i < state.toasts.length; i++) {
        if(state.toasts[i].alert) {
          state.toasts[i].alert.goAway(3000);
        }
      }
      state.toasts = [];
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
  getters: {
    getToasts: state => state.toasts,
    getWorstSTatus: state => {
      if (state.toasts.find(t => t.type == 'error')) {
        return 'badge-danger'
      }
      else if (state.toasts.find(t => t.type == 'success')) {
        return 'badge-success'
      }
      else {
        return 'badge-primary';
      }
    },
  }
}