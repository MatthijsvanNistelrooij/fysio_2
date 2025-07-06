import React from "react"
import { useAtom } from "jotai"
import {
  addAppointmentAtom,
  localClientAtom,
  openAppointmentAtom,
  selectedAppointmentAtom,
  selectedPetAtom,
  userAtom,
} from "@/lib/store"
import { X } from "lucide-react"
import { Appointment } from "@/lib/types"
import CreateAppointmentForm from "./CreateAppointmentForm"

import { toast } from "sonner"
import InfoCard from "./InfoCard"
import CustomButton from "./shared/CustomButton"

const AddAppointment = () => {
  const [, setAddAppointment] = useAtom(addAppointmentAtom)
  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)
  const [, setLocalClient] = useAtom(localClientAtom)
  const [user] = useAtom(userAtom)

  const [, setSelectedAppointment] = useAtom(selectedAppointmentAtom)

  const [, setOpenAppointment] = useAtom(openAppointmentAtom)

  const handleCreateAppointment = async (
    petId: string,
    userId: string,
    data: Appointment
  ) => {
    try {
      const response = await fetch(`/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petId,
          userId,
          description: data.description,
          treatment: data.treatment,
          date: data.date.toISOString(),
          type: data.type,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create appointment")
      }

      const appointment = await response.json()

      const cleanAppointment: Appointment = {
        $id: appointment.$id,
        date: new Date(appointment.date),
        treatment: appointment.treatment,
        description: appointment.description,
        petId: appointment.petId,
        userId: appointment.userId,
        type: appointment.type,
      }

      // Zet hier jouw state updates zoals in jouw component:
      setSelectedAppointment(cleanAppointment)
      setOpenAppointment(true)

      setSelectedPet((prevPet) => {
        if (!prevPet) return null
        return {
          ...prevPet,
          appointments: [...prevPet.appointments, cleanAppointment],
        }
      })

      setLocalClient((prevClient) => {
        if (!prevClient) return prevClient
        return {
          ...prevClient,
          pets: prevClient.pets.map((pet) =>
            pet.$id === petId
              ? {
                  ...pet,
                  appointments: [...pet.appointments, cleanAppointment],
                }
              : pet
          ),
        }
      })

      toast.success("Appointment added successfully!")
      setAddAppointment(false)
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast.error("Failed to create appointment.")
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <InfoCard
        title="Add Appointment"
        action={
          <CustomButton onClick={() => setAddAppointment(false)}>
            <X />
          </CustomButton>

          // <Button
          //   onClick={() => setAddAppointment(false)}

          // >

          // </Button>
        }
      >
        <CreateAppointmentForm
          userId={user?.$id || ""}
          petId={selectedPet?.$id || ""}
          onSubmit={(data) =>
            handleCreateAppointment(
              selectedPet?.$id || "",
              selectedPet?.ownerId || "",
              data
            )
          }
        />
      </InfoCard>
    </div>
  )
}

export default AddAppointment
