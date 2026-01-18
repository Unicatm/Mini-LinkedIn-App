<template>
  <Card class="shadow-1 border-round-xl h-full">
    <template #title>
      <div class="flex justify-content-between align-items-center pb-4">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-briefcase text-primary"></i> Experience
        </div>
        <Button
          v-if="!readOnly"
          icon="pi pi-plus"
          text
          rounded
          size="small"
          @click="openAddDialog"
        />
      </div>
    </template>

    <template #content>
      <div
        v-if="experienceList && experienceList.length > 0"
        class="flex flex-column gap-4"
      >
        <ExperienceItem
          v-for="(job, index) in experienceList"
          :key="job.id || index"
          :job="job"
          :readOnly="readOnly"
          @delete="deleteExperience"
          @edit="openEditDialog"
        />
      </div>

      <div v-else class="text-500 italic text-sm">
        {{
          readOnly
            ? "No experience was added."
            : "Add your professional experience."
        }}
      </div>

      <ExperienceFormDialog
        v-model:visible="showDialog"
        :isEditing="isEditing"
        :initialData="formJob"
        @save="handleSave"
      />
    </template>
  </Card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/userStore";

import { Card, Button } from "primevue";

import ExperienceFormDialog from "./ExperienceFormDialog.vue";
import ExperienceItem from "./ExperienceItem.vue";

const props = defineProps(["experience", "readOnly"]);
const usersStore = useUsersStore();

const showDialog = ref(false);
const isEditing = ref(false);
const selectedIndex = ref(null);
const formJob = ref({
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
});

const experienceList = computed(() => props.experience || []);

const openAddDialog = () => {
  isEditing.value = false;
  selectedIndex.value = null;

  formJob.value = {
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  };
  showDialog.value = true;
};

const openEditDialog = (exp) => {
  if (exp === null) return;

  isEditing.value = true;
  selectedIndex.value = exp;
  formJob.value = { ...exp };
  showDialog.value = true;
};

const handleSave = async (formData) => {
  let updatedList = [...experienceList.value];

  if (isEditing.value && selectedIndex.value !== null) {
    const index = updatedList.findIndex(
      (item) => item.id === selectedIndex.value.id,
    );
    if (index !== -1) {
      updatedList[index] = { ...formData, id: selectedIndex.value.id };
    }
  } else {
    const newExpWithId = { ...formData, id: crypto.randomUUID() };
    updatedList = [newExpWithId, ...updatedList];
  }
  await usersStore.updateMyProfile({ experience: updatedList });
  showDialog.value = false;
};

const deleteExperience = async (id) => {
  if (id === null) return;

  const updatedList = experienceList.value.filter((exp) => exp.id !== id);
  await usersStore.updateMyProfile({ experience: updatedList });
};
</script>
