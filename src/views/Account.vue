<template>
  <div>
    <div class="card mb-3">
      <div class="card-header text-white bg-primary">
        Account
      </div>
      <div class="card-body">
        <div v-if="user">
          <p>Mail: {{ user.email }}</p>    
          <p>User: {{ user.name }}</p>
        </div>
        <p v-else>No user</p>

        <p v-if="token">Token: <span class="small">{{token}}</span></p>
        <p v-else>No token</p>
      </div>
    </div>

    <div v-if="loadingAccounts">
      <div class="alert alert-light">
        <div class="spinner-border text-primary" role="status"></div>
        <span class="mx-3">Chargement des données du compte...</span>      
      </div>
    </div>
    <div v-if="user">
      <div class="card mb-3">
        <div class="card-header">
          Deezer
        </div>
        <div class="card-body">
          <div v-if="user.deezer">
            <p><b>#{{user.deezer.account.id}}</b> - {{user.deezer.account.name}}</p>
            <p>Access Token: {{user.deezer.token.access_token}}</p>
          </div>
          <p><a class="btn btn-primary" :href="deezerConnect" role="button">{{user.deezer ? 'Refresh':'Connect'}}</a></p>
        </div>
      </div>
      <div class="card mb-3">
        <div class="card-header">
          Spotify
        </div>
        <div class="card-body">
          <div v-if="user.spotify">
            <p><b>#{{user.spotify.account.id}}</b> - {{user.spotify.account.display_name}}</p>
            <p>Access Token: {{user.spotify.token.access_token}}</p>
          </div>
          <p><a class="btn btn-primary" :href="spotifyConnect" role="button">{{user.spotify ? 'Refresh':'Connect'}}</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Account',
  data() {
    return {
      user: null,
      loadingAccounts: false,
      deezerConnect: "https://connect.deezer.com/oauth/auth.php?app_id=" + process.env.VUE_APP_DEEZER_APP_ID + "&redirect_uri=" + process.env.VUE_APP_URL + process.env.VUE_APP_DEEZER_REDIRECT,
      spotifyConnect: "https://accounts.spotify.com/authorize?client_id=" + process.env.VUE_APP_SPOTIFY_CLIENT_ID + "&redirect_uri=" + process.env.VUE_APP_URL + process.env.VUE_APP_SPOTIFY_REDIRECT + "&response_type=code&scope=" + encodeURIComponent('user-library-read user-follow-read'),
    }
  },
  computed: {
    token: function() {
      return this.$store.getters['auth/getToken'];
    }
  },
  created() {
    this.fetchAccount();
    if (Object.keys(this.$route.query).length > 0) {
      this.handleCallback(this.$route.query)
    }
  },
  methods: {
    fetchAccount () {
      const url = "/users/me";

      this.loadingAccounts = true;
      axios.get(url)
        .then((response) => {
          this.loadingAccounts = false;
          if (response.status === 200) {
            this.user = response.data;
          }
        })
        .catch(err => this.showError(err));
    },
    handleCallback(query) {
      switch(query.from) {
        case 'deezer':
          if(query.code) this.getDeezerToken(query.code)
          break;
        default:
          if(query.code) this.getSpotifyToken(query.code)
          break;
      }
    },
    getDeezerToken (code) {
      const url = "/users/token/deezer?code="+code;

      axios.get(url)
        .then((response) => {
          if (response.status === 200) {
            this.user = {
              ...this.user,
              deezer: response.data
            };
            this.successToast('Deezer');
          }
        })
        .catch(err => this.showError(err));
    },
    getSpotifyToken (code) {
      const url = "/users/token/spotify?code="+code;

      axios.get(url)
        .then((response) => {
          if (response.status === 200) {
            this.user = {
              ...this.user,
              spotify: response.data
            };
            this.successToast('Spotify');
          }
        })
        .catch(err => this.showError(err));
    },
    successToast(from) {
      let payload = {
        type: 'success',
        message: 'Le compte '+from+' a été refresh'
      }
      this.$store.dispatch('toast/show', payload)
    },
    showError(error) {
      let payload = {
        type: 'error',
      }

      if(error.response) {
        payload.message = error.response.message||error.response.statusText;
      } else {
        payload.message = error.message;
      }
      this.$store.dispatch('toast/show', payload)
    }
  }

}
</script>