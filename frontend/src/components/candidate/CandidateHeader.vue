<template>
  <UserHeader :user="user" :readOnly="readOnly">
    <h1 class="text-900 font-bold mb-1 mt-3">
      {{ user?.profile?.fullName || "Candidate" }}
    </h1>

    <span class="text-600 font-medium flex align-items-center gap-2">
      <i class="pi pi-briefcase"></i>
      {{ user?.profile?.title || "Open to Work" }}
    </span>

    <div class="mt-3">
      <a
        v-if="user?.profile?.cvUrl"
        :href="user.profile.cvUrl"
        target="_blank"
        class="no-underline"
      >
        <Button label="Download CV" icon="pi pi-download" size="small" rounded outlined />
      </a>
    </div>
  </UserHeader>
</template>

<script setup>
import UserHeader from "@/components/UserHeader.vue";
import Button from "primevue/button";

const props = defineProps({
  user: Object,
  readOnly: Boolean,
});
</script>
