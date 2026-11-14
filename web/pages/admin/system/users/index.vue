<script setup lang="ts">
  import Table from '~/components/Table.vue'
  import UserForm from '~/components/users/Form.vue'
  import type { TableHeader } from '~/types/crud'

  definePageMeta({ 
    title: 'user.title',
    permission: 'user-read',
  });

  const headers: TableHeader[] = [
    { 
      title: 'user.name_en', 
      key: 'nameEn', 
      filterOption: { 
        type: 'text', 
        label: 'user.name_en' 
      } 
    },
    { 
      title: 'user.name_kh', 
      key: 'nameKh', 
      filterOption: { 
        type: 'text', 
        label: 'user.name_kh' 
      } 
    },
    { 
      title: 'user.username', 
      key: 'username', 
      filterOption: { 
        type: 'text', 
        label: 'user.username' 
      } 
    },
    { 
      title: 'user.email', 
      key: 'email', 
      filterOption: { 
        type: 'text', 
        label: 'user.email' 
      } 
    },
    { 
      title: 'user.status', 
      key: 'isActive', 
      filterOption: { 
        type: 'boolean', 
        label: 'user.status' 
      } 
    },
    { 
      title: 'app.actions', 
      key: 'action' 
    },
  ];
</script>

<template>
  <Table 
    :headers="headers" 
    :page-header="{ 
      title: 'user.title', 
      description: 'user.description' 
    }" 
    crud-path="admin/system/users"
    :dialog-options="{
      fullscreen: true,
    }"
  >
    <template 
      #form="{ 
        formRef, 
        externalErrors 
      }"
    >
      <UserForm 
        :form-ref="formRef" 
        :external-errors="externalErrors" 
      />
    </template>
    <template #item.isActive="{ item }">
      <div>
        <el-switch
          v-model="item.isActive"
          size="default"
        />
      </div>
    </template>
  </Table>
</template>
