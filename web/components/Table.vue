<script setup lang="ts">
import { 
  ArrowDown,
  Close,
  Delete,
  Edit,
  Filter, 
  Plus, 
  Refresh, 
  Search,
  View,
} from '@element-plus/icons-vue'
import Form from './Form.vue'
import { 
  CRUD_ACTION_KEY, 
  CrudDialogState 
} from '~/types/crud'
import type { 
  FormData, 
  PageHeader, 
  TableHeader 
} from '~/types/crud'
import { 
  filterRows, 
  formatValue 
} from '~/utils/crud'

const props = defineProps<{
  headers: TableHeader[]
  pageHeader?: PageHeader
  pageHeaderOptions?: PageHeader
  /** Compatibility with the spelling in the original usage example. */
  ageHeaderOptions?: PageHeader
  crudPath: string
  moduleName?: string | null
  dialogOptions?: {
    /** Dialog width in pixels. */
    width?: number
    fullscreen?: boolean
  }
}>()
const slots = useSlots()
const { t, te } = useI18n()
const translateLabel = (label: string) => te(label) ? t(label) : label
const { can } = usePermission()
const canCreate = computed(() => props.moduleName == null || can(`${props.moduleName}-create`))
const canView = computed(() => props.moduleName == null || can(`${props.moduleName}-read`))
const canEdit = computed(() => props.moduleName == null || can(`${props.moduleName}-update`))
const canDelete = computed(() => props.moduleName == null || can(`${props.moduleName}-delete`))
const hasRowActions = computed(() => canView.value || canEdit.value || canDelete.value)
const {
  fields, 
  rows, 
  total, 
  page, 
  limit, 
  search, 
  loading, 
  busy, 
  error, 
  dialogError, 
  errorFields,
  dialogOpen, 
  action, 
  formData, 
  record, 
  refresh, 
  openDialog, 
  closeDialog, 
  save, 
  remove, 
  applySearch, 
  changeLimit,
} = useCrudTable(props)
provide(CRUD_ACTION_KEY, readonly(action))
const heading = computed(() => props.pageHeader ?? props.pageHeaderOptions ?? props.ageHeaderOptions ?? { title: 'Records' })
const columns = computed(() => props.headers.filter(header => header.key !== 'action'
  && (header.form === false || header.form?.type !== 'password')))
const actionTitle = computed(() => props.headers.find(header => header.key === 'action')?.title ?? 'Actions')
const filters = ref<FormData>({})
const visibleRows = computed(() => filterRows(rows.value, filters.value, props.headers))
const rangeStart = computed(() => total.value > 0 && rows.value.length > 0 ? (page.value - 1) * limit.value + 1 : 0)
const rangeEnd = computed(() => rangeStart.value === 0 ? 0 : Math.min((page.value - 1) * limit.value + rows.value.length, total.value))
const hasFilters = computed(() => Object.values(filters.value).some(value => value != null && value !== ''))
const form = ref<InstanceType<typeof Form>>()
const ready = computed(() => action.value === CrudDialogState.creating || record.value.id != null)
const dialogTitle = computed(() => `${t(`app.${action.value}`)} · ${translateLabel(heading.value.title)}`)
watch(() => props.crudPath, () => { filters.value = {} })
defineExpose({ refresh })
</script>

<template>
  <section class="space-y-5" :aria-label="heading.title">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold tracking-tight text-slate-900">
          {{ $t(heading.title) }}
        </h2>
        <p 
          v-if="heading.description" 
          class="mt-1 text-sm text-slate-500"
        >
          {{ $t(heading.description) }}
        </p>
      </div>
      <div>
        <el-button 
          :loading="loading" 
          aria-label="Refresh records" 
          size="large"
          class="!rounded-xl"
          @click="refresh" 
        >
          <Icon name="boxicons:refresh-ccw-alt"/>
           &nbsp; {{ $t('app.refresh') }}
        </el-button>
        <el-button 
          v-if="canCreate"
          type="primary" 
          :disabled="busy" 
          size="large"
          class="!rounded-xl"
          @click="openDialog(CrudDialogState.creating)"
        >
          <Icon
            name="ci:add-plus-circle"
          /> &nbsp; {{ $t('app.create') }}
        </el-button>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <form class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4" @submit.prevent="applySearch">
        <el-input 
          v-model="search" 
          :placeholder="$t('app.search')" 
          aria-label="Search all records" 
          clearable 
          class="!w-full"
          style="--el-input-border-radius: 0.7rem"
          size="large"
          @clear="applySearch" 
        >
          <template #prefix>
            <Icon name="akar-icons:search"/>
          </template>
        </el-input>
      </form>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div v-if="error" role="alert" class="p-4">
        <el-alert :title="error" type="error" :closable="false" show-icon />
        <el-button class="mt-3" @click="refresh">Try again</el-button>
      </div>
      <template v-else>
        <div v-if="hasFilters" class="flex flex-wrap items-center gap-3 px-4 pt-3 text-xs text-slate-500">
          <span>{{ visibleRows.length }} matching records on this page. Column filters apply to this page; search covers all records.</span>
          <el-button size="small" text @click="filters = {}">Clear filters</el-button>
        </div>
        <el-table 
          v-loading="loading" 
          :data="visibleRows" 
          row-key="id" 
          empty-text="No records found" 
          :aria-busy="loading"
          size="large"
          stripe
        >
          <el-table-column 
            v-for="header in columns" 
            :key="header.key" 
            :prop="header.key" 
            :label="translateLabel(header.title)" 
            :min-width="header.width ?? 170" 
            show-overflow-tooltip
          >
            <template #header>
              <div class="flex items-center gap-2">
                <span>{{ translateLabel(header.title)}}</span>
                <el-popover v-if="header.filterOption" trigger="click" :width="230">
                  <template #reference>
                    <el-button 
                      :icon="Filter" 
                      size="small" 
                      text 
                      :aria-label="`Filter ${translateLabel(header.filterOption.label)}`" 
                    />
                  </template>
                  <label 
                    class="mb-2 block text-xs font-medium"
                  >
                    {{ translateLabel(header.filterOption.label) }} · this page
                  </label>
                  <el-select 
                    v-if="header.filterOption.type === 'boolean' || header.filterOption.type === 'select'" 
                    :model-value="filters[header.key] as string | number | boolean"
                    @update:model-value="filters[header.key] = $event" 
                    clearable 
                    class="w-full" 
                    :aria-label="translateLabel(header.filterOption.label)"
                  >
                    <el-option 
                      v-for="option in header.filterOption.options ?? [{ label: 'Yes', value: true }, { label: 'No', value: false }]" 
                      :key="String(option.value)" 
                      :label="option.label" 
                      :value="option.value" 
                    />
                  </el-select>
                  <el-input-number 
                    v-else-if="header.filterOption.type === 'number'" 
                    :model-value="filters[header.key] as number | null" 
                    :aria-label="translateLabel(header.filterOption.label)" 
                    class="!w-full" 
                    @update:model-value="filters[header.key] = $event" 
                  />
                  <el-date-picker 
                    v-else-if="header.filterOption.type === 'date'" 
                    :model-value="filters[header.key] as string" 
                    value-format="YYYY-MM-DD" 
                    :aria-label="translateLabel(header.filterOption.label)" 
                    class="!w-full" 
                    @update:model-value="filters[header.key] = $event" 
                  />
                  <el-input 
                    v-else 
                    :model-value="filters[header.key] as string" 
                    clearable 
                    :aria-label="translateLabel(header.filterOption.label)" 
                    @update:model-value="filters[header.key] = $event" 
                  />
                </el-popover>
              </div>
            </template>
            <template #default="{ row }">
              <slot 
                :name="`item.${header.key}`" 
                :item="row" :value="row[header.key]"
              >
                <slot 
                  :name="`cell-${header.key}`" 
                  :row="row" 
                  :value="row[header.key]"
                >
                  {{ formatValue(header, row) }}
                </slot>
              </slot>
            </template>
          </el-table-column>
          <el-table-column 
            v-if="hasRowActions" 
            :label="translateLabel(actionTitle)" 
            width="150" 
            fixed="right" 
            align="center"
          >
            <template #default="{ row }">
              <el-dropdown trigger="click" :disabled="busy">
                <el-button 
                  :disabled="busy" 
                  :aria-label="`Actions for record ${row.id}`"
                  class="!bg-gray-50 !rounded-lg !px-3"
                >
                  <Icon name="akar-icons:more-vertical"/>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item 
                      v-if="canView" 
                      :disabled="busy" 
                      @click="openDialog(CrudDialogState.viewing, row)"
                    >
                      <Icon 
                        name="carbon:view"
                        :size="18"
                      />&nbsp; {{ $t('app.view') }}
                    </el-dropdown-item>
                    <el-dropdown-item 
                      v-if="canEdit" 
                      :disabled="busy" 
                      class="!text-green-600" 
                      @click="openDialog(CrudDialogState.editing, row)"
                    >
                      <Icon 
                        name="basil:edit-outline"
                        :size="18"
                      /> &nbsp; {{ $t('app.edit') }}
                    </el-dropdown-item>
                    <el-dropdown-item 
                      v-if="canDelete" 
                      :disabled="busy" 
                      :divided="canView || canEdit" 
                      class="!text-red-600" 
                      @click="remove(row)"
                    >
                      <Icon 
                        name="fluent:delete-32-regular"
                        :size="18"
                      /> &nbsp; {{ $t('app.delete') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-5">
        <div class="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
          <span>{{ $t('app.showing') }} {{ rangeStart }}–{{ rangeEnd }} {{ $t('app.of') }} {{ total }} {{ $t('app.record') }}</span>
          <div class="flex items-center gap-2 border-l border-slate-200 pl-3">
            <span>{{ $t('app.per_page')}} :</span>
            <el-select
              :model-value="limit"
              class="table-page-size !w-28"
              size="default"
              aria-label="Records per page"
              :disabled="loading || busy"
              @update:model-value="changeLimit"
            >
              <el-option v-for="size in [10, 25, 50, 100]" :key="size" :label="`${size} / ${$t('app.page')}`" :value="size" />
            </el-select>
          </div>
        </div>
        <div class="max-w-full overflow-x-auto">
          <el-pagination 
            v-model:current-page="page" 
            :page-size="limit" 
            :total="total" 
            layout="prev, pager, next"
            background 
            style="--el-pagination-border-radius: 0.7rem"
            :disabled="loading || busy" 
          />
        </div>
      </div>
    </div>

    <el-dialog 
      :model-value="dialogOpen" 
      :title="dialogTitle" 
      :width="props.dialogOptions?.width ?? 'min(640px, 94vw)'"
      :fullscreen="props.dialogOptions?.fullscreen ?? false"
      :show-close="false" 
      :close-on-click-modal="!busy" 
      :close-on-press-escape="!busy" 
      destroy-on-close @close="closeDialog"
      draggable
      :class="{ '!rounded-2xl': !props.dialogOptions?.fullscreen }"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="flex items-center justify-between gap-4">
          <h2 :id="titleId" :class="titleClass">{{ dialogTitle }}</h2>
          <button
            type="button"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--el-color-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :aria-label="$t('app.close')"
            :disabled="busy"
            @mousedown.stop
            @click="close"
          >
            <el-icon :size="18"><Close /></el-icon>
          </button>
        </div>
      </template>
      <el-alert v-if="dialogError" :title="dialogError" type="error" :closable="false" show-icon class="mb-4" />
      <div v-loading="busy" :aria-busy="busy">
        <el-descriptions v-if="action === CrudDialogState.viewing" :column="1" border>
          <el-descriptions-item v-for="header in columns" :key="header.key" :label="translateLabel(header.title)">{{ formatValue(header, record) }}</el-descriptions-item>
        </el-descriptions>
        <Form v-else-if="ready" ref="form" v-model="formData" :fields="fields" :external-errors="errorFields" :mode="action === CrudDialogState.creating ? 'create' : 'edit'" :disabled="busy" :show-actions="false" @submit="save">
          <template v-if="slots.form" #default>
            <slot name="form" :form-ref="formData" :form-data="formData" :external-errors="errorFields" :error-fields="errorFields" :action="action" :disabled="busy" />
          </template>
        </Form>
      </div>
      <template #footer>
        <el-button 
          :disabled="busy" 
          @click="closeDialog"
          size="large"
          class="!rounded-xl"
        >
          {{ action === CrudDialogState.viewing ? $t('app.close') : $t('app.cancel') }}
        </el-button>
        <el-button 
          v-if="action === CrudDialogState.creating ? canCreate : action === CrudDialogState.editing && canEdit" 
          type="primary" 
          :loading="busy" 
          :disabled="!ready" 
          size="large"
          class="!rounded-xl"
          @click="form?.submit()"
        >
          {{ action === CrudDialogState.creating ? $t('app.add_new') : $t('app.save_change') }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.table-page-size :deep(.el-select__wrapper) {
  border-radius: 0.7rem;
  box-shadow: 0 0 0 1px var(--el-border-color) inset, 0 1px 2px rgb(15 23 42 / 8%);
}
</style>
