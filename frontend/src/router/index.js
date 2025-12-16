import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import RegisterPage from "@/pages/RegisterPage.vue";
import RecruiterProfile from "@/pages/Recruiter/RecruiterProfile.vue";
import CandidateProfile from "@/pages/Candidate/CandidateProfile.vue";
import LoginPage from "@/pages/LoginPage.vue";
import JobsPage from "@/pages/JobsPage.vue";
import JobApplicationsPage from "@/pages/JobApplicationsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "Login", component: LoginPage },
    { path: "/register", name: "Register", component: RegisterPage },
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
      path: "/candidate/",
      component: CandidateProfile,
      name: "CandidateProfile",
      meta: { requiresAuth: true, role: "candidate" },
    },
    {
      path: "/candidate/:id",
      name: "PublicCandiateProfile",
      component: CandidateProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/jobs/:id/applications",
      name: "JobApplications",
      component: JobApplicationsPage,
      meta: { requiresAuth: true, role: "recruiter" },
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
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: "Jobs" });
  }

  if (to.meta.role && to.meta.role !== userRole) {
    if (userRole === "recruiter") {
      return next("/recruiter");
    } else if (userRole === "candidate") {
      return next("/jobs");
    } else {
      return next("/login");
    }
  }
  next();
});

export default router;
