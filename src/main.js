import { createApp } from "vue";
import App from "@/views/App.vue";
import router from "@/router/index";

// import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
// import '@/assets/css/main.css';
import '@/assets/css/main.css'

const app = createApp(App);
app.use(router);
// app.provide('bootstrap', bootstrap);
app.mount('#app');