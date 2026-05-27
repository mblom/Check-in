import { useStore } from './store/useStore'
import { Welkom } from './pages/Welkom'
import { CheckIn } from './pages/CheckIn'
import { Resultaat } from './pages/Resultaat'
import { Dashboard } from './pages/Dashboard'
import { Inzichten } from './pages/Inzichten'
import { BottomNav } from './components/BottomNav'

export default function App() {
  const { huidigScherm } = useStore()

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      {huidigScherm === 'welkom' && <Welkom />}
      {huidigScherm === 'checkin' && <CheckIn />}
      {huidigScherm === 'resultaat' && <Resultaat />}
      {huidigScherm === 'dashboard' && <Dashboard />}
      {huidigScherm === 'inzichten' && <Inzichten />}
      <BottomNav />
    </div>
  )
}
