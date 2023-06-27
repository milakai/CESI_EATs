import { createStore } from 'vuex';
import axios from 'axios';


interface Order {
  orderId: string;
  customerName: string;
  totalPrice: number;
  items: string[];
}

interface State {
  orderToModify: Order | null;
  selectedRestaurantName: string | null;
  selectedRestaurantId: string | null;
}

export default createStore<State>({
  state: {
    orderToModify: null,
    selectedRestaurantName: null,
    selectedRestaurantId: null,
  },
  mutations: {
    setOrderToModify(state, order: Order) {
      state.orderToModify = order;
    },
    setSelectedRestaurantName(state, restaurantName: string) {
      state.selectedRestaurantName = restaurantName;
    },
    setSelectedRestaurantId(state, restaurantId: string) { // Ajoutez cette fonction
      state.selectedRestaurantId = restaurantId;
    },
  },
  actions: {
    async exploreRestaurant({ commit }, restaurantName) {
      try {
        const response = await axios.get('http://localhost:3003/AfficherAM');
        const restaurants: Array<any> = response.data;
        const restaurant = restaurants.find((r: any) => r.restaurant === restaurantName);
        
        if (restaurant) {
          commit('setSelectedRestaurantName', restaurant.restaurant);
        }
      } catch (error) {
        console.error(error);
      }
    },    
  },    
});
