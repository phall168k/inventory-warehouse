import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { parse, compileScript } from '@vue/compiler-sfc'
import { build } from 'esbuild'
import { ref, computed } from 'vue'

const source = readFileSync(new URL('../components/roles/Form.vue', import.meta.url), 'utf8')
const { descriptor } = parse(source)
const compiled = compileScript(descriptor, { id: 'roles-form' })
const result = await build({
  stdin: { contents: compiled.content, loader: 'ts', resolveDir: fileURLToPath(new URL('..', import.meta.url)) },
  bundle: true, write: false, format: 'cjs', platform: 'node', packages: 'external',
  alias: { '~': fileURLToPath(new URL('..', import.meta.url)) },
})
const code = result.outputFiles[0].text
const module = { exports: {} }
new Function('require', 'module', 'exports', code)(createRequire(import.meta.url), module, module.exports)
const Form = module.exports.default

test('role form normalizes edit permissions, loads grouped options, and retries failures', async () => {
  let mounted
  let fail = false
  const groups = [{ id: 'group', name: 'Inventory', children: [{ id: 'read', name: 'inventory.read' }] }]
  Object.assign(globalThis, {
    ref, computed,
    useI18n: () => ({ t: key => key }),
    useNuxtApp: () => ({ runWithContext: fn => fn() }),
    useApi: async path => {
      assert.equal(path, 'v1/admin/system/permissions')
      if (fail) throw { data: { message: 'Options unavailable' } }
      return { payload: groups }
    },
    onMounted: fn => { mounted = fn },
    onBeforeUnmount: () => {},
  })
  const formRef = { nameEn: 'Manager', nameKh: 'Manager', permissions: [{ id: 'read', name: 'inventory.read' }, 'read', 'write'] }
  const state = Form.setup({ formRef, externalErrors: [] }, { expose: () => {} })
  assert.deepEqual(formRef.permissions, ['read', 'write'])
  await mounted()
  assert.deepEqual(JSON.parse(JSON.stringify(state.options.value)), groups)
  assert.equal(state.loading.value, false)
  fail = true
  await state.loadPermissions()
  assert.equal(state.loadError.value, 'Options unavailable')
  assert.deepEqual(formRef.permissions, ['read', 'write'])
  fail = false
  await state.loadPermissions()
  assert.equal(state.loadError.value, '')
  assert.equal(state.permissionRules.value[0].min, 1)
  assert.equal(state.nameRules.value[1].max, 150)
  const group = { id: 'inventory', name: 'Inventory', children: [{ id: 'read' }, { id: 'delete' }] }
  assert.equal(state.isGroupChecked(group), false)
  assert.equal(state.isGroupIndeterminate(group), true)
  state.toggleGroup(group, true)
  assert.deepEqual(formRef.permissions, ['read', 'write', 'delete'])
  assert.equal(state.isGroupChecked(group), true)
  assert.equal(state.isGroupIndeterminate(group), false)
  state.toggleGroup(group, true)
  assert.deepEqual(formRef.permissions, ['read', 'write', 'delete'])
  state.toggleGroup(group, false)
  assert.deepEqual(formRef.permissions, ['write'])
  assert.equal(state.isGroupIndeterminate(group), false)
  const standalone = { id: 'single', name: 'Standalone' }
  state.toggleGroup(standalone, true)
  assert.equal(state.isGroupChecked(standalone), true)
})
