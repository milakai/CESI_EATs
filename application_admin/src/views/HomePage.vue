<template>
  <div class="home">
    <header class="hero">
      <h1 class="hero-title">Bienvenue sur votre plateforme Administrateur Cesi Eat</h1>
      <p class="hero-subtitle">Cesi Eat Administrateur</p>
    </header>
    <section class="categories">
      <div class="category-card">
        <div class="category-card-content">
          <h3 class="category-card-title">Gérer les comptes clients</h3>
          <button class="category-card-action" @click="manageCustomerAccounts">Explorer</button>
        </div>
      </div>
      <div class="category-card">
        <div class="category-card-content">
          <h3 class="category-card-title">Tableaux de bord de suivi des processus de commande</h3>
          <button class="category-card-action" @click="viewOrderDashboards">Explorer</button>
        </div>
      </div>
    </section>

    <div v-if="shouldShowPopup" class="popup">
      <button class="connect-button" @click="redirectToLogin">Connectez Vous</button>
    </div>
  </div>
</template>

<script>
import router from '../router/index.ts';
import { mapGetters } from 'vuex'; // Import mapGetters from Vuex

export default {
  computed: {
    ...mapGetters(['isLogged']), // Map the 'isLogged' getter from Vuex
    shouldShowPopup() {
      return !this.isLogged;
    }
  },
  methods: {
    manageCustomerAccounts() {
      if (!this.isLogged) {
        this.showPopup();
      } else {
        router.push('/customer-accounts');
      }
    },
    viewOrderDashboards() {
      if (!this.isLogged) {
        this.showPopup();
      } else {
        router.push('/order-dashboards');
      }
    },
    showPopup() {
      // Code to show the popup
    },
    redirectToLogin() {
      router.push('/login');
    }
  }
}
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  color: #333;
}

.hero {
  background-color: #f2f2f2;
  padding: 50px 0;
  text-align: center;
}

.hero-title {
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

.hero-subtitle {
  font-size: 1.5em;
  color: #666;
}

.categories {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 50px 0;
}

.category-card {
  width: 200px;
  height: 200px;
  margin: 20px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
}

.category-card-content {
  text-align: center;
}

.category-card-title {
  margin-bottom: 1em;
}

.category-card-action {
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card-action:hover {
  background-color: #666;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.connect-button {
  font-size: 1.5em;
  color: #fff;
  background-color: #333;
  padding: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.connect-button:hover {
  background-color: #666;
}
</style>
