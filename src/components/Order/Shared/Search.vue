<script lang="ts" setup>
  import { ref, watch, type PropType, onBeforeUnmount } from 'vue'
  import { storeToRefs } from 'pinia'
  import config from '@/config'
  import { useOrderStore } from '@/stores/order'
  import { useAppStore } from '@/stores/app'
  import { useDevice } from '@/composables/useDevice'
  import SearchIcon from '@/assets/images/icons/search.svg'
  import InputClearIcon from '@/assets/images/icons/form/input-clear.svg'

  interface ISearchProps {
    searchType: 'service' | 'country'
  }

  const props = defineProps({
    searchType: {
      type: String as PropType<ISearchProps['searchType']>,
      default: 'service'
    }
  })

  const appStore = useAppStore()
  const orderStore = useOrderStore()
  const { serviceSearchStr, countrySearchStr, isSearchFocused } = storeToRefs(orderStore)

  const inputRef = ref<HTMLInputElement | null>(null)
  const searchQuery = ref(props.searchType === 'service' ? orderStore.serviceSearchStr : orderStore.countrySearchStr)

  const { isMobile } = useDevice()

  let blurTimer: number | null = null

  const handleFocus = () => {
    if (blurTimer) {
      clearTimeout(blurTimer)
      blurTimer = null
    }
    orderStore.isSearchFocused = true
    if (isMobile.value) {
      appStore.isMobileHeaderHidden = true
      appStore.showMobileMenu = false
    }
  }

  const collapseSearchUI = () => {
    orderStore.isSearchFocused = false
    if (isMobile.value) {
      appStore.isMobileHeaderHidden = false
      appStore.showMobileMenu = true
    }
  }

  const handleBlur = () => {
    if (blurTimer) clearTimeout(blurTimer)
    orderStore.isSearchFocused = false
    blurTimer = window.setTimeout(() => {
      if (inputRef.value && document.activeElement === inputRef.value) return
      collapseSearchUI()
      blurTimer = null
    }, 200)
  }

  const blurInput = () => {
    if (blurTimer) {
      clearTimeout(blurTimer)
      blurTimer = null
    }
    inputRef.value?.blur()
    collapseSearchUI()
  }

  const clear = () => {
    searchQuery.value = ''
    inputRef.value?.focus()
  }

  const cancel = () => {
    blurInput()
  }

  let debounceTimer: ReturnType<typeof setTimeout>
  watch(searchQuery, (newQuery: string) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      if (props.searchType === 'service') {
        orderStore.serviceSearchStr = newQuery
      } else {
        orderStore.countrySearchStr = newQuery
      }
    }, 150)
  })

  watch(
    () => serviceSearchStr.value,
    (newQuery: string) => {
      if (!newQuery && searchQuery.value) clear()
    }
  )

  watch(
    () => countrySearchStr.value,
    (newQuery: string) => {
      if (!newQuery && searchQuery.value) clear()
    }
  )

  onBeforeUnmount(() => {
    if (blurTimer) {
      clearTimeout(blurTimer)
      blurTimer = null
    }
  })
</script>

<template>
  <div class="tn:flex-1 tn:lg:mb-3 tn:lg:px-6">
    <div class="tn:group tn:relative">
      <SearchIcon
        :class="[
          'tn:absolute tn:top-1/2 tn:h-6 tn:w-6 tn:-translate-y-1/2 tn:transform tn:ltr:left-4 tn:rtl:right-4',
          config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#272E35]'
        ]"
      />
      <input
        :data-testid="`order-${props.searchType}-search-input`"
        v-model="searchQuery"
        ref="inputRef"
        type="text"
        :placeholder="$t('web_search_placeholder_text')"
        :class="[
          'tn:bg-tn-black-50 tn:border-tn-black-50 tn:flex tn:w-full tn:items-center tn:rounded-2xl tn:border tn:text-sm',
          'tn:px-12 tn:py-4.5',
          'tn:outline-none',
          'tn:group-hover:border-primary-500 tn:focus:border-primary-900 tn:transition-colors tn:duration-300'
        ]"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.esc="blurInput"
      />
      <button
        v-if="searchQuery"
        :data-testid="`order-${props.searchType}-search-clear`"
        type="button"
        class="tn:absolute tn:top-1/2 tn:h-5.5 tn:w-5.5 tn:-translate-y-1/2 tn:transform tn:ltr:right-4 tn:rtl:left-4"
        @click.prevent.stop="clear"
      >
        <InputClearIcon class="tn:text-tn-black-900 tn:h-5.5 tn:w-5.5" />
      </button>
      <button
        v-if="isMobile && isSearchFocused && !searchQuery"
        :data-testid="`order-${props.searchType}-search-cancel`"
        type="button"
        class="tn:text-tn-black-300 tn:absolute tn:top-1/2 tn:h-5.5 tn:w-5.5 tn:-translate-y-1/2 tn:transform tn:text-xs tn:ltr:right-10 tn:rtl:left-10"
        @click.prevent.stop="cancel"
      >
        {{ $t('web_cancel_search_button') }}
      </button>
    </div>
  </div>
</template>
