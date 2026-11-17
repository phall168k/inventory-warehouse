<script setup lang="ts">
interface Thumbnail { code?: string; url?: string; isImage?: boolean }
const props = withDefaults(defineProps<{ thumbnail?: Thumbnail | null; size?: number }>(), { size: 48 })
const app = useNuxtApp()
const config = useRuntimeConfig()
const source = ref('')
const loading = ref(false)
let requestId = 0
let mounted = false

const load = async () => {
  const request = ++requestId
  source.value = ''
  loading.value = false
  const thumbnail = props.thumbnail
  if (!thumbnail || thumbnail.isImage === false) return
  loading.value = true
  try {
    let url = thumbnail.url
    if (thumbnail.code) {
      const base = String(config.public.NUXT_PUBLIC_API).replace(/\/$/, '')
      const prefix = /\/v\d+$/.test(base) ? '' : 'v1/'
      const response = await app.runWithContext(() => useApi<string>(`${prefix}admin/minio/${encodeURIComponent(thumbnail.code!)}`))
      url = response.payload
    }
    if (!url) return
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return
    if (request === requestId) source.value = parsed.href
  } catch {
    // A missing or inaccessible image should not prevent viewing the product.
  } finally {
    if (request === requestId) loading.value = false
  }
}
onMounted(() => { mounted = true; void load() })
watch(() => [props.thumbnail?.code, props.thumbnail?.url, props.thumbnail?.isImage], () => {
  if (mounted) void load()
})
onBeforeUnmount(() => { requestId++ })
</script>

<template>
  <div v-loading="loading" :style="{ width: `${size}px`, height: `${size}px` }" class="flex items-center justify-center rounded-lg bg-slate-50">
    <el-image
      v-if="source"
      :src="source"
      :alt="$t('product.thumbnail')"
      :preview-src-list="[source]"
      preview-teleported
      fit="contain"
      class="h-full w-full rounded-lg"
    >
      <template #error><span :aria-label="$t('warehouse.preview_unavailable')">—</span></template>
    </el-image>
    <span v-else :aria-label="$t('warehouse.preview_unavailable')" class="text-slate-400">—</span>
  </div>
</template>
