<template>
  <ul class="navbar-nav ml-auto">
    <li class="nav-item dropdown dropleft mx-2" v-if="platforms">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span v-if="platform">{{platform}}</span>
        <span v-else>Platform</span>
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <a class="dropdown-item" href="#"
          v-bind:class="{ 'text-muted': !isActive(platform), 'text-success': isCurrent(platform) }" 
          v-for="platform in platforms"
          v-bind:key="platform.name"
          v-on:click="onSelectPlatform(platform)">
            {{ platform.name }}
          </a>
      </div>
    </li>
    <li class="nav-item">
      <router-link class="nav-link text-danger" to="/logout" exact>Logout</router-link>
    </li>
  </ul>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: 'NavbarSelectPlatform',
  computed: {
    platforms: function() {
      return this.$store.getters['platform/availablePlatforms'];
    },
    platform: function() {
      return this.$store.getters['platform/getCurrentPlatform'];
    }
  },
  created() {
    // 
  },
  methods: {
    onSelectPlatform(item) {
      if (this.isActive(item)) {
        this.$store.dispatch('platform/setCurrentPlatform', item.name)
      }
    },
    isActive: function(item) {
      return item.active;
    },
    isCurrent: function(item) {
      return item.current;
    }
  },
};
</script>