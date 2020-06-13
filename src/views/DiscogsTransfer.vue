<template>
  <div>
    <div class="d-flex align-items-start">
      <router-link to="/tool" class="d-inline-flex align-items-center" style="text-decoration: none;"><i class="small text-primary material-icons mr-1">keyboard_arrow_left</i>Outils</router-link>
      <div class="flex-grow-1 d-flex justify-content-center text-muted">
        <div v-show="loading" class="spinner-border" style="width: 2rem; height: 2rem;" role="status"></div>
        <h3 class="mx-3">Discogs transfert</h3>
      </div>
    </div>
    <div v-if="folder.length > 0">
      <h4 class="text-muted my-2">Collections</h4>
      <div class="row d-flex justify-content-around">
        <button type="button" class="btn btn-light" v-for="folder in folder" v-bind:key="folder.id" v-on:click="displayFolder(folder.id)">
          {{folder.name}} <span class="ml-2 badge badge-primary">{{folder.count}}</span>
        </button>
      </div>
    </div>
    <div v-if="collection.length > 0">
      <div class="card my-3">
        <div class="card-body">
          <p class="card-title text-center text-uppercase font-weight-bold">Opérations</p>
          <div class="row d-flex justify-content-around">
            <button class="my-2 btn btn-sm btn-primary" @click="onAction('compatibility')">Vérifier la compatibilité</button>          
            <button class="my-2 btn btn-sm btn-secondary" @click="onAction('creation')" disabled>Créer une playlist</button>          
            <button class="my-2 btn btn-sm btn-secondary" @click="onAction('status')" disabled>Voir le status du transfert</button>          
          </div>
          <div v-if="genres && genres.length > 0">
            <hr class="my-2">
            <p class="card-title text-center text-uppercase font-weight-bold">Filtrer par genre</p>
            <div class="row text-left">
              <span v-for="item in genres" v-bind:key="item.key" class="small">
                <button :id="'btn-genre-'+item.key" type="button" class="btn btn-sm btn-link" :class='item.isClicked == true ? "text-success" : "text-primary"' v-on:click="onSelectGenre(item.key)">{{item.value}}</button>&nbsp;|&nbsp;
              </span>
            </div>
          </div>
        </div>
        <div class="card-footer text-muted small">
          {{countCollection}} vinyles affichés / {{countCheckedCollection}} selectionnés
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th style="width: 5%" scope="col" class="text-center align-middle">
                <input type="checkbox" id="selectAll" @change="onSelectAll">
              </th>
              <th style="width: 5%" scope="col" class="text-center">#</th>
              <th style="width: 10%" scope="col">Cover</th>
              <th style="width: 40%" scope="col">Vinyle</th>
              <th style="width: 40%" scope="col">Status</th>
            </tr>
          </thead>
           <tbody id="collection">
            <tr 
              v-for="(item, index) in collection"
              v-bind:key="item._uid"
              v-show="item.display"
              @click="onClickItem(index)">

              <th scope="row" class="text-center align-middle">
                <input type="checkbox" v-model="item.checked" :checked="item.checked" @change="onChangeChecked($event, index)" :id="'select'+item.id">
              </th>
              <th scope="row" class="text-center align-middle">{{index+1}}</th>
              <th ><img :src="item.picture" class="img-fluid rounded"></th>
              <th >
                <p><a :href="item.link" class="text-success" target="_blank">{{item.name}}</a><span v-for="artist in item.artists" v-bind:key="item.id+'-'+artist.id"> <span class="text-muted"> |</span> <a class="text-primary" :href="'https://www.discogs.com/artist/'+artist.id" target="_blank">{{artist.name}}</a></span></p>
                <p class="text-muted small">Date d'ajout : {{releaseDate(item.added_at)}} | Sortie en {{item.updated_at}}</p>
              </th>
              <th class="align-middle">
                <div v-if="item.offline">
                  <div class="small">
                    <span v-if="item.deezer">
                      <p class="d-flex justify-content-between">
                        <span>
                          <b>Deezer : </b><a :href="item.deezer.album.link" target="_blank">{{item.deezer.album.name}}</a>
                        </span>
                        <span class="align-self-center badge badge-primary">{{item.deezer.validity_percent}} %</span>
                      </p>
                    </span>
                    <span v-else>
                      <p class="text-warning"><b>Deezer : </b>Non trouvé</p>
                    </span>
                  </div>
                  <div class="small">
                    <span v-if="item.spotify">
                      <p class="d-flex justify-content-between">
                        <span>
                          <b>Spotify : </b><a :href="item.spotify.album.link" target="_blank">{{item.spotify.album.name}}</a>                      
                        </span>
                        <span class="align-self-center badge badge-primary">{{item.spotify.validity_percent}} %</span>
                      </p>
                    </span>
                    <span v-else>
                      <p class="text-warning"><b>Spotify : </b>Non trouvé</p>
                    </span>
                  </div>
                </div>
              </th>
              <th class="text-center align-middle">
                <i v-if="item.checkTransfer" class="text-warning material-icons">autorenew</i>
                <i v-else-if="item.offline" class="text-success material-icons">cloud_done</i>
                <i v-else class="text-secondary material-icons">cloud_off</i>
                <button v-if="item.offline" @click="onAction('bug', index)" type="button" class="d-block text-center btn btn-link" data-toggle="tooltip" data-placement="bottom" title="Signaler un bug">
                  <i  class="material-icons text-warning">bug_report</i>
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{action.title}}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>{{action.message}}</p>
              <p class="text-muted">{{action.subMessage}}</p>
              <p v-if="action.notice" class="text-muted small">{{action.notice}}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Annuler</button>
              <button type="button" class="btn btn-sm btn-primary" @click="handleActionCallback">Lancer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'DiscogsTransfer',
  data() {
    return {
      loading: false,
      folder: [],
      collection: [],
      genres: [],
      action: Object,
      maxSizeForCompatibility: 60,
    }
  },
  computed: {
    countAll: function() {
      return this.collection.length;
    },
    countCollection: function() {
      return this.collection.filter(i => i.display).length;
    },
    countCheckedCollection: function() {
      return this.collection.filter(i => i.checked).length;
    },
    countCheckedDisplayedCollection: function () {
      return this.collection.filter(i => i.display && i.checked).length
    },
    countCheckedOfflineCollection: function () {
      return this.collection.filter(i => !i.offline && i.checked).length
    },
  },
  mounted() {
    this.loading = true;
    this.$emit('startLoading', 'Chargement des répertoires...');
    const url = "/discogs/me/folders";
    axios.get(url)
      .then((response) => {
        if (response.status === 200 && response.data) {
          this.folder = response.data.folders;
          this.$emit('success', 'Récupération des répertoires avec succès !');
        }
        this.$emit('endLoading');
      })
      .catch((error) => {
        this.$emit('endLoading');
        this.$emit('error', error);
      })
      .finally(() => {
        this.loading = false;
      })
  },
  methods: {
    releaseDate(date) {
      return this.$moment(date).format('YYYY-MM-DD');
    },
    displayFolder(id) {
      this.loading = true;
      this.$emit('startLoading', 'Chargement de la collection...');
      const url = "/discogs/me/folder/" + id;
      axios.get(url)
        .then((response) => {
          if (response.status === 200 && response.data) {
            this.collection = response.data.data;
            this.collection = this.collection.map(r => {
              r.display = true; 
              r.checked = false;
              r.checkTransfer = false;
              return r;
            });
            this.genres = response.data.genres;
            this.genres.map(g => g.isClicked = false);
            this.$emit('success', 'Récupération de le collection avec succès !');
          }
          this.$emit('endLoading');
        })
        .catch((error) => {
          this.$emit('endLoading');
          this.$emit('error', error);
        })
        .finally(() => {
          this.loading = false;
        })
    },
    onChangeChecked(event, id) {
      if (id < this.countAll) {
        let item = this.collection[id];
        item.checked = event.target.checked;
        this.$set(this.collection, id, item)
        document.getElementById("selectAll").checked = this.countCheckedDisplayedCollection == this.countCollection;
      }
    },
    onClickItem(id) {
      if (id < this.countAll) {
        let item = this.collection[id];
        item.checked = !item.checked;
        this.$set(this.collection, id, item)
        document.getElementById("selectAll").checked = this.countCheckedDisplayedCollection == this.countCollection;
      }
    },
    onSelectAll(event) {
      let checked = event.target.checked;
      this.collection = this.collection.map(item => {
        item.checked = (checked && item.display) || (item.checked && !item.display);
        return item;
      })
      event.target.checked = this.countCheckedDisplayedCollection == this.countCollection;
    },
    onSelectGenre(key) {
      this.genres = this.genres.map(g => {
        g.isClicked = g.key == key ? true : false;
        return g;
      });

      if(key == 1) {
        this.collection = this.collection.map(r => {
          r.display = true; 
          return r;
        });
      } else {
        this.collection = this.collection.map(r => {
          r.display = r.genres.map(i => i.key).includes(key);
          return r;
        });
      }
      document.getElementById("selectAll").checked = this.countCheckedDisplayedCollection == this.countCollection;
    },
    onAction(actionType, id) {
      this.action = new Object;
      this.action.type = actionType;
      switch(this.action.type) {
        case 'compatibility':
          if(this.countCheckedOfflineCollection <= 0) {
            this.$emit('error', 'Sélectionner au moins 1 vinyle dans la liste')
          } else {
            var size = Math.min(this.countCheckedOfflineCollection, this.maxSizeForCompatibility);
            this.action.title = 'Vérifier la compatibilité de la collection sélectionnée';
            this.action.message = 'On part sur ' + (size == 1 ? 'ce vinyle' : 'ces ' + size + ' vinyles') + ' ? '
            if (this.countCheckedOfflineCollection > this.maxSizeForCompatibility) {
              this.action.subMessage = 'La recherche se limite aux '+this.maxSizeForCompatibility+' premiers vinyles. Les vinyles déjà vérifiés ne seront pas intégrés à la recherche.';
            } else {
              this.action.subMessage = 'Les vinyles déjà vérifiés ne seront pas intégrés à la recherche.';
            }
            this.action.notice = 'Temps estimé : ' + Math.ceil(this.countCheckedOfflineCollection*2/60) + ' minute(s)';
            $('#exampleModal').modal('show'); // eslint-disable-line no-undef
          }
          break;
        case 'bug':
          if (id !=null && id >= 0 && id < this.countAll) {
            let item = this.collection[id];
            this.action.title = 'Signaler un bug';
            this.action.message = 'Un problème avec ' + item.name + ' ?';
            this.action.subMessage = 'Une nouvelle recherche sera effectuée.';
            this.action.params = item.id;
            $('#exampleModal').modal('show'); // eslint-disable-line no-undef
          }
          break;
        case 'creation':
          this.action.title = 'Transférer la collection sélectionnée';
          break;
        case 'status':
          this.action.title = 'Vérifier le status du transfert';
          break;
      }
    },
    handleActionCallback() {
      $('#exampleModal').modal('hide'); // eslint-disable-line no-undef
      switch(this.action.type) {
        case 'compatibility':
          this.fetchCompatibility();
          break;
        case 'bug':
          this.sendBug();
          break;
        case 'creation':
          //
          break;
        case 'status':
          //
          break;
      }
    },
    fetchCompatibility() {
      var checkedList = [];
      this.collection.forEach(item => {
        if (item.checked && !item.offline) {
          checkedList.push(item.id);
        }
      })

      checkedList = checkedList.slice(0, this.maxSizeForCompatibility);

      this.loading = true;
      this.$emit('startLoading', 'Envoie des vinyles à synchroniser...')
      const url = "/discogs/transfer/collection";
      const params = JSON.stringify(checkedList);
      axios.post(url,{releases: params})
        .then((response) => {
          this.$emit('success', 'Une exécution a bien été lancée ! Le résultat sera visible dans quelques instants.');
          this.collection = this.collection.map(item => {
            if (checkedList.includes(item.id)) {
              item.checkTransfer = true;
            }
            return item;
          });
        })
        .catch((error) => {
          this.$emit('error', error);
        })
        .finally(() => {
          this.loading = false;
        })
      // on success
    },
    sendBug() {
      let paramsID = this.action.params;
      if (!paramsID) {
        this.$emit('error', 'Aucun vinyle à signaler');
      } else {
        this.loading = true;
        this.$emit('startLoading', 'Envoie du bug à traiter...')
        const url = "/discogs/transfer/bug";
        const params = JSON.stringify(paramsID);
        axios.post(url,{release_id: params})
          .then((response) => {
            this.$emit('success', 'Le bug a été signalé ! Une nouvelle recherche sera effectuée.');
            this.collection = this.collection.map(item => {
              if (item.checked) {
                item.checkTransfer = true
              }
              return item;
            });
          })
          .catch((error) => {
            this.$emit('error', error);
          })
          .finally(() => {
            this.loading = false;
          })
      }
    }
  }
}
</script>