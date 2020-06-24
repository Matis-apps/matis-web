<template>
  <div>
    <div class="d-flex align-items-start">
      <router-link to="/tool" class="d-inline-flex align-items-center" style="text-decoration: none;"><i class="small text-primary material-icons mr-1">keyboard_arrow_left</i>Outils</router-link>
      <div class="flex-grow-1 d-flex justify-content-center text-muted">
        <div v-show="loading" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
        <h3 class="mx-3">Gérer mes réseaux d'amis</h3>
      </div>
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
    }
  },
  computed: {

  },
  mounted() {
    this.loading = true; 
  },
  methods: {
    //
  }
}
</script>