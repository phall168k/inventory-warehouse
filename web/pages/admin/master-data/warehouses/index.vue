<script setup lang="ts">
import Table from '~/components/Table.vue'
import WarehousesForm from '~/components/warehouses/Form.vue'
import type { TableHeader } from '~/types/crud'

definePageMeta({ title: 'warehouse.title', permission: 'warehouse-read' })

const headers: TableHeader[] = [
  { title: 'warehouse.code', key: 'code', filterOption: { type: 'text', label: 'warehouse.code' } },
  { title: 'warehouse.name_en', key: 'nameEn', filterOption: { type: 'text', label: 'warehouse.name_en' } },
  { title: 'warehouse.name_kh', key: 'nameKh', filterOption: { type: 'text', label: 'warehouse.name_kh' } },
  { title: 'warehouse.manager', key: 'manager.nameEn', form: false },
  { title: 'warehouse.address', key: 'address' },
  { title: 'warehouse.contact_number', key: 'contactNumber' },
  { title: 'warehouse.logo', key: 'logo', form: false, format: value => (value as IWarehouseAttachment | null)?.url || '—' },
  { title: 'app.actions', key: 'action' },
]
</script>

<template>
  <Table
    :headers="headers"
    :page-header="{ title: 'warehouse.title', description: 'warehouse.description' }"
    crud-path="admin/master-data/warehouses"
    module-name="warehouse"
    :dialog-options="{ width: 850 }"
  >
    <template #form="{ formRef, externalErrors }">
      <WarehousesForm :form-ref="formRef" :external-errors="externalErrors" />
    </template>
    <template #item.logo="{ item }">
      <el-image v-if="item.logo?.url && item.logo?.isImage" :src="item.logo.url" :alt="$t('warehouse.logo')" fit="contain" class="h-10 w-10 rounded-lg">
        <template #error><span class="text-xs text-slate-400">—</span></template>
      </el-image>
      <span v-else>—</span>
    </template>
  </Table>
</template>
