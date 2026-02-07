/**
 * Parse nội dung bài viết dạng Markdown đơn giản (chỉ heading # ## ###).
 * Trả về: { toc, blocks } để render mục lục + nội dung có id cho anchor.
 */
export function parseArticleContent(content) {
  const text = typeof content === 'string' ? content : (content ? String(content) : '')
  const lines = text.split('\n')
  const toc = []
  const blocks = []
  let tocIndex = 0
  let paragraphBuffer = []

  function flushParagraph() {
    if (paragraphBuffer.length) {
      blocks.push({ type: 'p', text: paragraphBuffer.join('\n') })
      paragraphBuffer = []
    }
  }

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      flushParagraph()
      const level = Math.min(match[1].length, 6)
      const headingText = match[2].trim()
      const id = `toc-${tocIndex++}`
      toc.push({ level, text: headingText, id })
      blocks.push({ type: `h${level}`, text: headingText, id })
    } else {
      paragraphBuffer.push(line)
    }
  }
  flushParagraph()

  return { toc, blocks }
}
