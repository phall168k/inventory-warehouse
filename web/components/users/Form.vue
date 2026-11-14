<script setup lang="ts">
import type { FormData, IExternalError } from '~/types/crud'
import { CrudDialogState } from '~/types/crud'
import { errorMessage, formatError } from '~/utils/crud'

const props = withDefaults(defineProps<{ formRef: FormData; externalErrors?: IExternalError[] }>(), {
  externalErrors: () => [],
})
const action = useAction()
const isEditing = computed(() => action.value === CrudDialogState.editing)
const roles = useMasterData<{id: string; nameEn: string; nameKh: string}>('v1/admin/system/roles/select-options');
const warehouses = useMasterData<{id: string; nameEn: string; nameKh: string}>('v1/admin/master-data/warehouses/select-options');
const loadingRoles = ref(false)
const rolesError = ref('')
const app = useNuxtApp()
const required = { required: true, whitespace: true, message: 'This field is required', trigger: 'blur' }

// This resource's DTO expects relationship IDs rather than response objects.
for (const key of ['roles', 'warehouses']) {
  const values = props.formRef[key]
  props.formRef[key] = Array.isArray(values)
    ? values.map(value => typeof value === 'object' && value ? value.id : value) : []
}
props.formRef.isActive ??= true
props.formRef.password = ''

</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
    <el-form-item 
      :label="$t('user.name_en')" 
      prop="nameEn" 
      :rules="[required]" 
      :error="formatError('nameEn', externalErrors)"
    >
      <el-input 
        :model-value="formRef.nameEn as string" 
        @update:model-value="formRef.nameEn = $event" 
        :maxlength="250" 
        size="large"
      />
    </el-form-item>
    <el-form-item 
      :label="$t('user.name_kh')" 
      prop="nameKh" 
      :rules="[required]" 
      :error="formatError('nameKh', externalErrors)"
    >
      <el-input 
        :model-value="formRef.nameKh as string" 
        @update:model-value="formRef.nameKh = $event" 
        :maxlength="250" 
      />
    </el-form-item>
    <el-form-item 
      :label="$t('user.username')" 
      prop="username" :rules="[required]" 
      :error="formatError('username', externalErrors)"
    >
      <el-input 
        :model-value="formRef.username as string" 
        @update:model-value="formRef.username = $event" 
        :maxlength="250" 
      />
    </el-form-item>
    <el-form-item 
      :label="$t('user.email')" 
      prop="email" 
      :rules="[
        required, 
        { 
          type: 'email', 
          message: 'Enter a valid email address', 
          trigger: 'blur' 
        }
      ]" 
      :error="formatError('email', externalErrors)"
    >
      <el-input 
        :model-value="formRef.email as string" 
        @update:model-value="formRef.email = $event" 
        type="email" 
        :maxlength="250" 
      />
    </el-form-item>
    <el-form-item 
      :label="$t('user.password')" 
      prop="password" 
      :rules="isEditing ? [] : [required]" 
      :error="formatError('password', externalErrors)"
    >
      <el-input 
        :model-value="formRef.password as string" 
        @update:model-value="formRef.password = $event" 
        type="password" 
        show-password 
        :maxlength="255" 
        autocomplete="new-password" 
      />
    </el-form-item>
    <el-form-item 
      :label="$t('user.status')" 
      prop="isActive" 
      :error="formatError('isActive', externalErrors)"
    >
      <el-switch 
        :model-value="formRef.isActive as boolean" 
        @update:model-value="formRef.isActive = $event" 
      />
    </el-form-item>
    <el-form-item 
      :label="$t('role.title')" 
      prop="roles" 
      :error="formatError('roles', externalErrors)" 
      class="md:col-span-2"
    >
      <el-select 
        :model-value="formRef.roles as string[]" 
        @update:model-value="formRef.roles = $event"
        multiple filterable 
        :loading="loadingRoles" 
        class="w-full" 
        :placeholder="$t('role.select_role')"
      >
        <el-option 
          v-for="role in roles" 
          :key="role.id" 
          :label="role.nameEn" 
          :value="role.id" 
        />
      </el-select>
    </el-form-item>
    <el-form-item 
      :label="$t('warehouse.title')" 
      prop="warehouses" 
      :error="formatError('warehouses', externalErrors)" 
      class="md:col-span-2"
    >
      <el-select 
        :model-value="formRef.warehouses as string[]" 
        @update:model-value="formRef.warehouses = $event" 
        multiple 
        filterable 
        class="w-full" 
        :placeholder="$t('role.select_warehouse')"
      >
        <el-option 
          v-for="warehouse in warehouses" 
          :key="warehouse.id" 
          :label="warehouse.nameEn" 
          :value="warehouse.id" 
        />
      </el-select>
    </el-form-item>
  </div>
</template>
