<script setup lang="ts">
  import type { FormData, IExternalError } from '~/types/crud'
  import { formatError } from '~/utils/crud'

  const props = withDefaults(defineProps<{ formRef: FormData; externalErrors?: IExternalError[] }>(), {
    externalErrors: () => [],
  });

  const { t } = useI18n();;

  // Keep the payload limited to writable category fields.
  const values = {
    code: props.formRef.code ?? '',
    nameEn: props.formRef.nameEn ?? '',
    nameKh: props.formRef.nameKh ?? '',
    status: props.formRef.status ?? true,
  }

  for (const key of Object.keys(props.formRef)) delete props.formRef[key];
  Object.assign(props.formRef, values);
  const requiredRules = computed(() => [{ 
    required: true, 
    whitespace: true, 
    message: t('uom.required'), 
    trigger: 'blur'
  }]);
</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
    <el-form-item 
      :label="$t('uom.code')" 
      prop="code"
      class="col-span-2" 
      :rules="requiredRules" 
      :error="formatError('code', externalErrors)"
    >
      <el-input 
        :model-value="formRef.code as string" 
        :maxlength="100" 
        @update:model-value="formRef.code = $event" 
      />
    </el-form-item>
    <el-form-item 
      :label="$t('uom.name_en')" 
      prop="nameEn" 
      :rules="requiredRules" 
      :error="formatError('nameEn', externalErrors)"
    >
      <el-input 
        :model-value="formRef.nameEn as string" 
        :maxlength="100" 
        @update:model-value="formRef.nameEn = $event" 
      />
    </el-form-item>
    <el-form-item 
      :label="$t('uom.name_kh')" 
      prop="nameKh" 
      :rules="requiredRules" 
      :error="formatError('nameKh', externalErrors)"
    >
      <el-input 
        :model-value="formRef.nameKh as string" 
        :maxlength="100" 
        @update:model-value="formRef.nameKh = $event" 
      />
    </el-form-item>
    <el-form-item
      :label="$t('uom.status')"
      prop="status"
      :error="formatError('status', externalErrors)"
    >
      <el-switch
        :model-value="formRef.status as boolean"
        :aria-label="$t('uom.status')"
        @update:model-value="formRef.status = $event"
      />
    </el-form-item>
  </div>
</template>
