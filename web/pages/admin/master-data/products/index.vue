<script setup lang="ts">
import Table from '~/components/Table.vue'
import type { TableHeader } from '~/types/crud'

  definePageMeta({ 
    title: 'product.title', 
    permission: 'product-read', 
  });

  const headers: TableHeader[] = [
    { title: 'product.thumbnail', key: 'thumbnail', width: 110, form: false },
    { 
      title: 'product.code', 
      key: 'code', 
      filterOption: 
      { 
        type: 'text', 
        label: 'product.code' 
      } 
    },
    { 
      title: 'product.name_en', 
      key: 'nameEn', 
      filterOption: { 
        type: 'text', 
        label: 'product.name_en' 
      } 
    },
    { 
      title: 'category.title', 
      key: 'category', 
    },
    { 
      title: 'uom.title', 
      key: 'uom', 
    },
    { 
      title: 'product.name_kh', 
      key: 'nameKh', 
      filterOption: { 
        type: 'text', 
        label: 'product.name_kh' 
      } 
    },
    { 
      title: 'product.created_by', 
      key: 'createdBy', 
      filterOption: { 
        type: 'text', 
        label: 'product.created_by' 
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
      title: 'product.status', 
      key: 'status', 
      form: { defaultValue: true },
      filterOption: { 
        type: 'boolean', 
        label: 'product.status' 
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
      title: 'product.title', 
      description: 'product.description' 
    }"
    crud-path="admin/master-data/products"
    module-name="product"
    :dialog-options="{ 
      width: 850 
    }"
  >
    <template #form="{ formRef, externalErrors }">
      <ProductsForm 
        :form-ref="formRef" 
        :external-errors="externalErrors" 
      />
    </template>
    <template #item.thumbnail="{ item, viewing }">
      <Thumbnail :thumbnail="item.thumbnail" :size="viewing ? 160 : 48" />
    </template>
    <template #item.createdBy="{ item }">
      <span>{{ item.createdBy?.[$t('app.name_lang')] ?? '-' }}</span>
    </template>
    <template #item.category="{ item }">
      <span>{{ item.category?.[$t('app.name_lang')] ?? '-' }}</span>
    </template>
    <template #item.uom="{ item }">
      <span>{{ item.uom?.[$t('app.name_lang')] ?? '-' }}</span>
    </template>
    <template #item.status="{ item }">
      <el-switch
        :model-value="item.status as boolean"
        disabled
         style="--el-switch-on-color: #4B9567; --el-switch-off-color: #ff4949"
      />
    </template>
    <template #item.createdAt="{ item }">
      {{ formatDateTime(item.createdAt) }}
    </template>
  </Table>
</template>
