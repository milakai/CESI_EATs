<template>
  <div>
    <h1>Restaurant Dashboard</h1>

    <!-- The ArticleList component is used to display and manage articles. 
         The articles data is passed as a prop and event listeners are set up for add, remove, and update events. -->
    <h2>Manage Articles</h2>
    <!-- Add buttons -->
    <ArticleList :articles="articles" @add="addArticle" @remove="removeArticle" @update-article="updateArticle" />

    <!-- The MenuList component is used to display and manage menus. 
         The menus and articles data are passed as props and event listeners are set up for add, remove, and update events. -->
    <h2>Manage Menus</h2>
    <!-- Add buttons -->
    <MenuList :menus="menus" :articles="articles" @add="addMenu" @remove="removeMenu" @update="updateMenu" />

    <h3>Manage orders</h3>
    <!-- Add buttons  -->
    <OrderList :orders="orders" @Accept="acceptOrder" @Cancel="cancelOrder"/>

  </div>
</template>

<script>
import axios from 'axios'
import ArticleList from '../components/ArticleList.vue'
import MenuList from '../components/MenuList.vue'
import OrderList from '../components/OrderList.vue'

export default {
  // Importing the ArticleList and MenuList components to be used in this component.
  components: {
    ArticleList,
    MenuList,
    OrderList
  },
  data() {
    return {
      // Initial state for articles and menus.
      articles: [],
      menus: [],
      orders: []
    }
  },
  async created() {
    // Fetching articles and menus data when the component is created.
    this.articles = await this.fetchArticles()
    this.menus = await this.fetchMenus()
    // this.orders= await this.fetchOrders()    // TODO: à ajouter lors du merge
    this.orders= await this.getOrderList()
  },
  methods: {
    // Fetch articles from the server.
    async fetchArticles() {
      let data = (await axios.get('http://localhost:3000/AfficherArticles')).data;
      console.log(data)
      return data
    },

    // Fetch menus from the server.
    async fetchMenus() {
      return axios.get('http://localhost:3000/AfficherMenu').then(res => res.data)
    },

    // async fetchOrders() {
    //   return axios.get('http://localhost:3000/orders?').then(res => res.data)    // TODO: à ajouter après le merge
    // },
    // Add a new article to the server and update the local state.
    async addArticle(article) {
      return axios.post('http://localhost:3000/AjouterArticle', article).then(res => {
        this.articles.push(res.data)
      })
    },

    // Remove an article from the server and update the local state
    async removeArticle(article) {
      try {
        await fetch(`http://localhost:3000/article`, {
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
        const response = await fetch(`http://localhost:3000/article`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nom: article.nom,
            article: article.article,
            prix: article.prix,
            quantite: article.quantite
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
      return axios.post('http://localhost:3000/AjouterMenu', menu).then(res => {
        this.menus.push(res.data);
      }).catch(error => {
        console.error(error.response);
      });
    },

    // Remove a menu from the server and update the local state.
    async removeMenu(menu) {
      try {
        await fetch(`http://localhost:3000/menu`, {     // utiliser fetch
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
        const response = await fetch(`http://localhost:3000/menu`, {
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
