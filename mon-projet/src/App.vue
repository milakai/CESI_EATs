<template>
  <div id="app" class="container">
    <router-link to="/create-order" class="nav-link">Commander</router-link>
    <router-link to="/order-details" class="nav-link">Voir les détails</router-link>
    <router-link to="/update-order/:orderId" class="nav-link">Modifier une commande</router-link>

    <router-view></router-view>
  </div>
</template>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.nav-link {
  margin-right: 10px;
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

.nav-link:hover {
  color: #888;
}

.router-link-exact-active {
  color: #888;
}
</style>
