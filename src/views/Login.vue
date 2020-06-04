<template>
  <div id="login">
    <div class="my-4">
      <h2 class="text-center">Login</h2>
    </div>
    <div class="row mb-2">
      <div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 offset-sm-1 col-sm-10 col-xs-12">
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
    <div class="row">
      <div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 offset-sm-1 col-sm-10 col-xs-12">
        <div class="alert alert-warning mx-4" role="alert">
          Première connexion sur Matis ? Enregistres toi ici : <router-link to="/register">Register</router-link>
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
        this.$emit('error', "L'adresse email est obligatoire");
      }
      else if (this.password == '') {
        this.$emit('error', "Mot de passe manquant");
      } else {
        const url = "/auth/login";
        const params = {
          'email': this.email,
          'password': this.password
        };

        this.$store.dispatch('auth/login', params)
          .then(() => {
            if (this.$route.query.redirect) {
              this.$router.push({ path: this.$route.query.redirect });
            } else {
              this.$router.push({ path: 'account' });
            } 
          })
          .catch(error => {
            this.$emit('error', error);
          })
      }
    }
  }
}
</script>