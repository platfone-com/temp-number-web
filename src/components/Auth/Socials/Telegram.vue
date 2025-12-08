<script lang="ts" setup>
  import TelegramIcon from '@/assets/images/socials/telegram.svg'
  import Button from '@/components/Auth/Socials/Button.vue'
</script>

<template>
  <Button>
    <TelegramIcon class="tn:h-6 tn:w-6" />
    {{ $t('web_continue_with_telegram') }}
  </Button>
</template>
