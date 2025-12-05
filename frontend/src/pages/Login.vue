<template>
  <v-row justify="center" align="center" class="fill-height">
    <v-col cols="12" sm="8" md="6">
      <v-container fill-height fluid class="d-flex align-center justify-center">
        <v-card class="pa-4" width="400">
          <v-card-title class="text-h5 text-center mb-4">
            Login Mini LinkedIn
          </v-card-title>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email"
              :rules="[rules.required, rules.email]"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>

            <v-alert
              v-if="authStore.error"
              type="error"
              dense
              class="mb-3"
              closable
            >
              {{ authStore.error }}
            </v-alert>

            <v-btn
              :loading="authStore.isLoading"
              color="primary"
              block
              size="large"
              type="submit"
              class="mt-2"
            >
              Login
            </v-btn>
          </v-form>

          <v-card-actions class="justify-center mt-3">
            <router-link to="/register" class="text-caption text-primary">
              Don't have an account? Register
            </router-link>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const rules = {
  required: (value) => !!value || "Required field.",
  email: (value) => /.+@.+\..+/.test(value) || "Invalid email.",
  //   min: (value) => value.length >= 6 || "Min 6 characters",
};

const handleLogin = () => {
  if (email.value && password.value) {
    authStore.login({
      email: email.value,
      password: password.value,
    });
  }
};
</script>
