<script lang="ts" setup>
  import { type PropType, ref } from 'vue'
  import EyeIcon from '@/assets/images/icons/form/eye.svg'
  import EyeSlashIcon from '@/assets/images/icons/form/eye-slash.svg'
  import EmailIcon from '@/assets/images/icons/form/email.svg'
  import PasswordIcon from '@/assets/images/icons/form/password.svg'
  import InputClearIcon from '@/assets/images/icons/form/input-clear.svg'

  const emit = defineEmits(['update:modelValue'])

  const props = defineProps({
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String as PropType<'text' | 'password' | 'email' | 'number'>,
      default: 'text'
    },
    errorMessage: {
      type: String,
      default: ''
    }
  })

  const inputRef = ref<HTMLInputElement | null>(null)
  const visible = ref(props.type !== 'password')
  const inputType = ref(props.type)

  const togglePasswordVisibility = () => {
    visible.value = !visible.value
    inputType.value = visible.value ? 'text' : 'password'
  }

  const clearInput = () => {
    emit('update:modelValue', '')
    inputRef.value?.focus()
  }
</script>

<template>
  <div>
    <div class="tn:relative">
      <input
        :class="[
          'tn:text-tn-black-300 tn:placeholder:text-tn-black-300 tn:w-full tn:rounded-2xl tn:border tn:px-10 tn:py-5 tn:text-sm/4.5 tn:outline-none',
          'tn:focus:border-primary-900 tn:hover:border-primary-900/50 tn:border-tn-black-100',
          'tn:transition-colors tn:duration-300'
        ]"
        :placeholder="placeholder"
        :type="inputType"
        :value="modelValue"
        @input="(e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
        :aria-label="type"
        ref="inputRef"
      />
      <div
        v-if="['email', 'password'].includes(type)"
        class="tn:absolute tn:top-6 tn:cursor-pointer tn:px-0.5 tn:ltr:left-4 tn:rtl:right-4"
      >
        <EmailIcon v-if="type === 'email'" class="tn:text-tn-black-900 tn:h-3 tn:w-3.25" />
        <PasswordIcon v-if="type === 'password'" class="tn:text-tn-black-900 tn:h-3 tn:w-3.75" />
      </div>

      <div
        v-if="type === 'password'"
        @click="togglePasswordVisibility()"
        class="tn:absolute tn:top-4.5 tn:cursor-pointer tn:p-1 tn:ltr:right-4 tn:rtl:left-4"
      >
        <EyeIcon v-if="!visible" class="tn:h-4 tn:w-4" />
        <EyeSlashIcon v-else class="tn:h-4 tn:w-4" />
      </div>

      <div
        v-if="['email', 'text'].includes(type) && modelValue"
        @click="clearInput()"
        class="tn:bg-tn-bg tn:absolute tn:top-4 tn:cursor-pointer tn:rounded-full tn:p-1 tn:ltr:right-3.25 tn:rtl:left-3.25"
      >
        <InputClearIcon class="tn:h-5 tn:w-5" />
      </div>
    </div>

    <div v-if="errorMessage" data-testid="input-error" class="tn:px-3 tn:pt-4 tn:text-xs tn:text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>
