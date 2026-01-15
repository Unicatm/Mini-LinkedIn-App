<template>
  <div class="surface-ground min-h-screen pb-6">
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
          <JobCard v-for="job in jobStore.jobs" :key="job.id" :job="job" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useJobStore } from "@/stores/jobsStore";

import JobCard from "@/components/JobCard.vue";

const jobStore = useJobStore();

onMounted(() => {
  jobStore.fetchJobs();
});
</script>
