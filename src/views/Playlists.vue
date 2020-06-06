<template>
  <div>
    <PlaylistsFeed
      v-if="platform"
      v-bind:platform="platform"
      v-on:startLoading="$emit('startLoading',$event)"
      v-on:success="$emit('success',$event)"
      v-on:error="$emit('error',$event)"/>
  </div>
</template>

<script>
// @ is an alias to /src
import PlaylistsFeed from '@/components/PlaylistsFeed.vue'

export default {
  name: 'Social',
  components: {
     PlaylistsFeed
  },
  computed: {
    platform: function() {
      return this.$store.getters['platform/getCurrentPlatform'];
    },
  },
}
</script>
