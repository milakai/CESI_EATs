<template>
  <div class="container">
    <h1 class="welcome-text" v-if="!showMessage">Bienvenue dans l'onglet parrainage</h1>

    <div class="field" v-if="!showMessage">
      <h2>Parrainage client</h2>
      <div v-if="showInput.client" class="input-container">
        <input type="text" v-model="clientEmail" placeholder="Entrez un email ici" class="text-input">
      </div>
      <button @click="validateEmail('client')" class="parraine-button">Je parraine</button>
      <p v-if="showErrorMessage.client" class="error-message">{{ errorMessage.client }}</p>
    </div>

    <div class="field" v-if="!showMessage">
      <h2>Parrainage livreur</h2>
      <div v-if="showInput.livreur" class="input-container">
        <input type="text" v-model="livreurEmail" placeholder="Entrez un email ici" class="text-input">
      </div>
      <button @click="validateEmail('livreur')" class="parraine-button">Je parraine</button>
      <p v-if="showErrorMessage.livreur" class="error-message">{{ errorMessage.livreur }}</p>
    </div>

    <div class="field" v-if="!showMessage">
      <h2>Parrainage restaurant</h2>
      <div v-if="showInput.restaurant" class="input-container">
        <input type="text" v-model="restaurantName" placeholder="Entrez un nom ici" class="text-input">
      </div>
      <button @click="validateName()" class="parraine-button">Je parraine</button>
    </div>

    <div v-if="showMessage" class="message-container">
      <h2 class="message-title">{{ message }}</h2>
      <button class="back-button" @click="resetForm">Retour</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showInput: {
        client: true,
        livreur: true,
        restaurant: true
      },
      clientEmail: "",
      livreurEmail: "",
      restaurantName: "",
      showMessage: false,
      message: "",
      showErrorMessage: {
        client: false,
        livreur: false
      },
      errorMessage: {
        client: "Cet email n'est pas présent dans notre base de données !",
        livreur: "Cet email n'est pas présent dans notre base de données !"
      }
    };
  },
  methods: {
    validateEmail(field) {
      let email = "";

      if (field === "client") {
        email = this.clientEmail;
        if (!this.checkEmailFormat(email)) {
          this.showErrorMessage.client = true;
          return;
        }
      } else if (field === "livreur") {
        email = this.livreurEmail;
        if (!this.checkEmailFormat(email)) {
          this.showErrorMessage.livreur = true;
          return;
        }
      }

      if (this.checkSpecificEmails(email)) {
        this.showMessage = true;
        this.message = "Merci pour votre soutien !";
      } else if (this.checkIfEmailExists(email)) {
        this.showMessage = true;
        this.message = "Merci de votre soutien";
      } else {
        this.showErrorMessage[field] = true;
      }
    },
    validateName() {
      this.showMessage = true;
      this.message = "Merci pour votre soutien !";
    },
    checkSpecificEmails(email) {
      const validEmails = [
        "tom@gmail.com",
        "jv@gmail.com",
        "joris@gmail.com",
        "nichita@gmail.com"
      ];
      return validEmails.includes(email);
    },
    checkIfEmailExists(email) {
      const emailsInDatabase = [
        "bonjour@gmail.com",
        "tom@gmail.com",
        "jv@gmail.com",
        "joris@gmail.com",
        "nichita@gmail.com",
        "barnouinjoris@gmail.com"
      ];
      return emailsInDatabase.includes(email);
    },
    checkEmailFormat(email) {
      // Utilisez une expression régulière pour valider le format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    resetForm() {
      this.showInput.client = true;
      this.showInput.livreur = true;
      this.showInput.restaurant = true;
      this.showMessage = false;
      this.clientEmail = "";
      this.livreurEmail = "";
      this.restaurantName = "";
      this.message = "";
      this.showErrorMessage.client = false;
      this.showErrorMessage.livreur = false;
    }
  }
};
</script>

<style>
.container {
  margin-top: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 20px;
  text-align: center;
}

.welcome-text {
  font-size: 28px;
  margin-bottom: 20px;
}

.field {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}

.text-input {
  padding: 5px;
  border: none;
  border-radius: 5px;
  width: 200px;
  font-size: 16px;
  text-align: center;
}

.parraine-button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  width: 200px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.error-message {
  color: red;
  margin-top: 5px;
}

.message-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.back-button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  width: 200px;
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  font-size: 16px;
}
</style>
