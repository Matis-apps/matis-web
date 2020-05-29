<template>
  <div id="release-content">
    <div v-if="release == null" class="alert alert-warning">
      <h4 class="alert-heading">Pas de nouveauté selectionnée !</h4>
      <hr>
      <p class="mb-0">Selectionne un élément dans la liste pour voir son contenu.</p>
    </div>
    <div v-else>
      <div v-if="releaseType == 'album'">
        <CrossAlbum
          from="*"
          v-bind:query="release.author.name + ' ' + release.content.title"
          v-bind:upc="upc"/>
      </div>
      <div class="card text-left">
        <div class="card-header d-flex">
          <div class="col-2" v-show="release.content.picture">
            <img class="card-img-top img-fluid img-circle" :src="release.content.picture" alt="Card image cap"> 
          </div>
          <div class="col-10 align-self-center">
            <p>
              <a :href="release.author.link" target="_blank">{{release.author.name}}</a> | <a :href="release.content.link" target="_blank" class="text-success">{{release.content.title}}</a>
            </p>
          </div>
        </div>

        <div class="card-body">
          
          <h5 class="card-title">{{capitalize(release.content.type)}}</h5>
          <p class="card-text"><small class="text-muted">Sortie le {{ release.content.updated_at }}</small></p>

          <div v-if="loadingTracklist">
            <div class="alert alert-light">
              <div class="spinner-border text-primary" role="status"></div>
              <span class="mx-3">Chargement de la tracklist...</span>      
            </div>
          </div>
          <div v-else-if="tracklist.length > 0">
            <p><small>{{totalTracks}} tracks</small></p>
            <ul class="list-group my-2">
              <li class="list-group-item align-items-center"
                v-for="(track, index) in tracklist"
                v-bind:key="track.id">
                <b>#{{index+1}}</b> | <span v-for="artist in track.artist" v-bind:key="artist._uid"><a :href="artist.link" target="_blank">{{artist.name}}</a> | </span><a :href="track.link" target="_blank" class="text-success">{{track.name}}</a>
              </li>
            </ul>
          </div>
          <div v-if="release._obj == 'album'">
            <hr>
            <h5 class="card-title">Artists associés</h5>
            <div v-if="loadingRelated">
              <div class="alert alert-light">
                <div class="spinner-border text-primary" role="status"></div>
                <span class="mx-3">Chargement des artistes associés...</span>      
              </div>
            </div>
            <div class="d-flex justify-content-around row" v-else-if="relatedArtists.length > 0">
              <div class="card col-5 my-2"
                v-for="artist in relatedArtists"
                v-bind:key="artist.author.id">

                <div class="row d-flex justify-content-center align-items-center">
                  <img class="img-fluid rounded m-4" style="max-width: 60%;" :src="artist.author.picture" alt="Card image cap">
                  <p class="card-text"> {{artist.author.name}}</p>
                </div>
                <hr>
                <div class="row small mx-1 d-block" v-if="artist.content">
                  <p v-if="artist.content.updated_at">Dernière sortie le {{artist.content.updated_at}}</p>
                  <p>{{ capitalize(artist.content.type) }}: <a :href="artist.content.link" target="_blank">{{artist.content.title}}</a></p>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-light" role="alert">
              Cet artiste est unique dans son genre
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CrossAlbum from './CrossAlbum.vue'

export default {
  name: 'ReleaseContent',
  props: ['release'],
  components: {
     CrossAlbum
  },
  data() {
    return {
      totalTracks: 0,
      tracklist: [],
      relatedArtists: [],
      releaseType: null,
      loadingTracklist: false,
      loadingRelated: false,
      upc: null,
    }
  },
  mounted() {
    if (this.release) {
      this.init(this.release);
    }
  },
  watch: { 
    release: function(newVal, oldVal) { // watch it
      if (newVal) {
        this.init(newVal)
      }
    }
  },
  methods: {
    init: function(release) {
      var element = document.getElementById("release-content");
      element.scrollIntoView({behavior: "smooth"});

      this.totalTracks = 0;
      this.tracklist = [];
      this.relatedArtists = [];

      if (localStorage.token) {
        if(release) {
          this.releaseType = release._obj;
          this.fetchReleaseContent(release._obj, release.content.id);

          if(release._obj == 'album') {
            this.fetchRelatedArtists(release.author.id);
          }
        }
      } else {
        this.$emit('error', 'No token provided');
      }

    },
    capitalize: function (s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    fetchReleaseContent (obj, id) {
      this.loadingTracklist = true;
      this.$axios.get(process.env.VUE_APP_ROOT_API+"/"+ this.release._from +"/release/"+obj+"/"+id, { headers: { 'Authorization': localStorage.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          if (response.status === 200) {
            this.upc = response.data.data.content.upc;
            this.tracklist = response.data.data.content.tracks;
            this.totalTracks = response.data.data.content.tracks.length;
          }
          this.loadingTracklist = false;
        })
        .catch((error) => {
          this.loadingTracklist = false;
          this.$emit('error', error);
        });
    },
    fetchRelatedArtists (id) {
      this.loadingRelated = true;
      this.$axios.get(process.env.VUE_APP_ROOT_API+"/deezer/artist/"+id+"/related", { headers: { 'Authorization': localStorage.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            this.relatedArtists = response.data.data;
            this.relatedArtists.sort((a,b) => this.sortLastReleases(a,b));
          }
          this.loadingRelated = false;
        })
        .catch((error) => {
          this.loadingRelated = false;
          this.$emit('error', error);
        });
    },
    sortLastReleases ( a, b ) {
      if ( a.content.updated_at == null ) return 1;
      if ( b.content.updated_at == null ) return -1;

      if ( a.content.updated_at > b.content.updated_at ) {
        return -1;
      }
      if ( a.content.updated_at < b.content.updated_at ) {
        return 1;
      }
      return 0;
    }
  }
}
</script>
