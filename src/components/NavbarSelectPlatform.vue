<template>
  <ul class="navbar-nav ml-auto">
    <li class="nav-item dropdown dropleft mx-2">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span v-if="platform">{{platform}}</span>
        <span v-else>Platform</span>
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <a class="dropdown-item" href="#" v-on:click="onSelectPlatform('Deezer')">Deezer</a>
        <a class="dropdown-item" href="#" v-on:click="onSelectPlatform('Spotify')">Spotify</a>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'NavbarSelectPlatform',
  computed: {
    platform: function() {
      return this.$store.getters['platform/getCurrentPlatform'];
    }
  },
  created() {
    const platform = this.$store.getters['platform/getCurrentPlatform'];
    console.log(this.$store.getters)
    console.log(platform)
  },
  methods: {
    onSelectPlatform(item) {
      console.log(item)
      this.$store.dispatch('platform/setCurrentPlatform', item)
    }
  },
};
</script>