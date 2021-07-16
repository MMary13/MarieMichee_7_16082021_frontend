<template>
  <div class="profil">
    <Header/>
    <h1>Mon Profil</h1>
    <p>Connexion réussie</p>
    <div>
      <p>Prénom : {{ $store.state.user.firstName }}</p>
      <p>Nom : {{ $store.state.user.lastName }}</p>
      <p>Mail : {{ $store.state.user.mail }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '../components/Header.vue'

export default {
  name: 'Profil',
  components: {
    Header
  },
  beforeMount() {
    axios.get('http://localhost:3000/api/auth/profil', { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
            .then(response => {
              console.log(response.data.user);
              this.$store.state.user = response.data.user;
            })
            .catch(error => {
              console.error("Votre mot de passe ou votre identifiant est incorrect",error);
            });
  },
  mounted() {
    if(!this.$store.getters.isAuthenticated) {
      console.log("Pas authentifié: "+this.$store.state.authenticated);
        this.$router.replace({ name: "Home" });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
