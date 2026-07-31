import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/journey-planner', label: 'Journey Planner' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/local-treasures', label: 'Local Treasures' },
  { to: '/conservation-watch', label: 'Conservation Watch' },
  { to: '/tourism-intelligence-centre', label: 'Tourism Intelligence Centre' },
]

export function Navigation() {
  return (
    <nav className="rounded-[1rem] border border-border bg-surface p-4 shadow-sm lg:hidden">
      <ul className="flex flex-col gap-2 text-sm font-medium text-muted">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `block rounded-[0.75rem] px-3 py-2 transition-colors ${isActive ? 'bg-clay/60 text-ink' : 'hover:bg-clay/30 hover:text-ink'}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
