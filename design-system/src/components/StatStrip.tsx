type StatItem = {
  label: string
  value: string
}

type StatStripProps = {
  items: StatItem[]
}

export function StatStrip({ items }: StatStripProps) {
  return (
    <div className="grid gap-3 rounded-[1.25rem] border border-border bg-[#f7efe2] p-4 sm:grid-cols-3 md:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="rounded-[0.9rem] border border-border/70 bg-white/70 px-4 py-3">
          <p className="text-2xl font-semibold text-ink">{item.value}</p>
          <p className="mt-1 text-sm text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
