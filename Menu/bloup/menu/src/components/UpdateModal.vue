<template>
  <div v-if="showModal" class="modal">
    <h2>Update your selection:</h2>
    <span class="close" @click="$emit('close')">&times;</span>

    <!-- Fields to modify articles -->
    <form v-if="itemType === 'article'" @submit.prevent="submitUpdate">
      <label for="nom">Modification:</label>
      <input v-model="updatedArticle.nom" placeholder="Name" />
      <input v-model="updatedArticle.article" placeholder="Type" />
      <input v-model="updatedArticle.prix" placeholder="Price" />
      <input v-model="updatedArticle.quantite" placeholder="Quantity" />
      <button type="submit">Update Article</button>
    </form>

    <!-- Fields to modify menus -->
    <form v-else-if="itemType === 'menu'" @submit.prevent="submitUpdate">
      <label for="nom">Modification:</label>
      <input v-model="updatedMenu.nomMenu" placeholder="Name" />
      <input v-model="updatedMenu.prix_M" placeholder="Price" />
      <input v-model="updatedMenu.restaurant" placeholder="Restaurant" />
      <input v-model="updatedMenu.articles" placeholder="Articles" />
      <button type="submit">Update Menu</button>
    </form>

    <button @click="closeModal">Close</button>
  </div>
</template>

<script>
export default {
  props: {
    itemToUpdate: Object,
    showModal: Boolean,
    itemType: String
  },
  data() {
    return {
      updatedArticle: null,
      updatedMenu: null,
    }
  },
  watch: {
    itemToUpdate: {
      handler(newVal) {
        if (this.itemType === 'article') {
          this.updatedArticle = newVal ;
        } else if (this.itemType === 'menu') {
          this.updatedMenu = newVal ;
        }
      },
      immediate: true
    }
  },
  methods: {
    submitUpdate() {
      if (this.itemType === 'article') {
        this.$emit('update', this.updatedArticle);
        // this.$set(this, 'updatedArticle', this.updatedArticle);
        // this.$emit('update', JSON.parse(JSON.stringify(this.updatedArticle)));
      } else if (this.itemType === 'menu') {
        this.$emit('update', this.updatedMenu);
        // this.$set(this, 'updatedMenu', this.updatedMenu);
        // this.$emit('update', JSON.parse(JSON.stringify(this.updatedMenu)));
      }
    },
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>


  
  <!-- Add styles for the modal -->
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }
  
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  
  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }
  </style>
  