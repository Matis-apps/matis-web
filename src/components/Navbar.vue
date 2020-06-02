<template>
  <nav class="navbar navbar-expand-lg">
    <a class="navbar-brand" href="#">Matis</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav mr-auto" v-if="isAuthenticated">
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
      <ul class="navbar-nav mr-auto" v-else>
        <li class="nav-item">
          <router-link class="nav-link" to="/login" exact>Login</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/register" exact>Register</router-link>
        </li>
      </ul>
      <NavbarSelectPlatform/>
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