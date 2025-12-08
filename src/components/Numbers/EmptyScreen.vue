<script lang="ts" setup>
  import { useOrderListHeight } from '@/composables/useOrderListHeight'
  import EmptyNumbersIcon from '@/assets/images/icons/empty/numbers.svg'
  import Button from '@/components/Shared/Button.vue'

  const { height } = useOrderListHeight()
</script>

<template>
  <div :style="{ height: `${height}px` }" class="tn:flex tn:items-center tn:justify-center">
    <div class="tn:flex tn:flex-col tn:items-center tn:gap-4 tn:text-center">
      <EmptyNumbersIcon class="tn:h-16 tn:w-16" />
      <div class="tn:flex tn:flex-col tn:gap-1">
        <h3 class="tn:text-2xl tn:leading-[1.625rem] tn:font-medium">{{ $t('web_empty_title_no_numbers') }}</h3>
        <p class="tn:text-sm tn:leading-[160%] tn:opacity-60">{{ $t('web_empty_subtitle_get_a_new_number_now') }}</p>
      </div>
      <Button to="Home" fill>{{ $t('web_empty_screen_cta_button_order_number') }}</Button>
    </div>
  </div>
</template>
