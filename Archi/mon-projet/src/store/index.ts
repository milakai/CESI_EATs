import { createStore } from 'vuex';

interface Order {
  orderId: string;
  customerName: string;
  totalPrice: number;
  items: string[];
}

interface State {
  orderToModify: Order | null;
}

export default createStore<State>({
  state: {
    orderToModify: null,
  },
  mutations: {
    setOrderToModify(state, order: Order) {
      state.orderToModify = order;
    },
  },
});
