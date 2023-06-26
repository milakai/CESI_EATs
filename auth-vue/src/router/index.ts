import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import jwt, { JwtPayload } from 'jsonwebtoken';
import Home from '../views/HomePage.vue'
import UserLogin from '../views/UserLogin.vue'
import UserRegister from '../views/UserRegister.vue'
import ProtectedPage from '../views/ProtectedPage.vue'
import UserInfo from '../views/UserInfo.vue'


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
    path: '/protected',
    name: 'ProtectedPage',
    component: ProtectedPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'UserInfo',
    component: UserInfo,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//       const token = localStorage.getItem('userToken');
  
//       if (token) {
//         try {
//           const decoded = jwt.decode(token);
  
//           // Vérifiez que decoded est un JwtPayload et que exp est défini avant de tenter d'accéder à exp
//           if (decoded && typeof decoded !== 'string' && decoded.exp && decoded.exp < Date.now() / 1000) {
//             next({ name: 'UserLogin' });
//           } else {
//             next(); // Autorise l'accès à la route
//           }
//         } catch (e) {
//           next({ name: 'UserLogin' });
//         }
//       } else {
//         next({ name: 'UserLogin' }); // Redirige vers la page de connexion
//       }
//     } else {
//       next(); // Autorise l'accès à la route
//     }
//   });

export default router
