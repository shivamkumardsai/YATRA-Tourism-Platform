import type { ReactNode } from 'react'

type EditorialPanelProps = {
  eyebrow: string
  title: string
  body: string
  image?: string
  imageAlt?: string
  reverse?: boolean
  children?: ReactNode
}

export function EditorialPanel({ eyebrow, title, body, image, imageAlt, reverse = false, children }: EditorialPanelProps) {
  return (
    <div className={`grid gap-8 rounded-[1.5rem] border border-border bg-[#fcf7ee] p-6 shadow-sm md:p-8 lg:grid-cols-2 lg:items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">{eyebrow}</p>
        <h3 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h3>
        <p className="text-base leading-7 text-muted">{body}</p>
        {children}
      </div>
      {image ? (
        <div className="overflow-hidden rounded-[1.25rem] border border-border">
          <img
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            decoding="async"
            className="h-[320px] w-full object-cover sm:h-[420px]"
          />
        </div>
      ) : null}
    </div>
  )
}
