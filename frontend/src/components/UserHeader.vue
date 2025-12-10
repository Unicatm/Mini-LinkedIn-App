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
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import Avatar from "primevue/avatar";

const props = defineProps({
  user: Object,
  readOnly: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.profile-avatar {
  border: 4px solid white;
}
</style>
