<template>
  <div class="surface-ground min-h-screen pb-6">
    <Toast />
    <div class="grid w-full max-w-7xl mx-auto px-4 pt-5">
      <div class="col-12 md:col-9">
        <div class="flex justify-content-between align-items-center mb-3">
          <h1 class="text-2xl font-bold text-900 m-0">
            Jobs
            <span class="text-500 text-lg font-normal"
              >({{ jobStore.jobs?.length || 0 }})</span
            >
          </h1>
        </div>

        <div class="flex flex-column">
          <JobCard
            v-for="job in jobStore.jobs"
            :key="job.id"
            :job="job"
            @apply="openApplyDialog(job)"
          />
          <ApplyDialog v-model:visible="showDialog" :job="selectedJob" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useJobStore } from "@/stores/jobsStore";

import JobCard from "@/components/JobCard.vue";

import { Toast, useToast } from "primevue";
import { useAuthStore } from "@/stores/authStore";
import ApplyDialog from "@/components/ApplyDialog.vue";

const toast = useToast();
const authStore = useAuthStore();
const jobStore = useJobStore();

const showDialog = ref(false);
const selectedJob = ref(null);

const applyToJob = async (jobId) => {
  try {
    await jobStore.applyToJob(jobId);

    toast.add({
      severity: "success",
      summary: "Succes!",
      detail: "Applied with succes!",
      life: 3000,
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error!",
      detail: "You already applied to this job.",
      life: 3000,
    });
  }
};

const openApplyDialog = (job) => {
  if (jobStore.applicationsIds.includes(job.id)) {
    toast.add({
      severity: "error",
      summary: "Error!",
      detail: "You already applied to this job.",
      life: 3000,
    });

    showDialog.value = false;
  } else {
    showDialog.value = true;
    selectedJob.value = job;
  }
};

onMounted(async () => {
  await jobStore.fetchJobs();
  if (authStore.isCandidate) {
    await jobStore.fetchMyApplications();
  }
});
</script>
