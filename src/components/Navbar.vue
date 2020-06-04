<template>
  <nav class="navbar navbar-default navbar-light bg-white navbar-expand-md fixed-top">
    <router-link class="navbar-brand" to="/" data-toggle="collapse" data-target="#navbarNavDropdown" exact>Matis</router-link>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div v-if="isAuthenticated" class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/account" data-toggle="collapse" data-target="#navbarNavDropdown" exact-path>Account</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/releases" data-toggle="collapse" data-target="#navbarNavDropdown" exact>Releases</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/playlists" data-toggle="collapse" data-target="#navbarNavDropdown" exact>Playlists</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/social" data-toggle="collapse" data-target="#navbarNavDropdown" exact>Social</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/search" data-toggle="collapse" data-target="#navbarNavDropdown" exact>Search</router-link>
        </li>
      </ul>
      <NavbarSelectPlatform
        v-if="isAuthenticated"/>
    </div>
    <div v-else class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/login" data-toggle="collapse" data-target="#navbarNavDropdown" exact>Login</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/register" data-toggle="collapse" data-target="#navbarNavDropdown" exact>Register</router-link>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/get-started" data-toggle="collapse" data-target="#navbarNavDropdown" exact>Get Started</router-link>
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