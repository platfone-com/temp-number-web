<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import { storeToRefs } from 'pinia'
  import type { IActivation } from '@/types/api/activation'
  import Header from '@/components/Activation/Header/Index.vue'
  import Service from '@/components/Activation/Service.vue'
  import Status from '@/components/Activation/Status/Index.vue'
  import IdAndReport from '@/components/Activation/IdAndReport.vue'
  import Warning from '@/components/Activation/Warning.vue'
  import { useOrderStore } from '@/stores/order.ts'

  defineEmits(['updateActiveNumber'])

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    },
    showWarning: {
      type: Boolean,
      default: true
    }
  })

  const { servicesMap } = storeToRefs(useOrderStore())
  const hasServiceWarning = computed(() => {
    return servicesMap.value?.get(props.activation?.service_id)?.has_warning
  })
</script>

<template>
  <div
    :data-testid="`activation-card-${activation.activation_id}`"
    class="tn:flex tn:flex-col tn:gap-3 tn:rounded-2xl tn:border tn:border-slate-200 tn:p-2"
  >
    <Header :activation="activation" @updateActiveNumber="$emit('updateActiveNumber')" />
    <Service :service-id="activation.service_id" />
    <Status :activation="activation" />
    <IdAndReport :activation="activation" />
    <Warning v-if="showWarning && hasServiceWarning" :service-id="activation.service_id" />
  </div>
</template>
