<template>
    <div id="landing">
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png" class="my-5">
      <div class="nav mt-5 d-md-flex justify-content-center justify-content-md-around">
        <router-link to="/register" class="nav-link text-reset text-decoration-none fs-1 fw-bold p-3 px-5 rounded-3 shadow my-4">S'inscrire</router-link>
        <router-link to="/login" class="nav-link text-reset text-decoration-none fs-1 fw-bold p-3 rounded-3 shadow my-4">Se connecter</router-link>
      </div>
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Landing'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../app.scss';

#landing img {
  width: 60%;
  @media (max-width: 767px) {
  width: 90%
  }
}

#landing .nav-link {
  background-color: $primary;
  &:hover {
    background-color: $secondary;
  }
}

</style>
