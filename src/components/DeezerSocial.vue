<template>
  <div>
    <div class="row justify-content-center">
      <div v-show="loadingReleases">
        <div class="alert alert-secondary">
          <div class="spinner-border text-success" role="status"></div>
          <span class="mx-3">Loading the new releases related to your feed...</span>      
        </div>
      </div>
      <div v-if="errorMessage">
        <div class="alert alert-secondary">
          <div class="spinner-grow text-danger" role="status"></div>
          <span class="sr-only">Code d'erreur {{ errorMessage.code }}: {{errorMessage.message}}</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="social offset-1 col-3">
        <transition name="slide-fade" >
          <div v-if="releases.length > 0">
            <p class="font-weight-lighter text-left">{{ releases.length }} items <span class="small"> (en {{processingTime}} s.)</span></p>
            <div class="card mb-2" :class="{ 'border-primary' : releaseDays(item.content.updated_at) == 0 }" v-for="(item, index) in releases" v-bind:key="item._uid">
              <div class="card-header d-flex justify-content-between">
                <img v-show="item.author.picture" :src="item.author.picture" class="card-img-top img-fluid rounded" alt="picture artist" style="max-height: 50px; max-width: 50px;">
                <p>{{ capitalize(item.content.type) }} by <span class="font-weight-bold">{{ item.author.name }}</span></p>
              </div>
              <div class="card-body text-left">
                <h5 class="card-title"><b>#{{index+1}}</b><small> | {{ item.content.title }}</small></h5>
                <p class="small" v-if="releaseDays(item.content.updated_at) > 0">Il y a {{ releaseDays(item.content.updated_at) }} jours ({{ item.content.updated_at }})</p>
                <p class="small" v-else-if="releaseDays(item.content.updated_at) < 0">Sortie prévue dans {{ Math.abs(releaseDays(item.content.updated_at)) }} jours ({{ item.content.updated_at }})</p>
                <p class="small" v-else>Sortie aujourd'hui</p>
                <img :src="item.content.picture" class="img-fluid rounded" alt="picture artist" v-if="item.content.picture">
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-link" v-on:click="clickOnRelease(item)">Voir plus</button>
                </div>
              </div>
            </div>
          </div>
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
import ReleaseContent from './ReleaseContent.vue'

export default {
  name: 'DeezerSocial',
  components: {
     ReleaseContent
  },
  data() {
    return {
      user_id: 16192550,
      releases: [],
      errorMessage: null,
      loadingReleases: false,
      countReleases: 0,
      processingTime:0,
      selectedRelease: null
    }
  },
  computed: {
    progress: function () {
      return Math.ceil((this.loadedArtists + this.loadedPlaylists)/this.countReleases*100);
    },
    progressPercent: function () {
      return this.progress + "%"
    },
    progressStyle: function () {
      return "width: " + this.progress + "%"
    },
  },
  created() {
    this.fetchReleases();
  },
  methods: {
    releaseDays: function (day) {
      var dateofvisit = this.$moment(day, 'YYYY-MM-DD-MM');
      var today = this.$moment();
      return today.diff(dateofvisit, 'days');
    },
    capitalize: function (s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    clickOnRelease: function(item) {
      this.selectedRelease = item;
    },
    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    fetchReleases () {
      this.loadingReleases = true;
      let start = Date.now();
      this.$axios.get("http://localhost:3000/deezer/releases")
        .then((response) => {
          let end = Date.now();
          if (response.status === 200) {
            this.releases = response.data.data;
            this.countReleases = response.data.count;
            this.processingTime = (end - start)/1000;
            this.loadingReleases = false;
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          this.loadingReleases = false;
        });
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