// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { 
    enabled: true 
  },
  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt', '@nuxt/icon/module'],
  runtimeConfig: {
    public: {
      NUXT_PUBLIC_API: process.env.NUXT_PUBLIC_API,
    }
  }
})
