<template>
  <div class="create-order home">
    <h2>Créer une nouvelle commande</h2>
    <form @submit.prevent="createOrder" class="order-form">
      <!-- Form inputs -->
      <div>
        <label for="customer-name">Nom du client :</label>
        <input type="text" id="customer-name" v-model="customerName" required>
      </div>
      <div class="restaurant-grid">
        <label>Restaurant :</label>
        <div v-for="restaurant in restaurants" :key="restaurant._id" class="restaurant-option">
          <input type="radio" :id="restaurant._id" :value="restaurant.restaurant" v-model="selectedRestaurant" @change="getMenus">
          <label :for="restaurant._id">{{ restaurant.restaurant }}</label>
        </div>
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

export default {
  data() {
    return {
      customerName: '',
      selectedRestaurant: '',
      restaurants: [],
      menus: [],
      totalPrice: 0,
      orderCreated: false,
      orderId: '',
    };
  },

  created() {
    this.getRestaurantsAndMenus();
  },
  methods: {
    getRestaurantsAndMenus() {
      axios.get('http://localhost:3001/AfficherAM')
        .then(response => {
          this.menus = response.data.map(menu => ({
            ...menu,
            quantity: 0,
          }));

          // Utiliser Set pour supprimer les doublons
          const uniqueRestaurants = Array.from(new Set(this.menus.map(menu => menu.restaurant)))
            .map(restaurant => {
              return {
                restaurant,
                _id: restaurant, // utiliser le nom du restaurant comme ID unique
              };
            });

          this.restaurants = uniqueRestaurants;
        })
        .catch(error => {
          console.error(error);
        });
    },

    getMenus() {
      axios.get(`http://localhost:3001/AfficherAM?restaurant=${this.selectedRestaurant}`)
        .then(response => {
          this.menus = response.data.map(menu => ({
            ...menu,
            quantity: 0,
          }));
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
      this.totalPrice = this.filteredMenus.reduce((total, menu) => total + menu.prix_M * menu.quantity, 0);
    },

    createOrder() {
      const orderedMenus = this.filteredMenus.filter(menu => menu.quantity > 0);

      const newOrder = {
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
        .post('http://localhost:3005/orders', newOrder)
        .then(response => {
          console.log(response.data);
          this.orderCreated = true;
          this.orderId = response.data._id;
          this.orderedMenus = orderedMenus;
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
  computed: {
    filteredMenus() {
      return this.menus.filter(menu => menu.restaurant === this.selectedRestaurant);
    },
    orderedMenus() {
      return this.filteredMenus.filter(menu => menu.quantity > 0);
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

.restaurant-option input[type="radio"] {
  margin-right: 1em;
}

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
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
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
