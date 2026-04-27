<script lang="ts" setup>
  import { ref, computed, nextTick, watch, onBeforeUnmount, type PropType } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ArrowDownIcon from '@/assets/images/icons/arrow-down.svg'
  import CloseIcon from '@/assets/images/icons/close.svg'

  const { t } = useI18n()
  const emit = defineEmits(['selectItem'])

  const props = defineProps({
    items: {
      type: Array as PropType<{ id: string | number; text: string }[]>,
      required: true
    },
    selected: {
      type: [String, Number, null] as PropType<string | number | null>,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxVisibleItems: {
      type: Number,
      default: 0
    },
    searchable: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: ''
    }
  })

  const resolvedSearchPlaceholder = computed(() => props.searchPlaceholder || t('web_search_placeholder_text'))

  const dropdownMaxHeight = computed(() => {
    if (!props.maxVisibleItems) return undefined
    const itemHeight = 44
    return `${props.maxVisibleItems * itemHeight}px`
  })

  const isOpen = ref(false)
  const searchQuery = ref('')
  const searchInput = ref<HTMLInputElement | null>(null)
  const selectWrapper = ref<HTMLElement | null>(null)
  const selectedItemText = computed(() => props.items.find((item) => item.id === props.selected)?.text)

  const filteredItems = computed(() => {
    if (!props.searchable || !searchQuery.value) return props.items
    const query = searchQuery.value.toLowerCase()
    return props.items.filter((item) => item.text.toLowerCase().includes(query))
  })

  const closeDropdown = () => {
    isOpen.value = false
    searchQuery.value = ''
  }

  const onClickOutside = (event: MouseEvent) => {
    if (selectWrapper.value && !selectWrapper.value.contains(event.target as Node)) {
      closeDropdown()
    }
  }

  watch(isOpen, (val) => {
    if (val) {
      document.addEventListener('click', onClickOutside, true)
    } else {
      document.removeEventListener('click', onClickOutside, true)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside, true)
  })

  const toggleOpen = async () => {
    isOpen.value = !isOpen.value
    if (isOpen.value && props.searchable) {
      searchQuery.value = ''
      await nextTick()
      searchInput.value?.focus()
    }
  }

  const handleSelect = (itemId: string | number) => {
    emit('selectItem', itemId)
    closeDropdown()
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchInput.value?.focus()
  }
</script>

<template>
  <div ref="selectWrapper" class="tn:relative tn:w-full tn:text-left tn:outline-none">
    <div
      @click="toggleOpen"
      :class="[
        'tn:bg-tn-black-50 tn:flex tn:cursor-pointer tn:items-center tn:justify-between tn:gap-2 tn:text-sm tn:font-medium tn:select-none',
        'tn:py-3 tn:ltr:pr-5 tn:ltr:pl-6 tn:rtl:pr-6 tn:rtl:pl-5',
        'tn:rounded-xl'
      ]"
    >
      <span :class="{ 'tn:opacity-50': !selectedItemText }">{{ selectedItemText || placeholder }}</span>
      <ArrowDownIcon
        :class="[
          'tn:text-tn-black-900 tn:h-6 tn:w-6 tn:min-w-6',
          'tn:transition-transform tn:duration-300 tn:ease-in-out',
          isOpen && 'tn:rotate-180'
        ]"
      />
    </div>
    <div
      v-if="isOpen"
      style="box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1)"
      class="tn:bg-tn-bg tn:absolute tn:right-0 tn:left-0 tn:z-[100000] tn:mt-0.5 tn:rounded-xl tn:shadow-lg"
    >
      <div
        v-if="searchable"
        class="tn:border-tn-black-100 tn:sticky tn:top-0 tn:z-10 tn:flex tn:items-center tn:border-b tn:bg-inherit tn:rounded-t-xl"
      >
        <input
          ref="searchInput"
          v-model="searchQuery"
          :placeholder="resolvedSearchPlaceholder"
          type="text"
          class="tn:w-full tn:bg-inherit tn:px-6 tn:py-3 tn:text-sm tn:outline-none"
        />
        <CloseIcon
          v-if="searchQuery"
          @click.stop="clearSearch"
          class="tn:text-tn-black-400 hover:tn:text-tn-black-900 tn:ltr:mr-6.5 tn:rtl:ml-6.5 tn:h-3 tn:w-3 tn:min-w-3 tn:cursor-pointer"
        />
      </div>
      <div :style="dropdownMaxHeight ? `max-height: ${dropdownMaxHeight}; overflow-y: auto` : ''">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          @click="() => handleSelect(item.id)"
          :class="[
            'tn:hover:bg-tn-black-50 tn:cursor-pointer tn:px-6 tn:py-3 tn:text-sm tn:font-medium tn:select-none tn:last:rounded-b-xl',
            !searchable && 'tn:first:rounded-t-xl',
            item.id === selected && 'tn:bg-tn-black-50'
          ]"
        >
          {{ item.text }}
        </div>
        <div
          v-if="searchable && filteredItems.length === 0"
          class="tn:px-6 tn:py-3 tn:text-sm tn:opacity-50 tn:rounded-b-xl"
        >
          {{ t('web_search_no_results') }}
        </div>
      </div>
    </div>
  </div>
</template>
