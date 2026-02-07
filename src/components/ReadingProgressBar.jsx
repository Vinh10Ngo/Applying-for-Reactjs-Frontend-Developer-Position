import { useState, useEffect } from 'react'
import './ReadingProgressBar.css'

export default function ReadingProgressBar({ articleRef, articleId }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = articleRef?.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const articleTop = rect.top + scrollY
      const articleHeight = el.offsetHeight

      if (articleHeight <= viewportHeight) {
        setProgress(scrollY >= articleTop ? 100 : 0)
        return
      }
      const scrollable = articleHeight - viewportHeight
      const p = (scrollY - articleTop) / scrollable * 100
      setProgress(Math.min(100, Math.max(0, p)))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [articleRef, articleId])

  return (
    <div
      className="reading-progress-bar"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Tiến độ đọc"
      style={{ width: `${progress}%` }}
    />
  )
}
