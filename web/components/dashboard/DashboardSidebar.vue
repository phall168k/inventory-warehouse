<script setup lang="ts">

  withDefaults(defineProps<{ collapsed?: boolean }>(), { 
    collapsed: false 
  });

  const emit = defineEmits<{ navigate: [] }>()
  const route = useRoute()
  const { can } = usePermission()
  const items: {
    label: string
    to: string
    icon: string
    available: boolean
    permission?: string | string[] | null
  }[] = [
    { 
      label: 'Dashboard', 
      to: '/', 
      icon: 'energy-icons:dashboard-20', 
      available: true 
    },
    { 
      label: 'Reports', 
      to: '/reports', 
      icon: 'akar-icons:statistic-up', 
      available: false 
    },
    { 
      label: 'user.title', 
      to: '/admin/system/users', 
      icon: 'boxicons:user-id-card', 
      available: true, 
      permission: 'user-read' 
    },
    { 
      label: 'role.title', 
      to: '/admin/system/roles', 
      icon: 'hugeicons:security-lock', 
      available: true, 
      permission: 'role-read' 
    },
  ];

  const visibleItems = computed(() => 
    items.filter(item => item.permission == null || can(item.permission)
  ));
</script>

<template>
  <div 
    class="sidebar flex h-full flex-col overflow-hidden border-r border-slate-200 bg-white" 
    :class="{ collapsed }"
  >
    <NuxtLink 
      to="/" 
      class="flex h-20 shrink-0 items-center gap-3 border-b border-slate-100 px-5" 
      aria-label="Warehouse dashboard" 
      @click="emit('navigate')"
    >
      <img 
        src="/logo/logo.webp" 
        alt="" 
        class="h-10 w-10 shrink-0 rounded-xl object-contain"
      >
      <div 
        class="sidebar-label whitespace-nowrap"
      >
        <p 
          class="text-sm font-bold tracking-tight text-slate-900"
        >
          Warehouse<span class="text-emerald-600">.</span>
        </p>
        <p 
          class="mt-0.5 text-[11px] text-slate-400"
        >
          Management System
        </p>
      </div>
    </NuxtLink>

    <div 
      class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-7"
    >
      <p 
        class="sidebar-label mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400"
      >
        Workspace
      </p>
      <nav 
        aria-label="Main navigation" 
        class="space-y-1.5"
      >
        <template 
          v-for="item in visibleItems" 
          :key="item.to"
        >
          <NuxtLink
            v-if="item.available"
            :to="item.to"
            :aria-label="$t(item.label)"
            :aria-current="route.path === item.to ? 'page' : undefined"
            :title="collapsed ? item.label : undefined"
            class="nav-item"
            :class="route.path === item.to ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'"
            @click="emit('navigate')"
          >
            <Icon 
              :name="item.icon" 
              :size="20"
            />
            <span class="sidebar-label">{{ $t(item.label)}}</span>
          </NuxtLink>
          <button 
            v-else t
            ype="button" 
            disabled 
            class="nav-item w-full cursor-not-allowed text-slate-400" 
            :aria-label="`${item.label}, coming soon`" 
            :title="`${item.label} — coming soon`"
          >
            <el-icon 
              :size="20"
            >
                <component :is="item.icon" />
            </el-icon>
            <span 
              class="sidebar-label flex flex-1 items-center justify-between gap-2"
            >
              {{ $t(item.label) }} <span class="text-[9px] font-normal uppercase tracking-wide text-slate-300">Soon</span>
            </span>
          </button>
        </template>
      </nav>
    </div>

    <div class="h-24 shrink-0 border-t border-slate-100 p-4">
      <div class="flex h-16 items-center gap-3 overflow-hidden rounded-xl bg-slate-50 px-3">
        <span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
        <div class="sidebar-label whitespace-nowrap">
          <p class="text-xs font-medium text-slate-600">Warehouse workspace</p>
          <p class="mt-1 text-[11px] text-slate-400">Keep your operations organized</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-item { display: flex; align-items: center; gap: 12px; height: 46px; padding: 0 16px; border-radius: 10px; font-size: 13px; font-weight: 500; white-space: nowrap; }
.nav-item :deep(.el-icon) { flex-shrink: 0; }
.sidebar-label { opacity: 1; }
.collapsed .sidebar-label { opacity: 0; visibility: hidden; pointer-events: none; }
@media (prefers-reduced-motion: no-preference) {
  .sidebar-label { transition: opacity 150ms ease, visibility 150ms; }
  .nav-item { transition: background-color 150ms ease, color 150ms ease; }
}
</style>
