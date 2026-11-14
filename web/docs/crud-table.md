# Table and custom forms

```vue
<script setup lang="ts">
import Table from '~/components/Table.vue'
import AccountTypeForm from '~/components/account-type/Form.vue'
import type { TableHeader } from '~/types/crud'

const headers: TableHeader[] = [
  { title: 'Code', key: 'code', filterOption: { type: 'text', label: 'Code' } },
  { title: 'Name', key: 'name', filterOption: { type: 'text', label: 'Name' } },
  { title: 'Balance sheet', key: 'isBalanceSheet' },
  { title: 'Actions', key: 'action' },
]
</script>
<template>
  <Table :headers="headers" :page-header="{ title: 'Account types', description: 'Manage account types.' }" crud-path="access/account-type">
    <template #form="{ formRef, externalErrors, action, disabled }">
      <AccountTypeForm :form-ref="formRef" :external-errors="externalErrors" />
    </template>
  </Table>
</template>
```

The three primary props are `headers`, `pageHeader`, and `crudPath`.
`page-header-options` and the example's `age-header-options` are accepted aliases
for `page-header`. Labels are plain strings; pass translated strings if your app uses i18n.

## Form slot

`formRef` (also `formData`) is the editable data object, not an Element Plus form
instance. Bind custom inputs to its properties. The table wraps your slot in the
reusable `Form.vue`, so **do not nest another `<el-form>`**. Use `<el-form-item>`
with `prop`, `rules`, and `error` for validation. Custom components can have their
own layout while the table owns validation, requests, loading state, and dialogs.

```vue
<script setup lang="ts">
import { CrudDialogState } from '~/types/crud'
import type { FormData, IExternalError } from '~/types/crud'
import { formatError } from '~/utils/crud'

const props = defineProps<{ formRef: FormData; externalErrors: IExternalError[] }>()
const action = useAction()
const isEditing = computed(() => action.value === CrudDialogState.editing)
const required = { required: true, whitespace: true, message: 'Required', trigger: 'blur' }
</script>
<template>
  <el-form-item label="Code" prop="code" :rules="[required]" :error="formatError('code', externalErrors)">
    <el-input v-model="formRef.code" :disabled="isEditing" />
  </el-form-item>
  <el-form-item label="Name" prop="name" :rules="[required]" :error="formatError('name', externalErrors)">
    <el-input v-model="formRef.name" />
  </el-form-item>
  <el-form-item label="Balance sheet" prop="isBalanceSheet">
    <el-checkbox v-model="formRef.isBalanceSheet" />
  </el-form-item>
</template>
```

`action` is also supplied directly to the slot (`create`, `edit`, `view`).
Use computed state rather than reading `useAction().value` once. Server field errors
are supplied as `{ field, errors: string[] }[]`, including the backend's `erros` format.
The table also displays the general error, preserves entered values, and blocks duplicate writes.
Resource-specific forms should map relationship objects to IDs to match their DTOs.
See `components/users/Form.vue` and `pages/admin/system/users/index.vue` for a working example.

## Table and generated form

Headers use `title`, `key`, optional `width`, `format(value, row)` and `filterOption`.
The `action` header is reserved for reusable view/edit/delete buttons; it is added
when omitted. Dotted keys support nested display values. Customize cells with
`#item.code="{ item, value }"` or `#cell-code="{ row, value }"`.
The `item.*` slot takes priority when both are provided. A table component ref exposes `refresh()`.

Search and pagination run on the server. Column filters configured by
`filterOption` apply to the loaded page, because the current API supports only a
single server search term. The UI labels this scope. Clearing filters does not reset search.

Without a `#form` slot, fields are generated from headers. Use `header.form` to
configure `type`, `required`, `rules`, `defaultValue`, `options`, `multiple`,
`placeholder`, and `create`/`edit` visibility. `form: false` excludes a generated
form field. Password headers use `form: { type: 'password' }` and are hidden from
listing/detail views. IDs, audit fields, dotted keys, and actions are not generated inputs.

## API

Paths are relative to `NUXT_PUBLIC_API`. The helper adds `v1/` for this repository's
versioned backend unless the path or base already supplies a version.

- `GET collection?page=1&limit=10&search=...` → `payload: { data, meta: { totalItems } }`.
- `GET collection/:id` → `payload: record`.
- `POST collection`, `PUT collection/:id`, `DELETE collection/:id`.

Rows must contain `id`. Delete requires confirmation. IDs/audit fields and blank
passwords are omitted from submitted bodies. The backend remains responsible for
authorization and business validation.
