<template>
  <Card class="shadow-1 border-round-xl sticky top-0">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <span>Introduction</span>
        <Button
          v-if="!readOnly"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"
          text
          rounded
          @click="toggleEdit"
          class="text-blue-600 hover:bg-blue-50"
        />
      </div>
    </template>

    <template #content>
      <div v-if="!isEditing">
        <div>
          <p v-if="profileData.bio" class="text-500 line-height-3 mb-4">
            {{ profileData.bio }}
          </p>
          <p v-else class="text-500 font-italic mb-4">
            {{
              readOnly
                ? "No description provided."
                : "You haven't added a description yet."
            }}
          </p>
        </div>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-briefcase text-blue-600 mr-2"></i>
          <span v-if="profileData.companyName" class="text-700 font-medium">
            {{ profileData.companyName }}
          </span>
          <span v-else class="text-400 text-sm">
            {{ readOnly ? "No company" : "Add company" }}
          </span>
        </div>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-globe text-blue-600 mr-2"></i>
          <span v-if="profileData.website" class="text-700 text-sm">
            {{ profileData.website }}
          </span>
          <span v-else class="text-400 text-sm">
            {{ readOnly ? "No website" : "Add website" }}
          </span>
        </div>

        <div class="flex align-items-center">
          <i class="pi pi-map-marker text-blue-600 mr-2"></i>
          <span v-if="profileData.location" class="text-700 text-sm">
            {{ profileData.location }}
          </span>
          <span v-else class="text-400 text-sm">
            {{ readOnly ? "No location" : "Add location" }}
          </span>
        </div>
      </div>

      <div v-else class="flex flex-column gap-2">
        <span class="p-float-label">
          <label>About you</label>
          <Textarea v-model="formData.bio" rows="4" class="w-full" autoResize />
        </span>
        <span class="p-float-label">
          <label>Company</label>
          <InputText v-model="formData.companyName" class="w-full" />
        </span>
        <span class="p-float-label">
          <label>Website</label>
          <InputText v-model="formData.website" class="w-full" />
        </span>
        <span class="p-float-label">
          <label>Location</label>
          <InputText v-model="formData.location" class="w-full" />
        </span>
        <div class="flex gap-2 justify-content-end">
          <Button
            label="Cancel"
            text
            size="small"
            severity="secondary"
            @click="isEditing = false"
          />
          <Button label="Save" size="small" @click="saveProfile" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";
import { useUsersStore } from "@/stores/userStore";

import { Card, Button, InputText, Textarea } from "primevue";

const props = defineProps({
  profileData: {
    type: Object,
    default: () => ({}),
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const usersStore = useUsersStore();

const isEditing = ref(false);
const formData = ref({
  bio: "",
  website: "",
  location: "",
  companyName: "",
});

const toggleEdit = () => {
  if (props.readOnly) return;

  if (!isEditing.value) {
    formData.value = {
      bio: props.profileData.bio,
      companyName: props.profileData.companyName,
      website: props.profileData.website,
      location: props.profileData.location,
    };
  } else {
    saveProfile();
  }
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
  await usersStore.updateMyProfile({ ...formData.value });
  isEditing.value = false;
};
</script>
