<template>
  <Toast />
  <div class="header-wrapper">
    <div class="relative bg-blue-100 h-16rem border-round-bottom-3xl">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        alt="Cover Image"
        class="object-fit absolute top-0 left-0 w-full h-full bg-center border-round-bottom-3xl"
      />
      <Button
        v-if="!readOnly"
        icon="pi pi-camera"
        rounded
        severity="secondary"
        class="absolute top-0 right-0 w-2rem h-2rem p-0 mb-1 mr-1 shadow-2"
        @click="triggerCoverInput"
      />
      <input
        type="file"
        ref="coverInput"
        class="hidden"
        accept="image/png, image/jpeg, image/jpg"
        @change="handleCoverChange"
      />
    </div>
    <div class="profile-info-overlay flex flex-column align-items-center">
      <div class="relative -mt-6">
        <Avatar
          :image="avatarUrl"
          :icon="avatarUrl ? null : 'pi pi-user'"
          size="xlarge"
          shape="circle"
          class="border-white-alpha-90 border-solid shadow-4 w-8rem h-8rem border-4 -mt-5"
        />
        <Button
          v-if="!readOnly"
          icon="pi pi-camera"
          rounded
          severity="secondary"
          class="absolute bottom-0 right-0 w-2rem h-2rem p-0 mb-1 mr-1 shadow-2"
          @click="triggerAvatarInput"
        />
      </div>
      <input
        type="file"
        ref="avatarInput"
        class="hidden"
        accept="image/png, image/jpeg, image/jpg"
        @change="handleAvatarChange"
      />
    </div>
    <div class="mt-3 text-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from "@/stores/userStore";
import { Avatar, Button, useToast, Toast } from "primevue";
import { ref, computed } from "vue";

const toast = useToast();
const userStore = useUsersStore();
const avatarInput = ref(null);
const coverInput = ref(null);

const props = defineProps({
  user: Object,
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const avatarUrl = computed(() => {
  return props.user?.profile?.avatarUrl || null;
});

const coverUrl = computed(() => {
  return props.user?.profile?.coverUrl || null;
});

const triggerAvatarInput = () => {
  avatarInput.value.click();
};

const triggerCoverInput = () => {
  coverInput.value.click();
};

const processUpload = async (file, type, successMessage) => {
  if (!file) return;

  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Please select a valid image (PNG, JPG).",
      life: 3000,
    });
    return;
  }

  try {
    await userStore.uploadAvatar(file, type);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: successMessage,
      life: 3000,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Upload failed.",
      life: 3000,
    });
  }
};

const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (event.target) event.target.value = "";

  await processUpload(file, "avatar", "Avatar updated successfully!");
};

const handleCoverChange = async (event) => {
  const file = event.target.files[0];
  if (event.target) event.target.value = "";

  await processUpload(file, "cover", "Cover updated successfully!");
};
</script>

<style scoped>
:deep(.p-avatar img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.object-fit {
  object-fit: cover;
}
</style>
