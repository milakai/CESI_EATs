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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
