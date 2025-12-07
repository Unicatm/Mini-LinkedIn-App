import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Lara from "@primeuix/themes/lara";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

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
app.use(ConfirmationService);
app.use(ToastService);

app.mount("#app");
