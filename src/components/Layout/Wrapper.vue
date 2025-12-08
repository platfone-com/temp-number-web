<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useLocale } from '@/composables/useLocale'
  import { useMobileMenuVisibility } from '@/composables/useMobileMenuVisibility'
  import locales from '@/services/i18n/locales'
  import type { Locale } from '@/types/locale'
  import { loadLocaleStrings } from '@/services/i18n/loadLocalStrings'

  import DefaultLayout from '@/layouts/Default.vue'
  import WideLayout from '@/layouts/Wide.vue'
  import NarrowLayout from '@/layouts/Narrow.vue'
  import AuthLayout from '@/layouts/Auth.vue'
  import EmptyLayout from '@/layouts/Empty.vue'

  const route = useRoute()
  const { setLocaleParams } = useLocale()
  const { toggleMobileMenu } = useMobileMenuVisibility()

  const container = document.documentElement
  const { locale } = useI18n({ useScope: 'global' })

  const layoutComponent = computed(() => {
    switch (route.meta.layout) {
      case 'wide':
        return WideLayout
      case 'narrow':
        return NarrowLayout
      case 'auth':
        return AuthLayout
      case 'empty':
        return EmptyLayout
      case 'default':
        return DefaultLayout
      default:
        return null
    }
  })

  const onScroll = () => {
    toggleMobileMenu(container)
  }

  const setLocale = async () => {
    const localePathParam = new URLSearchParams(window.location.search).get('locale')
    const localeParam = localePathParam || null

    if (localeParam && locales.includes(localeParam as Locale)) {
      const newLocale = localeParam as Locale
      await loadLocaleStrings(newLocale)
      locale.value = newLocale
      localStorage.setItem('locale', newLocale)
      setLocaleParams(newLocale)
      return
    }

    setLocaleParams()
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll)
    setLocale()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
</script>

<template>
  <component :is="layoutComponent">
    <slot />
  </component>
</template>
