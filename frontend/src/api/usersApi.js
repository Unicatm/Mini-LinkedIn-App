import api from "./index";

export const usersApi = {
  async fetchMyProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async fetchPublicProfile() {
    const response = await api.get("/users/:id/public");
    return response.data;
  },

  async updateMyProfile(profileData) {
    return api.put("/users/profile", profileData);
  },
};
