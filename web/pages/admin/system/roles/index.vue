<script setup lang="ts">
import Table from '~/components/Table.vue'
import RolesForm from '~/components/roles/Form.vue'
import type { TableHeader } from '~/types/crud'

definePageMeta({ title: 'role.title', permission: 'role-read' })

const headers: TableHeader[] = [
  { 
    title: 'role.name_en', 
    key: 'nameEn', 
    filterOption: { 
      type: 'text', 
      label: 'role.name_en' 
    } 
  },
  { 
    title: 'role.name_kh', 
    key: 'nameKh', 
    filterOption: { 
      type: 'text', 
      label: 'role.name_kh' 
    } 
  },
  {
    title: 'role.permissions', 
    key: 'permissions',
    form: { 
      type: 'select', 
      multiple: true, 
      defaultValue: [] 
    },
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
      title: 'role.title', 
      description: 'role.description' 
    }"
    crud-path="admin/system/roles"
    module-name="role"
    :dialog-options="{ 
      fullscreen: true,
    }"
  >
    <template #form="{ 
      formRef, 
      externalErrors 
    }">
      <RolesForm 
        :form-ref="formRef" 
        :external-errors="externalErrors" 
      />
    </template>

    <template #item.permissions="{ item }">
      <div 
        class="bg-gray-100 h-[30px] w-[30px] rounded-full flex items-center justify-center"
      >
        {{ item?.permissions?.length }}
      </div>
    </template>
  </Table>
</template>
