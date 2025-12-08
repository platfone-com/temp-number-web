<script lang="ts" setup>
  import { watch, onUnmounted, type PropType, inject } from 'vue'
  import { lockScroll, unlockScroll } from '@/utils/modalScroll'
  import CloseModalIcon from '@/assets/images/icons/modal/close.svg'

  const props = defineProps({
    modelValue: Boolean,
    size: {
      type: String as PropType<'adaptive' | 'adaptive-sm'>,
      default: 'adaptive'
    },
    closeBtn: {
      type: Boolean,
      default: false
    },
    persistent: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 500000
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const modalTarget = inject<Element | string>('tnModalTarget', '#tn-modal')

  const close = () => {
    emit('update:modelValue', false)
  }

  const closeByBackdrop = () => {
    if (!props.persistent) close()
  }

  watch(
    () => props.modelValue,
    (isOpen) => {
      if (isOpen) {
        lockScroll()
      } else {
        unlockScroll()
      }
    }
  )

  onUnmounted(() => {
    if (props.modelValue) {
      unlockScroll()
    }
  })
</script>

<template>
  <Teleport :to="modalTarget">
    <Transition name="backdrop">
      <div
        v-if="modelValue"
        :style="{ zIndex: zIndex }"
        class="tn:fixed tn:inset-0 tn:bg-black/50 tn:backdrop-blur-md"
      />
    </Transition>

    <Transition name="modal">
      <div
        v-if="modelValue"
        @click="closeByBackdrop"
        :style="{ zIndex: zIndex + 1 }"
        class="tn:fixed tn:inset-0 tn:overflow-y-auto"
      >
        <div class="tn:flex tn:min-h-full tn:items-center tn:justify-center tn:text-center">
          <div
            @click.stop
            :class="[
              'tn:my-8 tn:flex tn:items-center tn:justify-center',
              'tn:bg-tn-bg tn:rounded-2xl tn:shadow-lg tn:transition-all',
              size === 'adaptive' ? 'tn:w-82 tn:sm:w-112' : '',
              size === 'adaptive-sm' ? 'tn:w-82 tn:sm:w-88' : ''
            ]"
          >
            <div class="tn:relative tn:w-full">
              <button
                v-if="closeBtn"
                class="tn:absolute tn:top-3 tn:flex tn:h-6 tn:w-6 tn:cursor-pointer tn:items-center tn:justify-center tn:text-2xl tn:ltr:right-3 tn:rtl:left-3"
                @click="close"
              >
                <CloseModalIcon class="tn:text-tn-black-900 tn:h-7.5 tn:w-7.5" />
              </button>

              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  @import '@/assets/css/transitions/backdrop.css';
  @import '@/assets/css/transitions/modal.css';
</style>
