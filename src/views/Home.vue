<template>
    <div id="Home">
      <Header />
    <h1 class="fs-1 fw-bold bg-primary p-5 m-5 rounded-3 top-50 start-50">Mon fil d'actualité</h1>
  </div>
</template>

<script>
import Header from '../components/Header.vue'

export default {
  name: 'Home',
  components: {
    Header
  },
  mounted() {
    console.log(this.$store.state.token);
    console.log(this.$store.getters.isAuthenticated);
    if(!this.$store.getters.isAuthenticated) {
      console.log(" Non Authentifié");
        this.$router.replace({ name: "Landing" });
    }
  }
}
</script>

