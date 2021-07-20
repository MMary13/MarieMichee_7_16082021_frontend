<template>
    <header class="shadow-sm mt-0 pb-2">
        <nav class="mx-2">
            <div>
                <router-link to="/"><img alt="Groupomania logo" src="../../public/icon.png"></router-link>
            </div>
            <div class="header-links d-flex align-items-center fs-1 text-primary">
                <!-- <router-link to="/"><i class="fas fa-comments"></i></router-link> -->
                <router-link to="/profil"><i class="fas fa-user-circle mx-3"></i></router-link>
                <router-link to="/" @click.native="logout"><i class="fas fa-sign-out-alt mx-3"></i></router-link>
            </div>
        </nav>
    </header>
</template>

<script>

export default {
  name: 'Header',
  methods: {
      logout() {
          localStorage.removeItem('user-token');
          this.$store.state.status = '';
          this.$store.state.user = {};
          this.$store.state.token = '';
          console.log("Déconnexion réussie");
          this.$router.push({ name: "Landing"});
      }
  }
}
</script>

<style scoped lang="scss">
    nav {

        display: flex;
        justify-content: space-between;
        img {
            height: 70px;
        }
    }

    .header-links i:hover {
        color: #FD2D01;   
    }
</style>