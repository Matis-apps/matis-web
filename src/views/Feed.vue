<template>
  <div>
    <DeezerFeed/>
  </div>
</template>

<script>
// @ is an alias to /src
import DeezerFeed from '@/components/DeezerFeed.vue'

export default {
  name: 'Feed',
  components: {
     DeezerFeed
  },
  created() {
    //
  },
}
</script>