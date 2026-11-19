<script setup lang="ts">
  import { CrudDialogState, type FormData, type IExternalError } from '~/types/crud'
  import { errorMessage, formatError } from '~/utils/crud'

  const props = withDefaults(defineProps<{ 
    formRef: FormData; 
    action: CrudDialogState;
    externalErrors?: IExternalError[] 
  }>(), {
    externalErrors: () => [],
  })
  const { t, locale } = useI18n()
  const app = useNuxtApp()
  const category = props.formRef.category as ISelectOption | undefined
  const uom = props.formRef.uom as ISelectOption | undefined
  const isCreate = props.action === CrudDialogState.creating
  const activeTab = ref('warehouses')
  const stocks = (props.formRef.stocks ?? []) as { warehouseId: string; warehouse?: ISelectOption }[]
  const existingWarehouseIds = stocks.map(stock => stock.warehouseId)
  const stockFields = [
    { key: 'minStock', label: 'product.min_stock' },
    { key: 'receiveQuantity', label: 'product.receive_quantity' },
    { key: 'issueQuantity', label: 'product.issue_quantity' },
    { key: 'transferQuantity', label: 'product.transfer_quantity' },
    { key: 'adjustmentQuantity', label: 'product.adjustment_quantity' },
  ] as const
  const values = {
    code: props.formRef.code ?? '',
    nameEn: props.formRef.nameEn ?? '',
    nameKh: props.formRef.nameKh ?? '',
    categoryId: props.formRef.categoryId ?? category?.id ?? null,
    uomId: props.formRef.uomId ?? uom?.id ?? null,
    status: props.formRef.status ?? true,
    thumbnail: props.formRef.thumbnail ?? null,
    warehouseIds: props.formRef.warehouseIds ?? existingWarehouseIds,
    ...(isCreate ? {
      minStock: props.formRef.minStock ?? 0,
      receiveQuantity: props.formRef.receiveQuantity ?? 0,
      issueQuantity: props.formRef.issueQuantity ?? 0,
      transferQuantity: props.formRef.transferQuantity ?? 0,
      adjustmentQuantity: props.formRef.adjustmentQuantity ?? 0,
    } : {}),
  }
  for (const key of Object.keys(props.formRef)) delete props.formRef[key]
  Object.assign(props.formRef, values)

  const requiredRules = computed(() => [
    { 
      required: true, 
      whitespace: true, 
      message: t('product.required'), 
      trigger: 'blur' 
    }
  ]);
  const selectRules = computed(() => [
    { required: true, 
      message: t('product.required'), 
      trigger: 'change' 
    }
  ]);
  const warehouseRules = computed(() => [
    { type: 'array' as const, required: true, min: 1, message: t('product.required'), trigger: 'change' },
  ])
  const relations = [
    { 
      key: 'categoryId', 
      resource: 'categories', 
      label: 'product.category', 
      placeholder: 'product.select_category' 
    },
    { 
      key: 'uomId', 
      resource: 'uoms', 
      label: 'product.uom', 
      placeholder: 'product.select_uom'
    },
    {
      key: 'warehouseIds',
      resource: 'warehouses',
      label: 'product.warehouses',
      placeholder: 'product.select_warehouses',
    },
  ] as const;

  const options = reactive<Record<string, ISelectOption[]>>({ 
    categoryId: category ? [category] : [], 
    uomId: uom ? [uom] : [],
    warehouseIds: stocks.flatMap(stock => stock.warehouse ? [stock.warehouse] : []),
  });

  const selectedWarehouseIds = computed(() => props.formRef.warehouseIds as string[])
  const selectedWarehouseCount = computed(() => options.warehouseIds.filter(item => selectedWarehouseIds.value.includes(item.id)).length)
  const allWarehousesSelected = computed(() => options.warehouseIds.length > 0 && selectedWarehouseCount.value === options.warehouseIds.length)
  const someWarehousesSelected = computed(() => selectedWarehouseCount.value > 0 && !allWarehousesSelected.value)
  const toggleAllWarehouses = (checked: boolean | string | number) => {
    const availableIds = options.warehouseIds.map(item => item.id)
    props.formRef.warehouseIds = checked
      ? [...new Set([...selectedWarehouseIds.value, ...availableIds])]
      : selectedWarehouseIds.value.filter(id => !availableIds.includes(id))
  }

  const loading = reactive<Record<string, boolean>>({})
  const errors = reactive<Record<string, string>>({})
  let disposed = false
  const loadOptions = async (relation: typeof relations[number]) => {
    const key = relation.key
    if (loading[key]) return
    loading[key] = true
    errors[key] = ''
    try {
      const response = await app.runWithContext(() => useApi<ISelectOption[]>(`v1/admin/master-data/${relation.resource}/select-options`))
      if (disposed) return
      const selectedIds = key === 'warehouseIds' ? (props.formRef.warehouseIds as string[]) : [props.formRef[key]]
      const selected = options[key]?.filter(item => selectedIds.includes(item.id)) ?? []
      options[key] = response.payload
      for (const item of selected) if (!options[key].some(option => option.id === item.id)) options[key].unshift(item)
    } catch (error) {
      if (!disposed) errors[key] = errorMessage(error)
    } finally {
      if (!disposed) loading[key] = false
    }
  }
  onMounted(() => Promise.allSettled(relations.map(loadOptions)))
  onBeforeUnmount(() => { disposed = true })

  const thumbnailCode = computed<string | null>({
    get: () => (props.formRef.thumbnail as IAttachment | null)?.code ?? null,
    set(code) {
      if (!code) {
        props.formRef.thumbnail = null
        return
      }
      const current = props.formRef.thumbnail as IAttachment | null
      if (current?.code === code) return
      props.formRef.thumbnail = {
        code,
        file: { name: code },
        isImage: /\.(png|jpe?g)$/i.test(code),
      } satisfies IAttachment
    },
  })
</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
    <el-form-item 
      :label="$t('product.code')" 
      prop="code" class="md:col-span-2" 
      :rules="requiredRules" 
      :error="formatError('code', externalErrors)"
    >
      <el-input 
        :model-value="formRef.code as string" 
        :maxlength="150" 
        @update:model-value="formRef.code = $event" 
      />
    </el-form-item>
    <el-form-item 
      v-for="field in ['nameEn', 'nameKh']" 
      :key="field" 
      :label="$t(field === 'nameEn' ? 'product.name_en' : 'product.name_kh')" 
      :prop="field" :rules="requiredRules" 
      :error="formatError(field, externalErrors)"
    >
      <el-input 
        :model-value="formRef[field] as string" 
        :maxlength="250" 
        @update:model-value="formRef[field] = $event" 
      />
    </el-form-item>
    <el-form-item 
      v-for="relation in relations.filter(item => item.key !== 'warehouseIds')"
      :key="relation.key" 
      :label="$t(relation.label)" 
      :prop="relation.key" 
      :rules="selectRules"
      :error="formatError(relation.key, externalErrors)"
    >
      <div class="w-full space-y-2">
        <el-alert 
          v-if="errors[relation.key]" 
          :title="errors[relation.key]" 
          type="error" :closable="false"
        >
          <el-button 
            text 
            @click="loadOptions(relation)"
          >
            {{ $t('product.retry') }}
          </el-button>
        </el-alert>
        <el-select
          :model-value="formRef[relation.key] as string"
          filterable 
          :loading="loading[relation.key]" 
          :disabled="loading[relation.key] || !!errors[relation.key]"
          :placeholder="$t(relation.placeholder)" 
          class="w-full" @update:model-value="formRef[relation.key] = $event"
          clearable
        >
          <el-option 
            v-for="item in options[relation.key]" 
            :key="item.id" 
            :value="item.id" 
            :label="locale === 'km' ? item.nameKh || item.nameEn : item.nameEn || item.nameKh" 
          />
        </el-select>
      </div>
    </el-form-item>
    <el-form-item 
      :label="$t('product.status')" 
      prop="status" 
      :error="formatError('status', externalErrors)"
    >
      <el-switch 
        :model-value="formRef.status as boolean" 
        :aria-label="$t('product.status')" 
        @update:model-value="formRef.status = $event" 
      />
    </el-form-item>
    <el-tabs v-model="activeTab" class="md:col-span-2" type="border-card">
      <el-tab-pane name="warehouses">
        <template #label>
          <Icon name="clarity:store-line"/> &nbsp; {{ $t('product.warehouses') }}
        </template>
        <el-form-item
          :label="$t('product.warehouses')"
          prop="warehouseIds"
          :rules="isCreate ? warehouseRules : []"
          :error="formatError('warehouseIds', externalErrors)"
        >
          <div class="w-full space-y-2">
            <el-alert v-if="errors.warehouseIds" :title="errors.warehouseIds" type="error" :closable="false">
              <el-button text @click="loadOptions(relations[2])">{{ $t('product.retry') }}</el-button>
            </el-alert>
            <el-checkbox
              :model-value="allWarehousesSelected"
              :indeterminate="someWarehousesSelected"
              :disabled="loading.warehouseIds || !!errors.warehouseIds || !options.warehouseIds.length"
              @update:model-value="toggleAllWarehouses"
            >
              {{ $t('product.select_all_warehouses') }}
            </el-checkbox>
            <el-checkbox-group
              :model-value="selectedWarehouseIds"
              :disabled="loading.warehouseIds || !!errors.warehouseIds"
              class="grid grid-cols-1 gap-x-4 sm:grid-cols-2 md:grid-cols-4"
              size="large"
              @update:model-value="formRef.warehouseIds = $event"
            >
              <el-checkbox
                v-for="item in options.warehouseIds"
                :key="item.id"
                :value="item.id"
                size="large"
                :label="locale === 'km' ? item.nameKh || item.nameEn : item.nameEn || item.nameKh"
              />
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="stock" :disabled="!isCreate">
        <template #label>
          <Icon name="bi:card-list"/> &nbsp; {{ $t('product.stock_fields') }}
        </template>
        <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <el-form-item
            v-for="field in stockFields"
            :key="field.key"
            :label="$t(field.label)"
            :prop="field.key"
            :error="formatError(field.key, externalErrors)"
          >
            <el-input-number 
              v-model="formRef[field.key] as number" 
              :min="0" class="!w-full" 
            />
          </el-form-item>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('product.thumbnail')" name="thumbnail">
        <template #label>
          <Icon name="ant-design:picture-outlined"/> &nbsp; {{ $t('product.thumbnail') }}
        </template>
        <el-form-item
          :label="$t('product.thumbnail')"
          prop="thumbnail"
          :error="formatError('thumbnail', externalErrors)"
        >
          <SingleUpload v-model="thumbnailCode" accept=".png,.jpg,.jpeg" />
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
