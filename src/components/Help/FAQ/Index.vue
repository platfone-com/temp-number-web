<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { addBreakLinesToText } from '@/utils/translate'
  import FaqArrowIcon from '@/assets/images/icons/faq-arrow.svg'

  const { t } = useI18n()

  const items = computed(() => [
    {
      title: addBreakLinesToText(t('web_faq_q1')),
      content: addBreakLinesToText(t('web_faq_q1_answer'))
    },
    {
      title: addBreakLinesToText(t('web_faq_q2')),
      content: addBreakLinesToText(t('web_faq_q2_answer'))
    },
    {
      title: addBreakLinesToText(t('web_faq_q3')),
      content: addBreakLinesToText(t('web_faq_q3_answer'))
    },
    {
      title: addBreakLinesToText(t('web_faq_q4')),
      content: addBreakLinesToText(t('web_faq_q4_answer'))
    },
    {
      title: addBreakLinesToText(t('web_faq_q5')),
      content: addBreakLinesToText(t('web_faq_q5_answer'))
    },
    {
      title: addBreakLinesToText(t('web_faq_q6')),
      content: addBreakLinesToText(t('web_faq_q6_answer'))
    },
    {
      title: addBreakLinesToText(t('web_faq_q7')),
      content: addBreakLinesToText(t('web_faq_q7_answer'))
    },
    {
      title: addBreakLinesToText(t('web_faq_q8')),
      content: addBreakLinesToText(t('web_faq_q8_answer'))
    }
  ])

  const openIndex = ref<number | null>(null)
  const panels = ref<HTMLElement | null>(null)

  const toggle = (index: number) => {
    openIndex.value = openIndex.value === index ? null : index
  }

  function onEnter(el: Element) {
    const element = el as HTMLElement
    element.style.height = '0px'
    nextTick(() => {
      element.style.transition = 'height 300ms ease'
      element.style.height = `${element.scrollHeight}px`
    })
  }

  function onAfterEnter(el: Element) {
    const element = el as HTMLElement
    element.style.height = 'auto'
  }

  function onLeave(el: Element) {
    const element = el as HTMLElement
    element.style.height = `${element.scrollHeight}px`
    void element.offsetHeight
    element.style.transition = 'height 300ms ease'
    element.style.height = '0px'
  }
</script>

<template>
  <div class="tn:mx-auto tn:w-full">
    <div v-for="(item, index) in items" :key="index" class="tn:px-2.5 tn:pb-4">
      <button
        class="tn:bg-tn-black-50 tn:flex tn:w-full tn:items-center tn:justify-between tn:gap-2 tn:rounded-xl tn:py-4.75 tn:text-start tn:focus:outline-none tn:ltr:pr-5 tn:ltr:pl-6 tn:rtl:pr-6 tn:rtl:pl-5"
        @click="toggle(index)"
      >
        <span class="tn:text-sm tn:leading-4.5 tn:font-medium tn:opacity-50 tn:lg:text-base tn:lg:leading-5">{{
          item.title
        }}</span>
        <FaqArrowIcon
          :class="[
            'tn:h-6 tn:w-6 tn:min-w-6 tn:transition-transform tn:duration-300',
            openIndex === index ? 'tn:rotate-90' : 'tn:rtl:rotate-180'
          ]"
        />
      </button>

      <Transition name="accordion" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
        <div
          v-show="openIndex === index"
          ref="panels"
          class="tn:text-tn-black-500 tn:overflow-hidden tn:text-sm tn:leading-[160%]"
        >
          <div v-html="item.content" class="tn:px-5 tn:pt-4" />
        </div>
      </Transition>
    </div>
  </div>
</template>
