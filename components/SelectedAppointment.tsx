/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react"
import { Edit, X } from "lucide-react"
import {
  darkmodeAtom,
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

// Helper functions die via fetch naar je API routes gaan:
async function deleteAppointment(id: string) {
  const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Failed to delete appointment")
  }
}

async function updateAppointment(id: string, data: Appointment) {
  const res = await fetch(`/api/appointments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Failed to update appointment")
  }

  return res.json()
}

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
  const [darkmode] = useAtom(darkmodeAtom)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditToggleAppointment = () => {
    setEditAppointment((prev) => !prev)
  }

  const handleDeleteAppointment = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    )
    if (!confirmDelete) return

    setIsDeleting(true)

    // Optimistisch updaten van localClient
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
      setSelectedAppointment(null) // selectie leegmaken na delete

      // Update selectedPet ook lokaal
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
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateAppointment = async (appointment: Appointment) => {
    try {
      const updatedAppointment = await updateAppointment(
        appointment.$id,
        appointment
      )
      toast.success("Appointment updated successfully!")
      setEditAppointment(false)

      setSelectedPet((prevPet) => {
        if (!prevPet) return null

        const updatedAppointments = prevPet.appointments.map((a) =>
          a.$id === updatedAppointment.$id
            ? {
                ...a,
                ...updatedAppointment,
                date: new Date(updatedAppointment.date),
              }
            : a
        )

        return {
          ...prevPet,
          appointments: updatedAppointments,
        }
      })

      setSelectedAppointment({
        ...updatedAppointment,
        date: new Date(updatedAppointment.date),
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

  if (isDeleting) {
    return (
      <div className="flex justify-center items-center p-5 text-gray-500">
        Deleting appointment...
      </div>
    )
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
                  className={` ${
                    darkmode
                      ? "bg-white hover:bg-gray-100 text-gray-800"
                      : "bg-gray-600 text-gray-200 hover:bg-gray-700"
                  }  cursor-pointer `}
                >
                  {editAppointment ? <X /> : <Edit size={20} />}
                </Button>
              }
            >
              <div className="flex flex-col lg:flex-row pb-2 gap-6 p-1">
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
                    className={` ${
                      darkmode
                        ? "bg-white hover:bg-gray-100 text-gray-800"
                        : "bg-gray-600 text-gray-200 hover:bg-gray-700"
                    }  cursor-pointer `}
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
