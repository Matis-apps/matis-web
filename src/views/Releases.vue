<template>
  <div>
    <h2 class="ml-5 small font-weight-light">
      <span v-if="platform">{{platform}}</span>
      <span v-else>Selectionnez une plateforme ci-dessus</span>
    </h2>
    <ReleasesFeed
      v-if="platform"
      v-bind:platform="platform"
      v-on:startLoading="$emit('startLoading',$event)"
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