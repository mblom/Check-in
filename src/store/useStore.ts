import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CheckIn, GebruikersProfiel } from '../types'
import { demoCheckIns } from '../data/demoData'

interface AppState {
  profiel: GebruikersProfiel | null
  checkIns: CheckIn[]
  huidigScherm: 'welkom' | 'checkin' | 'resultaat' | 'dashboard' | 'inzichten'
  huidigCheckin: Partial<CheckIn> | null
  demoGeladen: boolean
  promptAfgewezenOp: string | null // ISO-datum waarop de auto-prompt is weggeklikt

  setProfiel: (profiel: GebruikersProfiel) => void
  navigeerNaar: (scherm: AppState['huidigScherm']) => void
  startNieuweCheckin: () => void
  updateCheckin: (data: Partial<CheckIn>) => void
  slaCheckinOp: () => void
  laadDemoData: () => void
  wijsPromptAf: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profiel: null,
      checkIns: [],
      huidigScherm: 'welkom',
      huidigCheckin: null,
      demoGeladen: false,
      promptAfgewezenOp: null,

      setProfiel: (profiel) => set({ profiel, huidigScherm: 'dashboard' }),

      navigeerNaar: (scherm) => set({ huidigScherm: scherm }),

      startNieuweCheckin: () =>
        set({
          huidigScherm: 'checkin',
          huidigCheckin: { id: crypto.randomUUID(), datum: new Date().toISOString().split('T')[0] },
        }),

      updateCheckin: (data) =>
        set((state) => ({
          huidigCheckin: { ...state.huidigCheckin, ...data },
        })),

      slaCheckinOp: () => {
        const { huidigCheckin, checkIns } = get()
        if (!huidigCheckin) return
        const nieuw = huidigCheckin as CheckIn
        set({
          checkIns: [...checkIns, nieuw],
          huidigScherm: 'resultaat',
        })
      },

      laadDemoData: () => {
        const { demoGeladen } = get()
        if (demoGeladen) return
        set({ checkIns: demoCheckIns, demoGeladen: true })
      },

      wijsPromptAf: () =>
        set({ promptAfgewezenOp: new Date().toISOString().split('T')[0] }),
    }),
    {
      name: 'checkin-app-storage',
      partialize: (state) => ({
        profiel: state.profiel,
        checkIns: state.checkIns,
        demoGeladen: state.demoGeladen,
        promptAfgewezenOp: state.promptAfgewezenOp,
      }),
    }
  )
)
