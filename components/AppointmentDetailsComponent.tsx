"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import DetailsCard from "./DetailsCard"
import { Button } from "./ui/button"
import { deleteAppointment, updateAppointment } from "@/lib/appointment.actions"
import AppointmentForm from "./AppointmentForm"
import { toast } from "sonner"
import { X } from "lucide-react"
import { Appointment } from "@/types"
import Link from "next/link"

export default function AppointmentDetailsComponent({
  appointment,
}: {
  appointment: Appointment
}) {
  const router = useRouter()
  const [edit, setEdit] = useState(false)

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    )
    if (!confirmDelete) return

    try {
      await deleteAppointment(id)
      toast.success("Appointment deleted successfully!")
      router.push("/appointments")
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast.success("Failed to delete appointment.")
    }
  }

  const handleEditToggle = () => {
    setEdit((prev) => !prev)
  }

  const handleUpdate = async (data: Appointment) => {
    try {
      await updateAppointment(appointment.$id, data)
      toast.success("Appointment updated successfully!")
      setEdit(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast.error("Failed to update appointment.")
    }
  }

  if (edit) {
    return (
      <div className="min-h-screen flex justify-center bg-gray-50">
        <div className="main-container p-10 bg-white max-w-5xl w-full border rounded-3xl m-10">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold mb-4">Edit Appointment</h1>
            <Button
              type="button"
              onClick={handleEditToggle}
              className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
            >
              <X />
            </Button>
          </div>

          <AppointmentForm initialData={appointment} onSubmit={handleUpdate} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="main-container p-1 bg-white max-w-5xl w-full border rounded-3xl m-10">
        <div className="flex w-full justify-end p-2">
          <Link href={`/pets/${appointment.petId}`}>
            <X />
          </Link>
        </div>

        <DetailsCard
          title="Appointment Info"
          details={[
            { label: "Description", value: appointment.description },
            { label: "Treatment", value: appointment.treatment },
            {
              label: "Date",
              value: appointment.date
                ? appointment.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A",
            },
          ]}
          onEdit={handleEditToggle}
          onDelete={() => handleDelete(appointment.$id)}
        />
      </div>
    </div>
  )
}
