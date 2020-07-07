<template>
  <div>
    <div class="d-flex align-items-start">
      <router-link to="/tool" class="d-inline-flex align-items-center" style="text-decoration: none;"><i class="small text-primary material-icons mr-1">keyboard_arrow_left</i>Outils</router-link>
      <div class="flex-grow-1 d-flex justify-content-center text-muted">
        <div v-show="loading" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
        <h3 class="mx-3">Gérer mes réseaux d'amis</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 px-lg-6 col-md-5 px-md-4 col-sm-12 px-sm-4 order-2 order-md-12 mx-0">
        <div class="card bg-light mb-3" style="border-color: #9286e2;">
          <div v-if="selectedFriend" class="card-header">L'activité de cet ami est disponible <router-link to="/social">ici</router-link></div>
          <div v-else class="card-header">Voir l'activité d'un(e) ami(e)</div>
          <div class="card-body text-success">
            <div class="row" v-if="selectedFriend">
              <div class="col-6 text-left">
                <img class="img-fluid rounded" v-bind:src="selectedFriend.picture">
              </div>
              <div class="col-6 text-right">
                <h5 class="card-title" style="color: #9286e2;">{{selectedFriend.name}}</h5>
                <p class="card-text"><a :href="selectedFriend.link" target="_blank" rel="noopener">Lien</a></p>
              </div>
            </div>
            <div v-else class="alert alert-warning">
              <p class="mb-0">Selectionne un(e) ami(e) dans la liste.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-8 col-md-7 px-md-4 col-sm-12 px-sm-4 order-1 order-md-12 mx-0 align-self-center">
        <select class="custom-select my-2">
          <optgroup label="Deezer">
            <option>Mustard</option>
            <option>Ketchup</option>
            <option>Relish</option>
          </optgroup>
          <optgroup label="Spotify">
            <option>Tent</option>
            <option>Flashlight</option>
            <option>Toilet Paper</option>
          </optgroup>
        </select>
      </div>
    </div>
    <hr class="my-2">
    <h4>Rechercher</h4>
    <form class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12">
      <div class="form-group row mb-2">
        <select class="col-sm-3 custom-select my-1" id="inlineFormCustomSelect">
          <option value="deezer">Deezer</option>
          <option value="spotify">Spotify</option>
        </select>
        <div class="col-sm-7">
          <input type="text" class="form-control my-1" id="inlineFormInputUsername" placeholder="Username">
        </div>
        <div class="col-sm-2">
          <button type="submit" class="btn btn-primary d-block my-1">Lancer</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'SocialNetwork',
  data() {
    return {
      loading: false,
      selectedFriend: null,
    }
  },
  computed: {

  },
  mounted() {
    try {
      this.loading = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    //
  }
}
</script>
