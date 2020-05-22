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
      <div class="card">
        <div class="card-header">
          Deezer
        </div>
        <div class="card-body">
          <div v-if="user.deezer">
            <p><b>#{{user.deezer.account.id}}</b> - {{user.deezer.account.name}}</p>
            <p>{{user.deezer.account.fullname}}</p>
            <p>Access Token: {{user.deezer.token.access_token}}</p>
          </div>
          <p><a class="btn btn-primary" :href="deezerConnect" role="button">{{user.deezer ? 'Refresh':'Connect'}}</a></p>
        </div>
      </div>
    </div>
      

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{errorMessage}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Account',
  data() {
    return {
      user: null,
      token: null,
      errorMessage: null,
      loadingAccounts: false,
      deezerConnect: "https://connect.deezer.com/oauth/auth.php?app_id=" + process.env.VUE_APP_DEEZER_APP_ID + "&redirect_uri=" + process.env.VUE_APP_URL + process.env.VUE_APP_DEEZER_REDIRECT
    }
  },
  created() {
    if (localStorage.token) {

      this.fetchAccount();

      if (Object.keys(this.$route.query).length > 0) {
        this.handleCallback(this.$route.query)      
      }
    }
    else {
      this.errorMessage = "Vous devez vous connecter"
    }
  },
  methods: {
    fetchAccount () {
      this.token = localStorage.token;
      const url = process.env.VUE_APP_ROOT_API + "/users/me";

      this.loadingAccounts = true;
      this.$axios.get(url, { headers: { 'Authorization': this.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          this.loadingAccounts = false;

          if (response.status === 200) {
            this.user = response.data.data;
          }
        })
        .catch((err) => {
          this.loadingAccounts = false;

          if (err.response.status === 401) {
            this.errorMessage = "Erreur de connection";
          } else {
            this.errorMessage = err.response.data;
          }
        });
    },
    handleCallback(query) {
      switch(query.from) {
        case 'deezer':
          if(query.code) this.getDeezerToken(query.code)
          break;
        default:
          console.log("Not supported", query)
          break;
      }
    },
    getDeezerToken (code) {
      const url = process.env.VUE_APP_ROOT_API + "/users/token/deezer?code="+code;

      this.$axios.get(url, { headers: { 'Authorization': this.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          if (response.status === 200) {
            this.user = {
              ...this.user,
              deezer: response.data.data
            };
          }
        })
        .catch((err) => {
          this.errorMessage = err.response.data;
        });
    }
  }

}
</script>