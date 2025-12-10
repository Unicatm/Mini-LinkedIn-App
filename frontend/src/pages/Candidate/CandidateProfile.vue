<template>
  <div class="surface-ground min-h-screen pb-6">
    <Toast />

    <div
      v-if="isLoading"
      class="flex flex-column justify-content-center align-items-center h-screen"
    >
      <i class="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
      <span class="text-500">Loading Profile...</span>
    </div>

    <div v-else>
      <div class="w-full max-w-7xl mx-auto px-4">
        <CandidateHeader :user="currentUser" :readOnly="isReadOnly" />
      </div>

      <div class="grid w-full max-w-7xl mx-auto px-4 mt-4">
        <div class="col-12 md:col-4">
          <div class="flex flex-column gap-4 pt-1rem">
            <CandidateBio :profileData="currentUser?.profile" :readOnly="isReadOnly" />
            <CandidateSkills :skills="currentUser?.profile?.skills" :readOnly="isReadOnly" />
          </div>
        </div>

        <div class="col-12 md:col-8">
          <Tabs value="0">
            <TabList class="bg-white-alpha-20">
              <Tab value="0" class="flex align-items-center gap-2">
                <i class="pi pi-briefcase"></i> Experience
              </Tab>
              <Tab value="1" v-if="!isReadOnly" class="flex align-items-center gap-2">
                <i class="pi pi-list"></i> Applications
              </Tab>
            </TabList>

            <TabPanels class="p-0 mt-2 bg-transparent border-none">
              <TabPanel value="0" class="p-0">
                <ExperienceSection
                  :experience="currentUser?.profile?.experience"
                  :readOnly="isReadOnly"
                />
              </TabPanel>

              <TabPanel value="1" v-if="!isReadOnly" class="p-0">
                <ApplicationsList :applications="jobStore.applications" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUsersStore } from "@/stores/usersStore";
import { useJobStore } from "@/stores/jobStore";
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from "vue-router";

import CandidateHeader from "@/components/candidate/CandidateHeader.vue";
import ApplicationsList from "@/components/candidate/ApplicationsList.vue";
import CandidateSkills from "@/components/candidate/CandidateSkills.vue";
import ExperienceSection from "@/components/candidate/experience-section/ExperienceSection.vue";
import CandidateBio from "@/components/candidate/CandidateBio.vue";

import Toast from "primevue/toast";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

const usersStore = useUsersStore();
const jobStore = useJobStore();
const authStore = useAuthStore();
const route = useRoute();

const isLoading = ref(true);

const isReadOnly = computed(() => {
  return route.params.id && route.params.id !== authStore.user?.uid;
});

const currentUser = computed(() => {
  return isReadOnly.value ? usersStore.visitedProfile?.user : usersStore.myProfile;
});

onMounted(async () => {
  isLoading.value = true;
  try {
    if (isReadOnly.value) {
      await usersStore.fetchPublicProfile(route.params.id);
    } else {
      await Promise.all([usersStore.fetchMyProfile(), jobStore.fetchMyApplications()]);
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>
