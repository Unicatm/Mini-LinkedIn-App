<template>
  <Dialog
    :visible="visible"
    modal
    :style="{ width: '90vw', maxWidth: '600px' }"
    :header="isEditing ? 'Edit Experience' : 'Add Experience'"
    @update:visible="$emit('update:visible', $event)"
    class="p-fluid"
  >
    <Form
      v-if="visible"
      :key="initialData?.id || 'new'"
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex flex-column gap-3 pt-2"
    >
      <div class="flex flex-column gap-2">
        <label class="font-bold">Job Title</label>
        <InputText name="title" class="w-full" />
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
        <label class="font-bold">Company</label>
        <InputText name="company" class="w-full" />
        <Message
          v-if="$form.company?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.company.error.message }}
        </Message>
      </div>

      <div class="flex flex-column sm:flex-row gap-3">
        <div class="flex flex-column gap-2 w-full">
          <label class="font-bold">From</label>
          <InputText name="startDate" placeholder="Ex: 2020" class="w-full" />
          <Message
            v-if="$form.startDate?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.startDate.error.message }}
          </Message>
        </div>
        <div class="flex flex-column gap-2 w-full">
          <label class="font-bold">Until</label>
          <InputText name="endDate" placeholder="Ex: Present" class="w-full" />
        </div>
      </div>

      <div class="flex flex-column gap-2">
        <label class="font-bold">Description</label>
        <Textarea name="description" rows="3" class="w-full" autoResize />
      </div>

      <div
        class="flex justify-content-end gap-2 mt-3 pt-3 border-top-1 surface-border"
      >
        <Button
          label="Cancel"
          text
          severity="secondary"
          @click="$emit('update:visible', false)"
        />
        <Button type="submit" label="Save" />
      </div>
    </Form>
  </Dialog>
</template>

<script setup>
import { computed } from "vue";
import { Dialog, Button, InputText, Textarea, Message } from "primevue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const props = defineProps({
  visible: Boolean,
  isEditing: Boolean,
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:visible", "save"]);

const resolver = zodResolver(
  z.object({
    title: z.string().min(1, "Job title is required."),
    company: z.string().min(1, "Company name is required."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
  }),
);

const initialValues = computed(() => ({
  title: props.initialData?.title || "",
  company: props.initialData?.company || "",
  startDate: props.initialData?.startDate || "",
  endDate: props.initialData?.endDate || "",
  description: props.initialData?.description || "",
}));

const onFormSubmit = ({ valid, values }) => {
  if (valid) {
    emit("save", { ...props.initialData, ...values });
    emit("update:visible", false);
  }
};
</script>
