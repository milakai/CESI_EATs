<template>
    <div>
      <h3>Orders</h3>
  
        <div v-for="order in orders" :key="order._id">
            <p>
            Name: {{ order.nom }} <br/>
            Status: {{ order.status }} <br/>
            TotalPrice: {{ order.totalPrice }} <br/>
            Date: {{ order.date }}
            </p>
    
            <button @click="acceptOrder(order)"> Accept order </button>
            <button @click="cancelOrder(order)"> Cancel order </button>
        </div>

        <div>
        <!-- Form to add new article -->
        <!-- <form @submit.prevent="add">
            <input v-model="order.nom" placeholder="Name" />
            <input v-model="order.status" placeholder="Status" />
            <input v-model="order.totalPrice" placeholder="Price" />
            <input v-model="order.date" placeholder="Date" />
            <button type="submit"> Add Article </button>
        </form> -->
        </div>

    </div>
</template>

<script>
//   import UpdateModal from './UpdateModal.vue'

// Example function to simulate restaurant data
export function getOrderList() {
    return [
        {
            Name: "menuBigMac",
            status: "En cours",
            totalPrice: "Big Mac Menu",
            date: "2023-06-27"
        },
    ];
}
  export default {
    props: {
      orders: Array,
    },
    // components: {
    //   UpdateModal,
    // },
    data() {
      return {
        newArticle: {
          nom: '',
          status: '',
          totalPrice: '',
          date: ''
        },     
      }
    },
    methods: {
      acceptOrder() {
        this.$emit('add', this.order)
        this.newArticle = { nom: '', article: '', prix: '', quantite: '' }
      },
      cancelOrder() {
        this.$emit('remove', this.order)
      },
    //   async update() {
    //     this.$emit('update-article', this.articleToUpdate);
    //     this.showModal = false;
    //     this.articleToUpdate = null;
    //   },
    }
  }

  </script>