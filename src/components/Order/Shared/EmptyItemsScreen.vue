<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import { useOrderListHeight } from '@/composables/useOrderListHeight'
  import { useWindowWidth } from '@/composables/useWindowWidth'
  import { useOrderStore } from '@/stores/order'
  import EmptyNumbersIcon from '@/assets/images/icons/empty/numbers.svg'
  import Button from '@/components/Shared/Button.vue'

  const { orderListHeight } = useOrderListHeight()
  const { windowWidth } = useWindowWidth()
  const { changeCatalogBlock } = useOrderStore()

  const props = defineProps({
    entity: {
      type: String as PropType<'service' | 'country'>,
      required: true
    }
  })

  const bottomMargin = computed(() => (windowWidth.value > 640 ? 12 : 72))
  const pText = computed(() => {
    return props.entity === 'service'
      ? 'web_try_selecting_a_service_first'
      : 'web_emptry_try_selecting_a_different_country'
  })
  const buttonText = computed(() => {
    return props.entity === 'service' ? 'web_select_service_button_cta' : 'web_select_country_button_cta'
  })

  const containerHeight = computed(() => {
    return orderListHeight.value - bottomMargin.value
  })
</script>

<template>
  <div
    class="tn:flex tn:items-center tn:justify-center"
    :style="{ height: containerHeight + 'px', minHeight: '240px' }"
  >
    <div class="tn:flex tn:flex-col tn:items-center tn:gap-4 tn:text-center">
      <EmptyNumbersIcon class="tn:h-16 tn:w-16" />
      <div class="tn:flex tn:flex-col tn:gap-1">
        <h3 class="tn:text-2xl tn:leading-[1.625rem] tn:font-medium">{{ $t('web_empty_title_no_numbers') }}</h3>
        <p class="tn:text-sm tn:leading-[160%] tn:opacity-60">{{ $t(pText) }}</p>
      </div>
      <Button @click="changeCatalogBlock" fill>{{ $t(buttonText) }}</Button>
    </div>
    <slot />
  </div>
</template>
