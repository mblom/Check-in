import { useState } from 'react'
import { useStore } from '../store/useStore'

export function Welkom() {
  const [naam, setNaam] = useState('')
  const { setProfiel, laadDemoData } = useStore()

  function handleStart(e: React.FormEvent) {
    e.preventDefault()
    if (!naam.trim()) return
    laadDemoData()
    setProfiel({ naam: naam.trim() })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003082] to-[#00205a] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo / badge */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden">
            <img src="/logo.jpeg" alt="WijkAgent Check-in logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white text-2xl font-bold text-center">WijkAgent Check-in</h1>
          <p className="text-blue-200 text-sm text-center mt-1">Jouw dagelijkse check-in. 30 seconden.</p>
        </div>

        {/* Kaart */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-gray-800 font-semibold text-lg mb-1">Welkom</h2>
          <p className="text-gray-500 text-sm mb-5">
            Voer je naam in om te beginnen. Je gegevens worden alleen op dit apparaat opgeslagen.
          </p>
          <form onSubmit={handleStart}>
            <input
              type="text"
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              placeholder="Bijv. Jan Jansen"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-[#003082] mb-4"
              autoFocus
            />
            <button
              type="submit"
              disabled={!naam.trim()}
              className="w-full bg-[#003082] text-white rounded-xl py-3 font-semibold text-base disabled:opacity-40 active:scale-[0.98] transition-transform"
            >
              Start
            </button>
          </form>
        </div>

        <p className="text-blue-200 text-xs text-center mt-6">
          Een initiatief voor mentale veerkracht binnen de politie
        </p>
      </div>
    </div>
  )
}
