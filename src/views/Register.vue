<template>
  <div>
    <div class="row">
      <div class="offset-4 col-4">
        <div class="card p-3">
          <form>
            <div class="form-group">
              <label for="inputName">Nom</label>
              <input type="text" class="form-control" id="inputName" aria-describedby="inputName" placeholder="Votre nom">
            </div>
            <div class="form-group">
              <label for="inputEmail">Adresse e-mail</label>
              <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Votre e-mail">
              <small id="emailHelp" class="form-text text-muted">Nous ne partagerons jamais votre e-mail avec quelqu'un d'autre.</small>
            </div>
            <div class="form-group">
              <label for="inputPassword1">Mot de passe</label>
              <input type="password" class="form-control" id="inputPassword1" placeholder="azerty">
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