<template>
  <div id="app">
      <button @click="sayHello">Click me!</button>
      <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
      return {
          message: ''
      }
  },
  methods: {
      sayHello() {
          this.message = 'Hello!';
      }
  }
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>