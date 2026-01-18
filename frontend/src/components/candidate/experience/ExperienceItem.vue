<template>
  <div class="relative pl-3 border-left-2 border-300">
    <div class="flex justify-content-between align-items-start">
      <div>
        <div class="font-bold text-900 text-lg">{{ job.title }}</div>
        <div class="text-700 font-medium">{{ job.company }}</div>
      </div>

      <div v-if="!readOnly" class="card flex justify-center">
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

    <div class="text-500 text-sm mt-1">
      {{ job.startDate }} - {{ job.endDate || "Present" }}
    </div>
    <p class="text-600 text-sm mt-2 line-height-3 m-0" v-if="job.description">
      {{ job.description }}
    </p>
  </div>
</template>

<script setup>
import { Button, Menu } from "primevue";
import { ref } from "vue";

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

const props = defineProps({
  job: { type: Object, required: true },
  readOnly: { type: Boolean, default: false },
});

const emit = defineEmits(["delete", "edit"]);
</script>
