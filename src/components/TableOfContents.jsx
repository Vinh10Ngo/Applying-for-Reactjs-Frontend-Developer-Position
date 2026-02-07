import './TableOfContents.css'

export default function TableOfContents({ items, title = 'Mục lục' }) {
  if (!items?.length) return null

  return (
    <nav className="toc" aria-label="Mục lục">
      <h2 className="toc-title">{title}</h2>
      <ul className="toc-list">
        {items.map((item) => (
          <li
            key={item.id}
            className="toc-item"
            style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
          >
            <a href={`#${item.id}`} className="toc-link">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
