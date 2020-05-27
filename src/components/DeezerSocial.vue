<template>
  <div>
    <div v-if="errorMessage" class="row">
      <div class="mx-auto" style="width: 400px;">
        <div class="alert alert-secondary text-center">
          <div class="spinner-grow text-danger" role="status"></div>
          <span class="mx-3 small">{{errorMessage}}</span>
        </div>
      </div>
    </div>
    <div v-else-if="loadingSocial" class="row justify-content-center">
      <div class="alert alert-secondary">
        <div class="spinner-border text-success" role="status"></div>
        <span class="mx-3">Chargement des amis...</span>      
      </div>
    </div>
    <div id="selectFriend" class="row mb-2 d-flex">
      <div class="offset-1 col-3">
        <div class="card bg-light border-success mb-3">
          <div class="card-header">Voir l'activitié de ton pote</div>
          <div class="card-body text-success">
            <div class="row" v-if="selectedFriend">
              <div class="col-6">
                <h5 class="card-title">{{selectedFriend.name}}</h5>
                <p class="card-text"><a :href="'https://www.deezer.com/profile/'+selectedFriend.id" target="_blank">Profile</a></p>
              </div>
              <div class="col-6">
                <img class="img-fluid" v-bind:src="selectedFriend.picture">
              </div>            
            </div>
            <div v-else class="alert alert-warning">
              <p class="mb-0">Selectionne un ami dans la liste.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-7 align-self-center">
        <p><small>{{friends.length}} amis suivis</small></p>
        <select class="custom-select" @change="onChangeFriend($event)">
          <option v-for="friend in friends" 
            v-bind:key="'friend-'+friend.id"
            :value="friend.id">
            {{friend.name}}
          </option>
        </select>
      </div>
    </div>
    <div id="releases" v-if="selectedFriend">
      <div v-show="loadingReleases" class="row justify-content-center">
        <div class="alert alert-secondary">
          <div class="spinner-border text-success" role="status"></div>
          <span class="mx-3">Chargement des nouveautés...</span>      
        </div>
      </div>
      <div class="row">
        <div class="social offset-1 col-3">
          <transition name="slide-fade" >
            <DeezerReleaseList
              v-bind:user_id="selectedFriend.id"
              v-on:error="onError"
              v-on:endingLoad="onEndingLoad"
              v-on:showRelease="onRelease"/>
          </transition>
        </div>
        <div class="col-7">
          <ReleaseContent 
            v-if="displayContent"
            v-bind:release="selectedRelease"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import DeezerReleaseList from './DeezerReleaseList.vue'
import ReleaseContent from './ReleaseContent.vue'

export default {
  name: 'DeezerSocial',
  components: {
     DeezerReleaseList,
     ReleaseContent
  },
  data() {
    return {
      user_id: 16192550,
      friends: [],
      selectedFriend: null,

      releases: [],

      errorMessage: null,
      loadingReleases: false,
      loadingSocial: false,
      selectedRelease: null,
      displayContent: false,
    }
  },
  mounted() {
    // init arrays
    this.releases = [];
    this.friends = [];

    // nullable variables
    this.selectedFriend = null;
    this.errorMessage = null;
    this.selectedRelease = null;

    // init booleans
    this.loadingSocial = false;
    this.loadingReleases = false;
    this.displayContent = false;

    // load the friends
    if (localStorage.token) this.fetchFriends();
    else this.errorMessage = 'No token provided';
  },
  methods: {
    fetchFriends () {
      this.loadingSocial = true;
      this.$axios.get(process.env.VUE_APP_ROOT_API+"/deezer/me/social", { headers: { 'Authorization': localStorage.token, 'Content-Type': 'text/plain' } })
        .then((response) => {
          this.loadingSocial = false;
          if (response.status === 200 && response.data.data) {
            response.data.data.followings.forEach(friend => (
              this.friends.push(friend)
            ));   
          }
        })
        .catch((error) => {
          this.loadingSocial = false;
          switch(error.response.status) {
            case 401:
              this.errorMessage = "Il faut refresh le token";
              break;
            default:
              this.errorMessage = error;
              break;
          }
        });
    },
    onChangeFriend(event) {
      this.releases = [];
      this.selectedRelease = null;

      const friend_id = event.target.value;
      this.selectedFriend = this.friends.find(item => {
        return item.id == friend_id;
      })
      this.displayContent = false;
      this.loadingReleases = true;
    },
    onError: function (error) {
      console.log(error)
      this.errorMessage = error;
    },
    onEndingLoad: function () {
      this.loadingReleases = false;
      this.displayContent = true;
    },
    onRelease: function (item) {
      this.selectedRelease = item;
    }
  }
}
</script>

<style type="text/css">
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>