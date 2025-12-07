<template>
  <Card class="shadow-1 border-round-xl mb-4">
    <template #content>
      <div class="flex flex-column gap-3">
        <span class="text-500 font-medium ml-1">Publish a new Job</span>

        <InputText v-model="title" placeholder="Job Title (ex: Senior Java Dev)" class="w-full" />
        <Textarea
          v-model="description"
          rows="2"
          placeholder="Description..."
          class="w-full"
          autoResize
        />

        <div class="flex gap-2">
          <InputText v-model="salary" placeholder="Salary (ex: 2000 EUR)" class="w-full" />
          <Dropdown
            v-model="type"
            :options="['Remote', 'On-site', 'Hybrid']"
            placeholder="Type"
            class="w-full"
          />
        </div>

        <div class="flex justify-content-end mt-2">
          <Button
            label="Publish Job"
            icon="pi pi-send"
            @click="handlePostJob"
            :loading="loading"
            variant="outlined"
            class="border-blue-600 text-blue-600 hover:bg-blue-50"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";
import { useJobStore } from "@/stores/jobStore";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";

const jobStore = useJobStore();
const title = ref("");
const description = ref("");
const salary = ref("");
const type = ref("Remote");
const loading = ref(false);

const handlePostJob = async () => {
  if (!title.value || !description.value) return;

  loading.value = true;
  await jobStore.createJob({
    title: title.value,
    description: description.value,
    salary: salary.value,
    type: type.value,
  });

  title.value = "";
  description.value = "";
  salary.value = "";
  loading.value = false;
};
</script>
