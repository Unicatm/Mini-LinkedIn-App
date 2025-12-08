<template>
  <Card class="shadow-1 border-round-xl sticky top-0">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <span>Introduction</span>
        <Button
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
        <p v-if="profileData.bio" class="text-500 line-height-3 mb-4">
          {{ profileData.bio }}
        </p>
        <p v-else class="text-500 font-italic mb-4">You haven't added a description yet.</p>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-briefcase text-blue-600 mr-2"></i>
          <span class="text-700 font-medium">{{ myProfile?.profile?.companyName }}</span>
        </div>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-globe text-blue-600 mr-2"></i>
          <span v-if="profileData.website" class="text-700 text-sm">{{ profileData.website }}</span>
          <span v-else class="text-400 text-sm">Add website</span>
        </div>

        <div class="flex align-items-center">
          <i class="pi pi-map-marker text-blue-600 mr-2"></i>
          <span v-if="profileData.location" class="text-700 text-sm">{{
            profileData.location
          }}</span>
          <span v-else class="text-400 text-sm">Add location</span>
        </div>
      </div>

      <div v-else class="flex flex-column gap-3">
        <span class="p-float-label mt-3">
          <label>About you</label>
          <Textarea v-model="formData.bio" rows="4" class="w-full" autoResize />
        </span>
        <span class="p-float-label">
          <label>Website</label>
          <InputText v-model="formData.website" class="w-full" />
        </span>
        <span class="p-float-label">
          <label>Location</label>
          <InputText v-model="formData.location" class="w-full" />
        </span>
        <Button
          label="Salvează"
          size="small"
          @click="saveProfile"
          :loading="usersStore.isLoading"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useUsersStore } from "@/stores/usersStore";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

const usersStore = useUsersStore();
const myProfile = computed(() => usersStore.myProfile);

const profileData = computed(() => ({
  bio: myProfile.value?.profile?.bio || "",
  website: myProfile.value?.profile?.website || "",
  location: myProfile.value?.profile?.location || "",
}));

const isEditing = ref(false);
const formData = reactive({ bio: "", website: "", location: "" });

const toggleEdit = () => {
  if (!isEditing.value) {
    formData.bio = profileData.value.bio;
    formData.website = profileData.value.website;
    formData.location = profileData.value.location;
  }
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
  await usersStore.updateMyProfile(formData);
  isEditing.value = false;
};
</script>
