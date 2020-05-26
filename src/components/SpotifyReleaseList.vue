<template>
  <div v-if="releases.length > 0">
    <div class="row">
      <p class="font-weight-lighter text-left">{{ releases.length }} items <span class="small"> (en {{processingTime}} s.)</span></p>    
    </div>
    <div class="row" v-if="genres.length > 0">
      <span v-for="item in genres" v-bind:key="item.key" class="small">
        <button :id="'btn-genre-'+item.key" type="button" class="btn btn-sm btn-link" :class='item.isClicked == true ? "text-success" : "text-primary"' v-on:click="onSelectGenre(item.value)">{{capitalize(item.value)}}</button>&nbsp;|&nbsp;
      </span>
    </div>
    <div class="row">
      <div class="card mb-2" :class="{ 'border-primary' : releaseDays(item.content.updated_at) == 0 }" v-for="(item, index) in releases" v-bind:key="item._uid" v-show="item.display == true">
        <div class="card-header d-flex justify-content-between">
          <img v-show="item.author.picture" :src="item.author.picture" class="card-img-top img-fluid rounded" alt="picture artist" style="max-height: 50px; max-width: 50px;">
          <p>{{ capitalize(item.content.type) }} by <span class="font-weight-bold">{{ item.author.name }}</span></p>
        </div>
        <div class="card-body text-left">
          <h5 class="card-title"><b>#{{index+1}}</b><small> | {{ item.content.title }}</small></h5>
          <p class="small" v-if="releaseDays(item.content.updated_at) > 0">Il y a {{ releaseDays(item.content.updated_at) }} jours ({{ item.content.updated_at }})</p>
          <p class="small" v-else-if="releaseDays(item.content.updated_at) < 0">Sortie prévue dans {{ Math.abs(releaseDays(item.content.updated_at)) }} jours ({{ item.content.updated_at }})</p>
          <p class="small" v-else>Sortie aujourd'hui</p>
          <p class="small font-weight-lighter">{{item.content.description}}</p>
          <img :src="item.content.picture" class="img-fluid rounded" alt="picture artist" v-if="item.content.picture">
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-link" v-on:click="$emit('showRelease',item)">Voir plus</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpotifyReleaseList',
  props: ['user_id'],
  data() {
    return {
      releases: [],
      genres: [],
      countReleases: 0,
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
      this.countReleases = 0;
      this.releases = [];
      this.genres = [];
      if (localStorage.token) this.fetchReleases();
      else this.$emit('error', 'No token provided');
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
    /**
     * Retrieve the loved artists
     * @params index int - For pagination
     * @params retry int - Number of retries remaining
     */
    fetchReleases () {  
      let start = Date.now();

      const url = 
        process.env.VUE_APP_ROOT_API + (this.user_id ? 
          "/spotify/releases/" + this.user_id
          : "/spotify/me/releases");

      this.$axios.get(url, { headers: { 'Authorization': localStorage.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          let end = Date.now();
          if (response.status === 200) {
            this.releases = response.data.data;
            this.releases.map(r => r.display = true);
            this.genres = response.data.genres;
            this.genres.map(g => g.isClicked = false);
            this.countReleases = response.data.count;
            this.processingTime = (end - start)/1000;
            this.$emit('endingLoad');
          }
        })
        .catch((error) => {
          this.$emit('error', error);
          this.$emit('endingLoad');
        });
    },
    onSelectGenre(key) {
      this.genres = this.genres.map(g => {
        g.isClicked = g == key ? true : false;
        return g;
      });

      if(key == 'Tous') {
        this.releases = this.releases.map(r => {
          r.display = true; 
          return r;
        });
      } else {        
        this.releases = this.releases.map(r => {          
          r.display = r.content.genre.split(':').includes(key) ? true : false;
          return r;
        });
      }
    }
  }
}
</script>