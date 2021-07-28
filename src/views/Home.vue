<template>
    <div id="Home">
      <Header />
      <div class="bg-dark">
      <h1 class="fs-1 fw-bold text-secondary py-3">Mon fil d'actualité</h1>
      <div class="form-container p-2 rounded-3 my-4 mx-auto">
        <h2>Quelque chose à dire ou partager?</h2>
        <b-form id="postform" @submit.prevent="addPost()" class="d-flex flex-column justify-content-center justify-items-center">
        <div class="form-group mt-4 d-flex align-items-center">
            <label for="title">Titre: </label>
            <input class="form-control ms-3" v-model="newPost.title" type="text" name="title" id="title">
        </div>

        <div class="form-group mt-4 d-flex align-items-center">
          <label for="post-content">Contenu: </label>
          <textarea class="form-control ms-3" v-model="newPost.content" name="post-content" id="post-content" form="postform" rows="5">Entrez votre texte ici...</textarea>
        </div>
        <div class="alert alert-secondary w-100 mt-2" role="alert" v-if="publishIssue">
          Veuillez préciser un titre et un contenu avant de publier votre article.
        </div>
        
        <button type="submit" class="btn btn-primary shadow my-3 align-self-center fs-4 fw-bold">Publier</button>
      </b-form>

      </div>
      <section class="d-flex flex-column justify-content-center align-items-center">
        <div class="post shadow-lg p-4 rounded-3 my-3 bg-primary" v-for="post in posts" v-bind:key="post.id">
          <h2 class="fs-2 fw-bold">{{ post.title }}</h2>
          <p class="text-start my-3">{{ post.content }}</p>
          <div class="post-footer d-flex justify-content-between">
            <div class="d-flex fs-6">
              <p> Publié le {{ post.createdAt }}</p>
              <!-- <div><i class="fas fa-thumbs-up me-2"></i></div>
              <div><i class="fas fa-thumbs-down ms-2"></i></div> -->
            </div>
            <router-link :to="{ name: 'Post', params: { post_id: post.id }}" class="link-more fw-bold">En savoir plus</router-link>
          </div>
        </div>
      </section>
      </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import { HTTP } from '../http/http-common'

export default {
  name: 'Home',
  components: {
    Header
  },
  data() {
    return {
      posts: [],
      newPost: {},
      publishIssue: false
    }
  },
  methods: {
    addPost() {
      HTTP.post('/post', this.newPost, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
        .then(response => {
          console.log(response.data);
          //Update posts
          this.getAllPosts();
          //Clear form
          this.newPost = {};
        })
        .catch(error => {
          console.error("Impossible de publier cet article: ",error);
          this.publishIssue = true;
        });
    },
    getAllPosts() {
      HTTP.get('/post', { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
      .then(response => {
        console.log(response.data);
        this.posts = response.data.posts;
        this.posts.forEach(post => {
          const fullDate = new Date(post.createdAt);
          const day = fullDate.getUTCDate();
          const month = fullDate.getUTCMonth();
          const year = fullDate.getUTCFullYear();
          const formattedDate = day+'/'+month+'/'+year;
          post.createdAt = formattedDate;
        });
      })
      .catch(error => {
        console.error("Impossible de récupérer les publications: ",error);
      });
    }
  },
  beforeMount() {
    this.getAllPosts();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../app.scss';

.post, .form-container {
  width:75%;
}

.post {
  background-color: white;
}

.form-container {
  border-style: solid;
  border-color: $primary;
  border-width: 4px;
  box-shadow: 3px 3px 10px grey;
}

.post-footer div i:hover,.fa-thumbs-up:active,.fa-thumbs-down:active {
  color:$secondary;
}

.link-more {
  color: #2c3e50;
  &:hover {
    color: $secondary;
  }
}

@media (max-width: 767px) {
  .post, .form-container {
  width: 90%
  }

  .form-container h2 {
    font-size:20px;
  }
}

</style>