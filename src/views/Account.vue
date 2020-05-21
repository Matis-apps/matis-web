<template>
  <div>

    <p v-if="token">Bearer token: {{ token.substring(0,50) }} ...</p>
    <p v-else>No token</p>

    <div v-if="user">
      <p>Mail: {{ user.email }}</p>    
      <p>User: {{ user.name }}</p>    
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
    }
  },
  created() {

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
      console.log("two")

      this.errorMessage = "Vous devez vous connecter";
    }
  },
}
</script>