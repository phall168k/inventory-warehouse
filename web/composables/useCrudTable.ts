import { ElMessage, ElMessageBox } from 'element-plus'
import type { ApiOptions } from './api'
import { CrudDialogState } from '~/types/crud'
import type { CrudPage, FormData, IExternalError, TableHeader } from '~/types/crud'
import { editablePayload, errorMessage, externalErrors, headerFields, initialValues } from '~/utils/crud'

export const useCrudTable = (props: { headers: TableHeader[]; crudPath: string }) => {
  const app = useNuxtApp()
  const config = useRuntimeConfig()
  const request = <T>(path: string, options: ApiOptions = {}) => app.runWithContext(() => useApi<T>(path, options))
  const endpoint = computed(() => {
    const path = props.crudPath.replace(/^\/+|\/+$/g, '')
    return /\/v\d+\/?$/.test(String(config.public.NUXT_PUBLIC_API)) || /^v\d+\//.test(path) ? path : `v1/${path}`
  })
  const fields = computed(() => headerFields(props.headers))
  const rows = ref<FormData[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(10)
  const search = ref('')
  const loading = ref(false)
  const busy = ref(false)
  const error = ref('')
  const dialogError = ref('')
  const errorFields = ref<IExternalError[]>([])
  const dialogOpen = ref(false)
  const action = ref(CrudDialogState.creating)
  const formData = ref<FormData>({})
  const record = ref<FormData>({})
  let controller: AbortController | undefined
  let listVersion = 0
  let dialogVersion = 0
  let disposed = false
  const recordPath = (row: FormData) => {
    if (typeof row.id !== 'string' && typeof row.id !== 'number') throw new Error('Record is missing its id')
    return `${endpoint.value}/${encodeURIComponent(row.id)}`
  }
  const refresh = async () => {
    const version = ++listVersion
    controller?.abort()
    controller = new AbortController()
    loading.value = true
    error.value = ''
    try {
      const response = await request<CrudPage>(endpoint.value, {
        query: { page: page.value, limit: limit.value, search: search.value.trim() || undefined }, signal: controller.signal,
      })
      if (disposed || version !== listVersion) return
      rows.value = response.payload.data
      total.value = response.payload.meta.totalItems
    } catch (cause) {
      if (!disposed && version === listVersion) error.value = errorMessage(cause)
    } finally {
      if (!disposed && version === listVersion) loading.value = false
    }
  }
  const closeDialog = () => {
    if (busy.value) return
    dialogOpen.value = false
    dialogVersion++
  }
  const openDialog = async (nextAction: CrudDialogState, row?: FormData) => {
    if (busy.value) return
    const version = ++dialogVersion
    action.value = nextAction
    dialogError.value = ''
    errorFields.value = []
    record.value = {}
    formData.value = initialValues(fields.value)
    dialogOpen.value = true
    if (!row) return
    busy.value = true
    try {
      const response = await request<FormData>(recordPath(row))
      if (disposed || version !== dialogVersion) return
      record.value = response.payload
      const values = structuredClone(response.payload)
      for (const field of fields.value) {
        if (field.type === 'password') values[field.key] = ''
        if (field.type === 'select') {
          const id = (value: unknown) => value && typeof value === 'object' ? (value as FormData).id : value
          values[field.key] = Array.isArray(values[field.key]) ? (values[field.key] as unknown[]).map(id) : id(values[field.key])
        }
      }
      formData.value = { ...initialValues(fields.value), ...values }
    } catch (cause) {
      if (!disposed && version === dialogVersion) dialogError.value = errorMessage(cause)
    } finally { if (!disposed) busy.value = false }
  }
  const save = async () => {
    if (busy.value || action.value === CrudDialogState.viewing || (action.value === CrudDialogState.editing && record.value.id == null)) return
    const version = dialogVersion
    busy.value = true
    dialogError.value = ''
    errorFields.value = []
    const creating = action.value === CrudDialogState.creating
    try {
      const body = editablePayload(formData.value)
      for (const field of fields.value) if ((creating ? field.create : field.edit) === false) delete body[field.key]
      await request(creating ? endpoint.value : recordPath(record.value), { method: creating ? 'POST' : 'PUT', body })
      if (disposed || version !== dialogVersion) return
      dialogOpen.value = false
      ElMessage.success(creating ? 'Record created' : 'Record updated')
      await refresh()
    } catch (cause) {
      if (!disposed && version === dialogVersion) {
        dialogError.value = errorMessage(cause)
        errorFields.value = externalErrors(cause)
      }
    } finally { if (!disposed) busy.value = false }
  }
  const remove = async (row: FormData) => {
    if (busy.value) return
    busy.value = true
    try {
      const path = recordPath(row)
      const collection = endpoint.value
      await ElMessageBox.confirm('This record will be permanently deleted.', 'Delete record?', {
        type: 'warning', confirmButtonText: 'Delete', cancelButtonText: 'Cancel',
      })
      if (disposed || collection !== endpoint.value) return
      await request(path, { method: 'DELETE' })
      if (disposed || collection !== endpoint.value) return
      ElMessage.success('Record deleted')
      if (rows.value.length === 1 && page.value > 1) page.value--
      else await refresh()
    } catch (cause) {
      if (!disposed && cause !== 'cancel' && cause !== 'close') ElMessage.error(errorMessage(cause))
    } finally { if (!disposed) busy.value = false }
  }
  const applySearch = () => { if (page.value !== 1) page.value = 1; else void refresh() }
  const changeLimit = (value: number) => { limit.value = value; applySearch() }
  watch(page, refresh)
  watch(endpoint, () => {
    dialogVersion++
    dialogOpen.value = false
    rows.value = []
    total.value = 0
    search.value = ''
    applySearch()
  })
  onMounted(refresh)
  onBeforeUnmount(() => { disposed = true; listVersion++; dialogVersion++; controller?.abort() })
  return { fields, rows, total, page, limit, search, loading, busy, error, dialogError, errorFields,
    dialogOpen, action, formData, record, refresh, openDialog, closeDialog, save, remove, applySearch, changeLimit }
}
