"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Edit, Plus, Trash, X } from "lucide-react"
import { deletePet, updatePet } from "@/lib/pet.actions"
import {
  addAppointmentToPet,
  createAppointment,
} from "@/lib/appointment.actions"

import PetForm from "./PetForm"
import CreateAppointmentForm from "./CreateAppointmentForm"
import { toast } from "sonner"
import { Appointment, Pet, User } from "@/types"
import { getCurrentUser } from "@/lib/user.actions"
import { Button } from "./ui/button"

export default function PetDetailsComponent({
  pet,
  appointments,
}: {
  pet: Pet
  appointments: Appointment[]
}) {
  const router = useRouter()
  const [edit, setEdit] = useState(false)
  const [addAppointment, setAddAppointment] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    )
    if (!confirmDelete) return

    try {
      await deletePet(id)
      toast.success("Pet deleted successfully!")
      router.push("/pets")
    } catch (error) {
      console.error("Error deleting pet:", error)
      toast.success("Failed to delete pet.")
    }
  }

  const handleEditToggle = () => {
    setEdit((prev) => !prev)
  }

  const handleUpdate = async (data: Pet) => {
    try {
      await updatePet(pet.$id, data)
      toast.success("Pet info updated successfully!")
      setEdit(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating pet:", error)
      toast.error("Failed to update pet.")
    }
  }

  const handleToggleAddAppointment = () => {
    setAddAppointment((prev) => !prev)
  }

  const handleCreate = async (
    petId: string,
    userId: string,
    data: Appointment
  ) => {
    console.log(data)
    try {
      const appointment = await createAppointment(petId, {
        ...data,
        date: data.date.toISOString(),
      })

      await addAppointmentToPet(petId, appointment.$id)

      toast.success("Appointment added successfully!")
      setAddAppointment((prev) => !prev)
      router.refresh()
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast.error("Failed to create appointment.")
    }
  }

  if (edit) {
    return (
      <div className="min-h-screen flex justify-center bg-gray-50">
        <div className="p-5 max-w-7xl w-full rounded-3xl">
          <PetForm
            initialData={pet}
            onSubmit={handleUpdate}
            handleClose={handleEditToggle}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-center bg-gray-50">
        <div className="max-w-7xl w-full rounded m-5 bg-white shadow-xl">
          <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium flex justify-between items-center">
            <span>{pet.name}</span>
            <Link href={`/clients`}>
              <X className="cursor-pointer text-gray-400 hover:text-gray-200" />
            </Link>
          </div>
          <div className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Name:</p>
                  <p className="text-base mb-4">{pet?.name || "N/A"}</p>
                  <p className="text-sm font-medium mb-1">Type:</p>
                  <p className="text-base mb-4">{pet?.type || "N/A"}</p>
                  <p className="text-sm font-medium mb-1">Breed:</p>
                  <p className="text-base mb-4">{pet?.breed || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Age:</p>
                  <p className="text-base mb-4">{pet?.age || "N/A"}</p>
                  <p className="text-sm font-medium mb-1">Description:</p>
                  <p className="text-base mb-4">{pet?.description || "N/A"}</p>
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-base mb-4">{pet?.notes || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end p-5 gap-2">
            <Button
              onClick={handleEditToggle}
              className="bg-white hover:bg-gray-100 text-gray-800 cursor-pointer"
            >
              <Edit size={18} />
            </Button>

            <Button
              onClick={() => handleDelete(pet.$id)}
              className="bg-white hover:bg-gray-100 text-gray-800 cursor-pointer"
            >
              <Trash size={18} />
            </Button>
          </div>
          <div className="border-t p-5">
            {addAppointment && user ? (
              <div className="">
                <div className="bg-gray-800 text-sm font-medium mb-1 text-white p-2 flex justify-between rounded-t mt-5 px-4">
                  Add New Appointment
                  <X
                    onClick={() => handleToggleAddAppointment()}
                    className="cursor-pointer text-gray-400 hover:text-gray-200"
                  />
                </div>
                <CreateAppointmentForm
                  userId={user.$id}
                  petId={pet.$id}
                  onSubmit={(data) => handleCreate(pet.$id, pet.ownerId, data)}
                />
              </div>
            ) : (
              <div>
                {Array.isArray(appointments) && appointments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    <div
                      onClick={() => handleToggleAddAppointment()}
                      className="cursor-pointer rounded shadow hover:shadow-md hover:bg-gray-100 transition-shadow bg-white text-sm"
                    >
                      <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium">
                        Add New Appointment
                      </div>
                      <div className="flex justify-center p-5">
                        <Plus className="cursor-pointer text-gray-400 hover:text-gray-800" />{" "}
                      </div>
                    </div>
                    {appointments.map(
                      (appointment: Appointment, index: number) => (
                        <Link
                          key={appointment.$id || index}
                          href={`/appointments/${appointment.$id}`}
                          className="block rounded shadow hover:shadow-md transition-shadow bg-white text-sm"
                        >
                          <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium">
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="p-4 space-y-1">
                            <p className="text-gray-800 font-semibold">
                              Description: {appointment.description}
                            </p>
                            <p className="text-gray-500 font-light">
                              Treatment: {appointment.treatment}
                            </p>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500"></p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
