<template>
  <div class="flex justify-content-center mt-5 px-3">
    <Card class="w-full sm:w-8 md:w-6 lg:w-4 p-4 shadow-2 border-round-xl">
      <template #title>
        <h2 class="text-center text-xl font-semibold text-primary">Candidate Page</h2>
      </template>

      <template #content>
        <Divider class="my-3" />

        <div v-if="authStore.isAuthenticated">
          <p class="text-lg font-medium mb-3">
            Hi, {{ authStore.user.profile?.fullName || "Candidat" }}!
          </p>

          <ul class="list-none p-0 m-0">
            <li class="flex justify-content-between py-2 border-bottom-1 surface-border">
              <span class="font-medium">Email:</span>
              <span class="font-semibold">{{ authStore.user.email }}</span>
            </li>

            <li class="flex justify-content-between py-2 border-bottom-1 surface-border">
              <span class="font-medium">Role:</span>
              <span class="font-semibold text-primary text-uppercase">
                {{ authStore.user.role }}
              </span>
            </li>
          </ul>

          <Button label="Log Out" severity="danger" class="w-full mt-4" @click="authStore.logout" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";

import Card from "primevue/card";
import Divider from "primevue/divider";
import Button from "primevue/button";

const authStore = useAuthStore();
</script>
