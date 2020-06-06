<template>
  <div id="app">
    <div id="nav">
      <Navbar/>
    </div>
    <div id="view" class="container-fluid mb-2">
      <router-view
        v-on:startLoading="showLoading"
        v-on:success="showSuccess"
        v-on:error="showError"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
     Navbar, 
  },
  methods: {
    showLoading(message) {
      let payload = {
        type: 'loading',
        message: message
      }
      this.$store.dispatch('toast/show', payload)
    },
    showSuccess(message) {
      let payload = {
        type: 'success',
        message: message
      }
      this.$store.dispatch('toast/show', payload)
    },
    showError(error) {
      let payload = {
        type: 'error',
      }

      if(error.response) {
        if (error.response.data && error.response.data.error) {
          payload.message = error.response.data.error.message||error.response.statusText;
        } else {
          payload.message = error.response.message||error.response.statusText;
        }
      } else {
        payload.message = error.message||error;
      }
      this.$store.dispatch('toast/show', payload)
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 0.96em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      font-weight: bold;
      color: #86a8e2;
    }
  }
}
</style>
