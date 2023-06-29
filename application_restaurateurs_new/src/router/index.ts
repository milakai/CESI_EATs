import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import jwt, { JwtPayload } from 'jsonwebtoken';
import HomeView from '../views/HomeView.vue'
import Home from '../views/HomePage.vue'
import UserLogin from '../views/UserLogin.vue'
import UserRegister from '../views/UserRegister.vue'
// import ProtectedPage from '../views/ProtectedPage.vue'
import UserInfo from '../views/UserInfo.vue'
import ArticleView from '../views/ArticleView.vue'
import MenuView from '../views/MenuView.vue'




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
    path: '/articles',
    name: 'ArticleView',
    component: ArticleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/menus',
    name: 'MenuView',
    component: MenuView,
    meta: { requiresAuth: true }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
