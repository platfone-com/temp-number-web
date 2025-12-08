<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import { useOrderStore } from '@/stores/order'
  import useSharedCss from '@/composables/useSharedCss'
  import { useCatalog } from '@/composables/api/useCatalog'
  import { useActivation } from '@/composables/api/useActivation'
  import { useForceOrder } from '@/composables/useForceOrder'
  import Button from '@/components/Shared/Button.vue'
  import CheckCircleIcon from '@/assets/images/icons/modal/check-circle.svg'

  defineEmits(['closeModal'])

  const modalStore = useModalStore()
  const orderStore = useOrderStore()
  const { servicesMap, countriesMap } = useOrderStore()
  const { getServiceCountryPrice } = useCatalog()
  const { createActivation } = useActivation()
  const { setForceOrderData } = useForceOrder()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const loading = ref(false)
  const activation = computed(() => modalStore.cancelNumberModal.activation)

  const orderNew = async () => {
    if (!activation.value) return
    const service = servicesMap.get(activation.value.service_id)
    const country = countriesMap.get(activation.value.country_id)
    if (!service || !country) return

    loading.value = true
    const priceData = await getServiceCountryPrice(activation.value.service_id, activation.value.country_id)
    if (priceData && priceData.price?.suggested) {
      setForceOrderData({
        service: service,
        country: country,
        price: priceData.price.suggested
      })
      orderStore.selectedService = service
      orderStore.selectedCountry = country
      orderStore.orderPrice = priceData.price.suggested
      await createActivation()
    }
    loading.value = false
  }
</script>

<template>
  <div :class="adaptiveModalWrapperClasses()">
    <CheckCircleIcon class="tn:h-18 tn:w-18" />
    <div>
      <div :class="adaptiveModalHeaderClasses()">
        {{ $t('web_title_number_refunded') }}
      </div>
      <div :class="adaptiveModalSubheaderClasses()">
        {{ $t('web_subtitle_get_another_number_for_this_service_and_country') }}
      </div>
    </div>

    <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
      <Button @click="orderNew" fill block :loading="loading">{{ $t('web_order_new_button') }}</Button>
      <Button @click="$emit('closeModal')" fill block color="secondary">{{ $t('web_no_thanks_button') }}</Button>
    </div>
  </div>
</template>
