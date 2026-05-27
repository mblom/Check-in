import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

/**
 * Auto-prompt (nudging): toont de dagelijkse check-in automatisch als dismissible
 * bottom-sheet zodra de gebruiker de app opent of ernaar terugkeert — zonder dat
 * hij hem zelf hoeft op te zoeken. Her-evalueert bij terugkeer naar de app
 * (bijv. wanneer iemand z'n telefoon pakt na de dienst).
 */
export function CheckinPrompt() {
  const {
    profiel,
    checkIns,
    huidigScherm,
    promptAfgewezenOp,
    startNieuweCheckin,
    wijsPromptAf,
  } = useStore()
  const [, setTick] = useState(0)

  // Bij terugkeer naar de app opnieuw beoordelen of de prompt moet verschijnen.
  useEffect(() => {
    const opTerugkeer = () => {
      if (document.visibilityState === 'visible') setTick((t) => t + 1)
    }
    document.addEventListener('visibilitychange', opTerugkeer)
    return () => document.removeEventListener('visibilitychange', opTerugkeer)
  }, [])

  const vandaag = new Date().toISOString().split('T')[0]
  const heeftVandaagCheckin = checkIns.some((c) => c.datum === vandaag)
  const toon =
    !!profiel &&
    huidigScherm === 'dashboard' &&
    !heeftVandaagCheckin &&
    promptAfgewezenOp !== vandaag

  if (!toon) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop — wegklikken telt als 'Niet nu' */}
      <div className="absolute inset-0 bg-black/40 animate-[fadeIn_0.2s_ease-out]" onClick={wijsPromptAf} />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 shadow-2xl animate-[slideUp_0.25s_ease-out]">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 bg-[#003082] rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
            ✓
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg leading-tight">Even inchecken na je dienst?</h2>
            <p className="text-gray-500 text-sm">Sluit je dag af. Duurt ≈ 30 seconden.</p>
          </div>
        </div>

        <button
          onClick={startNieuweCheckin}
          className="w-full bg-[#003082] text-white rounded-xl py-3 font-semibold active:scale-[0.98] transition-transform mb-2"
        >
          Doe je check-in
        </button>
        <button
          onClick={wijsPromptAf}
          className="w-full text-gray-500 rounded-xl py-2.5 text-sm font-medium active:scale-[0.98] transition-transform"
        >
          Niet nu
        </button>
      </div>
    </div>
  )
}
