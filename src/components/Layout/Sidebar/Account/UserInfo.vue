<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { getAuth } from 'firebase/auth'
  import { useI18n } from 'vue-i18n'
  import { useClipboard } from '@/composables/useClipboard'
  import config from '@/config'
  import CopyIcon from '@/assets/images/icons/copy.svg'

  const { t } = useI18n()
  const { copyToClipboard } = useClipboard()

  const itemRefs = ref<Record<string, HTMLSpanElement | undefined>>({})

  const customerId = ref('')
  const customerEmail = ref('')

  const userData = computed<{ [key: string]: string }[]>(() => {
    const result: { field: string; data: string; text: string }[] = []
    const uidText = t('web_b_user_id_b').replace(/<\/?b>/g, '')
    const emailText = t('web_b_email_b').replace(/<\/?b>/g, '')

    const uid = config.wlWidgetMode ? customerId.value || '' : getAuth().currentUser?.uid || ''
    const email = config.wlWidgetMode ? customerEmail.value || '' : getAuth().currentUser?.email || ''

    if (uid) result.push({ field: 'uid', data: uid, text: uidText })
    if (email) result.push({ field: 'email', data: email, text: emailText })

    return result
  })

  const setItemRef = (el: HTMLSpanElement | undefined, field: string) => {
    if (el) itemRefs.value[field] = el
  }
</script>

<template>
  <ul v-if="userData.length > 0" class="tn:flex tn:flex-col tn:gap-4">
    <li v-for="item of userData" :key="item.field" :title="item.data" class="tn:flex tn:items-center tn:gap-1.5">
      <div class="tn:overflow-hidden tn:overflow-ellipsis tn:whitespace-nowrap">
        <span class="tn:font-medium">{{ item.text.replace('__0__', '') }}</span>
        <span :ref="(el) => setItemRef(el as HTMLSpanElement | undefined, item.field)" class="tn:mx-1">
          {{ item.data }}
        </span>
      </div>
      <CopyIcon
        @click="copyToClipboard(item.data, itemRefs[item.field], 1500)"
        class="tn:text-primary-900 tn:mt-0.5 tn:h-4 tn:w-4 tn:flex-shrink-0 tn:cursor-pointer tn:fill-current"
      />
    </li>
  </ul>
</template>
