// petStore.ts
import { create } from "zustand"
import type { Pet } from "@/types" // adjust import if needed

type PetStore = {
  selectedPet: Pet | null
  setSelectedPet: (pet: Pet | null) => void
}

export const usePetStore = create<PetStore>((set) => ({
  selectedPet: null,
  setSelectedPet: (pet) => set({ selectedPet: pet }),
}))
