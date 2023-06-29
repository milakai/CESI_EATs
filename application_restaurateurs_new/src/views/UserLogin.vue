<template>
  <div class="login-container">
    <h1 class="login-title">Log In</h1>
    <form class="login-form" @submit="login">
      <input class="login-input" v-model="email" placeholder="Email" />
      <input class="login-input" v-model="password" placeholder="Password" type="password" />
      <button class="login-button" type="submit">Login</button>
      <div :class="['login-message', messageClass]">{{ message }}</div>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-title {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.login-input {
  height: 40px;
  margin-bottom: 1rem;
  padding: 0 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-button {
  height: 40px;
  color: #fff;
  background-color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #555;
}

.login-message {
  margin-top: 1rem;
  font-size: 1rem;
  text-align: center;
  padding: 0.5rem;
  border-radius: 4px;
}

.success {
  color: #155724;
  background-color: #d4edda;
}

.error {
  color: #721c24;
  background-color: #f8d7da;
}
</style>
<script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        message: '',
        messageClass: '',
        successMessage: '', // Added successMessage property
      };
    },
    methods: {
      async login(event) {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:3001/login', {
            email: this.email,
            password: this.password,
          });
  
          if (response.status === 200 && response.data.success) {
            // if login is successful, store the access token and redirect to the protected page
            localStorage.setItem('authToken', response.data.accessToken);
            this.$store.dispatch('setUser', response.data.accessToken);
            // Set success message
            this.successMessage = 'Login successful';
            // Reset error message
            this.message = '';
            this.messageClass = '';
            // redirect to the protected page
            setTimeout(() => {
              this.$router.replace('/');
            }, 1000);
          } else {
            // if login is not successful, update error message with server response
            this.message = response.data.error || 'Login failed. Please try again.';
            this.messageClass = 'error'; // Set messageClass to 'error' for styling
            this.successMessage = ''; // Reset success message
          }
        } catch (error) {
          // if an error occurred, update error message with error info
          if (error.response && (error.response.status === 400 || error.response.status === 401)) {
            this.message = 'Invalid email or password.';
          } else {
            this.message = 'An error occurred. Please try again.';
          }
          this.messageClass = 'error'; // Set messageClass to 'error' for styling
          this.successMessage = ''; // Reset success message
        }
      },
    },
  };
  </script>