<template>
  <div class="customer-accounts">
    <h1>Customer Accounts</h1>
    <input class="search-input" type="text" v-model="filter" placeholder="Filtre">
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Delivery Address</th>
          <th>Billing Address</th>
          <th>Type</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.ID">
          <td>{{ user.ID }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.deliveryAddress }}</td>
          <td>{{ user.billingAddress }}</td>
          <td>{{ user.type }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button @click="editProfile(user)">Modifier</button>
            <button @click="deleteUser(user)">Supprimer</button>
            <button @click="suspendUser(user)">Suspendre</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Confirmation Modal -->
    <div v-show="selectedUser" class="modal">
  <div class="modal-content" v-if="selectedUser">
    <span class="close" @click="closeModal">&times;</span>
    <h2>Edit Profile</h2>
    <form @submit.prevent="updateProfile" class="modal-form">
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" v-model="selectedUser.firstName" required>
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="selectedUser.lastName" required>
      </div>
      <div class="form-group">
        <label for="deliveryAddress">Delivery Address:</label>
        <input type="text" id="deliveryAddress" v-model="selectedUser.deliveryAddress" required>
      </div>
      <div class="form-group">
        <label for="billingAddress">Billing Address:</label>
        <input type="text" id="billingAddress" v-model="selectedUser.billingAddress" required>
      </div>
      <div class="form-group">
        <label for="type">Type:</label>
        <select id="type" v-model="selectedUser.type" required>
          <option value="admin">Admin</option>
          <option value="customer">Client</option>
          <option value="driver">Livreur</option>
          <option value="restaurant_owner">Restaurateur</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="selectedUser.email" required>
      </div>
      <button type="submit" class="submit-btn">Save Changes</button>
    </form>
  </div>
</div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      users: [],
      filter: "",
      selectedUser: null
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
    filteredUsers() {
      if (!this.filter) {
        return this.users;
      }
      const filterLower = this.filter.toLowerCase();
      return this.users.filter(user => {
        return Object.values(user).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filterLower);
          }
          return false;
        });
      });
    },
    modalStyle() {
      return this.selectedUser ? { display: 'block' } : { display: 'none' };
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const accessToken = localStorage.getItem("authToken");
        if (accessToken == null) {
          this.$router.push("/");
        }
        const token = accessToken.replace("Bearer ", "");
        const response = await axios.get("http://localhost:3001/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data; // Access the 'data' property from the response
        this.users = data.users; // Access the 'users' property from the response data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    suspendUser(user) {
      const confirmSuspend = window.confirm(`Are you sure you want to suspend the user with ID: ${user.ID}?`);
      if (!confirmSuspend) {
        return;
      }

      try {
        const accessToken = localStorage.getItem("authToken");
        if (accessToken == null) {
          this.$router.push("/");
        }
        const token = accessToken.replace("Bearer ", "");
        const userId = user.ID;

        // Prepare the request payload with updated user data
        const payload = {
          type: "suspended"
        };

        // Make the API request to update the user profile
        axios.patch(`http://localhost:3001/admin/users/${userId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            console.log("Suspended user:", response.data.message);
            // Update the user object in the 'users' array
            const suspendedUserIndex = this.users.findIndex(u => u.ID === userId);
            if (suspendedUserIndex !== -1) {
              this.users[suspendedUserIndex].type = "suspended";
            }
          })
          .catch(error => {
            console.error("Error suspending user:", error);
            // Handle the error as needed
          });
      } catch (error) {
        console.error("Error suspending user:", error);
        // Handle the error as needed
      }
    },

    editProfile(user) {
      this.selectedUser = { ...user };
      document.body.classList.add("modal-open");
    },
    deleteUser(user) {
      const confirmDelete = window.confirm(`Are you sure you want to delete the user with ID: ${user.ID}?`);
      if (!confirmDelete) {
        return;
      }

      try {
        const accessToken = localStorage.getItem("authToken");
        if (accessToken == null) {
          this.$router.push("/");
        }
        const token = accessToken.replace("Bearer ", "");
        const userId = user.ID;

        // Make the API request to delete the user profile
        axios.delete(`http://localhost:3001/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            console.log("Deleted user:", response.data.message);
            // Remove the user object from the 'users' array
            this.users = this.users.filter(u => u.ID !== userId);
          })
          .catch(error => {
            console.error("Error deleting user:", error);
            // Handle the error as needed
          });
      } catch (error) {
        console.error("Error deleting user:", error);
        // Handle the error as needed
      }
    },
    updateProfile() {
      try {
        const accessToken = localStorage.getItem("authToken");
        if (accessToken == null) {
          this.$router.push("/");
        }
        const token = accessToken.replace("Bearer ", "");
        const userId = this.selectedUser.ID;

        // Prepare the request payload with updated user data
        const payload = {
          email: this.selectedUser.email,
          firstName: this.selectedUser.firstName,
          lastName: this.selectedUser.lastName,
          deliveryAddress: this.selectedUser.deliveryAddress,
          billingAddress: this.selectedUser.billingAddress
        };

        // Make the API request to update the user profile
        // Make the API request to update the user profile
        axios.patch(`http://localhost:3001/admin/users/${userId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

          .then(response => {
            console.log("Updated profile:", response.data.message);
            // Update the user object in the 'users' array
            const updatedUserIndex = this.users.findIndex(user => user.ID === userId);
            if (updatedUserIndex !== -1) {
              this.users[updatedUserIndex] = { ...this.selectedUser };
            }
            // Close the modal
            this.closeModal();
          })
          .catch(error => {
            console.error("Error updating profile:", error);
            // Handle the error as needed
          });
      } catch (error) {
        console.error("Error updating profile:", error);
        // Handle the error as needed
      }
    },
    closeModal() {
      this.selectedUser = null;
      document.body.classList.remove("modal-open");
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  color: #333;
}
.customer-accounts {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  opacity: 0.8;
}
.user-table th, .user-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
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

/* Modal styles */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.modal-form {
  display: grid;
  gap: 10px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.submit-btn {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}
.submit-btn:hover {
  background-color: #45a049;
}
.modal-open {
  overflow: hidden;
}
</style>
