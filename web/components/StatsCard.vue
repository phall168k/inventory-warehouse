<script setup lang="ts">
type StatsCardColor = 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray' | 'cyan' | 'orange'

const props = withDefaults(defineProps<{
  title: string
  value?: string | number
  icon?: string
  color?: StatsCardColor
}>(), {
  value: 0,
  icon: 'carbon:ibm-data-product-exchange',
  color: 'blue',
})

const colorClasses: Record<StatsCardColor, {
  bg: string
  text: string
}> = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-700',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-700',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
  },
  cyan: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'bg-orange-700'
  }
}

const theme = computed(() => colorClasses[props.color])
</script>

<template>
  <div
    class="bg-white rounded-2xl border-2 border-gray-100 flex items-center px-4 py-6 gap-4"
  >
    <div
      class="rounded-2xl w-[50px] h-[50px] flex items-center justify-center shrink-0"
      :class="theme.bg"
    >
      <Icon
        :size="25"
        :name="icon"
        :class="theme.text"
      />
    </div>

    <div class="min-w-0">
      <div class="text-gray-400 font-bold text-xs">
        {{ $t(title) }}
      </div>

      <div class="font-bold text-3xl">
        {{ formatNumber(value) }}
      </div>
    </div>
  </div>
</template>