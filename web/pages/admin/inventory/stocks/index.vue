<script setup lang="ts">
    import Table from '~/components/Table.vue'
    import type { TableHeader } from '~/types/crud'

    definePageMeta({ 
        title: 'stock.title', 
        permission: 'stock-read', 
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
            title: 'product.name_en', 
            key: 'product.nameEn', 
            filterOption: { 
                type: 'text', 
                label: 'product.name_en' 
            } 
        },
        { 
            title: 'product.name_kh', 
            key: 'product.nameKh', 
            filterOption: { 
                type: 'text', 
                label: 'product.name_kh' 
            } 
        },
        { 
            title: 'stock.min_stock', 
            key: 'minStock' 
        },
        { 
            title: 'stock.stock_quantity', 
            key: 'stockQuantity' 
        },
        { 
            title: 'product.receive_quantity', 
            key: 'receiveQuantity' 
        },
        { 
            title: 'product.transfer_quantity', 
            key: 'transferQuantity' 
        },
        { 
            title: 'product.issue_quantity', 
            key: 'issueQuantity' 
        },
        { 
            title: 'product.adjustment_quantity', 
            key: 'issueQuantity' 
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
            filterOption: { 
                type: 'boolean', 
                label: 'product.status' 
            } 
        },
        { 
            title: 'app.actions', 
            key: 'action' 
        },
    ];

    const stocks = ref<IStockSummary>();
    const loading = ref<boolean>(true);
    const handleGetStockSummary = async () => {
        loading.value = true;
        try {
            const response = await useApi<IStockSummary>('v1/admin/inventory/stocks/summary');
            stocks.value = response.payload;
        } catch (error) {
            console.log('Error', error);
        } finally {
            loading.value = false;
        }
    }

    onMounted(() => {
        handleGetStockSummary();
    });
</script>

<template>
  <Table
    :headers="headers"
    :page-header="{ 
      title: 'stock.title', 
      description: 'stock.description' 
    }"
    crud-path="admin/inventory/stocks"
    module-name="stock"
    :dialog-options="{ 
      width: 850 
    }"
    :show-create-button="false"
    
  >
    <template #summary-header>
        <div 
            class="w-full grid grid-cols-5 gap-4"
            v-loading="loading"
        >
            <StatsCard
                title="stock.total_products"
                :value="stocks?.totalProducts"
                icon="mdi:package-variant"
                color="blue"
            />

            <StatsCard
                title="stock.total_warehouses"
                :value="stocks?.totalWarehouses"
                icon="mdi:warehouse"
                color="purple"
            />

            <StatsCard
                title="stock.total_stock"
                :value="stocks?.totalStocks"
                icon="mdi:archive-outline"
                color="cyan"
            />

            <StatsCard
                title="stock.stock_quantity"
                :value="stocks?.totalStockQuantity"
                icon="mdi:chart-box-outline"
                color="green"
            />

            <StatsCard
                title="stock.low_stock"
                :value="stocks?.lowStockCount"
                icon="mdi:alert-outline"
                color="yellow"
            />

            <StatsCard
                title="stock.out_of_stock"
                :value="stocks?.outOfStockCount"
                icon="mdi:package-variant-remove"
                color="red"
            />

            <StatsCard
                title="product.receive_quantity"
                :value="stocks?.totalReceiveQuantity"
                icon="mdi:tray-arrow-down"
                color="green"
            />

            <StatsCard
                title="product.issue_quantity"
                :value="stocks?.totalIssueQuantity"
                icon="mdi:tray-arrow-up"
                color="orange"
            />

            <StatsCard
                title="product.transfer_quantity"
                :value="stocks?.totalTransferQuantity"
                icon="mdi:swap-horizontal"
                color="blue"
            />

            <StatsCard
                title="product.adjustment_quantity"
                :value="stocks?.totalAdjustmentQuantity"
                icon="mdi:tune-variant"
                color="purple"
            />
        </div>
    </template>
    <template #form="{ formRef, externalErrors }">
      <StocksForm :form-ref="formRef" :external-errors="externalErrors" />
    </template>
    <template #item.warehouse="{ item }">
      <span>{{ item.warehouse?.[$t('app.name_lang')] ?? '-' }}</span>
    </template>
    <template #item.createdBy="{ item }">
      <span>{{ item.createdBy?.[$t('app.name_lang')] ?? '-' }}</span>
    </template>
    <template #item.stockQuantity="{ item }">
      <span>{{ (Number.parseFloat(item.receiveQuantity) + Number.parseFloat(item.transferQuantity) + Number.parseFloat(item.adjustmentQuantity)) - Number.parseFloat(item.issueQuantity) }}</span>
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
