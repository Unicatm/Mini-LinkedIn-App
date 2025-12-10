<template>
  <Card class="shadow-1 border-round-xl h-full">
    <template #title>
      <div class="flex justify-content-between align-items-center">
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
      <div v-if="experienceList && experienceList.length > 0" class="flex flex-column gap-4">
        <ExperienceItem
          v-for="(job, index) in experienceList"
          :key="job.id || index"
          :job="job"
          :readOnly="readOnly"
          @toggle-menu="toggleMenu($event, index)"
        />
      </div>

      <div v-else class="text-500 italic text-sm">
        {{ readOnly ? "No experience was added." : "Add your professional experience." }}
      </div>

      <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />

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
import { useUsersStore } from "@/stores/usersStore";
import Card from "primevue/card";
import Button from "primevue/button";
import Menu from "primevue/menu";
import ExperienceItem from "./ExperienceItem.vue";
import ExperienceFormDialog from "./ExperienceFormDialog.vue";

const props = defineProps(["experience", "readOnly"]);
const usersStore = useUsersStore();

const showDialog = ref(false);
const isEditing = ref(false);
const selectedIndex = ref(null);
const menu = ref();
const formJob = ref({ title: "", company: "", startDate: "", endDate: "", description: "" });

const experienceList = computed(() => props.experience || []);

const menuItems = ref([
  {
    label: "Edit",
    icon: "pi pi-pencil",
    command: () => openEditDialog(),
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    class: "text-red-500",
    command: () => deleteExperience(),
  },
]);

const toggleMenu = (event, index) => {
  selectedIndex.value = index;
  menu.value.toggle(event);
};

const openAddDialog = () => {
  isEditing.value = false;
  selectedIndex.value = null;
  formJob.value = { title: "", company: "", startDate: "", endDate: "", description: "" };
  showDialog.value = true;
};

const openEditDialog = () => {
  if (selectedIndex.value === null) return;
  isEditing.value = true;
  formJob.value = { ...experienceList.value[selectedIndex.value] };
  showDialog.value = true;
};

const handleSave = async (formData) => {
  let updatedList = [...experienceList.value];

  if (isEditing.value && selectedIndex.value !== null) {
    updatedList[selectedIndex.value] = formData;
  } else {
    const newJobWithId = { ...formData, id: crypto.randomUUID() };
    updatedList = [newJobWithId, ...updatedList];
  }

  await usersStore.updateMyProfile({ experience: updatedList });
  showDialog.value = false;
};

const deleteExperience = async () => {
  if (selectedIndex.value === null) return;

  const updatedList = experienceList.value.filter((_, i) => i !== selectedIndex.value);
  await usersStore.updateMyProfile({ experience: updatedList });
};
</script>
