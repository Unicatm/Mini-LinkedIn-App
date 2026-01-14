<template>
  <div>{{ authStore.user.profile?.fullName }}</div>
  <div>{{ authStore.user?.role }}</div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
</script>
