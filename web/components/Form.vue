<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { FormData, FormField, IExternalError } from '~/types/crud'
import { formatError } from '~/utils/crud'

const props = withDefaults(defineProps<{
  fields?: FormField[]
  rules?: FormRules
  externalErrors?: IExternalError[]
  mode?: 'create' | 'edit'
  disabled?: boolean
  showActions?: boolean
}>(), { fields: () => [], externalErrors: () => [], mode: 'create', disabled: false, showActions: true })
const data = defineModel<FormData>({ required: true })
const emit = defineEmits<{ submit: [data: FormData] }>()
const form = ref<FormInstance>()
const validating = ref(false)
const fields = computed(() => props.fields.filter(field => props.mode === 'create' ? field.create !== false : field.edit !== false))
const rules = computed<FormRules>(() => {
  const rules: FormRules = { ...props.rules }
  for (const field of fields.value) {
    const required = field.required === true || field.required === props.mode
    const type = field.multiple ? 'array' : field.type === 'number' ? 'number'
      : field.type === 'boolean' ? 'boolean' : field.type === 'select' ? 'any' : undefined
    const extra = props.rules?.[field.key]
    rules[field.key] = [
      ...(required ? [{ required: true, type, whitespace: !type, message: `${field.label} is required`, trigger: 'change' } as const] : []),
      ...(field.type === 'email' ? [{ type: 'email', message: 'Enter a valid email address', trigger: 'blur' } as const] : []),
      ...(field.rules ?? []), ...(Array.isArray(extra) ? extra : extra ? [extra] : []),
    ]
  }
  return rules
})
const setValue = (key: string, value: unknown) => { data.value = { ...data.value, [key]: value } }
const validate = async (): Promise<boolean> => !!(await form.value?.validate().catch(() => false))
const submit = async () => {
  if (props.disabled || validating.value) return
  validating.value = true
  try { if (await validate() && !props.disabled) emit('submit', data.value) }
  finally { validating.value = false }
}
const resetFields = () => form.value?.resetFields()
const clearValidate = () => form.value?.clearValidate()
defineExpose({ validate, submit, resetFields, clearValidate })
</script>
<template>
  <el-form ref="form" :model="data" :rules="rules" :disabled="disabled" label-position="top" @submit.prevent="submit">
    <slot :form-ref="data" :external-errors="externalErrors">
      <el-form-item v-for="field in fields" :key="field.key" :label="field.label" :prop="field.key" :error="formatError(field.key, externalErrors)">
        <el-switch v-if="field.type === 'boolean'" :model-value="data[field.key] as boolean" @update:model-value="setValue(field.key, $event)" />
        <el-input-number v-else-if="field.type === 'number'" :model-value="data[field.key] as number | null" class="!w-full" @update:model-value="setValue(field.key, $event)" />
        <el-select v-else-if="field.type === 'select'" :model-value="data[field.key] as string | number | boolean | (string | number)[]" :multiple="field.multiple" filterable clearable class="w-full" @update:model-value="setValue(field.key, $event)">
          <el-option v-for="option in field.options ?? []" :key="String(option.value)" :label="option.label" :value="option.value" />
        </el-select>
        <el-date-picker v-else-if="field.type === 'date'" :model-value="data[field.key] as string" value-format="YYYY-MM-DD" class="!w-full" @update:model-value="setValue(field.key, $event)" />
        <el-input v-else :model-value="data[field.key] as string" :type="field.type ?? 'text'" :show-password="field.type === 'password'" :placeholder="field.placeholder" @update:model-value="setValue(field.key, $event)" />
      </el-form-item>
    </slot>
    <el-button v-if="showActions" native-type="submit" type="primary" :disabled="disabled" :loading="validating">{{ $t('app.saves') }}</el-button>
    <button v-else type="submit" class="sr-only" :disabled="disabled">{{ $t('app.save') }}</button>
  </el-form>
</template>
