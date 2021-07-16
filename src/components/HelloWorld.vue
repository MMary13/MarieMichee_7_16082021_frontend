<template>
    <div id="home">
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png">
      <div class="nav">
        <router-link to="/register">S'inscrire</router-link>
        <router-link to="/login">Se connecter</router-link>
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
