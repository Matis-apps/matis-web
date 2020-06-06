<template>
  <div id="account">
    <div class="d-flex flex-row mb-3">
      <h2 v-if="loading||user">Vue d'ensemble du compte</h2>
      <h2 v-else>Le compte n'existe pas</h2>
      <div v-show="loading" class="spinner-border mx-3" style="width: 2rem; height: 2rem;" role="status"></div>
    </div>
    <div v-if="user">
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
          <span class="col-8 font-weight-bold text-truncate text-right" v-on:click="showAccountToken = !showAccountToken">{{showAccountToken ? token : 'Cliquer pour afficher'}}</span>
        </div>
        <hr>
      </div>

      <div class="mb-4">
        <h3 class="mb-3">Deezer</h3>
        <div v-if="user.deezer">
          <div class="d-flex justify-content-between align-items-end">
            <span class="col-2">
              <img :src="user.deezer.account.picture" class="img-fluid rounded">
            </span>
            <span class="col-10 font-weight-lighter text-right">Console pour accéder aux données : <a href="https://developers.deezer.com/api/explorer" target="_blank">https://developers.deezer.com/api/explorer</a></span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <span class="col-4 font-weight-lighter">Login</span>
            <span class="col-8 font-weight-bold text-right"><small>#{{user.deezer.account.id}} -</small> {{user.deezer.account.name}}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <span class="col-4 font-weight-lighter">Access Token</span>
            <span class="col-8 font-weight-bold text-truncate text-right" v-on:click="showDeezerToken = !showDeezerToken">{{showDeezerToken ? user.deezer.token.access_token : 'Cliquer pour afficher'}}</span>
          </div>
          <hr>
        </div>
        <div v-else>
          <div class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="tiny material-icons mr-2">add_alert</i>
            Le compte Deezer n'est pas connecté. Cela peut limiter certaines fonctionnalités.
          </div>
        </div>
        <p><a class="btn btn-primary" :href="deezerConnect" role="button">{{user.deezer ? 'Mettre à jour':'Connecter'}}</a></p>
      </div>

      <div class="mb-4">
        <h3 class="mb-3">Spotify</h3>    
        <div v-if="user.spotify">
          <div v-if="user.spotify.account.images && user.spotify.account.images.length > 0" class="d-flex justify-content-between align-items-end">
            <span class="col-2">
              <img :src="user.spotify.account.images[0].url" class="img-fluid rounded">
            </span>
            <span class="col-10 font-weight-lighter text-right">Console pour accéder aux données : <a href="https://developer.spotify.com/console/" target="_blank">https://developer.spotify.com/console/</a></span>
          </div>
          <div v-else>
            <span class="col-12 font-weight-lighter">Console pour accéder aux données : <a href="https://developer.spotify.com/console/" target="_blank">https://developer.spotify.com/console/</a></span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <span class="col-4 font-weight-lighter">Login</span>
            <span class="col-8 font-weight-bold text-right"><small>#{{user.spotify.account.id}} -</small> {{user.spotify.account.display_name}}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <span class="col-4 font-weight-lighter">Access Token</span>
            <span class="col-8 font-weight-bold text-truncate text-right" v-on:click="showSpotifyToken = !showSpotifyToken">{{showSpotifyToken ? user.spotify.token.access_token : 'Cliquer pour afficher'}}</span>
          </div>
          <hr>
        </div>
        <div v-else>
          <div class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="tiny material-icons mr-2">add_alert</i>
            Le compte Spotify n'est pas connecté. Cela peut limiter certaines fonctionnalités.
          </div>
        </div>
        <p><a class="btn btn-primary" :href="spotifyConnect" role="button">{{user.spotify ? 'Mettre à jour':'Connecter'}}</a></p>
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
      loading: false,
      showAccountToken: false,
      showDeezerToken: false,
      showSpotifyToken: false,
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
      this.loading = true;
      axios.get(url)
        .then((response) => {
          if (response.status === 200) {
            this.user = response.data;
          }
        })
        .catch(err => this.showError(err))
        .finally(() => {
          this.loading = false;
        })
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
      this.$emit('startLoading','Mise à jour du compte Deezer...');
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
      this.$emit('startLoading','Mise à jour du compte Spotify...');
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
      this.$emit('success', 'Le compte '+from+' a été mis à jour')
      this.$store.dispatch('platform/addPlatform', from);
      this.$store.dispatch('platform/setCurrentPlatform', from);
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