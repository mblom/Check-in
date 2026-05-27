export type DagScore = 'groen' | 'oranje' | 'rood'
export type HerstellNiveau = 'laag' | 'middel' | 'hoog'

export interface CheckIn {
  id: string
  datum: string // ISO date string
  dagScore: DagScore
  spanningNiveau: number // 1-10
  herstelbehoefte: HerstellNiveau
  bijzondereMelding: boolean
  impactScore?: number // 1-5, alleen bij bijzondere melding
  notitie?: string
  buddySuggestieGeaccepteerd?: boolean
}

export interface GebruikersProfiel {
  naam: string
  dienstnummer?: string
}
