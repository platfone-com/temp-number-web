<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import fallbackImage from '@/assets/images/no_icon.png'

  interface IImageWithFallbackProps {
    imageType: 'services' | 'countries'
    imageId: string
    size?: string
    rounded?: string
  }

  const props = defineProps<IImageWithFallbackProps>()

  const imgSrc = ref<string>(fallbackImage)

  const loadImage = () => {
    const src = `${import.meta.env.VITE_CDN_BASE_URL}/retail/png/${props.imageType}/${props.imageId}.png`

    const mainImage = new Image()
    mainImage.src = src
    mainImage.onload = () => {
      imgSrc.value = src
    }
    mainImage.onerror = () => {
      imgSrc.value = fallbackImage
    }
  }

  onMounted(() => {
    loadImage()
  })
</script>

<template>
  <img :src="imgSrc" :class="[`${size || 'tn:h-7.5 tn:w-7.5'}`, `${rounded || 'tn:rounded-[10px]'}`]" :alt="imageId" />
</template>
