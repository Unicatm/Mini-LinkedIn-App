<template>
  <div
    class="flex justify-content-center align-items-center overflow-y-hidden min-h-screen surface-ground px-3"
  >
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex flex-column gap-3 w-full sm:w-6 lg:w-4 p-4"
    >
      <Card>
        <template #title>
          <h2 class="text-center text-xl font-semibold">Login Mini LinkedIn</h2>
        </template>

        <template #content>
          <div class="flex flex-column gap-1">
            <label>Email</label>
            <InputText
              name="email"
              type="email"
              placeholder="bla@example.com"
              class="w-full md:w-56"
            />
            <Message
              v-if="$form.email?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.email.error.message }}
            </Message>
          </div>

          <div class="flex flex-column gap-1">
            <label>Password</label>
            <Password
              name="password"
              placeholder="********"
              toggleMask
              :feedback="false"
              class="w-full md:w-56"
              :inputClass="'w-full'"
            />
            <Message
              v-if="$form.password?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.password.error.message }}
            </Message>
          </div>
          <Message v-if="authStore.error" severity="error" class="w-full">
            {{ authStore.error }}
          </Message>

          <Button label="Login" class="w-full mt-2" type="submit" />

          <div class="text-center text-xs mt-3">
            <router-link to="/register" class="text-primary">
              Don't have an account? Register
            </router-link>
          </div>
        </template>
      </Card>
    </Form>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Card from "primevue/card";
import Message from "primevue/message";
import { Form } from "@primevue/forms";

import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const authStore = useAuthStore();

const initialValues = {
  email: "",
  password: "",
};

const resolver = zodResolver(
  z.object({
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
  }),
);

const onFormSubmit = async ({ valid, values }) => {
  if (valid) {
    await authStore.login({
      email: values.email,
      password: values.password,
    });
  }
};
</script>
