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
      <RouterLink
        :to="item.to"
        v-if="item.condition"
        v-ripple
        class="flex items-center"
        v-bind="props.action"
      >
        <span>{{ item.label }}</span>
      </RouterLink>
    </template>
    <template #end>
      <div class="flex items-center justify-center gap-3">
        <Avatar
          :image="avatarUrl"
          :icon="avatarUrl ? null : 'pi pi-user'"
          shape="circle"
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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Avatar, Menubar, Button } from "primevue";
import { useAuthStore } from "@/stores/authStore";
import { useUsersStore } from "@/stores/userStore";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUsersStore();

const avatarUrl = computed(
  () => userStore?.myProfile?.profile?.avatarUrl || null,
);

const items = ref([
  {
    label: "Jobs",
    icon: "pi pi-home",
    condition: true,
    to: "/jobs",
  },
  {
    label: "Profile",
    icon: "pi pi-home",
    to: authStore.isRecruiter ? "/recruiter" : "/candidate",
    condition: true,
  },
]);

const goToHome = () => {
  router.push({
    name: authStore.isRecruiter ? "RecruiterProfile" : "CandidateProfile",
  });
};
</script>
