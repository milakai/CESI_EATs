<template>
  <div id="app">
    <NavBar />
    <router-view/>
  </div>
</template>

<script>
  import NavBar from './NavBar.vue';
  import { mapState } from 'vuex';

  export default {
    components: {
      NavBar
    },
    computed: {
      ...mapState(['isLogged']) // Mappage de l'état 'isLogged' du store dans une propriété calculée
    },
    // Reste du code pour la page d'accueil
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
