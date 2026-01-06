import api from "./index";

export const usersApi = {
  async fetchMyProfile() {
    const response = await api.get("/users/profile");
    // console.log(response.data);
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

  async upload(formData) {
    const response = await api.post("/users/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response) {
      throw new Error("No response from server");
    }

    return response.data;
  },
};
