<template>
    <div>
      <h3>Articles</h3>
  
      <div v-for="article in articles" :key="article._id">
        <p>
          Name: {{ article.nom }} <br/>
          Type: {{ article.article }} <br/>
          Price: {{ article.prix }} <br/>
          Quantity: {{ article.quantite }}
        </p>
  
        <button @click="remove(article)">Remove</button>
        <button @click="update(article)">Update</button>
      </div>
      
      <!-- Form to add new article -->
      <form @submit.prevent="add">
        <input v-model="newArticle.nom" placeholder="Name" />
        <input v-model="newArticle.article" placeholder="Type" />
        <input v-model="newArticle.prix" placeholder="Price" />
        <input v-model="newArticle.quantite" placeholder="Quantity" />
        <button type="submit">Add Article</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      articles: Array,
    },
    data() {
      return {
        newArticle: {
          nom: '',
          article: '',
          prix: '',
          quantite: '',
        }
      }
    },
    methods: {
      add() {
        this.$emit('add', this.newArticle)
        this.newArticle = { nom: '', article: '', prix: '', quantite: '' }
      },
      remove(article) {
        this.$emit('remove', article)
      },
      update(article) {
        this.$emit('update', article)
      }
    }
  }
  </script>
  