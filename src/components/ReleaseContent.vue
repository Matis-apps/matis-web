<template>
  <div id="release-content">
    <div v-if="release">
      <div class="card text-left">
        <div class="card-header d-flex">
          <div class="col-2" v-show="release.content.picture">
            <img class="card-img-top img-fluid img-circle" :src="release.content.picture" alt="Card image cap"> 
          </div>
          <div class="col-10 align-self-center"><a :href="release.author.link" target="_blank">{{release.author.name}}</a> | <a :href="release.content.link" target="_blank">{{release.content.title}}</a></div>
        </div>

        <div class="card-body">
          
          <h5 class="card-title">{{capitalize(release.content.type)}}</h5>
          <p class="card-text"><small class="text-muted">Sortie le {{ release.content.updated_at }}</small></p>

          <div v-if="tracklist.length > 0">
            <p><small>{{totalTracks}} tracks</small></p>
            <ul class="list-group my-2">
              <li class="list-group-item d-flex justify-content-between align-items-center"
                v-for="track in tracklist"
                v-bind:key="track.id">
                {{track.artist.name}} | {{track.name}}
              </li>
            </ul>
          </div>
          <div v-if="release._obj == 'album'">
            <hr>
            <h5 class="card-title">Related artists</h5>
            <div class="d-flex justify-content-around row" v-if="relatedArtists.length > 0">
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
    <div v-else class="alert alert-warning">
      <h4 class="alert-heading">No release selected!</h4>
      <hr>
      <p class="mb-0">Click on a release to see more details.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReleaseContent',
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
      var element = document.getElementById("release-content");
      element.scrollIntoView({behavior: "smooth"});

      this.totalTracks = 0;
      this.tracklist = [];
      this.relatedArtists = [];

      if(newVal) {
        this.fetchReleaseContent(newVal._obj, newVal.content.id);

        if(newVal._obj == 'album') {
          this.fetchRelatedArtists(newVal.author.id);
        }
      }
    }
  },
  methods: {
    capitalize: function (s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    fetchReleaseContent (obj, id) {
      //this.loadingReleases = true;
      this.$axios.get(process.env.VUE_APP_ROOT_API+"/deezer/release/"+obj+"/"+id)
        .then((response) => {
          if (response.status === 200) {
            this.tracklist = response.data.data.content.tracks;
            this.totalTracks = response.data.data.content.tracks.length;
            //this.loadingReleases = false;
          }
        })
        .catch((error) => {
          console.log("Error: "+error)
          //this.errorMessage = error;
          //this.loadingReleases = false;
        });

      /*
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
        .catch((error) => console.log(error));*/
    },
    fetchRelatedArtists (id) {
      this.$axios.get(process.env.VUE_APP_ROOT_API+"/deezer/artist/"+id+"/related")
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            this.relatedArtists = response.data.data;
            this.relatedArtists.sort((a,b) => this.sortLastReleases(a,b));
          }
        })
        .catch((error) => console.log(error));
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
