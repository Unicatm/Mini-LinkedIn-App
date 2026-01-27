<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    header="Edit Job"
    :style="{ width: '90vw', maxWidth: '500px' }"
    class="p-fluid"
  >
    <Form
      v-if="visible"
      :key="props.job?.id"
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex flex-column gap-3 pt-2"
    >
      <div class="flex flex-column gap-3 pt-2">
        <div class="flex flex-column gap-2">
          <label class="font-bold">Job Title</label>
          <InputText name="title" />
          <Message
            v-if="$form.title?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.title.error.message }}
          </Message>
        </div>

        <div class="flex flex-column gap-2">
          <label class="font-bold">Job Type</label>
          <Select
            name="type"
            :options="jobTypes"
            placeholder="Select type"
            class="w-full"
          />
        </div>

        <div class="flex flex-column gap-2">
          <label class="font-bold">Salary (Optional)</label>
          <InputText name="salary" placeholder="Ex: 2000€ or Confidential" />
        </div>

        <div class="flex flex-column gap-2">
          <label class="font-bold">Description</label>
          <Textarea
            name="description"
            rows="5"
            autoResize
            :class="{ 'p-invalid': submitted && !localJob.description }"
          />
          <Message
            v-if="$form.description?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.description.error.message }}
          </Message>
        </div>
      </div>

      <div
        class="flex justify-content-end gap-2 mt-3 pt-3 border-top-1 surface-border"
      >
        <Button label="Cancel" icon="pi pi-times" text @click="close" />
        <Button label="Save Changes" icon="pi pi-check" type="submit" />
      </div>
    </Form>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useJobStore } from "@/stores/jobsStore";

import { Dialog, InputText, Textarea, Button, Select, Message } from "primevue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const props = defineProps({
  visible: Boolean,
  job: Object,
});

const emit = defineEmits(["update:visible"]);

const jobStore = useJobStore();
const toast = useToast();

const jobTypes = ref(["Remote", "On-Site", "Hybrid"]);

const resolver = zodResolver(
  z.object({
    title: z.string().min(1, "Title is required."),
    type: z.string().optional(),
    salary: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "Description is required."),
  }),
);

const initialValues = computed(() => ({
  title: props.job?.title || "",
  type: props.job?.type || "",
  salary: props.job?.salary || "",
  description: props.job?.description || "",
}));

const close = () => {
  emit("update:visible", false);
};

const onFormSubmit = async ({ valid, values }) => {
  if (valid) {
    try {
      await jobStore.updateJob(props.job.id, values);

      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Job updated successfully!",
        life: 3000,
      });

      close();
    } catch (error) {
      console.error(error);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to update job.",
        life: 3000,
      });
    }
  }
};
</script>
