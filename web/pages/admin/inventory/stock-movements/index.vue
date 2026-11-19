<script setup lang="ts">
    import Table from '~/components/Table.vue'
    import type { TableHeader } from '~/types/crud'

    definePageMeta({ 
        title: 'stock_movement.title', 
        permission: 'stock-movement-read', 
    });

    const headers: TableHeader[] = [
        { 
            title: 'warehouse.title', 
            key: 'warehouse', 
            filterOption: { 
                type: 'text', 
                label: 'warehouse.title' 
            } 
        },
        { 
            title: 'product.code', 
            key: 'product.code', 
            filterOption: { 
                type: 'text', 
                label: 'product.code' 
            } 
        },
        { 
            title: 'product.title', 
            key: 'product.nameEn', 
            filterOption: { 
                type: 'text', 
                label: 'product.name_en' 
            } 
        },
        { 
            title: 'stock_movement.movement_type', 
            key: 'movementType' 
        },
        { 
            title: 'stock_movement.reference_type', 
            key: 'referenceType' 
        },
        { 
            title: 'stock_movement.quantity_change', 
            key: 'quantityChange' 
        },
        { 
            title: 'stock_movement.balance_after', 
            key: 'balanceAfter' 
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
            title: 'app.actions', 
            key: 'action' 
        },
    ];
 
</script>

<template>
  <Table
    :headers="headers"
    :page-header="{ 
      title: 'stock_movement.title', 
      description: 'stock_movement.description' 
    }"
    crud-path="admin/inventory/stock-movements"
    module-name="stock-movement"
    :dialog-options="{ 
      width: 850 
    }"
    :show-create-button="false"
    :show-delete-button="false"
    :show-edit-button="false"
    
  >
    <template #form="{ formRef, externalErrors }">
      <StocksForm :form-ref="formRef" :external-errors="externalErrors" />
    </template>
    <template #item.warehouse="{ item }">
      <span>{{ item.warehouse?.[$t('app.name_lang')] ?? '-' }}</span>
    </template>
    <template #item.createdBy="{ item }">
      <span>{{ item.createdBy?.[$t('app.name_lang')] ?? '-' }}</span>
    </template>
    <template #item.createdAt="{ item }">
      {{ formatDateTime(item.createdAt) }}
    </template>
  </Table>
</template>
