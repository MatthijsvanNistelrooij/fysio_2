"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import DetailsCard from "./DetailsCard"
import { Button } from "./ui/button"
import { ArrowLeftCircle, Plus, X } from "lucide-react"
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
        <div className="main-container p-10 bg-white max-w-6xl w-full border rounded-3xl m-10">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold mb-4">Edit Pet</h1>
            <Button
              type="button"
              onClick={handleEditToggle}
              className="hover:bg-gray-700 bg-gray-800 cursor-pointer -mt-2"
            >
              <X />
            </Button>
          </div>

          <PetForm initialData={pet} onSubmit={handleUpdate} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="main-container p-1 bg-white max-w-6xl w-full border rounded-3xl m-10">
        <div className="flex w-full justify-end p-2">
          <Link href={`/clients/${pet.ownerId}`}>
            <ArrowLeftCircle />
          </Link>
        </div>
        <DetailsCard
          title="Pet Info"
          details={[
            { label: "Name", value: pet.name },
            { label: "Type", value: pet.type },
            { label: "Age", value: pet.age ?? "Unknown" },
          ]}
          onEdit={handleEditToggle}
          onDelete={() => handleDelete(pet.$id)}
        />

        <div className="mt-5 p-5">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-2">Appointments</h2>
            <Button
              onClick={() => handleToggleAddAppointment()}
              className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
            >
              <Plus />
            </Button>
          </div>

          {addAppointment && user ? (
            <div>
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
                <p className="text-gray-500">No appointments listed.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
