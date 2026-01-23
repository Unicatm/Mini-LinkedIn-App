<template>
  <div class="surface-ground min-h-screen pb-6">
    <div>
      <div class="w-full max-w-7xl mx-auto px-4">
        <CandidateHeader :user="currentUser" :readOnly="isReadOnly" />
      </div>

      <div class="grid w-6xl max-w-7xl mx-auto px-4 mt-4">
        <div class="col-12 md:col-3">
          <div class="flex flex-column gap-4 pt-1rem">
            <CandidateBio
              :profileData="currentUser?.profile"
              :readOnly="isReadOnly"
            />
          </div>
        </div>

        <div class="col-12 md:col-9">
          <Tabs value="0">
            <TabList class="bg-white-alpha-20">
              <Tab value="0" class="flex align-items-center gap-2">
                <i class="pi pi-briefcase"></i> Experience
              </Tab>
              <Tab
                value="1"
                v-if="!isReadOnly"
                class="flex align-items-center gap-2"
              >
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
                <ApplicationSection :applications="jobStore.applications" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUsersStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useJobStore } from "@/stores/jobsStore";
import { useRoute } from "vue-router";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primevue";

import CandidateHeader from "@/components/candidate/CandidateHeader.vue";
import CandidateBio from "@/components/candidate/CandidateBio.vue";
import ExperienceSection from "@/components/candidate/experience/ExperienceSection.vue";
import ApplicationSection from "@/components/candidate/ApplicationSection.vue";

const route = useRoute();
const authStore = useAuthStore();
const usersStore = useUsersStore();
const jobStore = useJobStore();

const isReadOnly = computed(() => {
  return route.params.id && route.params.id !== authStore.user?.uid;
});

const currentUser = computed(() => {
  return isReadOnly.value
    ? usersStore.visitedProfile?.user
    : usersStore.myProfile;
});

onMounted(async () => {
  try {
    if (isReadOnly.value) {
      await usersStore.fetchPublicProfile(route.params.id);
    } else {
      await Promise.all([
        usersStore.fetchMyProfile(),
        jobStore.fetchMyApplications(),
      ]);
    }
  } catch (error) {
    console.error(error);
  }
});
</script>
