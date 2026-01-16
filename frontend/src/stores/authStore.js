import router from "@/router";
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { authApi } from "../api/authApi";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("jwtToken") || null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const error = ref(null);

  const isAuth = computed(() => !!token.value);
  const isRecruiter = computed(() => user.value?.role === "recruiter");
  const isCandidate = computed(() => user.value?.role === "candidate");

  const saveState = (newToken, newUser) => {
    token.value = newToken;
    user.value = newUser;

    if (newToken) {
      localStorage.setItem("jwtToken", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
    }
  };

  async function login(credentials) {
    try {
      const { token: newToken, user: newUser } =
        await authApi.login(credentials);

      saveState(newToken, newUser);
      if (newUser.role === "recruiter") {
        router.push("/recruiter");
      } else {
        router.push("/candidate");
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Login failed.";
      saveState(null, null);
    }
  }

  async function register(userData) {
    try {
      await authApi.register(userData);
      await login({ email: userData.email, password: userData.password });
    } catch (err) {
      error.value = err.response?.data?.message || "Registration failed.";
      throw err;
    }
  }

  async function logout() {
    saveState(null, null);
    router.push("/login");
  }

  return {
    error,
    token,
    user,
    isAuth,
    isRecruiter,
    isCandidate,
    login,
    register,
    logout,
  };
});
