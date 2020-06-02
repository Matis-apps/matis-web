<template>
  <div>
    <h2>Only Deezer supported</h2>
    <hr>
    <DeezerSocial/>
  </div>
</template>

<script>
// @ is an alias to /src
import DeezerSocial from '@/components/deezer/DeezerSocial.vue'

export default {
  name: 'Social',
  components: {
     DeezerSocial
  },
  created() {
    
  },
}
</script>
