<template>
  <div class="surface-card p-4 shadow-1 border-round-xl h-full">
    <div class="text-900 font-bold text-xl mb-4">Filter</div>

    <span class="p-input-icon-left w-full mb-4">
      <InputText
        v-model="filters.search"
        placeholder="Search for job, skill..."
        class="w-full mb-4"
        @input="emitUpdate"
      />
    </span>

    <div class="mb-4">
      <div class="font-medium text-700 mb-2">Job Type</div>
      <div class="flex flex-column gap-2">
        <div v-for="type in jobTypes" :key="type" class="flex align-items-center">
          <Checkbox
            v-model="filters.types"
            :inputId="type"
            :name="type"
            :value="type"
            @change="$emit('update:modelValue', filters)"
          />
          <label :for="type" class="ml-2 text-sm text-600">{{ type }}</label>
        </div>
      </div>
    </div>
    <Divider />
    <Button label="Reset Filters" link class="p-0" @click="resetFilters" />
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import Divider from "primevue/divider";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const jobTypes = ["Remote", "On-site", "Hybrid", "Full-time", "Part-time"];

const filters = reactive({
  search: props.modelValue?.search || "",
  types: props.modelValue?.types || [],
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      filters.search = newVal.search;
      filters.types = newVal.types;
    }
  },
  { deep: true }
);

const emitUpdate = () => {
  emit("update:modelValue", filters);
};

const resetFilters = () => {
  filters.search = "";
  filters.types = [];
  emit("update:modelValue", filters);
};
</script>
