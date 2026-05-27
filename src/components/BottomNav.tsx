import { useStore } from '../store/useStore'

type Scherm = 'dashboard' | 'inzichten'

interface NavItem {
  scherm: Scherm
  label: string
  icoon: string
}

const items: NavItem[] = [
  { scherm: 'dashboard', label: 'Overzicht', icoon: '📊' },
  { scherm: 'inzichten', label: 'Inzichten', icoon: '💡' },
]

export function BottomNav() {
  const { huidigScherm, navigeerNaar } = useStore()

  if (!['dashboard', 'inzichten'].includes(huidigScherm)) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex safe-area-pb">
      {items.map((item) => (
        <button
          key={item.scherm}
          onClick={() => navigeerNaar(item.scherm)}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
            huidigScherm === item.scherm ? 'text-[#003082]' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{item.icoon}</span>
          <span className={`text-xs font-medium ${huidigScherm === item.scherm ? 'text-[#003082]' : 'text-gray-400'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}
