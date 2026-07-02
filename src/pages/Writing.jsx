import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { profile } from '../data/profile.js'
import { getPost } from '../content.js'

// Slug that is stable for both the TOC link and the heading id, Korean-safe.
function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
}

function childrenToText(children) {
  if (children == null) return ''
  if (typeof children === 'string' || typeof children === 'number')
    return String(children)
  if (Array.isArray(children)) return children.map(childrenToText).join('')
  if (children.props) return childrenToText(children.props.children)
  return ''
}

// Pull top-level (#, ##) headings out of the markdown for the Contents sidebar.
function extractToc(body) {
  const toc = []
  const inCode = { on: false }
  for (const line of body.split(/\r?\n/)) {
    if (/^```/.test(line)) {
      inCode.on = !inCode.on
      continue
    }
    if (inCode.on) continue
    const m = /^(#{1,2})\s+(.*)$/.exec(line)
    if (m) {
      const text = m[2].replace(/[*_`]/g, '').trim()
      toc.push({ level: m[1].length, text, id: slugify(text) })
    }
  }
  return toc
}

export default function Writing() {
  const { slug } = useParams()
  const post = getPost(slug)
  const toc = useMemo(() => (post ? extractToc(post.body) : []), [post])
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Scroll-spy: highlight the section currently near the top of the viewport.
  useEffect(() => {
    if (toc.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )
    toc.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [toc])

  if (!post) {
    return (
      <div className="not-found">
        <p>글을 찾을 수 없습니다.</p>
        <p>
          <Link to="/">← 홈으로 돌아가기</Link>
        </p>
      </div>
    )
  }

  const heading = (Tag) =>
    function H({ children }) {
      const id = slugify(childrenToText(children))
      return <Tag id={id}>{children}</Tag>
    }

  return (
    <>
      <header className="writing-header">
        <Link className="close" to="/" aria-label="닫기">
          ✕
        </Link>
        <Link className="brand" to="/">
          {profile.name}
        </Link>
        <span className="toggle-slot">
          <ThemeToggle />
        </span>
      </header>

      <div className="writing-layout">
        {toc.length > 0 && (
          <nav className="toc">
            <h3>Contents</h3>
            <ol>
              {toc.map((item) => (
                <li key={item.id} style={{ marginLeft: (item.level - 1) * 12 }}>
                  <a
                    href={`#${item.id}`}
                    className={activeId === item.id ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById(item.id)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article className="article">
          <h1 className="title">{post.displayTitle}</h1>
          {post.description && <p className="subtitle">{post.description}</p>}
          {post.dateLabel && <p className="date">{post.dateLabel}</p>}
          <div className="article-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: heading('h1'),
                h2: heading('h2'),
                h3: heading('h3'),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {post.body}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </>
  )
}
