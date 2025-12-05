import api from "./index";

export const authApi = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    console.log(response.data);
    return response.data;
  },

  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};
