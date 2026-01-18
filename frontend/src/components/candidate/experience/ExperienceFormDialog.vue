<template>
  <Dialog
    :visible="visible"
    modal
    class="w-80vw"
    :header="isEditing ? 'Edit Experience' : 'Add Experience'"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="flex flex-column gap-3 pt-2">
      <div class="flex flex-column gap-2">
        <label>Job Title</label>
        <InputText v-model="localForm.title" class="w-full" />
      </div>
      <div class="flex flex-column gap-2">
        <label>Company</label>
        <InputText v-model="localForm.company" class="w-full" />
      </div>
      <div class="flex gap-2">
        <div class="flex flex-column gap-2 w-6">
          <label>From</label>
          <InputText
            v-model="localForm.startDate"
            class="w-full"
            placeholder="Ex: 2020"
          />
        </div>
        <div class="flex flex-column gap-2 w-6">
          <label>Until</label>
          <InputText
            v-model="localForm.endDate"
            class="w-full"
            placeholder="Ex: Present"
          />
        </div>
      </div>
      <div class="flex flex-column gap-2">
        <label>Description</label>
        <Textarea
          v-model="localForm.description"
          rows="3"
          class="w-full"
          autoResize
        />
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        text
        severity="secondary"
        @click="$emit('update:visible', false)"
      />
      <Button
        label="Save"
        @click="save"
        :disabled="!localForm.title || !localForm.company"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { Dialog, Button, InputText, Textarea } from "primevue";

const props = defineProps({
  visible: Boolean,
  isEditing: Boolean,
  initialData: Object,
});

const emit = defineEmits(["update:visible", "save"]);

const localForm = ref({ ...props.initialData });

watch(
  () => props.initialData,
  (newVal) => {
    localForm.value = { ...newVal };
  },
  { deep: true },
);

const save = () => {
  emit("save", localForm.value);
};
</script>
