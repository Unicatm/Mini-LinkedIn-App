import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { jobsApi } from "../api/jobsApi";

export const useJobStore = defineStore("job", () => {
  const jobs = ref([]);
  const applications = ref([]);
  const applicationsIds = ref([]);
  const error = ref(null);

  const activeJobs = computed(() =>
    jobs.value.filter((job) => job.status === "active"),
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

  async function fetchJobById(jobId) {
    error.value = null;
    try {
      const data = await jobsApi.getJobById(jobId);
      // console.log(data);
      return data;
    } catch (err) {
      error.value = "Error retrieving that job.";
      console.error("Error at fetchJobById:", err);
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
    try {
      const data = await jobsApi.fetchMyApplications();
      let arr = [];
      data.forEach((appl) => {
        arr.push(appl.jobId);
      });
      applicationsIds.value = arr;
      applications.value = data;

      console.log(applicationsIds.value);
    } catch (err) {
      error.value = "Error retrieving applications.";
      console.error("Error at fetchMyApplications:", err);
    }
  }

  async function fetchApplicationsForJob(jobId) {
    try {
      const response = await jobsApi.fetchApplicationsForJob(jobId);
      // console.log(response);
      return response;
    } catch (err) {
      error.value = "Could not fetch applications.";
    }
  }

  async function applyToJob(jobId, file) {
    try {
      const response = await jobsApi.applyToJob(jobId, file);
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

  async function updateJob(jobId, updatedData) {
    try {
      const response = await jobsApi.updateJob(jobId, updatedData);
      console.log(response);
      fetchMyJobs();

      return response;
    } catch (err) {
      error.value = err.response?.data?.message || "Could not update job.";
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
    applicationsIds,
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
  };
});
