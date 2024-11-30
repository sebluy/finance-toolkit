import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import './style.css';
import App from './App.vue';
import { createPinia } from "pinia";
import { ToastService } from "primevue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.mount('#app');

