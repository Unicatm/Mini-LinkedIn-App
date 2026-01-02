<template>
  <div>
    <div v-if="isLoading" class="flex justify-content-center mt-4">
      <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
    </div>

    <div v-else-if="jobs.length === 0" class="text-center text-500 mt-5">
      You have not posted any active jobs at the moment.
    </div>

    <div v-else class="flex flex-column gap-4 mt-4">
      <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />

      <JobCard
        v-for="job in jobs"
        :key="job.id"
        :job="job"
        :isOwner="!isReadOnly"
        :hideProfileLink="true"
        @apply="$emit('apply', job.id)"
        @toggle-menu="toggleMenu($event, job)"
      />
    </div>

    <JobEditForm v-model:visible="showEditDialog" :job="selectedJob" @saved="onJobSaved" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useJobStore } from "@/stores/jobStore";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import JobCard from "@/components/JobCard.vue";
import JobEditForm from "@/components/recruiter/JobEditForm.vue";
import Menu from "primevue/menu";

const props = defineProps({
  jobs: { type: Array, default: () => [] },
  isLoading: Boolean,
  isReadOnly: Boolean,
});

const emit = defineEmits(["apply"]);

const jobStore = useJobStore();
const confirm = useConfirm();
const toast = useToast();

const menu = ref();
const selectedJob = ref(null);
const showEditDialog = ref(false);

const menuItems = ref([
  {
    label: "Edit",
    icon: "pi pi-pencil",
    command: () => {
      showEditDialog.value = true;
    },
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    class: "text-red-500",
    command: () => {
      if (selectedJob.value) confirmDelete(selectedJob.value.id);
    },
  },
]);

const toggleMenu = (event, job) => {
  selectedJob.value = job;
  menu.value.toggle(event);
};

const onJobSaved = () => {
  console.log("Job saved.");
};

const confirmDelete = (jobId) => {
  confirm.require({
    message: "Are you sure you want to delete this job? The action is irreversible.",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await jobStore.removeJob(jobId);
        toast.add({ severity: "success", summary: "Success", detail: "Job deleted.", life: 3000 });
      } catch (error) {
        toast.add({ severity: "error", summary: "Error", detail: "Could not delete.", life: 3000 });
      }
    },
  });
};
</script>
