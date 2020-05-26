<template>
  <div>
    <div class="row">
      <input id="search" class="form-control form-control-lg mx-5" type="text" placeholder="Search some tracks, albums, users, playlists, ...">
    </div>
    <div class="row my-2">
      </div>
    <button type="submit" class="btn btn-primary mx-5" v-on:click="onSearch">Search</button>
    <div v-if="error" class="row">
      <div class="mx-auto" style="width: 400px;">
        <div class="alert alert-secondary text-center">
          <div class="spinner-grow text-danger" role="status"></div>
          <span class="mx-3 small">{{error}}</span>
        </div>
      </div>
    </div>
    <div v-if="loading">
      <div class="mx-auto" style="width: 400px;">
        <div class="alert alert-secondary">
          <div class="spinner-border text-success" role="status"></div>
          <span class="mx-3">Recherche des résultats...</span>      
        </div>
      </div>
    </div>
    <div v-else-if="results">
      <p>{{results}}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

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
        this.loading = true;
        this.$axios.get(process.env.VUE_APP_ROOT_API+"/tool/search?q="+search, { headers: { 'Authorization': localStorage.token, 'Content-Type': 'text/plain' } })
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data.data)
              this.results = response.data.data;
            }
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            this.error = err.response.data.error.message || err.response.message;
          });
      }
      console.log(search)
    },
  }
}
</script>