<template>
  <div id="getstarted">
    <h2>Description</h2>
    <p class="lead">Cette plateforme s'inscrit dans une démarche de découverte et partage de nouveautés musicales. Cela permet de faciliter l'accès aux musiques de façon standard, en s'abstenant du fonctionnement spécifique de chaque application.</p>
    <hr>
    <h2>Get Started</h2>
    <ol>
      <li>
        <p class="main">Créer un compte sur matis</p>
        <div class="description">
          <p>Ce compte est la référence pour se connecter sur Matis. Il permettra ensuite de stocker les informations nécessaires au bon fonctionnement de l'application.</p>
          <p>Vous pouvez créer un compte ici : <router-link to="/register">Register</router-link>.</p>
          <p>Si vous avez déjà un compte, vous pouvez vous connecter directement ici : <router-link to="/login">Login</router-link>.</p>
        </div>
      </li>
      <li>
        <p class="main">Attacher vos comptes d'applications musicales</p>
        <div class="description">
          <p>Une fois le compte créé, vous pouvez relier vos applications sur cette page : <router-link to="/account">Account</router-link>.</p>
          <div class="alert alert-warning mx-4" role="alert">
            Après s'être connecté, un token pour chaque application sera fourni afin de vous identifier à l'avenir. Si une erreur se produit, vous pourrez mettre à jour manuellement cet identifiant sur la même page ci-dessus.
          </div>
        </div>
      </li>
      <li>
        <p class="main">Afficher du contenu en se basant sur vos favoris</p>
        <div class="description">
          <p>Pour proposer du contenu, il faut un peu d'activité sur vos applications... À partir de ça, Matis peut alors récupérer vos artistes favoris, vos playlists suivis avec les données des artistes, albums et musiques associés.</p>
        </div>
      </li>
      <li>
        <p class="main">Sélectionner une plateforme</p>
        <div class="description">
            <span>
              Afin de naviguer entre les différentes plateformes, un bouton est disponible dans le menu comme affiché ici : 
            </span>
            <div class="mx-2 dropdown d-inline">
              <button class="btn btn-light dropdown-toggle" type="button" id="dropdownExample">
                Platform
              </button>
            </div>
            <span>
              Ainsi, les données seront automatiquement calculées en fonction de la plateforme ayant été sélectionnée.
            </span>
        </div>
      </li>
      <li>
        <p class="main">Voir les nouveautés</p>
        <div class="description">
          <p>Une fois les actions ci-dessus réalisées, les données seront traitées pour proposer du contenu sur les nouveautés qui pourront vous intéresser.</p>
        </div>
      </li>
    </ol>
    <hr>
    <h2>Comment ça marche Jamy ?</h2>
    <ul>
      <li>Les données sont fournies par les APIs des applications respectives</li>
      <li>Les données sont agrégées par un serveur <a href="https://nodejs.org" target="_blank">Node.js</a></li>
      <li>Cette application web est développée avec <a href="https://vuejs.org" target="_blank">Vue.js</a></li>
    </ul>
    <hr>
    <h2>Privacy</h2>
    <p>Matis tient à la confidentialité des données de ses utilisateurs. Lorsque vous vous connectez, uniquement les données liées au compte sont stockées : nom d'utilisateur, identifiant (généralement numérique, 14728472 ...), lien vers la photo de profil et préférences.</p>
    <p>Vous pouvez demander à tout moment de supprimer ces données.</p>
    <hr>
    <h2>About</h2>
    <p>Contributeurs : <a href="https://github.com/mmaheo" target="_blank">Maxime Maheo</a>, <a href="https://raphael.thibierge.dev" target="_blank">Raphael Thibierge</a>, <a href="https://github.com/nvalaise" target="_blank">Nicolas Valaise</a></p>
    <p>Contact : <a href="mailto:my.matis.dev@gmail.com">my.matis.dev@gmail.com</a></p>
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
    h2 {
    color: #9286e2;
    font-size: 2.02em;
    font-weight: bold;
  }
  li {
    .main {
      margin-top: 2em;
      font-weight: bold;
      font-style: italic;
    }

    .description {
      color: #2c3e50;
    }
  }
}
</style>