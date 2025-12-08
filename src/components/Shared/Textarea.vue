<script lang="ts" setup>
  import { ref, nextTick, watch } from 'vue'

  const text = defineModel({ type: String, default: '' })

  const props = defineProps({
    placeholder: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 3
    },
    errorMessage: {
      type: String,
      default: ''
    },
    centerError: {
      type: Boolean,
      default: false
    }
  })

  const textareaRef = ref()

  const autoResize = () => {
    if (textareaRef.value) {
      textareaRef.value.rows = props.rows
      const styles = window.getComputedStyle(textareaRef.value)
      const paddingTop = parseInt(styles.paddingTop)
      const paddingBottom = parseInt(styles.paddingBottom)
      const padding = paddingTop + paddingBottom
      const lineHeight = parseInt(styles.lineHeight)
      const { scrollHeight } = textareaRef.value
      const newRows = (scrollHeight - padding) / lineHeight
      textareaRef.value.rows = Math.ceil(newRows)
    }
  }

  watch(
    () => text.value,
    () => nextTick(autoResize)
  )
</script>

<template>
  <textarea
    v-model="text"
    ref="textareaRef"
    :rows="rows"
    :class="[
      'tn:bg-tn-black-50 tn:h-auto tn:w-full tn:rounded-2xl tn:border tn:px-5 tn:py-4',
      'tn:resize-none tn:ring-0 tn:focus:outline-none',
      'tn:text-tn-black-500 tn:placeholder-tn-black-500 tn:text-sm',
      'tn:border-tn-black-50 tn:focus:border-primary-900 tn:hover:border-primary-900/50',
      'tn:transition-colors tn:duration-300',
      errorMessage && 'tn:bg-tn-red-500/5 tn:border-tn-red-500'
    ]"
    :placeholder="placeholder"
  />
  <div
    v-if="errorMessage"
    :class="['tn:mb-1 tn:w-full tn:px-3 tn:text-xs tn:text-red-500', centerError && 'tn:text-center']"
  >
    {{ errorMessage }}
  </div>
</template>
