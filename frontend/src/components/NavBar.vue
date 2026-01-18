<template>
  <Menubar :model="items">
    <template #start>
      <span
        class="text-2xl font-bold text-blue-600 no-underline cursor-pointer"
        @click="goToHome"
      >
        Mini LinkedIn
      </span>
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <RouterLink
        :to="item.to"
        v-if="item.condition"
        v-ripple
        class="flex items-center"
        v-bind="props.action"
      >
        <span>{{ item.label }}</span>
      </RouterLink>
    </template>
    <template #end>
      <div class="flex items-center justify-center gap-3">
        <Avatar
          shape="circle"
          icon="pi pi-user"
          class="bg-blue-100 cursor-pointer"
          @click="goToHome"
        />
        <Button
          label="Logout"
          rounded
          variant="outlined"
          class="border-blue-600 text-blue-600 hover:bg-blue-50"
          size="small"
          @click="() => authStore.logout()"
        />
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Avatar, Menubar, Badge, Button } from "primevue";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const items = ref([
  {
    label: "Jobs",
    icon: "pi pi-home",
    condition: true,
    to: "/jobs",
  },
  {
    label: "Profile",
    icon: "pi pi-home",
    to: authStore.isRecruiter ? "/recruiter" : "/candidate",
    condition: true,
  },
]);

const goToHome = () => {
  router.push({
    name: authStore.isRecruiter ? "RecruiterProfile" : "CandidateProfile",
  });
};
</script>
