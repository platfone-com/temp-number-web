export function useSlideDownTransition() {
  const beforeEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = '0px'
    element.style.opacity = '0'
  }

  const enter = (el: Element) => {
    const element = el as HTMLElement
    element.style.transition = 'height 0.3s ease-in-out, opacity 0.3s ease-in-out'
    element.style.height = element.scrollHeight + 'px'
    element.style.opacity = '1'
  }

  const leave = (el: Element) => {
    const element = el as HTMLElement
    element.style.transition = 'height 0.3s ease-in-out, opacity 0.3s ease-in-out'
    element.style.height = '0px'
    element.style.opacity = '0'
  }

  return {
    beforeEnter,
    enter,
    leave
  }
}
