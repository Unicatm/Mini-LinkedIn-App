<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="`Apply to: ${job?.title || 'Job'}`"
    :style="{ width: '500px' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    @hide="resetForm"
  >
    <div class="flex flex-column gap-3">
      <p class="m-0 text-600">
        Upload your CV to finalize your application at
        <strong>{{ job?.companySnapshot?.name }}</strong
        >.
      </p>

      <div class="flex flex-column gap-2">
        <label for="cv-upload" class="font-bold">CV (PDF Format)</label>

        <input
          type="file"
          id="cv-upload"
          ref="fileInputRef"
          accept="application/pdf"
          @change="onFileSelect"
          class="w-full p-3 border-1 border-round border-300 cursor-pointer hover:border-blue-500 transition-colors"
        />

        <small class="text-red-500" v-if="fileError">
          <i class="pi pi-exclamation-circle mr-1"></i>{{ fileError }}
        </small>
        <small class="text-green-600" v-else-if="selectedFile">
          <i class="pi pi-check-circle mr-1"></i>File selected: {{ selectedFile.name }}
        </small>
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="closeDialog" />
      <Button
        label="Send"
        @click="submitApplication"
        :loading="isSubmitting"
        :disabled="!selectedFile || !!fileError"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from "vue";

import { useJobStore } from "@/stores/jobStore";
import { useToast } from "primevue/usetoast";

import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  job: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:visible", "application-success"]);

const jobStore = useJobStore();
const toast = useToast();

const selectedFile = ref(null);
const fileError = ref("");
const isSubmitting = ref(false);
const fileInputRef = ref(null);

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const onFileSelect = (event) => {
  const file = event.target.files[0];
  resetFileState();

  if (!file) return;

  if (file.type !== "application/pdf") {
    fileError.value = "Upload only PDF files.";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    fileError.value = "File is to large (Max 5MB).";
    return;
  }

  selectedFile.value = file;
};

const submitApplication = async () => {
  if (!selectedFile.value || !props.job) return;

  isSubmitting.value = true;

  try {
    await jobStore.applyToJob(props.job.id, selectedFile.value);

    toast.add({
      severity: "success",
      summary: "Succes",
      detail: `You have successfully applied to ${props.job.title}!`,
      life: 3000,
    });

    emit("application-success");
    closeDialog();
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Could not send application. Please try again.",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const closeDialog = () => {
  isVisible.value = false;
};

const resetFileState = () => {
  selectedFile.value = null;
  fileError.value = "";
};

const resetForm = () => {
  resetFileState();
  if (fileInputRef.value) {
    fileInputRef.value.value = null;
  }
};
</script>
