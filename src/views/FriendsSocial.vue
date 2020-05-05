<template>
<div>
  <div class="row mb-2 d-flex">
    <div class="offset-1 col-3">
      <div class="card bg-light border-success mb-3">
        <div class="card-header">See your friend news</div>
        <div class="card-body text-success">
          <div class="row" v-if="selectedFriend">
            <div class="col-6">
              <h5 class="card-title">{{selectedFriend.name}}</h5>
              <p class="card-text"><a :href="'https://www.deezer.com/profile/'+selectedFriend.id" target="_blank">Profile</a></p>
            </div>
            <div class="col-6">
              <img class="img-fluid" v-bind:src="selectedFriend.picture_medium">
            </div>            
          </div>
          <div v-else class="alert alert-warning">
            <p class="mb-0">Select a friend on the right panel.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-7 align-self-center">
      <p><small>{{friends.length}} friends followed</small></p>
      <select class="custom-select" @change="onChangeFriend($event)">
        <option v-for="friend in friends" 
          v-bind:key="'friend-'+friend.id"
          :value="friend.id">
          {{friend.name}}
        </option>
      </select>
    </div>
  </div>
  <div class="row" v-show="selectedFriend">
    <div class="social offset-1 col-3">
      <div class="alert alert-info align-self-center" role="alert">
        <p>{{releases.length}} news <small v-show="releases.length < countReleases">/ {{countReleases}}</small></p>

        <div class="progress my-2" v-show="releases.length < countReleases">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="progressStyle" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
            {{progressPercent}}
          </div>
        </div>
      </div>

      
      <div v-if="releases" class="scrollbar scrollbar-primary">
        <div class="card mb-2" :class="{ 'border-primary' : releaseDays(item.updated_at) == 0 }" 
          v-for="(item, index) in releases" 
          v-bind:key="item._uid">
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
</div>
</template>

<script>
// @ is an alias to /src
import DeezerRelease from '@/components/DeezerRelease.vue'

export default {
  name: 'FriendsSocial',
  components: {
     DeezerRelease
  },
  data() {
    return {
      user_id: 16192550,
      friend_id: null,

      friends: [],
      selectedFriend: null,

      releases: [],
      timeout_ms: 1500,
      retry: 10,

      loadedArtists: 0,
      loadedPlaylists: 0,
      loadedAlbums: 0,
      countReleases: 0,
      selectedRelease: null
    }
  },
  computed: {
    progress: function () {
      return Math.ceil((this.loadedArtists+this.loadedPlaylists+this.loadedAlbums)/this.countReleases*100);
    },
    progressPercent: function () {
      return this.progress + "%"
    },
    progressStyle: function () {
      return "width: " + this.progress + "%"
    },
  },
  created() {
    this.friends = [];
    this.fetchFriends(0, this.retry);
  },
  methods: {
    onChangeFriend(event) {
      this.releases = [];
      this.loadedArtists = 0;
      this.loadedPlaylists = 0;
      this.loadedAlbums = 0;
      this.countReleases = 0;
      this.selectedRelease = null;

      this.friend_id = event.target.value;

      this.selectedFriend = this.friends.find(item => {
        return item.id == this.friend_id;
      })

      this.fetchArtists(0, this.retry);
      this.fetchPlaylists(0, this.retry);
      this.fetchAlbums(0, this.retry);
    },
    releaseDays: function (day) {
      var dateofvisit = this.$moment(day, 'YYYY-MM-DD-MM');
      var today = this.$moment();
      return today.diff(dateofvisit, 'days');
    },
    capitalize: function (s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },

    async fetchFriends (index, retry) {
      
      await this.$axios.get("http://localhost:8010/proxy/user/"+this.user_id+"/followings?limit=100&index="+index)
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            response.data.data.forEach(friend => (
              this.friends.push(friend)
            ));
            
            this.friends.sort((a,b) => this.sortFriends(a,b))

            if (response.data.next) {
              this.fetchFriends(index+100, this.retry);       
            }
          } else {
            if (retry > 0) {
              setTimeout(this.fetchFriends, this.timeout_ms, index, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },

    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    async fetchArtists (index, retry) {
      
      await this.$axios.get("http://localhost:8010/proxy/user/"+this.friend_id+"/artists?limit=100&index="+index)
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            if (index == 0) this.countReleases += response.data.total;

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
          if (response.status === 200 && response.data.data ) {
            if (response.data.data.length > 0) {
              let sorted = response.data.data.sort((a, b) => this.sortAlbums(a,b));
              artist.albums = sorted;
              this.releases.push(this.formatArtistToFeed(artist));
              this.loadedArtists+=1;
              this.releases.sort((a,b) => this.sortLastReleases(a,b))
            } else {
              this.countReleases-=1;
            } 
          } else {
            if (retry > 0) {
              console.log("Retry: "+artist.name);
              setTimeout(this.fetchArtistContent, this.timeout_ms, artist, retry-1);
            } else {
              console.log("Timeout: "+artist.name);
              this.countReleases-=1;
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
        picture: artist.picture_small,
        link: artist.link,
        updated_at: artist.albums[0].release_date,
        // Related to the content
        content_id: artist.albums[0].id,
        content_title: artist.albums[0].title,
        content_type: artist.albums[0].record_type,
        content_picture: artist.albums[0].cover_medium,
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
      
      await this.$axios.get("http://localhost:8010/proxy/user/"+this.friend_id+"/playlists?limit=100&index="+index)
        .then((response) => {
          
          if (response.status === 200 && response.data.data) {   
            if (index == 0) this.countReleases += response.data.total;
         
            response.data.data.forEach(playlist => (
              this.releases.push(this.formatPlaylistToFeed(playlist)),
              this.loadedPlaylists+=1,
              this.releases.sort((a,b) => this.sortLastReleases(a,b))
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
        content_picture: playlist.picture_medium,
        content_link: playlist.link,
        content_last: playlist,
        content_full: playlist,
      };
    },

    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    async fetchAlbums (index, retry) {
      
      await this.$axios.get("http://localhost:8010/proxy/user/"+this.friend_id+"/albums?limit=100&index="+index)
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            if (index == 0) this.countReleases += response.data.total;

            response.data.data.forEach(album => (
              this.fetchAlbumsContent(album)
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

    fetchAlbumsContent(album) {
      let existingAlbum = this.releases.find(item => {
        return item.id == album.id && item.content_type == album.record_type;
      });
      if (! existingAlbum) {
        this.releases.push(this.formatAlbumToFeed(album)),
        this.loadedAlbums+=1,
        this.releases.sort((a,b) => this.sortLastReleases(a,b))
      }
    },

    formatAlbumToFeed(album) {
      return {
        _obj: 3,
        _uid: album.type+'-'+album.artist.id+'-'+album.id,
        // Related to the author
        id: album.artist.id,
        name: album.artist.name,
        picture: album.artist.picture_small,
        link: "https://www.deezer.com/profile/" + album.artist.id,
        updated_at: this.timestampToDate(album.time_add),
        // Related to the content
        content_id: album.id,
        content_title: album.title,
        content_type: album.record_type,
        content_picture: album.cover_medium,
        content_link: album.link,
        content_last: album,
        content_full: album,
      };
    },

    timestampToDate(seconds) {
      return this.$moment.unix(seconds).format("YYYY-MM-DD");
    },
    clickOnRelease(release) {
      this.selectedRelease = release;
    },
    sortFriends ( a, b ) {
      if ( a.name == null ) return -1;
      if ( b.name == null ) return 1;

      if ( this.capitalize(a.name) > this.capitalize(b.name) ) {
        return 1;
      }
      if ( this.capitalize(a.name) < this.capitalize(b.name) ) {
        return -1;
      }
      return 0;
    },
    sortAlbums ( a, b ) {
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
    sortLastReleases ( a, b ) {
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