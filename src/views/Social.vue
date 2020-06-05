<template>
  <div>
    <h2 class="small font-weight-bold">
      <span v-if="platform != 'Deezer'" class="text-danger">Disponible seulement sur Deezer</span>
    </h2>
    <SocialFeed
      v-if="platform"
      v-bind:platform="platform"
      v-on:startLoading="$emit('startLoading',$event)"
      v-on:error="$emit('error', $event)"/>
  </div>
</template>

<script>
// @ is an alias to /src
import SocialFeed from '@/components/SocialFeed.vue'

export default {
  name: 'Social',
  components: {
     SocialFeed
  },
  computed: {
    platform: function() {
      return this.$store.getters['platform/getCurrentPlatform'];
    },
  },
}
</script>
