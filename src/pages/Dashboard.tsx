import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useStore } from '../store/useStore'
import type { CheckIn } from '../types'

const SCORE_KLEUR: Record<string, string> = {
  groen: 'bg-green-500',
  oranje: 'bg-orange-400',
  rood: 'bg-red-500',
}

const SCORE_LABEL: Record<string, string> = {
  groen: 'Goede dag',
  oranje: 'Redelijke dag',
  rood: 'Zware dag',
}

function formatDatum(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

export function Dashboard() {
  const { profiel, checkIns, startNieuweCheckin } = useStore()

  const recenteCheckins = [...checkIns].reverse().slice(0, 10)
  const grafiekData = checkIns.slice(-7).map((c) => ({
    datum: formatDatum(c.datum),
    spanning: c.spanningNiveau,
  }))

  const gemiddeldSpanning =
    checkIns.length > 0
      ? checkIns.reduce((s, c) => s + c.spanningNiveau, 0) / checkIns.length
      : 0

  const aantalZwareWeek = checkIns.filter((c) => {
    const d = new Date(c.datum)
    const weekGeleden = new Date()
    weekGeleden.setDate(weekGeleden.getDate() - 7)
    return d >= weekGeleden && c.dagScore === 'rood'
  }).length

  const heeftVandaagCheckin = checkIns.some((c) => c.datum === new Date().toISOString().split('T')[0])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-[#003082] text-white px-5 pt-12 pb-6">
        <p className="text-blue-200 text-sm">Welkom terug,</p>
        <h1 className="text-2xl font-bold">{profiel?.naam}</h1>
      </div>

      <div className="px-5 -mt-4">
        {/* Check-in knop */}
        {!heeftVandaagCheckin ? (
          <button
            onClick={startNieuweCheckin}
            className="w-full bg-white border-2 border-[#003082] rounded-2xl p-5 mb-5 shadow-md flex items-center gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-[#003082] rounded-xl flex items-center justify-center text-white text-xl">
              ✓
            </div>
            <div className="text-left">
              <div className="font-bold text-[#003082] text-lg">Doe je check-in</div>
              <div className="text-gray-500 text-sm">Nog niet gedaan vandaag · ≈ 30 sec</div>
            </div>
          </button>
        ) : (
          <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <div className="font-semibold text-green-700">Check-in gedaan</div>
              <div className="text-gray-500 text-sm">Goed bezig! Tot morgen.</div>
            </div>
          </div>
        )}

        {/* Stats */}
        {checkIns.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatKaart label="Gem. spanning" waarde={`${gemiddeldSpanning.toFixed(1)}/10`} />
            <StatKaart label="Zware diensten (7d)" waarde={`${aantalZwareWeek}x`} accent={aantalZwareWeek >= 3} />
          </div>
        )}

        {/* Grafiek */}
        {grafiekData.length >= 2 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
            <h2 className="font-semibold text-gray-700 mb-1">Spanning afgelopen 7 diensten</h2>
            <Signaalzin checkIns={checkIns} />
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={grafiekData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="datum" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }}
                  formatter={(v: number) => [`${v}/10`, 'Spanning']}
                />
                <Line
                  type="monotone"
                  dataKey="spanning"
                  stroke="#003082"
                  strokeWidth={2.5}
                  dot={{ fill: '#003082', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recente check-ins */}
        {recenteCheckins.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
            <div className="px-5 py-3 border-b border-gray-50">
              <h2 className="font-semibold text-gray-700">Recente check-ins</h2>
            </div>
            {recenteCheckins.map((c) => (
              <CheckInRij key={c.id} checkin={c} />
            ))}
          </div>
        )}

        {checkIns.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            <div className="text-5xl mb-3">📋</div>
            <p>Geen check-ins nog. Doe je eerste check-in!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatKaart({ label, waarde, accent = false }: { label: string; waarde: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 shadow-sm border ${accent ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-red-600' : 'text-[#003082]'}`}>{waarde}</p>
    </div>
  )
}

function Signaalzin({ checkIns }: { checkIns: CheckIn[] }) {
  if (checkIns.length < 3) return null
  const recent = checkIns.slice(-3).map((c) => c.spanningNiveau)
  const oud = checkIns.slice(-6, -3).map((c) => c.spanningNiveau)
  if (oud.length === 0) return null
  const gemRecent = recent.reduce((a, b) => a + b, 0) / recent.length
  const gemOud = oud.reduce((a, b) => a + b, 0) / oud.length

  if (gemRecent > gemOud + 1.5) {
    return <p className="text-orange-600 text-xs mb-3">⚠ Je spanning is de laatste diensten hoger dan normaal.</p>
  }
  if (gemRecent < gemOud - 1.5) {
    return <p className="text-green-600 text-xs mb-3">✓ Je spanning is de laatste diensten lager dan normaal. Goed herstel!</p>
  }
  return null
}

function CheckInRij({ checkin }: { checkin: CheckIn }) {
  return (
    <div className="px-5 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0">
      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${SCORE_KLEUR[checkin.dagScore]}`} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-700 text-sm">{SCORE_LABEL[checkin.dagScore]}</div>
        {checkin.notitie && (
          <div className="text-gray-400 text-xs truncate">{checkin.notitie}</div>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs text-gray-400">{formatDatum(checkin.datum)}</div>
        <div className="text-sm font-semibold text-gray-600">{checkin.spanningNiveau}/10</div>
      </div>
    </div>
  )
}
