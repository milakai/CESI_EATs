<template>
  <div class="edit-order" v-if="order">
    <h1 class="page-title">Modifier la commande</h1>
    <div v-if="!isLogged">
      <p>Veuillez vous connecter pour modifier la commande.</p>
      <button @click="redirectToLogin">Se connecter</button>
    </div>
    <div v-else>
      <div class="order-details">
        <h2>Commande n°{{ order._id }}</h2>
        <p><strong>Client:</strong> {{ order.customerName }}</p>
        <p><strong>Total:</strong> {{ calculateTotalPrice() }} €</p>
        <div v-for="item in order.items" :key="item.id" class="menu-item">
          <h3>{{ item.name }}</h3>
          <p>Prix: {{ item.price }} €</p>
          <div class="quantity-controls">
            <button @click="decrementQuantity(item)">-</button>
            <input type="number" v-model="item.quantity" min="0" />
            <button @click="incrementQuantity(item)">+</button>
          </div>
        </div>
        <button @click="saveChanges">Enregistrer les modifications</button>
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
  },
  data() {
    return {
      order: null,
    };
  },
  mounted() {
    this.getOrder();
  },
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    },
    async getOrder() {
      try {
        const orderId = this.$route.params.orderId;
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:3005/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.order = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    decrementQuantity(item) {
      if (item.quantity > 0) {
        item.quantity--;
      }
    },
    incrementQuantity(item) {
      item.quantity++;
    },
    calculateTotalPrice() {
      let totalPrice = 0;
      for (const item of this.order.items) {
        totalPrice += item.price * item.quantity;
      }
      return totalPrice;
    },
    async saveChanges() {
      try {
        const orderId = this.$route.params.orderId;
        const token = localStorage.getItem('authToken');
        const updatedData = {
          items: this.order.items,
          totalPrice: this.calculateTotalPrice(),
        };
        const response = await axios.put(`http://localhost:3005/orders/${orderId}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.message); // Display success message or handle as needed
        this.$router.push('/order-history'); // Redirect to order history page after saving changes
      } catch (error) {
        console.error('Error:', error);
      }
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
