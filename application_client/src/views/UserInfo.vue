<template>
    <div class="profile-container">
      <h1 class="profile-title">Profile</h1>
      <div class="profile-info">
        <p><strong>Email:</strong> {{ profile.email }} <button class="edit-button" @click="editField('email')">Edit</button></p>
        <p><strong>First Name:</strong> {{ profile.firstName }} <button class="edit-button" @click="editField('firstName')">Edit</button></p>
        <p><strong>Last Name:</strong> {{ profile.lastName }} <button class="edit-button" @click="editField('lastName')">Edit</button></p>
        <p><strong>Delivery Address:</strong> {{ profile.deliveryAddress }} <button class="edit-button" @click="editField('deliveryAddress')">Edit</button></p>
        <p><strong>Billing Address:</strong> {{ profile.billingAddress }} <button class="edit-button" @click="editField('billingAddress')">Edit</button></p>
        <button class="delete-button" @click="confirmDelete">Delete Account</button>
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
  
  .edit-button {
    padding: 0.3rem 0.6rem;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .edit-button:hover {
    background-color: #45a049;
  }
  
  .edit-button:focus {
    outline: none;
  }
  
  .edit-button:active {
    background-color: #3e8e41;
  }
  
  .delete-button {
    margin-top: 1rem;
    padding: 0.3rem 0.6rem;
    background-color: #f44336;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    background-color: #d32f2f;
  }
  
  .delete-button:focus {
    outline: none;
  }
  
  .delete-button:active {
    background-color: #b71c1c;
  }
  </style>
  
  <script>
  import axios from 'axios';
  import jwtDecode from 'jwt-decode';

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
          if(accessToken==null){
            this.$router.push("/");
          }
          const token = accessToken.replace("Bearer ",'');
          const response = await axios.get('http://localhost:3001/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (response.status === 200) {
            const { email, firstName, lastName, deliveryAddress, billingAddress } = response.data.profile;
            this.profile.email = email;
            this.profile.firstName = firstName;
            this.profile.lastName = lastName;
            this.profile.deliveryAddress = deliveryAddress;
            this.profile.billingAddress = billingAddress;
          }
        } catch (error) {
          console.log('Error fetching profile:', error);
        }
      },
      editField(field) {
        const newValue = prompt(`Enter new value for ${field}:`);
        if (newValue !== null) {
          this.profile[field] = newValue;
          this.updateProfile(field, newValue);
        }
      },
      logout() {
      // Clear the authentication token from localStorage
      localStorage.removeItem("authToken");
      // Set the user as logged out in your store or Vuex state management
      this.$store.dispatch("setUser", false);
      this.$router.push("/");
    },
      async updateProfile(field, newValue) {
        try {
          const accessToken = localStorage.getItem('authToken');
          const token = accessToken.replace("Bearer ",'');
          const response = await axios.patch('http://localhost:3001/profile', {
            [field]: newValue
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (response.status === 200) {
            console.log('Profile updated successfully');
          }
        } catch (error) {
          console.log('Error updating profile:', error);
        }
      },
      confirmDelete() {
        if (confirm('Are you sure you want to delete your account?')) {
          this.deleteAccount();
        }
      },
      async deleteAccount() {
  try {
    const accessToken = localStorage.getItem('authToken');
    const token = accessToken.replace("Bearer ", '');
    const response = await axios.delete('http://localhost:3001/delete', {
            data : {
              ID:  this.profile.ID
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

    // Revoke the token by decoding it
    const decodedToken = jwtDecode(token);
    const revokedToken = {
      jti: decodedToken.jti,
      exp: decodedToken.exp
    };
    const blacklistedTokens = []; // Array to store blacklisted tokens

    // Add the revoked token to the blacklist
    blacklistedTokens.push(revokedToken);

    // Clear the token from local storage
    localStorage.removeItem('authToken');
    this.logout();

    // Redirect to home page or login page
    this.$router.push('/'); // Replace with the appropriate route

    // Show a success message
    alert('Account deleted successfully. You have been logged out.');
  } catch (error) {
    console.log('Error deleting account:', error);
  }
}
    }
  };
  </script>
  