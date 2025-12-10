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

        <div v-if="jobStore.isLoading" class="flex justify-content-center mt-4">
          <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
        </div>

        <div v-else-if="currentJobs.length === 0" class="text-center text-500 mt-5">
          You have not posted any active jobs at the moment.
        </div>

        <div v-else class="flex flex-column gap-4 mt-4">
          <JobCard
            v-for="job in currentJobs"
            :key="job.id"
            :job="job"
            :isOwner="!isReadOnly"
            :hideProfileLink="true"
            @apply="handleApply"
            @delete="confirmDelete($event, job.id)"
          />
        </div>
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

import JobCreateForm from "@/components/recruiter/JobCreateForm.vue";
import RecruiterBio from "@/components/recruiter/profile/RecruiterBio.vue";
import RecruiterHeader from "@/components/recruiter/profile/RecruiterHeader.vue";
import JobCard from "@/components/JobCard.vue";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

const route = useRoute();
const usersStore = useUsersStore();
const jobStore = useJobStore();
const authStore = useAuthStore();
const confirm = useConfirm();
const toast = useToast();

const isLoading = ref(true);
const error = ref(null);

const isReadOnly = computed(() => {
  if (route.params.id == undefined || route.params.id == authStore.user.uid) {
    return false;
  } else {
    return true;
  }
});

const confirmDelete = (event, jobId) => {
  confirm.require({
    target: event.currentTarget,
    message: "Are you sure you want to delete this job? The action is irreversible.",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger p-button-sm",
    rejectClass: "p-button-secondary p-button-text p-button-sm",
    acceptLabel: "Delete",
    rejectLabel: "Cancel",
    accept: async () => {
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
    },
    reject: () => {},
  });
};

const currentProfile = computed(() => {
  return isReadOnly.value ? usersStore.visitedProfile?.user : usersStore.myProfile;
});

const currentJobs = computed(() => {
  return isReadOnly.value ? usersStore.visitedProfile?.jobs || [] : jobStore.activeJobs;
});

const loadData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    if (isReadOnly.value) {
      const recruiterId = route.params.id;
      await usersStore.fetchPublicProfile(recruiterId);

      if (authStore.isCandidate) {
        await jobStore.fetchMyApplications();
      }

      // console.log(usersStore.visitedProfile);
    } else {
      await Promise.all([usersStore.fetchMyProfile(), jobStore.fetchMyJobs()]);
      // console.log(usersStore.myProfile);
    }
  } catch (e) {
    console.error(e);
    error.value = "Failed to load profile";
  } finally {
    isLoading.value = false;
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

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp);
  return date.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>
