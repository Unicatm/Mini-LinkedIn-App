<template>
  <Card class="shadow-1 border-round-xl">
    <template #title>Applications History</template>
    <template #content>
      <DataTable
        :value="applications"
        responsiveLayout="scroll"
        :rows="5"
        paginator
      >
        <Column field="jobSnapshot.title" header="Job"></Column>
        <Column field="jobSnapshot.companyName" header="Company"></Column>
        <Column header="Applied at">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.appliedAt) }}
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status"
              :severity="getStatusSeverity(slotProps.data.status)"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { Card, DataTable, Column, Tag } from "primevue";

const props = defineProps({
  applications: Array,
});

const getStatusSeverity = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "info";
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  const date = timestamp._seconds
    ? new Date(timestamp._seconds * 1000)
    : new Date(timestamp);
  return date.toLocaleDateString("ro-RO");
};
</script>
