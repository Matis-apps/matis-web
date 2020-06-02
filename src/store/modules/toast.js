export default {
  namespaced: true,
  state: {
    options : {
      'loading' : {
        theme: 'bubble',
        type: 'info',
        icon : 'check'
      },
      'error' : {
        theme: 'bubble',
        type: 'error',
        icon : 'check',
        action : {
          text : 'Ack',
          onClick : (e, tObj) => {
            tObj.goAway(0);
          }
        }
      },
      'success' : {
        theme: 'bubble',
        type: 'success',
        icon : 'check',
      },
      'default' : {
        theme: 'bubble',
        type: 'info',
        icon : 'check'
      }
    },
  },
  mutations: {
    SHOW_TOAST (state, {type, message}) {
      console.log(type, message)
      let options = state.options[type || 'default'];
      let toast = this._vm.$toasted.show(message, options);
      if (type != 'error') {
        toast.goAway(2500)
      }
    },
  },
  actions: {
    show ({commit}, payload) {
      commit('SHOW_TOAST', {
        type: payload.type, 
        message: payload.message
      });
    }
  },
}