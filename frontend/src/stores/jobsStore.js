import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { jobsApi } from "../api/jobsApi";

export const useJobStore = defineStore("job", () => {
  const jobs = ref([]);
  const applications = ref([]);
  const error = ref(null);

  const activeJobs = computed(() =>
    jobs.value.filter((job) => job.status === "active")
  );

  async function fetchJobs() {
    error.value = null;
    try {
      const data = await jobsApi.fetchJobs();
      jobs.value = data.reverse();
      // console.log(data);
    } catch (err) {
      error.value = "Error retrieving jobs.";
      console.error("Error at fetchJobs:", err);
    }
  }

  async function fetchMyJobs() {
    error.value = null;
    try {
      const data = await jobsApi.fetchMyJobs();
      jobs.value = data;
      // console.log(data);
    } catch (err) {
      error.value = "Error retrieving jobs.";
      console.error("Error at fetchMyJobs:", err);
    }
  }

  async function fetchMyApplications() {
    error.value = null;
    try {
      const data = await jobsApi.fetchMyApplications();
      applications.value = data;
    } catch (err) {
      error.value = "Error retrieving applications.";
      console.error("Error at fetchMyApplications:", err);
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
      await jobsApi.createJob(jobData);

      fetchMyJobs();
    } catch (err) {
      error.value = err.response?.data?.message || "Error creating job.";
      throw err;
    }
  }

  async function removeJob(jobId) {
    try {
      await jobsApi.deleteJob(jobId);

      fetchMyJobs();
    } catch (err) {
      error.value = err.response?.data?.message || "Could not delete job.";
      throw err;
    }
  }

  return {
    jobs,
    applications,
    error,
    activeJobs,
    fetchJobs,
    fetchMyJobs,
    fetchMyApplications,
    applyToJob,
    createJob,
    removeJob,
  };
});
