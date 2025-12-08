<script lang="ts" setup>
  import { ref, computed, type PropType } from 'vue'
  import ArrowDownIcon from '@/assets/images/icons/arrow-down.svg'

  const emit = defineEmits(['selectItem'])

  const props = defineProps({
    items: {
      type: Array as PropType<{ id: string | number; text: string }[]>,
      required: true
    },
    selected: {
      type: [String, Number, null] as PropType<string | number | null>,
      default: null
    }
  })

  const isOpen = ref(false)
  const selectedItemText = computed(() => props.items.find((item) => item.id === props.selected)?.text)

  const handleSelect = (itemId: string | number) => {
    emit('selectItem', itemId)
    isOpen.value = false
  }
</script>

<template>
  <div tabindex="0" @blur="isOpen = false" class="tn:relative tn:w-full tn:text-left tn:outline-none">
    <div
      @click="isOpen = !isOpen"
      :class="[
        'tn:bg-tn-black-50 tn:flex tn:cursor-pointer tn:items-center tn:justify-between tn:gap-2 tn:text-sm tn:font-medium tn:select-none',
        'tn:py-3 tn:ltr:pr-5 tn:ltr:pl-6 tn:rtl:pr-6 tn:rtl:pl-5',
        'tn:rounded-xl'
      ]"
    >
      <span>{{ selectedItemText }}</span>
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
        v-for="item in items"
        :key="item.id"
        @click="() => handleSelect(item.id)"
        :class="[
          'tn:hover:bg-tn-black-50 tn:cursor-pointer tn:px-6 tn:py-3 tn:text-sm tn:font-medium tn:select-none tn:first:rounded-t-xl tn:last:rounded-b-xl',
          item.id === selected && 'tn:bg-tn-black-50'
        ]"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>
