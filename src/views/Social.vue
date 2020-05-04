<template>
<div class="row">    
  <div class="social offset-1 col-3">
    <p>{{artists.length}} artistes affichés</p>
    <div class="progress my-2" v-show="artists.length < countArtists">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="progressStyle" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
        {{progressPercent}}
      </div>
    </div>
    <div v-if="artists" class="scrollbar scrollbar-primary">
      <div class="card mb-2" v-for="(artist, index) in artists" v-bind:key="artist.id">
        <div class="card-header d-flex justify-content-between">
          <img v-bind:src="artist.picture_big" class="card-img-top img-fluid" alt="picture artist" style="max-height: 50px; max-width: 50px;"> {{ artist.name }}
        </div>
        <div class="card-body text-left" v-if="artist.albums.length > 0">
          <h5 class="card-title"><b>#{{index+1}}</b> Dernière sortie <small>| {{ capitalize(artist.albums[0].record_type) }}</small></h5>
          <p class="small" v-if="releaseDays(artist.albums[0].release_date) > 0">Il y a {{ releaseDays(artist.albums[0].release_date) }} jours ({{ artist.albums[0].release_date }})</p>
          <p class="small" v-else-if="releaseDays(artist.albums[0].release_date) < 0">Sortie prévue dans {{ Math.abs(releaseDays(artist.albums[0].release_date)) }} jours ({{ artist.albums[0].release_date }})</p>
          <p class="small" v-else>Sortie aujourd'hui</p>
          <h6 class="card-subtitle mb-2 text-muted">{{ artist.albums[0].title }}</h6>
          <img v-bind:src="artist.albums[0].cover" class="img-fluid" alt="picture artist" v-if="artist.albums[0].cover">
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-link" v-on:click="clickOnRelease(artist)">See more</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-7">
    <transition name="slide-fade" >
      <DeezerRelease 
        v-if="(artists.length >= countArtists)"
        v-bind:release="selectedRelease"/>
    </transition>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import DeezerRelease from '@/components/DeezerRelease.vue'

export default {
  name: 'Social',
  components: {
     DeezerRelease
  },
  data() {
    return {
      artists: [],
      timeout_ms: 1500,
      retry: 10,
      loadedArtists: 0,
      countArtists: 100,
      selectedRelease: null
    }
  },
  computed: {
    progress: function () {
      return Math.ceil(this.loadedArtists/this.countArtists*100);
    },
    progressPercent: function () {
      return this.progress + "%"
    },
    progressStyle: function () {
      return "width: " + this.progress + "%"
    },
  },
  created() {
    this.fetchArtists(0, this.retry);
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
    async fetchArtists (index, retry) {
      
      await this.$axios.get("http://localhost:8010/proxy/user/16192550/artists?index="+index)
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            this.countArtists = response.data.total;
            response.data.data.forEach(artist => (
              artist.albums = [],
              this.fetchArtistContent(artist, this.retry)
            ));

            if (response.data.next) {
              this.fetchArtists(index + 25, this.retry);     	
            }
          } else {
            if (retry > 0) {
              setTimeout(this.fetchArtists, this.timeout_ms, index, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },
    async fetchArtistContent(artist, retry) {
      await this.$axios.get("http://localhost:8010/proxy/artist/"+artist.id+"/albums")
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            let sorted = response.data.data.sort((a, b) => this.shortAlbums(a,b));
            artist.albums = sorted;
            this.artists.push(artist);
            this.loadedArtists+=1;
            this.artists.sort((a,b) => this.shortLastReleases(a,b))
          } else {
            if (retry > 0) {
              setTimeout(this.fetchArtistContent, this.timeout_ms, artist, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },
    clickOnRelease(artist) {
      this.selectedRelease = artist;
    },
    shortAlbums ( a, b ) {
      if ( a.release_date == null ) return 1;
      if ( b.release_date == null ) return -1;

      if ( a.release_date > b.release_date ) {
        return -1;
      }
      if ( a.release_date < b.release_date ) {
        return 1;
      }
      return 0;
    },
    shortLastReleases ( a, b ) {
      if ( a.albums.length == 0 ) return 1;
      if ( b.albums.length == 0 ) return -1;

      if ( a.albums[0].release_date > b.albums[0].release_date ) {
        return -1;
      }
      if ( a.albums[0].release_date < b.albums[0].release_date ) {
        return 1;
      }
      return 0;
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