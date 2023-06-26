<template>
  <div>
    <h1>Restaurant Dashboard</h1>

     <!-- The ArticleList component is used to display and manage articles. 
         The articles data is passed as a prop and event listeners are set up for add, remove, and update events. -->
    <h2>Manage Articles</h2>
    <ArticleList :articles="articles" @add="addArticle" @remove="removeArticle" @update="updateArticle" />
    
    <!-- The MenuList component is used to display and manage menus. 
         The menus and articles data are passed as props and event listeners are set up for add, remove, and update events. -->
    <h2>Manage Menus</h2>
    <MenuList :menus="menus" :articles="articles" @add="addMenu" @remove="removeMenu" @update="updateMenu" />

    <h2> Modify </h2>
    <h3> Articles </h3>

    <h3> Menus </h3>

  </div>
</template>

<script>
import axios from 'axios'
import ArticleList from '../components/ArticleList.vue'
import MenuList from '../components/MenuList.vue'

export default {
  // Importing the ArticleList and MenuList components to be used in this component.
  components: {
    ArticleList,
    MenuList
  },
  data() {
    return {
      // Initial state for articles and menus.
      articles: [],
      menus: []
    }
  },
  async created() {
     // Fetching articles and menus data when the component is created.
    this.articles = await this.fetchArticles()
    this.menus = await this.fetchMenus()
  },
  methods: {
    // Fetch articles from the server.
    async fetchArticles() {
      let data = (await axios.get('http://localhost:3000/AfficherArticles')).data;
      console.log(data)
      return data
    },
    async fetchMenus() {
      return axios.get('http://localhost:3000/AfficherMenu').then(res => res.data)
    },
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
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({nom: article.nom})});
          const index = this.articles.indexOf(article)
          this.articles.splice(index, 1)
          } catch (error) {
              console.error(error);
            }
        },
      // return axios.delete(`http://localhost:3000/article`, article).then(() => {   // Requête avec axios
        // const index = this.articles.indexOf(article)
        // this.articles.splice(index, 1)
      // })
    // },
    // Update an article on the server and update the local state.
    updateArticle(article) { 
      return axios.put(`http://localhost:3000/article/${article._id}`, article).then(res => {   // modifier avec FETCH 
        const index = this.articles.findIndex(a => a._id === article._id)
        this.articles[index] = res.data
      })
    },
      // Add a new menu to the server and update the local state.
    addMenu(menu) {
      return axios.post('http://localhost:3000/AjouterMenu', menu).then(res => {
        this.menus.push(res.data)
      })
    },
     // Remove a menu from the server and update the local state.
     async removeMenu(menu) {
      try {
        await fetch(`http://localhost:3000/menu`, {     // utiliser fetch
          method: 'DELETE',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({nomMenu: menu.nomMenu})});
        const index = this.menus.indexOf(menu);
        this.menus.splice(index, 1);
          } catch (error) {
        console.error(error);
          }
        },
    // Update a menu on the server and update the local state.
    async updateMenu(menu) {
      return axios.put(`http://localhost:3000/menu/${menu.nomMenu}`, menu).then(res => {
        const index = this.menus.findIndex(m => m._id === menu._id)
        this.menus[index] = res.data
      })
    }
  }
}
</script>
