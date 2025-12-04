/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";

// Styles
import "unfonts.css";

const app = createApp(App);
const vuetify = createVuetify({ components, directives });
const pinia = createPinia();

registerPlugins(app);
app.use(pinia);
app.use(vuetify);

app.mount("#app");
