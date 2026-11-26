<script setup lang="ts">
import Table from '~/components/Table.vue'
import type { TableHeader } from '~/types/crud'

definePageMeta({ title: 'stock_receipt.title', permission: 'stock-receipt-read' })
const headers: TableHeader[] = [
  { title: 'stock_receipt.document_number', key: 'documentNumber', filterOption: { type: 'text', label: 'stock_receipt.document_number' } },
  { title: 'warehouse.title', key: 'warehouse' },
  { title: 'stock_receipt.receipt_date', key: 'receiptDate' },
  { title: 'stock_receipt.reference_no', key: 'referenceNo' },
  { title: 'stock_receipt.total_quantity', key: 'totalQuantity' },
  { title: 'product.status', key: 'status' },
  { title: 'product.created_by', key: 'createdBy' },
  { title: 'app.actions', key: 'action' },
]
</script>

<template>
  <Table :headers="headers" :page-header="{ title: 'stock_receipt.title', description: 'stock_receipt.description' }"
    crud-path="admin/inventory/stock-receipts" module-name="stock-receipt" :dialog-options="{ fullscreen: true }">
    <template #form="{ formRef, externalErrors }">
      <StockReceiptsForm :form-ref="formRef" :external-errors="externalErrors" />
    </template>
    <template #item.warehouse="{ item }">{{ item.warehouse?.[$t('app.name_lang')] ?? '—' }}</template>
    <template #item.createdBy="{ item }">{{ item.createdBy?.[$t('app.name_lang')] ?? '—' }}</template>
  </Table>
</template>
