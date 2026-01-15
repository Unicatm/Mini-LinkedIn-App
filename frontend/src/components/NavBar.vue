<template>
  <Menubar :model="items">
    <template #start>
      <span
        class="text-2xl font-bold text-blue-600 no-underline cursor-pointer"
        @click="goToHome"
      >
        Mini LinkedIn
      </span>
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a
        @click="item.click"
        v-if="item.condition"
        v-ripple
        class="flex items-center"
        v-bind="props.action"
      >
        <span>{{ item.label }}</span>
        <Badge
          v-if="item.badge"
          :class="{ 'ml-auto': !root, 'ml-2': root }"
          :value="item.badge"
        />
        <span
          v-if="item.shortcut"
          class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
          >{{ item.shortcut }}</span
        >
        <i
          v-if="hasSubmenu"
          :class="[
            'pi pi-angle-down ml-auto',
            { 'pi-angle-down': root, 'pi-angle-right': !root },
          ]"
        ></i>
      </a>
    </template>
    <template #end>
      <div class="flex items-center justify-center gap-3">
        <Avatar
          shape="circle"
          icon="pi pi-user"
          class="bg-blue-100 cursor-pointer"
          @click="goToHome"
        />
        <Button
          label="Logout"
          rounded
          variant="outlined"
          class="border-blue-600 text-blue-600 hover:bg-blue-50"
          size="small"
          @click="() => authStore.logout()"
        />
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Avatar, Menubar, Badge, Button } from "primevue";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const items = ref([
  {
    label: "Jobs",
    icon: "pi pi-home",
    click: () => router.push({ name: "JobsPage" }),
    condition: true,
  },
  {
    label: "Profile",
    icon: "pi pi-home",
    click: () =>
      router.push({
        name: authStore.isRecruiter ? "RecruiterProfile" : "CandidateProfile",
      }),
    condition: true,
  },
]);

const goToHome = () => {
  router.push({
    name: authStore.isRecruiter ? "RecruiterProfile" : "CandidateProfile",
  });
};
</script>
