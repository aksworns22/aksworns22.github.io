import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Writing from './pages/Writing.jsx'

// HashRouter keeps deep links working on GitHub Pages without a 404 fallback.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/writing/:slug" element={<Writing />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}
