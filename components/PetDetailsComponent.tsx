"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Edit, Plus, X } from "lucide-react"

import PetForm from "./PetForm"
import CreateAppointmentForm from "./CreateAppointmentForm"
import { toast } from "sonner"
import { Appointment, Pet } from "@/lib/types"
import { Button } from "./ui/button"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import { useUser } from "@/context/UserContextProvider"

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
  const [darkmode] = useAtom(darkmodeAtom)

  const { user } = useUser()

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    )
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Delete failed")

      toast.success("Pet deleted successfully!")
      setEdit(false)
      router.push("/pets")
    } catch (error) {
      console.error("Error deleting pet:", error)
      toast.error("Failed to delete pet.")
    }
  }

  const handleUpdate = async (data: Pet) => {
    try {
      const res = await fetch(`/api/pets/${data.$id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Update failed")

      toast.success("Pet info updated successfully!")
      setEdit(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating pet:", error)
      toast.error("Failed to update pet.")
    }
  }

  const handleCreate = async (
    petId: string,
    userId: string,
    data: Appointment
  ) => {
    try {
      // 1. Create appointment
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString(),
          petId,
          userId,
        }),
      })

      if (!res.ok) throw new Error("Create failed")

      toast.success("Appointment added successfully!")
      setAddAppointment(false)
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
                onClick={() => setEdit((prev) => !prev)}
                className={` ${
                  darkmode
                    ? "bg-white hover:bg-gray-100 text-gray-800"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-700"
                }  cursor-pointer `}
              >
                {edit ? <X /> : <Edit size={18} />}
              </Button>
            </div>
            <div className="flex justify-between p-5 gap-2">
              <div className="w-full">
                {edit ? (
                  <PetForm
                    initialData={pet}
                    onSubmit={handleUpdate}
                    handleClose={() => setEdit(false)}
                    handleDelete={handleDelete}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Name</p>
                      <p className="text-base mb-4">{pet.name || "N/A"}</p>

                      <p className="text-sm font-medium mb-1">Type</p>
                      <p className="text-base mb-4">{pet.type || "N/A"}</p>

                      <p className="text-sm font-medium mb-1">Breed</p>
                      <p className="text-base mb-4">{pet.breed || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Age</p>
                      <p className="text-base mb-4">{pet.age || "N/A"}</p>

                      <p className="text-sm font-medium mb-1">Description</p>
                      <p className="text-base mb-4">
                        {pet.description || "N/A"}
                      </p>

                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-base mb-4">{pet.notes || "N/A"}</p>
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
                  onClick={() => setAddAppointment(false)}
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
                  onClick={() => setAddAppointment(true)}
                  className="cursor-pointer rounded shadow hover:shadow-md transition-shadow bg-white text-sm"
                >
                  <div className="bg-gray-100 px-4 py-2 rounded-t text-sm font-medium">
                    Add New Appointment
                  </div>
                  <div className="flex justify-center p-5">
                    <Plus className="cursor-pointer text-gray-400 hover:text-gray-800" />
                  </div>
                </div>

                {appointments.map((appointment) => (
                  <Link
                    key={appointment.$id}
                    href={`/appointments/${appointment.$id}`}
                    className="block rounded shadow hover:shadow-md transition-shadow bg-white text-sm"
                  >
                    <div className="bg-gray-100 px-4 py-2 rounded-t text-sm font-medium">
                      {new Date(appointment.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
