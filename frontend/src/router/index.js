import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import CandidateProfile from "@/pages/CandidateProfile.vue";
import RecruiterProfile from "@/pages/RecruiterProfile.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/login" },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/register",
      name: "RegisterPage",
      component: RegisterPage,
    },

    {
      path: "/recruiter",
      component: RecruiterProfile,
      name: "RecruiterProfile",
      meta: { requiresAuth: true, roles: ["recruiter"] },
    },
    {
      path: "/candidate",
      component: CandidateProfile,
      name: "CandidateProfile",
      meta: { requiresAuth: true, roles: ["recruiter"] },
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/login",
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const isAuthenticated = !!authStore.token;
  const userRole = authStore.user?.role;
  console.log(isAuthenticated);
  console.log(userRole);

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next({ name: "Login" });
    }

    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      console.warn(
        `Access denied. User role: ${userRole}, Required: ${to.meta.roles}`
      );
      if (userRole === "recruiter") return next({ name: "RecruiterProfile" });
      if (userRole === "candidate") return next({ name: "CandidateProfile" });

      return next({ name: "Login" });
    }
  }

  next();
});

export default router;
