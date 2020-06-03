<template>
  <div id="social">
    <div v-if="!displayContent" class="d-flex justify-content-center text-muted">
      <div v-show="loading && platform == 'Deezer'" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
      <h3 class="mx-3">Social</h3>
    </div>
    <div>
      <DeezerSocial
        v-if="platform == 'Deezer'"
        v-on:startLoading="$emit('startLoading',$event)"
        v-on:endLoading="onEndLoading"
        v-on:error="onError"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import DeezerSocial from './deezer/DeezerSocial.vue'

export default {
  name: 'SocialFeed',
  props: ['platform'],
  components: {
     DeezerSocial,
  },
  data() {
    return {
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
      this.displayContent = false;
      this.loading = true;
    },
    onStartLoading(message){
      this.$emit('startLoading',message);
    },
    onEndLoading() {
      this.displayContent = true;
      this.loading = false;
    },
    onError(error) {
      this.displayContent = this.displayContent == true ? false : true;
      //this.displayContent = this.displayContent && true;
      this.$emit('error', error);
    }
  }
}
</script>