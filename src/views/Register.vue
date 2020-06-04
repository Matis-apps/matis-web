<template>
  <div id="register">
    <div class="my-4">
      <h2 class="text-center">Register</h2>
    </div>
    <div class="row mb-2">
      <div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 offset-sm-1 col-sm-10 col-xs-12">
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
              <input v-model="password" type="password" class="form-control" id="inputPassword1" placeholder="N'utilisez pas azerty...">
            </div>
            <button type="submit" class="btn btn-primary">Enregister</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: 'Login',
  data() {
    return {
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
        this.$emit('error', "Un p'tit nom est obligatoire");
      }
      else if (this.email == '') {
        this.$emit('error', "L'adresse email est obligatoire");
      }
      else if (this.password == '') {
        this.$emit('error', "Mot de passe manquant");
      } else {
        const url = "/auth/register";
        const params = {
          'name': this.name,
          'email': this.email,
          'password': this.password
        };

        this.$store.dispatch('auth/register', params)
          .then(() => {
            this.$router.push({ path: 'account' });
          })
          .catch(error => {
            this.$emit('error', error);
          })
      }
    }
  }
}
</script>