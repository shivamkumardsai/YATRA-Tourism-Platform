import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Navigation } from '../components/Navigation'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f7efe3] text-ink">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="lg:hidden">
          <Navigation />
        </div>
        <section className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-6 shadow-sm sm:p-8">
          <Outlet />
        </section>
      </main>
      <Footer />
    </div>
  )
}
