<script lang="ts" setup>
  import { computed, type ComputedRef } from 'vue'
  import config from '@/config'

  interface MenuItem {
    text: string
    routeName?: string
    url?: string
    target?: string
    noTranslate?: boolean
  }

  const emit = defineEmits(['closeSidebar'])

  const menuItems: ComputedRef<MenuItem[]> = computed(() => {
    let menuItems: MenuItem[] = []
    if (config.wlWidgetMode) {
      const platfoneBaseUrl = import.meta.env.VITE_PLATFONE_BASE_URL
      menuItems = [
        {
          text: 'web_privacy_policy',
          url: `${platfoneBaseUrl}/compliance#privacy`,
          target: '_blank'
        },
        {
          text: 'web_terms_of_service',
          url: `${platfoneBaseUrl}/compliance#terms`,
          target: '_blank'
        }
      ]
    } else {
      menuItems = [
        {
          text: 'web_privacy_policy',
          routeName: 'Privacy'
        },
        {
          text: 'web_terms_of_service',
          routeName: 'Terms'
        },
        {
          text: 'web_refund_policy',
          url: 'https://help.temp-number.org/en/article/refund-policy-1ma49c2/',
          target: '_blank'
        }
      ]
    }

    return menuItems
  })
</script>

<template>
  <div class="tn:py-6">
    <ul class="tn:flex tn:flex-col tn:gap-1.5">
      <li v-for="(item, index) in menuItems" :key="index">
        <router-link
          v-if="item.routeName"
          @click="emit('closeSidebar')"
          :to="{ name: item.routeName }"
          class="tn:hover:text-primary-900 tn:block tn:py-1 tn:text-[0.9375rem]"
        >
          {{ item.noTranslate ? item.text : $t(item.text) }}
        </router-link>
        <a
          v-else-if="item.url"
          @click="emit('closeSidebar')"
          :href="item.url"
          class="tn:hover:text-primary-900 tn:block tn:py-1 tn:text-[0.9375rem]"
          :target="item.target"
        >
          {{ item.noTranslate ? item.text : $t(item.text) }}
        </a>
      </li>
      <li v-if="!config.wlWidgetMode">
        <router-link
          @click="emit('closeSidebar')"
          :to="{ name: 'API' }"
          class="tn:hover:text-primary-900 tn:block tn:py-1 tn:text-[0.9375rem]"
        >
          White-Label
          <span class="tn:inline-block tn:px-1.5 tn:bg-primary-900 tn:rounded-lg tn:text-white tn:font-medium"
            >API</span
          >
        </router-link>
      </li>
    </ul>
  </div>
</template>
