<template>
  <div class="order-dashboard">
    <h1 class="page-title">Tableau de bord des commandes</h1>
    <div class="filter-controls">
      <label for="filter-status">Filtrer par statut:</label>
      <select id="filter-status" v-model="selectedStatusFilter">
        <option value="">Tous les statuts</option>
        <option value="En attente">En attente</option>
        <option value="En cours de livraison">En cours de livraison</option>
        <option value="Annulée">Annulée</option>
      </select>
    </div>
    <div class="filter-controls">
      <label for="filter-restaurant">Filtrer par restaurant:</label>
      <select id="filter-restaurant" v-model="selectedRestaurantFilter">
        <option value="">Tous les restaurants</option>
        <option v-for="restaurant in uniqueRestaurants" :key="restaurant" :value="restaurant">{{ restaurant }}</option>
      </select>
    </div>
    <div class="filter-controls">
      <label for="search">Rechercher:</label>
      <input id="search" type="text" v-model="searchQuery" placeholder="Entrez un ID ou un nom de client">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';

export default {
  data() {
    return {
      orders: [],
      selectedStatusFilter: '',
      selectedRestaurantFilter: '',
      searchQuery: '',
    };
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders;

      if (this.selectedStatusFilter) {
        filtered = filtered.filter(order => order.status === this.selectedStatusFilter);
      }

      if (this.selectedRestaurantFilter) {
        filtered = filtered.filter(order => order.restaurant === this.selectedRestaurantFilter);
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order =>
          order._id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query)
        );
      }

      return filtered;
    },
    uniqueRestaurants() {
      const restaurants = new Set();
      this.orders.forEach(order => {
        restaurants.add(order.restaurant);
      });
      return Array.from(restaurants);
    },
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3005/all-orders');
      this.orders = response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  },
  methods: {
    formatDate(dateString) {
      const date = moment(dateString);
      date.locale('fr'); // Set the locale to French
      return date.format('LL');
    },
  },
};
</script>

<style scoped>
.order-dashboard {
  padding: 20px;
}

.order-item {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}

.order-item-header {
  display: flex;
  justify-content: space-between;
}

.order-item-details {
  margin-top: 10px;
}

.order-item-details ul {
  list-style-type: none;
  padding: 0;
}

.order-item-details ul li {
  margin-bottom: 5px;
}
</style>
