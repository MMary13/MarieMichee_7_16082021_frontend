<template>
    <div id="Post">
      <Header />
      <h1 class="fs-1 fw-bold bg-primary py-2">Modification de l'article</h1>
      <div class="form-container bg-dark shadow p-2 rounded-3 my-5 mx-auto">
        <b-form id="updatepostform" @submit.prevent="updatePost" class="d-flex flex-column justify-content-center justify-items-center">
        <div class="form-group mt-4 d-flex align-items-center">
            <label for="title">Titre: </label>
            <input class="form-control ms-3" v-model="post.title" type="text" name="title" id="title">
        </div>

        <div class="form-group mt-4 d-flex align-items-center">
            <textarea class="form-control ms-3" v-model="post.content" name="post-content" form="updatepostform" rows="10">Entrez votre texte ici...</textarea>
        </div>
        <div class="alert alert-secondary w-100 mt-2" role="alert" v-if="updateIssue">
          Veuillez préciser un titre et un contenu avant de publier votre article.
        </div>
        
        <button type="submit" class="btn btn-primary my-3 align-self-center fs-4 fw-bold">Modifier</button>
      </b-form>
      </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import axios from 'axios';

export default {
  name: 'Post',
  components: {
    Header
  },
  data() {
      return {
          post: {},
          updateIssue:false
      }
  },
  methods: {
      getPostInfo() {
        axios.get('http://localhost:3000/api/post/'+this.$route.params.post_id, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
            .then(response => {
                console.log(response.data);
                this.post = response.data.post;
            })
            .catch(error => {
                console.error("Impossible de récupérer l'article': ",error);
            });
      },
      updatePost() {
        axios.put('http://localhost:3000/api/post/'+this.post.id, this.post, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
            .then(response => {
                console.log(response.data);
                this.$router.push({ name: 'Home'});
            })
            .catch(error => {
                console.error("Impossible de récupérer l'article': ",error);
            });
      }
  },
  beforeMount() {
    this.getPostInfo();
  },
  mounted() {
    console.log(this.$store.getters.isAuthenticated);
    if(!this.$store.getters.isAuthenticated) {
      console.log(" Non Authentifié");
        this.$router.replace({ name: "Landing" });
    }
  }
}
</script>

<style scoped lang="scss">
@import '../app.scss';

.form-container {
  width:75%;
}


@media (max-width: 767px) {
  .form-container {
  width: 90%
  }
}

</style>