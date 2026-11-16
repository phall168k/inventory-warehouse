<script setup lang="ts">
import Table from '~/components/Table.vue'
import type { TableHeader } from '~/types/crud'

  definePageMeta({ 
    title: 'uom.title', 
    permission: 'uom-read', 
  });

  const headers: TableHeader[] = [
    { 
      title: 'uom.code', 
      key: 'code', 
      filterOption: 
      { 
        type: 'text', 
        label: 'uom.code' 
      } 
    },
    { 
      title: 'uom.name_en', 
      key: 'nameEn', 
      filterOption: { 
        type: 'text', 
        label: 'uom.name_en' 
      } 
    },
    { 
      title: 'uom.name_kh', 
      key: 'nameKh', 
      filterOption: { 
        type: 'text', 
        label: 'uom.name_kh' 
      } 
    },
    { 
      title: 'uom.created_by', 
      key: 'createdBy', 
      filterOption: { 
        type: 'text', 
        label: 'uom.created_by' 
      } 
    },
    { 
      title: 'app.created_at', 
      key: 'createdAt', 
      filterOption: { 
        type: 'date', 
        label: 'app.created_at' 
      } 
    },
    { 
      title: 'uom.status', 
      key: 'status', 
      filterOption: { 
        type: 'boolean', 
        label: 'uom.status' 
      } 
    },
    { 
      title: 'app.actions', 
      key: 'action' 
    },
  ]
</script>

<template>
  <Table
    :headers="headers"
    :page-header="{ 
      title: 'uom.title', 
      description: 'uom.description' 
    }"
    crud-path="admin/master-data/uoms"
    module-name="uom"
    :dialog-options="{ 
      width: 850 
    }"
  >
    <template #form="{ formRef, externalErrors }">
      <UomsForm :form-ref="formRef" :external-errors="externalErrors" />
    </template>
    <template #item.createdBy="{ item }">
      <span>{{ item.createdBy[$t('app.name_lang')] ?? '-' }}</span>
    </template>
    <template #item.status="{ item }">
      <el-switch
        :model-value="item.status as boolean"
         style="--el-switch-on-color: #4B9567; --el-switch-off-color: #ff4949"
      />
    </template>
    <template #item.createdAt="{ item }">
      {{ formatDateTime(item.createdAt) }}
    </template>
  </Table>
</template>
