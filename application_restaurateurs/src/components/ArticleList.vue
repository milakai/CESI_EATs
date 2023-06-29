<template>
    <div>
      <h3>Articles</h3>
  
      <div v-for="article in articles" :key="article._id">
        <p>
          Name: {{ article.nom }} <br/>
          Type: {{ article.article }} <br/>
          Price: {{ article.prix }} <br/>
          Quantity: {{ article.quantite }} <br/>
          Restaurant: {{ article.restaurant }}
        </p>
  
        <button @click="remove(article)">Remove</button>
        <button @click="openUpdateModal(article)">Update</button>

            
      </div>

      <!-- Form to add new article -->
      <form @submit.prevent="add">
        <input v-model="newArticle.nom" placeholder="Name" />
        <input v-model="newArticle.article" placeholder="Type" />
        <input v-model="newArticle.prix" placeholder="Price" />
        <input v-model="newArticle.quantite" placeholder="Quantity" />
        <input v-model="newArticle.restaurant" placeholder="Restaurant">
        <button type="submit"> Add Article </button>
      </form>

      <form>
        <!-- Update Article Modal -->
        <UpdateModal 
              :itemToUpdate="articleToUpdate" 
              :showModal="showModal"
              :itemType="'article'" 
              @update="update" 
              @close="closeUpdateModal">
        </UpdateModal>
      </form>
      
  </div>
</template>
  
  <script>
  import UpdateModal from './UpdateModal.vue'

  export default {
    props: {
      articles: Array,
    },
    components: {
      UpdateModal,
    },
    data() {
      return {
        newArticle: {
          nom: '',
          article: '',
          prix: '',
          quantite: '',
          restaurant: ''
        },
      articleToUpdate: null,      // New data property for the article to update
      showModal: false       
      }
    },
    methods: {
      add() {
        this.$emit('add', this.newArticle)
        this.newArticle = { nom: '', article: '', prix: '', quantite: '', restaurant:'' }
      },
      remove(article) {
        this.$emit('remove', article)
      },
      openUpdateModal(article) {
        // alert("UpdateArt"); // debug
        this.articleToUpdate = JSON.parse(JSON.stringify(article));
        this.showModal = true;
      },
      closeUpdateModal() {
        this.articleToUpdate = null;
        this.showModal = false;
      },
      async update() {
        this.$emit('update-article', this.articleToUpdate);
        this.showModal = false;
        this.articleToUpdate = null;
      },
    }
  }

  </script>
  
  