<template>
  <div ref="uploadRoot"> 
    <el-upload
      class="w-full"
      drag
      :http-request="uploadFile"
      accept=".pdf,.png,.jpg,.jpeg"
      :multiple="props.multiple"
      :disabled="props.multiple === false && (loading || files.length > 0)"
      :before-upload="beforeUpload"
      :show-file-list="false"
    >
      <div
        class="text-gray-600"
        v-if="loading"
      >
        <Icon 
          name="icon-park:loading-one"
          :size="25"
          class="animate-spin"
        />
      </div>
      <div
        v-else
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div 
          class="el-upload__text"
        >
          {{ $t('upload.drop_here') }} <em>{{ $t('upload.click') }}</em>
        </div>
      </div>
    </el-upload>
    <el-table
      :data="files"
      stripe
    >
      <template #empty>{{ $t('app.no_data') }}</template>
      <el-table-column :label="$t('warehouse.file_name')" prop="fileName" />
      <el-table-column :label="$t('app.actions')" align="center" width="150">
        <template #default="scope">
          <div class="flex items-center gap-2 justify-center">
            <el-tag 
              type="success"
              @click="handleOpenFile(scope.row.fileName)"
              class="cursor-pointer"
            >
              <Icon name="solar:document-outline"/>
            </el-tag>
            <el-tag 
              type="danger"
              @click="handleDeleteFile(scope.row.fileName)"
              class="cursor-pointer"
            >
              <Icon name="material-symbols-light:delete-outline-rounded"/>
            </el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { 
  UploadProps, 
  UploadRequestOptions 
} from 'element-plus'

interface FileData {
  fileName: string
  originalName?: string
  size?: number
  isImage?: boolean
}

const props = withDefaults(defineProps<{ modelValue?: FileData[]; multiple?: boolean }>(), {
  modelValue: () => [],
  multiple: true,
});

const emit = defineEmits<{
  'update:modelValue': [files: FileData[]]
}>();

const { t: $t } = useI18n();

const uploadRoot = ref<HTMLElement>();
const appContext = getCurrentInstance()?.appContext;
const files = ref<FileData[]>([...props.modelValue]);
watch(() => props.modelValue, value => { 
  files.value = [...value] 
});
const pendingUploads = ref(0);
const loading = computed(() => pendingUploads.value > 0);
const config = useRuntimeConfig();
const apiPath = (path: string) => {
  const base = String(config.public.NUXT_PUBLIC_API).replace(/\/$/, '')
  return `${/\/v\d+$/.test(base) ? '' : 'v1/'}admin/minio/${path}`;
}

const updateFiles = (value: FileData[]) => {
  files.value = value
  emit('update:modelValue', value)
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  if (props.multiple === false && (loading.value || files.value.length > 0)) return false
  if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
    useMessage($t('upload.invalid_type'), 'error')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    useMessage($t('upload.invalid_size'), 'error')
    return false
  }
  return true
}

const uploadFile = async (options: UploadRequestOptions) => {
  pendingUploads.value++
  try {
    const body = new FormData()
    body.append('file', options.file)
    const response = await useApi<string>(apiPath('upload'), {
      method: 'post',
      body,
    })
    if (typeof response.payload !== 'string' || !response.payload) {
      throw new Error($t('upload.failed'))
    }
    updateFiles([...files.value, {
      fileName: response.payload,
      originalName: options.file.name,
      size: options.file.size,
      isImage: options.file.type.startsWith('image/'),
    }])
    return response
  } catch (error) {
    useMessage($t('upload.failed'), 'error')
    throw error
  } finally {
    pendingUploads.value--
  }
}

const handleOpenFile = async (fileName: string) => {
  // Open synchronously so the browser does not block the preview after the request.
  const preview = window.open('about:blank', '_blank')
  if (preview) preview.opener = null
  try {
    const response = await useApi<string>(apiPath(encodeURIComponent(fileName)))
    const url = new URL(response.payload)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid preview URL')
    if (preview) preview.location.href = url.href
    else useMessage($t('upload.popup_blocked'), 'warning')
  } catch {
    preview?.close()
    useMessage($t('upload.preview_failed'), 'error')
  }
}

const handleDeleteFile = async (fileName: string) => {
  try {
    await ElMessageBox.confirm(
      $t('upload.confirm_delete', { fileName }),
      $t('app.delete'),
      {
        confirmButtonText: $t('app.delete'),
        cancelButtonText: $t('app.cancel'),
        type: 'warning',
        // Keep nested confirmations in the form dialog's stacking context.
        appendTo: uploadRoot.value?.closest<HTMLElement>('.el-overlay') ?? document.body,
      },
      appContext,
    )
  } catch {
    return
  }
  try {
    await useApi(apiPath('delete'), {
      method: 'delete',
      query: { bucket: 'images', object: fileName },
    })
    updateFiles(files.value.filter(file => file.fileName !== fileName))
    useMessage($t('upload.deleted'))
  } catch {
    useMessage($t('upload.delete_failed'), 'error')
  }
}
</script>
