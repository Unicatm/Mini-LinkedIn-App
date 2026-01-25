<template>
  <div class="min-h-screen flex flex-column">
    <NavBar v-if="showNavBar" />

    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, RouterView } from "vue-router";

import NavBar from "./components/NavBar.vue";

const route = useRoute();
const showNavBar = computed(() => {
  return route.name != "Login" && route.name !== "RegisterPage";
});
</script>

<style>
* {
  font-family: "Poppins";
}
</style>
