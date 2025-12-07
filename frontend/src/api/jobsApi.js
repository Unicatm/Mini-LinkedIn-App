import api from "./index";

export const jobsApi = {
  async fetchJobs() {
    const response = await api.get("/jobs");
    return response.data;
  },

  async applyToJob(jobId) {
    const response = await api.post("/applications", { jobId });
    return response.data;
  },

  async fetchMyApplications() {
    const response = await api.get("/applications");
    return response.data;
  },

  async createJob(jobData) {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  async deleteJob(jobId) {
    return api.delete(`/jobs/${jobId}`);
  },
};
