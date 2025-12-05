import { ref, computed } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
import { authApi } from "../api/authApi";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("jwtToken") || null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const isLoading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);
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
    isLoading.value = true;
    error.value = null;
    try {
      const { token: newToken, user: newUser } = await authApi.login(
        credentials
      );

      saveState(newToken, newUser);

      if (newUser.role === "recruiter") {
        router.push("/recruiter");
      } else {
        router.push("/candidate");
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Login failed.";
      saveState(null, null);
    } finally {
      isLoading.value = false;
    }
  }

  async function register(userData) {
    isLoading.value = true;
    error.value = null;
    try {
      await authApi.register(userData);

      await login({ email: userData.email, password: userData.password });
    } catch (err) {
      error.value = err.response?.data?.message || "Registration failed.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    saveState(null, null);
    router.push("/login");
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    isRecruiter,
    isCandidate,
    login,
    register,
    logout,
  };
});
