import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { profile } from '../data/profile.js'
import { groupedPosts } from '../content.js'

export default function Home() {
  const groups = groupedPosts()

  return (
    <div className="home">
      <header className="site-header home-header">
        <span className="brand">{profile.name}</span>
        <ThemeToggle />
      </header>

      <section className="intro">
        {profile.intro.map((para, i) => (
          <ReactMarkdown key={i}>{para}</ReactMarkdown>
        ))}
      </section>

      {profile.facts?.length > 0 && (
        <section className="section">
          <h2>Profile</h2>
          <div className="facts">
            {profile.facts.map((f) => (
              <div className="fact-row" key={f.label}>
                <span className="fact-label">{f.label}</span>
                <span>{f.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {groups.map(({ category, items }) => (
        <section className="section" key={category}>
          <h2>{category}</h2>
          <ul>
            {items.map((p) => (
              <li key={p.slug}>
                <Link to={`/writing/${p.slug}`}>{p.displayTitle}</Link>
                {p.dateLabel && <span className="post-date">{p.dateLabel}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {profile.links?.length > 0 && (
        <section className="section">
          <h2>Links</h2>
          <ul>
            {profile.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
