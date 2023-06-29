<template>
    <div>
      <h3>Menus</h3>
  
      <div v-for="menu in menus" :key="menu._id">
        <p>
          Name: {{ menu.nomMenu }} <br/>
          Price: {{ menu.prix_M }} <br/>
          Restaurant: {{ menu.restaurant }} <br/>
          Articles: {{ menu.articles.join(', ') }}
        </p>
  
        <button @click="remove(menu)">Remove</button>
        <button @click="openUpdateModal(menu)">Update</button>
      </div>
  
      <!-- Form to add new menu -->
      <form @submit.prevent="add">
        <input v-model="newMenu.nomMenu" placeholder="Name" />
        <input v-model="newMenu.prix_M" placeholder="Price" />
        <input v-model="newMenu.restaurant" placeholder="Restaurant"/>
        <select v-model="newMenu.articles" multiple>
          <option v-for="article in articles" :key="article._id" :value="article.nom"> {{ article.nom }} </option>
        </select>

        <button type="submit"> Add Menu </button>
      </form>

      <!-- Modal -->
      <UpdateModal 
      :itemToUpdate="menuToUpdate" 
      :showModal="showModal"
      :itemType="'menu'" 
      @update="update" 
      @close="closeUpdateModal">
      </UpdateModal>

    </div>
  </template>
  
  <script>
  import UpdateModal from './UpdateModal.vue'

  export default {
    props: {
      menus: Array,
      articles: Array,
    },
    components: {
      UpdateModal,
    },
    data() {
      return {
        newMenu: {
          nomMenu: '',
          prix_M: '',
          restaurant:'',
          articles: [],
        },
      menuToUpdate: null,
      showModal: false,
      }
    },
    methods: {
      add() {
        // alert("AddMenu"); // debug
        this.$emit('add', this.newMenu)
        this.newMenu = { nomMenu: '', prix_M: '', restaurant: '', articles: [] }
      },
      remove(menu) {
        this.$emit('remove', menu)
      },
      openUpdateModal(menu) {
      this.menuToUpdate = JSON.parse(JSON.stringify(menu));
      this.showModal = true;
      },
      closeUpdateModal() {
        this.menuToUpdate = null;
        this.showModal = false;
      },
      async update() {
        this.$emit('update', this.menuToUpdate)
        this.showModal = false;
        this.menuToUpdate = null;
      }
    }
  }
  </script>
  