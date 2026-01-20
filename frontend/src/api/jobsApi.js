import api from "./index";

export const jobsApi = {
  async fetchJobs() {
    const response = await api.get("/jobs");
    return response.data;
  },

  async fetchMyJobs() {
    const response = await api.get("/jobs/my-jobs");
    return response.data;
  },

  async applyToJob(jobId) {
    const response = await api.post("/applications", { jobId });
    return response.data;
  },

  async fetchMyApplications() {
    const response = await api.get("/applications");
    console.log(response);
    return response.data;
  },

  async createJob(jobData) {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  async updateJob(jobId, jobData) {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  async deleteJob(jobId) {
    return api.delete(`/jobs/${jobId}`);
  },
};
