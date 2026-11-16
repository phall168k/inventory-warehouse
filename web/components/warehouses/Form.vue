<script setup lang="ts">
import type { FormData, IExternalError } from '~/types/crud'
import { errorMessage, formatError } from '~/utils/crud'

const props = withDefaults(defineProps<{ formRef: FormData; externalErrors?: IExternalError[] }>(), {
  externalErrors: () => [],
})
const { t, locale } = useI18n()
const app = useNuxtApp()
const managers = ref<{ id: string; nameEn: string; nameKh: string }[]>([])
const loadingManagers = ref(false)
const managersError = ref('')
let disposed = false

// Keep the edit payload limited to writable fields, excluding response relationships and audit data.
const manager = props.formRef.manager as { id?: string; nameEn?: string; nameKh?: string } | undefined
const values = {
  code: props.formRef.code ?? '',
  nameEn: props.formRef.nameEn ?? '',
  nameKh: props.formRef.nameKh ?? '',
  managerId: props.formRef.managerId || manager?.id || '',
  address: props.formRef.address ?? '',
  contactNumber: props.formRef.contactNumber ?? '',
  logo: props.formRef.logo && typeof props.formRef.logo === 'object' ? props.formRef.logo : null,
}
for (const key of Object.keys(props.formRef)) delete props.formRef[key]
Object.assign(props.formRef, values)
if (manager?.id) managers.value = [{ id: manager.id, nameEn: manager.nameEn ?? '', nameKh: manager.nameKh ?? '' }]

const requiredRules = computed(() => [{ required: true, whitespace: true, message: t('warehouse.required'), trigger: 'blur' }])
const managerRules = computed(() => [{ required: true, message: t('warehouse.select_manager'), trigger: 'change' }])
const loadManagers = async () => {
  if (loadingManagers.value) return
  loadingManagers.value = true
  managersError.value = ''
  try {
    const response = await app.runWithContext(() => useApi<{ id: string; nameEn: string; nameKh: string }[]>('v1/admin/system/users/select-options'))
    if (!disposed) {
      const selected = managers.value.find(item => item.id === props.formRef.managerId)
      managers.value = response.payload
      if (selected && !managers.value.some(item => item.id === selected.id)) managers.value = [selected, ...managers.value]
    }
  } catch (cause) {
    if (!disposed) managersError.value = errorMessage(cause)
  } finally {
    if (!disposed) loadingManagers.value = false
  }
}
onMounted(loadManagers)
onBeforeUnmount(() => { disposed = true })
</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
    <el-form-item :label="$t('warehouse.code')" prop="code" :rules="requiredRules" :error="formatError('code', externalErrors)">
      <el-input :model-value="formRef.code as string" :maxlength="100" @update:model-value="formRef.code = $event" />
    </el-form-item>
    <el-form-item :label="$t('warehouse.manager')" prop="managerId" :rules="managerRules" :error="formatError('managerId', externalErrors)">
      <div class="w-full space-y-2">
        <el-alert v-if="managersError" :title="managersError" type="error" :closable="false">
          <el-button text @click="loadManagers">{{ $t('warehouse.retry') }}</el-button>
        </el-alert>
        <el-select :model-value="formRef.managerId as string" filterable :loading="loadingManagers" :disabled="loadingManagers || !!managersError" :placeholder="$t('warehouse.select_manager')" class="w-full" @update:model-value="formRef.managerId = $event">
          <el-option v-for="item in managers" :key="item.id" :value="item.id" :label="locale === 'km' ? item.nameKh || item.nameEn : item.nameEn || item.nameKh" />
        </el-select>
      </div>
    </el-form-item>
    <el-form-item v-for="key in ['nameEn', 'nameKh']" :key="key" :label="$t(key === 'nameEn' ? 'warehouse.name_en' : 'warehouse.name_kh')" :prop="key" :rules="requiredRules" :error="formatError(key, externalErrors)">
      <el-input :model-value="formRef[key] as string" :maxlength="250" @update:model-value="formRef[key] = $event" />
    </el-form-item>
    <el-form-item :label="$t('warehouse.contact_number')" prop="contactNumber" :error="formatError('contactNumber', externalErrors)">
      <el-input :model-value="formRef.contactNumber as string" type="tel" :maxlength="150" @update:model-value="formRef.contactNumber = $event" />
    </el-form-item>
    <el-form-item :label="$t('warehouse.address')" prop="address" :error="formatError('address', externalErrors)">
      <el-input :model-value="formRef.address as string" type="textarea" :rows="2" :maxlength="250" @update:model-value="formRef.address = $event" />
    </el-form-item>
  </div>
</template>
