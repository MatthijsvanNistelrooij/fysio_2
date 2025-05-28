"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { deleteAppointment, updateAppointment } from "@/lib/appointment.actions"
import AppointmentForm from "./AppointmentForm"
import { toast } from "sonner"
import { Trash, X } from "lucide-react"
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
        <div className="main-container max-w-7xl w-full m-5">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold mb-4">Edit Appointment</h1>

            <X onClick={handleEditToggle} className="cursor-pointer" />
          </div>

          <AppointmentForm
            initialData={appointment}
            onSubmit={handleUpdate}
            onClick={handleEditToggle}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="max-w-7xl w-full m-5 border p-5 bg-white rounded-xl shadow-xl">
        HELLO
        <div>Descr : {appointment.description}</div>
        <div>
          Date :{" "}
          {appointment.date
            ? appointment.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"}
        </div>
        <Trash
          onClick={() => handleDelete(appointment.$id)}
          className="cursor-pointer text-gray-400 hover:text-gray-800"
        />
        <Link href={`/pets/${appointment.petId}`}>
          <X className="cursor-pointer text-gray-400 hover:text-gray-800" />
        </Link>
        {/* <DetailsCard
          title="pet"
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
          url={`/pets/${appointment.petId}`}
          onEdit={handleEditToggle}
          onDelete={() => handleDelete(appointment.$id)}
        /> */}
      </div>
    </div>
  )
}
