<template>
  <ReleasesList
    v-if="releases.length > 0"
    v-bind:genres="genres"
    v-bind:releases="releases"
    v-bind:processingTime="processingTime"
    v-on:showRelease="onShowRelease"
    v-on:selectGenre="onSelectGenre"/>
</template>

<script>
import axios from "axios";
import ReleasesList from '../ReleasesList.vue'

export default {
  name: 'SpotifyReleaseList',
  props: ['user_id'],
  components: {
    ReleasesList,
  },
  data() {
    return {
      releases: [],
      genres: [],
      processingTime: 0,
      done: false,
    }
  },
  mounted() {
    this.loadReleaseList();
  },
  watch: { 
    user_id: function(newVal, oldVal) { // watch it
      if(newVal) this.loadReleaseList()
    }
  },
  methods: {
    loadReleaseList: function () {
      this.processingTime = 0;
      this.releases = [];
      this.genres = [];
      this.done = false;
      setTimeout(this.stillAlive, 15000);
      this.fetchReleases();
    },
    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    fetchReleases () {
      this.$emit('startLoading','Chargement des nouveautés...');

      let start = Date.now();
      const url = 
        this.user_id
          ? "/spotify/releases/" + this.user_id
          : "/spotify/me/releases";

      axios.get(url)
        .then((response) => {
          let end = Date.now();
          if (response.status === 200) {
            this.releases = response.data.data;
            this.releases.map(r => r.display = true);
            this.genres = response.data.genres;
            this.genres.map(g => g.isClicked = false);
            this.processingTime = (end - start)/1000;
            this.$emit('success', 'Chargement des nouveautés avec succès !');
          }
          this.$emit('endLoading');
        })
        .catch((error) => {
          this.$emit('endLoading');
          this.$emit('error', error);
        })
        .finally(() => {
          this.done = true;
        });
    },
    stillAlive() {
      if (!this.done) {
        this.$emit('startLoading','Cela prend un peu de temps...');
        setTimeout(this.stillAlive, 15000);
      }
    },
    onShowRelease(item) {
      this.$emit('showRelease',item)
    },
    onSelectGenre(key) {
      this.genres = this.genres.map(g => {
        g.isClicked = g.key == key ? true : false;
        return g;
      });

      if(key == 1) {
        this.releases = this.releases.map(r => {
          r.display = true; 
          return r;
        });
      } else {        
        this.releases = this.releases.map(r => {
          r.display = r.content.genre.split(':').map(Number).includes(key) ? true : false;
          return r;
        });
      }
    }
  }
}
</script>