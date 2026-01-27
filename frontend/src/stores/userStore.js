import { ref } from "vue";
import { defineStore } from "pinia";
import { usersApi } from "../api/usersApi";

export const useUsersStore = defineStore("user", () => {
  const myProfile = ref(null);
  const visitedProfile = ref(null);

  const error = ref(null);

  async function fetchMyProfile() {
    try {
      const data = await usersApi.fetchMyProfile();
      myProfile.value = data;

      console.log(myProfile.value);
    } catch (err) {
      console.error("Error fetching profile:", err);
      throw err;
    }
  }

  async function fetchPublicProfile(userId) {
    visitedProfile.value = null;
    try {
      const data = await usersApi.fetchPublicProfile(userId);
      visitedProfile.value = data;
      console.log(visitedProfile.value);
      return data;
    } catch (err) {
      console.error("Error fetching public profile:", err);
      error.value = "Profile not found.";
    }
  }

  async function updateMyProfile(updates) {
    try {
      await usersApi.updateMyProfile(updates);
      fetchMyProfile();
    } catch (err) {
      error.value = "Could not update profile.";
      throw err;
    }
  }

  async function uploadAvatar(file, type) {
    try {
      const response = await usersApi.uploadFile(file, type);
      fetchMyProfile();
      return response.url;
    } catch (err) {
      error.value = "Could not update profile.";
      throw err;
    }
  }

  function clearUserData() {
    myProfile.value = null;
    error.value = null;
  }

  return {
    myProfile,
    visitedProfile,
    error,
    fetchMyProfile,
    fetchPublicProfile,
    updateMyProfile,
    clearUserData,
    uploadAvatar,
  };
});
