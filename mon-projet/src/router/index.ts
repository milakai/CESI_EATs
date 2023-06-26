import { createRouter, createWebHistory } from 'vue-router';
import CreateOrder from '../components/CreateOrder.vue';
import OrderDetails from '../components/OrderDetails.vue';
import UpdateOrder from '../components/UpdateOrder.vue';



const routes = [
  {
    path: '/',
    redirect: '/create-order',
  },
  {
    path: '/create-order',
    component: CreateOrder,
  },
  {
    path: '/order-details',
    component: OrderDetails,
  },
  {
    path: '/update-order/:orderId',
    name: 'UpdateOrder',
    component: UpdateOrder,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
