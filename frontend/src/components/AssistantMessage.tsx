import type { ReactNode } from 'react'

function getWebUrl(value: string): string | null {
  const href = value.startsWith('www.') ? `https://${value}` : value

  try {
    const url = new URL(href)
    return url.protocol === 'http:' || url.protocol === 'https:' ? href : null
  } catch {
    return null
  }
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const tokenPattern =
    /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)|\*\*(.+?)\*\*|__(.+?)__|\*([^*\n]+)\*|`([^`\n]+)`/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let tokenIndex = 0

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const key = `${keyPrefix}-${tokenIndex++}`
    const markdownUrl = match[2]
    const plainUrl = match[3]
    if (markdownUrl) {
      const href = getWebUrl(markdownUrl)
      nodes.push(
        href ? (
          <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {match[1]}
          </a>
        ) : (
          match[1]
        ),
      )
    } else if (plainUrl) {
      const trailingPunctuation = plainUrl.match(/[.,!?;:)\]}]+$/)?.[0] ?? ''
      const urlText = plainUrl.slice(0, plainUrl.length - trailingPunctuation.length)
      const href = getWebUrl(urlText)
      nodes.push(
        href ? (
          <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {urlText}
          </a>
        ) : (
          urlText
        ),
      )
      if (trailingPunctuation) nodes.push(trailingPunctuation)
    } else if (match[4] || match[5]) {
      nodes.push(
        <strong key={key}>
          {renderInline(match[4] ?? match[5], `${key}-bold`)}
        </strong>,
      )
    } else if (match[6]) {
      nodes.push(<em key={key}>{renderInline(match[6], `${key}-italic`)}</em>)
    } else if (match[7]) {
      nodes.push(<code key={key}>{match[7]}</code>)
    }

    lastIndex = tokenPattern.lastIndex
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

export default function AssistantMessage({ text }: { text: string }) {
  const lines = text.trim().split(/\r?\n/)
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) {
      index += 1
      continue
    }

    const heading = line.match(/^#{1,3}\s+(.+)$/)
    if (heading) {
      blocks.push(
        <h4 key={`heading-${index}`}>{renderInline(heading[1], `heading-${index}`)}</h4>,
      )
      index += 1
      continue
    }

    const listItem = line.match(/^(?:[-*]\s+|\d+[.)]\s+)(.+)$/)
    if (listItem) {
      const items: string[] = []
      while (index < lines.length) {
        const item = lines[index].trim().match(/^(?:[-*]\s+|\d+[.)]\s+)(.+)$/)
        if (!item) break
        items.push(item[1])
        index += 1
      }
      blocks.push(
        <ul key={`list-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`list-${index}-${itemIndex}`}>
              {renderInline(item, `list-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>,
      )
      continue
    }

    const paragraph: string[] = []
    while (index < lines.length) {
      const current = lines[index].trim()
      if (
        !current ||
        /^#{1,3}\s+/.test(current) ||
        /^(?:[-*]\s+|\d+[.)]\s+)/.test(current)
      ) {
        break
      }
      paragraph.push(current)
      index += 1
    }
    blocks.push(
      <p key={`paragraph-${index}`}>
        {renderInline(paragraph.join(' '), `paragraph-${index}`)}
      </p>,
    )
  }

  return <div className="assistant-markdown">{blocks}</div>
}
