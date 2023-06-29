<template>
  <div>
    <h1>Restaurant Dashboard</h1>

    <h2>Manage Articles</h2>
    <ArticleList :articles="articles" @add="addArticle" @remove="removeArticle" @update="updateArticle" />

    <h2>Manage Menus</h2>
    <MenuList :menus="menus" :articles="articles" @add="addMenu" @remove="removeMenu" @update="updateMenu" />
  </div>
</template>

<script>
import axios from 'axios'
import ArticleList from './components/ArticleList.vue'
import MenuList from './components/MenuList.vue'

export default {
  components: {
    ArticleList,
    MenuList
  },
  data() {
    return {
      articles: [],
      menus: []
    }
  },
  async created() {
    this.articles = await this.fetchArticles()
    this.menus = await this.fetchMenus()
  },
  methods: {
    fetchArticles() {
      return axios.get('/api/articles').then(res => res.data)
    },
    fetchMenus() {
      return axios.get('/api/menus').then(res => res.data)
    },
    addArticle(article) {
      return axios.post('/api/articles', article).then(res => {
        this.articles.push(res.data)
      })
    },
    removeArticle(article) {
      return axios.delete(`/api/articles/${article._id}`).then(() => {
        const index = this.articles.indexOf(article)
        this.articles.splice(index, 1)
      })
    },
    updateArticle(article) {
      return axios.put(`/api/articles/${article._id}`, article).then(res => {
        const index = this.articles.findIndex(a => a._id === article._id)
        this.articles[index] = res.data
      })
    },
    addMenu(menu) {
      return axios.post('/api/menus', menu).then(res => {
        this.menus.push(res.data)
      })
    },
    removeMenu(menu) {
      return axios.delete(`/api/menus/${menu._id}`).then(() => {
        const index = this.menus.indexOf(menu)
        this.menus.splice(index, 1)
      })
    },
    updateMenu(menu) {
      return axios.put(`/api/menus/${menu._id}`, menu).then(res => {
        const index = this.menus.findIndex(m => m._id === menu._id)
        this.menus[index] = res.data
      })
    }
  }
}
</script>
