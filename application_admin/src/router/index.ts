import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/HomePage.vue';
import UserLogin from '../views/UserLogin.vue';
import UserRegister from '../views/UserRegister.vue';
import UserInfo from '../views/UserInfo.vue';
import UpdateOrder from '../views/UpdateOrder.vue';
import OrderDetails from '../views/OrderDetails.vue';
import CustomerAccounts from '../views/CustomerAccounts.vue';
import OrderDashboards from '../views/OrderDashboards.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister
  },
  {
    path: '/profile',
    name: 'UserInfo',
    component: UserInfo,
    meta: { requiresAuth: true }
  },
  {
    path: '/customer-accounts',
    name: 'CustomerAccounts',
    component: CustomerAccounts,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-dashboards',
    name: 'OrderDashboards',
    component: OrderDashboards,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-order',
    redirect: '/orders' // Redirect '/' to '/orders'
  },
  {
    path: '/order-details/:orderId', // Use dynamic parameter ':orderId'
    name: 'OrderDetails',
    component: OrderDetails,
    props: true
  },
  {
    path: '/update-order/:orderId',
    name: 'UpdateOrder',
    component: UpdateOrder,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
