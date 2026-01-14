<template>
  <div
    class="flex justify-content-center align-items-center overflow-y-hidden min-h-screen surface-ground px-3"
  >
    <Card class="w-full sm:w-6 lg:w-4 p-4">
      <template #title>
        <h2 class="text-center text-xl font-semibold">
          Register Mini LinkedIn
        </h2>
      </template>

      <template #content>
        <form
          @submit.prevent="handleRegister"
          class="flex flex-column gap-3 mt-3"
        >
          <div class="flex flex-column gap-1">
            <label>Name</label>
            <InputText
              v-model="name"
              toggleMask
              :feedback="false"
              class="w-full"
              placeholder="Joe Doe"
            />
            <small v-if="submitted && !passwordValid" class="p-error">
              Name is required.
            </small>
          </div>

          <div class="flex flex-column gap-1">
            <label>Email</label>
            <InputText
              v-model="email"
              type="email"
              placeholder="bla@example.com"
              class="w-full"
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
              toggleMask
              :feedback="false"
              :inputClass="
                submitted && !passwordValid ? 'p-invalid w-full' : 'w-full'
              "
            />
            <small v-if="submitted && !passwordValid" class="p-error">
              Password is required.
            </small>
          </div>

          <div class="flex flex-column gap-1">
            <label>Password</label>
            <Select
              v-model="selectedRole"
              :options="roles"
              optionLabel="name"
              placeholder="Select a role"
              class="w-full md:w-56"
            />
            <small v-if="submitted && !roleValid" class="p-error">
              A role is required.
            </small>
          </div>

          <Button label="Register" class="w-full mt-2" type="submit" />
        </form>

        <div class="text-center text-xs mt-3">
          <router-link to="/login" class="text-primary">
            Already have an account? Login
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
import { Select } from "primevue";

const selectedRole = ref();
const roles = ref([
  { name: "Recruiter", code: "recruiter" },
  { name: "Candidate", code: "candidate" },
]);

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const name = ref("");
const submitted = ref(false);

const emailValid = computed(() => /.+@.+\..+/.test(email.value));
const passwordValid = computed(() => password.value.length > 0);
const nameValid = computed(() => name.value.trim().length > 4);
const roleValid = computed(() => selectedRole.value !== null);

const handleRegister = () => {
  submitted.value = true;

  if (
    !emailValid.value ||
    !passwordValid.value ||
    !nameValid.value ||
    !roleValid.value
  )
    return;

  authStore.register({
    email: email.value,
    password: password.value,
    fullName: name.value,
    role: selectedRole.value.code,
  });
};
</script>
