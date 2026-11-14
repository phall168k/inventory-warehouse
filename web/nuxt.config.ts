// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { 
    enabled: true 
  },
  modules: [
    '@nuxtjs/tailwindcss', 
    '@element-plus/nuxt', 
    '@nuxt/icon/module', 
    '@nuxtjs/i18n'
  ],
  css: ['~/assets/css/element-plus.css'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json', language: 'en-US' },
      { code: 'km', file: 'km.json', language: 'KH' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',     // folder name
    strategy: 'no_prefix',   // /page (no /en/page)
  },
  runtimeConfig: {
    public: {
      NUXT_PUBLIC_API: process.env.NUXT_PUBLIC_API,
    }
  },
})
