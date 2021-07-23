<template>
    <div id="Post">
      <Header />
      <div>
        <h1 class="fs-1 fw-bold text-secondary py-3"> {{ post.title }}</h1>
        <div class="post shadow-lg p-4 rounded-3 my-5 mx-auto">
          <p> {{ post.content }}</p>
          <div class="d-flex justify-content-end fs-3 text-primary" v-if="isMyPost(post.user_id)">
              <div @click="getPostUpdateForm()" class="edit-icon"><i class="fas fa-edit me-2"></i></div>
              <div @click="deletePost(post.id)" class="trash-icon"><i class="fas fa-trash-alt ms-2"></i></div>
          </div>
        </div>
      </div>

      <div class="form-container bg-dark shadow p-2 rounded-3 my-5 mx-auto" v-if="updatingForm">
        <div class="d-flex justify-content-between">
          <h2 >Modification de l'article</h2>
          <div @click="closePostUpdateForm()"><i class="fas fa-times-circle fs-4"></i></div>
        </div>
        <form id="updatepostform" @submit.prevent="updatePost" class="d-flex flex-column justify-content-center justify-items-center">
        <div class="form-group mt-4 d-flex align-items-center">
          <label for="title">Titre: </label>
          <input class="form-control ms-3" v-model="post.title" type="text" name="title" id="title">
        </div>

        <div class="form-group mt-4 d-flex align-items-start">
          <label for="post-content">Contenu: </label>
          <textarea class="form-control ms-3" v-model="post.content" name="post-content" form="updatepostform" rows="10">Entrez votre texte ici...</textarea>
        </div>
        <div class="alert alert-secondary w-100 mt-2" role="alert" v-if="updateIssue">
          Veuillez préciser un titre et un contenu avant de publier votre article.
        </div>
        <button type="submit" class="btn btn-primary my-3 align-self-center fs-4 fw-bold">Modifier</button>
      </form>
      </div>
      <div id="comment-section" class="d-flex flex-column align-items-start my-4">
        <h2>Commentaires</h2>
        <div class="comment-form d-flex w-100 my-4">
          <div class="form-group d-flex justify-content-start align-items-center w-75">
            <label for="newComment" class="">Ajouter un commentaire: </label>
            <input class="form-control" v-model="newComment" type="text" name="newComment" id="newComment" required>
          </div>
          <div class="plus-icon ms-1" @click="addComment()"><i class="fas fa-plus-square"></i></div>
        </div>
        <div class="d-flex flex-column  justify-content-center align-items-start">
          <div class="comment-box px-4 py-2 rounded-3 my-3 text-center" v-for="comment in comments" v-bind:key="comment.id">
            <p class="text-center">{{ comment.content }}</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import axios from 'axios'

export default {
  name: 'Post',
  components: {
    Header
  },
  data() {
      return {
          post: {},
          comments: [],
          updateIssue:false,
          updatingForm:false,
          newComment:null
      }
  },
  methods: {
    isMyPost(postUserId) {
      console.log("Is my post: "+(postUserId == this.$store.state.user.id))
      console.log("User connected: "+this.$store.state.user.id);
      console.log("User in the Post: "+postUserId);
      return postUserId == this.$store.state.user.id;
    },
    getPostUpdateForm() {
      this.updatingForm = true;
    },
    closePostUpdateForm() {
      this.updatingForm = false;
    },
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
                console.error("Impossible de mettre à jour l'article': ",error);
            });
    },
    addComment() {
      const newCommentObject = { "content":this.newComment,"post_id":this.post.id};
      console.log(newCommentObject);
      axios.post('http://localhost:3000/api/comment/',newCommentObject, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
      .then(response => {
          console.log(response.data);
          this.getCommentsOfThisPost();
        })
        .catch(error => {
          console.error("Impossible de créer ce commentaire: ",error);
        });
    },
    deleteAComment(commentId) {
      axios.delete('http://localhost:3000/api/comment/'+commentId, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
      .then(response => {
          console.log(response.data);
          this.getCommentsOfThisPost();
        })
        .catch(error => {
          console.error("Impossible de supprimer ce commentaire: ",error);
        });
    },
    deletePost(postId) {
      //Delete the comments of this post
      this.comments.forEach(comment => {
        this.deleteAComment(comment.id);
      });
      axios.delete('http://localhost:3000/api/post/'+postId, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: 'Home' });
        })
        .catch(error => {
          console.error("Impossible de supprimer cet article: ",error);
        });
    },
    getCommentsOfThisPost() {
        axios.get('http://localhost:3000/api/comment/post/'+this.$route.params.post_id, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
        .then(response => {
          this.comments = response.data.comments;
          console.log("Les commentaires sont chargés");
        })
        .catch(error => {
          console.error("Impossible de récupérer les commentaires de cet article': ",error);
        });
      }
  },
  beforeMount() {
    this.getPostInfo();
    this.getCommentsOfThisPost();
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

.post, .form-container {
  width:75%;
}

#comment-section {
  width: 90%;
  margin: auto;
}

.comment-form {
  width: 75%;
}

.plus-icon {
  color:$primary;
  font-size: 40px;
}

.edit-icon:hover,.trash-icon:hover, .plus-icon:hover {
  color:$secondary;
}

.comment-box {
  box-shadow: 4px 4px $primary;
}

.fa-times-circle:hover {
  color:$primary;
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