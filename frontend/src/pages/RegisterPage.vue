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
      <Card class="w-full">
        <template #title>
          <h2 class="text-center text-xl font-semibold">
            Register Mini LinkedIn
          </h2>
        </template>

        <template #content>
          <div class="flex flex-column gap-3 mt-3">
            <div class="flex flex-column gap-2">
              <label class="font-bold">Name</label>
              <InputText
                name="name"
                toggleMask
                :feedback="false"
                class="w-full"
                placeholder="Joe Doe"
              />
              <Message
                v-if="$form.name?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.name.error.message }}
              </Message>
            </div>

            <div class="flex flex-column gap-2">
              <label class="font-bold">Email</label>
              <InputText
                name="email"
                type="email"
                placeholder="bla@example.com"
                class="w-full"
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

            <div class="flex flex-column gap-2">
              <label class="font-bold">Password</label>
              <Password
                name="password"
                toggleMask
                :feedback="false"
                class="w-full"
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

            <div class="flex flex-column gap-2">
              <label class="font-bold">Role</label>
              <Select
                name="selectedRole"
                :options="roles"
                optionLabel="name"
                optionValue="code"
                placeholder="Select a role"
                class="w-full"
              />
              <Message
                v-if="$form.selectedRole?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.selectedRole.error.message }}
              </Message>
            </div>

            <Button
              label="Register"
              class="w-full mt-2"
              type="submit"
              :loading="authStore.loading"
            />

            <div class="text-center text-xs mt-3">
              <router-link
                to="/login"
                class="text-primary no-underline hover:underline"
              >
                Already have an account? Login
              </router-link>
            </div>
          </div>
        </template>
      </Card>
    </Form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Card from "primevue/card";
import Message from "primevue/message";
import Select from "primevue/select";

import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const authStore = useAuthStore();

const roles = ref([
  { name: "Recruiter", code: "recruiter" },
  { name: "Candidate", code: "candidate" },
]);

const initialValues = {
  name: "",
  email: "",
  password: "",
  selectedRole: "",
};

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, "Name is required."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    selectedRole: z.string().min(1, "Role is required."),
  }),
);

const onFormSubmit = async ({ valid, values }) => {
  if (valid) {
    await authStore.register({
      email: values.email,
      password: values.password,
      fullName: values.name,
      role: values.selectedRole,
    });
  }
};
</script>
