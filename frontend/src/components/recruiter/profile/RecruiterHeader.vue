<template>
  <div class="header-wrapper">
    <div class="bg-blue-100 h-16rem border-round-bottom-3xl"></div>
    <div class="profile-info-overlay flex flex-column align-items-center">
      <Avatar
        icon="pi pi-user"
        size="xlarge"
        shape="circle"
        class="profile-avatar shadow-4 w-8rem h-8rem border-4 -mt-5"
      />
      <h1 class="text-900 font-bold mb-1 mt-3">{{ user?.profile?.fullName || "Anonim" }}</h1>
      <span class="text-500 font-medium"
        >Recruiter at {{ user?.profile?.companyName || "Company" }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import Avatar from "primevue/avatar";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<style scoped>
.profile-avatar {
  border: 4px solid white;
}
</style>
