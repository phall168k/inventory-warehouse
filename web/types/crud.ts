import type { FormItemRule } from 'element-plus'
import type { InjectionKey, Ref } from 'vue'

export type FormData = Record<string, unknown>
export interface IExternalError { field: string; errors: string[] }
export enum CrudDialogState { creating = 'create', editing = 'edit', viewing = 'view' }
export const CRUD_ACTION_KEY: InjectionKey<Readonly<Ref<CrudDialogState>>> = Symbol('crud-action')

export interface FormField {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'email' | 'password' | 'number' | 'boolean' | 'select' | 'date'
  required?: boolean | 'create' | 'edit'
  defaultValue?: string | number | boolean | null | (string | number)[]
  options?: { label: string; value: string | number | boolean }[]
  multiple?: boolean
  placeholder?: string
  rules?: FormItemRule[]
  create?: boolean
  edit?: boolean
}
export interface TableHeader {
  title: string
  key: string
  width?: string | number
  filterOption?: {
    type: 'text' | 'number' | 'boolean' | 'select' | 'date'
    label: string
    options?: { label: string; value: string | number | boolean }[]
  }
  /** Configure the default generated form; false excludes this field from it. */
  form?: false | Omit<FormField, 'key' | 'label'>
  format?: (value: unknown, row: FormData) => string
}
export interface PageHeader { title: string; description?: string }
export interface CrudPage { data: FormData[]; meta: { totalItems: number } }
