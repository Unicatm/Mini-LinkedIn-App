<template>
  <div class="surface-ground min-h-screen pb-6 pt-5">
    <div class="max-w-7xl mx-auto px-4">
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-900 m-0">Applications for Job</h1>
        <span class="text-500">Manage candidates for this position.</span>
      </div>

      <div
        v-if="jobDetails"
        class="surface-card p-4 border-round-xl shadow-1 mb-4 flex align-items-center gap-4"
      >
        <div>
          <div class="text-xl font-bold text-900">{{ jobDetails.title }}</div>
          <div class="text-500 text-sm mt-1">
            <i class="pi pi-map-marker mr-1"></i> {{ jobDetails.type }}
            <span class="mx-2">|</span>
            <i class="pi pi-wallet mr-1"></i>
            {{ jobDetails.salary || "Confidential" }}
          </div>
        </div>
      </div>

      <div v-if="jobStore.isLoading" class="flex justify-content-center">
        <i class="pi pi-spin pi-spinner text-4xl"></i>
      </div>

      <div
        v-else-if="applications?.length === 0"
        class="surface-card p-5 text-center border-round-xl shadow-1"
      >
        <i class="pi pi-users text-5xl text-400 mb-3"></i>
        <div class="text-xl font-medium text-900">No applications yet</div>
        <p class="text-600">Wait for candidates to discover your job.</p>
      </div>

      <div v-else class="surface-card p-4 border-round-xl shadow-1">
        <DataTable
          :value="applications"
          responsiveLayout="scroll"
          paginator
          :rows="10"
        >
          <Column header="Candidate">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <Avatar
                  icon="pi pi-user"
                  shape="circle"
                  class="bg-blue-100 text-blue-600"
                />
                <div class="flex flex-column">
                  <span class="font-medium text-900">{{
                    data.candidateSnapshot?.name
                  }}</span>
                  <span class="text-sm text-500">{{
                    data.candidateSnapshot?.email
                  }}</span>
                </div>
              </div>
            </template>
          </Column>

          <Column header="Applied Date">
            <template #body="{ data }">
              {{ formatDate(data.appliedAt) }}
            </template>
          </Column>

          <Column header="Status">
            <template #body="{ data }">
              <Tag
                :value="data.status"
                :severity="getStatusSeverity(data.status)"
              />
            </template>
          </Column>

          <Column header="Actions" alignFrozen="right" frozen>
            <template #body="{ data }">
              <Button
                label="View Profile"
                icon="pi pi-external-link"
                size="small"
                text
                @click="viewCandidateProfile(data.candidateId)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useJobStore } from "@/stores/jobsStore";
import { formatDate } from "@/utils/formateDate";

import { DataTable, Column, Avatar, Tag, Button } from "primevue";

const router = useRouter();
const route = useRoute();
const jobStore = new useJobStore();

const jobDetails = ref(null);
const applications = ref(null);

const viewCandidateProfile = (candidateId) => {
  router.push({
    name: "PublicCandiateProfile",
    params: { id: candidateId },
  });
};

const getStatusSeverity = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "info";
  }
};

onMounted(async () => {
  const jobId = route.params.id;

  jobDetails.value = await jobStore.fetchJobById(jobId);
  applications.value = await jobStore.fetchApplicationsForJob(jobId);
});
</script>
