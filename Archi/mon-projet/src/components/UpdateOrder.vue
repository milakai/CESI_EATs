<template>
  <div class="update-order">
    <h2>Modifier la commande</h2>
    <form @submit.prevent="updateOrder" class="order-form">
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
      <button type="submit">Modifier la commande</button>
    </form>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
      <ul v-if="changes.length" class="changes-list">
        <li v-for="change in changes" :key="change.field">
          {{ change.field }}: {{ change.newValue }}
        </li>
      </ul>
    </div>
  </div>
</template>

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
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orderId: '',
      customerName: '',
      totalPrice: '',
      items: '',
      previousOrder: null, // Nouvelle propriété pour stocker la commande précédente
      successMessage: '', // Nouvelle propriété pour afficher le message de succès
      changes: [], // Nouvelle propriété pour stocker les changements apportés à la commande
    };
  },
  created() {
    this.setOrderDetails();
  },
  methods: {
    setOrderDetails() {
      // Récupérez l'objet orderToModify du store Vuex
      const orderToModify = this.$store.state.orderToModify;

      if (orderToModify) {
        this.orderId = orderToModify.orderId;
        this.customerName = orderToModify.customerName;
        this.totalPrice = orderToModify.totalPrice;
        this.items = orderToModify.items.join('\n');

        // Sauvegardez la commande précédente
        this.previousOrder = { ...orderToModify };
      }
    },
    updateOrder() {
      // Logique pour mettre à jour la commande avec Axios
      // Utilisez les données saisies dans les champs pour effectuer la mise à jour
      // Utilisez this.orderId pour obtenir l'ID de la commande à modifier
      // Faites appel à l'API pour mettre à jour la commande

      // Exemple de code avec Axios (à adapter selon votre API)
      const updatedOrder = {
        orderId: this.orderId,
        customerName: this.customerName,
        totalPrice: parseFloat(this.totalPrice),
        items: this.items.split('\n').filter(item => item.trim() !== ''),
      };

      axios
        .put(`http://localhost:3000/orders/${this.orderId}`, updatedOrder)
        .then(response => {
          // Gérez la réponse de la mise à jour de la commande
          console.log(response.data);
          this.successMessage = 'La commande a été modifiée avec succès.';
          this.detectChanges(updatedOrder);
        })
        .catch(error => {
          // Gérez les erreurs de mise à jour de la commande
          console.error(error);
        });
    },
    detectChanges(updatedOrder) {
      this.changes = [];

      // Comparez les valeurs actuelles avec les valeurs précédentes
      if (this.previousOrder.customerName !== updatedOrder.customerName) {
        this.changes.push({
          field: 'Nom du client',
          newValue: updatedOrder.customerName,
        });
      }
      if (this.previousOrder.totalPrice !== updatedOrder.totalPrice) {
        this.changes.push({
          field: 'Prix total',
          newValue: updatedOrder.totalPrice,
        });
      }
      if (JSON.stringify(this.previousOrder.items) !== JSON.stringify(updatedOrder.items)) {
        this.changes.push({
          field: 'Articles',
          newValue: updatedOrder.items,
        });
      }
    },
  },
};
</script>
