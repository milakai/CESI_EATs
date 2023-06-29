<template>
    <div>
      <h3>Menus</h3>
  
      <div v-for="menu in menus" :key="menu._id">
        <p>
          Name: {{ menu.nomMenu }} <br/>
          Price: {{ menu.prix_M }} <br/>
          Articles: {{ menu.articles.join(', ') }}
        </p>
  
        <button @click="remove(menu)">Remove</button>
        <button @click="update(menu)">Update</button>
      </div>
  
      <!-- Form to add new menu -->
      <form @submit.prevent="add">
        <input v-model="newMenu.nomMenu" placeholder="Name" />
        <input v-model="newMenu.prix_M" placeholder="Price" />
        <select v-model="newMenu.articles" multiple>
          <option v-for="article in articles" :key="article._id" :value="article._id">{{ article.nom }}</option>
        </select>
        <button type="submit"> Add Menu </button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      menus: Array,
      articles: Array,
    },
    data() {
      return {
        newMenu: {
          nomMenu: '',
          prix_M: '',
          articles: [],
        }
      }
    },
    methods: {
      add() {
        this.$emit('add', this.newMenu)
        this.newMenu = { nomMenu: '', prix_M: '', articles: [] }
      },
      remove(menu) {
        this.$emit('remove', menu)
      },
      update(menu) {
        this.$emit('update', menu)
      }
    }
  }
  </script>
  