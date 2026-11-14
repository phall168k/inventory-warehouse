<script setup lang="ts">
import { ArrowDown, Expand, Fold, SwitchButton } from '@element-plus/icons-vue'

type AppLocale = 'en' | 'km';
const { t, te, locale, setLocale } = useI18n();

const selectedLocale = ref<AppLocale>(locale.value as AppLocale)

const props = withDefaults(defineProps<{
  title: string
  userName: string
  collapsed?: boolean
  mobileOpen?: boolean
  loggingOut?: boolean
}>(), { collapsed: false, mobileOpen: false, loggingOut: false })
const emit = defineEmits<{ toggle: []; logout: [] }>()
const route = useRoute()
const translatedTitle = computed(() => te(props.title) ? t(props.title) : props.title)

const languageOptions = [
  { label: 'English', value: 'en', flag: 'circle-flags:us' },
  { label: 'ខ្មែរ', value: 'km', flag: 'circle-flags:kh' },
];

watch(selectedLocale, async (value) => {
  await setLocale(value)
})

watch(locale, (value) => {
  selectedLocale.value = value as AppLocale
});

</script>

<template>
  <header class="flex h-20 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 md:px-7">
    <div class="flex min-w-0 flex-1 items-center gap-3 md:gap-5">
      <button type="button" class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 md:inline-flex" :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'" :aria-expanded="!collapsed" aria-controls="desktop-sidebar" @click="emit('toggle')">
        <el-icon :size="20"><component :is="collapsed ? Expand : Fold" /></el-icon>
      </button>
      <button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 md:hidden" aria-label="Open navigation" :aria-expanded="mobileOpen" @click="emit('toggle')">
        <el-icon :size="20"><Expand /></el-icon>
      </button>
      <div class="min-w-0">
        <h1 class="truncate text-base font-semibold tracking-tight text-slate-900 md:text-lg">{{ translatedTitle }}</h1>
        <nav aria-label="Breadcrumb" class="mt-1 truncate text-xs text-slate-400">
          <span v-if="route.path === '/'" aria-current="page">Workspace / Dashboard</span>
          <template v-else>
            <NuxtLink to="/" class="hover:text-emerald-600">Dashboard</NuxtLink>
            <span aria-hidden="true" class="mx-2">/</span>
            <span aria-current="page" class="text-slate-500">{{ translatedTitle }}</span>
          </template>
        </nav>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <el-segmented
          v-model="selectedLocale"
          :options="languageOptions"
          size="small"
          class="language-switcher hidden sm:flex"
        >
          <template #default="{ item }">
            <span class="language-switcher__option">
              <Icon
                :name="item.flag"
                class="language-switcher__flag"
                aria-hidden="true"
              />
              <span class="language-switcher__label">{{ item.label }}</span>
            </span>
          </template>
        </el-segmented>

        <el-dropdown trigger="click" @command="emit('logout')">
          <button type="button" class="flex shrink-0 items-center gap-3 rounded-xl p-1.5 text-left hover:bg-slate-50" aria-label="Account menu" :disabled="loggingOut">
            <span class="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-semibold text-emerald-700">{{ userName.charAt(0).toUpperCase() }}</span>
            <span class="hidden max-w-40 sm:block">
              <span class="block truncate text-sm font-medium text-slate-700">{{ userName }}</span>
              <span class="mt-0.5 block text-[11px] text-slate-400">My account</span>
            </span>
            <el-icon class="text-slate-400"><ArrowDown /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout" :icon="SwitchButton" :disabled="loggingOut">{{ loggingOut ? 'Signing out…' : $t('app.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
  .language-switcher {
    --el-segmented-bg-color: #f8fafc;
    --el-segmented-item-hover-bg-color: #eef2f7;
    --el-segmented-item-selected-bg-color: #1F51BC;
    --el-segmented-item-selected-color: #ffffff;
    --el-segmented-item-selected-disabled-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 2px;
  }

  .language-switcher :deep(.el-segmented__group) {
    align-items: center;
    gap: 2px;

  }

  .language-switcher :deep(.el-segmented__item) {
    min-width: 96px;
    height: 25px;
    border-radius: 6px;
    padding: 0 10px;
  }

  .language-switcher :deep(.el-segmented__item-label) {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .language-switcher__option {
    display: inline-flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 7px;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
  }

  .language-switcher__flag {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    border-radius: 9999px;
    box-shadow: 0 0 0 1px rgb(15 23 42 / 8%);
  }

  .language-switcher__label {
    min-width: 0;
  }
</style>

