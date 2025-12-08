<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useSlideDownTransition } from '@/composables/useSlideDownTransition'
  import WarningIcon from '@/assets/images/icons/order/warning.svg'
  import WarningToggleIcon from '@/assets/images/icons/order/warning-toggle.svg'

  const props = defineProps({
    serviceId: {
      type: String,
      required: true
    }
  })

  const { locale } = useI18n()
  const { beforeEnter, enter, leave } = useSlideDownTransition()

  const isOpen = ref(false)
  const servicesWarningsData = ref()

  const warningText = computed(() => {
    const dataByLocale = servicesWarningsData.value?.[locale.value] || servicesWarningsData.value?.en
    const dataByService = dataByLocale?.[props.serviceId] || dataByLocale?.default || ''
    return dataByService?.warning || ''
  })

  const loadServicesWarnings = async () => {
    const cachedData = sessionStorage.getItem('servicesWarnings')
    if (cachedData) {
      servicesWarningsData.value = JSON.parse(cachedData)
    } else {
      const warningUrl = import.meta.env.VITE_CDN_BASE_URL + '/service_descriptions_and_warnings.json'
      try {
        const response = await fetch(warningUrl)
        const data = await response.json()
        servicesWarningsData.value = data
        sessionStorage.setItem('servicesWarnings', JSON.stringify(data))
      } catch (e) {}
    }
  }

  onMounted(loadServicesWarnings)

  const toggleWarning = () => {
    isOpen.value = !isOpen.value
  }
</script>

<template>
  <div
    v-if="warningText"
    class="tn:border-primary-900/10 tn:bg-primary-900/5 tn:flex tn:flex-col tn:rounded-2xl tn:border"
  >
    <div class="tn:flex tn:cursor-pointer tn:items-center tn:justify-between tn:p-3" @click.stop="toggleWarning">
      <div class="tn:flex tn:items-center tn:gap-2">
        <WarningIcon class="tn:text-tn-black-900 tn:h-3.5 tn:w-3.5" />
        <span class="tn:text-tn-black-900/60 tn:text-sm tn:font-medium">
          {{ $t('web_warning_message_title') }}
        </span>
      </div>
      <WarningToggleIcon
        class="tn:text-tn-black-900 tn:h-5 tn:w-5 tn:transition-transform tn:duration-300"
        :class="{ 'tn:-!rotate-90': isOpen, 'tn:rotate-90': !isOpen }"
      />
    </div>

    <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-show="isOpen" class="tn:overflow-hidden tn:text-xs">
        <div class="tn:px-3 tn:pb-3">{{ warningText }}</div>
      </div>
    </transition>
  </div>
</template>
