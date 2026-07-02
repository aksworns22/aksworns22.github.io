import { useTheme } from '../theme.jsx'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      aria-pressed={theme === 'dark'}
      type="button"
    >
      <span className="knob" />
    </button>
  )
}
