import type { ReactNode } from 'react'

export const tokens = {
  colors: {
    forest: '#355B4A',
    river: '#4E6F73',
    temple: '#7B5A3B',
    earth: '#9B7A54',
    clay: '#E7D7C1',
    moss: '#C9D6BF',
    sand: '#F7EFE3',
    ink: '#1F241E',
    muted: '#5D655D',
    border: '#D9D2C7',
    surface: '#FCFAF6',
  },
  spacing: {
    xs: '0.375rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    pill: '999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(31, 36, 30, 0.08)',
    md: '0 8px 24px rgba(31, 36, 30, 0.08)',
    lg: '0 18px 42px rgba(31, 36, 30, 0.12)',
  },
} as const

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type BadgeVariant = 'default' | 'success' | 'warning' | 'info'
type AlertVariant = 'info' | 'success' | 'warning' | 'error'
type CardVariant = 'default' | 'elevated' | 'outline'

const buttonBase = 'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

export function Button({ variant = 'primary', children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; children: ReactNode }) {
  const styles: Record<ButtonVariant, string> = {
    primary: 'bg-forest text-white hover:bg-[#2b463a] shadow-sm',
    secondary: 'bg-river/10 text-river hover:bg-river/20',
    ghost: 'bg-transparent text-ink hover:bg-clay/50',
    danger: 'bg-[#8C4332] text-white hover:bg-[#743727]',
  }

  return <button className={`${buttonBase} ${styles[variant]} ${className}`.trim()} {...props}>{children}</button>
}

export function Card({ variant = 'default', className = '', children }: { variant?: CardVariant; className?: string; children: ReactNode }) {
  const styles: Record<CardVariant, string> = {
    default: 'rounded-[1rem] border border-border bg-surface p-6 shadow-sm',
    elevated: 'rounded-[1rem] border border-border bg-surface p-6 shadow-lg',
    outline: 'rounded-[1rem] border border-[#CFC5B1] bg-white p-6',
  }

  return <div className={`${styles[variant]} ${className}`.trim()}>{children}</div>
}

export function Badge({ variant = 'default', children }: { variant?: BadgeVariant; children: ReactNode }) {
  const styles: Record<BadgeVariant, string> = {
    default: 'bg-clay/70 text-ink',
    success: 'bg-moss/70 text-forest',
    warning: 'bg-[#F1E0C7] text-[#7A532B]',
    info: 'bg-river/10 text-river',
  }

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}>{children}</span>
}

export function Alert({ variant = 'info', title, children }: { variant?: AlertVariant; title: string; children: ReactNode }) {
  const styles: Record<AlertVariant, string> = {
    info: 'border-river/20 bg-river/10 text-river',
    success: 'border-moss/70 bg-moss/20 text-forest',
    warning: 'border-[#D8B07A] bg-[#F7E8D0] text-[#6D4720]',
    error: 'border-[#B96A4B] bg-[#F6E0D8] text-[#7A3420]',
  }

  return (
    <div className={`rounded-[1rem] border px-4 py-3 ${styles[variant]}`}>
      <p className="font-semibold">{title}</p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  )
}

export function Navbar() {
  return (
    <header className="flex items-center justify-between rounded-[1rem] border border-border bg-surface/90 px-6 py-4 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-river">YATRA</p>
        <h2 className="text-lg font-semibold text-ink">Digital Tourism Platform</h2>
      </div>
      <nav className="flex items-center gap-4 text-sm text-muted">
        <a href="#" className="hover:text-ink">Destinations</a>
        <a href="#" className="hover:text-ink">Insights</a>
        <a href="#" className="hover:text-ink">Governance</a>
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border pt-6 text-sm text-muted">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>Government of Jharkhand • Sustainable Tourism Intelligence</p>
        <p>Official digital experience for heritage, conservation, and civic access.</p>
      </div>
    </footer>
  )
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; current?: boolean }> }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          <span className={item.current ? 'font-semibold text-ink' : ''}>{item.label}</span>
        </div>
      ))}
    </nav>
  )
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card variant="outline" className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-river">No content yet</p>
      <h3 className="mt-2 text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </Card>
  )
}

export function LoadingState() {
  return (
    <Card variant="outline" className="space-y-3">
      <div className="h-3 w-24 animate-pulse rounded-full bg-clay" />
      <div className="h-4 w-full animate-pulse rounded-full bg-clay/70" />
      <div className="h-4 w-4/5 animate-pulse rounded-full bg-clay/70" />
    </Card>
  )
}

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <Alert variant="error" title={title}>{description}</Alert>
  )
}
