<template>
  <Card
    class="shadow-1 border-round-xl mb-3 hover:shadow-3 transition-duration-200"
  >
    <template #title>
      <div class="flex justify-content-between align-items-start">
        <div class="flex flex-column">
          <span class="text-xl font-bold">{{ job.title }}</span>
          <span class="text-sm text-500 font-medium mt-1">
            <i class="pi pi-building mr-1 text-xs"></i>
            {{ job.companySnapshot?.name || "Company" }}
          </span>
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
          :value="job.salary || 'Confidential'"
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
        <span class="text-sm text-500">
          <i class="pi pi-calendar mr-1"></i>
          Posted at {{ formatDate(job.createdAt) }}
        </span>

        <Button
          v-if="isOwner"
          icon="pi pi-trash"
          label="Delete"
          severity="danger"
          text
          size="small"
          @click="$emit('delete', job.id)"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from "primevue/card";
import Tag from "primevue/tag";
import Button from "primevue/button";

const props = defineProps({
  job: Object,
  isApplied: Boolean,
  isOwner: { type: Boolean, default: false },
  hideProfileLink: { type: Boolean, default: false },
});
const emit = defineEmits(["apply", "delete"]);

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp._seconds
    ? new Date(timestamp._seconds * 1000)
    : new Date(timestamp);
  return date.toLocaleDateString("ro-RO", {
    month: "short",
    day: "numeric",
  });
};
</script>
