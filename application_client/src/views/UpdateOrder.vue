<template>
  <div class="update-order">
    <h2>Modifier la commande</h2>
    <form @submit.prevent="updateOrder" class="order-form">
      <!-- Form inputs -->
      <div>
        <label for="customer-name">Nom du client :</label>
        <input type="text" id="customer-name" v-model="customerName" required>
      </div>
      <div>
        <label for="restaurant">Restaurant :</label>
        <select id="restaurant" v-model="selectedRestaurant" @change="getMenuItems">
          <option value="">Sélectionnez un restaurant</option>
          <option v-for="restaurant in restaurants" :key="restaurant._id" :value="restaurant.restaurant">
            {{ restaurant.restaurant }}
          </option>
        </select>
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
      <button type="submit">Modifier la commande</button>
    </form>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      orderId: '',
      customerName: '',
      selectedRestaurant: '',
      restaurants: [],
      totalPrice: 0,
      successMessage: '',
    };
  },
  created() {
    if (this.orderToModify) {
      this.orderId = this.orderToModify.orderId;
      this.customerName = this.orderToModify.customerName;
      this.selectedRestaurant = this.orderToModify.selectedRestaurant;
      this.restaurants = this.orderToModify.items;
      this.calculateTotalPrice();
    }
    this.getOrderDetails();
  },
  methods: {
    ...mapMutations(['setOrderToModify']),
    getOrderDetails() {
      // Vous devez obtenir l'ID de la commande à modifier d'une manière ou d'une autre.
      // Supposons que vous le passiez en tant que paramètre de route.
      const orderId = this.$route.params.orderId;

      axios.get(`http://localhost:3005/orders/${orderId}`)
        .then(response => {
          const order = response.data;
          this.orderId = order._id;
          this.customerName = order.customerName;
          this.selectedRestaurant = order.restaurant;
          this.restaurants = order.items;
          this.restaurants.forEach(menu => {
            menu.quantity = 0;
          });
          this.calculateTotalPrice();
        })
        .catch(error => {
          console.error(error);
        });
    },
    getMenuItems() {
      axios
      .get(`http://localhost:3003/AfficherAM?restaurant=${this.selectedRestaurant}`)
      .then(response => {
        this.restaurants = response.data.map(menu => ({
          ...menu,
          quantity: 0
        }));
        this.calculateTotalPrice();
      })
      .catch(error => {
        console.error(error);
      });
    },
    incrementQuantity(menu) {
      menu.quantity++;
      this.calculateTotalPrice();
    },
    decrementQuantity(menu) {
      if (menu.quantity > 0) {
        menu.quantity--;
        this.calculateTotalPrice();
      }
    },
    calculateTotalPrice() {
      this.totalPrice = this.filteredMenus.reduce(
        (total, menu) => total + menu.prix_M * menu.quantity,
        0
      );
    },
    updateOrder() {
      const orderedMenus = this.filteredMenus.filter(menu => menu.quantity > 0);

      const updatedOrder = {
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
        .put(`http://localhost:3005/orders/${this.orderId}`, updatedOrder)
        .then(response => {
          console.log(response.data);
          this.successMessage = 'La commande a été modifiée avec succès.';
        })
        .catch(error => {
          console.error(error);
        });
        this.setOrderToModify(null);
    },
  },
  computed: {
    ...mapState(['orderToModify']),
    filteredMenus() {
      return this.restaurants.filter(menu => menu.restaurant === this.selectedRestaurant);
    },
  },
};
</script>

<style>
.update-order {
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

.success-message {
  background-color: #f0f9ff;
  border: 1px solid #c8e1ff;
  padding: 10px;
  margin-top: 20px;
}

.changes-list {
  list-style-type: none;
  padding-left: 0;
  margin-top: 10px;
}

.changes-list li {
  margin-bottom: 5px;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button {
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

.quantity-controls input {
  width: 50px;
  height: 30px;
  border: 1px solid #ccc;
  margin: 0 5px;
  text-align: center;
}
</style>
