import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Lara from "@primeuix/themes/lara";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      prefix: "p",
      darkModeSelector: "none",
    },
  },
});

app.use(createPinia());
app.use(router);

app.mount("#app");
