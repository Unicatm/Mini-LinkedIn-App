<template>
  <div class="profile-container surface-ground min-h-screen pb-6">
    <Toast />
    <ConfirmPopup />

    <RecruiterHeader :readOnly="isReadOnly" :user="currentProfile" />

    <div class="grid w-full max-w-7xl mx-auto px-4 mt-6">
      <div class="col-12 md:col-4 lg:col-3">
        <RecruiterBio :readOnly="isReadOnly" :profileData="currentProfile?.profile" />
      </div>

      <div class="col-12 md:col-8 lg:col-9">
        <JobCreateForm :readOnly="isReadOnly" />

        <RecruiterJobList
          :jobs="currentJobs"
          :isLoading="jobStore.isLoading"
          :isReadOnly="isReadOnly"
          @apply="handleApply"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useUsersStore } from "@/stores/usersStore";
import { useJobStore } from "@/stores/jobStore";
import { useAuthStore } from "@/stores/authStore";
import { useJobActions } from "@/composables/useJobActions";

import JobCreateForm from "@/components/recruiter/JobCreateForm.vue";
import RecruiterBio from "@/components/recruiter/profile/RecruiterBio.vue";
import RecruiterHeader from "@/components/recruiter/profile/RecruiterHeader.vue";
import RecruiterJobList from "@/components/recruiter/profile/RecruiterJobList.vue";

import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

const route = useRoute();
const usersStore = useUsersStore();
const jobStore = useJobStore();
const authStore = useAuthStore();
const { handleApply } = useJobActions();

const isLoading = ref(true);

const isReadOnly = computed(() => {
  if (route.params.id == undefined || route.params.id == authStore.user.uid) {
    return false;
  }
  return true;
});

const currentProfile = computed(() => {
  return isReadOnly.value ? usersStore.visitedProfile?.user : usersStore.myProfile;
});

const currentJobs = computed(() => {
  return isReadOnly.value ? usersStore.visitedProfile?.jobs || [] : jobStore.activeJobs;
});

const loadData = async () => {
  isLoading.value = true;
  try {
    if (isReadOnly.value) {
      await usersStore.fetchPublicProfile(route.params.id);
      if (authStore.isCandidate) {
        await jobStore.fetchMyApplications();
      }
    } else {
      await Promise.all([usersStore.fetchMyProfile(), jobStore.fetchMyJobs()]);
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadData);
watch(() => route.params.id, loadData);
</script>
