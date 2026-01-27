<template>
  <Card
    class="shadow-1 border-round-xl mb-3 hover:shadow-3 transition-duration-200"
  >
    <template #title>
      <div class="flex justify-content-between align-items-start">
        <div class="flex flex-column">
          <Tag
            v-if="!authStore.isRecruiter && hasApplied()"
            value="Applied"
            severity="secondary"
            rounded
            class="w-fit mb-2"
          />
          <span class="text-xl font-bold">{{ job.title }}</span>
          <span class="text-sm text-500 font-medium mt-1">
            <i class="pi pi-building mr-1 text-xs"></i>
            {{ job.companySnapshot?.name || "Company" }}
          </span>
        </div>

        <div v-if="isOwner" class="card flex justify-center">
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            @click="toggle"
            text
            rounded
            severity="secondary"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </div>
      </div>
    </template>

    <template #content>
      <p
        class="m-0 text-700 line-height-3 text-overflow-ellipsis overflow-hidden white-space-nowrap"
        style="max-width: 90%"
      >
        {{ job.description }}
      </p>

      <div class="mt-3 flex gap-2">
        <Tag
          icon="pi pi-wallet"
          severity="info"
          :value="job.salary ? `${job.salary} EUR` : 'Confidential'"
          rounded
          class="bg-blue-600"
        />
        <Tag :value="job.type" severity="primary" rounded />
      </div>
    </template>

    <template #footer>
      <div
        class="flex justify-content-between align-items-center border-top-1 border-200 pt-3"
      >
        <div class="flex justify-content-between align-items-center pt-3">
          <span class="text-sm text-500">
            <i class="pi pi-calendar mr-1"></i>
            Posted at {{ formatDate(job.createdAt) }}
          </span>
        </div>
        <div class="flex gap-2">
          <Button
            v-if="authStore.isCandidate"
            label="Apply"
            icon="pi pi-send"
            outlined
            rounded
            size="small"
            @click="$emit('apply', job.id)"
          />
          <Button
            v-if="isOwner && isMyJob"
            label="Applications"
            outlined
            rounded
            size="small"
            @click="goToApplications(job.id)"
          />
          <Button
            v-if="!isOwner && !isMyJob"
            label="Recruiter's Page"
            variant="text"
            rounded
            size="small"
            @click="goToRecruitersPage(job.recruiterId)"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/authStore";
import { formatDate } from "@/utils/formateDate";

import { Menu, Button, Tag, Card } from "primevue";
import { useJobStore } from "@/stores/jobsStore";

const props = defineProps({
  job: Object,
  isApplied: Boolean,
  isOwner: { type: Boolean, default: false },
});
const emit = defineEmits(["apply", "delete", "edit"]);

const router = useRouter();
const authStore = useAuthStore();
const isMyJob = props.job.recruiterId == authStore.user.uid;
const jobStore = useJobStore();

const menu = ref();
const items = ref([
  {
    items: [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          emit("edit", props.job);
        },
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => {
          emit("delete", props.job.id);
        },
      },
    ],
  },
]);
const toggle = (event) => {
  menu.value.toggle(event);
};

const goToApplications = (jobId) => {
  router.push({
    name: "ApplicationsPage",
    params: { id: jobId },
  });
};

const goToRecruitersPage = (recruiterId) => {
  router.push({
    name: "PublicRecruiterProfile",
    params: { id: recruiterId },
  });
};

const hasApplied = () => {
  return jobStore.applicationsIds.includes(props.job.id) ? true : false;
};
</script>
