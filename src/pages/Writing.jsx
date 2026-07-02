import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { profile } from '../data/profile.js'
import { getPost } from '../content.js'

// Slug that is stable for heading ids, Korean-safe.
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

export default function Writing() {
  const { slug } = useParams()
  const post = getPost(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

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
      <header className="site-header writing-header">
        <Link className="brand" to="/">
          {profile.name}
        </Link>
        <ThemeToggle />
      </header>

      <div className="writing-layout">
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
