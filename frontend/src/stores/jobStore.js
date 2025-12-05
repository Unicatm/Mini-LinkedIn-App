import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { jobsApi } from "../api/jobsApi";

export const useJobStore = defineStore("job", () => {
  const jobs = ref([]);
  const applications = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const activeJobs = computed(() =>
    jobs.value.filter((job) => job.status === "active")
  );

  async function fetchJobs() {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await jobsApi.fetchJobs();
      jobs.value = data;
    } catch (err) {
      error.value = "Error retrieving jobs.";
      console.error("Error at fetchJobs:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMyApplications() {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await jobsApi.fetchMyApplications();
      applications.value = data;
    } catch (err) {
      error.value = "Error retrieving applications.";
      console.error("Error at fetchMyApplications:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function applyToJob(jobId) {
    try {
      const response = await jobsApi.applyToJob(jobId);
      fetchMyApplications();
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || "The application failed.";
      throw err;
    }
  }

  async function createJob(jobData) {
    try {
      const response = await jobsApi.createJob(jobData);

      jobs.value.unshift(response.data);
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || "Error creating job.";
      throw err;
    }
  }

  return {
    jobs,
    applications,
    isLoading,
    error,
    activeJobs,
    fetchJobs,
    fetchMyApplications,
    applyToJob,
    createJob,
  };
});
