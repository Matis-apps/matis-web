<template>
  <div>
    <div v-if="friends.length > 0" id="selectedFriend" class="row mb-2 d-flex">
      <div class="col-lg-4 px-lg-6 col-md-5 px-md-4 col-sm-12 px-sm-4 order-2 order-md-12 mx-0">
        <div class="card bg-light mb-3" style="border-color: #9286e2;">
          <div class="card-header">Voir l'activitié de ton pote</div>
          <div class="card-body text-success">
            <div class="row" v-if="selectedFriend">
              <div class="col-6 text-left">
                <img class="img-fluid rounded" v-bind:src="selectedFriend.picture">                
              </div>
              <div class="col-6 text-right">
                <h5 class="card-title" style="color: #9286e2;">{{selectedFriend.name}}</h5>
                <p class="card-text"><a :href="'https://www.deezer.com/profile/'+selectedFriend.id" target="_blank">Profile</a></p>
              </div>            
            </div>
            <div v-else class="alert alert-warning">
              <p class="mb-0">Selectionne un ami dans la liste.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-8 col-md-7 px-md-4 col-sm-12 px-sm-4 order-1 order-md-12 mx-0 align-self-center">
        <p class="small">{{friends.length}} amis suivis</p>
        <select class="mb-2 custom-select" @change="onChangeFriend($event)">
          <option v-for="friend in friends" 
            v-bind:key="'friend-'+friend.id"
            :value="friend.id">
            {{friend.name}}
          </option>
        </select>
      </div>
    </div>
    <div id="friendList" v-if="selectedFriend">
      <div v-if="!displayContent" class="d-flex justify-content-center text-muted">
        <div v-show="loadingReleases" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
        <h3 class="mx-3">Nouveautés</h3>
      </div>
      <div class="row">
        <div class="col-lg-4 px-lg-6 col-md-5 px-md-4 col-sm-12 px-sm-4 order-2 order-md-12 mx-0">
          <transition name="slide-fade">
          <DeezerReleaseList
            v-bind:user_id="selectedFriend.id"
            v-on:startLoading="$emit('startLoading',$event)"
            v-on:error="onError"
            v-on:endLoading="onEndLoading"
            v-on:showRelease="onRelease"/>
          </transition>
        </div>
        <div v-if="displayContent" class="col-lg-8 col-md-7 px-md-4 col-sm-12 px-sm-4 order-1 order-md-12 mx-0">
          <ReleaseContent
            v-bind:release="selectedRelease"
            v-on:startLoading="$emit('startLoading',$event)"
            v-on:error="$emit('error',$event)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import DeezerReleaseList from './DeezerReleaseList.vue'
import ReleaseContent from '../ReleaseContent.vue'

export default {
  name: 'DeezerSocial',
  components: {
     DeezerReleaseList,
     ReleaseContent
  },
  data() {
    return {
      friends: [],
      selectedFriend: null,
      selectedRelease: null,
      displayContent: false,
      loadingReleases: false,
    }
  },
  mounted() {
    // init arrays
    this.friends = [];

    // nullable variables
    this.selectedFriend = null;
    this.selectedRelease = null;

    // init booleans
    this.displayContent = false;

    // load the friends
    this.fetchFriends();
  },
  methods: {
    fetchFriends () {
      this.$emit('startLoading','Chargement des amis suivis...');
      axios.get("/deezer/me/social")
        .then((response) => {
          if (response.status === 200 && response.data.data) {
            response.data.data.followings.forEach(friend => (
              this.friends.push(friend)
            ));
          }
          this.$emit('endLoading');
        })
        .catch((error) => {
          this.$emit('endLoading');
          this.$emit('error', error);
        });
    },
    onChangeFriend(event) {
      this.selectedRelease = null;
      this.loadingReleases = true;
      this.displayContent = false;

      const friend_id = event.target.value;
      this.selectedFriend = this.friends.find(item => {
        return item.id == friend_id;
      })
    },
    onError(error) {
      this.displayContent = false;
      this.loadingReleases = false;
      this.$emit('error', error);
    },
    onEndLoading() {
      this.displayContent = true;
      this.loadingReleases = false;
    },
    onRelease(item) {
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