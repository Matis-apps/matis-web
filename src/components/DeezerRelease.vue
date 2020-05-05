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

          <ul class="list-group my-2" v-if="tracklist.length > 0">
            <li class="list-group-item d-flex justify-content-between align-items-center"
              v-for="track in tracklist"
              v-bind:key="track.id">
              {{track.artist.name}} | {{track.title}}
              <span class="badge badge-primary badge-pill" v-show="track.readable">{{track.rank}}</span>
            </li>
          </ul>
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
      tracklist: [],
      relatedArtists: [],
    }
  },
  watch: { 
    release: function(newVal, oldVal) { // watch it
      var element = document.getElementById("deezer-release");
      element.scrollIntoView({behavior: "smooth"});

      console.log(newVal);
      if(newVal) {
        this.fetchTracklist(newVal.content_id);
        this.fetchRelatedArtists(newVal.id);
      } 
    }
  },
  methods: {
    capitalize: function (s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    async fetchTracklist (id, retry = 0) {
      
      await this.$axios.get("http://localhost:8010/proxy/album/"+id)
        .then((response) => {
          // console.log(response.data);
          if (response.status === 200 && response.data.tracks) {
            this.tracklist = response.data.tracks.data;
          } else {
            if (retry > 0) {
              // setTimeout(this.fetchTracklist, this.timeout_ms, index, retry-1);
            }
          }
        })
        .catch((error) => console.log(error));
    },
    async fetchRelatedArtists (id, retry = 0) {
      
      await this.$axios.get("http://localhost:8010/proxy/artist/"+id+"/related")
        .then((response) => {
          console.log(response.data);
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
  }
}
</script>
