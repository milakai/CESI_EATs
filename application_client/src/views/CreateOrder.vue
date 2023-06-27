<template>
  <div class="create-order">
    <h2>Créer une nouvelle commande</h2>
    <button @click="goBack">Revenir en arrière</button>
    <p>Restaurant Name: {{ selectedRestaurantName }}</p>
    <form @submit.prevent="createOrder" class="order-form">
      <!-- Form inputs -->
      <div>
        <label for="customer-name">Nom du client :</label>
        <input type="text" id="customer-name" v-model="customerName" required>
      </div>
      
      <div v-for="menu in filteredMenus" :key="menu._id">
        <label>{{ menu.nomMenu }} ({{ menu.prix_M }}€)</label>
        <div class="quantity-controls">
          <button type="button" @click="decrementQuantity(menu)">-</button>
          <input type="number" v-model.number="menu.quantity" min="0" @input="calculateTotalPrice">
          <button type="button" @click="incrementQuantity(menu)">+</button>
        </div>
      </div>
      <div>
        <label for="total-price">Prix total :</label>
        <input type="number" id="total-price" v-model="totalPrice" readonly>
      </div>
      <button type="submit" :disabled="totalPrice === 0" class="category-card-action">Créer la commande</button>
    </form>
    <div v-if="orderCreated" class="order-details">
      <h3>Détails de la commande</h3>
      <p>Identifiant de la commande : {{ orderId }}</p>
      <p>Nom du client : {{ customerName }}</p>
      <p>Commande :</p>
      <ul>
        <li v-for="menu in orderedMenus" :key="menu._id">
          {{ menu.nomMenu }} ({{ menu.prix_M }}€) - Quantité : {{ menu.quantity }}
        </li>
      </ul>
      <p>Prix total : {{ totalPrice }}€</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      customerName: '',
      selectedRestaurantName: '',
      selectedRestaurantId: null,
      restaurants: [],
      menus: [],
      totalPrice: 0,
      orderCreated: false,
      orderId: '',
    };
  },
  mounted() {
  this.selectedRestaurantName = this.$route.params.restaurant;
  this.selectedRestaurantId = this.$route.params.restaurant;
  this.getRestaurantsAndMenus();
},


  methods: {
    ...mapMutations(['setSelectedRestaurantId']),
    selectRestaurant(restaurant) {
  this.selectedRestaurantName = restaurant.restaurant;
  this.getMenus();
},

    getRestaurantsAndMenus() {
      axios
        .get('http://localhost:3003/AfficherAM')
        .then(response => {
          this.menus = response.data.map(menu => ({
            ...menu,
            quantity: 0,
          }));

          const uniqueRestaurants = Array.from(new Set(response.data.map(menu => menu.restaurant)));
          this.restaurants = uniqueRestaurants.map(restaurant => ({
            _id: restaurant,
            restaurant,
          }));

          this.getMenus();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    getMenus() {
      axios
        .get('http://localhost:3003/AfficherAM', {
          params: {
            restaurantId: this.selectedRestaurantId,
          },
        })
        .then(response => {
          this.menus = response.data.map(menu => ({
            ...menu,
            quantity: 0,
          }));
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    decrementQuantity(menu) {
      if (menu.quantity > 0) {
        menu.quantity--;
        this.calculateTotalPrice();
      }
    },
    incrementQuantity(menu) {
      menu.quantity++;
      this.calculateTotalPrice();
    },
    calculateTotalPrice() {
      this.totalPrice = this.menus.reduce((total, menu) => {
        return total + menu.quantity * menu.prix_M;
      }, 0);
    },
    createOrder() {
  const orderDetails = {
    customerName: this.customerName,
    totalPrice: this.totalPrice,
    items: this.orderedMenus.map(menu => ({
      id: menu._id,
      name: menu.nomMenu,
      price: menu.prix_M,
      quantity: menu.quantity,
    })),
    status: 'En attente',
  };

  axios
    .post('http://localhost:3005/orders', orderDetails)
    .then(response => {
      this.orderCreated = true;
      this.orderId = response.data._id; // Replace with the actual orderId received from the server
    })
    .catch(error => {
      console.error('Error:', error);
    });
},


    goBack() {
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapState(['selectedRestaurantId']),
    filteredRestaurants() {
  return this.restaurants.filter(restaurant => restaurant.restaurant !== this.selectedRestaurantName);
},
filteredMenus() {
  return this.menus.filter(menu => menu.restaurant === this.selectedRestaurantName);
},

    orderedMenus() {
      return this.menus.filter(menu => menu.quantity > 0);
    },
  },
};
</script>

<style scoped>
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

.create-order button {
  margin-bottom: 10px;
}

.create-order label {
  display: block;
  margin-bottom: 5px;
}

.create-order .quantity-controls {
  display: flex;
  align-items: center;
}

.create-order .quantity-controls button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background-color: #f2f2f2;
  cursor: pointer;
  font-weight: bold;
}

.create-order .quantity-controls input {
  width: 50px;
  height: 30px;
  border: 1px solid #ccc;
  margin: 0 5px;
  text-align: center;
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
