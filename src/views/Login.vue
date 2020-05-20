<template>
  <div id="login">
    <div class="row">
      <div class="offset-4 col-4">
        <div class="card p-3">
          <form>
            <div class="form-group">
              <label for="inputEmail">Compte</label>
              <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Votre e-mail">
              <small id="emailHelp" class="form-text text-muted">Veillez renseigner votre adresse e-mail.</small>
            </div>
            <div class="form-group">
              <label for="inputPassword">Mot de passe</label>
              <input type="password" class="form-control" id="inputPassword" placeholder="azerty">
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
        <div v-else class="alert alert-warning" role="alert">
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
    }
  },
  created() {
    //
  },
}
</script>