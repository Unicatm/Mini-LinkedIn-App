<template>
  <div
    class="flex justify-content-center align-items-center overflow-y-hidden min-h-screen surface-ground px-3"
  >
    <Card class="w-full sm:w-6 lg:w-4 p-4">
      <template #title>
        <h2 class="text-center text-xl font-semibold">Login Mini LinkedIn</h2>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-column gap-3 mt-3">
          <div class="flex flex-column gap-1">
            <label>Email</label>
            <InputText
              v-model="email"
              type="email"
              placeholder="bla@example.com"
              class="w-full md:w-56"
              :invalid="submitted && !emailValid"
            />
            <small v-if="submitted && !emailValid" class="p-error">
              Invalid email.
            </small>
          </div>

          <div class="flex flex-column gap-1">
            <label>Password</label>
            <Password
              v-model="password"
              placeholder="********"
              toggleMask
              :feedback="false"
              class="w-full md:w-56"
              :inputClass="
                submitted && !passwordValid
                  ? 'p-invalid w-full md:w-56'
                  : 'w-full md:w-56'
              "
            />
            <small v-if="submitted && !passwordValid" class="p-error">
              Password is required.
            </small>
          </div>
          <Message v-if="authStore.error" severity="error" class="w-full">
            {{ authStore.error }}
          </Message>

          <Button label="Login" class="w-full mt-2" type="submit" />
        </form>

        <div class="text-center text-xs mt-3">
          <router-link to="/register" class="text-primary">
            Don't have an account? Register
          </router-link>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Card from "primevue/card";
import Message from "primevue/message";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const submitted = ref(false);

const emailValid = computed(() => /.+@.+\..+/.test(email.value));
const passwordValid = computed(() => password.value.length > 0);

const handleLogin = () => {
  submitted.value = true;

  if (!emailValid.value || !passwordValid.value) return;

  authStore.login({
    email: email.value,
    password: password.value,
  });
};
</script>
