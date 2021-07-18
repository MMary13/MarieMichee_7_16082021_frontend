<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

section {
  display: flex;
  margin-top: 50px;
  justify-content: space-around;
}

h2 {
  font-size: 30px;
}

label {
  font-size: 20px;
  font-weight: 500;
}

button {
  color:#FD2D01;
  font-size:22px;
  font-weight: 600;
  padding:15px;
  width: fit-content;
  background-color: #FFD7D7;
  margin: auto;
  border-radius: 15px;
  box-shadow: 5px 5px grey;
  border: none;
  &:hover {
    color:#2c3e50;
    box-shadow: 7px 7px lighten(grey,5);
  }
}
</style>
