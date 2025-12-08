import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import appRoutes from './routes'
import { useToastStore } from '@/stores/toast'
import i18n from '@/services/i18n'

const routesList = [...appRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routesList
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((routeItem) => routeItem.meta.requiresAuth)
  const noAuthRequired = to.matched.some((routeItem) => routeItem.meta.noAuthRequired)
  const auth = getAuth()
  const currentUser = auth.currentUser
  const toast = useToastStore()

  if (requiresAuth && !currentUser) {
    toast.add({
      id: 'auth_needed_error_login_signup',
      text: i18n.global.t('notifications_please_sign_up_or_login'),
      type: 'warning'
    })
    next({ name: 'CreateAccount' })
  } else if (noAuthRequired && currentUser) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
