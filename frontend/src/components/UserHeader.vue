<template>
  <div class="header-wrapper relative group-header">
    <div
      class="h-16rem border-round-bottom-3xl relative bg-cover bg-center transition-all transition-duration-300"
      :class="{ 'bg-blue-100': !coverImage }"
      :style="coverStyle"
    >
      <div v-if="!readOnly" class="absolute top-0 right-0 p-3">
        <Button
          icon="pi pi-camera"
          rounded
          severity="secondary"
          aria-label="Change Cover"
          @click="triggerUpload('cover')"
          :loading="loadingType === 'cover'"
          class="shadow-2 bg-white-alpha-80 hover:bg-white text-900 border-none"
        />
      </div>
    </div>

    <input
      type="file"
      ref="coverInput"
      hidden
      accept="image/*"
      @change="(e) => onFileSelect(e, 'cover')"
    />
    <input
      type="file"
      ref="avatarInput"
      hidden
      accept="image/*"
      @change="(e) => onFileSelect(e, 'avatar')"
    />

    <div class="profile-info-overlay flex flex-column align-items-center -mt-6 relative">
      <div class="relative">
        <div
          class="w-10rem h-10rem border-circle shadow-4 bg-cover bg-center"
          :style="avatarStyle"
          v-if="avatarStyle"
        ></div>
        <Avatar
          v-else
          icon="pi pi-user"
          size="xlarge"
          shape="circle"
          class="profile-avatar shadow-4 w-10rem h-10rem surface-card align-items-center justify-content-center"
          style="object-fit: cover"
        />

        <div v-if="!readOnly" class="absolute bottom-0 right-0">
          <Button
            icon="pi pi-pencil"
            rounded
            severity="info"
            size="small"
            @click="triggerUpload('avatar')"
            :loading="loadingType === 'avatar'"
            class="shadow-2 border-2 border-white"
          />
        </div>
      </div>

      <div class="mt-3 text-center">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/usersStore";

import { useToast } from "primevue/usetoast";
import Avatar from "primevue/avatar";
import Button from "primevue/button";

const props = defineProps({
  user: Object,
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const usersStore = useUsersStore();
const toast = useToast();

const avatarInput = ref(null);
const coverInput = ref(null);

const loadingType = ref(null);

const avatarImage = computed(() => props.user?.profile?.avatarUrl || null);
const coverImage = computed(() => props.user?.profile?.coverUrl || null);

const coverStyle = computed(() => {
  if (coverImage.value) {
    return { backgroundImage: `url(${coverImage.value})` };
  }
  return {};
});

const avatarStyle = computed(() => {
  if (avatarImage.value) {
    return { backgroundImage: `url(${avatarImage.value})` };
  }
  return null;
});

const triggerUpload = (type) => {
  if (type === "avatar") avatarInput.value.click();
  else if (type === "cover") coverInput.value.click();
};

const onFileSelect = async (event, type) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Please select an image file.",
      life: 3000,
    });
    return;
  }

  loadingType.value = type;

  try {
    await usersStore.uploadFile(file, type);

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Image updated successfully!",
      life: 3000,
    });
  } catch (error) {
    console.error(error);
    toast.add({ severity: "error", summary: "Error", detail: "Upload failed.", life: 3000 });
  } finally {
    loadingType.value = null;
    event.target.value = null;
  }
};
</script>
