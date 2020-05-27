<template>
  <div>
    <div class="row" id="buttonsSection">
      <div class="offset-3 col-6 d-flex justify-content-around">
        <button type="button" class="btn btn-primary my-2" v-on:click="onSelectPlatform('deezer')">Deezer</button>    
        <button type="button" class="btn btn-primary my-2" v-on:click="onSelectPlatform('spotify')">Spotify</button>    
      </div>
    </div>
    <hr>
    <div>
      <h2 class="ml-5 small font-weight-light">
        <span v-if="selectedPlateform">{{selectedPlateform}}</span>
        <span v-else>Selectionnez une plateforme ci-dessus</span>
      </h2>
      <PlatformFeed
         v-if="selectedPlateform"
         v-bind:platform="selectedPlateform"
         v-on:endingLoad="onEndingLoad"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PlatformFeed from '@/components/PlatformFeed.vue'

export default {
  name: 'Feed',
  components: {
     PlatformFeed
  },
  data() {
    return {
      selectedPlateform: null,
    }
  },
  created() {

  },
  methods: {
    onSelectPlatform: function(p) {
      this.selectedPlateform = p;
      var buttons = document.querySelectorAll("#buttonsSection button");
      if (buttons.length > 0) {
        buttons.forEach(button => {
          button.disabled = true;
        })
      }
    },
    onEndingLoad: function(e) {
      var buttons = document.querySelectorAll("#buttonsSection button");
      if (buttons.length > 0) {
        buttons.forEach(button => {
          button.disabled = false;
        })
      }
    }
  }
}
</script>