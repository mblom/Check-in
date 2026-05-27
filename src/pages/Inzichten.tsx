const INZICHTEN = [
  {
    id: 1,
    titel: 'Herstel verhoogt scherpte',
    tekst:
      'Herstel na een intensieve dienst is geen luxe, maar een operationele noodzaak. Onderzoek toont aan dat agenten die structureel herstellen, sneller reageren en beter beslissen in complexe situaties.',
    icoon: '⚡',
    kleur: 'bg-blue-50 border-blue-100',
  },
  {
    id: 2,
    titel: 'Spanning en concentratie',
    tekst:
      'Langdurige verhoogde spanning verlaagt concentratie en vergroot de kans op fouten. Door spanning vroegtijdig te signaleren, kun je tijdig maatregelen nemen.',
    icoon: '🧠',
    kleur: 'bg-orange-50 border-orange-100',
  },
  {
    id: 3,
    titel: 'Collegiale steun werkt',
    tekst:
      'Een korte check-in bij een collega na een zware dienst verlaagt aantoonbaar de kans op langdurige uitval. Je hoeft het niet alleen te dragen.',
    icoon: '🤝',
    kleur: 'bg-green-50 border-green-100',
  },
  {
    id: 4,
    titel: 'Reflectie is kracht',
    tekst:
      '"Ik dacht vroeger dat ik alles moest wegdrukken. Nu weet ik: even stoppen en registreren hoe ik me voel, houdt mij sterk."',
    icoon: '💬',
    kleur: 'bg-purple-50 border-purple-100',
    citaat: true,
  },
  {
    id: 5,
    titel: 'Veerkracht is een vaardigheid',
    tekst:
      'Mentale veerkracht is geen persoonskenmerk dat je hebt of niet hebt. Het is een vaardigheid die je kunt trainen — door bewust te zijn van je belasting en herstel.',
    icoon: '💪',
    kleur: 'bg-yellow-50 border-yellow-100',
  },
  {
    id: 6,
    titel: 'De 30-seconden gewoonte',
    tekst:
      'Kleine gewoontes hebben grote impact. Dertig seconden per dag nadenken over je dienst bouwt over tijd een waardevolle spiegel op — voor jezelf en voor je leidinggevende.',
    icoon: '⏱',
    kleur: 'bg-red-50 border-red-100',
  },
]

export function Inzichten() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-[#003082] text-white px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Inzichten</h1>
        <p className="text-blue-200 text-sm mt-1">Kennis over mentale veerkracht</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        {INZICHTEN.map((inzicht) => (
          <div
            key={inzicht.id}
            className={`${inzicht.kleur} border rounded-2xl p-5`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{inzicht.icoon}</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{inzicht.titel}</h3>
                <p className={`text-gray-600 text-sm leading-relaxed ${inzicht.citaat ? 'italic' : ''}`}>
                  {inzicht.tekst}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
