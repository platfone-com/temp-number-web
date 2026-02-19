import { onMounted, onBeforeUnmount } from 'vue'
import { getAuth } from 'firebase/auth'

export function useCrisp() {
  let scriptElement: HTMLScriptElement | null = null

  const setUserData = () => {
    if (!window.$crisp) return

    const user = getAuth()?.currentUser

    if (user) {
      if (user.email) {
        window.$crisp.push(['set', 'user:email', [user.email]])
      }
      window.$crisp.push(['set', 'session:data', [[['userId', user.uid]]]])
    }
  }

  const loadCrispScript = () => {
    const crispWebsiteId = import.meta.env?.VITE_CRISP_WEBSITE_ID || ''
    if (!crispWebsiteId) return

    if (window.$crisp) {
      setUserData()
      return
    }

    const currentLocale = localStorage.getItem('locale') || 'en'

    window.$crisp = []
    window.CRISP_WEBSITE_ID = crispWebsiteId
    window.CRISP_RUNTIME_CONFIG = {
      locale: currentLocale
    }

    window.$crisp.push(['config', 'hide:on:away', true])
    window.$crisp.push(['config', 'hide:on:mobile', false])

    window.$crisp.push(['set', 'session:segments', [['api-request']]])

    setUserData()

    scriptElement = document.createElement('script')
    scriptElement.src = 'https://client.crisp.chat/l.js'
    scriptElement.async = true
    document.head.appendChild(scriptElement)

    scriptElement.onload = () => {
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:hide'])
      }
    }
  }

  const openChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:show'])
      window.$crisp.push(['do', 'chat:open'])
    }
  }

  const hideChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:close'])
      window.$crisp.push(['do', 'chat:hide'])
    }
  }

  onMounted(() => {
    loadCrispScript()
  })

  onBeforeUnmount(() => {
    hideChat()
  })

  return {
    openChat,
    hideChat
  }
}
