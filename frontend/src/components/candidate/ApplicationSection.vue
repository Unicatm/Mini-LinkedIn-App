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
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { Card, DataTable, Column, Tag } from "primevue";

const props = defineProps({
  applications: Array,
});

const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  const date = timestamp._seconds
    ? new Date(timestamp._seconds * 1000)
    : new Date(timestamp);
  return date.toLocaleDateString("ro-RO");
};
</script>
