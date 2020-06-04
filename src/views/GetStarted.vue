<template>
  <div id="getstarted">
    <h2>Description</h2>
    <p class="lead">Cette plateforme s'inscrit dans une démarche de décourte et partage de nouveautés musicales. Cela permet de faciliter l'accès aux musiques de façon standard, en s'abstenant du fonctionnement spécifique de chaque application.</p>
    <hr>
    <h2>Get Started</h2>
    <ol>
      <li>
        <p class="main">Créer un compte sur matis</p>
        <div class="description">
          <p>Ce compte est la référence pour se connecter sur Matis. Il permettra ensuite de stocker les informations nécessaire au bon fonctionnement de l'application</p>
          <p>Vous pouver créer un compte ici : <router-link to="/register">Register</router-link>.</p>
          <p>Si vous avez déjà un compte, vous pouvez vous connecter directement ici : <router-link to="/login">Login</router-link>.</p>
        </div>
      </li>
      <li>
        <p class="main">Relier vos compte d'applications musicales</p>
        <div class="description">
          <p>Une fois le compte créé, vous pouvez reliez vos applications sur cette page : <router-link to="/account">Account</router-link>.</p>
        </div>
      </li>
      <li>
        <p class="main">Afficher du contenu en se basant sur vos favoris</p>
        <div class="description">
          <p>Pour proposer du contenu, il faut un peu d'activité sur vos applications. Matis peut alors récupérer vos artistes favoris, vos playlists suivis avec les données des artistes, albums et musiques associés.</p>
        </div>
      </li>
      <li>
        <p class="main">Voir les nouveautés</p>
        <div class="description">
          <p>Une fois les actions ci-dessus réalisées, leurs données seront traités pour proposer du contenu sur les nouveautés qui pourront vous intéresser.</p>
        </div>
      </li>
    </ol>
    <hr>
    <h2>Comment ça marche Jamy ?</h2>
    <ul>
      <li>Les données sont founies par les APIs des applications respectives</li>
      <li>Les données sont aggrégées par un serveur <a href="https://nodejs.org" target="_blank">Node.js</a></li>
      <li>Cette application web est développée avec <a href="https://vuejs.org" target="_blank">Vue.js</a></li>
    </ul>
    <hr>
    <h2>About</h2>
    <div class="d-flex align-self-center">
      <i class="tiny material-icons">copyright</i>
      <p class="ml-2"><span class="font-weight-bold">2020</span> ~ Nicolas Valaise | <a href="https://github.com/Matis-apps" target="_blank">Github</a></p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'GetStarted',
}
</script>

<style lang="scss">
#getstarted {
  li {
    .main {
      font-weight: bold;
      font-style: italic;
    }

    .description {
      color: #2c3e50;
    }
  }
}
</style>