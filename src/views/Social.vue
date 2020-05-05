<template>
<div class="row">    
  <div class="social offset-1 col-3">
    <p>{{releases.length}} news</p>
    <div class="progress my-2" v-show="releases.length < countReleases">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="progressStyle" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
        {{progressPercent}}
      </div>
    </div>
    <div v-if="releases" class="scrollbar scrollbar-primary">
      <div class="card mb-2" :class="{ 'border-primary' : releaseDays(item.updated_at) == 0 }" v-for="(item, index) in releases" v-bind:key="item._uid">
        <div class="card-header d-flex justify-content-between">
          <img v-show="item.picture" :src="item.picture" class="card-img-top img-fluid" alt="picture artist" style="max-height: 50px; max-width: 50px;"> {{ item.name }}
        </div>
        <div class="card-body text-left" v-if="item.content_full">
          <h5 class="card-title"><b>#{{index+1}}</b><small> | {{ capitalize(item.content_type) }}</small></h5>
          <p class="small" v-if="releaseDays(item.updated_at) > 0">Il y a {{ releaseDays(item.updated_at) }} jours ({{ item.updated_at }})</p>
          <p class="small" v-else-if="releaseDays(item.updated_at) < 0">Sortie prévue dans {{ Math.abs(releaseDays(item.updated_at)) }} jours ({{ item.updated_at }})</p>
          <p class="small" v-else>Sortie aujourd'hui</p>
          <h6 class="card-subtitle mb-2 text-muted">{{ item.content_title }}</h6>
          <img :src="item.content_picture" class="img-fluid" alt="picture artist" v-if="item.content_picture">
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-link" v-on:click="clickOnRelease(item)">See more</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-7">
    <transition name="slide-fade" >
      <DeezerRelease 
        v-if="(releases.length >= countReleases)"
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
      user_id: 16192550,

      releases: [],
      timeout_ms: 1500,
      retry: 10,

      loadedArtists: 0,
      loadedPlaylists: 0,
      countReleases: 0,
      selectedRelease: null
    }
  },
  computed: {
    progress: function () {
      return Math.ceil(this.loadedArtists/this.countReleases*100);
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
    this.fetchPlaylists(0, this.retry);
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

    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    async fetchArtists (index, retry) {
      
      await this.$axios.get("http://localhost:8010/proxy/user/"+this.user_id+"/artists?limit=100&index="+index)
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            this.countReleases += response.data.total;
            response.data.data.forEach(artist => (
              artist.albums = [],
              this.fetchArtistContent(artist, this.retry)
            ));

            if (response.data.next) {
              this.fetchArtists(index+100, this.retry);     	
            }
          } else {
            if (retry > 0) {
              setTimeout(this.fetchArtists, this.timeout_ms, index, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },

    /**
     * Retrieve the artists details
     * @params artist - Response from the previous call
     * @params retry int - Number of retries remaining
     */
    async fetchArtistContent(artist, retry) {
      await this.$axios.get("http://localhost:8010/proxy/artist/"+artist.id+"/albums")
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            let sorted = response.data.data.sort((a, b) => this.shortAlbums(a,b));
            artist.albums = sorted;
            this.releases.push(this.formatArtistToFeed(artist));
            this.loadedArtists+=1;
            this.releases.sort((a,b) => this.shortLastReleases(a,b))
          } else {
            if (retry > 0) {
              setTimeout(this.fetchArtistContent, this.timeout_ms, artist, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },

    /**
     * Retrieve the artists details
     * @params artist - Response from the previous call
     *
     * Return release object
     */
    formatArtistToFeed(artist){
      return {
        _obj: 1,
        _uid: artist.albums[0].record_type+'-'+artist.id+'-'+artist.albums[0].id,
        // Related to the author
        id: artist.id,
        name: artist.name,
        picture: artist.picture_big,
        link: artist.link,
        updated_at: artist.albums[0].release_date,
        // Related to the content
        content_id: artist.albums[0].id,
        content_title: artist.albums[0].title,
        content_type: artist.albums[0].record_type,
        content_picture: artist.albums[0].cover,
        content_link: artist.albums[0].link,
        content_last: artist.albums[0],
        content_full: artist.albums,
      };
    },

    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    async fetchPlaylists (index, retry) {
      
      await this.$axios.get("http://localhost:8010/proxy/user/"+this.user_id+"/playlists?limit=100&index="+index)
        .then((response) => {
          
          if (response.status === 200 && response.data.data) {            
            response.data.data.forEach(playlist => (
              this.fetchPlaylistContent(playlist)
            ));

            if (response.data.next) {
              //this.fetchPlaylists(index+100, this.retry);       
            }
          } else {
            if (retry > 0) {
              //setTimeout(this.fetchPlaylists, this.timeout_ms, index, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },

    /**
     * Retrieve the artists details
     * @params artist - Response from the previous call
     * @params retry int - Number of retries remaining
     */
    fetchPlaylistContent(playlist) {
      if(!playlist.is_loved_track && playlist.creator.id != this.user_id) {
        this.releases.push(this.formatPlaylistToFeed(playlist)),
        this.loadedPlaylists+=1,
        this.countReleases += 1,
        this.releases.sort((a,b) => this.shortLastReleases(a,b))
      }
    },

    formatPlaylistToFeed(playlist){
      return {
        _obj: 2,
        _uid: playlist.type+'-'+playlist.creator.id+'-'+playlist.id,
        // Related to the author
        id: playlist.creator.id,
        name: playlist.creator.name,
        picture: null,
        link: "https://www.deezer.com/profile/" + playlist.creator.id,
        updated_at: playlist.time_mod ? this.timestampToDate(playlist.time_mod) : this.timestampToDate(playlist.time_add),
        // Related to the content
        content_id: playlist.id,
        content_title: playlist.title,
        content_type: playlist.type,
        content_picture: playlist.picture_big,
        content_link: playlist.link,
        content_last: playlist,
        content_full: playlist,
      };
    },
    timestampToDate(seconds) {
      return this.$moment.unix(seconds).format("YYYY-MM-DD");
    },
    clickOnRelease(release) {
      this.selectedRelease = release;
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
      if ( a.content_full.length == 0 ) return 1;
      if ( b.content_full.length == 0 ) return -1;

      if ( a.updated_at > b.updated_at ) {
        return -1;
      }
      if ( a.updated_at < b.updated_at ) {
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