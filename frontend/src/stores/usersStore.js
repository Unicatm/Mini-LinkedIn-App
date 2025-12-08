import { ref } from "vue";
import { defineStore } from "pinia";
import { usersApi } from "../api/usersApi";

export const useUsersStore = defineStore("user", () => {
  const myProfile = ref(null);

  const visitedProfile = ref(null);

  const isLoading = ref(false);
  const error = ref(null);

  async function fetchMyProfile() {
    isLoading.value = true;
    try {
      const data = await usersApi.fetchMyProfile();
      myProfile.value = data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateMyProfile(updates) {
    isLoading.value = true;
    try {
      await usersApi.updateMyProfile(updates);

      if (myProfile.value && myProfile.value.profile) {
        myProfile.value.profile = { ...myProfile.value.profile, ...updates };
      }
    } catch (err) {
      error.value = "Could not update profile.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPublicProfile(userId) {
    isLoading.value = true;
    visitedProfile.value = null;
    try {
      const data = await usersApi.fetchPublicProfile(userId);
      visitedProfile.value = data;
      return data;
    } catch (err) {
      console.error("Error fetching public profile:", err);
      error.value = "Profile not found.";
    } finally {
      isLoading.value = false;
    }
  }

  function clearUserData() {
    myProfile.value = null;
    visitedProfile.value = null;
    error.value = null;
  }

  return {
    myProfile,
    visitedProfile,
    isLoading,
    error,
    fetchMyProfile,
    updateMyProfile,
    fetchPublicProfile,
    clearUserData,
  };
});
