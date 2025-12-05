<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-title>
      <router-link
        to="/"
        style="color: inherit; text-decoration: none"
        class="font-weight-bold"
      >
        Mini LinkedIn
      </router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <template v-if="authStore.isAuthenticated">
      <v-btn
        v-if="authStore.isRecruiter"
        :to="{ name: 'RecruiterPage' }"
        variant="text"
      >
        Dashboard
      </v-btn>
      <v-btn
        v-if="authStore.isCandidate"
        :to="{ name: 'CandidatePage' }"
        variant="text"
      >
        Applications
      </v-btn>

      <v-btn
        v-if="authStore.isCandidate"
        :to="{ name: 'CandidateProfile' }"
        variant="text"
        prepend-icon="mdi-account-circle"
        class="mx-1"
      >
        Profile
      </v-btn>
      <v-btn
        v-else-if="authStore.isRecruiter"
        :to="{ name: 'RecruiterProfile' }"
        variant="text"
        prepend-icon="mdi-account-circle"
        class="mx-1"
      >
        Profile
      </v-btn>

      <v-btn @click="authStore.logout" color="error" class="ml-3" icon>
        <v-icon>mdi-logout</v-icon>
        <v-tooltip activator="parent" location="bottom">Log Out</v-tooltip>
      </v-btn>
    </template>

    <template v-else>
      <v-btn :to="{ name: 'Login' }" variant="text"> Login </v-btn>
      <v-btn
        :to="{ name: 'Register' }"
        variant="flat"
        color="secondary"
        class="ml-2"
      >
        SignUp
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
</script>
