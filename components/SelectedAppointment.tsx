import React from "react"
import { Edit, X } from "lucide-react"
import {
  editAppointmentAtom,
  localClientAtom,
  openAppointmentAtom,
  savedImageAtom,
  selectedAppointmentAtom,
  selectedPetAtom,
  showCanvasAtom,
} from "@/lib/store"
import { useAtom } from "jotai"
import { Appointment } from "@/lib/types"
import {
  deleteAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions"
import { toast } from "sonner"
import AppointmentForm from "./AppointmentForm"
import { Button } from "./ui/button"
import Image from "next/image"
import horse from "../public/horse_1.png"
import dog from "../public/dog.jpg"
import cat from "../public/cat.jpg"

import { PetDrawingCanvas } from "./PetDrawingCanvas"
import InfoCard from "./InfoCard"

type PetType = "Dog" | "Horse" | "Cat" | "Other"

const SelectedAppointment = () => {
  const [selectedAppointment, setSelectedAppointment] = useAtom(
    selectedAppointmentAtom
  )
  const [savedImage, setSavedImage] = useAtom(savedImageAtom)
  const [editAppointment, setEditAppointment] = useAtom(editAppointmentAtom)
  const [openAppointment, setOpenAppointment] = useAtom(openAppointmentAtom)
  const [showCanvas, setShowCanvas] = useAtom(showCanvasAtom)
  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)
  const [, setLocalClient] = useAtom(localClientAtom)

  const handleDeleteAppointment = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    )
    if (!confirmDelete) return

    // Optimistically update localClient
    setLocalClient((prevClient) => {
      if (!prevClient) return null

      return {
        ...prevClient,
        pets: prevClient.pets.map((pet) =>
          pet.$id === selectedAppointment?.petId
            ? {
                ...pet,
                appointments: pet.appointments.filter((a) => a.$id !== id),
              }
            : pet
        ),
      }
    })

    try {
      await deleteAppointment(id)
      toast.success("Appointment deleted successfully!")
      setOpenAppointment(false)
      setEditAppointment(false)

      // Update selectedPet as well
      setSelectedPet((prevPet) => {
        if (!prevPet) return null

        return {
          ...prevPet,
          appointments: prevPet.appointments.filter(
            (app: Appointment) => app.$id !== id
          ),
        }
      })
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast.error("Failed to delete appointment.")
    }
  }

  const handleEditToggleAppointment = () => {
    setEditAppointment((prev) => !prev)
  }

  const handleUpdateAppointment = async (appointment: Appointment) => {
    try {
      await updateAppointment(appointment.$id, appointment)
      toast.success("Appointment updated successfully!")
      setEditAppointment(false)

      // Update selectedPet.appointments array
      setSelectedPet((prevPet) => {
        if (!prevPet) return null

        const updatedAppointments = prevPet.appointments.map((a) =>
          a.$id === appointment.$id
            ? { ...a, ...appointment, date: new Date(appointment.date) }
            : a
        )

        return {
          ...prevPet,
          appointments: updatedAppointments,
        }
      })

      // ✅ Update selectedAppointment
      setSelectedAppointment({
        ...appointment,
        date: new Date(appointment.date),
      })
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast.error("Failed to update appointment.")
    }
  }

  const handleClickCanvas = () => {
    setShowCanvas((prev) => !prev)
  }

  const handleSave = ({
    imageDataUrl,
    drawingJson,
  }: {
    imageDataUrl: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    drawingJson: any
  }) => {
    if (!selectedAppointment) return

    const key = `petDrawing-${selectedAppointment.$id}`

    localStorage.setItem(
      key,
      JSON.stringify({
        imageDataUrl,
        drawingJson,
        selectedAppointment: selectedAppointment.$id,
      })
    )

    setSavedImage(imageDataUrl)
    setShowCanvas(false)
  }

  const getPetImage = (type: PetType | undefined) => {
    switch (type) {
      case "Dog":
        return dog
      case "Cat":
        return cat
      case "Horse":
        return horse
      default:
        return horse // fallback
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
      {selectedAppointment && openAppointment && (
        <>
          <div className="w-full lg:w-2/3">
            <InfoCard
              title={"Selected Appointment"}
              action={
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.currentTarget.blur()
                    handleEditToggleAppointment()
                  }}
                  className="text-gray-800 bg-white hover:bg-gray-100 cursor-pointer"
                >
                  {editAppointment ? <X /> : <Edit size={20} />}
                </Button>
              }
            >
              <div className="flex flex-col lg:flex-row bg-white pb-2 gap-6 p-1">
                <div className="flex flex-col w-full">
                  <div>
                    {editAppointment ? (
                      <div className="flex justify-between w-full ">
                        <AppointmentForm
                          initialData={selectedAppointment ?? undefined}
                          onSubmit={handleUpdateAppointment}
                          onClick={handleEditToggleAppointment}
                          onDelete={handleDeleteAppointment}
                        />
                      </div>
                    ) : (
                      <div className="flex w-full pb-10">
                        <div className="w-full">
                          <div className="space-y-4">
                            <p className="text-sm font-medium mb-1">Date</p>

                            <p className="text-base">
                              {selectedAppointment?.date
                                ? new Date(
                                    selectedAppointment.date
                                  ).toLocaleDateString("nl-NL")
                                : "N/A"}{" "}
                            </p>
                            <p className="text-sm font-medium">Type</p>

                            <p className="text-base">
                              {selectedAppointment?.type || "N/A"}
                            </p>

                            <p className="text-sm font-medium">Description</p>
                            <p className="text-base mb-4">
                              {selectedAppointment?.description || "N/A"}
                            </p>

                            <p className="text-sm font-medium">Treatment</p>

                            <p className="text-base">
                              {selectedAppointment?.treatment || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
          <div className="w-full">
            <InfoCard>
              <div className="w-full">
                <div className="w-full flex justify-end">
                  <Button
                    className="bg-white hover:bg-gray-100 cursor-pointer text-gray-600"
                    onClick={() => handleClickCanvas()}
                  >
                    {showCanvas ? <X /> : <Edit />}
                  </Button>
                </div>

                {!showCanvas && (
                  <div className="flex justify-center my-10 mr-20 w-full ">
                    <Image
                      width={450}
                      height={250}
                      src={
                        savedImage ||
                        getPetImage(selectedPet?.type as PetType).src
                      }
                      alt="Saved drawing"
                    />
                  </div>
                )}

                {showCanvas && (
                  <div className="p-1 mt-10">
                    <PetDrawingCanvas
                      petType={selectedPet?.type as PetType}
                      onSave={handleSave}
                    />
                  </div>
                )}
              </div>
            </InfoCard>
          </div>
        </>
      )}
    </div>
  )
}

export default SelectedAppointment
