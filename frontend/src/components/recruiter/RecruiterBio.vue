<template>
  <Card class="shadow-1 border-round-xl sticky top-0">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <span>Introduction</span>
        <Button
          v-if="!readOnly"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"
          text
          rounded
          @click="toggleEdit"
          class="text-blue-600 hover:bg-blue-50"
        />
      </div>
    </template>

    <template #content>
      <div v-if="!isEditing">
        <div>
          <p v-if="profileData.bio" class="text-500 line-height-3 mb-4">
            {{ profileData.bio }}
          </p>
          <p v-else class="text-500 font-italic mb-4">
            {{
              readOnly
                ? "No description provided."
                : "You haven't added a description yet."
            }}
          </p>
        </div>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-briefcase text-blue-600 mr-2"></i>
          <span v-if="profileData.companyName" class="text-700 font-medium">{{
            profileData.companyName
          }}</span>
          <span v-else class="text-400 text-sm">{{
            readOnly ? "No company" : "Add company"
          }}</span>
        </div>

        <div class="flex align-items-center mb-3">
          <i class="pi pi-globe text-blue-600 mr-2"></i>
          <span v-if="profileData.website" class="text-700 text-sm">{{
            profileData.website
          }}</span>
          <span v-else class="text-400 text-sm">{{
            readOnly ? "No website" : "Add website"
          }}</span>
        </div>

        <div class="flex align-items-center">
          <i class="pi pi-map-marker text-blue-600 mr-2"></i>
          <span v-if="profileData.location" class="text-700 text-sm">{{
            profileData.location
          }}</span>
          <span v-else class="text-400 text-sm">{{
            readOnly ? "No location" : "Add location"
          }}</span>
        </div>
      </div>

      <div v-else>
        <Form
          v-slot="$form"
          :resolver="resolver"
          :initialValues="initialValues"
          @submit="onFormSubmit"
          class="flex flex-column gap-3"
        >
          <div class="flex flex-column gap-2">
            <label class="font-bold text-sm text-700">About you</label>
            <Textarea name="bio" rows="4" class="w-full" autoResize />
          </div>

          <div class="flex flex-column gap-2">
            <label class="font-bold text-sm text-700">Company</label>
            <InputText name="companyName" class="w-full" />
          </div>

          <div class="flex flex-column gap-2">
            <label class="font-bold text-sm text-700">Website</label>
            <InputText name="website" class="w-full" />
            <Message
              v-if="$form.website?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.website.error.message }}
            </Message>
          </div>

          <div class="flex flex-column gap-2">
            <label class="font-bold text-sm text-700">Location</label>
            <InputText name="location" class="w-full" />
          </div>

          <div class="flex gap-2 justify-content-end mt-2">
            <Button
              label="Cancel"
              text
              size="small"
              severity="secondary"
              @click="isEditing = false"
            />

            <Button type="submit" label="Save" size="small" />
          </div>
        </Form>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useUsersStore } from "@/stores/userStore";
import { Card, Button, InputText, Textarea, Message } from "primevue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const props = defineProps({
  profileData: { type: Object, default: () => ({}) },
  readOnly: { type: Boolean, default: false },
});

const usersStore = useUsersStore();
const isEditing = ref(false);

const initialValues = computed(() => ({
  bio: props.profileData.bio || "",
  companyName: props.profileData.companyName || "",
  location: props.profileData.location || "",
  website: props.profileData.website || "",
}));

const resolver = zodResolver(
  z.object({
    bio: z.string().optional(),
    companyName: z.string().optional(),
    location: z.string().optional(),
    website: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
  }),
);

const toggleEdit = () => {
  if (props.readOnly) return;
  isEditing.value = !isEditing.value;
};

const onFormSubmit = async ({ valid, values }) => {
  if (valid) {
    console.log("Saving:", values);
    await usersStore.updateMyProfile(values);
    isEditing.value = false;
  }
};
</script>
