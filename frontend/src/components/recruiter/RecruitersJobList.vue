<template>
  <div>
    <div v-if="jobs.length === 0" class="text-center text-500 mt-5">
      You have not posted any active jobs at the moment.
    </div>

    <div v-else class="flex flex-column gap-4">
      <JobCard
        v-for="job in jobs"
        :job="job"
        :key="job.id"
        :isOwner="!isReadonly"
        @delete="deleteJob"
        @edit="openDialog"
      />
    </div>

    <JobEditForm v-model:visible="showEditDialog" :job="selectedJob" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useJobStore } from "@/stores/jobsStore";

import JobCard from "@/components/JobCard.vue";
import JobEditForm from "./forms/JobEditForm.vue";

const props = defineProps({
  jobs: Array,
  isReadonly: Boolean,
});

const jobStore = useJobStore();
const toast = useToast();

const showEditDialog = ref(false);
const selectedJob = ref(null);

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

const openDialog = (job) => {
  showEditDialog.value = true;
  selectedJob.value = job;
};
</script>
