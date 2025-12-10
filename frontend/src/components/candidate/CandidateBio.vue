<template>
  <Card class="shadow-1 border-round-xl lg:sticky lg:top-0">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <span>About Me</span>

        <Button
          v-if="!readOnly"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"
          text
          rounded
          @click="toggleEdit"
        />
      </div>
    </template>

    <template #content>
      <div v-if="!isEditing">
        <p v-if="displayedProfile.bio" class="text-500 line-height-3 mb-4">
          {{ displayedProfile.bio }}
        </p>
        <p v-else class="text-500 font-italic mb-4">
          {{ readOnly ? "No description provided." : "Tell recruiters about yourself..." }}
        </p>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-briefcase text-primary mr-2"></i>
          <span v-if="displayedProfile.title" class="text-700 font-medium">
            {{ displayedProfile.title }}
          </span>
          <span v-else class="text-400 text-sm">
            {{ readOnly ? "No title provided" : "Add current title" }}
          </span>
        </div>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-book text-primary mr-2"></i>
          <span v-if="displayedProfile.education" class="text-700 font-medium">
            {{ displayedProfile.education }}
          </span>
          <span v-else class="text-400 text-sm">
            {{ readOnly ? "No education provided" : "Add education" }}
          </span>
        </div>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-globe text-primary mr-2"></i>
          <a
            v-if="displayedProfile.website"
            :href="displayedProfile.website"
            target="_blank"
            class="text-blue-600 no-underline hover:underline"
          >
            Portfolio / GitHub
          </a>
          <span v-else class="text-400 text-sm">
            {{ readOnly ? "No portofolio provided" : "Add portfolio link" }}
          </span>
        </div>
      </div>

      <div v-else class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label class="text-sm font-medium text-700">Bio / Summary</label>
          <Textarea v-model="formData.bio" rows="4" autoResize class="w-full" />
        </div>

        <div class="flex flex-column gap-2">
          <label class="text-sm font-medium text-700">Current Title</label>
          <InputText v-model="formData.title" placeholder="ex: Junior Java Dev" class="w-full" />
        </div>

        <div class="flex flex-column gap-2">
          <label class="text-sm font-medium text-700">Education</label>
          <InputText
            v-model="formData.education"
            placeholder="ex: UPB, Computer Science"
            class="w-full"
          />
        </div>

        <div class="flex flex-column gap-2">
          <label class="text-sm font-medium text-700">Portfolio / GitHub URL</label>
          <InputText v-model="formData.website" class="w-full" />
        </div>

        <div class="flex gap-2 justify-content-end mt-2">
          <Button
            label="Cancel"
            text
            size="small"
            severity="secondary"
            @click="isEditing = false"
          />
          <Button label="Save" size="small" @click="saveProfile" :loading="usersStore.isLoading" />
        </div>
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

const props = defineProps({
  profileData: { type: Object, default: () => ({}) },
  readOnly: { type: Boolean, default: false },
});

const usersStore = useUsersStore();

const displayedProfile = computed(() => {
  if (props.readOnly) {
    const data = props.profileData || {};
    return {
      bio: data.bio || "",
      title: data.title || "",
      education: data.education || "",
      website: data.website || "",
      location: data.location || "",
    };
  }

  const storeProfile = usersStore.myProfile?.profile || {};
  return {
    bio: storeProfile.bio || "",
    title: storeProfile.title || "",
    education: storeProfile.education || "",
    website: storeProfile.website || "",
    location: storeProfile.location || "",
  };
});

const isEditing = ref(false);
const formData = reactive({ bio: "", title: "", education: "", website: "", location: "" });

const toggleEdit = () => {
  if (props.readOnly) return;

  if (!isEditing.value) {
    formData.bio = displayedProfile.value.bio;
    formData.title = displayedProfile.value.title;
    formData.education = displayedProfile.value.education;
    formData.website = displayedProfile.value.website;
    formData.location = displayedProfile.value.location;
  }
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
  await usersStore.updateMyProfile({ ...formData });
  isEditing.value = false;
};
</script>
