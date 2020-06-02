<template>
  <div id="releases">
    <div v-show="loadingReleases" class="row">
      <div class="mx-auto" style="width: 400px;">
        <div class="alert alert-secondary text-center">
          <div class="spinner-border text-success" role="status"></div>
          <span class="mx-3">Chargement des nouveautés...</span>      
        </div>
      </div>
    </div>
    <div v-if="platform" class="row">
      <div class="social offset-1 col-3">
        <transition name="slide-fade" >
          <DeezerReleaseList
            v-if="platform == 'Deezer'"
            v-on:error="onError"
            v-on:endingLoad="onEndingLoad"
            v-on:showRelease="onRelease"/>

          <SpotifyReleaseList
            v-if="platform == 'Spotify'"
            v-on:error="onError"
            v-on:endingLoad="onEndingLoad"
            v-on:showRelease="onRelease"/>
        </transition>
      </div>
      <div v-if="displayContent" class="col-7">
        <ReleaseContent 
          v-bind:release="selectedRelease"
          v-on:error="onError"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import DeezerReleaseList from './deezer/DeezerReleaseList.vue'
import SpotifyReleaseList from './spotify/SpotifyReleaseList.vue'
import ReleaseContent from './ReleaseContent.vue'

export default {
  name: 'ReleasesFeed',
  props: ['platform'],
  components: {
     DeezerReleaseList,
     SpotifyReleaseList,
     ReleaseContent,
  },
  data() {
    return {
      selectedRelease: null,

      loadingReleases: false,
      displayContent: false,
    }
  },
  mounted() {
    this.init();
  },
  watch: { 
    platform: function(newVal, oldVal) { // watch it
      if(newVal) {
        this.init();
      }
    }
  },
  methods: {
    init: function() {
      this.selectedRelease = null;
      this.loadingReleases = true;
      this.displayContent = false;

      this.showLoading('Chargement des nouveautés...');
    },
    showLoading(message) {
      let payload = {
        type: 'loading',
        message: message
      }
      this.$store.dispatch('toast/show', payload)
    },
    onError: function (error) {
      this.displayContent = false;

      let payload = {
        type: 'error',
      }
      if(error.response) {
        if (error.response.data && error.response.data.error) {
          payload.message = error.response.data.error.message||error.response.statusText;
        } else {
          payload.message = error.response.message||error.response.statusText;
        }
      } else {
        payload.message = error.message;
      }
      this.$store.dispatch('toast/show', payload)
    },
    onEndingLoad: function () {
      this.loadingReleases = false;
      this.displayContent = true;
      this.$emit('endingLoad');
    },
    onRelease: function (item) {
      this.selectedRelease = item;
    },
  }
}
</script>

<style type="text/css">
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>