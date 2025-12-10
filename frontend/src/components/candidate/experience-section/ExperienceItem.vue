<template>
  <div class="relative pl-3 border-left-2 border-300">
    <div class="flex justify-content-between align-items-start">
      <div>
        <div class="font-bold text-900 text-lg">{{ job.title }}</div>
        <div class="text-700 font-medium">{{ job.company }}</div>
      </div>

      <div v-if="!readOnly">
        <Button
          icon="pi pi-ellipsis-v"
          text
          rounded
          size="small"
          @click="$emit('toggle-menu', $event)"
          aria-haspopup="true"
        />
      </div>
    </div>

    <div class="text-500 text-sm mt-1">{{ job.startDate }} - {{ job.endDate || "Present" }}</div>
    <p class="text-600 text-sm mt-2 line-height-3 m-0" v-if="job.description">
      {{ job.description }}
    </p>
  </div>
</template>

<script setup>
import Button from "primevue/button";

const props = defineProps({
  job: { type: Object, required: true },
  readOnly: { type: Boolean, default: false },
});

const emit = defineEmits(["toggle-menu"]);
</script>
