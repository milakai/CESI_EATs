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
        <button @click="openUpdateModal(article)">Update</button>

            
      </div>

      <!-- Form to add new article -->
      <form @submit.prevent="add">
        <input v-model="newArticle.nom" placeholder="Name" />
        <input v-model="newArticle.article" placeholder="Type" />
        <input v-model="newArticle.prix" placeholder="Price" />
        <input v-model="newArticle.quantite" placeholder="Quantity" />
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
          quantite: ''
        },
      articleToUpdate: null,      // New data property for the article to update
      showModal: false       
      }
    }, // n'utiliser pas modal avec slots; ou adapter ArticleList et MenuList pour que le modal puisse faire les rêquetes vers le back
    methods: {
      add() {
        this.$emit('add', this.newArticle)
        this.newArticle = { nom: '', article: '', prix: '', quantite: '' }
      },
      remove(article) {
        this.$emit('remove', article)
      },
      // update(article) {
      //   this.$emit('update', article)
      // },
      openUpdateModal(article) {
        alert("UpdateArt"); // debug
        // this.articleToUpdate = {...articles};
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
      // async updateArticle(article) {
      //   try {
      //     const res = await fetch(`http://localhost:3000/article/${article._id}`, {
      //       method: 'PUT',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(article)
      //     });
      //     const newArticle = await res.json();
      //     const index = this.articles.findIndex(a => a._id === article._id);
      //     this.articles[index] = newArticle;
      //     this.closeUpdateModal(); // close the modal after update
      //   } catch (error) {
      //     console.error(error);
      //   }
      // }
    }
  }

  </script>
  
  