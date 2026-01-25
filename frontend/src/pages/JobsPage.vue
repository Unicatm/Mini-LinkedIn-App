<template>
  <div class="surface-ground min-h-screen pb-6">
    <Toast />
    <div class="pl-5">
      <div class="flex justify-content-between align-items-center mb-3 pt-2">
        <h1 class="text-2xl font-bold text-900">
          Jobs
          <span class="text-500 text-lg font-normal"
            >({{ jobStore.jobs?.length || 0 }})</span
          >
        </h1>
      </div>
      <div class="card flex justify-center gap-6">
        <SelectButton
          v-model="typesOfWork"
          :options="typesOfWorkOptions"
          optionLabel="name"
          multiple
          aria-labelledby="multiple"
          size="small"
        />
      </div>
    </div>
    <div class="grid w-full max-w-7xl mx-auto px-4 pt-5">
      <div class="col-12">
        <div class="grid">
          <div
            class="col-12 md:col-6 p-2"
            v-for="job in jobStore.jobs"
            :key="job.id"
          >
            <JobCard :job="job" class="h-full" @apply="openApplyDialog(job)" />
          </div>
          <div v-if="jobStore.jobs.length === 0" class="col-12 mt-4">
            <div
              class="flex flex-column align-items-center justify-content-center p-6 bg-white border-round-xl shadow-2 text-center"
            >
              <div
                class="border-circle bg-blue-50 inline-flex align-items-center justify-content-center w-5rem h-5rem mb-4"
              >
                <i class="pi pi-search text-blue-500 text-4xl"></i>
              </div>

              <span class="text-900 font-bold text-2xl mb-2"
                >No jobs found</span
              >
              <p class="text-600 m-0 line-height-3">
                There are no jobs matching your selected filters.<br />
                Try selecting different options or clear the filters.
              </p>
            </div>
          </div>
        </div>

        <ApplyDialog v-model:visible="showDialog" :job="selectedJob" />
      </div>

      <div class="col-12">
        <Paginator
          v-if="jobStore.totalJobs > 0"
          :first="first"
          :rows="rows"
          :totalRecords="jobStore.totalJobs"
          :rowsPerPageOptions="[5, 10, 20]"
          @page="onPageChange"
          class="mt-4 border-round-xl shadow-2"
        ></Paginator>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useJobStore } from "@/stores/jobsStore";

import JobCard from "@/components/JobCard.vue";
import ApplyDialog from "@/components/ApplyDialog.vue";

import { SelectButton, Toast, useToast, Paginator } from "primevue";
import { useAuthStore } from "@/stores/authStore";

const toast = useToast();
const authStore = useAuthStore();
const jobStore = useJobStore();

const showDialog = ref(false);
const selectedJob = ref(null);

const first = ref(0);
const rows = ref(10);

const typesOfWork = ref([]);
const typesOfWorkOptions = ref([
  { name: "Hybrid" },
  { name: "On Site" },
  { name: "Remote" },
]);

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

const onPageChange = (event) => {
  first.value = event.first;
  rows.value = event.rows;

  const activeFilters = typesOfWork.value.map((o) => o.value);

  jobStore.fetchJobs(activeFilters, event.page, event.rows);

  window.scrollTo({ top: 0, behavior: "smooth" });
};

watch(typesOfWork, async (newSelection) => {
  const filters = newSelection.map((option) => option.name);
  first.value = 0;
  await jobStore.fetchJobs(filters, 0, rows.value);
});

onMounted(async () => {
  await jobStore.fetchJobs([], 0, rows.value);
  if (authStore.isCandidate) {
    await jobStore.fetchMyApplications();
  }
});
</script>
