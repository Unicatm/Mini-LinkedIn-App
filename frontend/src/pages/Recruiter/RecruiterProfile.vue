<template>
  <div class="profile-container surface-ground min-h-screen pb-6">
    <Toast />
    <ConfirmPopup />

    <RecruiterHeader />

    <div class="grid w-full max-w-7xl mx-auto px-4 mt-6">
      <div class="col-12 md:col-4 lg:col-3">
        <RecruiterBio />
      </div>

      <div class="col-12 md:col-8 lg:col-9">
        <JobCreateForm />

        <div v-if="jobStore.isLoading" class="flex justify-content-center mt-4">
          <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
        </div>

        <div v-else-if="jobStore.activeJobs.length === 0" class="text-center text-500 mt-5">
          You have not posted any active jobs at the moment.
        </div>

        <div v-else class="flex flex-column gap-4 mt-4">
          <Card v-for="job in jobStore.activeJobs" :key="job.id" class="shadow-1 border-round-xl">
            <template #title>
              <div class="flex justify-content-between align-items-start">
                <span class="text-xl font-bold">{{ job.title }}</span>
                <Tag :value="job.type" severity="success" rounded />
              </div>
            </template>

            <template #content>
              <p class="m-0 text-700 line-height-3">{{ job.description }}</p>
              <div class="mt-3 flex gap-2">
                <Tag
                  icon="pi pi-wallet"
                  severity="info"
                  :value="job.salary || 'Confidential'"
                  rounded
                  class="bg-blue-600"
                />
              </div>
            </template>

            <template #footer>
              <div
                class="flex justify-content-between align-items-center border-top-1 border-200 pt-3"
              >
                <span class="text-sm text-500">
                  <i class="pi pi-calendar mr-1"></i>
                  Posted at {{ formatDate(job.createdAt) }}
                </span>

                <Button
                  icon="pi pi-trash"
                  label="Delete"
                  severity="danger"
                  text
                  size="small"
                  @click="confirmDelete($event, job.id)"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUsersStore } from "@/stores/usersStore";
import { useJobStore } from "@/stores/jobStore";

import JobCreateForm from "@/components/recruiter/JobCreateForm.vue";
import RecruiterBio from "@/components/recruiter/profile/RecruiterBio.vue";
import RecruiterHeader from "@/components/recruiter/profile/RecruiterHeader.vue";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";
import Card from "primevue/card";
import Button from "primevue/button";
import Tag from "primevue/tag";

const usersStore = useUsersStore();
const jobStore = useJobStore();
const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
  await usersStore.fetchMyProfile();
  await jobStore.fetchMyJobs();
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
