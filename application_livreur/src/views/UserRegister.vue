<template>
  <div class="registration-container">
    <h1 class="registration-title">Register</h1>
    <form class="registration-form" @submit="register">
      <input class="registration-input" v-model="firstName" placeholder="First Name" />
      <input class="registration-input" v-model="lastName" placeholder="Last Name" />
      <input class="registration-input" v-model="email" placeholder="Email" />
      <input class="registration-input" v-model="password" placeholder="Password" type="password" />
      <input class="registration-input" v-model="deliveryAddress" placeholder="Delivery Address" />
      <input class="registration-input" v-model="billingAddress" placeholder="Billing Address" />
      <select class="registration-dropdown" v-model="type">
        <option value="customer" :selected="type === 'customer'">Customer</option>
        <option value="driver">Driver</option>
        <option value="restaurant owner">Restaurant</option>
      </select>
      <div v-if="type === 'restaurant owner'">
        <input class="registration-input" v-model="restaurantName" placeholder="Name of the Restaurant" />
        <input class="registration-input" v-model="cuisineType" placeholder="Type of Cuisine" />
      </div>

      <button class="registration-button" type="submit">Register</button>
      <div class="registration-message" :class="messageClass">{{ message }}</div>
    </form>
  </div>
</template>


<style scoped>
.registration-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.registration-title {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.registration-form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.registration-input {
  height: 40px;
  margin-bottom: 1rem;
  padding: 0 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.registration-dropdown {
  height: 40px;
  margin-bottom: 1rem;
  padding: 0 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.registration-button {
  height: 40px;
  color: #fff;
  background-color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.registration-button:hover {
  background-color: #555;
}

.registration-message {
  margin-top: 1rem;
  font-size: 1rem;
  text-align: center;
  padding: 0.5rem;
  border-radius: 4px;
}

.registration-message.success {
  color: #155724;
  background-color: #d4edda;
}

.registration-message.error {
  color: #721c24;
  background-color: #f8d7da;
}
</style>

<script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        deliveryAddress: '',
        billingAddress: '',
        type: 'customer',
        message: '',
        messageClass: '',
      };
    },
    methods: {
      async register(event) {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:3001/register', {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            deliveryAddress: this.deliveryAddress,
            billingAddress: this.billingAddress,
            type: this.type,
          });
  
          if (response.status === 201) {
            this.message = 'Account created';
            this.messageClass = 'success';
            setTimeout(() => {
              this.message = '';
              this.messageClass = '';
              this.$router.replace('/login');
            }, 2000);
          } else {
            this.message = 'Error';
            this.messageClass = 'error';
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.error === 'Email already registered') {
            this.message = 'Email is already registered.';
          } else {
            this.message = 'Error';
            this.messageClass = 'error';
          }
        }
      },
    },
  };
  </script>
