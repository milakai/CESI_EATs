<template>
  <div class="customer-accounts">
    <h1>Customer Accounts</h1>
    <input type="text" v-model="filter" placeholder="Filter by any record">
    <table>
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
            <button @click="editProfile(user)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Confirmation Modal -->
    <div v-show="selectedUser" class="modal">
      <div class="modal-content" v-if="selectedUser">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Edit Profile</h2>
        <form @submit.prevent="updateProfile">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" v-model="selectedUser.firstName" required>
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="selectedUser.lastName" required>
          <label for="deliveryAddress">Delivery Address:</label>
          <input type="text" id="deliveryAddress" v-model="selectedUser.deliveryAddress" required>
          <label for="billingAddress">Billing Address:</label>
          <input type="text" id="billingAddress" v-model="selectedUser.billingAddress" required>
          <label for="type">Type:</label>
          <input type="text" id="type" v-model="selectedUser.type" required>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="selectedUser.email" required>
          <button type="submit">Save Changes</button>
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
    editProfile(user) {
      console.log('editProfile called with user:', user);

      this.selectedUser = { ...user };
      document.body.classList.add("modal-open");
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
    axios.patch(`http://localhost:3001/profile`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("Updated profile:", response.data.message);
        // Close the modal
        this.closeModal();
        // Fetch the updated user list from the server
        this.fetchUsers();
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
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
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

.modal-open {
  overflow: hidden;
}
</style>
