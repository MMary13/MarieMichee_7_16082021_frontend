<template>
    <div id="Home">
      <Header />
      <div>
      <h1 class="fs-1 fw-bold bg-primary py-2">Mon fil d'actualité</h1>
      <section class="d-flex flex-column justify-content-center align-items-center">
        <div class="post shadow-lg p-4 rounded-3 my-3" v-for="post in posts" v-bind:key="post.id">
          <h2 class="fs-2 fw-bold text-primary">{{ post.title }}</h2>
          <p class="text-start my-3">{{ post.content }}</p>
          <div class="post-footer d-flex justify-content-between">
            <div class="d-flex fs-6">
              <p> Publié le {{ post.createdAt }}</p>
              <!-- <div><i class="fas fa-thumbs-up me-2"></i></div>
              <div><i class="fas fa-thumbs-down ms-2"></i></div> -->
            </div>
            <div class="d-flex fs-4 text-primary" v-if="isMyPost(post.user_id)">
              <div><i class="fas fa-edit me-2"></i></div>
              <div><i class="fas fa-trash-alt ms-2"></i></div>
            </div>
          </div>
        </div>
      </section>
      </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    Header
  },
  data() {
    return {
      posts: []
    }
  },
  methods: {
    isMyPost(postUserId) {
      if(postUserId == this.$store.state.user.id) {
        return true;
      } else {
        return false;
      }
    }
  },
  beforeMount() {
    axios.get('http://localhost:3000/api/post', { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
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

.post {
  width:75%;
  @media (max-width: 767px) {
  width: 90%
  }
}

.post-footer div i:hover,.fa-thumbs-up:active,.fa-thumbs-down:active {
  color:$secondary;
}

</style>