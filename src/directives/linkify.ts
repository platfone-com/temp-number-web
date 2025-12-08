import type { DirectiveBinding } from 'vue'

const URL_RE = /(https?:\/\/[^\s<>"']+)/gi

function linkifyToFragment(text: string): DocumentFragment {
  URL_RE.lastIndex = 0

  const frag = document.createDocumentFragment()
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = URL_RE.exec(text))) {
    const original = match[0]
    let url = original

    const trailingMatch = url.match(/[.,);\]]+$/)
    let trailing = ''
    if (trailingMatch) {
      trailing = trailingMatch[0]
      url = url.slice(0, url.length - trailing.length)
    }

    if (match.index > lastIndex) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)))
    }

    const a = document.createElement('a')
    a.textContent = url

    try {
      const u = new URL(url)
      if (u.protocol !== 'http:' && u.protocol !== 'https:') {
        throw new Error('bad protocol')
      }
      a.href = u.toString()
    } catch {
      frag.appendChild(document.createTextNode(url))
      lastIndex = match.index + original.length
      if (trailing) frag.appendChild(document.createTextNode(trailing))
      continue
    }

    a.target = '_blank'
    a.rel = 'noopener noreferrer nofollow ugc'
    a.referrerPolicy = 'no-referrer'
    frag.appendChild(a)

    if (trailing) {
      frag.appendChild(document.createTextNode(trailing))
    }

    lastIndex = match.index + original.length
  }

  if (lastIndex < text.length) {
    frag.appendChild(document.createTextNode(text.slice(lastIndex)))
  }

  return frag
}

function apply(el: HTMLElement, value: unknown) {
  const raw = (typeof value === 'string' ? value : el.textContent) || ''
  el.textContent = ''
  el.appendChild(linkifyToFragment(raw))
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    apply(el, binding.value)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    apply(el, binding.value)
  }
}
