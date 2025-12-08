import '@/assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { onAuthStateChanged, type User } from 'firebase/auth'

import App from '@/App.vue'
import router from '@/router'
import fbAuth from '@/services/firebase'
import i18n from '@/services/i18n/index'
import { useAuthStore } from '@/stores/auth'
import linkify from '@/directives/linkify'
import { loadLocaleStrings } from '@/services/i18n/loadLocalStrings'

let app: ReturnType<typeof createApp>

onAuthStateChanged(fbAuth, async (user: User | null) => {
  if (!app) {
    await loadLocaleStrings()

    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(i18n)
    app.directive('linkify', linkify)

    app.mount('#app')
  }

  const authStore = useAuthStore()
  authStore.setUserData(user)
})
