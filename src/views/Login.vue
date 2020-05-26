<template>
  <div id="login">
    <div class="row">
      <div class="offset-4 col-4">
        <div class="card p-3">
          <form @submit="checkForm">
            <div class="form-group">
              <label for="inputEmail">Compte</label>
              <input v-model="email" type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Votre e-mail">
              <small id="emailHelp" class="form-text text-muted">Veillez renseigner votre adresse e-mail.</small>
            </div>
            <div class="form-group">
              <label for="inputPassword">Mot de passe</label>
              <input v-model="password" type="password" class="form-control" id="inputPassword" placeholder="azerty">
            </div>
            <button type="submit" class="btn btn-primary">Connexion</button>
          </form>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="offset-4 col-4">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{errorMessage}}
        </div>
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{successMessage}}
        </div>
        <div class="alert alert-warning" role="alert">
          Première connextion sur #matis ? Enregister toi <router-link to="/register">ici</router-link> !
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  data() {
    return {
      successMessage: null,
      errorMessage: null,
      email: '',
      password: '',
    }
  },
  created() {
    //
  },
  methods: {
    checkForm: function (e) {
      e.preventDefault();

      if (this.email == '') {
        this.errorMessage = "L'adresse email est obligatoire";
      }
      else if (this.password == '') {
        this.errorMessage = "Mot de passe manquant";
      } else {
        const url = process.env.VUE_APP_ROOT_API + "/auth/login";
        const params = {
          'email': this.email,
          'password': this.password
        };

        this.$axios.post(url, params)
          .then((response) => {
            this.errorMessage = null;
            if (response.status === 200) {
              this.successMessage = "OK";
              localStorage.token = response.data.data.token;
              this.$router.push({ path: 'account' });
            }
          })
          .catch((err) => {
            this.successMessage = null;            
            if (err.response.status === 403) {
              this.errorMessage = "Utilisateur introuvable";
            } else if (err.response.status === 401) {
              this.errorMessage = "Mot de passe invalide";
            } else {
              this.errorMessage = err.response.data;
            }
          });
      }
    }
  }
}
</script>