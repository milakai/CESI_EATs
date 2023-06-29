<template>
  <div class="dashboard">
    <h1 class="dashboard__title">Restaurant Dashboard</h1>
    <div class="dashboard__content">
      <h2 class="dashboard__subtitle">Manage Menus</h2>
      <div class="form-container">
        <MenuList :menus="menus" :articles="articles" @add="addMenu" @remove="removeMenu" @update="updateMenu" />
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import MenuList from '../components/MenuList.vue'

export default {
  // Importing the ArticleList and MenuList components to be used in this component.
  components: {
    MenuList,
  },
  data() {
    return {
      // Initial state for articles and menus.
      menus: [],
    }
  },
  async created() {
    // Fetching articles and menus data when the component is created.
    this.menus = await this.fetchMenus()

    // this.orders= await this.fetchOrders()    // TODO: à ajouter lors du merge
    // this.orders= await this.getOrderList()
  },
  methods: {
    async fetchMenus() {
      return axios.get('http://localhost:3003/AfficherMenu').then(res => res.data)
    },


    async addArticle(article) {
      return axios.post('http://localhost:3003/AjouterArticle', article).then(res => {
        this.articles.push(res.data);
      })
    },

    // Remove an article from the server and update the local state.
    async removeArticle(article) {
      try {
        await fetch(`http://localhost:3003/article`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nom: article.nom })
        });
        const index = this.articles.indexOf(article)
        this.articles.splice(index, 1)
      } catch (error) {
        console.error(error);
      }
    },

    // Update an article on the server and update the local state.
    async updateArticle(article) {
      try {
        const response = await fetch(`http://localhost:3003/article`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nom: article.nom,
            article: article.article,
            prix: article.prix,
            quantite: article.quantite,
            restaurant: article.restaurant
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedArticle = await response.json();
        // console.log(updatedArticle);  // debug

        const index = this.articles.findIndex(a => a.nom === article.nom);
        if (index !== -1) {
          this.articles.splice(index, 1, updatedArticle);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // Ajouter un menu
    addMenu(menu) {
      return axios.post('http://localhost:3003/AjouterMenu', menu).then(res => {
        this.menus.push(res.data);
      }).catch(error => {
        console.error(error.response);
      });
    },

    // Remove a menu from the server and update the local state.
    async removeMenu(menu) {
      try {
        await fetch(`http://localhost:3003/menu`, {     // utiliser fetch
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nomMenu: menu.nomMenu })
        });
        const index = this.menus.indexOf(menu);
        this.menus.splice(index, 1);
      } catch (error) {
        console.error(error);
      }
    },

    // Update a menu on the server and update the local state.
    async updateMenu(menu) {
      try {
        const response = await fetch(`http://localhost:3003/menu`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nomMenu: menu.nomMenu,
            restaurant: menu.restaurant,
            prix_M: menu.prix_M,
            articles: menu.articles
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedMenu = await response.json();
        // console.log(updatedMenu);  // debug

        const index = this.articles.findIndex(a => a.nom === menu.nomMenu);
        if (index !== -1) {
          this.menu.splice(index, 1, updatedMenu);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #333;
  background-color: #f4f4f4;
  border-radius: 5px;
}

.dashboard__title, .dashboard__subtitle {
  font-weight: bold;
  margin-bottom: 1rem;
}

.dashboard__title {
  font-size: 2rem;
}

.dashboard__subtitle {
  font-size: 1.5rem;
}

.dashboard__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e9e9e9;
  border-radius: 5px;
}

button {
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  color: #fff;
  background-color: #333;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

input[type="submit"] {
  color: #fff;
  background-color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

input[type="submit"]:hover {
  background-color: #555;
}
</style>