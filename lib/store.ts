import { atom } from "jotai"
import type { Pet, Client, Appointment, User } from "./types"
import { create } from "zustand"

export const savedImageAtom = atom<string | null>(null)
export const selectedPetAtom = atom<Pet | null>(null)
export const localClientAtom = atom<Client | null>(null)
export const editAppointmentAtom = atom(false)
export const openAppointmentAtom = atom(false)
export const addAppointmentAtom = atom(false)
export const selectedAppointmentAtom = atom<Appointment | null>(null)
export const userAtom = atom<User | null>(null)
export const showCanvasAtom = atom(false)
export const editPetAtom = atom(false)
export const addPetAtom = atom(true)
export const toggleEditAtom = atom(false)
export const loadingAtom = atom(false)
export const searchAtom = atom("")
export const showAtom = atom(false)

export const clientsAtom = atom<Client[] | null>([])

type PetStore = {
  selectedGlobalPet: Pet | null
  setSelectedGlobalPet: (pet: Pet | null) => void
}

export const usePetStore = create<PetStore>((set) => ({
  selectedGlobalPet: null,
  setSelectedGlobalPet: (pet) => set({ selectedGlobalPet: pet }),
}))
