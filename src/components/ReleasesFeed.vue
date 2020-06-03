<template>
  <div id="releases">
    <div v-if="!displayContent" class="d-flex justify-content-center text-muted">
      <div v-show="loading" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
      <h3 class="mx-3">Nouveautés</h3>
    </div>
    <div class="row">
      <div class="col-lg-4 px-lg-6 col-md-5 px-md-4 col-sm-12 px-sm-4 order-2 order-md-12 mx-0">
        <transition name="slide-fade">
          <DeezerReleaseList
            v-if="platform == 'Deezer'"
            v-on:error="onError"
            v-on:startLoading="$emit('startLoading',$event)"
            v-on:endLoading="onEndLoading"
            v-on:showRelease="onRelease"/>

          <SpotifyReleaseList
            v-if="platform == 'Spotify'"
            v-on:error="onError"
            v-on:startLoading="$emit('startLoading',$event)"
            v-on:endLoading="onEndLoading"
            v-on:showRelease="onRelease"/>
        </transition>
      </div>
      <div v-if="displayContent" class="col-lg-8 col-md-7 px-md-4 col-sm-12 px-sm-4 order-1 order-md-12 mx-0">
        <ReleaseContent 
          v-bind:release="selectedRelease"
          v-on:startLoading="$emit('startLoading',$event)"
          v-on:error="$emit('error',$event)"/>
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
      displayContent: false,
      loading: false,
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
    init() {
      this.selectedRelease = null;
      this.displayContent = false;
      this.loading = true;
    },
    onError(error) {
      this.displayContent = false;
      this.loading = false;
      this.$emit('error', error);
    },
    onEndLoading() {
      this.displayContent = true;
      this.loading = false;
    },
    onRelease (item) {
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