import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import Home from "@/pages/Home.vue";
import Register from "@/pages/Register.vue";
import CandidatePage from "@/pages/Candidate/CandidatePage.vue";
import RecruiterProfile from "@/pages/Recruiter/RecruiterProfile.vue";
import CandidateProfile from "@/pages/Candidate/CandidateProfile.vue";
import LoginPage from "@/pages/LoginPage.vue";
import JobsPage from "@/pages/JobsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "Login", component: LoginPage },
    { path: "/register", name: "Register", component: Register },
    {
      path: "/jobs",
      component: JobsPage,
      name: "JobsPage",
      meta: { requiresAuth: true },
    },
    {
      path: "/recruiter/:id",
      name: "PublicRecruiterProfile",
      component: RecruiterProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/recruiter",
      component: RecruiterProfile,
      name: "RecruiterProfile",
      meta: { requiresAuth: true, role: "recruiter" },
    },
    {
      path: "/candidate",
      component: CandidatePage,
      name: "CandidatePage",
      meta: { requiresAuth: true, role: "candidate" },
    },
    {
      path: "/candidate/profile",
      component: CandidateProfile,
      name: "CandidateProfile",
      meta: { requiresAuth: true, role: "candidate" },
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/login",
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const userRole = authStore.user?.role;

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: "Jobs" });
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: "Login" });
    }

    if (to.meta.roles && to.meta.roles.length > 0) {
      if (!to.meta.roles.includes(userRole)) {
        console.warn(`Access denied for role: ${userRole}`);
        return next({ name: "Home" });
      }
    }
  }
  next();
});

export default router;
