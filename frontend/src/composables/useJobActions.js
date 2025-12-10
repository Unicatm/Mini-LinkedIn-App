import { ref } from "vue";
import { useJobStore } from "@/stores/jobStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "primevue/usetoast";

export function useJobActions() {
  const jobStore = useJobStore();
  const authStore = useAuthStore();
  const toast = useToast();

  const applyingJobId = ref(null);

  const handleApply = async (jobId) => {
    if (!authStore.isCandidate) {
      toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Only candidates can apply to jobs.",
        life: 3000,
      });
      return;
    }

    if (jobStore.hasAppliedTo(jobId)) {
      toast.add({
        severity: "info",
        summary: "Info",
        detail: "You have already applied to this job.",
        life: 3000,
      });
      return;
    }

    applyingJobId.value = jobId;

    try {
      await jobStore.applyToJob(jobId);

      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Application sent successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Could not apply.",
        life: 3000,
      });
    } finally {
      applyingJobId.value = null;
    }
  };

  return {
    applyingJobId,
    handleApply,
  };
}
