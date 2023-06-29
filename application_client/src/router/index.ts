  import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
  import jwt, { JwtPayload } from 'jsonwebtoken';
  import Home from '../views/HomePage.vue'
  import UserLogin from '../views/UserLogin.vue'
  import UserRegister from '../views/UserRegister.vue'
  // import ProtectedPage from '../views/ProtectedPage.vue'
  import UserInfo from '../views/UserInfo.vue'
  import UpdateOrder from '../views/UpdateOrder.vue'
  import OrderDetails from '../views/OrderDetails.vue'
  import CreateOrder from '../views/CreateOrder.vue'
  import OrderHistory from '../views/OrderHistory.vue'
  import EditOrder from '@/views/EditOrder.vue'



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
      path: '/create-order/:restaurant',
      name: 'CreateOrder',
      component: CreateOrder,
      props: true
    },
    {
      path: '/register',
      name: 'UserRegister',
      component: UserRegister
    },
    // {
    //   path: '/protected',
    //   name: 'ProtectedPage',
    //   component: ProtectedPage,
    //   meta: { requiresAuth: true }
    // },
    {
      path: '/profile',
      name: 'UserInfo',
      component: UserInfo,
      meta: { requiresAuth: true }
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
    {
      path: '/order-history',
      name: 'OrderHistory',
      component: OrderHistory,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit-order/:orderId',
      name: 'edit-order',
      component: EditOrder,
    },
  ]

  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })

  export default router
