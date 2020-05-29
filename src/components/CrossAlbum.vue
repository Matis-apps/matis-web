<template>
  <div>
    <div class="card bg-light border-secondary mb-3">
      <div class="card-header">Liens vers les autres plateformes</div>
      <div v-if="waiting" class="card-body">
        <div class="alert alert-secondary">
          <div class="spinner-border text-primary" role="status"></div>
          <span class="mx-3">Attente de la tracklist...</span>
        </div>
      </div>
      <div v-else-if="loading" class="card-body">
        <div class="alert alert-secondary">
          <div class="spinner-border text-primary" role="status"></div>
          <span class="mx-3">Recherche en cours...</span>
        </div>
      </div>
      <div v-else-if="error" class="card-body">
        <div class="alert alert-danger">
          <p class="text-danger">{{error}}</p>    
        </div>
      </div>
      <div v-else-if="albums" class="card-body text-success">
        <div class="row">
          <div class="col-6">
            <h5 class="card-title">Deezer</h5>
            <div v-if="albums.deezer">
              <p><a :href="albums.deezer.link" target="_blank">{{albums.deezer.name}}</a></p>
            </div>
            <div v-else>
              <p class="text-danger">Nope</p>
            </div>
          </div>
          <div class="col-6">
            <h5 class="card-title">Spotify</h5>
            <div v-if="albums.spotify">
              <p><a :href="albums.spotify.link" target="_blank">{{albums.spotify.name}}</a></p>
            </div>
            <div v-else>
              <p class="text-danger">Nope</p>
            </div>
          </div>            
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CrossAlbum',
  props: ['from', 'query', 'upc'],
  data() {
    return {
      albums: null,
      waiting: false,
      loading: false,
      error: null,
    }
  },
  mounted() {
    console.log("mounted")

    if (this.upc) {
      this.loadSearch();
    } else if (this.query) {
      this.waiting = true;
    }
  },
  watch: { 
    query: function(newVal, oldVal) { // watch it
      console.log(newVal)
      if(newVal) {
        this.waiting = true;
      }
    },
    upc: function(newVal, oldVal) { // watch it
      console.log(newVal)
      if(newVal) {
        this.loadSearch()
      }
    }
  },
  methods: {
    loadSearch: function () {
      this.albums = null;
      if (localStorage.token) this.fetchSearch();
      else this.$emit('error', 'No token provided');
    },
    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    fetchSearch () {  
      const url = process.env.VUE_APP_ROOT_API + "/tool/upc?from=" + this.from + "&q=" + encodeURIComponent(this.query) + "&upc=" + this.upc;
      console.log(url)
      this.waiting = false;
      this.loading = true;
      this.$axios.get(url, { headers: { 'Authorization': localStorage.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          if (response.status === 200) {
            this.albums = response.data.data;
            this.loading = false;
            //this.$emit('endingLoad');
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
          //this.$emit('error', error);
          //this.$emit('endingLoad');
        });
    }
  }
}
</script>