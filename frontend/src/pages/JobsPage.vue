<template>
  <div class="surface-ground min-h-screen pb-6">
    <div class="grid w-full max-w-7xl mx-auto px-4 pt-5">
      <div class="col-12 md:col-3 hidden md:block">
        <JobFilters :modelValue="currentFilters" @update:modelValue="handleFilterUpdate" />
      </div>

      <Drawer
        v-model:visible="visibleMobileFilters"
        header="Filter Jobs"
        position="left"
        class="w-full md:w-20rem"
      >
        <JobFilters :modelValue="currentFilters" @update:modelValue="handleFilterUpdate" />
      </Drawer>

      <div class="col-12 md:col-9">
        <div class="flex justify-content-between align-items-center mb-3">
          <h1 class="text-2xl font-bold text-900 m-0">
            Jobs
            <span class="text-500 text-lg font-normal">({{ filteredJobs?.length || 0 }})</span>
          </h1>

          <Button icon="pi pi-filter" text class="md:hidden" @click="visibleMobileFilters = true" />
        </div>

        <div v-if="jobStore.isLoading" class="flex flex-column gap-3">
          <Skeleton height="150px" class="border-round-xl" v-for="i in 3" :key="i" />
        </div>

        <div
          v-else-if="filteredJobs?.length === 0"
          class="surface-card p-5 text-center border-round-xl"
        >
          <i class="pi pi-search text-5xl text-400 mb-3"></i>
          <div class="text-900 font-medium text-xl">No jobs found</div>
          <p class="text-600">Try changing your search terms.</p>
        </div>

        <div v-else class="flex flex-column">
          <JobCard
            v-for="job in filteredJobs"
            :key="job.id"
            :job="job"
            :isApplied="jobStore.hasAppliedTo(job.id)"
            :isApplying="applyingJobId === job.id"
            @apply="openApplyDialog"
          />
        </div>
      </div>
    </div>

    <ApplyJobDialog
      v-model:visible="applyDialogVisible"
      :job="selectedJob"
      @application-success="handleApplicationSuccess"
    />
    <Toast />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useJobStore } from "@/stores/jobStore";
import { useJobActions } from "@/composables/useJobActions";

import Skeleton from "primevue/skeleton";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import Toast from "primevue/toast";

import JobCard from "@/components/JobCard.vue";
import JobFilters from "@/components/JobFilters.vue";
import ApplyJobDialog from "@/components/ApplyJobDialog.vue";

const { applyingJobId } = useJobActions();
const jobStore = useJobStore();

const visibleMobileFilters = ref(false);
const applyDialogVisible = ref(false);
const selectedJob = ref(null);
const currentFilters = ref({
  search: "",
  types: [],
});

onMounted(() => {
  jobStore.fetchJobs();
});

const openApplyDialog = (jobId) => {
  const job = jobStore.jobs.find((j) => j.id === jobId);
  if (job) {
    selectedJob.value = job;
    applyDialogVisible.value = true;
  }
};

const filteredJobs = computed(() => {
  let jobs = jobStore.jobs || [];

  if (currentFilters.value.search) {
    const term = currentFilters.value.search.toLowerCase();
    jobs = jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(term) ||
        job.companySnapshot?.name?.toLowerCase().includes(term)
    );
  }

  if (currentFilters.value.types && currentFilters.value.types.length > 0) {
    jobs = jobs.filter((job) => currentFilters.value.types.includes(job.type));
  }

  return jobs;
});

const handleFilterUpdate = (newFilters) => {
  currentFilters.value = newFilters;
};
</script>
