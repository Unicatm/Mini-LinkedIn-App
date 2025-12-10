<template>
  <Card class="shadow-1 border-round-xl h-full">
    <template #title>
      <div>Skills</div>
    </template>
    <template #content>
      <div v-if="readOnly" class="flex flex-wrap gap-2">
        <span v-if="!skills || skills.length === 0" class="text-500 italic">
          No skills are specified.
        </span>
        <Chip
          v-for="skill in skills"
          :key="skill"
          :label="skill"
          class="bg-blue-50 text-blue-700 font-medium"
        />
      </div>

      <div v-else>
        <FloatLabel class="mt-3">
          <AutoComplete
            v-model="localSkills"
            inputId="skills-input"
            multiple
            class="w-full"
            @item-select="save"
            @item-unselect="save"
            :typeahead="false"
          />
          <label for="skills-input">Add skills (press Enter)</label>
        </FloatLabel>
        <small class="text-500 block mt-2">Ex: Vue.js, Communication, English</small>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUsersStore } from "@/stores/usersStore";
import Card from "primevue/card";
import Chip from "primevue/chip";
import AutoComplete from "primevue/autocomplete";
import FloatLabel from "primevue/floatlabel";

const props = defineProps(["skills", "readOnly"]);
const usersStore = useUsersStore();

const localSkills = ref([...(props.skills || [])]);

watch(
  () => props.skills,
  (newVal) => {
    localSkills.value = [...(newVal || [])];
  }
);

const save = () => {
  usersStore.updateMyProfile({ skills: localSkills.value });
};
</script>
