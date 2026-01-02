<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    header="Edit Job"
    :style="{ width: '90vw', maxWidth: '500px' }"
    class="p-fluid"
  >
    <div class="flex flex-column gap-3 pt-2">
      <div class="flex flex-column gap-2">
        <label class="font-bold">Job Title</label>
        <InputText
          v-model="localJob.title"
          :class="{ 'p-invalid': submitted && !localJob.title }"
        />
        <small v-if="submitted && !localJob.title" class="p-error">Title is required.</small>
      </div>

      <div class="flex flex-column gap-2">
        <label class="font-bold">Job Type</label>
        <Select
          v-model="localJob.type"
          :options="jobTypes"
          placeholder="Select type"
          class="w-full"
        />
      </div>

      <div class="flex flex-column gap-2">
        <label class="font-bold">Salary (Optional)</label>
        <InputText v-model="localJob.salary" placeholder="Ex: 2000€ or Confidential" />
      </div>

      <div class="flex flex-column gap-2">
        <label class="font-bold">Description</label>
        <Textarea
          v-model="localJob.description"
          rows="5"
          autoResize
          :class="{ 'p-invalid': submitted && !localJob.description }"
        />
        <small v-if="submitted && !localJob.description" class="p-error"
          >Description is required.</small
        >
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="close" />
      <Button label="Save Changes" icon="pi pi-check" @click="handleSave" :loading="isLoading" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useJobStore } from "@/stores/jobStore";
import { useToast } from "primevue/usetoast";

import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Select from "primevue/select";

const props = defineProps({
  visible: Boolean,
  job: Object,
});

const emit = defineEmits(["update:visible", "saved"]);

const jobStore = useJobStore();
const toast = useToast();

const isLoading = ref(false);
const submitted = ref(false);
const localJob = ref({});
const jobTypes = ref(["Remote", "On-Site", "Hybrid"]);

watch(
  () => props.job,
  (newJob) => {
    if (newJob) {
      localJob.value = { ...newJob };
    }
  },
  { immediate: true }
);

const close = () => {
  emit("update:visible", false);
  submitted.value = false;
};

const handleSave = async () => {
  submitted.value = true;

  if (!localJob.value.title || !localJob.value.description) {
    return;
  }

  isLoading.value = true;
  try {
    await jobStore.updateJob(localJob.value.id, localJob.value);

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Job updated successfully!",
      life: 3000,
    });
    emit("saved");
    close();
  } catch (error) {
    console.error(error);
    toast.add({ severity: "error", summary: "Error", detail: "Failed to update job.", life: 3000 });
  } finally {
    isLoading.value = false;
  }
};
</script>
