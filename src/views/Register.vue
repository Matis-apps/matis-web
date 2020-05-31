<template>
  <div>
    <div class="row">
      <div class="offset-4 col-4">
        <div class="card p-3">
          <form @submit="checkForm">
            <div class="form-group">
              <label for="inputName">Nom</label>
              <input v-model="name" type="text" class="form-control" id="inputName" aria-describedby="inputName" placeholder="Votre nom">
            </div>
            <div class="form-group">
              <label for="inputEmail">Adresse e-mail</label>
              <input v-model="email" type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Votre e-mail">
              <small id="emailHelp" class="form-text text-muted">Nous ne partagerons jamais votre e-mail avec quelqu'un d'autre.</small>
            </div>
            <div class="form-group">
              <label for="inputPassword1">Mot de passe</label>
              <input v-model="password" type="password" class="form-control" id="inputPassword1" placeholder="azerty">
            </div>
            <button type="submit" class="btn btn-primary">Enregister</button>
          </form>
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="row mt-2">
      <div class="offset-4 col-4">
        <div class="alert alert-danger" role="alert">
          {{errorMessage}}
        </div>
      </div>
    </div>
    <div v-if="successMessage" class="row mt-2">
      <div class="offset-4 col-4">
        <div class="alert alert-success" role="alert">
          {{successMessage}}
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
      name: '',
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

      if (this.name == '') {
        this.errorMessage = "Un p'tit nom est obligatoire";
      }
      else if (this.email == '') {
        this.errorMessage = "L'adresse email est obligatoire";
      }
      else if (this.password == '') {
        this.errorMessage = "Mot de passe manquant";
      } else {
        const url = process.env.VUE_APP_ROOT_API + "/auth/register";
        const params = {
          'name': this.name,
          'email': this.email,
          'password': this.password
        };

        this.$axios.post(url, params)
          .then((response) => {
            this.errorMessage = null;

            if (response.status === 200) {
              this.successMessage = "OK";
              localStorage.token = response.data.data.access_token;
              this.$router.push({ path: 'account' });
            }
          })
          .catch((err) => {
            this.successMessage = null;
            if (err.response.status === 401) {
              this.errorMessage = "L'adresse e-mail est déjà utilisée.";
            } else {
              this.errorMessage = err.response.data;
            }
          });
      }
    }
  }
}
</script>