import type { FormData, FormField, IExternalError, TableHeader } from '~/types/crud'

export const getValue = (row: FormData, key: string): unknown => key.split('.').reduce<unknown>(
  (value, part) => value && typeof value === 'object' ? (value as FormData)[part] : undefined, row)

export const formatValue = (header: TableHeader, row: FormData): string => {
  const value = getValue(row, header.key)
  if (header.format) return header.format(value, row)
  if (value == null || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}

export const headerFields = (headers: TableHeader[]): FormField[] => headers
  .filter(header => header.key !== 'action' && header.form !== false && !header.key.includes('.')
    && !['id', 'createdAt', 'updatedAt', 'deletedAt'].includes(header.key))
  .map(header => ({ key: header.key, label: header.title,
    type: header.filterOption?.type ?? 'text', options: header.filterOption?.options,
    ...(header.form || {}) }))

export const initialValues = (fields: FormField[]): FormData => Object.fromEntries(fields.map(field => {
  const value = field.defaultValue ?? (field.multiple ? [] : field.type === 'boolean' ? false : field.type === 'number' ? null : '')
  return [field.key, Array.isArray(value) ? [...value] : value]
}))

/** Parse the backend's validation error array (including its existing `erros` key). */
export const externalErrors = (error: unknown): IExternalError[] => {
  const data = (error as { data?: Record<string, unknown> })?.data
  const errors = data?.erros ?? data?.errors
  if (!Array.isArray(errors)) return []
  return errors.filter((item): item is IExternalError => item && typeof item.field === 'string'
    && Array.isArray(item.errors) && item.errors.every((message: unknown) => typeof message === 'string'))
}
export const errorMessage = (error: unknown): string => {
  const fields = externalErrors(error)
  if (fields.length) return fields.flatMap(field => field.errors).join(' ')
  const message = (error as { data?: { message?: unknown } })?.data?.message
  return typeof message === 'string' ? message : Array.isArray(message) ? message.join(' ') : 'The request failed. Please try again.'
}
export const formatError = (key: string, errors: IExternalError[]): string =>
  errors.find(error => error.field === key)?.errors.join(' ') ?? ''

export const editablePayload = (data: FormData): FormData => Object.fromEntries(Object.entries(data)
  .filter(([key, value]) => !['id', 'createdAt', 'updatedAt', 'deletedAt'].includes(key)
    && !(key.toLowerCase().includes('password') && (value === '' || value == null))))

/** These filters deliberately apply to the loaded page; API-wide search is separate. */
export const filterRows = (rows: FormData[], filters: FormData, headers: TableHeader[] = []): FormData[] => rows.filter(row =>
  Object.entries(filters).every(([key, value]) => {
    if (value == null || value === '') return true
    const actual = getValue(row, key)
    if (headers.find(header => header.key === key)?.filterOption?.type === 'select') return actual === value
    return typeof value === 'string' ? String(actual ?? '').toLowerCase().includes(value.toLowerCase()) : actual === value
  }))
