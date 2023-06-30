<template>
  <div>
    <nav id="navbar" class="navbar">
      <a href="/" class="logo">Cesi Eat</a>
      <div class="nav-items">
        <a href="/">Home</a>
      </div>
      <div class="auth-buttons">
        <router-link to="/login" v-if="!isLogged" class="auth-button">Login</router-link>
        <router-link to="/register" v-if="!isLogged" class="auth-button">Register</router-link>
        <div class="dropdown" v-if="isLogged">
          <button class="dropbtn">Profile</button>
          <div class="dropdown-content">
            <router-link to="/profile">Informations</router-link>
            <a href="#" @click.prevent="logout">Sign out</a>
          </div>
        </div>

      </div>
      <a href="javascript:void(0);" class="icon" @click="myFunction">
        <i class="fa fa-bars"></i>
      </a>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isLogged"]),
  },
  created() {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      // Set the user as logged in in your store or Vuex state management
      this.$store.dispatch("setUser", true);
    }
  },
  methods: {
    myFunction() {
      var x = document.getElementById("navbar");
      if (x.className === "navbar") {
        x.className += " responsive";
      } else {
        x.className = "navbar";
      }
    },
    logout() {
      // Clear the authentication token from localStorage
      localStorage.removeItem("authToken");
      // Set the user as logged out in your store or Vuex state management
      this.$store.dispatch("setUser", false);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.navbar {
  overflow: hidden;
  background-color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-items {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-button,
.signout-link {
  color: white;
  text-decoration: none;
  padding: 14px 16px;
  font-size: 17px;
}

.navbar a {
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.navbar a.logo {
  font-size: 20px;
  font-weight: bold;
}

.navbar .icon {
  display: none;
}

.dropdown {
  float: left;
  position: relative;
  z-index : 999
}

.dropdown .dropbtn {
  font-size: 17px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
  cursor: pointer;
}

.dropdown-content {
     display: none; 
    position: fixed;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 100;
    background-color: #ddd;
    right: 0;
   
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #ddd;
 
}

.dropdown:hover .dropdown-content {
  display: flex;
  flex-direction: column;
}

/* Responsive section */
@media screen and (max-width: 600px) {
  .navbar a:not(:first-child),
  .dropdown {
    display: none;
  }
  .navbar a.icon {
    float: right;
    display: block;
  }
}

@media screen and (max-width: 600px) {
  .navbar.responsive {
    position: relative;
  }
  .navbar.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .navbar.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
  .navbar.responsive .dropdown {
    float: none;
  }
  .navbar.responsive .dropdown-content {
    position: relative;
  }
  .navbar.responsive .dropdown .dropbtn {
    display: block;
    width: 100%;
    text-align: left;
  }
}
</style>
