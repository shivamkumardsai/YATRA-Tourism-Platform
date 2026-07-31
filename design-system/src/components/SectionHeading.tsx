type SectionHeadingProps = {
  eyebrow: string
  title: string
  intro?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, intro, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      {intro ? <p className="mt-3 text-base leading-7 text-muted">{intro}</p> : null}
    </div>
  )
}
