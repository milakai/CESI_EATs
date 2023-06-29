<template>
  <div class="order-to-delivery home">
    <h2>Orders to Deliver</h2>
    <div v-for="order in orders" :key="order._id" class="order">
      <h3>Order ID: {{ order._id }}</h3>
      <p>Customer Name: {{ order.customerName }}</p>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          {{ item.name }} - Quantity: {{ item.quantity }} - Price: {{ item.price }}€
        </li>
      </ul>
      <p>Total Price: {{ order.totalPrice }}€</p>
      <div>
        <button @click="acceptOrder(order._id)">Accept</button>
        <button @click="denyOrder(order._id)">Deny</button>
      </div>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      error: '',
    };
  },
  created() {
    this.getOrdersToDeliver();
  },
  methods: {
    getOrdersToDeliver() {
      const accessToken = localStorage.getItem('authToken');

      if (!accessToken) {
        this.error = 'Please log in to see orders.';
        return; // stop execution of the method
      }
      
      const token = accessToken.replace("Bearer ",'');

      axios
        .get('http://localhost:3005/orders', {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          this.orders = response.data;
        })
        .catch(error => {
          if(error.response.status == 403){
            alert("Connectez-vous avec un compte livreur ")
          this.error = "Vous ne pouvez pas acceder a cette fonctionnalité en tant que client ";
          console.error(error);
          }
        });
    },
    acceptOrder(orderId) {
      const accessToken = localStorage.getItem('authToken');
      if (!accessToken) {
        this.error = 'Please log in to perform this action.';
        return;
      }
      
      const decision = 'accept';
      const token = accessToken.replace('Bearer ', '');

      axios
        .patch(`http://localhost:3006/orders/${orderId}/driver`, { decision }, {
          headers: {
            Authorization: token,
          },
        })
        .then(response => {
          console.log(response.data);
          // Handle success, update UI if necessary
          this.getOrdersToDeliver(); // Fetch updated orders
        })
        .catch(error => {
          if(error.response.status == 403){
            alert("Connectez-vous avec un compte livreur ")
          }
          // Handle error, display error message if necessary
        });
    },
    denyOrder(orderId) {
      const accessToken = localStorage.getItem('authToken');
      if (!accessToken) {
        this.error = 'Please log in to perform this action.';
        return;
      }

      const decision = 'refuse';
      const token = accessToken.replace('Bearer ', '');

      axios
        .patch(`http://localhost:3006/orders/${orderId}/driver`, { decision }, {
          headers: {
            Authorization: token,
          },
        })
        .then(response => {
          console.log(response.data);
          // Handle success, update UI if necessary
          this.getOrdersToDeliver(); // Fetch updated orders
        })
        .catch(error => {
          console.error(error);
          // Handle error, display error message if necessary
        });
  },
},
};
</script>

<style scoped>
.order-to-delivery {
  font-family: Arial, sans-serif;
  color: #333;
}

.order {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.error {
  color: red;
}
</style>
