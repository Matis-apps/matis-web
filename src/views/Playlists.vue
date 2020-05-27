<template>
  <div>
    <div class="row offset-2 m-1">
      <div class="offset-3 col-6 d-flex justify-content-around">
        <button type="button" class="btn btn-primary my-2">Deezer</button>    
        <button type="button" class="btn btn-primary my-2" disabled>Spotify</button>    
      </div>
    </div>
    <hr>
    <DeezerPlaylists/>
  </div>
</template>

<script>
// @ is an alias to /src
import DeezerPlaylists from '@/components/DeezerPlaylists.vue'

export default {
  name: 'Social',
  components: {
     DeezerPlaylists
  },
  created() {
    
  },
}
</script>
