<template>
  <div class="profile-container surface-ground min-h-screen pb-6">
    <Toast />

    <RecruiterHeader :readOnly="isReadOnly" :user="currentProfile" />

    <div class="grid w-full max-w-7xl mx-auto px-4 mt-6">
      <div class="col-12 md:col-4 lg:col-3">
        <RecruiterBio
          :readOnly="isReadOnly"
          :profileData="currentProfile?.profile"
        />
      </div>

      <div class="col-12 md:col-8 lg:col-9">
        <JobCreateForm v-if="!isReadOnly" :readOnly="isReadOnly" />

        <div v-if="currentJobs.length === 0" class="text-center text-500 mt-5">
          You have not posted any active jobs at the moment.
        </div>

        <div v-else class="flex flex-column gap-4 mt-4">
          <JobCard
            v-for="job in currentJobs"
            :key="job.id"
            :job="job"
            :isOwner="!isReadOnly"
            :hideProfileLink="true"
            @delete="deleteJob(job.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useJobStore } from "@/stores/jobsStore";
import { useUsersStore } from "@/stores/userStore";

import RecruiterHeader from "@/components/recruiter/RecruiterHeader.vue";
import RecruiterBio from "@/components/recruiter/RecruiterBio.vue";
import JobCard from "@/components/JobCard.vue";
import JobCreateForm from "@/components/recruiter/forms/JobCreateForm.vue";

import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const route = useRoute();
const authStore = useAuthStore();
const usersStore = useUsersStore();
const jobStore = useJobStore();
const toast = useToast();

const error = ref(null);

const isReadOnly = computed(() => {
  if (route.params.id == undefined || route.params.id == authStore.user.uid) {
    return false;
  } else {
    return true;
  }
});

const currentProfile = computed(() => {
  return isReadOnly.value
    ? usersStore.visitedProfile?.user
    : usersStore.myProfile;
});

const currentJobs = computed(() => {
  return isReadOnly.value
    ? usersStore.visitedProfile?.jobs || []
    : jobStore.jobs;
});

const deleteJob = async (jobId) => {
  try {
    await jobStore.removeJob(jobId);

    toast.add({
      severity: "success",
      summary: "Succes",
      detail: "The job was deleted successfully.",
      life: 3000,
    });
  } catch (error) {
    console.error(error);

    toast.add({
      severity: "error",
      summary: "Error",
      detail: "The job could not be deleted. Please try again.",
      life: 3000,
    });
  }
};

const loadData = async () => {
  error.value = null;

  try {
    if (isReadOnly.value) {
      const recruiterId = route.params.id;
      await usersStore.fetchPublicProfile(recruiterId);

      // console.log(usersStore.visitedProfile);
    } else {
      await Promise.all([usersStore.fetchMyProfile(), jobStore.fetchMyJobs()]);

      console.log(jobStore.jobs);
    }
  } catch (e) {
    console.error(e);
    error.value = "Failed to load profile";
  }
};

onMounted(async () => {
  loadData();
});

watch(
  () => route.params.id,
  () => {
    loadData();
  }
);
</script>
