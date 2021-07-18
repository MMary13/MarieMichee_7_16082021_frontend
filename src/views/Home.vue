<template>
  <div id="home">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from '../components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted() {
    if(this.$store.getters.isAuthenticated) {
      console.log("Authentifié: "+this.$store.state.authenticated);
        this.$router.replace({ name: "Profil" });
    }
  }
}
</script>

<style scoped lang="scss">
  #home {
    margin-top: 60px;
  }
  
  .nav {
    width: 50%;
    margin:auto;
    margin-top:150px;
    display: flex;
    justify-content: space-between;
    a {
      background-color: #FFD7D7;
      text-decoration: none;
      font-size: 36px;
      color: #2c3e50;
      font-weight: bold;
      padding: 15px;
      border-radius: 15px;
      width: 250px;
      box-shadow: 3px 3px #F2F2F2;
      &:hover {
        background-color: #FD2D01;
        color:#FFD7D7;
      }
    }
  }
</style>
