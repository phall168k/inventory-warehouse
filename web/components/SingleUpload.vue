<template>
  <div class="w-full space-y-2">
    <el-upload
      v-if="!modelValue"
      ref="uploadRef"
      drag
      :http-request="uploadFile"
      :disabled="loading"
      :multiple="false"
      :limit="1"
      :accept="accept"
      :before-upload="beforeUpload"
      :show-file-list="showFileList"
    >
      <Icon v-if="loading" name="icon-park:loading-one" :size="25" class="animate-spin" />
      <template v-else>
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          {{ $t('upload.drop_here') }} <em>{{ $t('upload.click') }}</em>
        </div>
      </template>
      <template v-if="tip" #tip><div class="el-upload__tip">{{ tip }}</div></template>
    </el-upload>
    <div v-else class="space-y-2">
      <el-image
        v-if="previewLink && isImage"
        :src="previewLink"
        :preview-src-list="[previewLink]"
        fit="contain"
        class="h-40 w-full"
      >
        <template #error>{{ $t('upload.preview_failed') }}</template>
      </el-image>
      <a v-else-if="previewLink" :href="previewLink" target="_blank" rel="noopener noreferrer" class="break-all text-blue-600 underline">
        {{ modelValue }}
      </a>
      <p v-else class="break-all">{{ modelValue }}</p>
      <p v-if="previewError" role="alert">{{ $t('upload.preview_failed') }}</p>
      <el-button v-if="previewError" @click="loadPreview">{{ $t('role.retry') }}</el-button>
      <el-button :disabled="loading" @click="removeFile">{{ $t('app.delete') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import type { 
  UploadInstance, 
  UploadProps, 
  UploadRequestOptions 
} from 'element-plus'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  action?: string
  headers?: Record<string, string>
  accept?: string
  maxSizeMB?: number
  showFileList?: boolean
  tip?: string
}>(), {
  accept: '.pdf,.png,.jpg,.jpeg',
  maxSizeMB: 5,
  showFileList: false,
})
const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  success: [value: IResponse<string>]
  error: [value: unknown]
}>()
const { t: $t } = useI18n()
const uploadRef = ref<UploadInstance>()
const loading = ref(false)
const previewLink = ref('')
const previewError = ref(false)
const config = useRuntimeConfig()
const app = useNuxtApp()
const apiPath = (path: string) => {
  const base = String(config.public.NUXT_PUBLIC_API).replace(/\/$/, '')
  return `${/\/v\d+$/.test(base) ? '' : 'v1/'}admin/minio/${path}`
}
const isImage = computed(() => /\.(png|jpe?g)$/i.test(props.modelValue ?? ''))

const beforeUpload: UploadProps['beforeUpload'] = file => {
  if (loading.value || props.modelValue) return false
  const accepted = props.accept.split(',').map(value => value.trim().toLowerCase()).filter(Boolean)
  const type = file.type.toLowerCase()
  const matches = accepted.length === 0 || accepted.some(value =>
    value === '*' || value === '*/*' || (value.startsWith('.')
      ? file.name.toLowerCase().endsWith(value)
      : value.endsWith('/*') ? type.startsWith(value.slice(0, -1)) : type === value),
  )
  if (!matches || (!props.action && !['application/pdf', 'image/png', 'image/jpeg'].includes(type))) {
    useMessage($t('upload.invalid_type'), 'error')
    return false
  }
  const maxSize = props.action ? props.maxSizeMB : Math.min(props.maxSizeMB, 5)
  if (file.size > maxSize * 1024 * 1024) {
    useMessage($t('upload.size_limit', { size: maxSize }), 'error')
    return false
  }
  return true
}

const uploadFile = async (options: UploadRequestOptions) => {
  loading.value = true
  try {
    const body = new FormData()
    body.append('file', options.file)
    const response = await useApi<string>(props.action || apiPath('upload'), {
      method: 'post', body, headers: props.headers,
    })
    if (typeof response.payload !== 'string' || !response.payload) throw new Error('Invalid upload response')
    emit('update:modelValue', response.payload)
    emit('success', response)
    return response
  } catch (error) {
    useMessage($t('upload.failed'), 'error')
    emit('error', error)
    throw error
  } finally {
    loading.value = false
    // Element Plus completes its callbacks after this promise settles.
    nextTick(() => uploadRef.value?.clearFiles())
  }
}

let previewRequest = 0
const loadPreview = async () => {
  const request = ++previewRequest
  previewLink.value = ''
  previewError.value = false
  if (!props.modelValue) return
  try {
    const response = await app.runWithContext(() => useApi<string>(apiPath(encodeURIComponent(props.modelValue!))))
    const url = new URL(response.payload)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid preview URL')
    if (request === previewRequest) previewLink.value = url.href
  } catch {
    if (request === previewRequest) previewError.value = true
  }
}
// Removing the selection does not delete stored objects referenced by saved records.
const removeFile = () => {
  previewRequest++
  previewLink.value = ''
  previewError.value = false
  emit('update:modelValue', null)
}
onMounted(loadPreview)
watch(() => props.modelValue, loadPreview)
onBeforeUnmount(() => { previewRequest++ })
</script>
