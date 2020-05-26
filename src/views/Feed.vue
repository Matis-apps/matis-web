<template>
  <div>
    <div class="row">
      <div class="offset-3 col-6 d-flex justify-content-around">
        <button type="button" class="btn btn-primary my-2" v-on:click="onSelectPlatform('Deezer')">Deezer</button>    
        <button type="button" class="btn btn-primary my-2" disabled>Spotify</button>    
      </div>
    </div>
    <hr>
    <div v-if="selectedPlateform">
      <div>
        <h2 class="ml-5 small font-weight-light">{{selectedPlateform}}</h2>
        <DeezerFeed
           v-if="selectedPlateform === 'Deezer'"/>
      </div>
    </div>
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
  data() {
    return {
      selectedPlateform: 'Selectionnez une plateforme ci-dessus',
    }
  },
  created() {
    //
  },
  methods: {
    onSelectPlatform: function(p) {
      this.selectedPlateform = p;
      console.log(this.selectedPlateform)
    }
  }
}
</script>