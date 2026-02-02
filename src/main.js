import { createApp } from "vue";
import { createHead } from "@vueuse/head";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "katex/dist/katex.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";


const app = createApp(App);
app.use(store);
app.use(router);
app.use(createHead());
app.mount("#app");
