<script lang="ts" setup>
  import { computed, type ComputedRef } from 'vue'
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'

  interface MenuItem {
    text: string
    routeName?: string
    url?: string
    target?: string
  }

  const emit = defineEmits(['closeSidebar'])

  const { wlHelperTermsUrl, wlHelperPrivacyUrl } = useWlHelper()

  const menuItems: ComputedRef<MenuItem[]> = computed(() => {
    const staticItems: MenuItem[] = [
      {
        text: 'web_refund_policy',
        url: 'https://help.temp-number.org/en/article/refund-policy-1ma49c2/',
        target: '_blank'
      }
    ]
    let specificItems: MenuItem[] = []
    if (config.wlWidgetMode) {
      specificItems = [
        {
          text: 'web_privacy_policy',
          url: wlHelperPrivacyUrl.value,
          target: '_blank'
        },
        {
          text: 'web_terms_of_service',
          url: wlHelperTermsUrl.value,
          target: '_blank'
        }
      ]
    } else {
      specificItems = [
        {
          text: 'web_privacy_policy',
          routeName: 'Privacy'
        },
        {
          text: 'web_terms_of_service',
          routeName: 'Terms'
        }
      ]
    }

    return [...specificItems, ...staticItems]
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
          {{ $t(item.text) }}
        </router-link>
        <a
          v-else-if="item.url"
          @click="emit('closeSidebar')"
          :href="item.url"
          class="tn:hover:text-primary-900 tn:block tn:py-1 tn:text-[0.9375rem]"
          :target="item.target"
        >
          {{ $t(item.text) }}
        </a>
      </li>
      <!--      <li v-if="proVersionUrl">-->
      <!--        <a :href="proVersionUrl + '/api'" class="hover:text-primary-900 block py-1 text-[0.9375rem]">-->
      <!--          {{ $t('text_625fc8bd481518015daf97b1') }}-->
      <!--        </a>-->
      <!--      </li>-->
    </ul>
  </div>
</template>
