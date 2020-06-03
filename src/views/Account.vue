<template>
  <div id="account">
    <div v-if="user">
      <h2 class="mb-3">Vue d'ensemble du compte</h2>
      <div class="mb-4">
        <h3 class="mb-2">Profil</h3>
        <div class="d-flex justify-content-between">
          <span class="col-4 font-weight-lighter">Adresse e-mail</span>
          <span class="col-8 font-weight-bold text-right">{{ user.email }}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between">
          <span class="col-4 font-weight-lighter">Nom</span>
          <span class="col-8 font-weight-bold text-right">{{ user.name }}</span>
        </div>
        <hr>
        <div v-if="token" class="d-flex justify-content-between">
          <span class="col-4 font-weight-lighter">Token</span>
          <span class="col-8 font-weight-bold text-truncate text-right">{{ token }}</span>
        </div>
        <hr>
      </div>

      <div class="mb-4">
        <h3 class="mb-2">Deezer</h3>
        <div v-if="user.deezer">
          <div class="d-flex justify-content-between">
            <span class="col-4 font-weight-lighter">Login</span>
            <span class="col-8 font-weight-bold text-right"><small>#{{user.deezer.account.id}} -</small> {{user.deezer.account.name}}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <span class="col-4 font-weight-lighter">Access Token</span>
            <span class="col-8 font-weight-bold text-truncate text-right">{{user.deezer.token.access_token}}</span>
          </div>
          <hr>
          <p><a class="btn btn-primary" :href="deezerConnect" role="button">{{user.deezer ? 'Refresh':'Connect'}}</a></p>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="mb-2">Spotify</h3>    
        <div v-if="user.spotify">
          <div class="d-flex justify-content-between">
            <span class="col-4 font-weight-lighter">Login</span>
            <span class="col-8 font-weight-bold text-right"><small>#{{user.spotify.account.id}} -</small> {{user.spotify.account.display_name}}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <span class="col-4 font-weight-lighter">Access Token</span>
            <span class="col-8 font-weight-bold text-truncate text-right">{{user.spotify.token.access_token}}</span>
          </div>
          <hr>
          <p><a class="btn btn-primary" :href="spotifyConnect" role="button">{{user.spotify ? 'Refresh':'Connect'}}</a></p>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="mb-3">Le compte n'existe pas</h2>
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
      this.$emit('startLoading','Chargement des données...');
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
      this.$emit('startLoading','Chargement des données de Deezer...');
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
        .catch(error => this.$emit('error', error));
    },
    getSpotifyToken (code) {
      this.$emit('startLoading','Chargement des données de Spotify...');
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
        .catch(error => this.$emit('error', error));
    },
    successToast(from) {
      let payload = {
        type: 'success',
        message: 'Le compte '+from+' a été refresh'
      }
      this.$store.dispatch('toast/show', payload)
    },
  }
}
</script>

<style lang="scss">
#account {
  h2 {
    color: #9286e2;
    font-size: 2.02em;
    font-weight: bold;
  }
  h3 {
    color: #86a8e2;
    font-size: 1.66em;
    font-weight: bold;
  } 
}
</style>