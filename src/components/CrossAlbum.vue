<template>
  <div>
    <div v-if="display" class="card bg-light mb-3" style="border-color: #86a8e2">
      <div class="card-header">Liens vers les autres plateformes</div>
      <div v-if="waiting" class="card-body">
        <div class="alert alert-secondary d-flex align-items-center">
          <div class="spinner-grow text-primary" role="status"></div>
          <span class="mx-3">Attente de la tracklist...</span>
        </div>
      </div>
      <div v-else-if="loading" class="card-body">
        <div class="alert alert-secondary d-flex align-items-center">
          <div class="spinner-border text-primary" role="status"></div>
          <span class="mx-3">Recherche en cours...</span>
        </div>
      </div>
      <div v-else-if="albums" class="card-body text-success text-center">
        <div class="row">
          <div class="col-6">
            <h5 class="card-title">Deezer</h5>
            <div v-if="albums.deezer">
              <span><a :href="albums.deezer.link" target="_blank">{{albums.deezer.name}}</a></span>
            </div>
            <div v-else>
              <i class="medium text-danger material-icons mr-2">block</i>
            </div>
          </div>
          <div class="col-6">
            <h5 class="card-title">Spotify</h5>
            <div v-if="albums.spotify">
              <span><a :href="albums.spotify.link" target="_blank">{{albums.spotify.name}}</a></span>
            </div>
            <div v-else>
              <i class="medium text-danger material-icons mr-2">block</i>
            </div>
          </div>            
        </div>
      </div>
      <div v-show="albums" class="card-footer text-muted">
        <p class="mb-0">{{countSuccess}} résultats</p>
        <span v-show="countSuccess<=1" class="small text-danger">Impossible de trouver la correspondance <b class="text-uppercase font-weight-bold">exacte</b> de l'album sur toutes les platfeformes. La comparaison peut être vérifiée ici : <router-link to="/search">Search</router-link>.</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'CrossAlbum',
  props: ['from', 'query', 'upc'],
  data() {
    return {
      albums: null,
      waiting: false,
      loading: false,
      display: true,
    }
  },
  computed: {
    countSuccess: function() {
      return !this.albums ? 0 : Object.keys(this.albums).length;
    },
  },
  mounted() {
    if (this.upc) {
      this.loadSearch();
    } else if (this.query) {
      this.waiting = true;
    }
  },
  watch: { 
    query: function(newVal, oldVal) { // watch it
      if(newVal) {
        this.waiting = true;
      }
    },
    upc: function(newVal, oldVal) { // watch it
      if(newVal) {
        this.loadSearch()
      }
    }
  },
  methods: {
    loadSearch: function () {
      this.albums = null;
      this.display = true;
      this.fetchSearch();
    },
    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    fetchSearch () {
      const url = "/tool/upc?from=" + this.from + "&q=" + encodeURIComponent(this.query) + "&upc=" + this.upc;

      this.waiting = false;
      this.loading = true;
      this.$emit('startLoading','Recherche sur toutes les plateformes...');
      axios.get(url)
        .then((response) => {
          if (response.status == 200 && response.data.data) {
            this.albums = response.data.data;
            this.display = true;
          } else {
            this.$emit('error', 'Impossible de trouver les liens vers les autres platformes');
            this.display = false;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.display = false;
          this.loading = false;
          this.$emit('error', error);
        });
    }
  }
}
</script>