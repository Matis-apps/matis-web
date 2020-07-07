<template>
  <div id="#home">
    <div class="jumbotron bg-transparent" id="home-jumbotron">
      <h1 class="display-6">My Matis</h1>
      <p class="lead"><i class="large material-icons">music_note</i> Découvrez des nouveautés en fonction de vos affinités sur vos plateformes de musiques favorites.</p>
      <hr class="my-4">
      <p>Disponible aujourd'hui :</p>
      <ul class="mb-5">
        <li
          v-for="platform in platforms"
          v-bind:key="platform.name">
          {{platform.name}}
        </li>
      </ul>
      <div class="d-inline-flex flex-column">
        <router-link class="btn btn-primary btn-md mb-2 px-4" role="button" to="/get-started">Get started</router-link>
        <a class="btn btn-light btn-md px-4" role="button" href="https://www.youtube.com/channel/UCto8Ll3DIeW0inerDZHijRg" target="_blank" rel="noopener">
          <img class="mr-2 img-fluid" style="height: 1.5rem;" src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="Logo Youtube">
          Démo
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    platforms: function() {
      return this.$store.getters['platform/availablePlatforms'];
    },
  }
}
</script>

<style type="text/css">
#home-jumbotron:before {
  z-index: -1;
  background: url('../assets/record-player-1851576_1920.jpg') no-repeat center;
  opacity: 0.4;
  -webkit-background-size: cover; /* pour anciens Chrome et Safari */
  background-size: cover; /* version standardisée */
  content: "";
  position: absolute;
  display: inline-block;
  top: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
}
</style>
