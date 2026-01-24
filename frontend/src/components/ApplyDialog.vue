<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    header="Upload your CV"
    :style="{ width: '40rem' }"
  >
    <div class="flex flex-column gap-3">
      <p class="m-0 text-600">
        Upload your CV to finalize your application at
        <strong>{{ props.job?.companySnapshot?.name }}</strong
        >.
      </p>

      <div class="flex flex-column gap-2">
        <label for="cv-upload" class="font-bold">CV (PDF Format)</label>

        <Toast />
        <FileUpload
          ref="fileUploadRef"
          name="cv"
          mode="advanced"
          :multiple="false"
          accept="application/pdf"
          :fileLimit="1"
          :maxFileSize="5000000"
          @select="onFileSelect"
          @clear="onFileClear"
          :showUploadButton="false"
          :showCancelButton="false"
        >
          <template #empty>
            <div
              class="flex align-items-center justify-content-center flex-column"
            >
              <i
                class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400"
              />
              <p class="mt-4 mb-0">Drag and drop your PDF CV here.</p>
            </div>
          </template>
        </FileUpload>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="closeDialog" />
      <Button
        label="Submit Application"
        icon="pi pi-send"
        @click="submitApplication"
        :disabled="!selectedFile"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { useJobStore } from "@/stores/jobsStore";
import { Dialog, FileUpload, Toast, useToast, Button } from "primevue";
import { ref } from "vue";

const props = defineProps({ visible: Boolean, job: Object });
const emit = defineEmits(["update:visible"]);

const toast = useToast();
const jobStore = useJobStore();
const selectedFile = ref(null);

const submitApplication = async () => {
  console.log(typeof selectedFile.value);
  if (!selectedFile.value) return;

  try {
    await jobStore.applyToJob(props.job.id, selectedFile.value);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Application sent successfully!",
      life: 3000,
    });

    closeDialog();
  } catch (error) {}
};

const onFileSelect = (e) => {
  selectedFile.value = e.files[0];
};

const onFileClear = () => {
  selectedFile.value = null;
};

const closeDialog = () => {
  emit("update:visible", false);
};
</script>
