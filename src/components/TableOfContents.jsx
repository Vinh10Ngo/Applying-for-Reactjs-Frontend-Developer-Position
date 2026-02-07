import './TableOfContents.css'

export default function TableOfContents({ items = [], title = 'Mục lục' }) {
  const hasItems = items?.length > 0

  return (
    <nav className="toc toc-sticky" aria-label="Mục lục">
      <h2 className="toc-title">{title}</h2>
      {hasItems ? (
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
      ) : (
        <p className="toc-empty">Thêm <code>##</code> hoặc <code>###</code> trong nội dung bài để tạo mục lục.</p>
      )}
    </nav>
  )
}
