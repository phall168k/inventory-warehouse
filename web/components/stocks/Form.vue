<script setup lang="ts">
  import type { FormData, IExternalError } from '~/types/crud'
  import { formatError } from '~/utils/crud'

  const props = withDefaults(defineProps<{ formRef: FormData; externalErrors?: IExternalError[] }>(), {
    externalErrors: () => [],
  })
  const { t, locale } = useI18n()
  const product = props.formRef.product as ISelectOption | undefined
  const warehouse = props.formRef.warehouse as ISelectOption | undefined
  const displayName = (item?: ISelectOption) => item
    ? (locale.value === 'km' ? item.nameKh || item.nameEn : item.nameEn || item.nameKh) || '—'
    : '—'

  const fields = [
    { key: 'minStock', label: 'product.min_stock', min: 0 },
    { key: 'receiveQuantity', label: 'product.receive_quantity', min: 0 },
    { key: 'issueQuantity', label: 'product.issue_quantity', min: 0 },
    { key: 'transferQuantity', label: 'product.transfer_quantity', min: undefined },
    { key: 'adjustmentQuantity', label: 'product.adjustment_quantity', min: undefined },
  ] as const
  const values: FormData = {
    productId: props.formRef.productId,
    warehouseId: props.formRef.warehouseId,
    status: props.formRef.status ?? true,
  }
  for (const field of fields) {
    const value = props.formRef[field.key]
    values[field.key] = value == null || value === '' ? null : Number(value)
  }
  for (const key of Object.keys(props.formRef)) delete props.formRef[key]
  Object.assign(props.formRef, values)

  const numberRules = computed(() => [
    { required: true, type: 'number' as const, message: t('product.required'), trigger: 'change' },
  ])
</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
    <el-form-item :label="$t('product.title')">
      <el-input :model-value="displayName(product)" disabled />
    </el-form-item>
    <el-form-item :label="$t('warehouse.title')">
      <el-input :model-value="displayName(warehouse)" disabled />
    </el-form-item>
    <el-form-item
      v-for="field in fields"
      :key="field.key"
      :label="$t(field.label)"
      :prop="field.key"
      :rules="numberRules"
      :error="formatError(field.key, externalErrors)"
    >
      <el-input-number
        v-model="formRef[field.key] as number | null"
        :min="field.min"
        :precision="5"
        class="!w-full"
      />
    </el-form-item>
    <el-form-item :label="$t('product.status')" prop="status" :error="formatError('status', externalErrors)">
      <el-switch v-model="formRef.status as boolean" :aria-label="$t('product.status')" />
    </el-form-item>
  </div>
</template>
