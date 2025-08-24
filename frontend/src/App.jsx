import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-xs text-muted-foreground">
        <div className="container">© {new Date().getFullYear()} Taskflow</div>
      </footer>
    </div>
  )
}
