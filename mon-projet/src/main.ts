import axios, { AxiosResponse, AxiosError } from 'axios';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
import store from './store';

// Configuration de l'application Vue
const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag: string) => tag.startsWith('ion-');
app.use(store);
axios.get('http://localhost:3000/orders/648825c3575dbcf814841836')
  .then((response: AxiosResponse) => {
    // Traitez la réponse du backend
    console.log(response.data);
  })
  .catch((error: AxiosError) => {
    // Traitez les erreurs
    console.error(error);
  });

createApp(App).use(store).use(router).mount('#app')
