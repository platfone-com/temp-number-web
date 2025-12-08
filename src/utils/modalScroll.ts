let modalOpenCount = 0
let scrollPosition = 0

export function lockScroll() {
  modalOpenCount++
  if (modalOpenCount === 1) {
    scrollPosition = window.scrollY
    const styles = { position: 'fixed', top: `-${scrollPosition}px`, left: '0', right: '0', width: '100%' }
    Object.assign(document.body.style, styles)
  }
}

export function unlockScroll() {
  modalOpenCount = Math.max(0, modalOpenCount - 1)
  if (modalOpenCount === 0) {
    const styles = { position: '', top: '', left: '', right: '', width: '' }
    Object.assign(document.body.style, styles)
    window.scrollTo(0, scrollPosition)
  }
}
