<script setup lang="ts">
import { Delete, Edit, View } from '@element-plus/icons-vue'
const props = defineProps<{ action: 'view' | 'edit' | 'delete'; disabled?: boolean }>()
const emit = defineEmits<{ click: [] }>()
const config = computed(() => ({
  view: { label: 'View', icon: View, type: 'info' },
  edit: { label: 'Edit', icon: Edit, type: 'primary' },
  delete: { label: 'Delete', icon: Delete, type: 'danger' },
} as const)[props.action])
</script>
<template>
  <el-tooltip :content="config.label">
    <el-button :icon="config.icon" :type="config.type" :aria-label="config.label" :disabled="disabled" size="small" circle plain @click="emit('click')" />
  </el-tooltip>
</template>
