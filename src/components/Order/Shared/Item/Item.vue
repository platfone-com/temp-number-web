<script lang="ts" setup>
  import { type PropType, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import config from '@/config'
  import { useModalStore } from '@/stores/modal'
  import { addBreakLinesToText, parseTranslation } from '@/utils/translate'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { useFavorites } from '@/composables/useFavorites'
  import type { IFullCountryPriceData, IFullServicePriceData } from '@/types/api/catalog'
  import ChevronRightIcon from '@/assets/images/icons/chevron-right.svg'
  import ImageWithFallback from '@/components/Order/Shared/ImageWithFallback.vue'
  import QuestionIcon from '@/assets/images/icons/question.svg'
  import PinIcon from '@/assets/images/icons/favorites/pin.svg'
  import PinFillIcon from '@/assets/images/icons/favorites/pin-fill.svg'

  defineEmits(['updateFavorites'])
  const props = defineProps({
    item: {
      type: Object as PropType<IFullServicePriceData | IFullCountryPriceData>,
      required: true
    },
    showScrollbar: {
      type: Boolean,
      default: false
    },
    selectedItemClass: {
      type: String
    },
    favorites: {
      type: Array as PropType<string[]>,
      required: true
    }
  })

  const { t } = useI18n()
  const { isWlHelperUrl, wlHelperContactUsUrl } = useWlHelper()
  const { isFavorite } = useFavorites()
  const modalStore = useModalStore()

  const itemId = computed(() => {
    if ('service_id' in props.item) return props.item.service_id
    else return props.item.country_id
  })
  const imageType = computed(() => {
    if ('service_id' in props.item) return 'services'
    else return 'countries'
  })
  const isAnyOtherService = computed(() => 'service_id' in props.item && props.item.service_id === 'other')
  const isServiceProhibited = computed(() => {
    return 'prohibited' in props.item && props.item.prohibited
  })

  const showNotificationModal = () => {
    if (isServiceProhibited.value) showProhibitedModal()
    else showOutOfStockModal()
  }

  const showOutOfStockModal = () => {
    const contactUsLink = config.wlWidgetMode || isWlHelperUrl() ? wlHelperContactUsUrl.value : { name: 'ContactUs' }
    modalStore.setNotification(true, {
      title: t('notifications_try_another_number'),
      text: parseTranslation(
        t(
          'notifications_temporary_we_have_no_numbers_available_for_this_service_country_try_again_later_or_contact_support'
        ),
        [contactUsLink]
      ),
      buttonText: t('web_ok_button')
    })
  }

  const showProhibitedModal = () => {
    modalStore.setNotification(true, {
      title: t('notifications_service_not_allowed_popup_title'),
      text: addBreakLinesToText(
        t(
          'notifications_we_do_not_provide_numbers_for_sensitive_platforms_finance_government_etc_please_choose_another_service'
        )
      ),
      buttonText: t('notifications_ok')
    })
  }
</script>

<template>
  <div
    :data-testid="`order-item-${imageType}-${itemId}`"
    :data-item-name="isAnyOtherService ? 'any_other' : item.name"
    :class="[
      'tn:hover:bg-tn-black-50 tn:flex tn:h-12 tn:w-full tn:cursor-pointer tn:items-center tn:justify-between tn:gap-2 tn:overflow-hidden',
      showScrollbar ? 'tn:lg:ltr:pr-4 tn:lg:ltr:pl-6 tn:lg:rtl:pr-6 tn:lg:rtl:pl-4' : 'tn:lg:px-6',
      item?.count === 0 || isServiceProhibited ? 'tn:!cursor-not-allowed' : '',
      selectedItemClass
    ]"
  >
    <div class="tn:flex tn:min-w-0 tn:items-center tn:gap-2">
      <ImageWithFallback :key="itemId" :image-type="imageType" :image-id="itemId" />
      <div class="tn:flex tn:flex-col tn:gap-0.5 tn:overflow-hidden">
        <div
          class="tn:truncate tn:lg:text-base tn:lg:leading-5 tn:basis-[max-content] tn:grow-0 tn:[flex-shrink:1] overflow-hidden text-sm leading-4.5"
        >
          {{ isAnyOtherService ? $t('web_any_other_item') : item.name }}
        </div>
        <div
          :class="[
            'tn:text-xxs tn:truncate tn:overflow-hidden tn:leading-3 tn:opacity-40',
            !isAnyOtherService && 'tn:lg:hidden'
          ]"
        >
          <span v-if="'codes' in item">
            {{ $t('web_get_number_with_prefix').replace('__0__', '') }}
            <span dir="ltr">{{ `+${item.codes?.join(', +')}` }}</span>
          </span>
          <span v-else>
            <span v-if="isAnyOtherService">{{ $t('web_time_subtitle_use_this_only_if_service_not_listed') }}</span>
            <span v-else>
              {{
                isServiceProhibited
                  ? $t('web_service_not_allowed')
                  : $t('web_buy_sms_to_activate_service_name').replace('__0__', item.name)
              }}
            </span>
          </span>
        </div>
      </div>
      <div
        v-if="'codes' in item"
        class="tn:mt-0.75 tn:hidden tn:truncate tn:text-xs tn:opacity-40 tn:lg:block tn:flex-1 tn:[flex-shrink:100]"
        dir="ltr"
      >
        +{{ item.codes?.join(', +') }}
      </div>
    </div>
    <div v-if="isServiceProhibited || ('count' in item && item.count === 0)" class="tn:flex tn:items-center tn:gap-2">
      <span class="tn:text-xxs tn:bg-tn-black-90 tn:flex tn:rounded-lg tn:px-1.75 tn:py-0.5 tn:opacity-50 tn:min-w-18">
        {{ isServiceProhibited ? $t('web_unavailable_tooltip') : $t('web_out_of_stock_item_tooltip') }}
      </span>
      <QuestionIcon
        @click="showNotificationModal"
        class="tn:text-tn-black-900 tn:h-6 tn:w-6 tn:min-w-6 tn:!cursor-pointer"
      />
    </div>
    <div
      v-else
      class="tn:flex tn:items-center"
      :class="'price' in item ? 'tn:min-w-32 tn:justify-between tn:gap-2' : 'tn:gap-4'"
    >
      <div class="tn:group tn:relative tn:inline-flex tn:items-center">
        <button
          @click.prevent.stop="$emit('updateFavorites', item)"
          aria-describedby="pin-tooltip"
          tabindex="0"
          class="tn:p-2 tn:focus:ring-0 tn:focus:outline-none"
        >
          <PinFillIcon v-if="isFavorite(favorites, item)" class="tn:text-tn-black-250 tn:h-4 tn:w-4" />
          <PinIcon v-else class="tn:text-tn-black-200 tn:h-4 tn:w-4" />
        </button>
        <div
          id="pin-tooltip"
          role="tooltip"
          class="tn:pointer-events-none tn:absolute tn:top-1/2 tn:z-[500000] tn:-translate-y-1/2 tn:rounded-md tn:px-2 tn:py-1 tn:text-xs tn:whitespace-nowrap tn:text-white tn:opacity-0 tn:shadow-md tn:transition-opacity tn:duration-150 tn:group-hover:opacity-100 tn:ltr:-left-2 tn:ltr:-translate-x-full tn:rtl:-right-2 tn:rtl:translate-x-full"
          :class="isFavorite(favorites, item) ? 'tn:bg-tn-black-400' : 'tn:bg-tn-green-500'"
        >
          {{ isFavorite(favorites, item) ? $t('web_unpin_button') : $t('web_pin_button') }}
        </div>
      </div>

      <div class="tn:flex tn:items-center tn:gap-2">
        <div
          v-if="'price' in item && item.price?.suggested"
          class="tn:bg-primary-900 tn:rounded-lg tn:px-1.5 tn:py-0.5 tn:text-center tn:text-sm tn:font-semibold tn:text-white"
        >
          ${{ item.price.suggested / 100 }}
        </div>
        <ChevronRightIcon
          :class="[
            'tn:h-6 tn:w-6 tn:rtl:rotate-180',
            config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#5F6368]'
          ]"
        />
      </div>
    </div>
  </div>
</template>
