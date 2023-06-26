response.data<template>
  <div class="profile-container">
    <h1 class="profile-title">Profile</h1>
    <div class="profile-info">
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>First Name:</strong> {{ profile.firstName }}</p>
      <p><strong>Last Name:</strong> {{ profile.lastName }}</p>
      <p><strong>Delivery Address:</strong> {{ profile.deliveryAddress }}</p>
      <p><strong>Billing Address:</strong> {{ profile.billingAddress }}</p>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.profile-title {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #fff;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-info p {
  margin-bottom: 1rem;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      profile: {
        email: '',
        firstName: '',
        lastName: '',
        deliveryAddress: '',
        billingAddress: ''
      }
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const accessToken = localStorage.getItem('authToken');
        const token = accessToken.replace("Bearer ",'');
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const { email, firstName, lastName, deliveryAddress, billingAddress } = response.data;
          console.log(response.data)
          console.log(response.data.profile.email)
          this.profile.email = response.data.profile.email;
          this.profile.firstName = response.data.profile.firstName;
          this.profile.lastName = response.data.profile.lastName;
          this.profile.deliveryAddress = response.data.profile.deliveryAddress;
          this.profile.billingAddress = response.data.profile.billingAddress;
        }
      } catch (error) {
        console.log('Error fetching profile:', error);
      }
    }
  }
};
</script>
