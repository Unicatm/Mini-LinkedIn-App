<template>
  <UserHeader :user="user" :readOnly="readOnly">
    <h1 class="text-900 font-bold mb-1 mt-3">
      {{ user?.profile?.fullName || "Anonim" }}
    </h1>

    <span class="text-500 font-medium">
      Recruiter la
      <span class="text-primary font-bold">{{
        user?.profile?.companyName || "Fără Companie"
      }}</span>
    </span>
  </UserHeader>
</template>

<script setup>
import UserHeader from "@/components/UserHeader.vue";

const props = defineProps({
  user: Object,
  stats: Object,
  readOnly: Boolean,
});
</script>
