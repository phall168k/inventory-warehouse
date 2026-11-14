<script setup lang="ts">
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import DashboardSidebar from '~/components/dashboard/DashboardSidebar.vue'

const route = useRoute()
const { user, logout } = useAuth()
const collapsed = ref(false)
const mobileOpen = ref(false)
const loggingOut = ref(false)
const userName = computed(() => user.value?.nameEn || user.value?.username || 'Administrator')
const pageTitle = computed(() => {
  if (typeof route.meta.title === 'string') return route.meta.title
  const segment = route.path.split('/').filter(Boolean).pop()
  return segment ? segment.replace(/[-_]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()) : 'Dashboard'
})

const toggleNavigation = () => {
  if (window.matchMedia('(min-width: 768px)').matches) collapsed.value = !collapsed.value
  else mobileOpen.value = !mobileOpen.value
}

const handleLogout = async () => {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await logout()
  } finally {
    loggingOut.value = false
  }
}

watch(() => route.fullPath, () => { mobileOpen.value = false })

// Close the modal when switching to desktop, including its focus trap and overlay.
onMounted(() => {
  const media = window.matchMedia('(min-width: 768px)')
  const closeMobileNavigation = () => { if (media.matches) mobileOpen.value = false }
  media.addEventListener('change', closeMobileNavigation)
  onBeforeUnmount(() => media.removeEventListener('change', closeMobileNavigation))
});

</script>

<template>
  <div class="dashboard-shell min-h-screen bg-slate-50 text-slate-800" :class="{ 'is-collapsed': collapsed }">
    <a href="#main-content" class="sr-only z-[100] rounded bg-white p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>

    <aside id="desktop-sidebar" class="dashboard-sidebar fixed inset-y-0 left-0 z-40 hidden md:block">
      <DashboardSidebar :collapsed="collapsed" />
    </aside>

    <el-drawer v-model="mobileOpen" title="Navigation" direction="ltr" size="280px" :with-header="false" :show-close="false" body-class="!p-0">
      <div class="relative h-full">
        <button type="button" aria-label="Close navigation" class="absolute right-2 top-1 z-10 rounded px-2 text-xl text-slate-400 hover:text-slate-700" @click="mobileOpen = false">×</button>
        <DashboardSidebar @navigate="mobileOpen = false" />
      </div>
    </el-drawer>

    <DashboardHeader
      class="dashboard-header fixed right-0 top-0 z-30"
      :title="pageTitle"
      :user-name="userName"
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      :logging-out="loggingOut"
      @toggle="toggleNavigation"
      @logout="handleLogout"
    />

    <main id="main-content" tabindex="-1" class="dashboard-content min-h-screen pt-20">
      <div class="mx-auto w-full max-w-screen-2xl p-4 md:p-4 lg:p-4">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-shell {
  --sidebar-width: 280px;
  --navigation-motion: 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.dashboard-shell.is-collapsed { --sidebar-width: 80px; }
.dashboard-sidebar { width: var(--sidebar-width); }
.dashboard-header { left: 0; }
@media (min-width: 768px) {
  .dashboard-header { left: var(--sidebar-width); }
  .dashboard-content { margin-left: var(--sidebar-width); }
}
@media (prefers-reduced-motion: no-preference) {
  .dashboard-sidebar { transition: width var(--navigation-motion); }
  .dashboard-header { transition: left var(--navigation-motion); }
  .dashboard-content { transition: margin-left var(--navigation-motion); }
}
</style>
