"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Edit, Plus, X } from "lucide-react"
import { deletePet, updatePet } from "@/lib/actions/pet.actions"
import {
  addAppointmentToPet,
  createAppointment,
} from "@/lib/actions/appointment.actions"

import PetForm from "./PetForm"
import CreateAppointmentForm from "./CreateAppointmentForm"
import { toast } from "sonner"
import { Appointment, Pet, User } from "@/lib/types"
import { getCurrentUser } from "@/lib/actions/user.actions"
import { Button } from "./ui/button"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"

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
  const [darkmode] = useAtom(darkmodeAtom)

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

  return (
    <div className="min-h-screen">
      <div className="flex justify-center">
        <div className="w-full rounded m-5 bg-white shadow-xl">
          <div className="bg-gray-100 px-4 p-2 rounded-t text-sm font-medium flex justify-between items-center">
            {pet.name}
            <Link href={`/clients/${pet.ownerId}`}>
              <X
                size={18}
                className="cursor-pointer text-gray-400 hover:text-gray-800"
              />
            </Link>
          </div>
          <div className="p-1">
            <div className="flex justify-end p-5 pb-0">
              <Button
                onClick={handleEditToggle}
                className={` ${
                  darkmode
                    ? "bg-white hover:bg-gray-100 text-gray-800"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-700"
                }  cursor-pointer `}
              >
                {edit ? <X /> : <Edit size={18} />} dd
              </Button>
            </div>
            <div className="flex justify-between p-5 gap-2">
              <div className="w-full">
                {edit ? (
                  <PetForm
                    initialData={pet}
                    onSubmit={handleUpdate}
                    handleClose={handleEditToggle}
                    handleDelete={handleDelete}
                  />
                ) : (
                  <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-1">Name</p>
                        <p className="text-base mb-4">{pet?.name || "N/A"}</p>

                        <p className="text-sm font-medium mb-1">Type</p>
                        <p className="text-base mb-4">{pet?.type || "N/A"}</p>

                        <p className="text-sm font-medium mb-1">Breed</p>
                        <p className="text-base mb-4">{pet?.breed || "N/A"}</p>
                      </div>

                      <div className="">
                        <p className="text-sm font-medium mb-1">Age</p>
                        <p className="text-base mb-4">{pet?.age || "N/A"}</p>
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-base mb-4">
                          {pet?.description || "N/A"}
                        </p>

                        <p className="text-sm font-medium mb-1">Notes</p>
                        <p className="text-base mb-4">{pet?.notes || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-0 p-5">
        <div className="w-full rounded">
          {addAppointment && user ? (
            <div className="rounded">
              <div className="bg-gray-100 text-sm font-medium mb-1 p-2 flex justify-between rounded-t px-4">
                Add New Appointment
                <X
                  size={18}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  onClick={() => handleToggleAddAppointment()}
                  className="cursor-pointer rounded shadow hover:shadow-md transition-shadow bg-white text-sm"
                >
                  <div className="bg-gray-100 px-4 py-2 rounded-t text-sm font-medium">
                    Add New Appointment
                  </div>
                  <div className="flex justify-center p-5">
                    <Plus className="cursor-pointer text-gray-400 hover:text-gray-800" />
                  </div>
                </div>

                {Array.isArray(appointments) && appointments.length > 0 ? (
                  appointments.map(
                    (appointment: Appointment, index: number) => (
                      <Link
                        key={appointment.$id || index}
                        href={`/appointments/${appointment.$id}`}
                        className="block rounded shadow hover:shadow-md transition-shadow bg-white text-sm"
                      >
                        <div className="bg-gray-100 px-4 py-2 rounded-t text-sm font-medium">
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
                  )
                ) : (
                  <p className="text-gray-500 col-span-full" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
