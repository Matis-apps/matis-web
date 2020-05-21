<template>
  <div>

    <div>
      <p v-if="token">Bearer token: {{ token.substring(0,50) }} ...</p>
      <p v-else>No token</p>
    </div>

    <div v-if="user">
      <p>Mail: {{ user.email }}</p>    
      <p>User: {{ user.name }}</p>

      <div>
        <h3>Deezer</h3>
        <div v-if="user.deezer">
          <p>Yes</p>
          <p>Access Token: {{user.deezer.access_token}}</p>
        </div>
        <div v-else>
          <a class="btn btn-primary" :href="deezerConnect" role="button">Connect</a>
        </div>
      </div>
      
    </div>
    <p v-else>No user</p>

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
      deezerConnect: "https://connect.deezer.com/oauth/auth.php?app_id=" + process.env.VUE_APP_DEEZER_APP_ID + "&redirect_uri=" + process.env.VUE_APP_URL + process.env.VUE_APP_DEEZER_REDIRECT
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
      if (localStorage.token) {
        this.token = localStorage.token;

        const url = process.env.VUE_APP_ROOT_API + "/users/me";

        this.$axios.get(url, { headers: { 'Authorization': this.token, 'Content-Type': 'text/plain' } })
          .then((response) => {
            if (response.status === 200) {
              this.user = response.data.data;
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              this.errorMessage = "Vous devez vous connecter";
            } else {
              this.errorMessage = err.response.data;
            }
          });
      } else {
        this.errorMessage = "Vous devez vous connecter";
      }
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
            this.user.deezer = response.data.data;
            console.log(this.user.deezer)
          }
        })
        .catch((error) => {
          console.log("Error: "+error)
        });
    }
  }

}
</script>