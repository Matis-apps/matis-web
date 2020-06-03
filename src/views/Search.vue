<template>
  <div>
    <div class="d-flex justify-content-center text-muted">
      <div v-if="loading" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
      <h3 class="mx-3">Rechercher de la musique sur Deezer et Spotify</h3>
    </div>
    <form v-on:submit.prevent="onSearch" class="my-2 col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12">
      <div class="row">
        <input id="search" class="form-control form-control-lg" type="text" aria-describedby="searchHelp" placeholder="J'ai de la chance ...">
        <small id="searchHelp" class="form-text text-muted">* Préciser au maxium le résultat à trouver car la recherche est imprécise...</small>
      </div>
      <div class="row my-2">
        <button type="submit" class="btn btn-primary">Search</button>
      </div>
    </form>
    <div v-if="results" class="row mt-3">
      <div v-if="results.albums" class="col-lg-10 offset-lg-1 col-md-12">
        <h3>Albums</h3>
        <p class="small">{{results.albums.length}} résultats</p>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-around" v-for="(albums, i) in results.albums" v-bind:key="'album-'+i">
            <div :class="'col-'+Math.floor(12/albums.length)" v-for="items in albums" v-bind:key="items._uid">
              <div class="row">
                <div class="col-lg-2 col-md-3 col-sm-4">
                  <img :src="items.picture" class="img-fluid rounded">
                </div>
                <div class="col-lg-10 col-md-9 col-sm-8">
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
      <div v-if="results.tracks" class="col-lg-10 offset-lg-1 col-md-12">
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
        this.$emit('error', "Saisir le nom d'un artiste ou d'un album")
      } else {
        this.$emit('startLoading', 'Recherche en cours...');
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
          .catch((error) => {
            this.loading = false;
            this.$emit('error', error)
          });
      }
    }
  }
}
</script>