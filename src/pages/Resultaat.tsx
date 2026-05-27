import { useStore } from '../store/useStore'
import { demoCollega } from '../data/demoData'

export function Resultaat() {
  const { checkIns, navigeerNaar, updateCheckin } = useStore()
  const laatste = checkIns[checkIns.length - 1]

  if (!laatste) {
    navigeerNaar('dashboard')
    return null
  }

  const { dagScore, spanningNiveau, buddySuggestieGeaccepteerd } = laatste

  // Bereken trend
  const recenteSpanning = checkIns.slice(-5).map((c) => c.spanningNiveau)
  const gemiddelde = recenteSpanning.reduce((a, b) => a + b, 0) / recenteSpanning.length
  const trendHoog = checkIns.length >= 3 && spanningNiveau > gemiddelde + 1.5

  const toonBuddySuggestie =
    (dagScore === 'rood' || (dagScore === 'oranje' && trendHoog)) &&
    buddySuggestieGeaccepteerd === undefined

  function accepteerBuddy() {
    updateCheckin({ buddySuggestieGeaccepteerd: true })
    navigeerNaar('dashboard')
  }

  const feedback = bepaalFeedback(laatste.spanningNiveau, checkIns.length, gemiddelde)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Icoon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md ${
              dagScore === 'groen'
                ? 'bg-green-100'
                : dagScore === 'oranje'
                ? 'bg-orange-100'
                : 'bg-red-100'
            }`}
          >
            {dagScore === 'groen' ? '✅' : dagScore === 'oranje' ? '⚠️' : '🔴'}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Check-in opgeslagen</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Goed gedaan. Je hebt vandaag even gestopt bij jezelf.</p>

        {/* Feedback kaart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Jouw feedback</h3>
          <p className="text-gray-700 text-base leading-relaxed">{feedback}</p>
        </div>

        {/* Buddy suggestie */}
        {toonBuddySuggestie && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-4">
            <h3 className="font-semibold text-[#003082] mb-1">Collegiale check-in</h3>
            <p className="text-gray-600 text-sm mb-3">
              Je hebt een zware dag gehad. Hoe gaat het met <strong>{demoCollega}</strong>? Een korte check-in bij een
              collega kan helpen.
            </p>
            <div className="flex gap-2">
              <button
                onClick={accepteerBuddy}
                className="flex-1 bg-[#003082] text-white rounded-xl py-2.5 text-sm font-semibold active:scale-[0.97] transition-transform"
              >
                Ik check even in
              </button>
              <button
                onClick={() => navigeerNaar('dashboard')}
                className="flex-1 bg-white border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm active:scale-[0.97] transition-transform"
              >
                Niet nu
              </button>
            </div>
          </div>
        )}

        {/* Bewustwording */}
        <div className="bg-[#003082]/5 rounded-2xl p-4 mb-6">
          <p className="text-[#003082] text-sm leading-relaxed italic">
            {bewustwordingsTip(dagScore)}
          </p>
        </div>

        <button
          onClick={() => navigeerNaar('dashboard')}
          className="w-full bg-[#003082] text-white rounded-xl py-3 font-semibold active:scale-[0.98] transition-transform"
        >
          Naar mijn overzicht
        </button>
      </div>
    </div>
  )
}

function bepaalFeedback(spanning: number, aantalCheckins: number, gemiddelde: number): string {
  if (aantalCheckins < 2) {
    return 'Goed bezig! Je eerste check-in staat geregistreerd. Houd dit bij en je krijgt inzicht in patronen.'
  }
  if (spanning > gemiddelde + 2) {
    return `Je spanning (${spanning}/10) is hoger dan je gemiddelde van ${gemiddelde.toFixed(1)}. Let extra goed op jezelf de komende dagen.`
  }
  if (spanning < gemiddelde - 1) {
    return `Je spanning van ${spanning}/10 ligt lager dan normaal voor jou. Dat is positief!`
  }
  return `Je spanning van ${spanning}/10 is vergelijkbaar met je gemiddelde. Blijf goed voor jezelf zorgen.`
}

function bewustwordingsTip(score: string | undefined): string {
  const tips = {
    groen: '"Regelmatig herstel na dienst verhoogt je operationele scherpte op de lange termijn."',
    oranje: '"Langdurige verhoogde spanning verlaagt concentratie en reactiesnelheid. Herstel is geen zwakte, maar strategie."',
    rood: '"Collegiale steun na ingrijpende meldingen verlaagt de kans op uitval met tot 40%. Je staat er niet alleen voor."',
  }
  return tips[score as keyof typeof tips] ?? tips.groen
}
