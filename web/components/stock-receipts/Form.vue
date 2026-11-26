<script setup lang="ts">
import type { FormData, IExternalError } from '~/types/crud'
import { errorMessage, formatError } from '~/utils/crud'

type ReceiptItem = { id?: string; productId: string; quantity: number | null; unitCost: number | null; note: string }
const props = withDefaults(defineProps<{ formRef: FormData; externalErrors?: IExternalError[] }>(), { externalErrors: () => [] })
const { t, locale } = useI18n()
const app = useNuxtApp()
const existingItems = (props.formRef.items as (ReceiptItem & { product?: ISelectOption })[] | undefined) ?? []
const warehouse = props.formRef.warehouse as ISelectOption | undefined
const options = reactive<{ warehouses: ISelectOption[]; products: ISelectOption[]; categories: ISelectOption[] }>({
  warehouses: warehouse ? [warehouse] : [],
  products: [],
  categories: [],
})
const knownProducts = ref<ISelectOption[]>(existingItems.flatMap(item => item.product ? [item.product] : []))
const values = {
  documentNumber: props.formRef.documentNumber || '',
  warehouseId: props.formRef.warehouseId || warehouse?.id || '',
  receiptDate: props.formRef.receiptDate || '',
  referenceNo: props.formRef.referenceNo || '',
  description: props.formRef.description || '',
  status: props.formRef.status || 'DRAFT',
  totalQuantity: 0,
  attachments: props.formRef.attachments ?? [],
  items: existingItems.map(item => ({
    ...(item.id ? { id: item.id } : {}), productId: item.productId,
    quantity: item.quantity == null ? null : Number(item.quantity),
    unitCost: item.unitCost == null ? null : Number(item.unitCost), note: item.note ?? '',
  })),
}
if (!values.items.length) values.items.push({ productId: '', quantity: null, unitCost: null, note: '' })
for (const key of Object.keys(props.formRef)) delete props.formRef[key]
Object.assign(props.formRef, values)
const items = computed(() => props.formRef.items as ReceiptItem[])
watch(items, rows => { props.formRef.totalQuantity = Number(rows.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0).toFixed(5)) }, { deep: true, immediate: true })
const required = computed(() => [{ required: true, message: t('stock_receipt.required'), trigger: 'change' }])
const productRules = computed(() => [
  ...required.value,
  {
    validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
      callback(value && items.value.filter(item => item.productId === value).length > 1
        ? new Error(t('stock_receipt.duplicate_product')) : undefined)
    },
    trigger: 'change',
  },
])
const productError = (id: string, index: number) => id && items.value.filter(item => item.productId === id).length > 1
  ? t('stock_receipt.duplicate_product') : formatError(`items.${index}.productId`, props.externalErrors)
const textRequired = computed(() => [{ required: true, whitespace: true, message: t('stock_receipt.required'), trigger: 'blur' }])
const positive = computed(() => [{ required: true, type: 'number' as const, min: 0.00001, message: t('stock_receipt.positive'), trigger: 'change' }])
const loading = reactive({ warehouses: false, products: false, categories: false })
const errors = reactive({ warehouses: '', products: '', categories: '' })
const categoryId = ref('')
const activeTab = ref('items')
let productRequest = 0
let disposed = false
async function loadOptions(key: 'warehouses' | 'products' | 'categories') {
  const request = key === 'products' ? ++productRequest : 0
  if (key === 'products' && !props.formRef.warehouseId) {
    options.products = []
    loading.products = false
    errors.products = ''
    return
  }
  loading[key] = true
  errors[key] = ''
  try {
    const path = key === 'products' ? 'v1/admin/inventory/stocks/select-options' : `v1/admin/master-data/${key}/select-options`
    const query = key === 'products' ? { warehouseId: props.formRef.warehouseId as string, ...(categoryId.value ? { categoryId: categoryId.value } : {}) } : undefined
    const response = await app.runWithContext(() => useApi<ISelectOption[]>(path, { query }))
    if (disposed || (key === 'products' && request !== productRequest)) return
    options[key] = response.payload
    if (key === 'products') {
      for (const product of response.payload) {
        const index = knownProducts.value.findIndex(item => item.id === product.id)
        if (index < 0) knownProducts.value.push(product)
        else knownProducts.value[index] = product
      }
    }
    if (key === 'warehouses' && warehouse && !options.warehouses.some(item => item.id === warehouse.id)) options.warehouses.push(warehouse)
  } catch (error) {
    if (!disposed && (key !== 'products' || request === productRequest)) errors[key] = errorMessage(error)
  } finally {
    if (!disposed && (key !== 'products' || request === productRequest)) loading[key] = false
  }
}
watch(() => props.formRef.warehouseId, (value, previous) => {
  if (value !== previous) {
    for (const item of items.value) item.productId = ''
    categoryId.value = ''
  }
  void loadOptions('products')
})
watch(categoryId, () => { void loadOptions('products') })
onMounted(() => { void loadOptions('warehouses'); void loadOptions('categories'); void loadOptions('products') })
onBeforeUnmount(() => { disposed = true; productRequest++ })
type UploadFile = { fileName: string; originalName?: string; size?: number; isImage?: boolean }
const attachments = computed<UploadFile[]>({
  get: () => ((props.formRef.attachments ?? []) as IAttachment[]).map(item => ({ fileName: item.code, originalName: item.file.name, size: item.file.size, isImage: item.isImage })),
  set: files => { props.formRef.attachments = files.map(file => ({ ...((props.formRef.attachments as IAttachment[]).find(item => item.code === file.fileName) ?? {}), code: file.fileName, file: { name: file.originalName || file.fileName, ...(file.size == null ? {} : { size: file.size }) }, isImage: file.isImage ?? false })) },
})
const label = (item: ISelectOption) => locale.value === 'km' ? item.nameKh || item.nameEn : item.nameEn || item.nameKh
const addItem = () => items.value.push({ productId: '', quantity: null, unitCost: null, note: '' })
const removeItem = (index: number) => items.value.splice(index, 1)
</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
    <el-form-item :label="$t('stock_receipt.document_number')" prop="documentNumber" :rules="textRequired" :error="formatError('documentNumber', externalErrors)">
      <el-input v-model="formRef.documentNumber as string" :maxlength="150" />
    </el-form-item>
    <el-form-item :label="$t('warehouse.title')" prop="warehouseId" :rules="required" :error="formatError('warehouseId', externalErrors)">
      <div class="w-full space-y-2">
        <el-alert v-if="errors.warehouses" :title="errors.warehouses" type="error" :closable="false"><el-button text @click="loadOptions('warehouses')">{{ $t('product.retry') }}</el-button></el-alert>
        <el-select v-model="formRef.warehouseId as string" filterable :loading="loading.warehouses" :disabled="!!errors.warehouses" :placeholder="$t('stock_receipt.select_warehouse')" class="w-full">
          <el-option v-for="option in options.warehouses" :key="option.id" :value="option.id" :label="label(option)" />
        </el-select>
      </div>
    </el-form-item>
    <el-form-item :label="$t('stock_receipt.receipt_date')" prop="receiptDate" :rules="required" :error="formatError('receiptDate', externalErrors)">
      <el-date-picker v-model="formRef.receiptDate as string" type="date" value-format="YYYY-MM-DD" class="!w-full" />
    </el-form-item>
    <el-form-item :label="$t('stock_receipt.reference_no')" prop="referenceNo" :rules="textRequired" :error="formatError('referenceNo', externalErrors)">
      <el-input v-model="formRef.referenceNo as string" :maxlength="150" />
    </el-form-item>
    <el-form-item :label="$t('stock_receipt.description_field')" prop="description" :error="formatError('description', externalErrors)" class="md:col-span-2">
      <el-input v-model="formRef.description as string" type="textarea" :maxlength="250" show-word-limit />
    </el-form-item>
    <div class="md:col-span-2">
      <el-tabs v-model="activeTab" type="border-card" class="!w-full">
        <el-tab-pane :label="$t('stock_receipt.items')" name="items">
          <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div class="w-full max-w-xs">
              <label class="mb-1 block">{{ $t('product.category') }}</label>
              <el-alert v-if="errors.categories" :title="errors.categories" type="error" :closable="false"><el-button text @click="loadOptions('categories')">{{ $t('product.retry') }}</el-button></el-alert>
              <el-select v-model="categoryId" clearable filterable :loading="loading.categories" :placeholder="$t('product.select_category')" class="w-full">
                <el-option v-for="option in options.categories" :key="option.id" :value="option.id" :label="label(option)" />
              </el-select>
            </div>
          </div>
          <el-alert v-if="errors.products" :title="errors.products" type="error" :closable="false" class="mb-4"><el-button text @click="loadOptions('products')">{{ $t('product.retry') }}</el-button></el-alert>
          <el-table :data="items" border>
            <el-table-column 
              :label="$t('app.actions')" 
              width="120"
              align="center"
            >
              <template #header>
                <el-button 
                  type="primary" 
                  plain 
                  round
                  @click="addItem"
                  class="w-[20px] h-[30px]"
                >
                  <Icon name="carbon:add-alt"/>
                </el-button>
              </template>
              <template #default="{ $index }">
                <el-button 
                  type="danger" 
                  plain 
                  round
                  :disabled="items.length === 1" 
                  @click="removeItem($index)"
                  class="w-[30px] h-[30px]"
                >
                  <Icon name="ep:delete"/>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column :label="$t('product.title')" min-width="220">
              <template #default="{ row, $index }">
                <el-form-item :prop="`items.${$index}.productId`" :rules="productRules" :error="productError(row.productId, $index)">
                  <el-select v-model="row.productId" filterable :loading="loading.products" :disabled="!formRef.warehouseId || !!errors.products" :placeholder="$t('stock_receipt.select_product')" class="w-full">
                    <el-option v-for="option in options.products" :key="option.id" :value="option.id" :label="label(option)" :disabled="option.id !== row.productId && items.some(item => item.productId === option.id)" />
                    <el-option v-for="option in knownProducts.filter(item => item.id === row.productId && !options.products.some(product => product.id === item.id))" :key="option.id" :value="option.id" :label="label(option)" disabled />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('stock_receipt.quantity')" min-width="180">
              <template #default="{ row, $index }"><el-form-item :prop="`items.${$index}.quantity`" :rules="positive" :error="formatError(`items.${$index}.quantity`, externalErrors)"><el-input-number v-model="row.quantity" :min="0.00001" :precision="5" class="!w-full" /></el-form-item></template>
            </el-table-column>
            <el-table-column :label="$t('stock_receipt.unit_cost')" min-width="180">
              <template #default="{ row, $index }"><el-form-item :prop="`items.${$index}.unitCost`" :rules="positive" :error="formatError(`items.${$index}.unitCost`, externalErrors)"><el-input-number v-model="row.unitCost" :min="0.00001" :precision="5" class="!w-full" /></el-form-item></template>
            </el-table-column>
            <el-table-column :label="$t('stock_receipt.note')" min-width="180">
              <template #default="{ row, $index }"><el-form-item :prop="`items.${$index}.note`" :error="formatError(`items.${$index}.note`, externalErrors)"><el-input v-model="row.note" :maxlength="250" /></el-form-item></template>
            </el-table-column>
          </el-table>
          <p class="mt-4 text-right font-semibold">{{ $t('stock_receipt.total_quantity') }}: {{ formRef.totalQuantity }}</p>
        </el-tab-pane>
        <el-tab-pane 
          :label="$t('stock_receipt.attachments')" 
          name="attachments"
        >
          <el-form-item 
            prop="attachments" 
            :error="formatError('attachments', externalErrors)"
          >
            <DropZone 
              v-model="attachments" 
              class="w-full"
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
