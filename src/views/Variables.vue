<script lang="ts" setup>
  import { ref, computed, type ComponentPublicInstance } from 'vue'
  import { useClipboard } from '@/composables/useClipboard'
  import PageHeader from '@/components/Shared/PageHeader.vue'

  const { copyToClipboard } = useClipboard()

  const varsRefs = ref<Record<string, HTMLElement | undefined>>({})

  const variables = computed(() => ({
    VITE_FIREBASE_WEB_API_KEY: import.meta.env.VITE_FIREBASE_WEB_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_TEMP_NUMBER_BACKEND_API_BASE_PATH: import.meta.env.VITE_TEMP_NUMBER_BACKEND_API_BASE_PATH,
    VITE_TELEGRAM_BOT_ID: import.meta.env.VITE_TELEGRAM_BOT_ID,
    VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL: import.meta.env.VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL,
    VITE_TEMP_NUMBER_WEB_ENABLED_PAYMENT_GATEWAYS: import.meta.env.VITE_TEMP_NUMBER_WEB_ENABLED_PAYMENT_GATEWAYS,
    VITE_CDN_BASE_URL: import.meta.env.VITE_CDN_BASE_URL,
    VITE_RECAPTCHA_ENTERPRISE_ENABLED: import.meta.env.VITE_RECAPTCHA_ENTERPRISE_ENABLED,
    VITE_RECAPTCHA_ENTERPRISE_SITE_KEY: import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY,
    VITE_CSP_ENABLED: import.meta.env.VITE_CSP_ENABLED
  }))

  const setVarRef = (key: string) => (el: Element | ComponentPublicInstance | null) => {
    varsRefs.value[key] = el as HTMLElement | undefined
  }
</script>

<template>
  <div class="tn:mb-16 tn:mt-6">
    <PageHeader>Variables</PageHeader>
    <div
      v-for="(value, key) of variables"
      :key="key"
      class="tn:rounded-2xl tn:border tn:border-slate-200 tn:p-3 tn:mb-3 tn:block tn:break-all"
    >
      <strong class="tn:opacity-40">{{ key }}</strong>
      <div
        :ref="setVarRef(key)"
        @click="() => copyToClipboard((value || '').toString(), varsRefs[key], 1500)"
        class="tn:cursor-pointer"
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>
