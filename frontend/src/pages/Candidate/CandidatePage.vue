<template>
  <v-container>
    <v-card class="pa-6 mt-5" elevation="4">
      <v-card-title class="text-h4 primary--text">
        Candidate Page
      </v-card-title>
      <v-divider class="my-4"></v-divider>

      <div v-if="authStore.isAuthenticated">
        <p class="text-h6 mb-2">
          Hi, {{ authStore.user.profile?.fullName || "Candidat" }}!
        </p>
        <v-list dense>
          <v-list-item>
            <v-list-item-title>Email:</v-list-item-title>
            <v-list-item-subtitle class="font-weight-bold">{{
              authStore.user.email
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Role:</v-list-item-title>
            <v-list-item-subtitle class="font-weight-bold text-uppercase">{{
              authStore.user.role
            }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-btn color="error" @click="authStore.logout" class="mt-4">
          LogOut
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();
</script>
