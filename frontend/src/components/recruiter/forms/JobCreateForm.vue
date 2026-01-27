<template>
  <Card v-if="!readOnly" class="shadow-1 border-round-xl mb-4">
    <template #content>
      <div
        v-if="!isProfileComplete"
        class="bg-yellow-50 border-1 border-yellow-200 border-round p-3 mb-3 flex align-items-start gap-3"
      >
        <i class="pi pi-exclamation-triangle text-yellow-600 text-xl mt-1"></i>
        <div>
          <div class="font-medium text-yellow-700 mb-1">
            Complete your profile!
          </div>
          <p class="m-0 text-sm text-yellow-700 line-height-3">
            To post a job, you must complete the
            <strong>Introduction</strong> section (Bio, Company & Location).
          </p>
        </div>
      </div>

      <div
        class="flex flex-column gap-3"
        :class="{ 'opacity-50 pointer-events-none': !isProfileComplete }"
      >
        <span class="text-500 font-medium ml-1">Publish a new Job</span>
        <Form
          v-slot="$form"
          :resolver="resolver"
          :initialValues="initialValues"
          @submit="onFormSubmit"
          class="flex flex-column gap-3"
        >
          <div>
            <InputText
              name="title"
              placeholder="Job Title (ex: Senior Java Dev)"
              class="w-full"
            />
            <Message
              v-if="$form.title?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.title.error.message }}
            </Message>
          </div>

          <div>
            <Textarea
              name="description"
              rows="2"
              placeholder="Description..."
              class="w-full"
              autoResize
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

          <div class="flex gap-2">
            <div class="w-full">
              <InputText
                name="salary"
                placeholder="Salary (EUR)"
                class="w-full"
                v-keyfilter.num
              />
            </div>

            <Select
              name="type"
              :options="['Remote', 'On-site', 'Hybrid']"
              placeholder="Type"
              class="w-full h-fit"
            />
          </div>

          <div class="flex justify-content-end mt-2">
            <Button
              type="submit"
              label="Publish Job"
              icon="pi pi-send"
              :disabled="!isProfileComplete"
              variant="outlined"
              class="border-blue-600 text-blue-600 hover:bg-blue-50"
            />
          </div>
        </Form>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from "vue";
import { useUsersStore } from "@/stores/userStore";
import { useJobStore } from "@/stores/jobsStore";

import { Card, Button, Select, Textarea, InputText, Message } from "primevue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const jobStore = useJobStore();
const usersStore = useUsersStore();

const isProfileComplete = computed(() => {
  const profile = usersStore?.myProfile?.profile;

  return (
    profile &&
    profile?.companyName?.trim() !== "" &&
    profile?.location?.trim() !== "" &&
    profile?.bio?.trim() !== ""
  );
});

const initialValues = {
  title: "",
  description: "",
  salary: "",
  type: "Remote",
};

const resolver = zodResolver(
  z.object({
    title: z.string().min(1, "Title is required."),
    description: z.string().min(10, "Description needs to be longer."),
    salary: z.string(),
    type: z.string(),
  }),
);

const onFormSubmit = async ({ valid, values, reset }) => {
  if (valid) {
    if (!isProfileComplete.value) return;

    await jobStore.createJob(values);
    reset();
  }
};
</script>
