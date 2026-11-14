<script setup lang="ts">
import type { FormData, IExternalError } from '~/types/crud'
import { errorMessage, formatError } from '~/utils/crud'

const props = withDefaults(defineProps<{ formRef: FormData; externalErrors?: IExternalError[] }>(), {
  externalErrors: () => [],
})
const { t } = useI18n()
const app = useNuxtApp()
const options = ref<IPermissionSelectOption[]>([])
const loading = ref(false)
const loadError = ref('')
let disposed = false
const nameRules = computed(() => [
  { required: true, whitespace: true, message: t('role.name_required'), trigger: 'blur' },
  { max: 150, message: t('role.name_max'), trigger: 'blur' },
])
const permissionRules = computed(() => [
  { type: 'array' as const, required: true, min: 1, message: t('role.permissions_required'), trigger: 'change' },
])
const groupIds = (group: IPermissionSelectOption) =>
  (group.children?.length ? group.children : [group]).map(permission => permission.id)
const isGroupChecked = (group: IPermissionSelectOption) => {
  const selected = props.formRef.permissions as string[]
  return groupIds(group).every(id => selected.includes(id))
}
const isGroupIndeterminate = (group: IPermissionSelectOption) => {
  const selected = props.formRef.permissions as string[]
  return groupIds(group).some(id => selected.includes(id)) && !isGroupChecked(group)
}
const toggleGroup = (group: IPermissionSelectOption, checked: boolean) => {
  const ids = new Set(groupIds(group))
  const selected = props.formRef.permissions as string[]
  props.formRef.permissions = checked
    ? [...new Set([...selected, ...ids])]
    : selected.filter(id => !ids.has(id))
}

// Edit responses contain objects; the role DTO expects unique permission IDs.
const values = props.formRef.permissions
props.formRef.permissions = Array.isArray(values)
  ? [...new Set(values.map(value => typeof value === 'object' && value ? value.id : value).filter(value => typeof value === 'string'))]
  : []

const loadPermissions = async () => {
  if (loading.value) return
  loading.value = true
  loadError.value = ''
  try {
    const response = await app.runWithContext(() => useApi<IPermissionSelectOption[]>('v1/admin/system/permissions'))
    if (!disposed) options.value = response.payload
  } catch (cause) {
    if (!disposed) loadError.value = errorMessage(cause)
  } finally {
    if (!disposed) loading.value = false
  }
}
onMounted(loadPermissions)
onBeforeUnmount(() => { disposed = true })
</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
    <el-form-item :label="$t('role.name_en')" prop="nameEn" :rules="nameRules" :error="formatError('nameEn', externalErrors)">
      <el-input :model-value="formRef.nameEn as string" :maxlength="150" @update:model-value="formRef.nameEn = $event" />
    </el-form-item>
    <el-form-item :label="$t('role.name_kh')" prop="nameKh" :rules="nameRules" :error="formatError('nameKh', externalErrors)">
      <el-input :model-value="formRef.nameKh as string" :maxlength="150" @update:model-value="formRef.nameKh = $event" />
    </el-form-item>
    <el-form-item :label="$t('role.permissions')" prop="permissions" :rules="permissionRules" :error="formatError('permissions', externalErrors)" class="md:col-span-2">
      <div class="w-full space-y-3">
        <el-alert v-if="loadError" :title="loadError" type="error" :closable="false" show-icon>
          <el-button text @click="loadPermissions">{{ $t('role.retry') }}</el-button>
        </el-alert>
        <el-skeleton v-if="loading" :rows="3" animated />
        <div
          v-else
          class="w-full space-y-3"
        >
          <fieldset v-for="group in options" :key="group.id" class="min-w-0 rounded-[0.7rem] border border-slate-200 px-4 pb-3">
            <legend class="px-2">
              <el-checkbox
                :model-value="isGroupChecked(group)"
                :indeterminate="isGroupIndeterminate(group)"
                :disabled="!!loadError"
                @change="toggleGroup(group, $event === true)"
              >
                <span class="font-semibold text-slate-700">{{ group.name }}</span>
              </el-checkbox>
            </legend>
            <el-checkbox-group
              :model-value="formRef.permissions as string[]"
              :disabled="!!loadError"
              :aria-label="group.name"
              class="grid grid-cols-1 gap-x-4 sm:grid-cols-2"
              @update:model-value="formRef.permissions = $event"
            >
              <el-checkbox
                v-for="permission in group.children?.length ? group.children : [group]"
                :key="permission.id"
                :value="permission.id"
                class="!mr-0 !h-auto min-h-10 whitespace-normal"
              >
                <span class="break-words capitalize">{{ permission.name.replace('-', ' ') }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </fieldset>
        </div>
      </div>
    </el-form-item>
  </div>
</template>
