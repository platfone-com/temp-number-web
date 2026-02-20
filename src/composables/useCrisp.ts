import { onMounted, onBeforeUnmount } from 'vue'
import { getAuth } from 'firebase/auth'

export function useCrisp() {
  let scriptElement: HTMLScriptElement | null = null

  const API_MESSAGE_SENT_KEY = 'crisp_api_message_sent'
  const CRISP_SESSION_KEY = 'crisp_session_id'

  const isApiMessageSent = () => localStorage.getItem(API_MESSAGE_SENT_KEY) === 'true'
  const markApiMessageSent = () => localStorage.setItem(API_MESSAGE_SENT_KEY, 'true')
  const resetApiMessageSent = () => localStorage.removeItem(API_MESSAGE_SENT_KEY)

  const checkSessionChange = () => {
    const crispCookie = document.cookie.split('; ').find((c) => c.startsWith('crisp-client%2Fsession%2F'))
    const currentSessionId = crispCookie?.split('=')[1] || ''
    const storedSessionId = localStorage.getItem(CRISP_SESSION_KEY) || ''

    if (currentSessionId && currentSessionId !== storedSessionId) {
      localStorage.setItem(CRISP_SESSION_KEY, currentSessionId)
      resetApiMessageSent()
    }
  }

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
        window.$crisp.push([
          'on',
          'chat:opened',
          () => {
            checkSessionChange()
            const apiRequestMessage = 'I want to request an API access'
            if (!isApiMessageSent()) {
              window.$crisp!.push(['do', 'message:send', ['text', apiRequestMessage]])
              markApiMessageSent()
            }
          }
        ])
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
