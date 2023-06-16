<template>
  <div class="create-order">
    <h2>Créer une nouvelle commande</h2>
    <form @submit.prevent="createOrder" class="order-form">
      <!-- Form inputs -->
      <div>
        <label for="customer-name">Nom du client :</label>
        <input type="text" id="customer-name" v-model="customerName" required>
      </div>
      <div>
        <label for="total-price">Prix total :</label>
        <input type="number" id="total-price" v-model="totalPrice" required>
      </div>
      <div>
        <label for="items">Articles :</label>
        <textarea id="items" v-model="items" required></textarea>
      </div>
      <button type="submit">Créer la commande</button>
    </form>

    <!-- Order details section -->
    <div v-if="loading" class="loading">Création en cours...</div>
    <div v-else>
      <div v-if="error" class="error">Erreur : {{ error }}</div>
      <div v-else-if="order" class="order-details">
        <p>Commande créée avec succès !</p>
        <p class="order-id">Identifiant de la commande : {{ order.orderId }}</p>
        <p>Nom du client : {{ order.customerName }}</p>
        <p>Prix total : {{ order.totalPrice }}</p>
        <p>Articles :</p>
        <ul>
          <li v-for="item in order.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.create-order {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.order-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.order-form label {
  font-weight: bold;
}

.order-form input,
.order-form textarea {
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

.order-id {
  font-weight: bold;
  margin-bottom: 10px;
}

.order-details ul {
  list-style-type: none;
  padding-left: 0;
}

.order-details li {
  margin-bottom: 5px;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      error: null,
      order: null,
      customerName: '',
      totalPrice: '',
      items: '',
    };
  },
  methods: {
    createOrder() {
      this.loading = true;
      this.error = null;
      this.order = null;

      // Validate input data
      if (!this.customerName || !this.totalPrice || !this.items) {
        this.error = 'Veuillez remplir tous les champs.';
        this.loading = false;
        return;
      }

      // Split items string into an array
      const itemsArray = this.items.split('\n').filter(item => item.trim() !== '');

      // Create the new order object
      const newOrder = {
        customerName: this.customerName,
        totalPrice: parseFloat(this.totalPrice),
        items: itemsArray,
      };

      // Send the create order request
      axios.post('http://localhost:3000/orders', newOrder)
        .then((response) => {
          this.order = response.data;
          this.order.orderId = this.order._id; // Assign orderId to _id
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
