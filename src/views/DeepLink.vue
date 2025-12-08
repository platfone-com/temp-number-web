<script lang="ts" setup>
  import { onBeforeMount } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { getAuth, applyActionCode } from 'firebase/auth'
  import { useToastStore } from '@/stores/toast'
  import { useModalStore } from '@/stores/modal'
  import { useAuthStore } from '@/stores/auth'
  import { useHelper } from '@/composables/useHelper'
  import { useAuth } from '@/composables/useAuth'
  import type { FirebaseError } from '@/types/error'

  import FullPageSpinner from '@/components/Shared/Spinners/FullPageSpinner.vue'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToastStore()
  const modalStore = useModalStore()
  const authStore = useAuthStore()
  const { showSomethingWrongModal } = useHelper()
  const { logout } = useAuth()

  const redirectToHomePage = async () => {
    await router.push({ name: 'Home' })
  }

  const redirectToLastVisitedPath = async (lastVisitedPath?: string) => {
    if (lastVisitedPath) {
      await router.push(lastVisitedPath)
    } else {
      await redirectToHomePage()
    }
  }

  const showErrorAlert = (alert: string) => {
    toast.add({
      id: 'email_error',
      text: alert,
      timeout: 5000
    })
  }

  const confirmEmail = async () => {
    const lastVisitedPath = localStorage.getItem('lastVisitedPath')
    localStorage.removeItem('lastVisitedPath')
    try {
      const auth = getAuth()
      await applyActionCode(auth, route.query.oobCode?.toString() || '')
      const continueUrl = route.query.continueUrl
      if (continueUrl) {
        location.href = continueUrl.toString()
      } else {
        toast.add({
          id: 'email_verified_notification',
          text: t('notifications_email_address_verified'),
          type: 'success'
        })
        if (!auth.currentUser) {
          await redirectToHomePage()
          return
        }

        toast.remove('confirm_email')
        modalStore.forceEmailConfirmationModal = false

        if (route.query.mode === 'verifyAndChangeEmail') {
          await logout('SignIn', false)
          return
        }
        await auth.currentUser.reload()
        await auth.currentUser.getIdToken(true) // force refresh token
        authStore.isEmailVerified = true

        // Force activation after email confirmation
        const forceActivationDataRaw = localStorage.getItem('order')
        if (forceActivationDataRaw) {
          // const forceActivationData = JSON.parse(forceActivationDataRaw)
          //   if (forceActivationData.timestamp && forceActivationData.timestamp + 15 * 60 * 1000 > Date.now()) {
          //     this.$store.commit('order/setOrderData', forceActivationData)
          //     await this.forceActivationRedirect()
          //   } else {
          //     this.redirectToLastVisitedPath(lastVisitedPath)
          //   }
        } else {
          await redirectToLastVisitedPath(lastVisitedPath || '')
        }
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        let alert = ''
        switch (error.code) {
          case 'auth/expired-action-code':
            alert = t('notifications_the_email_confirmation_code_has_been_expired')
            break
          case 'auth/invalid-action-code':
          case 'auth/user-not-found':
            alert = t('notifications_the_email_confirmation_code_is_invalid')
            break
        }

        if (alert) showErrorAlert(alert)
        else showSomethingWrongModal()
      } else {
        showSomethingWrongModal()
      }

      await redirectToHomePage()
    }
  }

  const recoverEmail = async () => {
    try {
      const auth = getAuth()
      await applyActionCode(auth, route.query.oobCode?.toString() || '')
      toast.add({
        id: 'email_successfully_recovered',
        text: t('notifications_email_successfully_recovered'),
        type: 'success',
        timeout: 5000
      })
      await logout('SignIn')
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        let alert = ''
        switch (error.code) {
          case 'auth/expired-action-code':
          case 'auth/invalid-action-code':
          case 'auth/user-not-found':
            alert = t('notifications_the_email_recovery_code_is_invalid')
            break
        }

        if (alert) showErrorAlert(alert)
        else showSomethingWrongModal()
      } else {
        showSomethingWrongModal()
      }

      await redirectToHomePage()
    }
  }

  onBeforeMount(async () => {
    if (route.query.mode && route.query.oobCode) {
      if (route.query.mode === 'verifyEmail' || route.query.mode === 'verifyAndChangeEmail') {
        await confirmEmail()
      } else if (route.query.mode === 'recoverEmail') {
        await recoverEmail()
      } else if (route.query.mode === 'resetPassword') {
        if (route.query?.continueUrl?.includes('/wl/auth/new-password')) {
          // Redirect to TN White Label NewPassword page
          location.href = route.query.continueUrl + `&mode=${route.query.mode}&oobCode=${route.query.oobCode}`
        } else if (route.query?.continueUrl?.includes('/auth/new-password')) {
          // Redirect to TN Pro NewPassword page with query params
          location.href = route.query.continueUrl + `?mode=${route.query.mode}&oobCode=${route.query.oobCode}`
        } else {
          await router.push({
            name: 'NewPassword',
            query: {
              mode: route.query.mode,
              oobCode: route.query.oobCode,
              continueUrl: route.query.continueUrl
            }
          })
        }
      } else {
        await redirectToHomePage()
      }
    } else {
      await redirectToHomePage()
    }
  })
</script>

<template>
  <div class="tn:flex tn:h-screen tn:items-center tn:justify-center">
    <div class="tn:flex tn:w-67.5 tn:flex-col tn:items-center tn:justify-center">
      <FullPageSpinner />
    </div>
  </div>
</template>
