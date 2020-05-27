<template>
    <div id="selectFriend" class="row mb-2 d-flex">
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
</template>


<script>
// @ is an alias to /src

export default {
  name: 'DeezerPlaylists',
  data() {
    return {
      playlists: [],
      selectedPlaylist: null,

      errorMessage: null,
      loadingReleases: false,
      loadingPlaylists: false,
      selectedRelease: null,
      displayContent: false,
    }
  },
  mounted() {
    // init arrays
    this.playlists = [];

    // nullable variables
    this.selectedPlaylist = null;
    this.errorMessage = null;
    this.selectedRelease = null;

    // init booleans
    this.loadingPlaylists = false;
    this.loadingReleases = false;
    this.displayContent = false;

    // load the friends
    if (localStorage.token) this.fetchPlaylists();
    else this.errorMessage = 'No token provided';
  },
  methods: {
    fetchPlaylists () {
      this.loadingPlaylists = true;
      this.$axios.get(process.env.VUE_APP_ROOT_API+"/deezer/me/playlists", { headers: { 'Authorization': localStorage.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          this.loadingPlaylists = false;
          if (response.status === 200 && response.data.data) {
            response.data.data.forEach(playlist => (
              this.playlists.push(playlist)
            ));   
          }
        })
        .catch((error) => {
          this.loadingPlaylists = false;
          switch(error.response.status) {
            case 401:
              this.errorMessage = "Il faut refresh le token";
              break;
            default:
              this.errorMessage = error;
              break;
          }
        });
    },
    onChangePlaylist(event) {
      this.selectedRelease = null;

      const playlist_id = event.target.value;
      this.selectedPlaylist = this.playlists.find(item => {
        return item.id == playlist_id;
      })
      this.displayContent = false;
      this.loadingReleases = true;
    },
    onError: function (error) {
      console.log(error)
      this.errorMessage = error;
    },
    onEndingLoad: function () {
      this.loadingReleases = false;
      this.displayContent = true;
    },
    onRelease: function (item) {
      this.selectedRelease = item;
    }
  }
}
</script>