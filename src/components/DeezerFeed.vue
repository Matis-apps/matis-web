<template>
  <div>
    <div id="releases">
      <div v-show="loadingReleases" class="row justify-content-center">
        <div class="alert alert-secondary">
          <div class="spinner-border text-success" role="status"></div>
          <span class="mx-3">Loading the new releases related to your feed...</span>      
        </div>
      </div>
      <div v-if="errorMessage" class="row justify-content-center">
        <div class="alert alert-secondary">
          <div class="spinner-grow text-danger" role="status"></div>
          <span class="mx-3 small">{{errorMessage}}</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="social offset-1 col-3">
        <transition name="slide-fade" >
          <DeezerReleaseList
            v-on:error="onError"
            v-on:endingLoad="onEndingLoad"
            v-on:showRelease="onRelease"/>
        </transition>
      </div>
      <div class="col-7">
        <ReleaseContent 
          v-show="selectedRelease"
          v-bind:release="selectedRelease"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import DeezerReleaseList from './DeezerReleaseList.vue'
import ReleaseContent from './ReleaseContent.vue'

export default {
  name: 'DeezerFeed',
  components: {
     DeezerReleaseList,
     ReleaseContent
  },
  data() {
    return {
      errorMessage: null,
      loadingReleases: false,
      selectedRelease: null
    }
  },
  computed: {
    //
  },
  created() {
    this.loadingReleases = true;
  },
  methods: {
    onError: function (event) {
      this.errorMessage = event;
    },
    onEndingLoad: function () {
      this.loadingReleases = false;
    },
    onRelease: function (item) {
      this.selectedRelease = item;
    }
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