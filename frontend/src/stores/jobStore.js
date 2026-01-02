import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { jobsApi } from "../api/jobsApi";

export const useJobStore = defineStore("job", () => {
  const jobs = ref([]);
  const applications = ref([]);
  const appliedJobIds = ref(new Set());
  const currentJobApplications = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const activeJobs = computed(() => jobs.value.filter((job) => job.status === "active"));

  async function fetchJobs() {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await jobsApi.fetchJobs();
      jobs.value = data;
      // console.log(data);
    } catch (err) {
      error.value = "Error retrieving jobs.";
      console.error("Error at fetchJobs:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchJobById(jobId) {
    const existingJob = jobs.value.find((j) => j.id === jobId);
    if (existingJob) return existingJob;

    isLoading.value = true;
    try {
      const data = await jobsApi.getJobById(jobId);
      return data;
    } catch (err) {
      error.value = "Job not found";
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMyJobs() {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await jobsApi.fetchMyJobs();
      jobs.value = data;
      // console.log(data);
    } catch (err) {
      error.value = "Error retrieving jobs.";
      console.error("Error at fetchMyJobs:", err);
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
      appliedJobIds.value = new Set(data.map((app) => app.jobId));
    } catch (err) {
      error.value = "Error retrieving applications.";
      console.error("Error at fetchMyApplications:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchApplicationsForJob(jobId) {
    isLoading.value = true;
    try {
      const response = await jobsApi.fetchApplicationsForJob(jobId);
      currentJobApplications.value = response;
    } catch (err) {
      error.value = "Could not fetch applications.";
    } finally {
      isLoading.value = false;
    }
  }

  async function applyToJob(jobId) {
    try {
      const response = await jobsApi.applyToJob(jobId);
      appliedJobIds.value.add(jobId);
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

      fetchMyJobs();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || "Error creating job.";
      throw err;
    }
  }

  async function updateJob(jobId, updatedData) {
    isLoading.value = true;
    try {
      const response = await jobsApi.updateJob(jobId, updatedData);
      fetchMyJobs();

      return response;
    } catch (err) {
      error.value = err.response?.data?.message || "Could not update job.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeJob(jobId) {
    try {
      await jobsApi.deleteJob(jobId);

      jobs.value = jobs.value.filter((job) => job.id !== jobId);
      fetchMyJobs();

      return true;
    } catch (err) {
      error.value = err.response?.data?.message || "Could not delete job.";
      throw err;
    }
  }

  const hasAppliedTo = (jobId) => appliedJobIds.value.has(jobId);

  return {
    jobs,
    applications,
    currentJobApplications,
    isLoading,
    error,
    activeJobs,
    fetchJobs,
    fetchJobById,
    fetchMyJobs,
    fetchMyApplications,
    fetchApplicationsForJob,
    applyToJob,
    createJob,
    updateJob,
    removeJob,
    hasAppliedTo,
  };
});
