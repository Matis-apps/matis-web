<template>
  <div>
    <div id="selectPlaylist">
      <div v-if="loadingPlaylists" class="row justify-content-center">
        <div class="mx-auto" style="width: 400px;">
          <div class="alert alert-secondary text-center">
            <div class="spinner-border text-success" role="status"></div>
            <span class="mx-3">Chargement des playlists...</span>      
          </div>
        </div>
      </div>
      <div class="row">
        <div class="offset-1 col-3">
          <div class="card bg-light border-success mb-3">
            <div class="card-header">Voir l'activitié des artists dans la playlist</div>
            <div class="card-body text-success">
              <div class="row" v-if="selectedPlaylist">
                <div class="col-6">
                  <h5 class="card-title">{{selectedPlaylist.name}}</h5>
                  <p class="card-text"><a :href="selectedPlaylist.link" target="_blank">Lien</a></p>
                </div>
                <div class="col-6">
                  <img class="img-fluid" v-bind:src="selectedPlaylist.picture">
                </div>            
              </div>
              <div v-else class="alert alert-warning">
                <p class="mb-0">Selectionne une playlist dans la liste.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-7 align-self-center">
          <p><small>{{playlists.length}} playlists</small></p>
          <select class="custom-select" @change="onChangePlaylist($event)">
            <option v-for="playlist in playlists" 
              v-bind:key="'playlist-'+playlist.id"
              :value="playlist.id">
              {{playlist.name}}
            </option>
          </select>
        </div>
      </div>
      <div v-show="loadingReleases" class="row">
        <div class="mx-auto" style="width: 400px;">
          <div class="alert alert-secondary text-center">
            <div class="spinner-border text-success" role="status"></div>
            <span class="mx-3">Chargement des nouveautés...</span>      
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="offset-1 col-3">
        <ReleasesList
          v-if="releases.length > 0"
          v-bind:releases="releases"
          v-bind:processingTime="processingTime"
          v-on:showRelease="onShowRelease"/>
      </div>
      <div v-if="selectedRelease" class="col-7">
        <ReleaseContent 
          v-bind:release="selectedRelease"
          v-on:error="onError"/>
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
      if(newVal) {
        this.init();
      }
    },
    selectedPlaylist: function(newVal, oldVal) {
      this.fetchReleases(newVal.id);
    }
  },
  methods: {
    init() {
      // init arrays
      this.playlists = [];

      // nullable variables
      this.selectedPlaylist = null;

      // init booleans
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
      this.showLoading('Chargement des playlists...');
      const url = "/"+this.platform+"/me/playlists";
      axios.get(url)
        .then((response) => {
          this.loadingPlaylists = false;
          if (response.status === 200 && response.data.data) {
            response.data.data.forEach(playlist => (
              this.playlists.push(playlist)
            ));
          }
          this.$emit('endingLoad');
        })
        .catch((error) => {
          this.showError(error)
          this.loadingPlaylists = false;
          this.$emit('endingLoad');
        });
    },
    fetchReleases (id) {
      this.initPlaylistList();
      this.showLoading('Chargement de la playlist...');
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
            this.loadingReleases = false;
            this.$emit('endingLoad');
          }
        })
        .catch((error) => {
          this.showError(error)
          this.loadingReleases = false;
          this.$emit('endingLoad');
        });
    },
    onChangePlaylist(event) {
      this.initPlaylistList()

      const playlist_id = event.target.value;
      this.selectedPlaylist = this.playlists.find(item => {
        return item.id == playlist_id;
      })
      this.loadingReleases = true;
    },
    onError: function (error) {
      this.showError(error)
    },
    onEndingLoad: function () {
      this.loadingReleases = false;
    },
    onShowRelease: function (item) {
      this.selectedRelease = item;
    },
    showLoading(message) {
      let payload = {
        type: 'loading',
        message: message
      }
      this.$store.dispatch('toast/show', payload)
    },
    showError(error) {
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
    }
  }
}
</script>