<template>
    <div id="helloWorld">
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png" class="mb-5">
      <div class="nav mt-5 d-flex justify-content-center">
        <router-link to="/register" class="nav-link text-reset text-decoration-none fs-1 fw-bold p-3 px-5 rounded-3 me-5 shadow">S'inscrire</router-link>
        <router-link to="/login" class="nav-link text-reset text-decoration-none fs-1 fw-bold p-3 rounded-3 ms-5 shadow">Se connecter</router-link>
      </div>
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../app.scss';

#helloWorld .nav-link {
  background-color: $primary;
  &:hover {
    background-color: $secondary;
  }
}
//  #helloWorld {
//     margin-top: 60px;
//   }
  
//   .nav {
//     width: 50%;
//     margin:auto;
//     margin-top:150px;
//     display: flex;
//     justify-content: space-between;
//     a {
//       background-color: #FFD7D7;
//       text-decoration: none;
//       font-size: 36px;
//       color: #2c3e50;
//       font-weight: bold;
//       padding: 15px;
//       border-radius: 15px;
//       width: 250px;
//       box-shadow: 3px 3px #F2F2F2;
//       &:hover {
//         background-color: #FD2D01;
//         color:#FFD7D7;
//       }
//     }
//   }
</style>
