<template>
  <div id="releases">
    <div class="d-flex justify-content-center text-muted">
      <h3 class="mx-3">Outils</h3>
    </div>
    <div class="row list-group mx-3">
      <router-link to="/tool/discogs" class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Vinyles</h5>
          <span v-if="hasDiscogs" class="badge badge-pill badge-success align-self-center">Compte connecté</span>
          <span v-else class="badge badge-pill badge-warning align-self-center">Aucun compte</span>
        </div>
        <div class="my-3 d-flex align-items-center">
          <span class="d-inline-flex bg-dark p-3 rounded mr-3"><img src="https://a.discogs.com/dd23b6d4b98f97f63ff7f251a00b091a5e15d40d/images/discogs-white.png?5"></span>
          <span class="small">Gérer et tansférer ma collection</span>
        </div>
      </router-link>
      <router-link to="/tool/netwok" class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Réseaux</h5>
          <small>In progress</small>
        </div>
        <div class="my-3 d-flex align-items-center">
          <span class="d-inline-flex bg-dark p-3 rounded mr-3" ><i class="large material-icons" style="color: white; font-size: 4rem;">people_outline</i></span>
          <span class="small">Suivre mes amis avec Matis</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Tool',
  computed: {
    hasDiscogs: function() {
      return this.$store.getters['platform/isEnabled']('Discogs');
    }
  },
}
</script>