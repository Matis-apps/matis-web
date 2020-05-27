<template>
  <div>
    <div class="row" id="buttonsSection">      
      <div class="offset-3 col-6 d-flex justify-content-around">
        <button type="button" class="btn btn-primary my-2" v-on:click="onSelectPlatform('deezer')">Deezer</button>    
        <button type="button" class="btn btn-primary my-2" v-on:click="onSelectPlatform('spotify')">Spotify</button>    
      </div>
    </div>
    <hr>
    <PlaylistsFeed
      v-if="selectedPlateform"
      v-bind:platform="selectedPlateform"
      v-on:endingLoad="onEndingLoad"/>
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
