<template>
  <div class="surface-ground min-h-screen pb-6">
    <div>
      <div class="w-full max-w-7xl mx-auto px-4">
        <CandidateHeader :user="currentUser" :readOnly="isReadOnly" />
      </div>

      <div class="grid w-full max-w-7xl mx-auto px-4 mt-4">
        <div class="col-12 md:col-4">
          <div class="flex flex-column gap-4 pt-1rem">
            <CandidateBio
              :profileData="currentUser?.profile"
              :readOnly="isReadOnly"
            />
          </div>
        </div>

        <div class="col-12 md:col-8">
          <ExperienceSection
            :experience="currentUser?.profile?.experience"
            :readOnly="isReadOnly"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUsersStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from "vue-router";

import CandidateHeader from "@/components/candidate/CandidateHeader.vue";
import CandidateBio from "@/components/candidate/CandidateBio.vue";
import ExperienceSection from "@/components/candidate/experience/ExperienceSection.vue";

const route = useRoute();
const authStore = useAuthStore();
const usersStore = useUsersStore();

const isReadOnly = computed(() => {
  return route.params.id && route.params.id !== authStore.user?.uid;
});

const currentUser = computed(() => {
  return isReadOnly.value
    ? usersStore.visitedProfile?.user
    : usersStore.myProfile;
});

onMounted(async () => {
  try {
    if (isReadOnly.value) {
      await usersStore.fetchPublicProfile(route.params.id);
    } else {
      await usersStore.fetchMyProfile();
    }
  } catch (error) {
    console.error(e);
  }
});
</script>
