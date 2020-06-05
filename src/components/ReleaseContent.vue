error<template>
  <div id="release-content">
    <div v-if="release">
      <div v-if="releaseType == 'album'">
        <CrossAlbum
          from="*"
          v-bind:query="release.author.name + ' ' + release.content.title"
          v-bind:upc="upc"
          v-on:startLoading="$emit('startLoading',$event)"
          v-on:error="$emit('error',$event)"/>
      </div>
      <div class="card text-left" style="border-color: #86a8e2">
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
          <p class="card-text text-muted small">Sortie le {{ release.content.updated_at }}</p>
          <div v-if="loadingTracklist">
            <div class="alert alert-light d-flex align-items-center">
              <div class="spinner-border text-primary" role="status"></div>
              <span class="mx-3">Chargement de la tracklist...</span>      
            </div>
          </div>
          <div v-else-if="tracklist.length > 0">
            <p class="small">{{totalTracks}} tracks</p>
            <ul class="list-group my-2">
              <li class="list-group-item align-items-center"
                v-for="(track, index) in tracklist"
                v-bind:key="track.id">
                <b>#{{index+1}}</b> | <span v-for="artist in track.artist" v-bind:key="'content-'+artist._uid"><a :href="artist.link" target="_blank">{{artist.name}}</a> | </span><a :href="track.link" target="_blank" class="text-success">{{track.name}}</a>
              </li>
            </ul>
          </div>
          <div v-else>
            <p class="small">La tracklist est vide.</p>
          </div>
          <div v-if="release._obj == 'album'">
            <hr>
            <h5 class="card-title">Artistes associés</h5>
            <p class="card-text text-muted small">Avec leur dernière sortie</p>
            <div v-if="loadingRelated">
              <div class="alert alert-light d-flex align-items-center">
                <div class="spinner-border text-primary" role="status"></div>
                <span class="mx-3">Chargement des artistes associés...</span>      
              </div>
            </div>
            <div v-else-if="relatedArtists.length > 0">
              <ul class="list-group">
                <li class="list-group-item d-lg-flex justify-content-lg-around align-items-lg-center"
                  v-for="artist in relatedArtists"
                  v-bind:key="'related-'+artist._uid">
                  <span class="col-lg-3 d-lg-block text-lg-center col-md-12 d-md-flex justify-content-md-between align-items-md-start d-sm-flex justify-content-sm-between align-items-sm-start d-flex justify-content-between align-items-start">
                    <p><img class="img-fluid rounded" :src="artist.author.picture" alt="Card image cap"></p>
                    <p class="mb-0 pb-0 font-weight-bold"> {{artist.author.name}}</p>
                  </span>
                  <span class="col-lg-9 text-lg-right col-md-12">
                    <p class="text-muted small" v-if="releaseDays(artist.content.updated_at) > 0">Il y a {{ releaseDays(artist.content.updated_at) }} jours</p>
                    <p class="text-muted small" v-else-if="releaseDays(artist.content.updated_at) < 0">Sortie prévue dans {{ Math.abs(releaseDays(artist.content.updated_at)) }} jours</p>
                    <p class="text-muted small" v-else>Sortie aujourd'hui</p>
                    <p class="mb-0 pb-0">Nouveau {{ artist.content.type }} : <a :href="artist.content.link" target="_blank">{{artist.content.title}}</a></p>
                  </span>
                </li>
              </ul>
            </div>
            <div v-else class="alert alert-light" role="alert">
              Cet artiste est unique dans son genre
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">
      <h4 class="alert-heading">Pas de nouveauté selectionnée !</h4>
      <hr>
      <p class="mb-0">Selectionne un élément dans la liste pour voir son contenu.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
    if (this.release) this.init(this.release);
  },
  watch: { 
    release: function(newVal, oldVal) { // watch it
      if (newVal) this.init(newVal);
    }
  },
  methods: {
    releaseDays: function (day) {
      var dateofvisit = this.$moment(day, 'YYYY-MM-DD-MM');
      var today = this.$moment();
      return today.diff(dateofvisit, 'days');
    },
    init: function(release) {
      var element = document.getElementById("top");
      element.scrollIntoView({behavior: "smooth", block: "start"});

      this.totalTracks = 0;
      this.tracklist = [];
      this.relatedArtists = [];

      if(release) {
        this.releaseType = release._obj;
        this.fetchReleaseContent(release._obj, release.content.id);

        if(release._obj == 'album') {
          this.fetchRelatedArtists(release.author.id);
        }
      }
    },
    capitalize: function (s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    fetchReleaseContent (obj, id) {
      this.$emit('startLoading','Chargement du contenu...');
      this.loadingTracklist = true;
      axios.get(process.env.VUE_APP_ROOT_API+"/"+ this.release._from +"/release/"+obj+"/"+id)
        .then((response) => {
          if (response.status === 200) {
            this.upc = response.data.data.content.upc;
            this.tracklist = response.data.data.content.tracks;
            this.totalTracks = response.data.data.content.tracks.length;
          } else {
            this.upc = 0;
          }
        })
        .catch((error) => {
          this.$emit('error', error);
        })
        .finally(() => {
          this.loadingTracklist = false;
        });
    },
    fetchRelatedArtists (id) {
      this.$emit('startLoading','Chargement des artistes relatives...');
      this.loadingRelated = true;
      axios.get(process.env.VUE_APP_ROOT_API+"/"+ this.release._from +"/artist/"+id+"/related")
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            this.relatedArtists = response.data.data;
            this.relatedArtists.sort((a,b) => this.sortLastReleases(a,b));
          }
        })
        .catch((error) => {
          this.$emit('error', error);
        })
        .finally(() => {
          this.loadingRelated = false;
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