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
import ReleasesList from './ReleasesList.vue'

export default {
  name: 'DeezerReleaseList',
  props: ['user_id'],
  components: {
    ReleasesList,
  },
  data() {
    return {
      releases: [],
      genres: [],
      processingTime:0,
    }
  },
  mounted() {
    this.loadReleaseList();
  },
  watch: { 
    user_id: function(newVal, oldVal) { // watch it
      if(newVal) {
        this.loadReleaseList()
      }
    }
  },
  methods: {
    loadReleaseList: function () {
      this.processingTime = 0;
      this.releases = [];
      this.genres = [];
      if (localStorage.token) this.fetchReleases();
      else this.$emit('error', 'No token provided');
    },
    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    fetchReleases () {  
      let start = Date.now();

      const url = 
        process.env.VUE_APP_ROOT_API + (this.user_id ? 
          "/deezer/releases/" + this.user_id
          : "/deezer/me/releases");

      this.$axios.get(url, { headers: { 'Authorization': localStorage.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          let end = Date.now();
          if (response.status === 200) {
            this.releases = response.data.data;
            this.releases.map(r => r.display = true);
            this.genres = response.data.genres;
            this.genres.map(g => g.isClicked = false);
            this.processingTime = (end - start)/1000;
            this.$emit('endingLoad');
          }
        })
        .catch((error) => {
          this.$emit('error', error);
          this.$emit('endingLoad');
        });
    },
    onShowRelease(item) {
      this.$emit('showRelease',item)
    },
    onSelectGenre(key) {
      this.genres = this.genres.map(g => {
        g.isClicked = g.key == key ? true : false;
        return g;
      });

      if(key == -42) {
        this.releases = this.releases.map(r => {
          r.display = true; 
          return r;
        });
      } else {
        this.releases = this.releases.map(r => {
          r.display = r.content.genre == key ? true : false;
          return r;
        });
      }
    }
  }
}
</script>