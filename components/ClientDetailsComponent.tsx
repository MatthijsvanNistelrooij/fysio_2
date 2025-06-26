/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useEffect } from "react"

import { Client } from "@/lib/types"

import { useAtom } from "jotai"
import {
  savedImageAtom,
  selectedPetAtom,
  localClientAtom,
  selectedAppointmentAtom,
  userAtom,
  addPetAtom,
  addAppointmentAtom,
  usePetStore,
} from "../lib/store"

import CustomContainer from "./CustomContainer"
import PetInfo from "./PetInfo"
import Info from "./Info"
import AddPet from "./AddPet"
import Pets from "./Pets"
import Appointments from "./Appointments"
import SelectedAppointment from "./SelectedAppointment"
import AddAppointment from "./AddAppointment"
import { getCurrentUser } from "@/lib/appwrite/users"

export default function ClientDetailsComponent({ client }: { client: Client }) {
  const [, setSavedImage] = useAtom(savedImageAtom)
  const [localClient, setLocalClient] = useAtom(localClientAtom)
  const [selectedAppointment] = useAtom(selectedAppointmentAtom)
  const [addAppointMent] = useAtom(addAppointmentAtom)
  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)
  const [user, setUser] = useAtom(userAtom)
  const [, setAddPet] = useAtom(addPetAtom)

  const selectedGlobalPet = usePetStore((state) => state.selectedGlobalPet)

  useEffect(() => {
    if (selectedGlobalPet) {
      setSelectedPet(selectedGlobalPet)
    } else {
      setSelectedPet(null)
    }
  }, [selectedGlobalPet, setSelectedPet])

  useEffect(() => {
    if (localClient?.pets?.length) {
      setAddPet(false)
    } else {
      setAddPet(true)
    }
  }, [localClient])

  useEffect(() => {
    setLocalClient(client)
  }, [client])

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!selectedAppointment) return

    const key = `petDrawing-${selectedAppointment.$id}`
    const saved = localStorage.getItem(key)
    if (saved) {
      const { imageDataUrl } = JSON.parse(saved)
      setSavedImage(imageDataUrl)
    } else {
      setSavedImage(null)
    }
  }, [selectedAppointment])

  if (!user) return

  return (
    <CustomContainer>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
        <div className="md:col-span-1 flex flex-col justify-start gap-2">
          <Info client={client} />
          <AddPet client={client} />
          <Pets client={client} />
        </div>

        <div className="lg:col-span-4">
          <div className="flex flex-col justify-start gap-2">
            {selectedPet && (
              <>
                <PetInfo />
                <Appointments />
                {addAppointMent ? <AddAppointment /> : <SelectedAppointment />}
              </>
            )}
          </div>
        </div>
      </div>
    </CustomContainer>
  )
}
