import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { DagScore, HerstellNiveau } from '../types'

const STAPPEN_GROEN = 3
const STAPPEN_ORANJE = 4
const STAPPEN_ROOD = 5

function bepaalMaxStappen(dagScore: DagScore | undefined) {
  if (dagScore === 'groen') return STAPPEN_GROEN
  if (dagScore === 'oranje') return STAPPEN_ORANJE
  if (dagScore === 'rood') return STAPPEN_ROOD
  return 5
}

export function CheckIn() {
  const { huidigCheckin, updateCheckin, slaCheckinOp, navigeerNaar } = useStore()
  const [stap, setStap] = useState(1)

  const dagScore = huidigCheckin?.dagScore
  const maxStappen = bepaalMaxStappen(dagScore)

  function volgende(data?: Parameters<typeof updateCheckin>[0]) {
    if (data) updateCheckin(data)
    if (stap >= maxStappen) {
      if (data) updateCheckin(data)
      setTimeout(() => slaCheckinOp(), 50)
    } else {
      setStap(stap + 1)
    }
  }

  function terug() {
    if (stap === 1) navigeerNaar('dashboard')
    else setStap(stap - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#003082] text-white px-4 pt-12 pb-6">
        <button onClick={terug} className="text-blue-200 text-sm mb-3 flex items-center gap-1">
          <span>←</span> Terug
        </button>
        <h1 className="text-xl font-bold">Dagelijkse check-in</h1>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: maxStappen }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i < stap ? 'bg-white' : 'bg-blue-300/40'}`}
            />
          ))}
        </div>
        <p className="text-blue-200 text-xs mt-1">Stap {stap} van {maxStappen}</p>
      </div>

      {/* Inhoud */}
      <div className="flex-1 p-5 flex flex-col justify-center">
        {stap === 1 && <StapDagScore onKies={(score) => { updateCheckin({ dagScore: score }); setStap(2) }} />}
        {stap === 2 && <StapSpanning huidig={huidigCheckin?.spanningNiveau ?? 5} onKies={(n) => volgende({ spanningNiveau: n })} />}
        {stap === 3 && <StapHerstel onKies={(h) => volgende({ herstelbehoefte: h })} />}
        {stap === 4 && dagScore !== 'groen' && (
          <StapMelding onKies={(had) => {
            if (!had) { volgende({ bijzondereMelding: false }); return }
            updateCheckin({ bijzondereMelding: true })
            setStap(5)
          }} />
        )}
        {stap === 5 && <StapImpact onKies={(impact) => volgende({ bijzondereMelding: true, impactScore: impact })} />}
      </div>
    </div>
  )
}

// ─── Stap 1: Dag score ────────────────────────────────────────────────────────

function StapDagScore({ onKies }: { onKies: (s: DagScore) => void }) {
  const opties: { score: DagScore; label: string; emoji: string; kleur: string; bg: string; border: string }[] = [
    { score: 'groen', label: 'Goede dag', emoji: '🟢', kleur: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    { score: 'oranje', label: 'Redelijke dag', emoji: '🟡', kleur: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
    { score: 'rood', label: 'Zware dag', emoji: '🔴', kleur: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  ]

  return (
    <div>
      <h2 className="text-gray-800 text-2xl font-bold mb-2">Hoe was je dag?</h2>
      <p className="text-gray-500 mb-6 text-sm">Kies wat het beste past bij hoe je je voelt na deze dienst.</p>
      <div className="flex flex-col gap-3">
        {opties.map((o) => (
          <button
            key={o.score}
            onClick={() => onKies(o.score)}
            className={`${o.bg} ${o.border} border-2 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.97] transition-transform text-left`}
          >
            <span className="text-3xl">{o.emoji}</span>
            <span className={`${o.kleur} font-semibold text-lg`}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Stap 2: Spanning ────────────────────────────────────────────────────────

function StapSpanning({ huidig, onKies }: { huidig: number; onKies: (n: number) => void }) {
  const [waarde, setWaarde] = useState(huidig)

  const kleur = waarde <= 3 ? 'text-green-600' : waarde <= 6 ? 'text-orange-500' : 'text-red-600'
  const label = waarde <= 3 ? 'Laag' : waarde <= 6 ? 'Matig' : 'Hoog'

  return (
    <div>
      <h2 className="text-gray-800 text-2xl font-bold mb-2">Spanningsniveau</h2>
      <p className="text-gray-500 mb-6 text-sm">Hoe gespannen voelde je je vandaag tijdens je dienst?</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className={`text-5xl font-bold text-center ${kleur} mb-1`}>{waarde}</div>
        <div className={`text-center text-sm font-medium ${kleur}`}>{label}</div>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={waarde}
        onChange={(e) => setWaarde(Number(e.target.value))}
        className="w-full accent-[#003082] mb-2"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>1 – Ontspannen</span>
        <span>10 – Zeer gespannen</span>
      </div>

      <button
        onClick={() => onKies(waarde)}
        className="w-full bg-[#003082] text-white rounded-xl py-3 font-semibold mt-6 active:scale-[0.98] transition-transform"
      >
        Volgende
      </button>
    </div>
  )
}

// ─── Stap 3: Herstelbehoefte ─────────────────────────────────────────────────

function StapHerstel({ onKies }: { onKies: (h: HerstellNiveau) => void }) {
  const opties: { niveau: HerstellNiveau; label: string; beschrijving: string; kleur: string }[] = [
    { niveau: 'laag', label: 'Laag', beschrijving: 'Ik voel me prima, geen extra herstel nodig', kleur: 'text-green-700' },
    { niveau: 'middel', label: 'Middel', beschrijving: 'Ik kan wel wat rust gebruiken', kleur: 'text-orange-600' },
    { niveau: 'hoog', label: 'Hoog', beschrijving: 'Ik ben behoorlijk leeg en moet echt bijkomen', kleur: 'text-red-600' },
  ]

  return (
    <div>
      <h2 className="text-gray-800 text-2xl font-bold mb-2">Herstelbehoefte</h2>
      <p className="text-gray-500 mb-6 text-sm">Hoeveel herstel heb je nodig na deze dienst?</p>
      <div className="flex flex-col gap-3">
        {opties.map((o) => (
          <button
            key={o.niveau}
            onClick={() => onKies(o.niveau)}
            className="bg-white border border-gray-200 rounded-2xl p-4 text-left active:scale-[0.97] transition-transform shadow-sm"
          >
            <div className={`font-semibold ${o.kleur}`}>{o.label}</div>
            <div className="text-gray-500 text-sm mt-0.5">{o.beschrijving}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Stap 4: Bijzondere melding ───────────────────────────────────────────────

function StapMelding({ onKies }: { onKies: (had: boolean) => void }) {
  return (
    <div>
      <h2 className="text-gray-800 text-2xl font-bold mb-2">Bijzondere melding</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Had je vandaag te maken met een ingrijpende situatie? Denk aan een vechtpartij, een ernstig ongeluk, of een
        emotioneel zwaar gesprek.
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onKies(true)}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-left active:scale-[0.97] transition-transform"
        >
          <div className="font-semibold text-red-700">Ja</div>
          <div className="text-gray-500 text-sm mt-0.5">Er was een situatie met impact</div>
        </button>
        <button
          onClick={() => onKies(false)}
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-left active:scale-[0.97] transition-transform"
        >
          <div className="font-semibold text-green-700">Nee</div>
          <div className="text-gray-500 text-sm mt-0.5">Geen bijzondere meldingen</div>
        </button>
      </div>
    </div>
  )
}

// ─── Stap 5: Impact score ─────────────────────────────────────────────────────

function StapImpact({ onKies }: { onKies: (impact: number) => void }) {
  const [waarde, setWaarde] = useState(3)

  const labels = ['', 'Licht', 'Merkbaar', 'Behoorlijk', 'Zwaar', 'Zeer zwaar']

  return (
    <div>
      <h2 className="text-gray-800 text-2xl font-bold mb-2">Impact van de melding</h2>
      <p className="text-gray-500 mb-6 text-sm">Hoe groot was de emotionele impact van de situatie op jou?</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="text-4xl font-bold text-center text-[#003082] mb-1">{labels[waarde]}</div>
      </div>

      <div className="flex justify-between gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setWaarde(n)}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              waarde === n
                ? 'bg-[#003082] text-white scale-105 shadow'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        onClick={() => onKies(waarde)}
        className="w-full bg-[#003082] text-white rounded-xl py-3 font-semibold active:scale-[0.98] transition-transform"
      >
        Afronden
      </button>
    </div>
  )
}
