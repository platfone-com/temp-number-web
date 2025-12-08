<script lang="ts" setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useOrderStore } from '@/stores/order'
  import ImageWithFallback from '@/components/Order/Shared/ImageWithFallback.vue'

  const props = defineProps({
    serviceId: {
      type: String,
      required: true
    }
  })

  const { t } = useI18n()

  const { servicesMap } = storeToRefs(useOrderStore())

  const serviceName = computed(() => {
    return props.serviceId === 'other' ? t('web_any_other_item') : servicesMap.value?.get(props.serviceId)?.name
  })
</script>

<template>
  <div class="tn:flex tn:items-center tn:gap-2 tn:px-2">
    <ImageWithFallback image-type="services" size="tn:h-6 tn:w-6" :image-id="serviceId" />
    <span class="tn:text-sm tn:font-medium">{{ serviceName }}</span>
  </div>
</template>
