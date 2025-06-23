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
import { Button } from "./ui/button"
import { CalendarRange, Plus, X } from "lucide-react"
import { Appointment } from "@/lib/types"
import CreateAppointmentForm from "./CreateAppointmentForm"
import {
  addAppointmentToPet,
  createAppointment,
} from "@/lib/actions/appointment.actions"
import { toast } from "sonner"
import InfoCard from "./InfoCard"

const AddAppointment = () => {
  const [addAppointment, setAddAppointment] = useAtom(addAppointmentAtom)
  const [, setSelectedAppointment] = useAtom(selectedAppointmentAtom)
  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)
  const [, setLocalClient] = useAtom(localClientAtom)
  const [, setOpenAppointment] = useAtom(openAppointmentAtom)
  const [user] = useAtom(userAtom)

  const handleToggleAddAppointment = () => {
    setAddAppointment(true)
    setOpenAppointment(false)
  }

  const handleCreateAppointment = async (
    petId: string,
    userId: string,
    data: Appointment
  ) => {
    try {
      const appointment = await createAppointment(petId, {
        ...data,
        date: data.date.toISOString(),
      })

      await addAppointmentToPet(petId, appointment.$id)

      const cleanAppointment: Appointment = {
        $id: appointment.$id,
        date: new Date(appointment.date),
        treatment: appointment.treatment,
        description: appointment.description,
        petId: appointment.petId,
        userId: appointment.userId,
        type: appointment.type,
      }

      // Set selected appointment here
      setSelectedAppointment(cleanAppointment)
      setOpenAppointment(true)
      // Update selected pet with new appointment
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
      setAddAppointment((prev) => !prev)
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast.error("Failed to create appointment.")
    }
  }

  return (
    <>
      <div>
        {!addAppointment ? (
          <InfoCard>
            <div className="w-full flex justify-center">
              <Button
                onClick={() => handleToggleAddAppointment()}
                className="bg-white hover:bg-[#e9edf3] text-gray-800 cursor-pointer w-full"
              >
                Add Appointment
                <Plus />
                <CalendarRange size={14} className="mr-2" />
              </Button>
            </div>
          </InfoCard>
        ) : (
          <InfoCard
            title="Add Appointment"
            action={
              <Button
                onClick={() => setAddAppointment(false)}
                className="bg-white hover:bg-[#e9edf3] cursor-pointer text-gray-800"
              >
                <X />
              </Button>
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
        )}
      </div>
    </>
  )
}

export default AddAppointment
