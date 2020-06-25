<template>
  <ul class="navbar-nav ml-auto">
    <li class="nav-item dropdown" v-if="platforms">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span v-if="currentPlatform">{{currentPlatform}}</span>
        <span v-else>Platform</span>
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <button type="button" class="dropdown-item btn btn-link" data-toggle="collapse" data-target="#navbarNavDropdown.show"
          v-bind:class="{ 'text-muted font-italic font-weight-light': !isEnable(platform), 'text-success font-weight-bold': isCurrent(platform) }"
          v-for="platform in platforms"
          v-bind:key="platform.name"
          v-on:click="onSelectPlatform(platform)">
            {{ platform.name }}
        </button>

      </div>
    </li>

    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarNotif" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Notifications
        <span v-show="countNotify > 0" class="badge badge-pill" :class="notifyStatus">{{countNotify}}</span>
      </a>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarNotif">
        <a v-if='countNotify <= 0' class="dropdown-item d-flex align-items-center font-italic small" href="#">
          Rien à déclarer chef !
        </a>
        <a class="dropdown-item d-flex align-items-center" href="#"
          v-for="(notify, index) in notifications"
          v-bind:key="index">
          <i v-if="notify.type == 'error'" class="tiny small text-danger material-icons mr-2">add_alert</i>
          <i v-else-if="notify.type == 'loading'" class="tiny small text-primary material-icons mr-2">hourglass_empty</i>
          <i v-else-if="notify.type == 'success'" class="tiny small text-success material-icons mr-2">check</i>
          <i v-else class="tiny small text-primary material-icons mr-2">info_outline</i>
          {{notify.message}}
          <div class="dropdown-divider"></div>
        </a>
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
      return this.$store.getters['platform/enabledPlatforms'];
    },
    currentPlatform: function() {
      return this.$store.getters['platform/getCurrentPlatform'];
    },
    countNotify: function() {
      return this.notifications.length;
    },
    notifications: function() {
      return this.$store.getters['toast/getToasts'];
    },
    notifyStatus: function() {
      return this.$store.getters['toast/getWorstSTatus'];
    }
  },
  created() {
    //
  },
  methods: {
    onSelectPlatform(item) {
      this.$store.dispatch('platform/setCurrentPlatform', item.name)
    },
    isEnable: function(item) {
      return item.enable;
    },
    isCurrent: function(item) {
      return item.current;
    }
  },
};
</script>
