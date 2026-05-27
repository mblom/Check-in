import type { CheckIn } from '../types'

function datumTerug(dagenGeleden: number): string {
  const d = new Date()
  d.setDate(d.getDate() - dagenGeleden)
  return d.toISOString().split('T')[0]
}

export const demoCheckIns: CheckIn[] = [
  {
    id: 'demo-1',
    datum: datumTerug(13),
    dagScore: 'groen',
    spanningNiveau: 3,
    herstelbehoefte: 'laag',
    bijzondereMelding: false,
  },
  {
    id: 'demo-2',
    datum: datumTerug(11),
    dagScore: 'groen',
    spanningNiveau: 4,
    herstelbehoefte: 'laag',
    bijzondereMelding: false,
  },
  {
    id: 'demo-3',
    datum: datumTerug(9),
    dagScore: 'oranje',
    spanningNiveau: 6,
    herstelbehoefte: 'middel',
    bijzondereMelding: true,
    impactScore: 3,
  },
  {
    id: 'demo-4',
    datum: datumTerug(7),
    dagScore: 'oranje',
    spanningNiveau: 7,
    herstelbehoefte: 'middel',
    bijzondereMelding: true,
    impactScore: 4,
    notitie: 'Vechtpartij op de markt, lang ingezet geweest',
  },
  {
    id: 'demo-5',
    datum: datumTerug(5),
    dagScore: 'rood',
    spanningNiveau: 9,
    herstelbehoefte: 'hoog',
    bijzondereMelding: true,
    impactScore: 5,
    buddySuggestieGeaccepteerd: false,
  },
  {
    id: 'demo-6',
    datum: datumTerug(3),
    dagScore: 'oranje',
    spanningNiveau: 6,
    herstelbehoefte: 'middel',
    bijzondereMelding: false,
  },
  {
    id: 'demo-7',
    datum: datumTerug(1),
    dagScore: 'groen',
    spanningNiveau: 4,
    herstelbehoefte: 'laag',
    bijzondereMelding: false,
  },
]

export const demoCollega = 'Sanne de Vries'
