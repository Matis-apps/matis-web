<template>
  <div id="playplist">
    <div v-if="playlists.length == 0" class="d-flex justify-content-center text-muted">
      <div v-show="loadingPlaylists" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
      <h3 class="mx-3">Playlists</h3>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-lg-4 px-lg-6 col-md-5 px-md-4 col-sm-12 px-sm-4 order-2 order-md-12 mx-0">
          <div class="card bg-light mb-3" style="border-color: #9286e2;">
            <div class="card-header">Voir l'activitié des artistes dans la playlist</div>
            <div class="card-body text-success">
              <div class="row" v-if="selectedPlaylist">
                <div class="col-6 text-left">
                  <img class="img-fluid rounded" v-bind:src="selectedPlaylist.picture">
                </div>
                <div class="col-6 text-right">
                  <h5 class="card-title" style="color: #9286e2;">{{selectedPlaylist.name}}</h5>
                  <p class="card-text"><a :href="selectedPlaylist.link" target="_blank">Lien</a></p>
                </div>            
              </div>
              <div v-else class="alert alert-warning">
                <p class="mb-0">Selectionne une playlist dans la liste.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8 col-md-7 px-md-4 col-sm-12 px-sm-4 order-1 order-md-12 mx-0 align-self-center">
          <p class="small">{{playlists.length}} playlists</p>
          <select class="mb-2 custom-select" @change="onChangePlaylist($event)">
            <option v-for="playlist in playlists" 
              v-bind:key="'playlist-'+playlist.id"
              :value="playlist.id">
              {{playlist.name}}
            </option>
          </select>
        </div>
      </div>
      <div v-if="!displayContent" class="d-flex justify-content-center text-muted">
        <div v-show="loadingReleases" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
        <h3 class="mx-3">Nouveautés</h3>
      </div>
      <div class="row">
        <div class="col-lg-4 px-lg-6 col-md-5 px-md-4 col-sm-12 px-sm-4 order-2 order-md-12 mx-0">
          <transition name="slide-fade">
            <ReleasesList
              v-if="releases.length > 0"
              v-bind:releases="releases"
              v-bind:processingTime="processingTime"
              v-on:showRelease="onShowRelease"/>
            </transition>
        </div>
        <div v-if="displayContent" class="col-lg-8 col-md-7 px-md-4 col-sm-12 px-sm-4 order-1 order-md-12 mx-0">
          <ReleaseContent 
            v-bind:release="selectedRelease"
            v-on:startLoading="$emit('startLoading',$event)"
            v-on:success="$emit('success',$event)"
            v-on:error="$emit('error',$event)"/>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// @ is an alias to /src
import axios from "axios";
import ReleasesList from './ReleasesList.vue'
import ReleaseContent from './ReleaseContent.vue'

export default {
  name: 'PlaylistsFeed',
  props: ['platform'],
  components: {
    ReleasesList,
    ReleaseContent,
  },
  data() {
    return {
      releases: [],
      playlists: [],
      selectedPlaylist: null,
      displayContent: false,
      loadingReleases: false,
      loadingPlaylists: false,
      selectedRelease: null,
      processingTime: 0,
    }
  },
  mounted() {
    this.init();
  },
  watch: { 
    platform: function(newVal, oldVal) { // watch it
      if(newVal) this.init();
    },
    selectedPlaylist: function(newVal, oldVal) {
      if (newVal) this.fetchReleases(newVal.id);
    }
  },
  methods: {
    init() {
      // init arrays
      this.playlists = [];

      // nullable variables
      this.selectedPlaylist = null;

      // init booleans
      this.displayContent = false;
      this.loadingPlaylists = false;
      this.loadingReleases = false;

      this.initPlaylistList()

      // load the friends
      this.fetchPlaylists();
    },
    initPlaylistList() {
      this.releases = [];
      this.selectedRelease = null;
    },
    fetchPlaylists () {
      this.loadingPlaylists = true;
      this.$emit('startLoading', 'Chargement des playlists...');

      const url = "/"+this.platform.toLowerCase()+"/me/playlists";
      axios.get(url)
        .then((response) => {
          this.loadingPlaylists = false;
          if (response.status === 200 && response.data.data) {
            response.data.data.forEach(playlist => (
              this.playlists.push(playlist)
            ));
            this.$emit('success', 'Récupération des playlists avec succès !');
          }
          this.$emit('endLoading');
        })
        .catch((error) => {
          this.loadingPlaylists = false;
          this.$emit('endLoading');
          this.$emit('error', error);
        });
    },
    fetchReleases (id) {
      this.initPlaylistList();
      this.$emit('startLoading', 'Chargement de la playlist...');

      setTimeout(this.stillAlive, 15000);
      this.loadingReleases = true;
      let start = Date.now();
      const url = "/"+this.platform+"/me/playlist/" + id + "/releases"
      axios.get(url)
        .then((response) => {
          let end = Date.now();
          if (response.status === 200) {
            this.releases = response.data.data;
            this.releases.map(r => r.display = true);
            this.processingTime = (end - start)/1000;
            this.displayContent = true;
            this.$emit('success', 'Récupération des nouveautés de la playlist avec succès !');
          }
        })
        .catch((error) => {
          this.displayContent = false;
          this.$emit('error', error);
        })
        .finally(() => {
          this.loadingReleases = false;
          this.$emit('endLoading');
        });
    },
    stillAlive() {
      if (this.loadingReleases) {
        this.$emit('startLoading','Cela prend un peu de temps...');
        setTimeout(this.stillAlive, 15000);
      }
    },
    onChangePlaylist(event) {
      this.initPlaylistList()
      this.displayContent = false;

      const playlist_id = event.target.value;
      this.selectedPlaylist = this.playlists.find(item => {
        return item.id == playlist_id;
      })
      this.loadingReleases = true;
    },
    onError: function (error) {
      this.$emit('error', error);
    },
    onShowRelease: function (item) {
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