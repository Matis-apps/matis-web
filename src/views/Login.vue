<template>
  <div id="login">
    <div class="row">
      <div class="offset-4 col-4">
        <div class="card p-3">
          <form @submit.prevent="checkForm">
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
        const url = "/auth/login";
        const params = {
          'email': this.email,
          'password': this.password
        };

        this.$store.dispatch('auth/login', params)
          .then(() => {
            this.$router.push({ path: 'account' });
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 403) {
                this.errorMessage = "Utilisateur introuvable";
              } else if (error.response.status === 401) {
                this.errorMessage = "Mot de passe invalide";
              } else {
                this.errorMessage = error.response.message;
              }
            } else {
                this.errorMessage = error.message;
            }
          })
      }
    }
  }
}
</script>