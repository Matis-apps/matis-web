<template>
  <div>
    <form v-on:submit.prevent="onSearch">
      <div class="row">
        <input id="search" class="form-control form-control-lg mx-5" type="text" placeholder="Search some tracks, albums, users, playlists, ...">
      </div>
      <div class="row my-2">
        <button type="submit" class="btn btn-primary mx-5">Search</button>  
      </div>
    </form>
    <div v-if="error" class="row">
      <div class="mx-auto" style="width: 400px;">
        <div class="alert alert-secondary text-center">
          <div class="spinner-grow text-danger" role="status"></div>
          <span class="mx-3 small">{{error}}</span>
        </div>
      </div>
    </div>
    <div v-if="loading" class="row">
      <div class="mx-auto" style="width: 400px;">
        <div class="alert alert-secondary text-center">
          <div class="spinner-border text-success" role="status"></div>
          <span class="mx-3">Recherche des résultats...</span>      
        </div>
      </div>
    </div>
    <div v-if="results" class="mt-3">
      <p class="text-center"><b>Recherche: </b>{{ search }}</p>      
      <div v-if="results.albums" class="col-10 offset-1">
        <h3>Albums</h3>
        <p class="small">{{results.albums.length}} résultats</p>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-around" v-for="(albums, i) in results.albums" v-bind:key="'album-'+i">
            <div :class="'col-'+Math.floor(12/albums.length)" v-for="items in albums" v-bind:key="items._uid">
              <div class="row">
                <div class="col-2">
                  <img :src="items.picture" class="img-fluid rounded">
                </div>
                <div class="col-10">
                  <div class="row d-block">
                    <p class="small">{{items.type}} à partir de <b>{{items._from}}</b></p>
                    <p class="small">Sortie le {{items.updated_at}}</p>
                  </div>
                  <div class="row">
                    <p><span><a :href="items.link" target="_blank">{{ items.name }}</a></span><span v-for="artist in items.artists" v-bind:key="artist._uid"> | <a :href="artist.link" target="_blank" class="text-success">{{ artist.name }}</a></span></p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="results.tracks" class="col-10 offset-1">
        <hr classe="my-2">
        <h3>Tracks</h3>
        <p class="small">{{results.tracks.length}} résultats</p>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-around" v-for="(track, i) in results.tracks" v-bind:key="i">
            <div :class="'col-'+Math.floor(12/track.length)" v-for="items in track" v-bind:key="items._uid">
              <div class="row d-block">
                <p class="small">à partir de <b>{{items._from}}</b></p>
                <p class="small">Sortie le {{items.updated_at}}</p>
              </div>
              <div class="row">
                <p><span><a :href="items.link" target="_blank">{{ items.name }}</a></span><span v-for="artist in items.artist" v-bind:key="artist._uid"> | <a :href="artist.link" target="_blank" class="text-success">{{ artist.name }}</a></span></p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: 'Search',
  data() {
    return {
      search: null,
      error: null,
      loading: false,
      results: null,
    }
  },
  created() {

  },
  methods: {
    onSearch: function(e) {
      var element = document.getElementById("search");
      var search = element.value;
      if (!search) {
        this.error = 'Saisir qqchose à chercher';
      } else {
        this.error = null;
        this.results = null;
        this.loading = true;
        axios.get(process.env.VUE_APP_ROOT_API+"/tool/search?q="+encodeURIComponent(search))
          .then((response) => {
            if (response.status === 200) {
              this.search = search;
              var results = response.data.data;
              this.results = results;
            }
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            this.error = err.response.data.error.message || err.response.message;
          });
      }
    },
  }
}
</script>