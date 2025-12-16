<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import type { RouteLocationRaw } from 'vue-router'
  import ButtonSpinner from '@/components/Shared/Spinners/ButtonSpinner.vue'

  const props = defineProps({
    text: String,
    buttonType: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },
    loading: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    target: {
      type: String as PropType<'_blank' | '_self' | '_parent' | '_top'>,
      default: '_self'
    },
    fill: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    gap: {
      type: String,
      required: false,
      default: 'tn:gap-3'
    },
    color: {
      type: String as PropType<'primary' | 'secondary'>,
      required: false,
      default: 'primary'
    }
  })

  const classes = computed(() => {
    const baseClasses = [
      'tn:flex tn:items-center tn:justify-center tn:border tn:border-primary-900 tn:text-center tn:rounded-xl tn:px-6 tn:py-4 tn:transition-colors tn:duration-300 tn:font-medium',
      props.gap
    ]
    baseClasses.push(
      props.fill
        ? props.color === 'primary'
          ? 'tn:bg-primary-900 tn:text-white'
          : 'tn:bg-tn-black-60 tn:text-sm tn:border-tn-black-60'
        : 'tn:text-primary-900'
    )
    if (props.block) baseClasses.push('tn:w-full')
    if (props.disabled || props.loading) {
      baseClasses.push('tn:opacity-50 tn:cursor-not-allowed')
    } else {
      baseClasses.push('tn:cursor-pointer')
      baseClasses.push(
        props.fill
          ? props.color === 'primary'
            ? 'tn:hover:bg-primary-950 tn:hover:border-primary-950 tn:active:bg-primary-960 tn:active:border-primary-960'
            : 'tn:hover:bg-tn-black-95 tn:hover:border-tn-black-95 tn:active:bg-tn-black-200 tn:active:border-tn-black-200'
          : 'tn:hover:bg-primary-900/10 tn:active:bg-primary-900/20'
      )
    }
    return baseClasses
  })
</script>

<template>
  <router-link v-if="to" :to="typeof to === 'string' ? { name: to } : to" :class="classes">
    <slot />
  </router-link>
  <a v-else-if="href" :href="href" :class="classes" :target="target" rel="noopener noreferrer">
    <slot />
  </a>
  <button v-else :type="buttonType" :class="classes" :disabled="disabled || loading">
    <ButtonSpinner
      v-if="loading"
      :color="fill ? 'tn:border-primary-white' : 'tn:border-primary-900'"
      class="tn:my-0.25"
    />
    <slot v-else />
  </button>
</template>
