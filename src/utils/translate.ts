import type { LocationQuery } from 'vue-router'

export function addBreakLinesToText(text: string): string {
  return text.split('\r\n').join('<br />').split('\n').join('<br />')
}

export interface Segment {
  type: 'text' | 'link'
  content: string
  to?: string | { name: string; query?: LocationQuery }
}

/* Add break lines and links to translation text */
export function parseTranslation(
  text: string,
  links?: (string | { name: string; query?: LocationQuery })[]
): Segment[] {
  const segments: Segment[] = []
  text = addBreakLinesToText(text)
  const regex = /\*\*(.*?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let linkIndex = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      })
    }
    segments.push({
      type: 'link',
      content: match[1], // the text between ** and **
      to: links && links[linkIndex] ? links[linkIndex] : ''
    })
    linkIndex++
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex)
    })
  }
  return segments
}
