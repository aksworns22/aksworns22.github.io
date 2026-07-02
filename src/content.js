// Load every writing (.mdx) at build time as raw text, parse the YAML-ish
// frontmatter by hand (no Buffer-dependent libraries), and expose sorted posts.

const files = import.meta.glob('../writings/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { data: {}, body: raw.trim() }

  const [, fm, body] = match
  const data = {}
  let currentListKey = null

  for (const line of fm.split(/\r?\n/)) {
    const listItem = /^\s*-\s+(.*)$/.exec(line)
    if (listItem && currentListKey) {
      data[currentListKey].push(stripQuotes(listItem[1].trim()))
      continue
    }
    const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line)
    if (!kv) continue
    const [, key, value] = kv
    if (value === '') {
      data[key] = []
      currentListKey = key
    } else {
      data[key] = stripQuotes(value.trim())
      currentListKey = null
    }
  }
  return { data, body: body.trim() }
}

function stripQuotes(s) {
  return s.replace(/^['"]|['"]$/g, '')
}

// The date strings in frontmatter are loosely formatted (e.g. an errant "011:36:00").
// Extract just the calendar date for reliable sorting + display.
function parseDate(value) {
  if (!value) return { ts: 0, label: '' }
  const m = /(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
  if (!m) return { ts: 0, label: String(value) }
  const [, y, mo, d] = m
  const ts = new Date(Number(y), Number(mo) - 1, Number(d)).getTime()
  const label = `${y}. ${mo}. ${d}`
  return { ts, label }
}

// Derive a category from a leading "[...]" tag in the title so the home page
// can group posts the way the reference design groups Essays / Short posts.
function deriveCategory(title) {
  const m = /^\s*\[([^\]]+)\]/.exec(title || '')
  const category = m ? m[1].trim() : '글'
  return category === '우아한테크코스' ? '회고/기록' : category
}

function cleanTitle(title) {
  return (title || '').replace(/^\s*\[[^\]]+\]\s*/, '').trim() || title
}

export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    const slug = path.split('/').pop().replace(/\.mdx?$/, '')
    const { ts, label } = parseDate(data.date)
    return {
      slug,
      title: data.title || slug,
      displayTitle: cleanTitle(data.title || slug),
      description: data.description || '',
      category: deriveCategory(data.title),
      tags: Array.isArray(data.tags) ? data.tags : [],
      draft: data.draft === 'true' || data.draft === true,
      dateTs: ts,
      dateLabel: label,
      body,
    }
  })
  .filter((p) => !p.draft)
  .sort((a, b) => b.dateTs - a.dateTs)

export function getPost(slug) {
  return posts.find((p) => p.slug === slug)
}

// Group posts by derived category, preserving date-desc order within a group.
export function groupedPosts() {
  const groups = new Map()
  for (const p of posts) {
    if (!groups.has(p.category)) groups.set(p.category, [])
    groups.get(p.category).push(p)
  }
  return [...groups.entries()].map(([category, items]) => ({ category, items }))
}
