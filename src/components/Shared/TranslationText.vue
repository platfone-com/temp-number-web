<script lang="ts" setup>
  import type { PropType } from 'vue'
  import { type Segment } from '@/utils/translate'

  defineProps({
    segments: {
      type: Array as PropType<Segment[]>,
      required: true
    },
    linkColor: {
      type: String,
      default: 'tn:text-primary-900'
    },
    linkFontWeight: {
      type: String,
      default: 'tn:font-medium'
    }
  })
</script>

<template>
  <div>
    <template v-for="(segment, index) in segments" :key="index">
      <template v-if="segment.type === 'text'">
        <!-- Segment content is derived from trusted i18n strings (parseTranslation); only <br /> markup is added. -->
        <!-- nosemgrep: javascript.vue.security.audit.xss.templates.avoid-v-html.avoid-v-html -->
        <span v-html="segment.content"></span>
      </template>
      <template v-else-if="segment.type === 'link' && segment.to">
        <a v-if="typeof segment.to === 'string'" :href="segment.to" :class="[linkColor, linkFontWeight]">
          {{ segment.content }}
        </a>
        <router-link v-else :to="segment.to" :class="[linkColor, linkFontWeight]">
          {{ segment.content }}
        </router-link>
      </template>
    </template>
  </div>
</template>
