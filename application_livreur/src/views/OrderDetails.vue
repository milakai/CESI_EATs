<template>
  <div class="order-details-page">
    <h2>Voir les détails d'une commande</h2>
    <form @submit.prevent="getOrderDetails" class="order-form">
      <div>
        <label for="order-id">Numéro de commande :</label>
        <input type="text" id="order-id" v-model="orderId" required>
      </div>
      <button type="submit">Voir les détails</button>
    </form>
    <div v-if="loading" class="loading">Chargement en cours...</div>
    <div v-else>
      <div v-if="error" class="error">Erreur : {{ error }}</div>
      <div v-else-if="order" class="order-details">
        <p>Commande :</p>
        <p>Numéro de commande : {{ order.orderId }}</p>
        <p>Nom du client : {{ order.customerName }}</p>
        <p>Prix total : {{ order.totalPrice }}</p>
        <p>Articles :</p>
        <ul>
          <li v-for="item in order.items" :key="item">{{ item }}</li>
        </ul>
        <p>Status : {{ order.status }}</p>
        <router-link :to="`/update-order/${order.orderId}`" :state="order" class="update-link">Modifier la commande</router-link>
      </div>
    </div>
  </div>
</template>

<style>
.order-details-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.order-form {
  margin-bottom: 20px;
}

.order-form label {
  font-weight: bold;
}

.order-form input {
  padding: 5px;
  border: 1px solid #ccc;
}

.order-form button {
  padding: 8px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.loading {
  font-style: italic;
}

.error {
  color: red;
}

.order-details {
  background-color: #f5f5f5;
  padding: 10px;
  border: 1px solid #ccc;
}

.order-details p {
  margin-bottom: 5px;
}

.order-details ul {
  list-style-type: none;
  padding-left: 0;
}

.update-link {
  display: inline-block;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 3px;
  margin-top: 10px;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orderId: '',
      loading: false,
      error: null,
      order: null,
    };
  },

  methods: {
    getOrderDetails() {
      this.loading = true;
      this.error = null;
      this.order = null;

      axios.get(`http://localhost:3005/orders/${this.orderId}`)
        .then((response) => {
          this.order = response.data;
          this.$store.commit('setOrderToModify', this.order); // Stocke les données de la commande dans le store
        })
        .catch((error) => {
          this.error = error.message;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
