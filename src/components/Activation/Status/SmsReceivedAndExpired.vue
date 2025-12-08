<script lang="ts" setup>
  import { type PropType } from 'vue'
  import { type IActivation } from '@/types/api/activation'
  import { useModalStore } from '@/stores/modal'
  import OpenMessageIcon from '@/assets/images/icons/order/open-message.svg'
  import Button from '@/components/Shared/Button.vue'

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const modalStore = useModalStore()

  const openMessage = () => {
    modalStore.copyNumberMessageModal = { status: true, activation: props.activation }
  }
</script>

<template>
  <Button
    @click="openMessage"
    fill
    block
    gap="tn:gap-2"
    class="tn:flex tn:items-center tn:justify-center tn:gap-2 tn:border-none"
  >
    {{ $t('web_open_message_button') }}
    <OpenMessageIcon class="tn:h-6 tn:w-6 tn:min-w-6 tn:fill-current tn:text-white" />
  </Button>
</template>
