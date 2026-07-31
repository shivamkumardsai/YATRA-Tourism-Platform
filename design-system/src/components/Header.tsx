import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/journey-planner', label: 'Journey Planner' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/local-treasures', label: 'Local Treasures' },
  { to: '/conservation-watch', label: 'Conservation Watch' },
  { to: '/tourism-intelligence-centre', label: 'Tourism Intelligence Centre' },
]

export function Header() {
  return (
    <header className="border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-forest text-sm font-semibold text-white">
            Y
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">YATRA</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-muted lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors hover:text-ink ${isActive ? 'text-ink' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-clay/50 sm:inline-flex">
            Login
          </Link>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink lg:hidden" aria-label="Open navigation">
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
