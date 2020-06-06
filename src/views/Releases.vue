<template>
  <div>
    <ReleasesFeed
      v-if="platform"
      v-bind:platform="platform"
      v-on:startLoading="$emit('startLoading',$event)"
      v-on:success="$emit('success',$event)"
      v-on:error="$emit('error', $event)"/>
  </div>
</template>

<script>
// @ is an alias to /src
import ReleasesFeed from '@/components/ReleasesFeed.vue'

export default {
  name: 'Releases',
  components: {
     ReleasesFeed
  },
  computed: {
    platform: function() {
      return this.$store.getters['platform/getCurrentPlatform'];
    }
  },
}
</script>