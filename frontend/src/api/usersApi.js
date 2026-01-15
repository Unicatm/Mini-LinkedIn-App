import api from "./index";

export const usersApi = {
  async fetchMyProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async fetchPublicProfile(userId) {
    const response = await api.get(`/users/${userId}/public`);
    // console.log(response.data);
    return response.data;
  },

  async updateMyProfile(profileData) {
    return api.put("/users/profile", profileData);
  },
};
