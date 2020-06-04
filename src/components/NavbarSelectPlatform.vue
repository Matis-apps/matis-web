<template>
  <ul class="navbar-nav ml-auto">
    <li class="nav-item dropdown dropleft mx-2" v-if="platforms">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span v-if="platform">{{platform}}</span>
        <span v-else>Platform</span>
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <button type="button" class="dropdown-item btn btn-link" data-toggle="collapse" data-target="#navbarNavDropdown.show"
          v-bind:class="{ 'text-muted font-italic font-weight-light': !isActive(platform), 'text-success font-weight-bold': isCurrent(platform) }"
          v-for="platform in platforms"
          v-bind:key="platform.name"
          v-on:click="onSelectPlatform(platform)">
            {{ platform.name }}
        </button>

      </div>
    </li>
    <li class="nav-item">
      <router-link class="nav-link text-danger" to="/logout" data-toggle="collapse" data-target="#navbarNavDropdown.show" exact>Logout</router-link>
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
      this.$store.dispatch('platform/setCurrentPlatform', item.name)
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