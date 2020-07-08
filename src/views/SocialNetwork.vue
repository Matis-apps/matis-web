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
    <form v-on:submit.prevent="onSearchUser" class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12">
      <div class="form-group row mb-2">
        <select class="col-sm-3 custom-select my-1" id="inlineFormCustomSelect">
          <option value="deezer">Deezer</option>
          <option value="spotify">Spotify</option>
        </select>
        <div class="col-sm-7">
          <input type="text" class="form-control my-1" id="inlineFormInputUsername" placeholder="Username">
        </div>
        <div class="col-sm-2">
          <button type="submit" class="btn btn-success d-block my-1">Lancer</button>
        </div>
      </div>
    </form>
    <div v-if="results && results.length > 0" class="offset-md-1 col-md-10 col-sm-12">
      <ul class="list-group d-flex flex-column-reverse">
        <li class="list-group-item" v-for="(user, index) in results" v-bind:key="'user-'+index">
          <div class="row ">
            <div class="col-lg-2 col-md-3 col-sm-4 text-sm-left text-center">
              <img :src="user.picture" class="my-2 img-fluid rounded">
            </div>
            <div class="col-lg-10 col-md-9 col-sm-8 d-flex justify-content-between">
              <div class="row d-block">
                <p>{{user.fullname||user.name}} (#{{user.id}}) </p>
                <p class="small">à partir de <b>{{user._from}}</b></p>
                <p class="small"><a :href="user.profile" class="text-success" target="_blank" rel="noopener">{{ user.profile }}</a></p>
              </div>
              <div>
                <button type="button" class="btn btn-primary">Suivre</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
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
      results: [],
    }
  },
  mounted() {
    try {
      this.loading = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    onSearchUser() {
      console.log()
      const from = document.getElementById("inlineFormCustomSelect").value;
      const username = document.getElementById("inlineFormInputUsername").value;
      if (!from) {
        this.$emit('error', "Aucune plateforme sélectionnée");
      } else if (!username) {
        this.$emit('error', "Saisir le nom ou l'identifiant d'un utilisateur");
      } else {
        this.$emit('startLoading', 'Recherche en cours...');
        this.loading = true;
        axios.get(process.env.VUE_APP_ROOT_API+"/"+from+"/search?t=user&q="+encodeURIComponent(username))
          .then((response) => {
            if (response.status === 200) {
              if ( response.data && response.data.data
                && response.data.data.users
                && response.data.data.users
                && response.data.data.users.length > 0) {
                  Array.prototype.push.apply(this.results, response.data.data.users);
                  this.$emit('success', 'La liste des utilisateurs a été mise à jour');
              } else {
                this.$emit('error', 'Aucune utilisateur trouvé');
              }
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            this.$emit('error', error)
          });
      }
    }
  }
}
</script>
