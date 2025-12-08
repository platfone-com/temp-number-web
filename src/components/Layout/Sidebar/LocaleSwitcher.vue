<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import config from '@/config'
  import { useLocale } from '@/composables/useLocale'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { type Locale } from '@/types/locale'
  import { loadLocaleStrings } from '@/services/i18n/loadLocalStrings'
  import locales from '@/services/i18n/locales'
  import i18n from '@/services/i18n'

  const emit = defineEmits(['closeSidebar'])

  const { getWlScriptDataParams } = useWlHelper()

  const { locale } = useI18n({ useScope: 'global' })

  const storedLocale = localStorage.getItem('locale') as Locale | null
  const selected = ref<Locale>(storedLocale && locales.includes(storedLocale) ? storedLocale : 'en')
  const open = ref(false)
  const localesNames = computed(() => {
    return {
      en: i18n.global.t('web_english'),
      ar: i18n.global.t('web_arabic'),
      zh: i18n.global.t('web_chinese'),
      fr: i18n.global.t('web.french'),
      de: i18n.global.t('web.german'),
      he: i18n.global.t('web_hebrew'),
      ja: i18n.global.t('web.japanese'),
      ko: i18n.global.t('web.korean'),
      pt: i18n.global.t('web_portuguese'),
      ru: i18n.global.t('web_russian'),
      es: i18n.global.t('web_spanish'),
      tr: i18n.global.t('web_turkish'),
      uk: i18n.global.t('web.ukrainian')
    }
  })
  const showLocaleSwitcher = computed(() => {
    if (config.wlWidgetMode) {
      const scriptParams = getWlScriptDataParams()
      if (scriptParams?.locale) return false
    }
    return true
  })

  const { setLocaleParams } = useLocale()

  function handleLocaleSwitcherClick() {
    open.value = !open.value
  }

  const changeLocale = async (newLocale: Locale) => {
    open.value = false
    await loadLocaleStrings(newLocale)
    selected.value = newLocale
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
    setLocaleParams(newLocale)
    emit('closeSidebar')
  }
</script>

<template>
  <div v-if="showLocaleSwitcher" class="tn:w-full tn:max-w-32">
    <div tabindex="0" @blur="open = false" class="tn:relative tn:w-full tn:text-left tn:outline-none">
      <div
        @click="handleLocaleSwitcherClick"
        :class="[
          'tn:flex tn:h-12 tn:items-center tn:justify-between tn:text-sm tn:font-medium tn:ltr:pr-2 tn:ltr:pl-4 tn:rtl:pr-4 tn:rtl:pl-2',
          'tn:border-tn-black-50 tn:bg-tn-black-50 tn:border tn:cursor-pointer tn:select-none',
          open ? 'tn:border-b-tn-black-100 tn:rounded-t-xl tn:border-b tn:shadow' : 'tn:rounded-xl'
        ]"
      >
        <span>{{ localesNames[selected] }}</span>
        <svg
          class="tn:h-4 tn:w-4 tn:transition-transform tn:duration-200"
          :class="open ? 'tn:rotate-180' : 'tn:rotate-0'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div
        v-if="open"
        class="tn:border-tn-black-50 tn:bg-tn-black-50 tn:absolute tn:right-0 tn:left-0 tn:z-[100000] tn:rounded-b-xl tn:border tn:border-t-0 tn:shadow"
      >
        <div
          v-for="(localeName, locale) in localesNames"
          :key="locale"
          @click="changeLocale(locale)"
          class="tn:hover:text-primary-900 tn:cursor-pointer tn:px-4 tn:py-2 tn:text-sm tn:font-medium tn:select-none"
        >
          {{ localeName }}
        </div>
      </div>
    </div>
  </div>
</template>
