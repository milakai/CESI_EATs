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

      <!-- Update Article Modal -->
    <!-- Update Article Modal -->
    <div v-if="articleToUpdate" class="modal">
      <h3>Update Article</h3>

      <input v-model="articleToUpdate.nom" placeholder="Name" />
      <input v-model="articleToUpdate.article" placeholder="Type" />
      <input v-model="articleToUpdate.prix" placeholder="Price" />
      <input v-model="articleToUpdate.quantite" placeholder="Quantity" />

      <button @click="update">Update</button>
      <!-- TODO: showModal= false ? -->
      <button @click="closeUpdateModal">Close</button>
    </div>
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
        },
        articleToUpdate: null,       // New data property for the article to update - for modal? TODO: modify ?
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
      // update(article) {
      //   this.$emit('update', article)
      // },
      openUpdateModal(article) {
      this.articleToUpdate = {...article};
      this.showModal = true;
      },
      closeUpdateModal() {
        this.articleToUpdate = null;
        this.showModal = false;
      },
      async update() {
        this.$emit('update', this.articleToUpdate)
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
  
  