<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div class="create-order">
    <h2>Créer une nouvelle commande</h2>
    <button class="back-button" @click="goBack">Revenir en arrière</button>
    <p>Restaurant Name: {{ selectedRestaurantName }}</p>
  </div>

  <form @submit.prevent="createOrder" class="order-form">
    <div v-for="menu in filteredMenus" :key="menu._id">
      <div class="container-quantity-control">
        <label>{{ menu.nomMenu }} ({{ menu.prix_M }}€)</label>
        <div class="quantity-controls">
          <button type="button" class="quantity-controls" @click="decrementQuantity(menu)">-</button>
          <input type="number" v-model.number="menu.quantity" min="0" @input="calculateTotalPrice">
          <button type="button" class="quantity-controls" @click="incrementQuantity(menu)">+</button>
        </div>
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
    <button @click="openPaymentModal">Commander et Payer</button>
  </div>

  <!-- Payment Modal -->
  <div v-if="showPaymentModal" class="modal">
    <div class="modal-content">
      <h2>Informations de paiement</h2>
      <form @submit.prevent="processPayment">
        <label for="card-number">Numéro de carte:</label>
        <input type="text" id="card-number" v-model="cardNumber" required>

        <label for="expiry-date">Date d'expiration:</label>
        <input type="text" id="expiry-date" v-model="expiryDate" required>

        <label for="cvv">CVV:</label>
        <input type="text" id="cvv" v-model="cvv" required>

        <button type="submit">Payer</button>
      </form>
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
      error: '',
      showPaymentModal: false,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
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
      const orderedMenus = this.filteredMenus.filter(menu => menu.quantity > 0);
      const accessToken = localStorage.getItem('authToken');
      if (!accessToken) {
        this.error = 'Please log in to order.';
        return; // stop execution of the method
      }
      const token = accessToken.replace("Bearer ", '');

      const newOrder = {
        token: token,
        customerName: this.customerName,
        restaurant: this.selectedRestaurant,
        items: orderedMenus.map(menu => ({
          id: menu._id,
          name: menu.nomMenu,
          price: menu.prix_M,
          quantity: menu.quantity,
        })),
        totalPrice: this.totalPrice,
      };

      axios
        .post('http://localhost:3005/orders', newOrder, {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          this.customerName = response.data.customerName;
          this.orderCreated = true;
          this.orderId = response.data._id;
          this.orderedMenus = orderedMenus;
        })
        .catch(error => {
          console.error(error);
        });
    },
    openPaymentModal() {
      this.showPaymentModal = true;
    },
    processPayment() {
      // Here you would process the payment using the card information
      // For the sake of this example, we'll just close the modal and display a success message
      this.showPaymentModal = false;
      this.orderCreated = false;
      alert('Commande payée');
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
      return this.menus.filter(menu => menu.restaurant ===this.selectedRestaurantName);
    },
    orderedMenus() {
      return this.menus.filter(menu => menu.quantity > 0);
    },
  },
};
</script>

<style scoped>
.container-quantity-control{
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
  color: #333;
  border: 1px solid #ced4da;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
}
.create-order .back-button:hover {
  background-color: #e9ecef;
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
  font-size: 1.2em;
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
  font-size: 1.2em;
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
  color: #333;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
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

/* Payment Modal Styles */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}
.modal-content{
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
</style>
