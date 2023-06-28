<template>
  <div class="order-history">
    <h1 class="page-title">Historique des commandes</h1>
    <div v-if="!isLogged">
      <p>Veuillez vous connecter pour accéder à l'historique des commandes.</p>
      <button @click="redirectToLogin">Se connecter</button>
    </div>
    <div v-else>
      <div class="filter-controls">
        <label for="filter">Filtrer par statut:</label>
        <select id="filter" v-model="selectedFilter">
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="En cours de livraison">En cours de livraison</option>
          <option value="Annulée">Annulée</option>
        </select>
      </div>
      <div v-if="filteredOrders.length === 0" class="no-orders">
        <p>Aucune commande trouvée.</p>
      </div>
      <div v-else class="order-list">
      <div v-for="order in filteredOrders" :key="order._id" class="order-item">
        <div class="order-item-header">
          <h2 class="order-item-title">Commande n°{{ order._id }}</h2>
          <p class="order-item-date">Passée le {{ formatDate(order.createdAt) }}</p>
        </div>
        <div class="order-item-details">
            <p><strong>Client:</strong> {{ order.customerName }}</p>
            <p><strong>Total:</strong> {{ order.totalPrice }} €</p>
            <p><strong>Statut:</strong> {{ order.status }}</p>
            <p><strong>Restaurant:</strong> {{ order.restaurant }}</p>
            <p><strong>Articles commandés:</strong></p>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.quantity }}x {{ item.name }}
              </li>
            </ul>
            <button v-if="order.status === 'En attente'" @click="cancelOrder(order._id)">Annuler la commande</button>
            <button v-if="order.status === 'En attente'" @click="editOrder(order._id)">Modifier la commande</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isLogged']),
    filteredOrders() {
      if (!this.selectedFilter) {
        // No filter selected, return all orders
        return this.orders;
      } else {
        // Filter the orders based on the selected status
        return this.orders.filter(order => order.status === this.selectedFilter);
      }
    },
  },
  data() {
    return {
      orders: [],
      isLoggedIn: false,
      selectedFilter: '', // Initially no filter selected
    };
  },
  mounted() {
    this.getOrderHistory();
  },
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    },
    async getOrderHistory() {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('http://localhost:3005/order-history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update the response data to include the restaurant name
    this.orders = response.data.map(order => ({
      ...order,
      restaurant: order.restaurant, // Access the restaurant name from the API response
    }));
  } catch (error) {
    console.error('Error:', error);
  }
},

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async cancelOrder(orderId) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.put(
          `http://localhost:3005/orders/${orderId}`,
          { status: 'Annulée' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(response.data.message); // Display success message or handle as needed
        this.getOrderHistory(); // Refresh the order history after cancellation
      } catch (error) {
        console.error('Error:', error);
      }
    },
    editOrder(orderId) {
      // Implement the logic to navigate to the order edit page or perform the necessary action
      this.$router.push(`/edit-order/${orderId}`);
    },
  },
};
</script>

<style scoped>
.container-quantity-control {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  line-height: 200%;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
}

.restaurant-option {
  display: flex;
  align-items: center;
}

.restaurant-option input[type='radio'] {
  margin-right: 1em;
}

.create-order {
  font-family: Arial, sans-serif;
  color: #333;
}

.order-form {
  margin-top: 20px;
}

.create-order h2 {
  font-size: 1.5em;
}

.create-order .back-button {
  background-color: #f8f9fa;
  /* Couleur de fond claire */
  color: #333;
  /* Couleur de texte sombre */
  border: 1px solid #ced4da;
  /* Bordure discrète */
  padding: 10px 20px;
  /* Espace intérieur pour le rendre plus grand */
  font-size: 1em;
  /* Taille de police standard */
  border-radius: 5px;
  /* Coins arrondis */
  cursor: pointer;
  /* Change le curseur lorsqu'il survole le bouton */
  text-decoration: none;
  /* Supprime le soulignement */
  transition: background-color 0.3s ease;
  /* Animation douce lors du survol */
}

.create-order .back-button:hover {
  background-color: #e9ecef;
  /* Couleur de fond légèrement plus foncée lors du survol */
}

.create-order label {
  display: block;
  margin-bottom: 5px;
}

.create-order .quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-order .quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background-color: #f2f2f2;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  /* Ajouté pour rendre le texte plus visible */
  font-size: 1.2em;
  /* Ajouté pour rendre le texte plus grand */
}

.create-order .quantity-control button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background-color: #f2f2f2;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  /* Ajouté pour rendre le texte plus visible */
  font-size: 1.2em;
  /* Ajouté pour rendre le texte plus grand */
}

.create-order .quantity-control input {
  width: 50px;
  height: 30px;
  border: 1px solid #ccc;
  margin: 0 5px;
  text-align: center;
}



.create-order p {
  font-size: 1.5em;
  /* Augmente la taille de la police */
  color: #333;
  /* Change la couleur du texte */
  font-weight: bold;
  /* Rend le texte en gras */
  text-align: center;
  /* Centre le texte */
  margin-top: 20px;
  /* Ajoute de l'espace au-dessus du texte */
}

.create-order .order-details {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}

.create-order .order-details h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.create-order .order-details ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.create-order .order-details ul li {
  margin-bottom: 5px;
}
</style>
