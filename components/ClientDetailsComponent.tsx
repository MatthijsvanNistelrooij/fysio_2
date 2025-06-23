/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useEffect } from "react"

import { Client } from "@/lib/types"
import { getCurrentUser } from "@/lib/actions/user.actions"

import { useAtom } from "jotai"
import {
  savedImageAtom,
  selectedPetAtom,
  localClientAtom,
  selectedAppointmentAtom,
  userAtom,
  addPetAtom,
} from "../lib/store"

import CustomContainer from "./CutomContainer"
import PetInfo from "./PetInfo"
import Info from "./Info"
import AddPet from "./AddPet"
import AddAppointment from "./AddAppointment"
import Pets from "./Pets"
import Appointments from "./Appointments"
import SelectedAppointment from "./SelectedAppointment"

export default function ClientDetailsComponent({ client }: { client: Client }) {
  const [, setSavedImage] = useAtom(savedImageAtom)
  const [localClient, setLocalClient] = useAtom(localClientAtom)

  const [selectedAppointment] = useAtom(selectedAppointmentAtom)
  const [user, setUser] = useAtom(userAtom)
  const [, setAddPet] = useAtom(addPetAtom)

  const [selectedPet] = useAtom(selectedPetAtom)

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

  console.log(localClient)

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
          {selectedPet && <AddAppointment />}
          <Pets client={client} />
        </div>

        <div className="lg:col-span-4">
          <div className="flex flex-col justify-start gap-2">
            {selectedPet && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-4 lg:col-span-3">
                    <PetInfo />
                  </div>
                  <div className="col-span-4 lg:col-span-1">
                    <Appointments />
                  </div>
                </div>

                <SelectedAppointment />
              </>
            )}
          </div>
        </div>
      </div>
    </CustomContainer>
  )
}
