import { useAppStore } from '@/stores/app'

export default (element: HTMLElement | undefined, deleteTimeout = 3200) => {
  let range
  const appStore = useAppStore()
  if (window.getSelection) {
    range = document.createRange()
    if (!(element instanceof HTMLElement)) return
    range.selectNode(element)
    const selection = window.getSelection()
    if (!selection) return
    selection.removeAllRanges()
    selection.addRange(range)
    const timeoutId = setTimeout(() => {
      selection.removeAllRanges()
      range = null
      appStore.setCopiedRangeTimeoutId()
    }, deleteTimeout)
    appStore.setCopiedRangeTimeoutId(Number(timeoutId))
  }
}
