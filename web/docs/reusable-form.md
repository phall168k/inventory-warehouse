# Reusable Form

`Form.vue` wraps Element Plus validation independently from CRUD requests.

```vue
<script setup lang="ts">
import Form from '~/components/Form.vue'
import type { FormData, FormField } from '~/types/crud'

const formData = ref<FormData>({ name: '', email: '' })
const fields: FormField[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
]
const saving = ref(false)
const save = (data: FormData) => { /* send data using your API */ }
</script>
<template>
  <Form v-model="formData" :fields="fields" :disabled="saving" @submit="save" />
</template>
```

Or replace generated fields using the default slot and your own `<el-form-item>`
components. Supply their `prop` and Element Plus rules. Never nest another form.
`fields` is optional for custom forms. `rules` also accepts a form-level rules map.
Required and email rules are generated for configured fields, including conditional
`required: 'create'` or `'edit'` requirements through the `mode` prop.

`@submit` fires only after successful validation. The parent owns save requests and
must set `disabled` during them. `externalErrors` supplies field errors for generated
inputs; custom inputs can use `formatError(key, errors)` from `utils/crud`.

A component ref exposes `validate(): Promise<boolean>`, `submit()`, `resetFields()`,
and `clearValidate()`. Set `:show-actions="false"` for an external dialog footer.
Reset restores the initial values when fields mounted. Remount with a different
`:key` to establish a new reset baseline for a different record.
