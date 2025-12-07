import api from "./index";

export const authApi = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  async fetchProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  async updateProfile(profileData) {
    return api.put("/auth/profile", profileData);
  },
};
