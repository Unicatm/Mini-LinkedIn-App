import api from "./index";

export const jobsApi = {
  async fetchJobs(query = "") {
    const response = await api.get(`/jobs${query}`);
    // console.log(response);
    return response.data;
  },

  async getJobById(jobId) {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  async fetchMyJobs() {
    const response = await api.get("/jobs/my-jobs");
    return response.data;
  },

  async applyToJob(jobId, file) {
    const formData = new FormData();
    formData.append("jobId", jobId);

    if (file) {
      formData.append("file", file);
    }

    const response = await api.post(`/applications`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async fetchMyApplications() {
    const response = await api.get("/applications");
    // console.log(response);
    return response.data;
  },

  async fetchApplicationsForJob(jobId) {
    const response = await api.get(`/applications/job/${jobId}`);
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
