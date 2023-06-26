import axios from 'axios';

export default {
  data() {
    return {
      orders: []
    };
  },
  created() {
    axios.get('http://localhost:3000/orders')
      .then(response => {
        this.orders = response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des commandes', error);
      });
  }
};
