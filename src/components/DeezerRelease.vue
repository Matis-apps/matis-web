<template>
  <div id="deezer-release">
    <div v-if="release">
      <div class="card text-left">
        <div class="card-header d-flex">
          <div class="col-2" v-show="release.content_picture">
            <img class="card-img-top img-fluid img-circle" :src="release.content_picture" alt="Card image cap"> 
          </div>
          <div class="col-10 align-self-center"><a :href="release.link" target="_blank">{{release.name}}</a> | <a :href="release.content_link" target="_blank">{{release.content_title}}</a></div>
        </div>

        <div class="card-body">
          
          <h5 class="card-title">{{capitalize(release.content_type)}}</h5>
          <p class="card-text"><small class="text-muted">Sortie le {{ release.updated_at }}</small></p>

          <div v-if="tracklist.length > 0">
            <p><small>{{totalTracks}} tracks</small></p>
            <ul class="list-group my-2">
              <li class="list-group-item d-flex justify-content-between align-items-center"
                v-for="track in tracklist"
                v-bind:key="track.id">
                {{track.artist.name}} | {{track.title}}
                <span class="badge badge-primary badge-pill" v-show="track.readable">{{track.rank}}</span>
              </li>
            </ul>
          </div>
          <div v-if="release._obj == 1">
            <hr>
            <h5 class="card-title">Related artists</h5>
            <div class="d-flex justify-content-center row" v-if="relatedArtists.length > 0">
              <div class="card col-2 m-3" style="width: 18rem;"
                v-for="artist in relatedArtists"
                v-bind:key="artist.id">

                <img class="card-img-top p-3" :src="artist.picture" alt="Card image cap">
                <div class="card-body">
                  <p class="card-text">{{artist.name}}</p>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-light" role="alert">
              No artists found
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">
      <h4 class="alert-heading">No release selected!</h4>
      <hr>
      <p class="mb-0">Click on a release to see more details.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeezerRelease',
  props: {
    release: Object
  },
  data() {
    return {
      totalTracks: 0,
      tracklist: [],
      relatedArtists: [],
    }
  },
  watch: { 
    release: function(newVal, oldVal) { // watch it
      var element = document.getElementById("deezer-release");
      element.scrollIntoView({behavior: "smooth"});

      this.totalTracks = 0;
      this.tracklist = [];
      this.relatedArtists = [];

      if(newVal) {
        switch(newVal._obj) {
          case 1:
            this.fetchAlbumTracklist(newVal.content_id);
            this.fetchRelatedArtists(newVal.id);
            break;
          case 2:
            this.fetchPlaylistTracklist(newVal.content_id); // =" . $index;
            break;
        }
      } 
    }
  },
  methods: {
    capitalize: function (s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    async fetchAlbumTracklist (id, retry = 0) {
      
      await this.$axios.get("/deezer/album/"+id)
        .then((response) => {
          if (response.status === 200 && response.data.tracks) {
            this.tracklist = response.data.tracks.data;
            this.totalTracks = response.data.nb_tracks;
          } else {
            if (retry > 0) {
              // setTimeout(this.fetchTracklist, this.timeout_ms, index, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },
    async fetchRelatedArtists (id, retry = 0) {
      
      await this.$axios.get("/deezer/artist/"+id+"/related")
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            this.relatedArtists = response.data.data;
          } else {
            if (retry > 0) {
              // setTimeout(this.fetchTracklist, this.timeout_ms, index, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },
    async fetchPlaylistTracklist (id, retry = 0) {
      
      await this.$axios.get("/deezer/playlist/" +id+"/tracks&limit=50&index=0")
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            this.tracklist = response.data.data;
            this.totalTracks = response.data.total;
          } else {
            if (retry > 0) {
              // setTimeout(this.fetchTracklist, this.timeout_ms, index, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },
  }
}
</script>
