<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useUser } from '@/composables/api/useUser'
  import { useToastStore } from '@/stores/toast'
  import BackButton from '@/components/Shared/BackButton.vue'
  import Item from '@/components/Layout/Sidebar/Notifications/Item.vue'

  defineEmits(['hideNotificationsMode', 'closeSidebar'])

  const { t } = useI18n()
  const toast = useToastStore()
  const { getNotificationSettings, setNotificationSettings } = useUser()

  const loading = ref(true)
  const email = ref(false)
  const push = ref(false)
  const skipFirstUpdate = ref(true)

  const loadNotificationsSettings = async () => {
    loading.value = true
    const result = await getNotificationSettings()
    email.value = result?.email_enabled || false
    push.value = result?.push_enabled || false
    if (!email.value && !push.value) skipFirstUpdate.value = false
    loading.value = false
  }

  const saveNotifications = async (type: string) => {
    if (skipFirstUpdate.value) {
      skipFirstUpdate.value = false
      return
    }
    const result = await setNotificationSettings(email.value, push.value)
    if (result) {
      toast.add({
        id: `notification_setting_${type}`,
        text: type === 'enabled' ? t('notifications_notification_enabled') : t('notifications_notification_disabled'),
        type: 'success',
        timeout: 1500
      })
    }
  }

  watch(
    () => [email.value, push.value],
    ([newEmail, newPush], [oldEmail, oldPush]) => {
      let toastType = 'enabled'
      if ((oldEmail && !newEmail) || (oldPush && !newPush)) toastType = 'disabled'
      saveNotifications(toastType)
    }
  )

  onMounted(() => {
    loadNotificationsSettings()
  })
</script>

<template>
  <div>
    <BackButton @click="$emit('hideNotificationsMode')" />

    <nav class="tn:flex tn:flex-col tn:gap-6">
      <div class="tn:tracking-tightest tn:text-2xl tn:leading-8 tn:font-semibold">
        {{ $t('web_menu_item_notifications') }}
      </div>

      <Item
        v-model="email"
        :loading="loading"
        :header="$t('web_alerts_email')"
        :subheader="$t('web_alerts_receive_updates_via_email')"
      />
      <Item
        v-model="push"
        :loading="loading"
        :header="$t('web_alerts_mobile_push')"
        :subheader="$t('web_alerts_get_real_time_alerts_on_your_device')"
      />
    </nav>
  </div>
</template>
