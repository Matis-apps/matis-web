<template>
  <nav class="navbar navbar-default navbar-dark bg-white navbar-expand-md fixed-top">
    <router-link class="navbar-brand" to="/" exact>Matis</router-link>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon">
        <i class="text-secondary medium material-icons">menu</i>
      </span>
    </button>
    <div v-if="isAuthenticated" class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/account" exact-path>Account</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/releases" exact>Releases</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/playlists" exact>Playlists</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/social" exact>Social</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/search" exact>Search</router-link>
        </li>
      </ul>
      <NavbarSelectPlatform
        v-if="isAuthenticated"/>
    </div>
    <div v-else class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/login" exact>Login</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/register" exact>Register</router-link>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/get-started" exact>Get Started</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import NavbarSelectPlatform from './NavbarSelectPlatform.vue'

export default {
  name: 'Navbar',
  components: {
    NavbarSelectPlatform
  },
  computed: {
    isAuthenticated: function() {
      return this.$store.getters['auth/isAuthenticated'];
    }
  },
  data() {
    return {
      //
    };
  },
  methods: {
    
  },
};
</script>

<style lang="scss">
nav {
  border-bottom: solid #9286e2;
}
</style>